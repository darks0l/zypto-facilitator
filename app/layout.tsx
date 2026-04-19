import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zypto Facilitator",
  description: "Free x402 payment facilitator. We cover gas. Your users pay in USDC — you receive in full.",
  keywords: ["x402", "payments", "USDC", "crypto", "Zypto", "micropayments", "EIP-3009"],
  openGraph: {
    title: "Zypto Facilitator",
    description: "Free x402 payment facilitator. Gas-free USDC payments across Base, BNB, and Ethereum.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans bg-background text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
