import { errorHandler } from "@/lib/error";
import { NextRequest, NextResponse } from "next/server";

export const GET = errorHandler(async (req: NextRequest) => {
  const domain = req.headers.get("x-forwarded-host");

  return NextResponse.json({
    success: true,
    message: "Success!",
    data: `${domain}`,
  });
});
