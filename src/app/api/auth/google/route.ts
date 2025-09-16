import { isProduction } from "@/lib/contant";
import { getUserWithAccount, saveUser } from "@/lib/db/queries";
import { ApiError, errorHandler } from "@/lib/error";
import { setCookieOnServer, signJWT } from "@/lib/utils";
import { TUser } from "@/types/user.types";
import { NextRequest, NextResponse } from "next/server";

export const POST = errorHandler(async (req: NextRequest) => {
  const { code } = await req.json();

  if (!code) {
    throw new ApiError(400);
  }

  const user_info = await getUserInfo(code);

  const maxAge = 24 * 60 * 60 * 5;

  const { email, name, picture } = user_info;

  const exist = (await getUserWithAccount(email)) as Partial<TUser>;

  if (exist) {
    delete exist?.password;

    const res = NextResponse.json(
      {
        success: true,
        data: exist,
      },
      { status: 200 }
    );

    const token = signJWT(
      {
        id: exist.id,
      },
      maxAge
    );

    setCookieOnServer(res, "jwt_token", token, maxAge);
    res.cookies.delete("is_guest");

    return res;
  }

  const username = email.substring(0, email.indexOf("@"));

  const user = await saveUser({
    provider: "google",
    email,
    fullname: name,
    avatar: picture,
    status: "active",
    username,
  });

  delete user?.password;

  const res = NextResponse.json(
    {
      success: true,
      data: user,
    },
    { status: 200 }
  );

  const token = signJWT(
    {
      id: user?.id,
    },
    maxAge
  );

  setCookieOnServer(res, "jwt_token", token, maxAge);
  res.cookies.delete("is_guest");

  return res;
});

const getUserInfo = async (code: string) => {
  try {
    const redirect_uri = isProduction
      ? `${process.env.NEXT_PUBLIC_API_URL}/login/google`
      : `http://localhost:3000/login/google`;

    const params = new URLSearchParams({
      code,
      redirect_uri,
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
      grant_type: "authorization_code",
    });

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new ApiError(400, "Failed to exchange code for access token");
    }

    const data = await response.json();

    const res_info = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      }
    );

    if (!res_info.ok) {
      throw new ApiError(400, "Failed to fetch user info");
    }

    return (await res_info.json()) as {
      sub: number;
      name: string;
      given_name: string;
      family_name: string;
      email: string;
      picture: string;
      email_verified: boolean;
    };
  } catch (error) {
    console.log(error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Server error");
  }
};
