import { statisticsLinkWithUserId } from "@/lib/db/queries";
import { errorHandler } from "@/lib/error";
import { getPayloadWithJWT } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const GET = errorHandler(async (req: NextRequest) => {
  const payload = await getPayloadWithJWT(req);

  const data = await statisticsLinkWithUserId(payload?.id);

  return NextResponse.json({ success: true, message: "Success!", data: data });
});
