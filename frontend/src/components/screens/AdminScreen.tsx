import { useState } from "react";
import AdminPanel from "../medium/admin/AdminStats";
import AuthCard from "../medium/admin/AdminAuth";
interface AdminScreenProps {
  screen?: string;
  setScreen: (value: "main" | "sender" | "recipient") => void
}
export default function AdminScreen({ screen, setScreen }: AdminScreenProps) {
  const [isAuth, setIsAuth] = useState(false);
  return (
    <>
      {isAuth ? (
        <AdminPanel isAuth={isAuth} setIsAuth={setIsAuth} />
      ) : (
        <AuthCard screen={screen} setScreen={setScreen} isAuth={isAuth} setIsAuth={setIsAuth} />
      )}
    </>
  );
}
