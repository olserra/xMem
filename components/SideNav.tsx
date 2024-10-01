"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { handleSignIn } from "@/app/helpers/handleSignIn";
import { handleSignOut } from "@/app/helpers/handleSignOut";

export const SideNav = ({ menuItems, setIsOpen }: any) => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleMenuItemClick = (href: string) => {
    if (!session) {
      handleSignIn;
    } else {
      router.push(href);
      setIsOpen(false);
    }
  };

  const handleGetStartedClick = () => {
    handleSignIn;
    setIsOpen(false); // Close the sidebar on "Get Started"
  };

  return (
    <div className="flex flex-col h-full text-primary bg-secondary">
      <div className="p-3 flex flex-1 justify-center">
        <div className="space-y-2">
          {session ? (
            <button
              className="bg-black text-white text-sm p-2 rounded-lg focus:outline-none"
              onClick={handleSignOut}
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
