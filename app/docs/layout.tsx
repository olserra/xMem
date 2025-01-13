import { Sidebar } from "@/components/docs/Sidebar";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen">
            <MaxWidthWrapper>
                <div className="flex items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
                    {/* Sidebar on the left */}
                    <Sidebar />
                    <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid flex-1">
                        <div className="mx-auto w-full min-w-0">
                            {children}
                        </div>
                    </main>
                </div>
            </MaxWidthWrapper>
        </div>
    );
}
