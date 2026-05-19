import { useState } from "react";
import Button from "../../small/button/button";
import Card from "../../small/card/card";
import Input from "../../small/input/input";
interface AuthCardProps {
	isAuth?: boolean
	setIsAuth: (value: boolean) => void
}
export default function AuthCard({
	setIsAuth
}: AuthCardProps) {
	const [isLogin, setIsLogin] = useState<boolean>(true);
	return (
		<div className="h-screen p-6 flex text-white items-center justify-center">
			{
				isLogin ?
					<Login setIsLogin={setIsLogin} setIsAuth={setIsAuth} />
					:
					<Registration setIsLogin={setIsLogin} setIsAuth={setIsAuth} />
			}
		</div>
	)
}
interface CardProps {
	setIsLogin: (value: boolean) => void
	setIsAuth: (value: boolean) => void
}
const Login = ({ setIsLogin, setIsAuth }: CardProps) => {
	return (
		<Card className="w-2xl h-auto flex flex-col gap-4">
			<div className="space-y-1">
				<h1 className="text-[19px]">Авторизация получателя</h1>
				<p className="text-sm text-t-muted">Введите логин и пароль</p>
			</div>
			<Input w="full" placeholder="Введите логин" />
			<Input w="full" placeholder="Введите пароль" />
			<Button text="Продолжить" w="full" onClick={() => setIsAuth(true)} />
			<p className="text-sm text-t-muted text-center cursor-pointer hover:text-t-muted/50" onClick={() => setIsLogin(false)}>
				Нет аккаунта
			</p>
		</Card>
	)
}
const Registration = ({ setIsLogin, setIsAuth }: CardProps) => {
	return (
		<Card className="w-2xl h-auto flex flex-col gap-4">
			<div className="space-y-1">
				<h1 className="text-[19px]">Регистрация получателя</h1>
				<p className="text-sm text-t-muted">Введите логин и пароль</p>
			</div>
			<Input w="full" placeholder="Введите логин" />
			<Input w="full" placeholder="Введите пароль" />
			<Input w="full" placeholder="Введите пароль повторно" />
			<Button text="Продолжить" w="full" onClick={() => setIsAuth(true)} />
			<p className="text-sm text-t-muted text-center cursor-pointer hover:text-t-muted/50" onClick={() => setIsLogin(true)}>
				Есть аккаунт
			</p>
		</Card>
	)
}