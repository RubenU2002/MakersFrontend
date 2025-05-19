"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export function useAuth() {
	const { data: session, status } = useSession();
	const loading = status === "loading";

	return {
		user: session?.user,
		loading,
		login: (email: string, password: string) =>
			signIn("credentials", { email, password, callbackUrl: "/dashboard" }),
		logout: () => signOut({ callbackUrl: "/login" }),
	};
}
