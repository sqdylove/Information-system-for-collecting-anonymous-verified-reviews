import Card from "../../../small/card/card";

interface ReviewProps {
    clicks: string;
    UUID: string;
    date: string;
    isActive: "Активна" | "Неактивна";
}

export default function UUIDLink({ clicks, UUID, date, isActive }: ReviewProps) {
    const handleCopy = () => {
        navigator.clipboard.writeText(UUID);
    };

    return (
        <Card className="p-4! text-sm leading-loose mb-3">
            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col justify-between">
                    <p className="text-t-main font-mono">{UUID}</p>
                    <p className="text-t-muted">Создана: {date}</p>
                </div>
                <div className="flex flex-row items-center gap-4">
                    <div className="flex flex-col justify-between text-t-muted text-end">
                        <p className={isActive === "Активна" ? "text-t-green" : "text-t-red"}>
                            {isActive}
                        </p>
                        <p>Переходов: {clicks}</p>
                    </div>
                    <button
                        onClick={handleCopy}
                        className="p-2 hover:bg-zinc-800 rounded-lg text-t-muted hover:text-white transition-colors cursor-pointer"
                        title="Скопировать UUID"
                    >
                        <svg xmlns="http://w3.org" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                        </svg>
                    </button>
                </div>

            </div>
        </Card>
    );
}
