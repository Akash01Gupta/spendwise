import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import LayoutWrapper from '@/components/layout/LayoutWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SpendWise - Monthly Salary, Expense & Savings Manager',
  description:
    'Track monthly salary, fixed & variable expenses, savings goals, safe-to-spend dynamic daily limits, and financial reports.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-slate-950 text-slate-100 antialiased min-h-screen flex flex-col`}
      >
        <AppProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </AppProvider>
      </body>
    </html>
  );
}
