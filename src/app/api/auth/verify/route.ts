import { sendMail } from "@/helpers/send-mail";
import {
  getUserWithAccount,
  updateUserWithId,
  verifyAccountRegister,
  verifyOTP,
} from "@/lib/db/queries";
import { errorHandler } from "@/lib/error";
import { generateString } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const POST = errorHandler(async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;

  const action = searchParams.get("action") || "register";

  const body = await req.json();

  const { email, code } = body;

  if (action === "register") {
    const user = await verifyAccountRegister(email, code);
    const res = NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 200 }
    );
    return res;
  }

  if (action === "forgot-password") {
    await verifyOTP(email, code);
    const password = generateString("string", 4);

    const exist = await getUserWithAccount(email);

    if (exist) {
      const subject = "Forgot Password - New Password";
      const html = `
				<h1>New Password For Your Account</h1>
				<p>We received a request to forgot password your account. Use the following new password to login and change your new password your account:</p>
				<p>There is new password: </p>
				<h2 style="color: #000;">${password}</h2>
				<p>If you did not request this, please ignore this email.</p>
				<p>Thank you!</p>
		`;

      await updateUserWithId(
        {
          password,
        },
        exist.id
      );
      sendMail(exist?.email, subject, html);
    }
  }

  return NextResponse.json(
    {
      success: true,
      data: {},
    },
    { status: 200 }
  );
});
