import { Check } from 'lucide-react';

export function OrderConfirmation() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6">
      <div className="relative">
        <div className="absolute inset-0 bg-green-500 rounded-full blur-sm"></div>
        <div className="relative bg-green-500 rounded-full p-3">
          <Check className="h-6 w-6 text-white" strokeWidth={3} />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-green-700 dark:text-green-300">
        Order Placed!
      </h2>
      <p className="text-center text-green-600 dark:text-green-400">
        Thank you for your purchase. Your order has been successfully placed.
      </p>
    </div>
  );
}
