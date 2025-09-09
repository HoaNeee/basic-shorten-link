import React from "react";
import { Checkbox } from "./ui/checkbox";
import { Copy, Ellipsis, Eye, LogOut, Shuffle, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const CardItemLink = () => {
	return (
		<div className="w-full bg-white rounded-sm shadow-xs">
			<div className="py-3 px-4 border-b border-gray-100 flex items-center gap-4 justify-between">
				<div className="flex items-center gap-4">
					<Checkbox />
					Header
				</div>
				<div className="flex items-center gap-4">
					<p>25-09-2025</p>
					<Button size={"sm"} variant={"outline"} className="">
						<LogOut strokeWidth={1} />
						<p className="font-normal">Detail</p>
					</Button>
					<Button size={"sm"} variant={"outline"}>
						<Ellipsis />
					</Button>
				</div>
			</div>
			<div className="py-3 px-8">
				<div className="text-purple-800 font-semibold flex items-center gap-3">
					Link shorten{" "}
					<div
						className="p-1 hover:bg-gray-50 rounded-xs cursor-pointer"
						title="Copy this link"
					>
						<Copy size={16} />
					</div>
				</div>
				<div className="mb-4 mt-2 text-gray-500 text-sm">main url</div>
				<div className="flex items-center justify-between py-2">
					<div className="flex items-center gap-3">
						<ButtonAction>
							<Copy size={18} />
						</ButtonAction>
						<ButtonAction>
							<Shuffle size={18} />
						</ButtonAction>
						<ButtonAction className="rounded-full size-9 bg-white text-red-600 border-red-600 border cursor-pointer hover:bg-red-600 hover:text-white flex items-center justify-center transition-colors">
							<Trash size={18} />
						</ButtonAction>
					</div>
					<div className="flex items-center gap-3">
						<Badge className="bg-green-50 text-green-600">active</Badge>
						<div className="flex items-center gap-2">
							<span className="font-semibold">0</span> <Eye size={18} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const ButtonAction = ({
	children,
	className,
	title,
	onClick,
}: {
	children: React.ReactNode;
	className?: string;
	title?: string;
	onClick?: () => void;
}) => {
	return (
		<button
			onClick={onClick}
			title={title}
			className={`rounded-full size-10 bg-white text-gray-600 border-gray-600 border cursor-pointer hover:bg-gray-600 hover:text-white flex items-center justify-center transition-colors ${className}`}
		>
			{children}
		</button>
	);
};

export default CardItemLink;
