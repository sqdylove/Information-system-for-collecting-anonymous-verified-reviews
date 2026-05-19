import { useState } from "react";
import Button from "../../small/button/button";
import Card from "../../small/card/card";
import Review from "./review/review";
import UUIDLink from "./uuidLink/uuidLink";
import ActivityChart from "./activityChart/activityChart";

interface Props {
	isAuth?: boolean
	setIsAuth: (value: boolean) => void
}
export default function AdminPanel({ setIsAuth }: Props) {
	const [ActiveTab, setActiveTab] = useState<"statistics" | "links" | "reviews">("statistics")
	const [totalReviews, setTotalReviews] = useState<number>(1248)
	const [moderatedReviews, setModeratedReviews] = useState<number>(1062)
	const [blockedReviews, setBlockedReviews] = useState<number>(174)
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
					<Statistics
						totalReviews={totalReviews}
						moderatedReviews={moderatedReviews}
						blockedReviews={blockedReviews} />
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
interface StatProps {
	totalReviews: number
	setTotalReviews?: (value: number) => void
	moderatedReviews: number
	setModeratedReviews?: (value: number) => void
	blockedReviews: number
	setBlockedReviews?: (value: number) => void
}
const Statistics = ({ totalReviews, moderatedReviews, blockedReviews }: StatProps) => {
	const [totalReviewsPercent, setTotalReviewsPrecent] = useState<number>(totalReviews * 0.4 / 34)
	const [moderatedReviewsPercent, setModeratedReviewsPercent] = useState<number>(moderatedReviews * 0.4 / 34)
	const [blockedReviewsPercent, setBlockedReviewsPercent] = useState<number>(blockedReviews * 0.5 / 34)
	return (
		<div className="h-[calc(100vh-3rem)] grid grid-rows-[200px_1fr_340px] gap-4 min-h-0">
			<div className="grid grid-cols-[1.2fr_1.4fr_1.2fr_1.2fr_1.4fr_1.8fr] gap-4 w-full">
				<Card className="h-50 p-4 w-auto flex flex-col justify-between items-center">
					<h2 className="text-md text-center">Всего отзывов</h2>
					<h3 className="text-t-blue text-5xl text-center font-bold">{totalReviews.toLocaleString('en-US')}</h3>
					<h2 className="text-t-main text-center">+{totalReviewsPercent.toFixed(1)}% за неделю</h2>
				</Card>

				<Card className="h-50 p-4 w-auto flex flex-col justify-between items-center">
					<h2 className="text-md text-center">Прошли модерацию</h2>
					<h3 className="text-t-green text-5xl text-center font-bold">{moderatedReviews.toLocaleString('en-US')}</h3>
					<h2 className="text-t-main text-center">+{moderatedReviewsPercent.toFixed(1)}% от всех</h2>
				</Card>

				<Card className="h-50 p-4 w-auto flex flex-col justify-between items-center">
					<h2 className="text-md text-center">Заблокировано</h2>
					<h3 className="text-t-red text-5xl text-center font-bold">{blockedReviews.toLocaleString('en-US')}</h3>
					<h2 className="text-t-main text-center">+{blockedReviewsPercent.toFixed(1)}% за неделю</h2>
				</Card>

				<Card className="h-50"> </Card>
				<Card className="h-50"> </Card>
				<Card className="h-50"> </Card>
			</div>

			<div className="grid grid-cols-2 gap-4 min-h-0">
				<Card className="h-full min-h-0 flex flex-col">
					<div className="flex flex-row justify-between mb-2">
						<h2 className="text-[17px] font-normal">Последние отзывы</h2>
						<p className="text-t-muted text-sm cursor-pointer">Смотреть все</p>
					</div>

					<div className="overflow-y-auto flex-1 pr-1">
						{Array.from({ length: 10 }).map((_, index) => (
							<Review
								key={index}
								title={"Lorem ipsum..."}
								UUID={"cds321-zxc342-nhg64y6-xcvb6-mnf49m"}
								timeAgo={"2 minuts ago"}
							/>
						))}
					</div>
				</Card>

				<Card className="h-full min-h-0 flex flex-col">
					<div className="flex flex-row justify-between mb-2">
						<h2 className="text-[17px] font-normal">UUID ссылки</h2>
						<p className="text-t-muted text-sm cursor-pointer">Смотреть все</p>
					</div>

					<div className="overflow-y-auto flex-1 pr-1">
						{Array.from({ length: 10 }).map((_, index) => {
							const randomStatus = Math.random() < 0.5 ? "Активна" : "Неактивна";
							const randomClicks = Math.floor(Math.random() * 150).toString();
							return (
								<UUIDLink
									key={index}
									clicks={randomClicks}
									UUID={`cds321-zxc342-nhg64y6-xcvb6-mnf49m`}
									date={"24.05.2026"}
									isActive={randomStatus}
								/>
							);
						})}
					</div>
				</Card>
			</div>
			<div className="grid grid-cols-[1.5fr_1fr] gap-4">
				<ActivityChart />
				<Card className="h-full flex flex-col justify-between p-6!">
					<h2 className="text-[17px] font-normal mb-4">Состояние системы</h2>
					<div className="flex-1 flex flex-col justify-between border border-ui-border/50 rounded-xl overflow-hidden bg-zinc-950/20">
						{[
							{ name: "API сервис", status: "Работает", ok: true },
							{ name: "База данных", status: "Не работает", ok: false },
							{ name: "Телеграмм бот", status: "Работает", ok: true },
							{ name: "Сайт пользователя", status: "Работает", ok: true },
							{ name: "Сайт получателя", status: "Работает", ok: true }
						].map((service, index, arr) => (
							<div
								key={service.name}
								className={`flex flex-row justify-between items-center px-5 py-3 text-sm
                    ${index !== arr.length - 1 ? 'border-b border-ui-border/40' : ''}`}
							>
								<span className="text-t-main">{service.name}</span>
								<span className={`font-medium ${service.ok ? 'text-t-green' : 'text-t-red'}`}>
									{service.status}
								</span>
							</div>
						))}
					</div>
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

