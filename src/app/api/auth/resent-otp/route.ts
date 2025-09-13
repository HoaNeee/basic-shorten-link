import { sendMailOTPRegister } from "@/helpers/send-mail";
import { deleteOTPWithId, getOTPWithEmail, saveOTP } from "@/lib/db/queries";
import { ApiError, errorHandler } from "@/lib/error";
import { generateString } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const POST = errorHandler(async (req: NextRequest) => {
	const body = await req.json();

	const { email } = body;

	const record = await getOTPWithEmail(email);

	if (record) {
		const now = Date.now();
		if (new Date(record.expired_at).getTime() < now) {
			await deleteOTPWithId(record.id);
		} else {
			throw new ApiError(429, "Many request, please try later.");
		}
	}

	const res = NextResponse.json(
		{
			success: true,
		},
		{ status: 200 }
	);

	const otp = generateString("number", 4);

	const code = await saveOTP({ ref_email: email, code: otp });
	sendMailOTPRegister(code.code, email);
	return res;
});
