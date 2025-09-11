import { uploadCloud } from "@/helpers/uploadCloud";
import { errorHandler } from "@/lib/error";
import { NextRequest, NextResponse } from "next/server";

export const POST = errorHandler(async (req: NextRequest) => {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  const arrayBuffer = await file.arrayBuffer();

  const buffer = Buffer.from(arrayBuffer);

  const res = await uploadCloud(buffer);

  return NextResponse.json({
    success: true,
    message: "Success!",
    data: res.secure_url,
  });
});
