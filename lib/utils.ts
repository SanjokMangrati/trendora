import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import prisma from "./prisma";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function getSession() {
	const cookieStore = await cookies();
	let sessionId = cookieStore.get("sessionId")?.value;

	// If no session cookie exists, create a new session
	if (!sessionId) {
		sessionId = uuidv4();
		cookieStore.set("sessionId", sessionId, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			path: "/",
			maxAge: 60 * 60 * 24 * 7,
		});

		// Create a new session in the database
		await prisma.session.create({
			data: { id: sessionId },
		});
	}

	// Retrieve the session from the database
	let session = await prisma.session.findUnique({
		where: { id: sessionId },
	});

	// If the session doesn't exist (edge case), create one
	if (!session) {
		session = await prisma.session.create({
			data: { id: sessionId },
		});
	}

	return session;
}
