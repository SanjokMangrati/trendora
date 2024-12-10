import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/utils";

/**
 * @route POST /api/checkout/place-order
 * @desc Confirm and place the order
 * @body { discountCodeId: Int, discountCode: string }
 * @returns Order details
 */
export async function POST(req: NextRequest) {
	try {
		const { discountCodeId, discountCode } = await req.json();

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

		let finalTotal = cartTotal;
		let appliedDiscount = 0;
		let discountAmountApplied = 0;

		// Validate and apply discount code if provided
		if (discountCodeId && discountCode) {
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

			appliedDiscount = validDiscountCode.discount;
			finalTotal = cartTotal - cartTotal * (appliedDiscount / 100);
			discountAmountApplied = cartTotal - finalTotal;

			// Mark the discount code as used
			await prisma.discountCode.update({
				where: { id: validDiscountCode.id },
				data: { used: true },
			});
		}

		// Create the order
		const order = await prisma.order.create({
			data: {
				sessionId: session.id,
				totalAmount: finalTotal,
				discountAmountApplied: discountAmountApplied,
				discountCodeId: discountCodeId ? discountCodeId : null,
				userId: user.id,
			},
		});

		// Clear the user's cart
		await prisma.cartItem.deleteMany({
			where: { cartId: cart.id },
		});

		return NextResponse.json({
			message: "Order placed successfully!",
			order,
		});
	} catch (error) {
		console.error(`Failed to place order | ${error}`);
		return NextResponse.json(
			{ error: `Failed to place order | Error Message: ${error}` },
			{ status: 500 }
		);
	}
}
