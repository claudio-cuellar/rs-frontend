import type { Metadata } from 'next';
import { MobileNavBar } from '@/components/mobile/MobileNavBar';

export const metadata: Metadata = {
  title: 'CasaLaPaz',
  description: 'Tu próximo hogar bajo el Illimani',
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-900">
      {children}
      <MobileNavBar />
      {/* Spacer for bottom nav */}
      <div className="h-20" />
    </div>
  );
}
