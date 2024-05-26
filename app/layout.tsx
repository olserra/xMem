import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

import { cn } from "@/lib/utils";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SessionWrapper from '../components/SessionWrapper';

export const metadata: Metadata = {
  title: "OpenSkills | Learn the skills in demand",
  description: "Learn the skills in demand",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body
        className={cn(
          "grainy flex min-h-screen flex-col font-sans antialiased",
          GeistSans.className,
        )}
      >
        <SessionWrapper>
          <Navbar />
          {children}
          <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}
