import { useState } from "react";
import AdminPanel from "../medium/admin/AdminStats";
import AuthCard from "../medium/admin/AdminAuth";

export default function AdminScreen() {
    const [isAuth, setIsAuth] = useState(false);

    return (
        <>
            {
                isAuth ? <AdminPanel isAuth={isAuth} setIsAuth={setIsAuth}/> : <AuthCard isAuth={isAuth} setIsAuth={setIsAuth} />
            }
        </>
    )
}