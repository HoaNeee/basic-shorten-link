import { errorHandler } from "@/lib/error";
import { NextResponse } from "next/server";

export const POST = errorHandler(async (req: Request) => {
  const subject = "Forgot Password - Your OTP Code";
  const html = `
    <h1>Forgot Password</h1>
    <p>We received a request to reset your password. Use the following OTP code to reset your password:</p>
    <p>OTP will expire in 3 minutes</p>
    <h2 style="color: #000;">${123}</h2>
    <p>If you did not request this, please ignore this email.</p>
    <p>Thank you!</p>
    `;

  const res = NextResponse.json(
    {
      success: true,
      data: {},
    },
    { status: 200 }
  );

  return res;
});
