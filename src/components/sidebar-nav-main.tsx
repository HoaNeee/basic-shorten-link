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
import { Layers2, Link } from "lucide-react";
import { usePathname } from "next/navigation";

const SidebarNavMain = () => {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sm">Main</SidebarGroupLabel>
      <SidebarMenu className="gap-1.5">
        <SidebarMenuItem>
          <a
            href="/user/create-link"
            className={`block ${
              pathname === "/user/create-link" ? "text-purple-600" : ""
            }`}
          >
            <SidebarMenuButton
              className="hover:text-purple-700 transition-colors cursor-pointer"
              tooltip={"Create Link"}
            >
              <Link />
              <span className="text-base">Create Link</span>
            </SidebarMenuButton>
          </a>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <a
            href="/user/dashboard"
            className={`block ${
              pathname === "/user/dashboard" ? "text-purple-600" : ""
            }`}
          >
            <SidebarMenuButton
              className="hover:text-purple-700 transition-colors cursor-pointer"
              tooltip={"Dashboard"}
            >
              <Layers2 />
              <span className="text-base">Dashboard</span>
            </SidebarMenuButton>
          </a>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default SidebarNavMain;
