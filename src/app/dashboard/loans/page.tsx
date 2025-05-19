"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useLoans } from "@/hooks/useLoans";
import { Loan } from "@/types/Loan";
import Link from "next/link";

export default function LoansListPage() {
	const { data: session, status } = useSession();
	const role = session?.user.role;
	const { listLoans, approveLoan, rejectLoan } = useLoans();

	const [loans, setLoans] = useState<Loan[]>([]);
	const [loading, setLoading] = useState(true);
	const [actionId, setActionId] = useState<string | null>(null);

	const fetchLoans = useCallback(async () => {
		setLoading(true);
		try {
			const data = await listLoans();
			setLoans(data);
		} finally {
			setLoading(false);
		}
	}, [listLoans]);

	useEffect(() => {
		fetchLoans();
	}, [fetchLoans]);

	const handleApprove = async (id: string) => {
		setActionId(id + "_approve");
		await approveLoan(id);
		await fetchLoans();
		setActionId(null);
	};

	const handleReject = async (id: string) => {
		setActionId(id + "_reject");
		await rejectLoan(id);
		await fetchLoans();
		setActionId(null);
	};

	if (status === "loading" || loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<p className="text-gray-500">Cargando préstamos...</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			{/* Hero Section */}
			<header className="bg-white border-b border-gray-200 py-12">
				<div className="max-w-7xl mx-auto px-4 text-center">
					<h1 className="text-4xl font-bold text-gray-900">
						Gestión de Préstamos
					</h1>
					<p className="mt-2 text-lg text-gray-600">
						{role === "ADMIN"
							? "Administra y controla todas las solicitudes"
							: "Solicita y sigue el estado de tus préstamos"}
					</p>
					{role !== "ADMIN" && (
						<Link
							href="/dashboard/loans/create"
							className="mt-6 inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
							Solicitar Préstamo
						</Link>
					)}
				</div>
			</header>

			{/* Main Content */}
			<main className="flex-grow max-w-7xl mx-auto px-4 py-12">
				<h2 className="text-2xl font-semibold mb-6 text-gray-800">
					{role === "ADMIN" ? "Todos los Préstamos" : "Mis Préstamos"}
				</h2>

				{loans.length === 0 ? (
					<p className="text-gray-600">
						{role === "ADMIN"
							? "No hay préstamos registrados."
							: "No tienes préstamos solicitados."}
					</p>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{loans.map((loan) => {
							const statusLower = loan.status?.toLowerCase() ?? "";
							const isPending = statusLower === "pending";
							return (
								<div
									key={loan.id}
									className="bg-white p-6 rounded-lg shadow-sm hover:shadow transition">
									<div className="flex justify-between items-center mb-4">
										<h3 className="text-lg font-medium text-gray-900">
											Préstamo #{loan.id}
										</h3>
										<span
											className={`px-2 py-1 rounded-full text-sm ${
												loan.status.toUpperCase() === "APPROVED"
													? "bg-green-100 text-green-800"
													: loan.status.toUpperCase() === "REJECTED"
													? "bg-red-100 text-red-800"
													: "bg-yellow-100 text-yellow-800"
											}`}>
											{loan.status}
										</span>
									</div>

									<p className="text-gray-700 mb-2">
										<span className="font-semibold">Monto:</span> ${loan.amount}
									</p>
									<p className="text-gray-700 mb-4">
										<span className="font-semibold">Fecha:</span>{" "}
										{new Date(loan.createdAt).toLocaleDateString()}
									</p>

									<div className="flex justify-end space-x-2">
										{role === "ADMIN" && isPending ? (
											<>
												<button
													disabled={actionId === loan.id + "_approve"}
													onClick={() => handleApprove(loan.id)}
													className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition">
													{actionId === loan.id + "_approve"
														? "..."
														: "Aprobar"}
												</button>
												<button
													disabled={actionId === loan.id + "_reject"}
													onClick={() => handleReject(loan.id)}
													className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition">
													{actionId === loan.id + "_reject"
														? "..."
														: "Rechazar"}
												</button>
											</>
										) : (
											<Link
												href={`/dashboard/loans/${loan.id}`}
												className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition">
												Ver detalles
											</Link>
										)}
									</div>
								</div>
							);
						})}
					</div>
				)}
			</main>
		</div>
	);
}
