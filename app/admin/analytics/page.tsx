import React from 'react'
import { Analytics } from './components/Analytics'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Analytics | TRENDORA",
};
const Page = () => {
    return (
        <div className='md:px-20'><Analytics /></div>
    )
}

export default Page