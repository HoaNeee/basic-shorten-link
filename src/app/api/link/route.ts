import { getLinksWithUserId } from "@/lib/db/queries";
import { errorHandler } from "@/lib/error";
import { getPayloadWithJWT } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const GET = errorHandler(async (req: NextRequest) => {
  const payload = await getPayloadWithJWT(req);

  const searchParams = req.nextUrl.searchParams;

  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit"));

  const data = await getLinksWithUserId(payload?.id, page, limit);

  return NextResponse.json({ success: true, message: "Success!", data: data });
});
