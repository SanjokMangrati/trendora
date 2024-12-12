'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { Product } from '@/lib/types/product.types';
import { useCartContext } from '@/lib/context/cart.context';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { cart, addToCart, removeFromCart } = useCartContext();

    const quantity = cart.items?.find(item => item.productId === product.id)?.quantity || 0;

    return (
        <div className="w-64 rounded-lg overflow-hidden shadow-lg bg-card-foreground text-card">
            <div className="h-48 relative">
                <Image
                    src={product.image}
                    alt={product.name}
                    layout="fill"
                    objectFit="cover"
                />
            </div>
            <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <p className="text-lg font-bold mb-4">${product.price.toFixed(2)}</p>
                {quantity === 0 ? (
                    <Button
                        onClick={() => addToCart(product.id, 1)}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                    </Button>
                ) : (
                    <div className="flex justify-between items-center">
                        <Button
                            onClick={() => removeFromCart(product.id, 1)}
                            size="icon"
                            className="border-input hover:bg-accent hover:text-accent-foreground"
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="flex items-center justify-center w-12 font-semibold text-background">
                            {quantity}
                        </span>
                        <Button
                            onClick={() => addToCart(product.id, 1)}
                            size="icon"
                            className="border-input hover:bg-accent hover:text-accent-foreground"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
