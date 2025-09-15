import { getLinkWithCodeOrId, getUserWithId, saveLogs } from "@/lib/db/queries";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
	request: NextRequest,
	{ params }: { params: Promise<{ code: string }> }
) => {
	try {
		const is_guest = request.cookies.get("is_guest")?.value === "true";

		const { code } = await params;

		const link = await getLinkWithCodeOrId(code);

		const user_id = link.user_id;

		const user = await getUserWithId(user_id);

		if (user && !is_guest) {
			await saveLogs({ link_id: link.id });
		}

		return NextResponse.redirect(link.main_url);
	} catch (error) {
		console.log(error);
		return NextResponse.redirect("/");
	}
};
