import Button from "../../small/button/button";
import Card from "../../small/card/card";
import Input from "../../small/input/input";

export default function UserPanel() {
    return (
        <div className="w-screen h-screen bg-[#070b13] p-8 text-white flex flex-col overflow-hidden">

            <div className="grid grid-cols-[1000px_1fr] gap-6 flex-1 min-h-0 items-end">

                <div className="w-full">
                    <Card className="p-6 space-y-6">
                        <div className="space-y-1">
                            <h1 className="text-[20px] font-normal">Оставьте анонимный отзыв</h1>
                            <p className="text-[14px] text-gray-400">Ваша анонимность под защитой</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[14px] text-gray-300">Тема отзыва (необязательно)</label>
                            <Input w="full" placeholder="Кратко опишите тему" />
                        </div>

                        <div className="space-y-2 flex flex-col">
                            <label className="text-[14px] text-gray-300">Ваш отзыв</label>
                            <div className="relative">
                                <textarea
                                    placeholder="Поделитесь вашим мнением..."
                                    maxLength={5000}
                                    className="w-full h-48 bg-ui-card p-3 border-ui-border border rounded-[10px] text-[15px] text-white resize-none outline-none focus:border-blue-500"
                                />
                                <span className="absolute bottom-3 right-3 text-[12px] text-gray-500">0 / 5000</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                            <Button text="Очистить" />
                            <Button text="Отправить анонимно" />
                        </div>
                    </Card>
                </div>

                <div className="flex flex-col gap-6 h-full min-h-0 items-end w-full">

                    <Card className="p-5 shrink-0 w-2/4">
                        <h2 className="text-[16px] mb-4">Как это работает?</h2>
                        <div className="space-y-4 text-[13px]">
                            <div className="flex gap-3">
                                <span className="text-gray-500 font-bold">1</span>
                                <div>
                                    <h4 className="font-normal">Получите UUID-код</h4>
                                    <p className="text-gray-400">Получатель предоставляет вам уникальный код доступа</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <span className="text-gray-500 font-bold">2</span>
                                <div>
                                    <h4 className="font-normal">Напишите отзыв</h4>
                                    <p className="text-gray-400">Поделитесь честным мнением абсолютно анонимно</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <span className="text-gray-500 font-bold">3</span>
                                <div>
                                    <h4 className="font-normal">Отправьте сообщение</h4>
                                    <p className="text-gray-400">Мы доставим ваш отзыв получателю безопасно</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-5 space-y-4 shrink-0 w-full">
                        <div className="space-y-1">
                            <h2 className="text-[16px]">Код доступа получателя</h2>
                            <p className="text-[13px] text-gray-400">Введите уникальный UUID получателя, чтобы отправить отзыв</p>
                        </div>
                        <Input w="full" placeholder="Введите UUID-код" />
                        <Button text="Продолжить" w="full" />
                        <p className="text-[12px] text-gray-500 text-center">UUID обеспечивает доставку только нужному получателю</p>
                    </Card>

                    <Card className="p-5 flex-1 min-h-0 w-full">
                        <h2 className="text-[16px]">Недавняя активность</h2>
                    </Card>

                </div>
            </div>

            <footer className="text-center text-[12px] text-gray-500 mt-6 space-y-1 shrink-0">
                <p>Мы не храним IP-адреса, куки и любую другую идентифицирующую информацию.</p>
                <p>Все отзывы доставляются безопасно.</p>
            </footer>

        </div>
    );
}
