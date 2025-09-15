import { getLinkWithCodeOrId, saveLogs } from "@/lib/db/queries";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
	request: NextRequest,
	{ params }: { params: Promise<{ code: string }> }
) => {
	try {
		const { code } = await params;

		const link = await getLinkWithCodeOrId(code);

		await saveLogs({ link_id: link.id });

		return NextResponse.redirect(link.main_url);
	} catch (error) {
		console.log(error);
		return NextResponse.redirect("/");
	}
};
