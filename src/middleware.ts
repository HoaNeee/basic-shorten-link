import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
	const token = request.cookies.get("jwt_token")?.value;
	const is_guest = request.cookies.get("is_guest")?.value === "true";

	const pathName = request.nextUrl.pathname;

	if (pathName.startsWith("/login") || pathName.startsWith("/register")) {
		if (token && !is_guest) {
			return NextResponse.redirect(new URL("/user/dashboard", request.url));
		}
	} else if (pathName.startsWith("/user")) {
		if (!token || is_guest) {
			return NextResponse.redirect(
				new URL(`/login?next=${encodeURIComponent(pathName)}`, request.url)
			);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/:path*"],
};
