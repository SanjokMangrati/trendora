import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * @route GET /api/products
 * @desc Fetch all products available in the store
 * @returns List of all products
 */
export async function GET() {
	try {
		const products = await prisma.product.findMany();
		return NextResponse.json(products);
	} catch (error) {
		console.log(`Failed to fetch products | ${error}`);
		return NextResponse.json(
			{ error: `Failed to fetch products | Error Message: ${error}` },
			{ status: 500 }
		);
	}
}
