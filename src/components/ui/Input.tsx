"use client";
import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string;
	error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
	({ label, error, ...props }, ref) => (
		<div className="mb-4">
			<label className="block text-sm font-medium mb-1">{label}</label>
			<input
				ref={ref}
				className={`
          w-full px-3 py-2 border rounded
          focus:outline-none focus:ring-2 focus:ring-indigo-500
          ${error ? "border-red-500" : "border-gray-300"}
        `}
				{...props}
			/>
			{error && <p className="text-red-500 text-xs mt-1">{error}</p>}
		</div>
	)
);

Input.displayName = "Input";
export default Input;
