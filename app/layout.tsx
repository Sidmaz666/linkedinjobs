import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SiteHeader from '@/components/SiteHeader';
import { Github } from 'lucide-react';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const metadataBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(metadataBaseUrl),
  title: {
    default: "LinkedIn Jobs Finder",
    template: "%s • LinkedIn Jobs Finder",
  },
  description: "Search LinkedIn job listings by keywords, location, date, workplace, type and experience.",
  keywords: [
    "LinkedIn jobs",
    "job search",
    "frontend jobs",
    "remote jobs",
    "Next.js",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "LinkedIn Jobs Finder",
    description: "Search LinkedIn job listings by keywords, location, date, workplace, type and experience.",
    url: "/",
    siteName: "LinkedIn Jobs Finder",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "LinkedIn Jobs Finder preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkedIn Jobs Finder",
    description: "Search LinkedIn job listings by keywords, location, date, workplace, type and experience.",
    images: ["/preview.png"],
    creator: "@sidmaz666",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <SiteHeader />
        {children}
        <footer className="bg-[#0A66C2] text-white mt-12">
          <div className="max-w-7xl mx-auto px-4 py-8 text-sm flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-white/90">&copy; {new Date().getFullYear()} LinkedIn Jobs Finder</p>
            <nav className="flex items-center gap-4">
              <a href="/" className="text-white/90 hover:text-white underline">Home</a>
              <a href="/docs" className="text-white/90 hover:text-white underline">API</a>
              <a
                href="https://github.com/sidmaz666/linkedInjobs"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub repository"
                className="inline-flex items-center text-white/90 hover:text-white"
              >
                <Github className="w-5 h-5" />
              </a>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
