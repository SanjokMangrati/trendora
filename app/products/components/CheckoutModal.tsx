'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { OrderConfirmation } from './OrderConfirmation'
import { useCartContext } from '@/lib/context/cart.context'
import { DiscountCode } from '@/lib/types/discount.types'
import { useToast } from '@/hooks/use-toast'
import { applyDiscount, placeOrder } from '@/lib/api/checkout'
import Loader from '@/components/common/Loader'

const Confetti = dynamic(() => import('react-confetti'), { ssr: false })

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    discountCodes: DiscountCode[];
}

export function CheckoutModal({ isOpen, onClose, discountCodes }: CheckoutModalProps) {
    const [isOrderConfirmed, setIsOrderConfirmed] = useState<boolean>(false)
    const [showConfetti, setShowConfetti] = useState<boolean>(false)
    const [appliedDiscount, setAppliedDiscount] = useState<string | null>(null)
    const [appliedDiscountId, setAppliedDiscountId] = useState<number | null>(null);
    const [applyDiscountLoading, setApplyDiscountLoading] = useState<boolean>(false);
    const [placeOrderLoading, setPlaceOrderLoading] = useState<boolean>(false);
    const [finalTotal, setFinalTotal] = useState<number | null>(null);
    const [appliedDiscountPercentage, setAppliedDiscountPercentage] = useState<number | null>(null);
    const confettiRef = useRef<HTMLDivElement>(null)
    const { cart, refetch } = useCartContext();
    const { toast } = useToast();

    useEffect(() => {
        if (isOrderConfirmed) {
            setShowConfetti(true)
            const timer = setTimeout(() => setShowConfetti(false), 5000)
            return () => clearTimeout(timer)
        }
    }, [isOrderConfirmed])

    let totalPrice = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

    const handleApplyDiscount = async (code: string, id: number) => {
        try {
            setApplyDiscountLoading(true);
            const res = await applyDiscount(id, code);

            if (res?.appliedDiscount !== undefined && res?.finalTotal !== undefined) {
                setAppliedDiscount(code);
                setAppliedDiscountId(id);
                setFinalTotal(res.finalTotal);
                setAppliedDiscountPercentage(res.appliedDiscount);
                toast({
                    title: "Discount Applied",
                    description: `You saved ${res.appliedDiscount}% on your order!`,
                });
            } else {
                throw new Error("Failed to apply discount. Invalid response.");
            }
        } catch (error: any) {
            console.error("Error applying discount:", error.message);
            toast({
                title: error.message || "Failed to Apply Discount",
                variant: "destructive",
            });
        } finally {
            setApplyDiscountLoading(false);
        }
    };

    const handleConfirmOrder = async () => {
        try {
            setPlaceOrderLoading(true);
            const payload = appliedDiscount && appliedDiscountId
                ? { discountCodeId: appliedDiscountId, discountCode: appliedDiscount }
                : undefined;
            const res = await placeOrder(payload);
            if (res?.order?.id) {
                setIsOrderConfirmed(true);
                toast({
                    title: "Order Confirmed",
                    description: res.message || "Your order has been placed successfully!",
                });
                await refetch();
            }
        } catch (error: any) {
            console.log("Error confirming order:", error.message);
            toast({
                title: error.message || "Order Failed. Please try again later.",
                variant: "destructive",
            });
        } finally {
            setPlaceOrderLoading(false);
        }
    };

    const handleModalClose = () => {
        setIsOrderConfirmed(false);
        setAppliedDiscount(null);
        setAppliedDiscountId(null);
        setFinalTotal(null);
        setAppliedDiscountPercentage(null);
        setShowConfetti(false);
        onClose();
    };



    return (
        <Dialog open={isOpen} onOpenChange={handleModalClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader hidden>
                    <DialogTitle hidden>Order Confirmed</DialogTitle>
                </DialogHeader>
                <div ref={confettiRef} className="absolute inset-0 pointer-events-none">
                    {showConfetti && (
                        <Confetti
                            width={confettiRef.current?.clientWidth || 300}
                            height={confettiRef.current?.clientHeight || 400}
                            recycle={false}
                            numberOfPieces={200}
                        />
                    )}
                </div>
                {isOrderConfirmed ? (
                    <>
                        <OrderConfirmation />
                        <DialogFooter>
                            <Button onClick={handleModalClose}>Close</Button>
                        </DialogFooter>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>Checkout Confirmation</DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="mt-4 max-h-[60vh]">
                            {cart.items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center py-2 border-b border-border">
                                    <span className="font-medium">{item.product.name}</span>
                                    <span>
                                        {item.quantity} x ${item.product.price.toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </ScrollArea>
                        <div className="mt-4">
                            <div className="flex justify-between items-center font-semibold">
                                <span>Total:</span>
                                {finalTotal ? (
                                    <span>
                                        <s className="text-red-500">${totalPrice.toFixed(2)}</s>{" "}
                                        <span className="text-green-600">${finalTotal.toFixed(2)}</span>
                                    </span>
                                ) : (
                                    <span>${totalPrice.toFixed(2)}</span>
                                )}
                            </div>
                            {appliedDiscountPercentage && (
                                <div className="text-sm text-gray-600 mt-1">
                                    Discount Applied: {appliedDiscountPercentage}%
                                </div>
                            )}
                        </div>
                        {discountCodes.length > 0 && (
                            <div className="mt-4">
                                <h3 className="font-medium text-sm mb-2 ">Available Discount Codes:</h3>
                                {discountCodes.map((discountCode) => (
                                    <div key={discountCode.code} className="flex items-center justify-between py-1">
                                        <span className="rounded-md px-4 py-1 border-2 border-primary/50 focus:border-primary transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                                        >{discountCode.code}</span>
                                        <Button
                                            variant={appliedDiscount === discountCode.code ? "outline" : "default"}
                                            disabled={!!appliedDiscount || discountCode.code === appliedDiscount}
                                            onClick={() => handleApplyDiscount(discountCode.code, discountCode.id)}
                                        >
                                            {applyDiscountLoading ? <Loader size='xs' /> : appliedDiscount === discountCode.code ? "Applied" : "Apply"}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <DialogFooter className='mt-6'>
                            <Button onClick={onClose} variant="outline">Cancel</Button>
                            <Button onClick={handleConfirmOrder}>{placeOrderLoading ? <Loader size='xs' /> : "Confirm Order"}</Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
