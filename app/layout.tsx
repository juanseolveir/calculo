import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Estudio",
  description: "Plataforma de estudio de Cálculo I y Economía I",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
