import { useEffect, useState } from "react";
import AdminScreen from "./components/screens/AdminScreen";
import MainScreen from "./components/screens/mainScreen";
import AuthCard from "./components/medium/admin/AdminAuth";

interface User {
  username: string;
  token?: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [screen, setScreen] = useState<"main" | "sender" | "recipient">("main");
  
  // Добавляем локальный стейт для токена, чтобы React мгновенно реагировал на логин
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem("token"); // Ищем строго по ключу "token"
  });

  const [UUID, setUUID] = useState<string | null>(() => {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get("uuid") || null;
  });

  const isElectron =
    typeof window !== "undefined" &&
    navigator.userAgent.toLowerCase().includes("electron");

  useEffect(() => {
    const autoLogin = async () => {
      // Ищем токен строго по тому ключу, куда его сохраняют loginFunc и registerFunc
      const storedToken = localStorage.getItem("token");
      console.log("Токен из localStorage при перезагрузке:", storedToken);

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/auth/me", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setAuthToken(storedToken); // Синхронизируем стейт
        } else {
          // Если токен протух на бэкенде — чистим память
          localStorage.removeItem("token");
          setAuthToken(null);
        }
      } catch (error) {
        console.error("Ошибка автологина:", error);
      } finally {
        setIsLoading(false);
      }
    };

    autoLogin();
  }, []);

  if (isLoading) {
    return <div className="text-white">Загрузка сессии...</div>;
  }

  // ЕСЛИ ПРИЛОЖЕНИЕ ЗАПУЩЕНО В ELECTRON (Десктопная админка)
  if (isElectron) {
    // Проверяем наличие токена. Если его нет — показываем окно входа
    if (!authToken) {
      return (
        <AuthCard 
          setIsAuth={(val) => {
            if (val) {
              // Когда loginFunc запишет токен в localStorage, обновляем стейт в App
              setAuthToken(localStorage.getItem("token"));
            }
          }} 
          setScreen={setScreen} 
        />
      );
    }
    // Если токен есть — пускаем в панель управления
    return <AdminScreen setScreen={setScreen} />;
  } 
  
  // ЕСЛИ ЭТО ОБЫЧНЫЙ САЙТ
  return (
    <MainScreen 
      UUID={UUID} 
      screen={screen} 
      setScreen={setScreen} 
      setUUID={setUUID} 
    />
  );
}
