"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLoans } from "@/hooks/useLoans";
import Input from "@/components/ui/Input";
import { loanSchema } from "@/utils/schemas";

type LoanForm = z.infer<typeof loanSchema>;

export default function CreateLoanPage() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const { requestLoan } = useLoans();

	useEffect(() => {
		if (status === "authenticated" && session?.user.role === "ADMIN") {
			router.replace("/dashboard/loans");
		}
	}, [status, session?.user.role, router]);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoanForm>({
		resolver: zodResolver(loanSchema),
		defaultValues: { amount: 0, term: 1 },
	});

	const onSubmit = async (data: LoanForm) => {
		try {
			await requestLoan(data);
			router.push("/dashboard/loans");
		} catch (err) {
			console.error(err);
		}
	};

	if (status !== "authenticated") {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<p className="text-gray-500">Cargando...</p>
			</div>
		);
	}

	return (
		<div className="max-w-md mx-auto bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
			<h2 className="text-2xl font-semibold text-gray-900 mb-6">
				Solicitar Préstamo
			</h2>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="space-y-4">
				<Input
					label="Monto"
					type="number"
					step="0.01"
					{...register("amount", { valueAsNumber: true })}
					error={errors.amount?.message}
				/>
				<button
					type="submit"
					disabled={isSubmitting}
					className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition">
					{isSubmitting ? "Enviando..." : "Solicitar"}
				</button>
			</form>
		</div>
	);
}
