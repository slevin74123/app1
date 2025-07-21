import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      <body className={geistSans.variable + ' ' + geistMono.variable + ' h-full antialiased'}>
        <AuthProvider>
        {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
