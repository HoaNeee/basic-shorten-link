/* eslint-disable @next/next/no-html-link-for-pages */
import React from "react";
import AppLogo from "./app-logo";
import { MenuNav, MenuNavMobile } from "./menu-nav";
import { ButtonTransition } from "./ui/button";
import { Menu } from "lucide-react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "./ui/sheet";

const HeaderClient = () => {
	return (
		<div className="max-w-7xl mx-auto h-full w-full flex items-center justify-between">
			<div className="flex items-center gap-6">
				<a href="/">
					<AppLogo />
				</a>
				<div className="hidden md:block">
					<MenuNav />
				</div>
			</div>
			<a href="/login" className="hidden md:block">
				<ButtonTransition>Login</ButtonTransition>
			</a>
			<div className="md:hidden block">
				<Sheet>
					<SheetTrigger asChild>
						<button className="hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 p-2 transition-all duration-200 rounded-lg">
							<Menu className="md:hidden text-gray-500" />
						</button>
					</SheetTrigger>
					<SheetContent
						side="right"
						className="w-80 dark:bg-gray-900 dark:text-white dark:border-gray-700 text-black bg-white border-r border-gray-200"
					>
						<SheetHeader className="pb-3">
							<SheetTitle asChild>
								<a className="w-30 block h-10" href="/">
									<AppLogo />
								</a>
							</SheetTitle>
							<SheetDescription />
						</SheetHeader>
						<div className="mt-2 h-full w-full">
							<MenuNavMobile />
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</div>
	);
};

export default HeaderClient;
