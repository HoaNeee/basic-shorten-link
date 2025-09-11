import { deleteLink, getLinkWithCodeOrId, updateLink } from "@/lib/db/queries";
import { ApiError, errorHandler } from "@/lib/error";
import { getPayloadWithJWT } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const GET = errorHandler(async (req: NextRequest, { params }) => {
  const { code } = await params;

  const payload = await getPayloadWithJWT(req);

  const link = await getLinkWithCodeOrId(code);

  if (link.user_id !== payload?.id) {
    throw new ApiError(403);
  }

  return NextResponse.json({ success: true, message: "Success!", data: link });
});

export const PATCH = errorHandler(async (req: NextRequest, { params }) => {
  const { code } = await params;
  const body = await req.json();

  const payload_jwt = await getPayloadWithJWT(req);

  const link = await getLinkWithCodeOrId(code);

  if (link.user_id !== payload_jwt?.id) {
    throw new ApiError(403);
  }

  const data = await updateLink(code, body);

  return NextResponse.json({ success: true, message: "Success!", data: data });
});

export const DELETE = errorHandler(async (req: NextRequest, { params }) => {
  const { code } = await params;

  const payload_jwt = await getPayloadWithJWT(req);

  const link = await getLinkWithCodeOrId(code);

  if (link.user_id !== payload_jwt?.id) {
    throw new ApiError(403);
  }

  const data = await deleteLink(link.id);

  return NextResponse.json({ success: true, message: "Success!", data: data });
});
