import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { CustomJwtPayload } from "@/lib/types/jwt.types";

/**
 * @route GET /api/admin/analytics
 * @desc Fetch analytics data for admin
 * @returns Analytics data
 */
export async function GET(request: Request) {
	try {
		const token = request.headers.get("Authorization");
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

		// Fetch analytics data
		const totalItemsPurchased = await prisma.order.aggregate({
			_sum: { totalItemsPurchased: true },
		});

		const totalPurchaseAmount = await prisma.order.aggregate({
			_sum: { totalPurchaseAmount: true },
		});

		const discountCodes = await prisma.discountCode.findMany({
			select: { code: true, discount: true, used: true, createdAt: true },
		});

		const totalDiscountAmount = await prisma.order.aggregate({
			_sum: { discountAmountApplied: true },
		});

		return NextResponse.json({
			success: true,
			analytics: {
				totalItemsPurchased: totalItemsPurchased._sum.totalItemsPurchased || 0,
				totalPurchaseAmount: totalPurchaseAmount._sum.totalPurchaseAmount || 0,
				discountCodes,
				totalDiscountAmount:
					totalDiscountAmount._sum.discountAmountApplied || 0,
			},
		});
	} catch (error) {
		console.error(`Error fetching analytics | ${error}`);
		return NextResponse.json(
			{ error: `Internal server error | Error Message: ${error}` },
			{ status: 500 }
		);
	}
}
