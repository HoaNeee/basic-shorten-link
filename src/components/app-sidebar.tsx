import React from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarRail,
} from "./ui/sidebar";
import DashboardNavMain from "./dashboard-nav-main";
import AppSidebarHeader from "./app-sidebar-header";

const AppSidebar = () => {
	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<AppSidebarHeader />
			</SidebarHeader>
			<SidebarContent>
				<DashboardNavMain />
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
};

export default AppSidebar;
