"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useSession } from "next-auth/react";
import { handleSignIn } from "@/app/helpers/handleSignIn";
import { handleSignOut } from "@/app/helpers/handleSignOut";
import { Menu } from "lucide-react";
import { MdMemory } from "react-icons/md";
import { handleMenuItemClick } from "@/app/helpers/handleMenuItemClick";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "./ui/sheet";
import Image from "next/image";
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const menuItems = [
    { label: 'Projects', href: '/dashboard/projects' },
    { label: 'Memories', href: '/dashboard/memories' },
    { label: 'Create', href: '/dashboard/memories/create' },
  ];

  const isActive = (href: string) => {
    if (pathname === href) return true;
    if (href === '/dashboard/projects' && pathname.startsWith('/dashboard/projects/')) return true;
    if (href === '/dashboard/memories' && pathname.startsWith('/dashboard/memories/') && !pathname.includes('/create')) return true;
    return false;
  };

  return (
    <nav className={cn("sticky inset-x-0 top-0 z-30 border-b border-gray-200 bg-white/40 backdrop-blur-lg transition-all")}>
      <MaxWidthWrapper>
        <div className="flex flex-col">
          <div className="flex justify-between h-14 items-center border-zinc-200">
            <div className="flex">
              <Link href="/" className="flex items-center gap-2">
                <MdMemory size={30} className="text-black" />
                {session ? <h1 className="md:text-xl text-gray-400">/</h1> : <span className="text-2xl font-semibold text-black">xmem</span>}
              </Link>
              <div className="flex flex-row gap-2 items-center pl-3">
                {session?.user?.image && (
                  <Image
                    src={session.user.image}
                    alt="User avatar"
                    width={20}
                    height={20}
                    className="rounded-full object-cover aspect-square"
                  />
                )}
                <p className="font-semibold text-sm">{session?.user?.name} projects</p>
              </div>
            </div>

            <div className="flex gap-1 sm:gap-4 items-center">
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
                            className="bg-black text-white text-sm p-2 px-4 rounded-lg focus:outline-none"
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
                            <button
                              key={item.label}
                              onClick={(e) => {
                                e.preventDefault();
                                handleMenuItemClick(session, e, item.href);
                              }}
                              className="uppercase text-black text-sm p-2 hover:bg-gray-200 rounded-lg cursor-pointer"
                              style={{ background: 'none', border: 'none', padding: 0 }}
                            >
                              {item.label}
                            </button>
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
                    <button className="bg-black text-white text-sm p-2 px-4 rounded-lg focus:outline-none" onClick={handleSignOut}>
                      Sign Out
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          <div>
            {/* Desktop menu items */}
            <div className="hidden items-center space-x-4 sm:flex pr-8 md:pb-4 md:pt-2.5 md:pl-2">
              {session && menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleMenuItemClick(session, e, item.href);
                  }}
                  className={cn(
                    "text-sm text-gray-500 hover:text-gray-600 pb-2 border-b-2",
                    isActive(item.href)
                      ? "border-black text-black"
                      : "border-transparent"
                  )}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
