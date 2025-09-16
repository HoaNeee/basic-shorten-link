import { getDataChartLink } from "@/lib/db/queries";
import { errorHandler } from "@/lib/error";
import { NextRequest, NextResponse } from "next/server";

export const GET = errorHandler(async (req: NextRequest, { params }) => {
  const { code } = await params;

  const searchParams = req.nextUrl.searchParams;

  const typeTime = searchParams.get("typeTime") || "day";

  const dateFrom =
    searchParams.get("dateFrom") || new Date().toLocaleDateString();
  const dateTo = searchParams.get("dateTo") || new Date().toLocaleDateString();

  const data = await getDataChartLink(typeTime, dateFrom, dateTo, code);

  return NextResponse.json({ success: true, message: "Success!", data: data });
});
