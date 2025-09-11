"use client";

import { PanelLeft, Sun } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { useSidebar } from "./ui/sidebar";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "next-themes";

const DashboardHeader = () => {
  const { toggleSidebar } = useSidebar();
  const { state } = useAuth();
  const { theme, setTheme } = useTheme();

  if (state.user?.is_guest) {
    window.location.href = "/";
    return <></>;
  }

  return (
    <header className="h-14 shrink-0 dark:bg-black sticky top-0 z-10 px-4 bg-white border-b border-gray-100">
      <div className="flex items-center justify-between w-full h-full">
        <Button
          className="size-7 dark:text-white/80 text-gray-700 rounded-sm"
          variant={"outline"}
          onClick={toggleSidebar}
        >
          <PanelLeft className="size-4" />
        </Button>

        <button
          className="relative transition-all duration-300 cursor-pointer"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <Sun className="size-5" />
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
