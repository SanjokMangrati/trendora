import { ProductsProvider } from '@/lib/context/product.context';
import { Metadata } from 'next';
import React from 'react';
import Content from './components/Content';
import { CartProvider } from '@/lib/context/cart.context';

export const metadata: Metadata = {
  title: 'Products | TRENDORA',
};
export default function Page() {
  return (
    <ProductsProvider>
      <CartProvider>
        <Content />
      </CartProvider>
    </ProductsProvider>
  );
}
