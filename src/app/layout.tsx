import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
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
  title: "Nulla.io - AI-Powered Job Application Manager",
  description: "Track applications, generate AI-powered cover letters, and organize your job search in one powerful dashboard. Land your dream job faster.",
  keywords: ["job application", "AI cover letters", "job tracking", "career management"],
  authors: [{ name: "Nulla.io Team" }],
  openGraph: {
    title: "Nulla.io - AI-Powered Job Application Manager",
    description: "Track applications, generate AI-powered cover letters, and organize your job search in one powerful dashboard.",
    url: "https://nulla.io",
    siteName: "Nulla.io",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nulla.io - AI-Powered Job Application Manager",
    description: "Track applications, generate AI-powered cover letters, and organize your job search in one powerful dashboard.",
    images: ["/og-image.jpg"],
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
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
