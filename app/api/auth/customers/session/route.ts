import { getSession } from "@/app/api/utils";
import { NextRequest, NextResponse } from "next/server";

/**
 * @route GET /api/auth/customers
 * @desc Fetch session info
 * @returns Session info
 */
export async function GET(req: NextRequest) {
	try {
		const session = await getSession(req);

		const response = NextResponse.json({
			message: "Session fetched/created",
			sessionId: session.id,
		});
		response.cookies.set("sessionId", session.id, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			maxAge: 60 * 60 * 24 * 7,
		});
		return response;
	} catch (error) {
		console.log(`Failed to session info | ${error}`);
		return NextResponse.json(
			{ error: `Failed to fetch session info | Error Message: ${error}` },
			{ status: 500 }
		);
	}
}
