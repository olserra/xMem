"use client";

import Link from "next/link";
import { SiFuturelearn } from "react-icons/si";
import { useState } from "react"; // Import useState
import { cn } from "@/lib/utils";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import { MobileNav } from "@/components/MobileNav";
import { signIn, signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false); // State to manage sidebar visibility

  const menuItems = [
    { label: 'Dashboard', href: '/progress' },
    { label: 'In-demand', href: '/in-demand' }
  ];

  const handleClickSignIn = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    signIn("google", {
      callbackUrl: "https://www.openskills.online/api/auth/callback/google",
    });
  };

  const handleClickSignOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    signOut();
  };

  const handleMenuItemClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!session) {
      handleClickSignIn(e);
    } else {
      window.location.href = href;
    }
  };

  return (
    <nav className={cn("sticky h-14 inset-x-0 top-0 z-30 border-b border-gray-200  bg-white/40 backdrop-blur-lg transition-all")}>
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 justify-center items-center gap-2">
            <SiFuturelearn size={20} />
            <span className="text-2xl font-semibold">OpenSkills</span>
          </Link>
          <div className="flex gap-1 sm:gap-4 items-center">
            <div className="hidden items-center space-x-4 sm:flex uppercase pr-8">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleMenuItemClick(e, item.href)}
                >
                  {item.label}
                </a>
              ))}
            </div>
            <MobileNav menuItems={menuItems} setIsOpen={setIsOpen} /> {/* Pass setIsOpen to MobileNav */}

            <div className="hidden items-center space-x-4 sm:flex">
              {!session ? (
                <>
                  <button className={buttonVariants({ variant: "ghost", size: "sm" })} onClick={handleClickSignIn}>
                    Sign in
                  </button>
                  <button className={buttonVariants({ size: "sm" })} onClick={handleClickSignIn}>
                    Get started
                  </button>
                </>
              ) : (
                <>
                  <div className="text-[10px]">
                    <p>Welcome,</p>
                    <p className="font-bold underline">{session.user?.name}</p>
                  </div>
                  <button className={buttonVariants({ size: "sm" })} onClick={handleClickSignOut}>
                    SignOut
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
