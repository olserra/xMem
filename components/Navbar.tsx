"use client";

import Link from "next/link";
import { SiFuturelearn } from "react-icons/si";
import { useState } from "react"; // Import useState
import { cn } from "@/lib/utils";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useSession } from "next-auth/react";
import { handleSignIn } from "@/app/helpers/handleSignIn";
import { handleSignOut } from "@/app/helpers/handleSignOut";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const Navbar = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: 'Dashboard', href: '/progress' },
  ];

  // Handle menu item click: If no session, sign in; else navigate to the page
  const handleMenuItemClick = (href: string) => {
    if (!session) {
      handleSignIn; // Trigger sign-in if no session
    } else {
      window.location.href = href; // Navigate if logged in
    }
  };

  return (
    <nav className={cn("sticky h-14 inset-x-0 top-0 z-30 border-b border-gray-200 bg-white/40 backdrop-blur-lg transition-all")}>
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 justify-center items-center gap-2">
            <SiFuturelearn size={20} />
            <span className="text-2xl font-semibold">OpenSkills</span>
          </Link>

          <div className="flex gap-1 sm:gap-4 items-center">
            {/* Desktop menu items */}
            <div className="hidden items-center space-x-4 sm:flex uppercase pr-8">
              {session && menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default link behavior
                    handleMenuItemClick(item.href); // Use custom click handler
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Mobile navigation menu */}
            <Sheet>
              <SheetTrigger className="sm:hidden pr-4">
                <Menu />
              </SheetTrigger>

              <SheetContent side="right" className="p-0 bg-secondary pt-5 w-32">
                <SheetClose />
                <div className="flex flex-col h-full text-primary bg-secondary">
                  <div className="p-3 flex flex-1 justify-center">
                    <div className="space-y-2">
                      {/* Session dependent button */}
                      {session ? (
                        <button
                          className="bg-black text-white text-sm p-2 rounded-lg focus:outline-none"
                          onClick={handleSignOut}
                        >
                          Sign Out
                        </button>
                      ) : (
                        <button
                          className="bg-black text-white text-sm p-2 rounded-lg focus:outline-none"
                          onClick={handleSignIn}
                        >
                          Get Started
                        </button>
                      )}

                      {/* Render mobile menu items */}
                      <div className="flex flex-col">
                        {session && menuItems.map((item) => (
                          <div
                            key={item.label}
                            onClick={() => handleMenuItemClick(item.href)}
                            className="uppercase text-black text-sm p-2 hover:bg-gray-200 rounded-lg cursor-pointer"
                          >
                            {item.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop session buttons */}
            <div className="hidden items-center space-x-4 sm:flex">
              {!session ? (
                <button className="bg-black text-white text-sm py-2 px-3 rounded-lg focus:outline-none" onClick={handleSignIn}>
                  Get started
                </button>
              ) : (
                <>
                  <div className="text-[10px]">
                    <p>Welcome,</p>
                    <p className="font-bold underline">{session.user?.name}</p>
                  </div>
                  <button className="bg-black text-white text-sm p-2 rounded-lg focus:outline-none" onClick={handleSignOut}>
                    Sign Out
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
