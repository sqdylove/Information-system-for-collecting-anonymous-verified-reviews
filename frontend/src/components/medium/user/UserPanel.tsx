import UserCode from "./UserCode";
import HowItWorks from "./UserInfo";
import UserRecently from "./UserRecently";
import UserReview from "./UserReview";

export default function UserPanel() {
	return (
		<div className="h-screen w-screen grid grid-rows-12 grid-cols-12 p-8 gap-5">
			<UserReview className="row-start-7 col-span-6 row-span-9"/>
			<HowItWorks className="row-start-0 col-start-9 col-span-4 row-span-4" />
			<UserCode className="row-start-5 col-span-6 row-span-4" />
			<UserRecently className="row-start-9 col-span-6 row-span-7" />
			<h5 className="row-span-2 col-span-12 text-t-muted text-center">We don't share your IP</h5>
		</div>
	);
}
