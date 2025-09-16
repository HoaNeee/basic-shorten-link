import { sendMail } from "@/helpers/send-mail";
import { getUserWithAccount, saveOTP } from "@/lib/db/queries";
import { ApiError, errorHandler } from "@/lib/error";
import { generateString } from "@/lib/utils";
import { NextResponse } from "next/server";

export const POST = errorHandler(async (req: Request) => {
  const body = await req.json();

  const { account } = body;

  const exist = await getUserWithAccount(account);

  if (!exist || exist.status === "inactive") {
    throw new ApiError(404, "Email or username is not exist.");
  }

  if (exist.provider === "google") {
    throw new ApiError(409, "Please login with google.");
  }

  const otp = generateString("number", 4);

  const record = await saveOTP({
    code: otp,
    ref_email: exist.email,
  });

  const subject = "Forgot Password - Your OTP Code";
  const html = `
    <h1>Forgot Password</h1>
    <p>We received a request to reset your password. Use the following OTP code to reset your password:</p>
    <p>OTP will expire in 3 minutes</p>
    <h2 style="color: #000;">${record.code}</h2>
    <p>If you did not request this, please ignore this email.</p>
    <p>Thank you!</p>
    `;
  sendMail(exist.email, subject, html);

  const res = NextResponse.json(
    {
      success: true,
      data: {},
    },
    { status: 200 }
  );

  return res;
});
