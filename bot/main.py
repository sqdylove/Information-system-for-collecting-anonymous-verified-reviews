from __future__ import annotations

import logging
import os
import re
from typing import Any

from aiogram import Bot, Dispatcher
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.types import Message, ReplyKeyboardRemove

from bot.api_client import ApiClient, ApiError
from bot.rate_limit import ActionRateLimiter
from bot.states import OwnerStates, SenderStates

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

TELEGRAM_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000")
PUBLIC_API_BASE_URL = os.getenv("PUBLIC_API_BASE_URL", "http://localhost:8000")
BOT_USERNAME: str | None = os.getenv("TELEGRAM_BOT_USERNAME")

BANNED_WORDS = {"badword", "спам", "токсично", "оскорбление", "фейк", "мусор"}
FEEDBACK_TEXT_MAX = 500
RATE_LIMIT_MAX = 4
RATE_LIMIT_WINDOW = 60

rate_limiter = ActionRateLimiter(max_requests=RATE_LIMIT_MAX, window_seconds=RATE_LIMIT_WINDOW)

HELP_TEXT = (
    "📌 Информационная система сбора анонимных верифицированных отзывов\n"
    "Суть: сервис для получения контролируемой обратной связи.\n"
    "Основной акцент сделан на анонимности отправителя при сохранении прозрачности для получателя.\n"
    "Фишка: безопасность, фильтрация контента, защита от автоматизированного спама и базовая модерация текста.\n\n"
    "Команды:\n"
    "/start - краткое описание системы\n"
    "/help - помощь и команды\n"
    "/newbox - создать новую UUID-ссылку для сбора отзывов\n"
    "/feedback - отправить отзыв по UUID\n"
    "/owner - просмотреть отзывы по UUID и токену владельца\n"
    "/reply - ответить на отзыв как владелец\n"
    "/cancel - отменить текущую операцию\n"
)

WELCOME_TEXT = (
    "✅ Добро пожаловать! Это Информационная система сбора анонимных верифицированных отзывов.\n\n"
    "Сервис создан для контролируемого получения обратной связи: отправитель остается анонимным, а получатель сохраняет прозрачность.\n"
    "Бэкенд генерирует уникальные UUID-ссылки, управляет приватными сообщениями и защищает от спама.\n\n"
    "Нажмите /help для списка команд."
)


def build_telegram_feedback_link(uuid: str) -> str:
    if BOT_USERNAME:
        return f"https://t.me/{BOT_USERNAME}?start=feedback_{uuid}"
    return f"https://t.me/your_bot_username?start=feedback_{uuid}"


def build_public_feedback_url(uuid: str) -> str:
    return f"{PUBLIC_API_BASE_URL.rstrip('/')}/box/{uuid}/feedback"


def clean_text(value: str) -> str:
    return re.sub(r"[^0-9a-zа-яё]+", " ", value.lower())


def is_text_blocked(text: str) -> bool:
    normalized = clean_text(text)
    words = set(normalized.split())
    return bool(words & BANNED_WORDS)


def format_feedbacks(response: dict[str, Any]) -> str:
    lines = [f"UUID: {response.get('uuid')}", "\nОтзывы:"]
    feedbacks = response.get("feedbacks") or []
    if not feedbacks:
        lines.append("Пока нет отзывов.")
        return "\n".join(lines)

    for fb in feedbacks:
        lines.append("--------------------")
        lines.append(f"ID: {fb.get('id')}")
        lines.append(f"Текст: {fb.get('text')}")
        lines.append(f"Статус: {fb.get('status')}")
        lines.append(f"Дата: {fb.get('created_at')}")
        replies = fb.get("replies", [])
        if replies:
            for reply in replies:
                lines.append(f"  Ответ #{reply.get('id')}: {reply.get('text')}")
        else:
            lines.append("  Ответов нет.")
    return "\n".join(lines)


async def get_api_client() -> ApiClient:
    return ApiClient(API_BASE_URL)


def check_rate(message: Message, action: str) -> bool:
    allowed = rate_limiter.allow(message.from_user.id, action)
    if not allowed:
        logger.warning("Rate limit exceeded for user %s action %s", message.from_user.id, action)
    return allowed


async def cmd_start(message: Message, state: FSMContext) -> None:
    try:
        await state.clear()
        args = (message.text or "").split(maxsplit=1)
        if len(args) == 2 and args[1].startswith("feedback_"):
            uuid = args[1][len("feedback_"):]
            await state.update_data(box_uuid=uuid)
            await state.set_state(SenderStates.awaiting_feedback_text)
            await message.answer(
                f"✉️ Вы перешли по ссылке для анонимного отзыва.\n"
                f"UUID: <code>{uuid}</code>\n"
                "Отправьте текст отзыва (до 500 символов)."
            )
            return

        await message.answer(WELCOME_TEXT)
    except Exception as exc:
        logger.error("Error in cmd_start: %s", exc)
        await message.answer("⚠️ Произошла ошибка. Попробуйте позже.")
        await state.clear()


async def cmd_help(message: Message) -> None:
    try:
        await message.answer(HELP_TEXT)
    except Exception as exc:
        logger.error("Error in cmd_help: %s", exc)
        await message.answer("⚠️ Не удалось отправить справку. Попробуйте позже.")


async def cmd_newbox(message: Message) -> None:
    if not check_rate(message, "newbox"):
        await message.answer("⏱️ Слишком много запросов. Попробуйте через минуту.")
        return

    api = await get_api_client()
    try:
        result = await api.create_box()
        uuid = result.get("uuid")
        owner_token = result.get("owner_token")
        feedback_link = build_telegram_feedback_link(uuid)
        public_url = build_public_feedback_url(uuid)
        await message.answer(
            "✅ Новая UUID-ссылка создана:\n"
            f"UUID: <code>{uuid}</code>\n"
            f"Токен владельца: <code>{owner_token}</code>\n\n"
            "📩 Отправить отзыв через Telegram:\n"
            f"<a href=\"{feedback_link}\">Открыть форму отзыва</a>\n"
            "\n🌐 Прямая ссылка API для отправки отзыва:\n"
            f"<a href=\"{public_url}\">{public_url}</a>\n\n"
            "🔒 Сохраните токен, он необходим для просмотра и ответов на отзывы."
        )
    except ApiError as exc:
        if exc.status_code == 503:
            await message.answer("⚠️ Сервис временно недоступен. Попробуйте через минуту.")
        elif exc.status_code == 504:
            await message.answer("⚠️ Превышено время ожидания. Попробуйте позже.")
        else:
            await message.answer(f"⚠️ Ошибка при создании коробки: {exc.detail or exc.status_code}")
        logger.error("Error in cmd_newbox: %s", exc)
    except Exception as exc:
        logger.error("Unexpected error in cmd_newbox: %s", exc)
        await message.answer("⚠️ Неожиданная ошибка. Попробуйте позже.")


async def cmd_feedback(message: Message, state: FSMContext) -> None:
    try:
        await state.set_state(SenderStates.awaiting_box_uuid)
        await message.answer(
            "✉️ Введите UUID коробки, в которую хотите отправить анонимный отзыв.\n"
            "Или отправьте /cancel для отмены."
        )
    except Exception as exc:
        logger.error("Error in cmd_feedback: %s", exc)
        await message.answer("⚠️ Произошла ошибка. Попробуйте позже.")


async def process_feedback_uuid(message: Message, state: FSMContext) -> None:
    try:
        await state.update_data(box_uuid=message.text.strip())
        await state.set_state(SenderStates.awaiting_feedback_text)
        await message.answer(
            "Теперь отправьте текст отзыва (максимум 500 символов).\n"
            "Мы применяем базовую фильтрацию контента и защиту от спама."
        )
    except Exception as exc:
        logger.error("Error in process_feedback_uuid: %s", exc)
        await message.answer("⚠️ Произошла ошибка. Попробуйте позже.")
        await state.clear()


async def process_feedback_text(message: Message, state: FSMContext) -> None:
    try:
        data = await state.get_data()
        box_uuid = data.get("box_uuid")
        if not box_uuid:
            await message.answer("Не удалось получить UUID. Попробуйте заново командой /feedback.")
            await state.clear()
            return

        if not check_rate(message, "feedback"):
            await message.answer("Слишком много отзывов за короткий промежуток. Попробуйте позже.")
            await state.clear()
            return

        text = message.text.strip()
        if len(text) > FEEDBACK_TEXT_MAX:
            await message.answer(f"Отзыв слишком длинный. Максимум {FEEDBACK_TEXT_MAX} символов.")
            return

        if is_text_blocked(text):
            await message.answer(
                "Сообщение отклонено из-за подозрительного или запрещенного содержания."
            )
            await state.clear()
            return

        api = await get_api_client()
        try:
            await api.send_feedback(box_uuid, text)
            await message.answer(
                "Спасибо! Ваш отзыв отправлен анонимно.\n"
                "Получатель сможет просмотреть его через владельческий токен."
            )
        except ApiError as exc:
            if exc.status_code == 404:
                await message.answer("Коробка не найдена. Проверьте UUID и попробуйте снова.")
            elif exc.status_code == 400:
                await message.answer("Текст отзыва не прошёл проверку. Измените формулировку и попробуйте снова.")
            elif exc.status_code == 503:
                await message.answer("⚠️ Сервис временно недоступен. Попробуйте через минуту.")
            elif exc.status_code == 504:
                await message.answer("⚠️ Превышено время ожидания. Попробуйте позже.")
            else:
                await message.answer(f"Не удалось отправить отзыв: {exc.detail or exc.status_code}")
            logger.error("API error in process_feedback_text: %s", exc)
        finally:
            await state.clear()
    except Exception as exc:
        logger.error("Unexpected error in process_feedback_text: %s", exc)
        await message.answer("⚠️ Неожиданная ошибка. Попробуйте позже.")
        await state.clear()


async def cmd_owner(message: Message, state: FSMContext) -> None:
    try:
        await state.set_state(OwnerStates.awaiting_box_uuid)
        await message.answer(
            "🔒 Введите UUID коробки, чтобы просмотреть отзывы как владелец.\n"
            "После этого отправьте токен владельца."
        )
    except Exception as exc:
        logger.error("Error in cmd_owner: %s", exc)
        await message.answer("⚠️ Произошла ошибка. Попробуйте позже.")


async def process_owner_uuid(message: Message, state: FSMContext) -> None:
    try:
        await state.update_data(box_uuid=message.text.strip())
        await state.set_state(OwnerStates.awaiting_owner_token)
        await message.answer("Введите токен владельца для доступа к отзывам.")
    except Exception as exc:
        logger.error("Error in process_owner_uuid: %s", exc)
        await message.answer("⚠️ Произошла ошибка. Попробуйте позже.")
        await state.clear()


async def process_owner_token(message: Message, state: FSMContext) -> None:
    try:
        data = await state.get_data()
        box_uuid = data.get("box_uuid")
        token = message.text.strip()
        if not box_uuid:
            await message.answer("Не удалось получить UUID. Попробуйте заново командой /owner.")
            await state.clear()
            return

        api = await get_api_client()
        try:
            result = await api.get_box_feedbacks(box_uuid, token)
            await message.answer(format_feedbacks(result))
        except ApiError as exc:
            if exc.status_code == 403:
                await message.answer("Доступ запрещён. Проверьте токен владельца.")
            elif exc.status_code == 404:
                await message.answer("Коробка не найдена. Проверьте UUID.")
            elif exc.status_code == 503:
                await message.answer("⚠️ Сервис временно недоступен. Попробуйте через минуту.")
            elif exc.status_code == 504:
                await message.answer("⚠️ Превышено время ожидания. Попробуйте позже.")
            else:
                await message.answer(f"Ошибка при получении отзывов: {exc.detail or exc.status_code}")
            logger.error("API error in process_owner_token: %s", exc)
        finally:
            await state.clear()
    except Exception as exc:
        logger.error("Unexpected error in process_owner_token: %s", exc)
        await message.answer("⚠️ Неожиданная ошибка. Попробуйте позже.")
        await state.clear()


async def cmd_reply(message: Message, state: FSMContext) -> None:
    try:
        await state.set_state(OwnerStates.awaiting_reply_feedback_id)
        await message.answer(
            "✍️ Введите ID отзыва, на который хотите ответить.\n"
            "Затем система запросит токен и текст ответа."
        )
    except Exception as exc:
        logger.error("Error in cmd_reply: %s", exc)
        await message.answer("⚠️ Произошла ошибка. Попробуйте позже.")


async def process_reply_feedback_id(message: Message, state: FSMContext) -> None:
    try:
        if not message.text or not message.text.isdigit():
            await message.answer("ID должен быть числом. Попробуйте снова или отмените /cancel.")
            return

        await state.update_data(feedback_id=int(message.text.strip()))
        await state.set_state(OwnerStates.awaiting_reply_text)
        await message.answer(
            "Отправьте токен владельца и текст ответа в формате:\n"
            "TOKEN|Ваш ответ"
        )
    except Exception as exc:
        logger.error("Error in process_reply_feedback_id: %s", exc)
        await message.answer("⚠️ Произошла ошибка. Попробуйте позже.")
        await state.clear()


async def process_reply_text(message: Message, state: FSMContext) -> None:
    try:
        data = await state.get_data()
        feedback_id = data.get("feedback_id")
        if not feedback_id:
            await message.answer("Не удалось получить ID отзыва. Начните заново командой /reply.")
            await state.clear()
            return

        if not message.text or "|" not in message.text:
            await message.answer("Неверный формат. Используйте TOKEN|Ваш ответ.")
            return

        token, text = [part.strip() for part in message.text.split("|", 1)]
        if not token or not text:
            await message.answer("Токен и текст ответа не могут быть пустыми.")
            return

        if len(text) > FEEDBACK_TEXT_MAX:
            await message.answer(f"Ответ слишком длинный. Максимум {FEEDBACK_TEXT_MAX} символов.")
            return

        api = await get_api_client()
        try:
            await api.send_reply(feedback_id, token, text)
            await message.answer("Ответ отправлен. Получатель увидит его в своей панели владельца.")
        except ApiError as exc:
            if exc.status_code == 403:
                await message.answer("Доступ запрещён. Проверьте токен владельца.")
            elif exc.status_code == 404:
                await message.answer("Отзыв или коробка не найдены.")
            elif exc.status_code == 503:
                await message.answer("⚠️ Сервис временно недоступен. Попробуйте через минуту.")
            elif exc.status_code == 504:
                await message.answer("⚠️ Превышено время ожидания. Попробуйте позже.")
            else:
                await message.answer(f"Ошибка при отправке ответа: {exc.detail or exc.status_code}")
            logger.error("API error in process_reply_text: %s", exc)
        finally:
            await state.clear()
    except Exception as exc:
        logger.error("Unexpected error in process_reply_text: %s", exc)
        await message.answer("⚠️ Неожиданная ошибка. Попробуйте позже.")
        await state.clear()


async def cmd_cancel(message: Message, state: FSMContext) -> None:
    try:
        await state.clear()
        await message.answer("❌ Операция отменена.", reply_markup=ReplyKeyboardRemove())
    except Exception as exc:
        logger.error("Error in cmd_cancel: %s", exc)
        try:
            await message.answer("⚠️ Ошибка при отмене операции.")
        except Exception:
            pass


async def unknown_message(message: Message) -> None:
    try:
        await message.answer(
            "🤔 Я не понимаю это сообщение. Используйте /help для списка команд."
        )
    except Exception as exc:
        logger.error("Error in unknown_message: %s", exc)


async def main() -> None:
    if not TELEGRAM_TOKEN:
        logger.error("TELEGRAM_BOT_TOKEN не задан в окружении.")
        return

    bot = Bot(
        token=TELEGRAM_TOKEN,
        parse_mode="HTML",
    )
    global BOT_USERNAME
    try:
        BOT_USERNAME = (await bot.get_me()).username
        logger.info("Bot started with username: %s", BOT_USERNAME)
    except Exception as exc:
        logger.warning("Не удалось получить имя бота: %s", exc)
        BOT_USERNAME = None
    
    storage = MemoryStorage()
    dp = Dispatcher(storage=storage)

    dp.message.register(cmd_start, Command(commands=["start"]))
    dp.message.register(cmd_help, Command(commands=["help"]))
    dp.message.register(cmd_newbox, Command(commands=["newbox"]))
    dp.message.register(cmd_feedback, Command(commands=["feedback"]))
    dp.message.register(process_feedback_uuid, SenderStates.awaiting_box_uuid)
    dp.message.register(process_feedback_text, SenderStates.awaiting_feedback_text)
    dp.message.register(cmd_owner, Command(commands=["owner"]))
    dp.message.register(process_owner_uuid, OwnerStates.awaiting_box_uuid)
    dp.message.register(process_owner_token, OwnerStates.awaiting_owner_token)
    dp.message.register(cmd_reply, Command(commands=["reply"]))
    dp.message.register(process_reply_feedback_id, OwnerStates.awaiting_reply_feedback_id)
    dp.message.register(process_reply_text, OwnerStates.awaiting_reply_text)
    dp.message.register(cmd_cancel, Command(commands=["cancel"]))
    dp.message.register(unknown_message)

    try:
        logger.info("Запуск Telegram бота...")
        await dp.start_polling(bot, allowed_updates=dp.resolve_used_update_types())
    except Exception as exc:
        logger.critical("Critical error in bot polling: %s", exc)
    finally:
        try:
            await bot.session.close()
        except Exception as exc:
            logger.error("Error closing bot session: %s", exc)


if __name__ == "__main__":
    import asyncio

    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Бот остановлен пользователем.")
    except Exception as exc:
        logger.critical("Fatal error: %s", exc)
