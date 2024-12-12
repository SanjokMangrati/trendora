export type AnalyticsData = {
	totalItemsPurchased: number;
	totalPurchaseAmount: number;
	discountCodes: Array<{
		code: string;
		discount: number;
		used: boolean;
		createdAt: string;
	}>;
	totalDiscountAmount: number;
};

export const DEFAULT_ANALYTICS_DATA = {
	totalItemsPurchased: 200,
	totalPurchaseAmount: 30000,
	discountCodes: [],
	totalDiscountAmount: 1000,
};
