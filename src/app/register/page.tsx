"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/utils/schemas";
import type { z } from "zod";
import API from "@/lib/api";
import Input from "@/components/ui/Input";
import { useRouter } from "next/navigation";

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<RegisterForm>({
		resolver: zodResolver(registerSchema),
	});

	const onSubmit = async (data: RegisterForm) => {
		try {
			await API.post("/auth/register", {
				name: data.name,
				email: data.email,
				password: data.password,
			});
			router.push("/login?registered=1");
		} catch (err) {
			console.error("Register error:", err);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="w-full max-w-md bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
				<h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
					Crear Cuenta
				</h1>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-4">
					<Input
						label="Nombre"
						{...register("name")}
						error={errors.name?.message}
					/>
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
					<Input
						label="Confirmar Contraseña"
						type="password"
						{...register("confirmPassword")}
						error={errors.confirmPassword?.message}
					/>
					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition">
						{isSubmitting ? "Cargando..." : "Registrarme"}
					</button>
				</form>
				<p className="mt-4 text-center text-sm text-gray-600">
					¿Ya tienes cuenta?{" "}
					<a
						href="/login"
						className="text-indigo-600 hover:underline">
						Inicia Sesión
					</a>
				</p>
			</div>
		</div>
	);
}
