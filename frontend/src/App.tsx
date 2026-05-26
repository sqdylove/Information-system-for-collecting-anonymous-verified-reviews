import AdminScreen from "./components/screens/AdminScreen";
import MainScreen from "./components/screens/mainScreen";

function App() {
  const isElectron =
    typeof window !== "undefined" &&
    navigator.userAgent.toLowerCase().includes("electron");
  if (isElectron) {
    return <AdminScreen />;
  } else {
    return <MainScreen />;
  }
}

export default App;
