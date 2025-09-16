import AppSidebar from "@/components/app-sidebar";
import DashboardHeader from "@/components/dashboard-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";

export default async function DashboardLayoutRoot({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sidebar_state =
    (await cookies()).get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={sidebar_state}>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="w-full h-full">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
