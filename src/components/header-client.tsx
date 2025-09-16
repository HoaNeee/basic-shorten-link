/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import React from "react";
import AppLogo from "./app-logo";
import { MenuNav, MenuNavMobile } from "./menu-nav";
import { ButtonTransition } from "./ui/button";
import { Menu, Sun } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useTheme } from "next-themes";

const HeaderClient = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-7xl flex items-center justify-between w-full h-full mx-auto">
      <div className="flex items-center gap-6">
        <a href="/">
          <AppLogo />
        </a>
        <div className="md:block hidden">
          <MenuNav />
        </div>
      </div>
      <div className="md:flex hidden gap-4">
        <button
          className="relative transition-all duration-300 cursor-pointer"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <Sun className="size-5" />
        </button>
        <a href="/login">
          <ButtonTransition>Login</ButtonTransition>
        </a>
      </div>
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
            <div className="w-full h-full mt-2">
              <MenuNavMobile />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default HeaderClient;
