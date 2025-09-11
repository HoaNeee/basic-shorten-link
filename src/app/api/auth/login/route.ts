import { login } from "@/lib/db/queries";
import { errorHandler } from "@/lib/error";
import { setCookieOnServer, signJWT } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const POST = errorHandler(async (req: NextRequest) => {
  const maxAge = 60 * 60 * 24 * 15;

  const body = await req.json();

  const { account, password, isRemember } = body;

  const user = await login(account, password);

  const res = NextResponse.json(
    {
      success: true,
      data: user,
    },
    { status: 200 }
  );

  if (user.status === "inactive") {
    return res;
  }

  const token = signJWT(
    {
      id: user.id,
    },
    isRemember ? maxAge : undefined
  );

  setCookieOnServer(res, "jwt_token", token, isRemember ? maxAge : undefined);

  res.cookies.delete("is_guest");

  return res;
});
