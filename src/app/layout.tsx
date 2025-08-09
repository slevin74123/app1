import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import Script from 'next/script';
import { API_CONFIG } from '@/config/api';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Unde Parchez? - Aplicația de parcare",
  description: "Găsește locuri de parcare în timp real în orașele din România",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} h-full antialiased`}>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${API_CONFIG.GOOGLE_MAPS.API_KEY}&libraries=${API_CONFIG.GOOGLE_MAPS.LIBRARIES.join(',')}`}
          strategy="beforeInteractive"
        />
        <AuthProvider>
        {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
