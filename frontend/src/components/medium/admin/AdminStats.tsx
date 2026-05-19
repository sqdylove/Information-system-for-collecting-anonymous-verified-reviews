import { useState } from "react";
import Button from "../../small/button/button";
import Card from "../../small/card/card";
interface Props {
	isAuth?: boolean
	setIsAuth: (value: boolean) => void
}
export default function AdminPanel({ setIsAuth }: Props) {
	const [ActiveTab, setActiveTab] = useState<"statistics" | "links" | "reviews">("statistics")
	return (
		<div className="h-screen p-6 text-white grid grid-cols-[350px_1fr] gap-4">
			<Card className="h-full">
				<div className="h-full flex flex-col justify-between">
					<div className="w-full flex flex-col gap-3">
						<Button text="Статистика" w="full" onClick={() => setActiveTab("statistics")} />
						<Button text="UUID-ссылки" w="full" onClick={() => setActiveTab("links")} />
						<Button text="Отзывы" w="full" onClick={() => setActiveTab("reviews")} />
					</div>
					<div>
						<Button text="Выход" w="full" onClick={() => setIsAuth(false)} />
					</div>
				</div>
			</Card>
			{
				ActiveTab === "statistics" ? (
					<Statistics />
				) :
					ActiveTab === "links" ? (
						<Links />
					) :
						ActiveTab === "reviews" ? (
							<Reviews />
						) : null
			}
		</div>
	);
}

const Statistics = () => {
	return (
		<div className="h-full grid grid-rows-[auto_1fr_300px] gap-4">
			<div className="grid grid-cols-6 gap-4 text-center w-full">
				<Card className="h-50  p-4! flex flex-col">
					<h2 className="text-md">Всего отзывов</h2>
				</Card>
				<Card className="h-50  p-4! flex flex-col">
					<h2 className="text-md">Прошли модерацию</h2>
				</Card>
				<Card className="h-50  p-4! flex flex-col">
					<h2 className="text-md">Заблокировано</h2>
				</Card>
				<Card className="h-50 "> </Card>
				<Card className="h-50 "> </Card>
				<Card className="h-50 "> </Card>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<Card className="h-full">
					<h2 className="text-[17px] font-normal mb-2">Последние отзывы</h2>
				</Card>
				<Card className="h-full">
					<h2 className="text-[17px] font-normal mb-2">UUID-ссылки</h2>
				</Card>
			</div>

			<div className="grid grid-cols-[1.5fr_1fr] gap-4">
				<Card className="h-full">
					<h2 className="text-[17px] font-normal mb-2">Динамика активности</h2>
					{/* график */}
				</Card>
				<Card className="h-full">
					<h2 className="text-[17px] font-normal mb-2">Состояние системы</h2>
				</Card>
			</div>
		</div>
	)
}
const Links = () => {
	return (
		<div>links</div>
	)
}
const Reviews = () => {
	return (
		<div>reviews</div>
	)
}