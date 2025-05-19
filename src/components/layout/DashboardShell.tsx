"use client";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Database, Cpu, Clock, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <Database size={20} /> },
    { id: "memory", label: "Memory Manager", icon: <Cpu size={20} /> },
    { id: "context", label: "Context Manager", icon: <Clock size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    let currentPage = "dashboard";
    if (pathname.startsWith("/memory")) currentPage = "memory";
    else if (pathname.startsWith("/context")) currentPage = "context";
    else if (pathname.startsWith("/settings")) currentPage = "settings";
    else if (pathname.startsWith("/dashboard")) currentPage = "dashboard";

    return (
        <>
            <Header />
            <div className="flex min-h-screen">
                <Sidebar
                    navItems={navItems}
                    currentPage={currentPage}
                    onNavigate={(page) => {
                        if (page === "dashboard") router.push("/dashboard");
                        else router.push(`/${page}`);
                    }}
                />
                <main className="flex-1 bg-slate-50 px-4 md:px-8 pt-6">{children}</main>
            </div>
        </>
    );
} 