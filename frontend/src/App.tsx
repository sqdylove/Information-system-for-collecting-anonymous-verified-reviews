import AdminScreen from "./components/screens/AdminScreen";
import UserScreen from "./components/screens/UserScreen";

function App() {
	const isElectron = typeof window !== 'undefined' && navigator.userAgent.toLowerCase().includes('electron');
	if (isElectron) {
		return <AdminScreen />
	}
	else {
		return <UserScreen />
	}
}

export default App
