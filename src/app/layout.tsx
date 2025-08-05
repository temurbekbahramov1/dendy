import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DendyFood - Fast Food Delivery",
  description: "DendyFood - Eng tez va mazali fast food yetkazib berish xizmati. Hotdog, gamburger, kartoshka fri va boshqa mazali taomlar.",
  keywords: ["DendyFood", "fast food", "delivery", "hotdog", "burger", "O'zbekiston", "yetkazib berish", "food delivery"],
  authors: [{ name: "DendyFood Team" }],
  openGraph: {
    title: "DendyFood - Fast Food Delivery",
    description: "Eng tez va mazali fast food yetkazib berish xizmati",
    url: "https://dendyfood.uz",
    siteName: "DendyFood",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DendyFood - Fast Food Delivery",
    description: "Eng tez va mazali fast food yetkazib berish xizmati",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
