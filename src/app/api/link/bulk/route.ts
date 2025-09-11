import { bulkDeleteLink, getLinkWithCodeOrId } from "@/lib/db/queries";
import { ApiError, errorHandler } from "@/lib/error";
import { getPayloadWithJWT } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = errorHandler(async (req: NextRequest) => {
  const payload = await getPayloadWithJWT(req);

  const body = await req.json();

  const ids = body.ids as number[];

  const links = await Promise.all(
    ids.map((id) => {
      return getLinkWithCodeOrId(undefined, id);
    })
  );

  if (links.some((li) => li.user_id !== payload?.id)) {
    throw new ApiError(403);
  }

  await bulkDeleteLink(ids);

  return NextResponse.json({ success: true, message: "Success!", data: {} });
});
