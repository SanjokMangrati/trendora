import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/utils";

/**
 * @route GET /api/checkout
 * @desc Display checkout details with discount code details if it exists
 * @returns Cart summary and discount code if it exists
 */
export async function GET(req: NextRequest) {
	try {
		const session = await getSession();

		if (!session?.id) {
			return NextResponse.json({ error: "Session expired!" }, { status: 401 });
		}

		// Find the user based on their session id
		const user = await prisma.user.findFirst({
			where: {
				Session: {
					some: {
						id: session.id,
					},
				},
			},
		});

		// For the demo purpose bypassing login but if in future we add a login then only logged-in users can checkout
		if (!user)
			return NextResponse.json(
				{ error: "Please login to place order!" },
				{ status: 401 }
			);

		// Retrieve all discount codes available to user
		const discountCodes = await prisma.discountCode.findMany({
			where: { userId: user.id },
		});

		return NextResponse.json({
			discountCodes,
		});
	} catch (error) {
		console.error(`Failed to display checkout details | ${error}`);
		return NextResponse.json(
			{ error: `Failed to display checkout details | Error Message: ${error}` },
			{ status: 500 }
		);
	}
}
