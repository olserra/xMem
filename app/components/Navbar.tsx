"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import { useSession } from "next-auth/react";
import { handleSignIn } from "@/app/helpers/handleSignIn";
import { handleSignOut } from "@/app/helpers/handleSignOut";
import { Menu } from "lucide-react";
import { MdMemory } from "react-icons/md";
import { handleMenuItemClick } from "@/app/helpers/handleMenuItemClick";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "./ui/sheet";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { useState, useRef } from 'react';
import Modal from "./ui/modal";
import { useUser } from "@/app/Context";

const Navbar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const avatarRef = useRef<HTMLImageElement>(null);
  const { filterLabel, setFilterLabel } = useUser(); // Consume the filter from context

  const menuMainItems = [
    { label: 'Docs', href: '/docs' },
    { label: 'Help', href: '/help' },
  ];

  const menuItems = [
    { label: 'Projects', href: '/dashboard/projects' },
    { label: 'Memories', href: '/dashboard/memories' },
    { label: 'MCP', href: '/dashboard/mcp' },
    { label: 'Sources', href: '/dashboard/sources' },
  ];

  const isActive = (href: string) => {
    if (pathname === href) return true;
    if (href === '/dashboard/projects' && pathname.startsWith('/dashboard/projects/')) return true;
    if (href === '/dashboard/memories' && pathname.startsWith('/dashboard/memories/') && !pathname.includes('/create')) return true;
    if (href === '/dashboard/mcp' && pathname.startsWith('/dashboard/mcp/')) return true;
    if (href === '/dashboard/sources' && pathname.startsWith('/dashboard/sources/')) return true;
    return false;
  };

  const handleAvatarClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  const getAvatarPosition = () => {
    if (avatarRef.current) {
      const rect = avatarRef.current.getBoundingClientRect();
      const top = rect.bottom + window.scrollY; // Position below the avatar
      const left = rect.left + window.scrollX; // Align with avatar's left position

      // Ensure modal stays within the viewport
      const modalWidth = 100; // Adjust based on your modal's width
      const availableSpaceRight = window.innerWidth - left;

      // If there's not enough space to the right, align to the left side of the avatar
      const modalLeft = availableSpaceRight < modalWidth ? left - modalWidth + rect.width : left;

      return { top, left: modalLeft };
    }
    return { top: 0, left: 0 };
  };

  return (
    <nav className={cn(
      "sticky inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/40 backdrop-blur-lg transition-all"
    )}>
      <MaxWidthWrapper>
        <div className="flex flex-col">
          <div className={cn(
            "flex justify-between items-center border-zinc-200",
            session ? "h-14 md:pt-3" : "h-10 md:pt-5"
          )}>
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
                {session && <p className="font-semibold text-sm">{session?.user?.name} projects</p>}
              </div>
            </div>


            <div className="flex gap-1 sm:gap-4 items-center">
              {/* Filter bar when authenticated */}
              {session && (pathname === "/dashboard/projects" || pathname === "/dashboard/memories") && (
                <div className="flex gap-4 items-center">
                  <input
                    type="text"
                    value={filterLabel}
                    onChange={(e) => setFilterLabel(e.target.value)}
                    placeholder={pathname === "/dashboard/projects" ? "Search projects" : "Search memories"}
                    className="p-2 border border-gray-300 rounded-lg md:w-[500px]" // Adjusted width
                  />

                </div>
              )}
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
                    {menuMainItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="text-sm text-gray-600 hover:text-black transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                    <div className="relative">
                      <Image
                        ref={avatarRef}
                        src={session?.user?.image || '/default-avatar.png'}
                        alt="User avatar"
                        width={30}
                        height={30}
                        className="rounded-full cursor-pointer"
                        onClick={handleAvatarClick}
                      />
                      {isModalOpen && (
                        <Modal onClose={() => setIsModalOpen(false)} position={getAvatarPosition()}>
                          <div className="flex flex-col space-y-2">
                            <Link
                              href="/api-page"
                              className="text-sm text-gray-600 hover:text-black transition-colors"
                              onClick={() => setIsModalOpen(false)}  // Close the modal when clicked
                            >
                              API settings
                            </Link>
                            <button
                              className="text-sm text-gray-600 hover:text-black transition-colors"
                              onClick={(e) => {
                                handleSignOut(e);
                                setIsModalOpen(false);  // Close the modal when signing out
                              }}
                            >
                              Sign Out
                            </button>
                          </div>
                        </Modal>
                      )}
                    </div>
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
