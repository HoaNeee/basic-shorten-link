import AuthLayout from "@/layouts/auth-layout";

export default function AuthLayoutRoot({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="dark:bg-black flex items-center justify-center w-full h-full min-h-screen bg-gray-100">
      <AuthLayout>{children}</AuthLayout>
    </div>
  );
}
