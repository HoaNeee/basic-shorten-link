"use client";

import { PanelLeft } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { useSidebar } from "./ui/sidebar";

const DashboardHeader = () => {
	const { setOpen, open } = useSidebar();

	return (
		<header className="h-14 px-4 bg-white border-b border-gray-100">
			<div className="flex items-center justify-between w-full h-full">
				<Button
					className="size-7 rounded-sm text-gray-700"
					variant={"outline"}
					onClick={() => setOpen(!open)}
				>
					<PanelLeft className="size-4" />
				</Button>
			</div>
		</header>
	);
};

export default DashboardHeader;
