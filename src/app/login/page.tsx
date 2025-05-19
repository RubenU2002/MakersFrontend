"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/utils/schemas";
import type { z } from "zod";
import { signIn } from "next-auth/react";
import Input from "@/components/ui/Input";
import { useRouter, useSearchParams } from "next/navigation";

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
	const router = useRouter();
	const params = useSearchParams();
	const callbackUrl = params.get("callbackUrl") || "/dashboard";

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginForm>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data: LoginForm) => {
		const res = await signIn("credentials", {
			redirect: false,
			email: data.email,
			password: data.password,
		});
		if (res?.error) {
			console.error("Login error:", res.error);
		} else {
			router.push(callbackUrl);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="w-full max-w-md bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
				<h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
					Iniciar Sesión
				</h1>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-4">
					<Input
						label="Email"
						type="email"
						{...register("email")}
						error={errors.email?.message}
					/>
					<Input
						label="Contraseña"
						type="password"
						{...register("password")}
						error={errors.password?.message}
					/>
					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition">
						{isSubmitting ? "Cargando..." : "Entrar"}
					</button>
				</form>
				<p className="mt-4 text-center text-sm text-gray-600">
					¿No tienes cuenta?{" "}
					<a
						href="/register"
						className="text-indigo-600 hover:underline">
						Regístrate
					</a>
				</p>
			</div>
		</div>
	);
}
