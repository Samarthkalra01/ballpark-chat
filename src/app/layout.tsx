import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { Clarity } from "@/components/analytics/clarity";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Ballpark — Practice Consulting Guesstimates",
    template: "%s · Ballpark",
  },
  description:
    "Practice guesstimates the way you'll be tested, and get interviewer-style feedback in seconds.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable}`}>
      <body className="min-h-full bg-slate-50 font-sans text-slate-900 antialiased">
        {children}
        <Clarity />
      </body>
    </html>
  );
}
