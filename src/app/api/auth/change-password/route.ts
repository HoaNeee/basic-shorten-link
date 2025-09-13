import { getUserWithId, updateUserWithId } from "@/lib/db/queries";
import { ApiError, errorHandler } from "@/lib/error";
import { getPayloadWithJWT, verifyPassword } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = errorHandler(async (req: NextRequest) => {
	const body = await req.json();

	const { currentPassword, newPassword, confirmPassword, id } = body as {
		currentPassword: string;
		newPassword: string;
		confirmPassword: string;
		id: number;
	};

	if (newPassword.trim() !== confirmPassword.trim()) {
		throw new ApiError(400);
	}

	const payload = await getPayloadWithJWT(req);

	if (payload?.id !== id) {
		throw new ApiError(403);
	}

	const user = await getUserWithId(id);

	const isMatch = await verifyPassword(
		currentPassword,
		user?.password as string
	);

	if (!isMatch) {
		throw new ApiError(400, "Current passowrd is not correct.");
	}

	await updateUserWithId(
		{
			password: newPassword,
		},
		id
	);

	return NextResponse.json({
		success: true,
		message: "Success!",
		data: {},
	});
});
