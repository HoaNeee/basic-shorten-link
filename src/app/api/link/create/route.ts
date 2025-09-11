import { getLinksWithUserId, getUserWithId, saveLink } from "@/lib/db/queries";
import { ApiError, errorHandler } from "@/lib/error";
import { getPayloadWithJWT } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const POST = errorHandler(async (req: NextRequest) => {
  const body = await req.json();
  const { main_url, domain, user_id } = body;

  const payload = await getPayloadWithJWT(req);

  const current_user_id = payload?.id;

  if (current_user_id !== user_id) {
    throw new ApiError(403);
  }

  const user = await getUserWithId(current_user_id || user_id);

  if (!user) {
    throw new ApiError(404);
  }

  if (user.is_guest) {
    const { total_record } = await getLinksWithUserId(user.id);
    if (total_record >= 10) {
      throw new ApiError(400, "This action is overloaded.");
    }
  }

  const data = await saveLink(user_id, main_url, domain);

  return NextResponse.json({ success: true, message: "Success!", data: data });
});
