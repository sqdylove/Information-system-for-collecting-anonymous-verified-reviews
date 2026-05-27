import { useState } from "react";
import AdminScreen from "./components/screens/AdminScreen";
import MainScreen from "./components/screens/mainScreen";

function App() {
  const [screen, setScreen] = useState<"main" | "sender" | "recipient">("main");
  const [UUID, setUUID] = useState<string | null>(() => {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get("uuid") || null;
  });
  const isElectron =
    typeof window !== "undefined" &&
    navigator.userAgent.toLowerCase().includes("electron");

  if (isElectron) {
    return <AdminScreen setScreen={setScreen} />;
  } else {
    return <MainScreen UUID={UUID} screen={screen} setScreen={setScreen} setUUID={setUUID} />;
  }
}

export default App;
