"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { useSession, signOut } from "next-auth/react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
	const { data: session, status } = useSession();
	const role = session?.user.role;

	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			{/* Header */}
			<header className="bg-white border-b shadow-sm sticky top-0 z-10">
				<div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
					<Link
						href="/dashboard"
						className="text-xl font-semibold text-gray-900">
						Loans Dashboard
					</Link>
					<nav className="flex items-center space-x-6">
						{status === "loading" ? (
							<span className="text-gray-500">Cargando…</span>
						) : (
							<Link
								href="/dashboard/loans"
								className="text-gray-700 hover:text-gray-900 font-medium transition">
								{role === "ADMIN" ? "Todos los Préstamos" : "Mis Préstamos"}
							</Link>
						)}
						<button
							onClick={() => signOut({ callbackUrl: "/login" })}
							className="text-gray-600 hover:text-gray-800 font-medium transition">
							Cerrar sesión
						</button>
					</nav>
				</div>
			</header>

			{/* Main Content */}
			<main className="flex-grow max-w-7xl mx-auto px-6 py-8">{children}</main>

			{/* Footer */}
			<footer className="bg-white border-t py-4">
				<div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
					© {new Date().getFullYear()} Ruben Urrego. Todos los derechos
					reservados.
				</div>
			</footer>
		</div>
	);
}
