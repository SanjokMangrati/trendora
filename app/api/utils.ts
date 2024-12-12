import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid"; // to generate session IDs

function parseCookies(cookieHeader: string | null) {
	const cookies: { [key: string]: string } = {};
	if (!cookieHeader) return cookies;

	const cookieArray = cookieHeader.split(";");
	cookieArray.forEach((cookie) => {
		const [name, value] = cookie.split("=");
		if (name && value) {
			cookies[name.trim()] = value.trim();
		}
	});
	return cookies;
}

export async function getSession(request: NextRequest) {
	const cookieHeader = request.headers.get("cookie");
	const cookies = parseCookies(cookieHeader);
	let sessionId = cookies["sessionId"];

	// If no session cookie exists, create a new session
	if (!sessionId) {
		sessionId = uuidv4();
		await prisma.session.create({
			data: { id: sessionId, userId: Number(process.env.NEXT_PUBLIC_USER_ID) },
		});
	}

	// Retrieve the session from the database
	let session = await prisma.session.findUnique({
		where: { id: sessionId },
	});

	// If the session doesn't exist, create one
	if (!session) {
		session = await prisma.session.create({
			data: { id: sessionId, userId: Number(process.env.NEXT_PUBLIC_USER_ID) },
		});
	}

	return session;
}
