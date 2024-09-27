import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { SideNav } from "@/components/SideNav";

export const MobileNav = ({ menuItems, setIsOpen }: any) => {
  return (
    <Sheet>
      <SheetTrigger className="sm:hidden pr-4">
        <Menu />
      </SheetTrigger>

      <SheetContent side="right" className="p-0 bg-secondary pt-5 w-32">
        <SheetClose />
        <SideNav menuItems={menuItems} setIsOpen={setIsOpen} /> {/* Pass setIsOpen to SideNav */}
      </SheetContent>
    </Sheet>
  );
};
