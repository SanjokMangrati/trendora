import React from 'react';
import { Metadata } from 'next';
import { CustomersTable } from './components/CustomerTable';

export const metadata: Metadata = {
  title: 'Customers | TRENDORA',
};
const Page = () => {
  return (
    <div className="md:px-20">
      <CustomersTable />
    </div>
  );
};

export default Page;
