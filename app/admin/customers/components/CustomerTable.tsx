'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Customer } from '@/lib/types/customers';
import { fetchCustomers } from '@/lib/api/admin/customers';
import { generateDiscount } from '@/lib/api/admin/discount';
import { useToast } from '@/hooks/use-toast';
import Loader from '@/components/common/Loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function CustomersTable() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [generatingIds, setGeneratingIds] = useState<number[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchCustomers();
        setCustomers(data.customers || []);
      } catch (error: any) {
        toast({
          title: 'Failed to Fetch Customers',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGenerate = async (customerId: number) => {
    setGeneratingIds((prev) => [...prev, customerId]);
    try {
      const response = await generateDiscount(customerId);
      toast({
        title: 'Discount Generated',
        description: `Discount Code: ${response.discountCode.code}`,
      });
    } catch (error: any) {
      toast({
        title: 'Failed to Generate Discount',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setGeneratingIds((prev) => prev.filter((id) => id !== customerId));
    }
  };

  const canGenerate = (customer: Customer) => {
    const orderCount = customer.Session.reduce(
      (sum, session) => sum + session.orders.length,
      0
    );
    console.log(orderCount)
    return (orderCount + 1) % 5 === 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <CardTitle className="text-2xl font-bold">Customers</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.email}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleGenerate(customer.id)}
                    disabled={
                      !canGenerate(customer) ||
                      generatingIds.includes(customer.id)
                    }
                  >
                    {generatingIds.includes(customer.id) ? (
                      <Loader size="xs" />
                    ) : (
                      'Generate'
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
