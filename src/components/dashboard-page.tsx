import { Eye, Link, Share2, Target } from "lucide-react";
import React from "react";
import CardItemLink from "./card-item-link";
import HeadTitle from "./head-title";

const DashBoardPage = () => {
	return (
		<div className="w-full h-full flex flex-col bg-gray-50 p-6">
			<HeadTitle title="Dashboard" />
			<div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-10 mt-6">
				<Statistics
					title="Number Of Click"
					icon={<Eye strokeWidth={2} />}
					classIcon="bg-cyan-500/10 text-cyan-500"
				/>
				<Statistics
					title="Links"
					icon={<Link strokeWidth={2} />}
					classIcon="bg-yellow-100/40 text-yellow-500"
				/>
				<Statistics
					icon={<Share2 strokeWidth={2} />}
					classIcon="bg-green-500/10 text-green-500"
				/>
				<Statistics
					icon={<Target strokeWidth={2} />}
					classIcon="bg-red-500/10 text-red-500"
				/>
			</div>
			<div className="flex-1  mt-8">
				<CardItemLink />
			</div>
		</div>
	);
};

const Statistics = ({
	title,
	icon,
	value,
	classIcon,
	classValue,
	classTitle,
}: {
	title?: string | React.ReactNode;
	icon?: React.ReactNode;
	value?: string | number | React.ReactNode;
	classIcon?: string;
	classValue?: string;
	classTitle?: string;
}) => {
	return (
		<div className="w-full h-full bg-white rounded-sm">
			<div
				className={`py-2 px-3 border-b border-gray-100 font-semibold text-purple-800 ${classTitle}`}
			>
				{title || "-"}
			</div>
			<div className="flex flex-col gap-2 items-center py-6">
				<div
					className={`size-16 rounded-full flex items-center justify-center ${classIcon}`}
				>
					{icon || "-"}
				</div>
				<div className={`mt-4 text-xl font-bold text-purple-800 ${classValue}`}>
					{value || "-"}
				</div>
			</div>
		</div>
	);
};

export default DashBoardPage;
