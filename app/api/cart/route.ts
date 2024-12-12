import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "../utils";

/**
 * @route GET /api/cart
 * @desc Get the user's current cart contents
 * @returns List of cart items and total cart price
 */
export async function GET(req: NextRequest) {
	try {
		const session = await getSession(req);

		if (!session?.id) {
			return NextResponse.json({ error: "Session expired!" }, { status: 401 });
		}

		// Check if user has cart for this session
		let cart = await prisma.cart.findUnique({
			where: { sessionId: session.id },
		});

		// If no cart exists, create a new one
		if (!cart) {
			cart = await prisma.cart.create({
				data: { sessionId: session.id },
			});
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

		// Calculate individual item total based on quantity
		const itemsWithPrices = cartItems.map((item) => ({
			...item,
			totalPrice: item.product.price * item.quantity,
		}));

		// Calculate cart total
		const cartTotal = itemsWithPrices.reduce(
			(sum, item) => sum + item.totalPrice,
			0
		);

		return NextResponse.json({
			items: itemsWithPrices,
			total: cartTotal,
		});
	} catch (error) {
		console.log(`Failed to fetch cart | ${error}`);
		return NextResponse.json(
			{ error: `Failed to fetch cart | Error Message: ${error}` },
			{ status: 500 }
		);
	}
}

/**
 * @route POST /api/cart
 * @desc Add or update a product in the cart
 * @body { productId: number, quantity: number }
 * @returns Updated cart
 */
export async function POST(req: NextRequest) {
	try {
		const { productId, quantity } = await req.json();

		// Check if the product details are valid
		if (!productId || !quantity || quantity <= 0) {
			return NextResponse.json(
				{ error: "Invalid product or quantity" },
				{ status: 400 }
			);
		}

		const session = await getSession(req);

		// Check if the session is valid
		if (!session?.id) {
			return NextResponse.json({ error: "Session expired!" }, { status: 401 });
		}

		// Check if the user has a cart for this session
		let cart = await prisma.cart.findUnique({
			where: { sessionId: session.id },
		});

		// If no cart exists, create a new one
		if (!cart) {
			cart = await prisma.cart.create({
				data: { sessionId: session.id },
			});
		}

		// Check if the product already exists in the cart
		const existingCartItem = await prisma.cartItem.findFirst({
			where: {
				cartId: cart.id,
				productId,
			},
		});

		if (existingCartItem) {
			// If item exists, update the quantity
			const updatedCartItem = await prisma.cartItem.update({
				where: {
					id: existingCartItem.id,
				},
				data: {
					quantity: existingCartItem.quantity + quantity,
				},
			});

			return NextResponse.json(updatedCartItem);
		} else {
			// If item doesn't exist, create a new cart item
			const cartItem = await prisma.cartItem.create({
				data: {
					cartId: cart.id,
					productId,
					quantity,
				},
			});

			return NextResponse.json(cartItem);
		}
	} catch (error) {
		console.log(`Failed to add/update product in cart | ${error}`);
		return NextResponse.json(
			{
				error: `Failed to add/update product in cart | Error Message: ${error}`,
			},
			{ status: 500 }
		);
	}
}

/**
 * @route DELETE /api/cart
 * @desc Remove a specific product or decrease it's quantity from the cart
 * @body { productId: number, quantity?: number }
 * @returns Updated cart or success message
 */
export async function DELETE(req: NextRequest) {
	try {
		const { productId, quantity } = await req.json();

		if (!productId) {
			return NextResponse.json(
				{ error: "Product ID is required" },
				{ status: 400 }
			);
		}

		const session = await getSession(req);

		if (!session?.id) {
			return NextResponse.json({ error: "Session expired!" }, { status: 401 });
		}

		// Check if user has cart for this session (edge case)
		const cart = await prisma.cart.findUnique({
			where: { sessionId: session.id },
		});

		if (!cart) {
			return NextResponse.json({ error: "Cart not found." }, { status: 404 });
		}

		// Find the cart item (product in the cart)
		const existingCartItem = await prisma.cartItem.findFirst({
			where: {
				cartId: cart.id,
				productId,
			},
		});

		if (!existingCartItem) {
			return NextResponse.json(
				{ error: "Product not found in cart." },
				{ status: 404 }
			);
		}

		// If quantity is provided, decrement the quantity (in most cases we will simply receive 1 in quantity)
		// If quantity provided is 0, remove product from cart
		if (quantity && quantity > 0) {
			if (existingCartItem.quantity > quantity) {
				// Update the quantity
				const updatedCartItem = await prisma.cartItem.update({
					where: { id: existingCartItem.id },
					data: { quantity: existingCartItem.quantity - quantity },
				});

				return NextResponse.json(updatedCartItem);
			} else {
				// Remove the item completely
				await prisma.cartItem.delete({
					where: { id: existingCartItem.id },
				});

				return NextResponse.json({ message: "Product removed from cart." });
			}
		} else {
			// If quantity is not provided, remove the item completely
			await prisma.cartItem.delete({
				where: { id: existingCartItem.id },
			});

			return NextResponse.json({ message: "Product removed from cart." });
		}
	} catch (error) {
		console.log(`Failed to remove product from cart | ${error}`);
		return NextResponse.json(
			{ error: `Failed to remove product from cart | ${error}` },
			{ status: 500 }
		);
	}
}
