import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Syne } from "next/font/google";
import { Header, Footer } from "@/components/layout";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
  weight: ["700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Nadova Labs | Research Peptides for Health & Longevity",
    template: "%s | Nadova Labs",
  },
  description:
    "Premium research peptides for weight loss, anti-aging, energy, and recovery. Find the right compound for your health goals with our science-backed products.",
  keywords: [
    "research peptides",
    "longevity",
    "anti-aging",
    "BPC-157",
    "SS-31",
    "MOTS-c",
    "5-Amino-1MQ",
    "peptide research",
  ],
  authors: [{ name: "Nadova Labs" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nadovalabs.com",
    siteName: "Nadova Labs",
    title: "Nadova Labs | Research Peptides for Health & Longevity",
    description:
      "Premium research peptides for weight loss, anti-aging, energy, and recovery.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nadova Labs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nadova Labs | Research Peptides for Health & Longevity",
    description:
      "Premium research peptides for weight loss, anti-aging, energy, and recovery.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${syne.variable} antialiased min-h-screen flex flex-col`}
        style={{
          fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
        }}
      >
        <div className="noise" />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
