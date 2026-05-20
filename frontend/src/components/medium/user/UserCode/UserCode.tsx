import Button from "../../../small/button/button";
import Card from "../../../small/card/card";
import Input from "../../../small/input/input";

interface Props {
  setUUID: (value: string) => void;
  className?: string;
}
export default function UserCode({ className = "", setUUID }: Props) {
  return (
    <Card className={`${className}`}>
      <h1 className="mb-1 leading-relaxed">Код доступа получателя</h1>
      <p className="text-t-muted mb-3">
        Введите уникальный UUID получателя, чтобы отправить отзыв
      </p>
      <Input className="mb-3" placeholder="Введите UUID-код" w="full" />
      <Button
        className="mb-3"
        text="Продолжить"
        w="full"
        onClick={() => setUUID("123a-123b-123c")}
      />
      <p className="text-t-muted text-xs mb-2">
        UUID обеспечивает доставку только нужному получателю
      </p>
    </Card>
  );
}
