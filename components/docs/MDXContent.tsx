import { cn } from "@/lib/utils";

interface MDXContentProps {
    children: React.ReactNode;
    className?: string;
}

export function MDXContent({ children, className }: MDXContentProps) {
    return (
        <div className={cn(
            "mdx prose prose-gray max-w-none",
            "prose-headings:scroll-m-20 prose-headings:font-semibold",
            "prose-h1:text-4xl prose-h1:tracking-tight",
            "prose-h2:text-2xl prose-h2:tracking-tight",
            "prose-h3:text-xl prose-h3:tracking-tight",
            "prose-p:leading-7",
            "prose-li:marker:text-gray-400",
            "prose-code:rounded-md prose-code:bg-gray-100 prose-code:p-1",
            "prose-pre:rounded-lg prose-pre:border",
            className
        )}>
            {children}
        </div>
    );
} 