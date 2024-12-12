import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { CustomJwtPayload } from "@/lib/types/jwt.types";

/**
 * @route POST /api/admin/generate-discount
 * @desc Generate discount for provided user
 * @returns Success status with discount detail
 */
export async function POST(request: Request) {
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

		const { userId } = await request.json();

		if (!userId) {
			return NextResponse.json(
				{ error: "User Id is required" },
				{ status: 400 }
			);
		}

		// Fetch user and orders
		const user = await prisma.user.findUnique({
			where: { id: userId },
		});

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		const orderCount = await prisma.order.count({
			where: { userId: user.id },
		});

		const milestone = 5; // Could make this dynamic

		// Check nth-order logic
		if ((orderCount + 1) % milestone !== 0) {
			return NextResponse.json(
				{
					error: `User does not meet the nth order condition.`,
				},
				{ status: 400 }
			);
		}

		// Generate unique discount code
		const discountCode = `DISCOUNT-${Math.random()
			.toString(36)
			.substring(2, 10)
			.toUpperCase()}`;

		const newDiscount = await prisma.discountCode.create({
			data: {
				code: discountCode,
				discount: 10, // 10% discount but we can have a feature added to get this value from admin
				userId: user.id,
				used: false,
			},
		});

		return NextResponse.json({ success: true, discountCode: newDiscount });
	} catch (error) {
		console.log(`Error generating discount code | ${error}`);
		return NextResponse.json(
			{ error: `Internal server error | Error Message: ${error}` },
			{ status: 500 }
		);
	}
}
