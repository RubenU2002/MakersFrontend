"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useLoans } from "@/hooks/useLoans";
import { Loan } from "@/types/Loan";

export default function LoanDetailPage() {
	const params = useParams();
	const rawId = params.id;
	const id = Array.isArray(rawId) ? rawId[0] : rawId;

	const router = useRouter();
	const { getLoan, approveLoan, rejectLoan } = useLoans();
	const [loan, setLoan] = useState<Loan | null>(null);
	const [loading, setLoading] = useState(true);
	const [actionInProgress, setActionInProgress] = useState<
		"approve" | "reject" | null
	>(null);

	useEffect(() => {
		if (!id) return;
		setLoading(true);
		getLoan(id)
			.then((data) => setLoan(data))
			.catch(() => setLoan(null))
			.finally(() => setLoading(false));
	}, [id, getLoan]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<p className="text-gray-500">Cargando préstamo...</p>
			</div>
		);
	}

	if (!loan) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<p className="text-gray-600">Préstamo no encontrado.</p>
			</div>
		);
	}

	return (
		<div className="max-w-md mx-auto bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
			<h2 className="text-2xl font-semibold text-gray-900 mb-4">
				Préstamo #{loan.id}
			</h2>
			<div className="space-y-2 text-gray-700 mb-6">
				<p>
					<span className="font-medium">Monto:</span> ${loan.amount}
				</p>
				<p>
					<span className="font-medium">Estado:</span>
					<span
						className={`ml-2 inline-block px-2 py-1 rounded-full text-sm ${
							loan.status === "APPROVED"
								? "bg-green-100 text-green-800"
								: loan.status === "REJECTED"
								? "bg-red-100 text-red-800"
								: "bg-yellow-100 text-yellow-800"
						}`}>
						{loan.status}
					</span>
				</p>
				<p>
					<span className="font-medium">Fecha:</span>{" "}
					{new Date(loan.createdAt).toLocaleDateString()}
				</p>
			</div>

			{loan.status === "PENDING" && (
				<div className="flex space-x-3">
					<button
						onClick={async () => {
							setActionInProgress("approve");
							await approveLoan(loan.id);
							router.push("/dashboard/loans");
						}}
						disabled={actionInProgress === "approve"}
						className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition">
						{actionInProgress === "approve" ? "..." : "Aprobar"}
					</button>
					<button
						onClick={async () => {
							setActionInProgress("reject");
							await rejectLoan(loan.id);
							router.push("/dashboard/loans");
						}}
						disabled={actionInProgress === "reject"}
						className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition">
						{actionInProgress === "reject" ? "..." : "Rechazar"}
					</button>
				</div>
			)}
		</div>
	);
}
