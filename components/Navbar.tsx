"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { MdMemory } from "react-icons/md";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";

const Navbar = () => {
  return (
    <nav className={cn("sticky h-16 inset-x-0 top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur-lg transition-all")}>
      <MaxWidthWrapper>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <MdMemory size={30} className="text-black" />
            <span className="text-2xl font-semibold text-black">xmem</span>
          </Link>

          {/* CTA Button */}
          <Link href="#email-form" className="hidden md:block bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200">
            Notify Me
          </Link>

          {/* Mobile Menu (Optional) */}
          {/* Implement a hamburger menu for mobile if desired */}
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
