'use client';
import Link from "next/link";

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <h1 className="text-5xl font-bold mb-4">Welcome! To Trendora</h1>
      <p className="text-lg mb-8">Next Gen E-Commerce</p>
      <Link href="/products">
        <button className="px-6 py-3 bg-white text-blue-500 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition duration-300">
          Visit Store
        </button>
      </Link>
    </div>
  );
}
