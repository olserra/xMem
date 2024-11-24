"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { MdMemory } from "react-icons/md";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";


const Navbar = () => {
  return (
    <nav className={cn("sticky h-14 inset-x-0 top-0 z-30 border-b border-gray-200 bg-white/40 backdrop-blur-lg transition-all")}>
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 justify-center items-center gap-2">
            <MdMemory size={25} />
            <span className="text-2xl font-semibold">xmem</span>
          </Link>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
