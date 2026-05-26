import { useState } from "react";
import Button from "../small/button/button";
import Card from "../small/card/card";
import UserScreen from "./UserScreen";
import AdminScreen from "./AdminScreen";

export default function MainScreen() {
  const [screen, setScreen] = useState<"main" | "sender" | "recipient">("main");
  if (screen === "sender") {
    return <UserScreen screen={screen} setScreen={setScreen} />
  }
  if (screen === "recipient") {
    return <AdminScreen screen={screen} setScreen={setScreen}/>
  }
  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto overflow-x-hidden select-none text-white relative">
      <div className="flex flex-col items-center justify-center w-full gap-5">
        <Card className="w-full max-w-md">
          <h1 className="mb-3 leading-relaxed">В чем разница?</h1>
          <ListElem
            num="1"
            title="Отправитель"
            text="Может отправлять анонимные отзывы любому получателю зная UUID-код или ссылку"
          />
          <ListElem
            num="2"
            title="Получатель"
            text="Может создать UUID-код или ссылку и получать анонимные отзывы от отправителя"
          />
        </Card>
        <Card className="w-full max-w-2xl">
          <h1 className="mb-3 leading-relaxed">Выбор типа?</h1>
          <p className="text-t-muted text-xs mb-4">Выберите отправителя или получателя</p>
          <div className="flex flex-row justify-between items-center gap-4 w-full">
            <Button text={"Войти как отправитель"} onClick={() => setScreen("sender")}></Button>
            <Button text={"Войти как получатель"} onClick={() => setScreen("recipient")}></Button>
          </div>
        </Card>

      </div>
    </div>
  )
}

interface ListElemProps {
  num: string;
  title: string;
  text: string;
}

const ListElem = ({ num, title, text }: ListElemProps) => {
  return (
    <div className="mb-3 flex items-start"> {/* items-start выровняет иконку по верхней линии текста */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-transparent border-ui-border border-2 font-bold text-white">
        {num}
      </div>
      <div className="ml-2">
        <h5 className="text-t-main text-md leading-tight">{title}</h5>
        <p className="text-t-muted text-xs leading-tight">{text}</p>
      </div>
    </div>
  );
};
