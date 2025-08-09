import type { ReactNode } from 'react';

export const metadata = {
  title: 'Parking App - Harta principală',
  description: 'Aplicație parcări București - Next.js + Supabase + Google Maps',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ro">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif' }}>
        {children}
      </body>
    </html>
  );
} 