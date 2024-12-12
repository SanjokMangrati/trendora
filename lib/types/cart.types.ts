import { Product } from "./product.types";

export type Cart = {
	items: Array<CartItem>;
	total: number;
};

export type CartItem = {
	id: number;
	cartId: number;
	productId: number;
	quantity: number;
	product: Product;
};

export const DEFAULT_CART_DATA: Cart = {
	items: [],
	total: 0,
};
