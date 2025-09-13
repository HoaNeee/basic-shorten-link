/* eslint-disable @next/next/no-html-link-for-pages */
import React from "react";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "./ui/navigation-menu";
import { SheetClose } from "./ui/sheet";
import { ButtonTransition } from "./ui/button";

const MenuNav = () => {
	return (
		<NavigationMenu viewport={false}>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuLink href="/user/dashboard">
						Dashboard
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink href="/blogs">Blogs</NavigationMenuLink>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
};

const MenuNavMobile = () => {
	return (
		<div className="h-full flex flex-col gap-2">
			<ul className="flex flex-col gap-1">
				<li className="text-base font-medium text-neutral-800 w-full border-y-2 border-gray-100 py-2">
					<SheetClose asChild>
						<a href="/user/dashboard" className="block px-4">
							Dashboard
						</a>
					</SheetClose>
				</li>
				<li className="text-base font-medium text-neutral-800 w-full border-b-2 border-gray-100 py-2">
					<SheetClose asChild>
						<a href="/blogs" className="block px-4">
							Blogs
						</a>
					</SheetClose>
				</li>
			</ul>

			<div className="mt-12 px-4">
				<a href="/login" className="w-full">
					<ButtonTransition className="w-full">Login</ButtonTransition>
				</a>
			</div>
		</div>
	);
};

export { MenuNav, MenuNavMobile };
