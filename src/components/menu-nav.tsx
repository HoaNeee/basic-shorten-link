/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";
import { SheetClose } from "./ui/sheet";
import { ButtonTransition } from "./ui/button";
import { useTheme } from "next-themes";

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
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col h-full gap-2">
      <ul className="flex flex-col gap-1">
        <li className="text-neutral-800 dark:text-neutral-300 dark:border-gray-500 border-y-2 w-full py-2 text-base font-medium border-gray-100">
          <SheetClose asChild>
            <a href="/user/dashboard" className="block px-4">
              Dashboard
            </a>
          </SheetClose>
        </li>
        <li className="text-neutral-800 dark:text-neutral-300 dark:border-gray-500 w-full py-2 text-base font-medium border-b-2 border-gray-100">
          <SheetClose asChild>
            <a href="/blogs" className="block px-4">
              Blogs
            </a>
          </SheetClose>
        </li>
        <li className="text-neutral-800 dark:text-neutral-300 dark:border-gray-500 w-full py-2 text-base font-medium border-b-2 border-gray-100">
          <SheetClose asChild>
            <button
              className="block px-4"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              Toggle theme to {theme === "light" ? "dark" : "light"}
            </button>
          </SheetClose>
        </li>
      </ul>

      <div className="px-4 mt-12">
        <a href="/login" className="w-full">
          <ButtonTransition className="w-full">Login</ButtonTransition>
        </a>
      </div>
    </div>
  );
};

export { MenuNav, MenuNavMobile };
