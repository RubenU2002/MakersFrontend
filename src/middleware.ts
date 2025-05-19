import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
	const { pathname, origin } = req.nextUrl;

	if (
		pathname.startsWith("/_next") ||
		pathname.startsWith("/api/auth") ||
		pathname.includes(".")
	) {
		return NextResponse.next();
	}

	if (pathname.startsWith("/dashboard")) {
		const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! });
		if (!token) {
			const loginUrl = new URL("/login", origin);
			loginUrl.searchParams.set("callbackUrl", pathname);
			return NextResponse.redirect(loginUrl);
		}
	}

	if (pathname.startsWith("/api/loans")) {
		const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! });
		if (!token) {
			return new NextResponse("Unauthorized", { status: 401 });
		}
		if (req.method === "PATCH" && token.role !== "ADMIN") {
			return new NextResponse("Forbidden", { status: 403 });
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard/:path*", "/api/loans/:path*"],
};
