"use client";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { signOut, signIn, useSession } from "next-auth/react";

export const SideNav = ({ menuItems, setIsOpen }: any) => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleClickSignOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    signOut();
  };

  const handleMenuItemClick = (href: string) => {
    if (!session) {
      signIn("google", {
        callbackUrl: "https://www.openskills.online/api/auth/callback/google",
      });
    } else {
      router.push(href);
      setIsOpen(false); // Close the sidebar when a menu item is clicked
    }
  };

  const handleGetStartedClick = () => {
    signIn("google", {
      callbackUrl: "https://www.openskills.online/api/auth/callback/google",
    });
    setIsOpen(false); // Close the sidebar on "Get Started"
  };

  return (
    <div className="flex flex-col h-full text-primary bg-secondary">
      <div className="p-3 flex flex-1 justify-center">
        <div className="space-y-2">
          {session ? (
            <button
              className="bg-black text-white text-sm p-2 rounded-lg focus:outline-none"
              onClick={handleClickSignOut}
            >
              Sign Out
            </button>
          ) : (
            <button
              className="bg-black text-white text-sm p-2 rounded focus:outline-none"
              onClick={handleGetStartedClick}
            >
              Get Started
            </button>
          )}
          <div className="flex flex-col">
            {menuItems.map((item: any) => (
              <div
                key={item.label}
                onClick={() => handleMenuItemClick(item.href)}
                className="uppercase text-black text-sm p-2 hover:bg-gray-200 rounded cursor-pointer"
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
