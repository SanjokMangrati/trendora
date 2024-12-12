import Link from "next/link";

export default function AdminNav() {
    return (
        <div className="flex items-center space-x-6 md:px-20">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <nav className="flex items-center space-x-4">
                <Link
                    href="/admin/customers"
                    className="text-sm font-medium transition-colors hover:text-primary"
                >
                    Customers
                </Link>
                <Link
                    href="/admin/analytics"
                    className="text-sm font-medium transition-colors hover:text-primary"
                >
                    Analytics
                </Link>
            </nav>
        </div>
    );
}