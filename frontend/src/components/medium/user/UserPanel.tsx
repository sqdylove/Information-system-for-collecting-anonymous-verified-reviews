import UserCode from "./UserCode/UserCode";
import UserInfo from "./UserInfo/UserInfo";

export default function UserPanel() {
	return (
		<div className="h-full w-screen flex flex-col justify-center items-center p-4 md:p-8 gap-6 overflow-hidden select-none text-white">
			<div className="w-full max-w-110 transition-all duration-300">
				<UserInfo />
			</div>
			<div className="w-full max-w-160 transition-all duration-300">
				<UserCode />
			</div>
			<h5 className="absolute bottom-2.5 md:bottom-4 text-xs md:text-sm text-t-muted text-center tracking-wide mt-2">
				We don't share your IP
			</h5>
		</div>
	);
}
