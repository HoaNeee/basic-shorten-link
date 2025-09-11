import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "./ui/sidebar";
import SidebarNavMain from "./sidebar-nav-main";
import AppSidebarHeader from "./app-sidebar-header";
import SidebarNavUser from "./sidebar-nav-user";

const AppSidebar = () => {
  return (
    <Sidebar side="left" collapsible="icon">
      <SidebarHeader>
        <AppSidebarHeader />
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavMain />
        <SidebarNavUser />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
