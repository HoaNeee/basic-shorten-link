/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import React from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { User } from "lucide-react";
import { usePathname } from "next/navigation";

const SidebarNavUser = () => {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sm">User</SidebarGroupLabel>
      <SidebarMenu className="gap-1.5">
        <SidebarMenuItem>
          <a
            href="/user/profile"
            className={`block ${
              pathname === "/user/profile" ? "text-purple-600" : ""
            }`}
          >
            <SidebarMenuButton
              className="hover:text-purple-700 transition-colors cursor-pointer"
              tooltip={"My profile"}
            >
              <User />
              <span className="text-base">Profile</span>
            </SidebarMenuButton>
          </a>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default SidebarNavUser;
