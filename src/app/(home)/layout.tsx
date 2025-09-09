import AppFooter from "@/components/app-footer";
import AppHeader from "@/components/app-header";

export default function HomeLayoutRoot({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<section className="flex flex-col min-h-screen">
			<AppHeader />
			<main className="flex-1">{children}</main>
			<AppFooter />
		</section>
	);
}
