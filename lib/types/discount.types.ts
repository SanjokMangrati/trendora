export type DiscountCode = {
	code: string;
	id: number;
	discount: number;
	createdAt: Date;
	userId: number;
	used: boolean;
};
