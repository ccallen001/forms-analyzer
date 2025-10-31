import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Martial Arts Form Analyzer",
  description: "AI-powered analysis of martial arts forms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
