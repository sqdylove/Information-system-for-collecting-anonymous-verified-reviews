import Button from "../../small/button/button";
import Card from "../../small/card/card";
import Input from "../../small/input/input";

interface Props {
	className: string;
}
export default function UserReview({ className }: Props) {
	return (
		<Card className={className}>
			<h1 className="text-t-main leading-relaxed">Оставьте анонимный отзыв</h1>
			<p className="text-t-muted leading-relaxed text-xs mb-4">Ваша анонимность под защитой</p>

			<label className="block mb-1.5">Тема отзыва <span className="text-t-muted">(необязательно)</span></label>
			<Input w="full" />

			<label className="block mt-4 mb-1.5">Ваш отзыв</label>
			<div className="relative">
				<textarea
					placeholder="Поделитесь вашим мнением..."
					className="w-full pl-4 pt-2 pb-8 h-auto bg-transparent border border-ui-border rounded-[10px] resize-none focus:outline-none"
				/>
				<span className="absolute bottom-2 right-4 text-xs text-t-muted">0 / 5000</span>
			</div>

			<div className="flex flex-row justify-between mt-4">
				<Button text="Очистить" w="fit" />
				<Button text="Отправить анонимно" w="fit" />
			</div>
		</Card>

	)
}