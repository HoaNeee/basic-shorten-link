import { NextRequest, NextResponse } from "next/server";

export const GET = async (
	request: NextRequest,
	{ params }: { params: Promise<{ code: string }> }
) => {
	try {
		const { code } = await params;

		console.log(code);

		return NextResponse.redirect("http://localhost:3000/blogs");
	} catch (error) {
		console.log(error);
	}
};
