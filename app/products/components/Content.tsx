'use client';
import { useProductsContext } from '@/lib/context/product.context';
import React from 'react';
import { ProductCard } from './ProductCard';
import { CartSheet } from './CartSheet';
import Loader from '@/components/common/Loader';

const Content = () => {
  const { products, loading } = useProductsContext();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="dark">
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background text-foreground">
        <div className="flex justify-between items-center w-full max-w-4xl mb-8">
          <h1 className="text-4xl font-bold">Product Showcase</h1>
          <CartSheet />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Content;
