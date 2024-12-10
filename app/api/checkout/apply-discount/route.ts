import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/utils";

/**
 * @route POST /api/checkout/apply-discount
 * @desc Validate and apply discount code
 * @body {discountCodeId: Int, discountCode: string }
 * @returns Updated total with applied discount
 */
export async function POST(req: NextRequest) {
	try {
		const { discountCodeId, discountCode } = await req.json();

		const session = await getSession();

		if (!session?.id) {
			return NextResponse.json({ error: "Session expired!" }, { status: 401 });
		}

		// Check if the discount coupon details is provided or not
		if (!discountCodeId || !discountCode)
			return NextResponse.json(
				{ error: "Discount Coupon Not Provided!" },
				{ status: 400 }
			);

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

		// Though we won't show apply button, but if somehow user forcefully tries to apply a discount code we handle it here
		const orderCount = await prisma.order.count({ where: { userId: user.id } });
		const milestone = 5; // Could make this dynamic
		if ((orderCount + 1) % milestone !== 0) {
			return NextResponse.json(
				{
					error: `You do not meet the nth order condition.`,
				},
				{ status: 400 }
			);
		}

		// Validate discount code
		const validDiscountCode = await prisma.discountCode.findFirst({
			where: {
				id: discountCodeId,
				AND: {
					code: discountCode,
				},
				userId: user.id,
				used: false,
			},
		});

		if (!validDiscountCode) {
			return NextResponse.json(
				{ error: "Invalid or expired discount code." },
				{ status: 400 }
			);
		}

		// Retrieve user's cart
		const cart = await prisma.cart.findUnique({
			where: { sessionId: session.id },
		});

		if (!cart) {
			return NextResponse.json({ error: "Cart is empty." }, { status: 404 });
		}

		// Retrieve cart items
		const cartItems = await prisma.cartItem.findMany({
			where: {
				cartId: cart.id,
			},
			include: {
				product: true,
			},
		});

		if (!cartItems.length) {
			return NextResponse.json({ error: "Cart is empty." }, { status: 404 });
		}

		// Calculate cart total
		const cartTotal = cartItems.reduce(
			(sum, item) => sum + item.product.price * item.quantity,
			0
		);

		// Apply discount and calculate final total after discount
		const appliedDiscount = validDiscountCode.discount;
		const finalTotal = cartTotal - cartTotal * (appliedDiscount / 100);

		return NextResponse.json({
			cartItems,
			cartTotal,
			appliedDiscount,
			finalTotal,
		});
	} catch (error) {
		console.error(`Failed to apply discount code | ${error}`);
		return NextResponse.json(
			{ error: `Failed to apply discount code | Error Message: ${error}` },
			{ status: 500 }
		);
	}
}
