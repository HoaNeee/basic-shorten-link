import { register } from "@/lib/db/queries";
import { errorHandler } from "@/lib/error";
import { NextResponse } from "next/server";

export const POST = errorHandler(async (req: Request) => {
	const body = await req.json();

	const { email, password, username, fullname } = body;

	const user = await register(email, password, username, fullname);

	delete user?.password;

	const res = NextResponse.json(
		{
			success: true,
			data: user,
		},
		{ status: 200 }
	);

	return res;
});
