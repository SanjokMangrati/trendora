import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { CustomJwtPayload } from "@/lib/types/jwt.types";

/**
 * @route GET /api/admin/customers
 * @desc Fetch list of customers
 * @returns List of customers
 */
export async function GET(request: Request) {
	try {
		const cookieHeader = request.headers.get("cookie") || "";
		const token = cookieHeader
			.split(";")
			.find((cookie) => cookie.trim().startsWith("token="))
			?.split("=")[1];

		if (!token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
		}

		let decoded;
		try {
			decoded = jwt.verify(
				token,
				process.env.NEXT_PUBLIC_JWT_SECRET as string
			) as CustomJwtPayload;
		} catch {
			return NextResponse.json({ error: "Invalid token" }, { status: 403 });
		}

		// Ensure the user is an admin
		if (!decoded.isAdmin) {
			return NextResponse.json(
				{ error: "Admin privileges required" },
				{ status: 403 }
			);
		}

		// Fetch customer data
		const customers = await prisma.user.findMany({
			where: { isAdmin: false },
			include: {
				Session: {
					orderBy: {
						createdAt: "desc",
					},
					take: 1,
					include: {
						orders: true,
					},
				},
			},
		});

		return NextResponse.json({
			success: true,
			customers,
		});
	} catch (error) {
		console.log(`Error fetching customers | ${error}`);
		return NextResponse.json(
			{ error: `Internal server error | Error Message: ${error}` },
			{ status: 500 }
		);
	}
}
