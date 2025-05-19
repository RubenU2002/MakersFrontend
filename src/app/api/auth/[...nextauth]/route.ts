import NextAuth, { AuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import API from "@/lib/api";

export const authOptions: AuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials) return null;
				try {
					const { data } = await API.post("/Auth/login", {
						email: credentials.email,
						password: credentials.password,
					});
					const { userId, email, role, token } = data;
					return {
						id: userId.toString(),
						name: email,
						email,
						role: role.toUpperCase() === "ADMIN" ? "ADMIN" : "USER",
						accessToken: token,
					};
				} catch (err) {
					console.error("Login failed", err);
					return null;
				}
			},
		}),
	],

	session: { strategy: "jwt" as const },

	callbacks: {
		async jwt({ token, user }: { token: JWT; user?: any }) {
			if (user) {
				token.id = user.id;
				token.accessToken = user.accessToken;
				token.role = user.role;
			}
			return token;
		},
		async session({ session, token }: { session: Session; token: JWT }) {
			session.user.id = token.id!;
			session.user.accessToken = token.accessToken!;
			session.user.role = token.role!;
			return session;
		},
	},

	pages: { signIn: "/login" },
	secret: process.env.NEXTAUTH_SECRET!,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
