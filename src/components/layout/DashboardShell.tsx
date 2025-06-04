"use client";
import DashboardHeader from "./DashboardHeader";
import Sidebar from "./Sidebar";
import { Database, Cpu, Clock, Settings, Sparkles, BarChart, MessageCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <Database size={20} /> },
    { id: "memory", label: "Memory Manager", icon: <Cpu size={20} /> },
    { id: "context", label: "Context Manager", icon: <Clock size={20} /> },
    { id: "integrationhub", label: "Integration Hub", icon: <Sparkles size={20} /> },
    { id: "ai-agent", label: "AI Agent", icon: <MessageCircle size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    let currentPage = "dashboard";
    if (pathname.startsWith("/dashboard/memory")) currentPage = "memory";
    else if (pathname.startsWith("/dashboard/context")) currentPage = "context";
    else if (pathname.startsWith("/dashboard/integrationhub")) currentPage = "integrationhub";
    else if (pathname.startsWith("/dashboard/settings")) currentPage = "settings";
    else if (pathname.startsWith("/dashboard/ai-agent")) currentPage = "ai-agent";
    else if (pathname.startsWith("/dashboard")) currentPage = "dashboard";

    return (
        <>
            <div className="w-full max-w-full overflow-x-hidden">
                <DashboardHeader />
                <div className="flex min-h-screen pt-16 w-full max-w-full overflow-x-hidden">
                    <Sidebar
                        navItems={navItems}
                        currentPage={currentPage}
                        onNavigate={(page) => {
                            if (page === "dashboard") router.push("/dashboard");
                            else router.push(`/dashboard/${page}`);
                        }}
                    />
                    <main className="flex-1 bg-slate-50 px-2 sm:px-4 md:px-8 pt-6 w-full max-w-full overflow-x-auto">{children}</main>
                </div>
            </div>
        </>
    );
} 