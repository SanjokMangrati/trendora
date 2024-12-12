export type Customer = {
	id: number;
	email: string;
	Session: Array<{
		orders: Array<{
			id: number;
		}>;
	}>;
};
