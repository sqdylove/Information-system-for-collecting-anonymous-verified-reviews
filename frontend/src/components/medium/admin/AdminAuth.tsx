import { useState } from "react";
import Button from "../../small/button/button";
import Card from "../../small/card/card";
import Input from "../../small/input/input";
interface AuthCardProps {
  isAuth?: boolean;
  setIsAuth: (value: boolean) => void;
  screen?: string;
  setScreen: (value: "main" | "sender" | "recipient") => void
}
export default function AuthCard({ setIsAuth, setScreen }: AuthCardProps) {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  return (
    <div className="h-screen p-6 flex text-white items-center justify-center">
      {isLogin ? (
        <Login setScreen={setScreen} setIsLogin={setIsLogin} setIsAuth={setIsAuth} />
      ) : (
        <Registration setScreen={setScreen} setIsLogin={setIsLogin} setIsAuth={setIsAuth} />
      )}
    </div>
  );
}
interface CardProps {
  setIsLogin: (value: boolean) => void;
  setIsAuth: (value: boolean) => void;
  screen?: string;
  setScreen: (value: "main" | "sender" | "recipient") => void
}
const isElectron =
  typeof window !== "undefined" &&
  navigator.userAgent.toLowerCase().includes("electron");
const Login = ({ setIsLogin, setIsAuth, setScreen }: CardProps) => {

  return (
    <Card className="w-2xl h-auto flex flex-col gap-4">
      <div className="flex flex-row justify-between">
        <div className="space-y-1">
          <h1 className="text-[19px]">Авторизация получателя</h1>
          <p className="text-sm text-t-muted">Введите логин и пароль</p>
        </div>
        {
          isElectron ? null : (
            <button
              onClick={() => setScreen('main')}
              className="p-2 max-h-8 flex items-center border border-ui-border rounded-lg text-xs text-t-muted hover:text-white hover:bg-zinc-900 transition-all cursor-pointer select-none"
              title="Вернуться назад"
            >
              <svg
                xmlns="http://w3.org"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              <span>Назад</span>
            </button>
          )
        }
      </div>
      <Input w="full" placeholder="Введите логин" />
      <Input w="full" placeholder="Введите пароль" />
      <Button text="Продолжить" w="full" onClick={() => setIsAuth(true)} />
      <p
        className="text-sm text-t-muted text-center cursor-pointer hover:text-t-muted/50"
        onClick={() => setIsLogin(false)}
      >
        Нет аккаунта
      </p>
    </Card>
  );
};
const Registration = ({ setIsLogin, setIsAuth, setScreen }: CardProps) => {
  return (
    <Card className="w-2xl h-auto flex flex-col gap-4">
      <div className="flex flex-row justify-between">
        <div className="space-y-1">
          <h1 className="text-[19px]">Регистрация получателя</h1>
          <p className="text-sm text-t-muted">Введите логин и пароль</p>
        </div>
        {
          isElectron ? null : (
            <button
              onClick={() => setScreen('main')}
              className="p-2 max-h-8 flex items-center border border-ui-border rounded-lg text-xs text-t-muted hover:text-white hover:bg-zinc-900 transition-all cursor-pointer select-none"
              title="Вернуться назад"
            >
              <svg
                xmlns="http://w3.org"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              <span>Назад</span>
            </button>
          )
        }
      </div>
      <Input w="full" placeholder="Введите логин" />
      <Input w="full" placeholder="Введите пароль" />
      <Input w="full" placeholder="Введите пароль повторно" />
      <Button text="Продолжить" w="full" onClick={() => setIsAuth(true)} />
      <p
        className="text-sm text-t-muted text-center cursor-pointer hover:text-t-muted/50"
        onClick={() => setIsLogin(true)}
      >
        Есть аккаунт
      </p>
    </Card>
  );
};
