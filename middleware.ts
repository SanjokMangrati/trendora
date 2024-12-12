import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
	if (request.nextUrl.pathname === "/admin/login") {
		console.log("Accessing /admin/login, allowing request.");
		return NextResponse.next();
	}

	const protectedRoutes = ["/admin/customers", "/admin/analytics"];

	if (
		protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
	) {
		const cookieHeader = request.headers.get("cookie") || "";

		const token = cookieHeader
			.split(";")
			.find((cookie) => cookie.trim().startsWith("token="))
			?.split("=")[1];

		if (!token) {
			console.log("No token found, redirecting to /admin/login");
			return NextResponse.redirect(new URL("/admin/login", request.url));
		}

		try {
			const secret = new TextEncoder().encode(
				process.env.NEXT_PUBLIC_JWT_SECRET
			);
			const { payload } = await jwtVerify(token, secret);

			console.log("Token verified successfully:", payload);
		} catch (error) {
			console.log("Token verification failed:", error);
			return NextResponse.redirect(new URL("/admin/login", request.url));
		}
	}

	const requestHeaders = new Headers(request.headers);
	requestHeaders.set("x-pathname", request.nextUrl.pathname);

	return NextResponse.next({
		request: {
			headers: requestHeaders,
		},
	});
}

export const config = {
	matcher: ["/admin/:path*"],
};
