import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

import { cn } from "@/lib/utils";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SessionWrapper from '../components/SessionWrapper';
import { UserProvider } from "./Context";

export const metadata: Metadata = {
  title: "OpenSkills | Learn the in-demand skills",
  description: "Learn the in-demand skills",
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
          <UserProvider>
            <Navbar />
            <main className="flex-grow flex items-center justify-center">{children}</main>
            <Footer />
          </UserProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
