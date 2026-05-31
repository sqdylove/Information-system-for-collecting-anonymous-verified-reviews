import { useCallback, useEffect, useState } from "react";
import Button from "../../small/button/button";
import Card from "../../small/card/card";
import Review from "./review/review";
import UUIDLink from "./uuidLink/uuidLink";
import ActivityChart from "./activityChart/activityChart";
import BoxList from "./uuidLink/linkList";
import LatestReviewsCard from "./review/Reviews";

interface AdminPanelProps {
  setAuthToken: (value: string | null) => void;
  setScreen: (value: "main" | "sender" | "recipient") => void; // Добавили проп изменения экрана
}

export default function AdminPanel({ setAuthToken, setScreen }: AdminPanelProps) {
  const [ActiveTab, setActiveTab] = useState<
    "statistics" | "links" | "reviews"
  >("statistics");

  const [totalReviews, setTotalReviews] = useState<number>(1248);
  const [moderatedReviews, setModeratedReviews] = useState<number>(1062);
  const [blockedReviews, setBlockedReviews] = useState<number>(174);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.clear();
    setScreen("main");
    setAuthToken(null);
  };

  return (
    <div className="h-screen p-6 text-white grid grid-cols-[350px_1fr] gap-4 overflow-hidden">
      <Card className="h-full">
        <div className="h-full flex flex-col justify-between">
          <div className="w-full flex flex-col gap-3">
            <Button
              text="Статистика"
              w="full"
              onClick={() => setActiveTab("statistics")}
            />
            <Button
              text="UUID-ссылки"
              w="full"
              onClick={() => setActiveTab("links")}
            />
            <Button
              text="Отзывы"
              w="full"
              onClick={() => setActiveTab("reviews")}
            />
          </div>
          <div>
            <Button text="Выход" w="full" onClick={handleLogout} />
          </div>
        </div>
      </Card>

      {ActiveTab === "statistics" ? (
        <Statistics
          totalReviews={totalReviews}
          setTotalReviews={setTotalReviews}
          moderatedReviews={moderatedReviews}
          setModeratedReviews={setModeratedReviews}
          blockedReviews={blockedReviews}
          setBlockedReviews={setBlockedReviews}
        />
      ) : ActiveTab === "links" ? (
        <Links />
      ) : ActiveTab === "reviews" ? (
        <Reviews />
      ) : null}
    </div>
  );
}

interface StatProps {
  totalReviews: number;
  setTotalReviews?: (value: number) => void;
  moderatedReviews: number;
  setModeratedReviews?: (value: number) => void;
  blockedReviews: number;
  setBlockedReviews?: (value: number) => void;
}

const Statistics = ({
  totalReviews,
  setTotalReviews,
  moderatedReviews,
  setModeratedReviews,
  blockedReviews,
  setBlockedReviews,
}: StatProps) => {
  const [totalReviewsPercent, setTotalReviewsPrecent] = useState<number>(
    (totalReviews * 0.4) / 34
  );
  const [moderatedReviewsPercent, setModeratedReviewsPercent] =
    useState<number>((moderatedReviews * 0.4) / 34);
  const [blockedReviewsPercent, setBlockedReviewsPercent] = useState<number>(
    (blockedReviews * 0.5) / 34
  );
  const [uuidLinks, setUuidLinks] = useState<number>(10);
  const [uuidLinksPercent, setUuidLinksPercent] = useState<number>(5);

  const [clicksCount, setClicksCount] = useState<number>(23);
  const [clicksPercent, setClicksPercent] = useState<number>(12);

  const [lastReviewDate, setLastReviewDate] = useState<string>("24.05.2026");

  return (
    <div className="h-[calc(100vh-3rem)] grid grid-rows-[110px_1fr_280px] gap-4 min-h-0 overflow-hidden">
      <div className="grid grid-cols-[1.2fr_1.4fr_1.2fr_1.2fr_1.4fr_1.8fr] gap-4 w-full min-h-0">
        <Card className="h-full p-2.5 w-auto flex flex-col justify-between items-center overflow-hidden">
          <h2 className="text-xs text-center text-t-muted truncate w-full">
            Всего отзывов
          </h2>
          <h3 className="text-2xl font-bold text-t-blue truncate w-full text-center leading-none">
            {totalReviews.toLocaleString("en-US")}
          </h3>
          <h2 className="text-[11px] text-center text-t-main truncate w-full">
            +{totalReviewsPercent.toFixed(0)}% за неделю
          </h2>
        </Card>

        <Card className="h-full p-2.5 w-auto flex flex-col justify-between items-center overflow-hidden">
          <h2 className="text-xs text-center text-t-muted truncate w-full">
            Прошли модерацию
          </h2>
          <h3 className="text-2xl font-bold text-t-green truncate w-full text-center leading-none">
            {moderatedReviews.toLocaleString("en-US")}
          </h3>
          <h2 className="text-[11px] text-center text-t-main truncate w-full">
            +{moderatedReviewsPercent.toFixed(0)}% от всех
          </h2>
        </Card>

        <Card className="h-full p-2.5 w-auto flex flex-col justify-between items-center overflow-hidden">
          <h2 className="text-xs text-center text-t-muted truncate w-full">
            Заблокировано
          </h2>
          <h3 className="text-2xl font-bold text-t-red truncate w-full text-center leading-none">
            {blockedReviews.toLocaleString("en-US")}
          </h3>
          <h2 className="text-[11px] text-center text-t-main truncate w-full">
            +{blockedReviewsPercent.toFixed(0)}% за неделю
          </h2>
        </Card>

        <Card className="h-full p-2.5 w-auto flex flex-col justify-between items-center overflow-hidden">
          <h2 className="text-xs text-center text-t-muted truncate w-full">
            UUID-ссылок
          </h2>
          <h3 className="text-2xl font-bold text-t-purple truncate w-full text-center leading-none">
            {uuidLinks.toLocaleString("en-US")}
          </h3>
          <h2 className="text-[11px] text-center text-t-main truncate w-full">
            +{uuidLinksPercent.toFixed(0)}% за неделю
          </h2>
        </Card>

        <Card className="h-full p-2.5 w-auto flex flex-col justify-between items-center overflow-hidden">
          <h2 className="text-xs text-center text-t-muted truncate w-full">
            Количество переходов
          </h2>
          <h3 className="text-2xl font-bold text-t-yellow truncate w-full text-center leading-none">
            {clicksCount.toLocaleString("en-US")}
          </h3>
          <h2 className="text-[11px] text-center text-t-main truncate w-full">
            +{clicksPercent.toFixed(0)}% за неделю
          </h2>
        </Card>

        <Card className="h-full p-2.5 w-auto flex flex-col justify-between items-center overflow-hidden">
          <h2 className="text-xs text-center text-t-muted truncate w-full">
            Дата последнего отзыва
          </h2>
          <h3 className="text-2xl font-bold text-t-orange truncate w-full text-center leading-none py-1">
            {lastReviewDate}
          </h3>
          <div className="h-2.75" />
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4 min-h-0">
        <Card className="h-full min-h-0 flex flex-col p-4! overflow-hidden">
          <div className="flex flex-row justify-between mb-2 shrink-0">
            <h2 className="text-[16px] font-normal">Последние отзывы</h2>
            <p className="text-t-muted text-sm cursor-pointer hover:text-white transition-colors">
              Смотреть все
            </p>
          </div>

          <LatestReviewsCard />
        </Card>

        <Card className="h-full min-h-0 flex flex-col p-4! overflow-hidden">
          <div className="flex flex-row justify-between mb-2 shrink-0">
            <h2 className="text-[16px] font-normal">UUID ссылки</h2>
            <p className="text-t-muted text-sm cursor-pointer hover:text-white transition-colors">
              Смотреть все
            </p>
          </div>
          <BoxList />
        </Card>
      </div>
      <div className="grid grid-cols-[1.5fr_1fr] gap-4 min-h-0 overflow-hidden h-full">
        <ActivityChart />
        <Card className="h-full flex flex-col justify-between p-4! overflow-hidden">
          <h2 className="text-[16px] font-normal mb-2 shrink-0">
            Состояние системы
          </h2>
          <div className="flex-1 flex flex-col justify-between border border-ui-border/50 rounded-xl bg-zinc-950/20 min-h-0 overflow-hidden">
            {[
              { name: "API сервис", status: "Работает", ok: true },
              { name: "База данных", status: "Не работает", ok: false },
              { name: "Телеграмм бот", status: "Работает", ok: true },
              { name: "Сайт пользователя", status: "Работает", ok: true },
              { name: "Сайт получателя", status: "Работает", ok: true },
            ].map((service, index, arr) => (
              <div
                key={service.name}
                className={`flex flex-row justify-between items-center px-4 text-sm flex-1
                    ${index !== arr.length - 1 ? "border-b border-ui-border/40" : ""}`}
              >
                <span className="text-t-main truncate mr-2">
                  {service.name}
                </span>
                <span
                  className={`font-medium shrink-0 ${service.ok ? "text-t-green" : "text-t-red"}`}
                >
                  {service.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
interface BoxData {
  id?: string | number;
  uuid?: string;
  clicks?: string | number;
  date?: string;
  isActive?: string;
}

interface FeedbackData {
  id?: string | number;
  text?: string;
  box_uuid?: string;
  created_at?: string;
}

export const Links = () => {
  const [boxes, setBoxes] = useState<BoxData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const fetchBoxes = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Токен авторизации не найден");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("http://localhost:8000/auth/my-boxes", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Не удалось загрузить UUID-ссылки");
      }

      const data = await response.json();
      setBoxes(data.boxes || []);
    } catch (err: any) {
      console.error("Ошибка при получении боксов:", err);
      setError(err.message || "Ошибка соединения с сервером");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCreateLink = async () => {
    const token = localStorage.getItem("token");
    if (!token || isCreating) return;

    try {
      setIsCreating(true);
      // Предполагается стандартный эндпоинт POST /box для генерации новой ссылки
      const response = await fetch("http://localhost:8000/box", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Не удалось создать ссылку");
      }

      // После успешного создания принудительно обновляем весь список
      await fetchBoxes();
    } catch (err: any) {
      console.error("Ошибка создания ссылки:", err);
      alert(err.message || "Не удалось создать ссылку");
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    fetchBoxes();
  }, [fetchBoxes]);

  return (
    <div className="h-full">
      <div className="w-full flex flex-row justify-end gap-6 mb-3">
        <Button
          className="pl-16 pr-16"
          text={isLoading ? "Загрузка..." : "Обновить"}
          onClick={fetchBoxes}
        />
        <Button
          className="pl-16 pr-16"
          text={isCreating ? "Создание..." : "Создать ссылку"}
          onClick={handleCreateLink}
        />
      </div>

      <div className="h-[calc(100vh-8rem)] flex flex-col gap-4 min-h-0 overflow-y-auto flex-1 pr-1 custom-scroll">
        {isLoading && boxes.length === 0 ? (
          <div className="text-t-muted text-sm p-4">Загрузка списка ссылок...</div>
        ) : error ? (
          <div className="text-t-red text-sm p-4">{error}</div>
        ) : boxes.length === 0 ? (
          <div className="text-t-muted text-sm p-4">У вас еще нет созданных UUID-ссылок</div>
        ) : (
          boxes.map((box, index) => (
            <UUIDLink
              key={box.id || index}
              clicks={box.clicks !== undefined ? box.clicks.toString() : "0"}
              UUID={box.uuid || "Неизвестный UUID"}
              date={box.date || "24.05.2026"}
              isActive={box.isActive || "Активна"}
              UUIDScreen
            />
          ))
        )}
      </div>
    </div>
  );
};

export const Reviews = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedbacks = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Токен авторизации не найден");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("http://localhost:8000/auth/my-feedbacks", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Не удалось загрузить отзывы");
      }

      const data = await response.json();
      setFeedbacks(data.feedbacks || []);
    } catch (err: any) {
      console.error("Ошибка при получении отзывов:", err);
      setError(err.message || "Ошибка соединения с сервером");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  return (
    <div className="h-full">
      <div className="w-full flex flex-row justify-end gap-6 mb-3">
        <Button
          className="pl-16 pr-16"
          text={isLoading ? "Загрузка..." : "Обновить"}
          onClick={fetchFeedbacks}
        />
      </div>

      <div className="h-[calc(100vh-8rem)] flex flex-col gap-4 min-h-0 overflow-y-auto flex-1 pr-1 custom-scroll">
        {isLoading && feedbacks.length === 0 ? (
          <div className="text-t-muted text-sm p-4">Загрузка отзывов...</div>
        ) : error ? (
          <div className="text-t-red text-sm p-4">{error}</div>
        ) : feedbacks.length === 0 ? (
          <div className="text-t-muted text-sm p-4">У вас еще нет полученных отзывов</div>
        ) : (
          feedbacks.map((item, index) => (
            <Review
              key={item.id || index}
              title={item.text || "Без текста"}
              UUID={item.box_uuid || "Неизвестный UUID"}
              timeAgo={item.created_at || "Недавно"}
            />
          ))
        )}
      </div>
    </div>
  );
};
