export type Loan = {
	id: string;
	amount: number;
	status: "PENDING" | "APPROVED" | "REJECTED";
	userId: number;
	createdAt: string;
};
