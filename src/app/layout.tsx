import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Cezaro Costa Advocacia — Sistema Jurídico",
  description: "Plataforma jurídica inteligente — Cezaro Costa Advocacia e Consultoria Jurídica",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background font-sans">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
