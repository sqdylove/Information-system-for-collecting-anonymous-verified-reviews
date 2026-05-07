import re

BAD_WORDS = ["badword"]


def validate_text(text: str):
    if not isinstance(text, str) or not text.strip():
        raise ValueError("Text is required")

    text = text.strip()
    if len(text) > 500:
        raise ValueError("Text is too long")

    for word in BAD_WORDS:
        if word in text.lower():
            raise ValueError("Bad word detected")

    # удаление ссылок
    text = re.sub(r"http\\S+", "", text)
    return text