import { useState } from "react";
import AdminScreen from "./components/screens/AdminScreen";
import MainScreen from "./components/screens/mainScreen";

function App() {
  const [screen, setScreen] = useState<"main" | "sender" | "recipient">("main");

  const isElectron =
    typeof window !== "undefined" &&
    navigator.userAgent.toLowerCase().includes("electron");
  if (isElectron) {
    return <AdminScreen setScreen={setScreen}/>;
  } else {
    return <MainScreen />;
  }
}

export default App;
