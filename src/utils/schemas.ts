import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().min(1, "El email es requerido").email("Email inválido"),
	password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const registerSchema = z
	.object({
		name: z.string().min(1, "El nombre es requerido"),
		email: z.string().min(1, "El email es requerido").email("Email inválido"),
		password: z
			.string()
			.min(6, "La contraseña debe tener al menos 6 caracteres"),
		confirmPassword: z.string().min(6, "Confirma tu contraseña"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Las contraseñas no coinciden",
		path: ["confirmPassword"],
	});

export const loanSchema = z.object({
	amount: z.number().min(1, "El monto debe ser mayor que 0"),
	term: z.number().min(1, "El plazo debe ser al menos 1 mes"),
});
