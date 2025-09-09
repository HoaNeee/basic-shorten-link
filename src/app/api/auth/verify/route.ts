import { verifyAccount } from "@/lib/db/queries";
import { errorHandler } from "@/lib/error";
import { NextRequest, NextResponse } from "next/server";

export const POST = errorHandler(async (req: NextRequest) => {
	const body = await req.json();

	const { email, code } = body;

	const user = await verifyAccount(email, code);

	const res = NextResponse.json(
		{
			success: true,
			data: user,
		},
		{ status: 200 }
	);

	return res;
});
