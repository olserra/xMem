import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

import { cn } from "@/lib/utils";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SessionWrapper from '../components/SessionWrapper';
import { UserProvider } from "./Context";

export const metadata: Metadata = {
  title: "xmem | Preserve and access your digital memories",
  description: "Preserve and access your digital memories",
  openGraph: {
    title: "xmem | Preserve and access your digital memories",
    description: "Preserve and access your digital memories with ease. xmem empowers you to store, manage, and connect your memories securely.",
    url: "https://xmem.digital",
    images: [
      {
        url: "/logo.jpg",
        width: 1200, 
        height: 630,
        alt: "xmem Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "xmem | Preserve and access your digital memories",
    description: "Preserve and access your digital memories with ease. xmem empowers you to store, manage, and connect your memories securely.",
    images: ["/logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
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
