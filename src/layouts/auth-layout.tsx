/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import Image from "next/image";
import React from "react";
import IMAGEAUTH from "../assets/computer.png";
import AppLogo from "@/components/app-logo";
import { usePathname } from "next/navigation";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	const pathName = usePathname();

	return (
		<div className="max-w-3xl mx-auto shadow-sm bg-white rounded-sm min-h-140 md:w-full w-19/20 p-4 grid md:grid-cols-2">
			<div className="overflow-hidden w-9/10 md:block hidden">
				<p className="font-bold text-lg text-green-800">
					{pathName.startsWith("/login")
						? "Welcome!"
						: pathName.startsWith("/register")
						? "Join us now! It's free."
						: ""}
				</p>
				<Image src={IMAGEAUTH} alt="this is image for auth page" />
				<a href="/">
					<AppLogo />
				</a>
			</div>
			<div className="w-full h-full">{children}</div>
		</div>
	);
};

export default AuthLayout;
