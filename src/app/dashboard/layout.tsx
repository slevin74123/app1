import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Parking App',
  description: 'Dashboard pentru aplicația de parcare',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
} 