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
		<div className="h-screen p-6 text-white grid grid-cols-[350px_1fr] gap-4 overflow-hidden">
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
						setTotalReviews={setTotalReviews}
						moderatedReviews={moderatedReviews}
						setModeratedReviews={setModeratedReviews}
						blockedReviews={blockedReviews}
						setBlockedReviews={setBlockedReviews}
					/>
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

const Statistics = ({
	totalReviews,
	setTotalReviews,
	moderatedReviews,
	setModeratedReviews,
	blockedReviews,
	setBlockedReviews
}: StatProps) => {
	const [totalReviewsPercent, setTotalReviewsPrecent] = useState<number>(totalReviews * 0.4 / 34)
	const [moderatedReviewsPercent, setModeratedReviewsPercent] = useState<number>(moderatedReviews * 0.4 / 34)
	const [blockedReviewsPercent, setBlockedReviewsPercent] = useState<number>(blockedReviews * 0.5 / 34)

	return (
		<div className="h-[calc(100vh-3rem)] grid grid-rows-[110px_1fr_280px] gap-4 min-h-0 overflow-hidden">

			<div className="grid grid-cols-[1.2fr_1.4fr_1.2fr_1.2fr_1.4fr_1.8fr] gap-4 w-full min-h-0">
				<Card className="h-full p-2.5 w-auto flex flex-col justify-between items-center overflow-hidden">
					<h2 className="text-xs text-center text-t-muted truncate w-full">Всего отзывов</h2>
					<h3 className="text-2xl font-bold text-t-blue truncate w-full text-center leading-none">{totalReviews.toLocaleString('en-US')}</h3>
					<h2 className="text-[11px] text-center text-t-main truncate w-full">+{totalReviewsPercent.toFixed(1)}% за неделю</h2>
				</Card>

				<Card className="h-full p-2.5 w-auto flex flex-col justify-between items-center overflow-hidden">
					<h2 className="text-xs text-center text-t-muted truncate w-full">Прошли модерацию</h2>
					<h3 className="text-2xl font-bold text-t-green truncate w-full text-center leading-none">{moderatedReviews.toLocaleString('en-US')}</h3>
					<h2 className="text-[11px] text-center text-t-main truncate w-full">+{moderatedReviewsPercent.toFixed(1)}% от всех</h2>
				</Card>

				<Card className="h-full p-2.5 w-auto flex flex-col justify-between items-center overflow-hidden">
					<h2 className="text-xs text-center text-t-muted truncate w-full">Заблокировано</h2>
					<h3 className="text-2xl font-bold text-t-red truncate w-full text-center leading-none">{blockedReviews.toLocaleString('en-US')}</h3>
					<h2 className="text-[11px] text-center text-t-main truncate w-full">+{blockedReviewsPercent.toFixed(1)}% за неделю</h2>
				</Card>

				<Card className="h-full"> </Card>
				<Card className="h-full"> </Card>
				<Card className="h-full"> </Card>
			</div>
			<div className="grid grid-cols-2 gap-4 min-h-0">
				<Card className="h-full min-h-0 flex flex-col p-4! overflow-hidden">
					<div className="flex flex-row justify-between mb-2 shrink-0">
						<h2 className="text-[16px] font-normal">Последние отзывы</h2>
						<p className="text-t-muted text-sm cursor-pointer hover:text-white transition-colors">Смотреть все</p>
					</div>

					<div className="overflow-y-auto flex-1 pr-1 custom-scroll">
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

				<Card className="h-full min-h-0 flex flex-col p-4! overflow-hidden">
					<div className="flex flex-row justify-between mb-2 shrink-0">
						<h2 className="text-[16px] font-normal">UUID ссылки</h2>
						<p className="text-t-muted text-sm cursor-pointer hover:text-white transition-colors">Смотреть все</p>
					</div>

					<div className="overflow-y-auto flex-1 pr-1 custom-scroll">
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
			<div className="grid grid-cols-[1.5fr_1fr] gap-4 min-h-0 overflow-hidden h-full">
				<ActivityChart />
				<Card className="h-full flex flex-col justify-between p-4! overflow-hidden">
					<h2 className="text-[16px] font-normal mb-2 shrink-0">Состояние системы</h2>
					<div className="flex-1 flex flex-col justify-between border border-ui-border/50 rounded-xl bg-zinc-950/20 min-h-0 overflow-hidden">
						{[
							{ name: "API сервис", status: "Работает", ok: true },
							{ name: "База данных", status: "Не работает", ok: false },
							{ name: "Телеграмм бот", status: "Работает", ok: true },
							{ name: "Сайт пользователя", status: "Работает", ok: true },
							{ name: "Сайт получателя", status: "Работает", ok: true }
						].map((service, index, arr) => (
							<div
								key={service.name}
								className={`flex flex-row justify-between items-center px-4 text-sm flex-1
                    ${index !== arr.length - 1 ? 'border-b border-ui-border/40' : ''}`}
							>
								<span className="text-t-main truncate mr-2">{service.name}</span>
								<span className={`font-medium shrink-0 ${service.ok ? 'text-t-green' : 'text-t-red'}`}>
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
		<>
			<div className="h-full">
				<div className="w-full flex flex-row justify-end gap-6 mb-3">
					<Button className="pl-16 pr-16" text={"Обновить"}></Button>
					<Button className="pl-16 pr-16" text={"Создать ссылку"}></Button>
				</div>
				<div className="h-[calc(100vh-8rem)] flex flex-col gap-4 min-h-0 overflow-y-auto flex-1 pr-1 custom-scroll">
					{Array.from({ length: 15 }).map((_, index) => {
						const randomStatus = Math.random() < 0.5 ? "Активна" : "Неактивна";
						const randomClicks = Math.floor(Math.random() * 150).toString();
						return (
							<UUIDLink
								key={index}
								clicks={randomClicks}
								UUID={`cds321-zxc342-nhg64y6-xcvb6-mnf49m`}
								date={"24.05.2026"}
								isActive={randomStatus}
								UUIDScreen
							/>
						);
					})}
				</div>
			</div>
		</>
	)
}
const Reviews = () => {
	return (
		<>
			<div className="h-full">
				<div className="w-full flex flex-row justify-end gap-6 mb-3">
					<Button className="pl-16 pr-16" text={"Обновить"}></Button>
				</div>
				<div className="h-[calc(100vh-8rem)] flex flex-col gap-4 min-h-0 overflow-y-auto flex-1 pr-1 custom-scroll">
					{Array.from({ length: 10 }).map((_, index) => (
						<Review
							key={index}
							title={"Lorem ipsum..."}
							UUID={"cds321-zxc342-nhg64y6-xcvb6-mnf49m"}
							timeAgo={"2 minuts ago"}
						/>
					))}
				</div>
			</div>
		</>
	)
}
