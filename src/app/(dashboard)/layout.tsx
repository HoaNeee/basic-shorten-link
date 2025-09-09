import AppSidebar from "@/components/app-sidebar";
import DashboardHeader from "@/components/dashboard-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayoutRoot({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<DashboardHeader />
				<main className="w-full h-full">{children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
