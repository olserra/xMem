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
import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import Modal from "./ui/modal";
import { useUser } from "@/app/contexts/UserContext";

const Navbar = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const avatarRef = useRef<HTMLImageElement>(null);
  const { filterLabel, setFilterLabel } = useUser();
  const [isClient, setIsClient] = useState(false);

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Persist session state in localStorage
  useEffect(() => {
    if (isClient) {
      if (status === "authenticated") {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userName', session?.user?.name || '');
        localStorage.setItem('userImage', session?.user?.image || '');
      } else if (status === "unauthenticated") {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userName');
        localStorage.removeItem('userImage');
      }
    }
  }, [status, session, isClient]);

  // Memoize authentication state with localStorage fallback
  const isAuthenticated = useMemo(() => {
    if (!isClient) return false;
    return status === "authenticated" ||
      (status === "loading" && (session || localStorage.getItem('isAuthenticated') === 'true'));
  }, [status, session, isClient]);

  // Memoize user data with localStorage fallback
  const userData = useMemo(() => {
    if (!isClient) return null;
    return {
      name: session?.user?.name || localStorage.getItem('userName') || '',
      image: session?.user?.image || localStorage.getItem('userImage') || ''
    };
  }, [session, isClient]);

  // Memoize menu items
  const menuMainItems = useMemo(() => [
    { label: 'Docs', href: '/docs' },
    { label: 'Help', href: '/help' },
  ], []);

  const menuItems = useMemo(() => [
    { label: 'Data', href: '/dashboard/data' },
    { label: 'Sources', href: '/dashboard/sources' },
    { label: 'Analysis', href: '/dashboard/analysis' },
  ], []);

  // Memoize isActive function
  const isActive = (path: string) => {
    return pathname === path;
  };

  const isDashboardActive = () => {
    return isAuthenticated && pathname === "/dashboard/data";
  };

  // Memoize handlers
  const handleAvatarClick = useCallback(() => {
    setIsModalOpen(prev => !prev);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleSignOutWithModalClose = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    handleSignOut(e);
    setIsModalOpen(false);
  }, []);

  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterLabel(e.target.value);
  }, [setFilterLabel]);

  const handleMenuItemClickWithSession = useCallback((e: React.MouseEvent<HTMLElement>, href: string) => {
    e.preventDefault();
    handleMenuItemClick(session, e, href);
  }, [session]);

  // Memoize avatar position calculation
  const getAvatarPosition = useCallback(() => {
    if (avatarRef.current) {
      const rect = avatarRef.current.getBoundingClientRect();
      const top = rect.bottom + window.scrollY;
      const left = rect.left + window.scrollX;
      const modalWidth = 100;
      const availableSpaceRight = window.innerWidth - left;
      const modalLeft = availableSpaceRight < modalWidth ? left - modalWidth + rect.width : left;
      return { top, left: modalLeft };
    }
    return { top: 0, left: 0 };
  }, []);

  // Memoize navigation classes
  const navClasses = useMemo(() => cn(
    "sticky inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/40 backdrop-blur-lg transition-all"
  ), []);

  const containerClasses = useMemo(() => cn(
    "flex justify-between items-center border-zinc-200",
    isAuthenticated ? "h-14 md:pt-3" : "h-10 md:pt-5"
  ), [isAuthenticated]);

  // Memoize filter bar visibility
  const showFilterBar = useMemo(() =>
    isAuthenticated && pathname === "/dashboard/data",
    [isAuthenticated, pathname]
  );

  return (
    <nav className={navClasses}>
      <MaxWidthWrapper>
        <div className="flex flex-col">
          <div className={containerClasses}>
            <div className="flex">
              <div className="flex items-center gap-2">
                <MdMemory size={30} className="text-black" />
                {isAuthenticated ? <h1 className="md:text-xl text-gray-400">/</h1> : <span className="text-2xl font-semibold text-black">xmem</span>}
              </div>
              <div className="flex flex-row gap-2 items-center pl-3">
                {userData?.image && (
                  <Image
                    src={userData.image}
                    alt="User avatar"
                    width={20}
                    height={20}
                    className="rounded-full object-cover aspect-square"
                  />
                )}
                {isAuthenticated && <p className="font-semibold text-sm">{userData?.name}</p>}
              </div>
            </div>

            <div className="flex gap-1 sm:gap-4 items-center">
              {/* Filter bar when authenticated */}
              {showFilterBar && (
                <div className="flex gap-4 items-center">
                  <input
                    type="text"
                    value={filterLabel}
                    onChange={handleFilterChange}
                    placeholder="Search by content or tags..."
                    className="p-2 border border-gray-300 rounded-lg md:w-[500px]"
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
                        {isAuthenticated ? (
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

                        <div className="flex flex-col">
                          {isAuthenticated && menuItems.map((item) => (
                            <button
                              key={item.label}
                              onClick={(e) => handleMenuItemClickWithSession(e, item.href)}
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
                {!isAuthenticated ? (
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
                        src={userData?.image || '/default-avatar.png'}
                        alt="User avatar"
                        width={30}
                        height={30}
                        className="rounded-full cursor-pointer"
                        onClick={handleAvatarClick}
                      />
                      {isModalOpen && (
                        <Modal onClose={handleModalClose} position={getAvatarPosition()}>
                          <div className="flex flex-col space-y-2">
                            <Link
                              href="/api-page"
                              className="text-sm text-gray-600 hover:text-black transition-colors"
                              onClick={handleModalClose}
                            >
                              API settings
                            </Link>
                            <button
                              className="text-sm text-gray-600 hover:text-black transition-colors"
                              onClick={handleSignOutWithModalClose}
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
              {isAuthenticated && menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleMenuItemClickWithSession(e, item.href)}
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
