import { getLinkWithCode } from "@/lib/db/queries";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) => {
  try {
    const { code } = await params;

    const link = await getLinkWithCode(code);

    return NextResponse.redirect(link.main_url);
  } catch (error) {
    console.log(error);
  }
};
