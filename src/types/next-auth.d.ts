import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface Session extends DefaultSession {
		user: DefaultSession["user"] & {
			id: string;
			accessToken: string;
			role: "USER" | "ADMIN";
		};
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		accessToken: string;
		role: "USER" | "ADMIN";
	}
}
