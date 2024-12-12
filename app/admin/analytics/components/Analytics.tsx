'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ShoppingCart, DollarSign, Tag, Percent } from 'lucide-react';
import { fetchAnalytics } from '@/lib/api/admin/auth/analytics';
import { useToast } from '@/hooks/use-toast';
import Loader from '@/components/common/Loader';
import { AnalyticsData, DEFAULT_ANALYTICS_DATA } from '@/lib/types/analytics';

export function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>(
    DEFAULT_ANALYTICS_DATA
  );
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const data = await fetchAnalytics();
        setAnalytics(data.analytics);
      } catch (err: any) {
        toast({
          title: 'Error Fetching Analytics',
          description: err.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen flex justify-center items-center text-3xl">
        No analytics data available
      </div>
    );
  }

  const chartData = [
    { name: 'Items Purchased', value: analytics.totalItemsPurchased },
    { name: 'Purchase Amount', value: analytics.totalPurchaseAmount },
    { name: 'Discount Amount', value: analytics.totalDiscountAmount },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Items Purchased
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.totalItemsPurchased}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Purchase Amount
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${analytics.totalPurchaseAmount.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Discount Amount
            </CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${analytics.totalDiscountAmount.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Discount Codes
            </CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.discountCodes.length}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Discount Codes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Used</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytics.discountCodes.map((code, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{code.code}</TableCell>
                  <TableCell>{code.discount}%</TableCell>
                  <TableCell>{code.used ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    {new Date(code.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
