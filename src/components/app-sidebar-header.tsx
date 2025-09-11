"use client";

import React from "react";
import { SidebarGroup, useSidebar } from "./ui/sidebar";
import AppLogo from "./app-logo";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Power } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { TUser } from "@/types/user.types";
import { Skeleton } from "./ui/skeleton";

const AppSidebarHeader = () => {
  const { open } = useSidebar();
  const { state, logout } = useAuth();

  if (!state.user) {
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
        <div className="flex flex-col items-center justify-center mt-12 mb-6">
          <Skeleton
            className={`${
              open ? "size-14" : "size-8"
            }  transition-all duration-300 rounded-full`}
          />
          {open ? (
            <div className="flex flex-col items-center justify-center w-full mt-4">
              <Skeleton className="max-w-8/10 w-full h-3" />
              <Skeleton className="max-w-4/10 w-full h-3 mt-2" />
              <Skeleton className="size-8 my-2 mt-4 rounded-full" />
            </div>
          ) : null}
        </div>
      </SidebarGroup>
    );
  }

  const getAvatarFallback = (user: Partial<TUser> | null) => {
    if (user?.email && user.email.length > 0) {
      return user.email.charAt(0);
    }

    if (user?.username && user.username.length > 0) {
      return user.username.charAt(0);
    }

    return <>CN</>;
  };

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

      <div className="flex items-center justify-center mt-12 mb-6">
        <div className="flex flex-col items-center justify-center">
          <Avatar
            className={`${
              open ? "size-14" : "size-8"
            } bg-gray-400 transition-all duration-300`}
          >
            <AvatarImage
              src={state.user?.avatar}
              alt="this is avatar user"
              className="object-cover"
            />
            <AvatarFallback
              className={`bg-gradient-to-r uppercase from-blue-300 to-purple-300 font-bold text-white transition-all duration-300 ${
                open ? "text-base" : "text-lg"
              }`}
            >
              {getAvatarFallback(state?.user)}
            </AvatarFallback>
          </Avatar>
          {open ? (
            <div className="my-2 text-xl font-semibold text-center">
              {state.user?.fullname ||
                state.user?.username ||
                state.user?.email}
            </div>
          ) : null}
          {open ? (
            <button
              className="size-9 bg-red-400/20 hover:bg-red-600 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-700 hover:text-white flex items-center justify-center mx-auto mt-3 text-red-700 transition-colors rounded-full cursor-pointer"
              onClick={logout}
            >
              <Power size={18} strokeWidth={3} />
            </button>
          ) : null}
        </div>
      </div>
    </SidebarGroup>
  );
};

export default AppSidebarHeader;
