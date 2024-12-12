'use client';
import { useState } from 'react';
import Image from 'next/image';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { useCartContext } from '@/lib/context/cart.context';
import { CheckoutModal } from './CheckoutModal';
import { DiscountCode } from '@/lib/types/discount.types';
import { fetchDiscount } from '@/lib/api/checkout';
import { useToast } from '@/hooks/use-toast';
import Loader from '@/components/common/Loader';

export function CartSheet() {
  const { cart, addToCart, removeFromCart } = useCartContext();
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] =
    useState<boolean>(false);
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const data = await fetchDiscount();
      if (data?.discountCodes && Array.isArray(data.discountCodes)) {
        setDiscountCodes(data.discountCodes);
        setIsCheckoutModalOpen(true);
      } else {
        throw new Error('Invalid discount data received.');
      }
    } catch (error: any) {
      console.log('Error fetching discounts:', error.message);
      toast({
        title: error.message || 'Failed to Load Discounts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-4 w-4" />
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {cart.total}
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-10rem)] mt-4">
          {cart.items?.map((item) => (
            <div
              key={item.id}
              className="flex items-center space-x-4 py-4 border-b border-border"
            >
              <div className="h-20 w-20 relative">
                <Image
                  src={item.product.image || '/placeholder.png'}
                  alt={item.product.name || 'Product Image'}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">
                  {item.product.name || 'Unknown Product'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Quantity: {item.quantity}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => removeFromCart(item.productId, 1)}
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  onClick={() => addToCart(item.productId, 1)}
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </ScrollArea>
        <div className="mt-4 space-y-4">
          <div className="flex justify-between">
            <span className="font-semibold">Total:</span>
            <span className="font-semibold">${cart.total.toFixed(2)}</span>
          </div>
          <Button
            className="w-full"
            onClick={handleCheckout}
            disabled={!cart.total}
          >
            {loading ? <Loader size="xs" /> : 'Checkout'}
          </Button>
        </div>
      </SheetContent>
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        discountCodes={discountCodes}
      />
    </Sheet>
  );
}
