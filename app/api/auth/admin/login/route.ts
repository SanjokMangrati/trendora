import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

/**
 * @route POST /api/auth/admin/login
 * @desc Login endpoint for admin
 * @body Email and Password of the admin
 * @returns Success status and token if login is successful
 */
export async function POST(request: Request) {
	try {
		const { email, password } = await request.json();

		// If email or password not provided throw error
		if (!email || !password) {
			return NextResponse.json(
				{ error: "Email and password are required" },
				{ status: 400 }
			);
		}

		const user = await prisma.user.findUnique({ where: { email } });

		// Check if user exists and is an admin
		if (!user || !user.isAdmin) {
			return NextResponse.json(
				{ error: "Invalid credentials" },
				{ status: 401 }
			);
		}

		// Validate password
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return NextResponse.json(
				{ error: "Invalid credentials" },
				{ status: 401 }
			);
		}

		// Generate JWT
		const token = jwt.sign(
			{ id: user.id, email: user.email, isAdmin: user.isAdmin },
			process.env.NEXT_PUBLIC_JWT_SECRET as string,
			{
				expiresIn: "15d",
			}
		);

		const response = NextResponse.json({ success: true });
		response.headers.set(
			"Set-Cookie",
			`token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${
				15 * 24 * 60 * 60
			}`
		);

		return response;
	} catch (error) {
		console.log(`Login error | ${error}`);
		return NextResponse.json(
			{ error: `Internal server error | Error Message: ${error}` },
			{ status: 500 }
		);
	}
}
