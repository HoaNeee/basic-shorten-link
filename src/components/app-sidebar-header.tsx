"use client";

import React from "react";
import { SidebarGroup, useSidebar } from "./ui/sidebar";
import AppLogo from "./app-logo";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Power } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const AppSidebarHeader = () => {
	const { open } = useSidebar();

	return (
		<SidebarGroup>
			<div className="text-ellipsis line-clamp-1 flex items-center justify-center text-center">
				{open ? (
					<AppLogo />
				) : (
					<div className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
						<p className="text-3xl font-bold">L</p>
					</div>
				)}
			</div>

			<div className="mb-6 flex items-center justify-center mt-12">
				<div className="flex flex-col justify-center items-center">
					<Avatar
						className={`${
							open ? "size-14" : "size-8"
						} bg-gray-400 transition-all duration-300`}
					>
						<AvatarImage src={undefined} alt="this is avatar user" />
						<AvatarFallback
							className={`bg-gradient-to-r from-blue-300 to-purple-300 font-bold text-white transition-all duration-300 ${
								open ? "text-2xl" : "text-lg"
							}`}
						>
							N
						</AvatarFallback>
					</Avatar>
					{open ? (
						<div className="my-2 font-semibold text-xl">Username</div>
					) : null}
					{open ? (
						<button className="size-9 mx-auto flex items-center justify-center bg-red-400/20 text-red-700 mt-3 cursor-pointer hover:bg-red-600 hover:text-white rounded-full transition-colors">
							<Power size={18} strokeWidth={3} />
						</button>
					) : null}
				</div>
			</div>
		</SidebarGroup>
	);
};

export default AppSidebarHeader;
