import { updateUserWithId } from "@/lib/db/queries";
import { ApiError, errorHandler } from "@/lib/error";
import { getPayloadWithJWT } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = errorHandler(async (req: NextRequest) => {
  const body = await req.json();

  const { id } = body;

  const payload = await getPayloadWithJWT(req);

  if (payload?.id !== id) {
    throw new ApiError(403);
  }

  await updateUserWithId(body, id);

  return NextResponse.json({
    success: true,
    message: "Success!",
    data: {},
  });
});
