import { createGusestUser } from "@/lib/db/queries";
import { errorHandler } from "@/lib/error";
import { setCookieOnServer, signJWT } from "@/lib/utils";
import { NextResponse } from "next/server";

export const POST = errorHandler(async (req: Request) => {
  const maxAge = 60 * 60 * 24 * 15;

  const user = await createGusestUser();

  const res = NextResponse.json(
    {
      success: true,
      data: user,
    },
    { status: 200 }
  );

  const token = signJWT(
    {
      id: user.id,
      ip_address: user.ip_address,
    },
    maxAge
  );

  setCookieOnServer(res, "jwt_token", token, maxAge);
  setCookieOnServer(res, "is_guest", "true", maxAge);

  return res;
});
