import { getUserWithId } from "@/lib/db/queries";
import { ApiError, errorHandler } from "@/lib/error";
import { verifyJWT } from "@/lib/utils";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = errorHandler(async (req: NextRequest) => {
	const cookie = await cookies();

	const token = cookie.get("jwt_token")?.value;
	const is_guest = cookie.get("is_guest")?.value;

	if (!token) {
		throw new ApiError(400);
	}

	const payload = verifyJWT(token);

	if (!payload) {
		const res = NextResponse.json(
			{ success: false, error: "Unauthorized" },
			{ status: 401 }
		);
		res.cookies.delete("jwt_token");
		return res;
	}

	if (is_guest) {
		return NextResponse.json(
			{
				success: true,
				data: {
					id: payload.id,
					is_guest: true,
				},
			},
			{ status: 200 }
		);
	}

	const id = payload.id;

	const user = await getUserWithId(id);

	const res = NextResponse.json(
		{
			success: true,
			data: user,
		},
		{ status: 200 }
	);

	return res;
});
