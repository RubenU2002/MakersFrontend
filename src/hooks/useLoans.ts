"use client";

import { useSession } from "next-auth/react";
import { useCallback } from "react";
import API from "@/lib/api";
import { Loan } from "@/types/Loan";

export function useLoans() {
	const { data: session } = useSession();
	const token = session?.user.accessToken ?? "";
	const userId = Number(session?.user.id);
	const headers = { Authorization: `Bearer ${token}` };

	const listLoans = useCallback(async (): Promise<Loan[]> => {
		const rawId = session?.user.id;
		const userId = Number(rawId);
		if (!rawId || isNaN(userId)) {
			return [];
		}
		const res = await API.get<Loan[]>(`/loan/byUser/${userId}`, { headers });
		return res.data;
	}, [session, token]);

	const getLoan = useCallback(
		async (id: string): Promise<Loan> => {
			const res = await API.get<Loan>(`/loan/${id}`, { headers });
			return res.data;
		},
		[token]
	);

	const requestLoan = useCallback(
		async (payload: { amount: number; term: number }): Promise<Loan> => {
			const dto = {
				amount: payload.amount,
				status: "PENDING" as const,
				userId,
				createdAt: new Date().toISOString(),
			};
			const res = await API.post<Loan>("/loan", dto, { headers });
			return res.data;
		},
		[token, userId]
	);

	const approveLoan = useCallback(
		async (id: string): Promise<Loan> => {
			const res = await API.post<Loan>(`/loan/${id}/approve`, null, {
				headers,
			});
			return res.data;
		},
		[token]
	);

	const rejectLoan = useCallback(
		async (id: string): Promise<Loan> => {
			const res = await API.post<Loan>(`/loan/${id}/reject`, null, { headers });
			return res.data;
		},
		[token]
	);

	return { listLoans, getLoan, requestLoan, approveLoan, rejectLoan };
}
