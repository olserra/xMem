"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const sidebarItems = {
    "Getting Started": [
        { title: "Introduction", href: "/docs/getting-started/introduction" },
        { title: "API Reference", href: "/docs/getting-started/api" },
        { title: "Interface", href: "/docs/getting-started/interface" },
    ],
    "Core Concepts": [
        { title: "Data", href: "/docs/core-concepts/data" },
    ],
    "Advanced Usage": [
        { title: "Customization", href: "/docs/advanced/customization" },
        { title: "Best Practices", href: "/docs/advanced/best-practices" },
    ],
};

// Example Sidebar Component for Advanced Usage
export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed md:sticky top-[3.5rem] z-20 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:block overflow-y-auto">
            <div className="h-full border-r border-gray-200 bg-white/40 backdrop-blur-lg transition-all">
                <div className="py-6 pr-6 lg:py-8">
                    {Object.entries(sidebarItems).map(([category, items]) => (
                        <div key={category} className="pb-4">
                            <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">{category}</h4>
                            <div className="grid grid-flow-row auto-rows-max text-sm">
                                {items.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex w-full items-center rounded-md p-2 hover:underline",
                                            pathname === item.href
                                                ? "bg-black text-white"
                                                : "text-gray-600 hover:bg-gray-100"
                                        )}
                                    >
                                        {item.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}
