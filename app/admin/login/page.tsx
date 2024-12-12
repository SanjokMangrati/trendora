import React from 'react'
import Login from './components/Login';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Admin Login | TRENDORA",
};
const Page = () => {
    return (
        <Login />
    )
}

export default Page;