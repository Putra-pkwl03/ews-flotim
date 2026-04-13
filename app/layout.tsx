import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EWS Flotim",
  description: "Sentinel Oversight System for Fishing Monitoring",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      // Disarankan juga menambahkannya di html jika menggunakan theme switcher
      suppressHydrationWarning 
    >
      <body 
        className="min-h-full flex flex-col"
        // Ini akan mengabaikan atribut tambahan yang disuntikkan oleh ekstensi browser
        suppressHydrationWarning 
      >
        {children}
      </body>
    </html>
  );
}