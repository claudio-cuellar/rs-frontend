import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'CasaLaPaz',
    template: '%s | CasaLaPaz',
  },
  description: 'Encuentra tu hogar ideal en La Paz, Bolivia',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="min-h-screen bg-gray-50 antialiased">
        <CurrencyProvider>
          {children}
        </CurrencyProvider>
      </body>
    </html>
  );
}
