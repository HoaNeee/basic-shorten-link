import AuthLayout from "@/layouts/auth-layout";

export default function AuthLayoutRoot({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="w-full h-full min-h-screen bg-gray-100 flex items-center justify-center">
			<AuthLayout>{children}</AuthLayout>
		</div>
	);
}
