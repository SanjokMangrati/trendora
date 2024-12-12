import AdminNav from "@/components/common/AdminNav";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "@/lib/context/session.context";
import { headers } from "next/headers";
import "./globals.css"

export const metadata = {
  title: "TRENDORA",
  description: "Next Gen E-commerce",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname")
  const isAdminLayout = pathname === "/admin/customers" || pathname === "/admin/analytics";

  return (
    <html lang="en">
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <SessionProvider>
            {isAdminLayout ? (
              <div className="flex flex-col min-h-screen">
                <header className="sticky top-0 z-40 border-b bg-background">
                  <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                    <AdminNav />
                  </div>
                </header>
                <main className="flex-1 container py-6">{children}</main>
              </div>
            ) : (
              <main>{children}</main>
            )}
          </SessionProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
