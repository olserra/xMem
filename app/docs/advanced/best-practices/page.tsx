import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Best Practices | xmem Documentation",
    description: "Learn best practices for using xmem effectively.",
};

export default function BestPracticesPage() {
    return (
        <div className="space-y-6">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Best Practices</h1>

            <div className="space-y-4">
                <p className="leading-7">
                    To get the most out of xmem, it’s important to follow best practices for organizing, tagging, and managing
                    your projects and memories. By following these guidelines, you can ensure your knowledge base remains efficient
                    and scalable.
                </p>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">Organizing Projects</h2>
                <p className="leading-7">
                    Projects should be organized around major themes or goals. Ensure each project has a clear purpose and structure.
                    Use descriptive project names and detailed descriptions to make it easy to understand what the project is about.
                </p>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">Tagging Best Practices</h2>
                <p className="leading-7">
                    Tags are crucial for organizing and searching your memories. Here are some best practices for using tags:
                </p>
                <ul className="list-disc list-inside space-y-2">
                    <li>Use meaningful and consistent tags for easy categorization.</li>
                    <li>Limit tags to 3 per memory for simplicity.</li>
                    <li>Create tags that reflect topics, actions, or themes that are relevant across projects.</li>
                </ul>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">Collaboration Tips</h2>
                <p className="leading-7">
                    When working in teams, clear communication and collaboration are key. Ensure that everyone understands the
                    project structure, tagging conventions, and how to contribute effectively. You can also use integrations with
                    other tools to facilitate real-time collaboration.
                </p>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">Maintaining Knowledge Quality</h2>
                <p className="leading-7">
                    Regularly review your projects and memories to keep the knowledge base up to date. Remove outdated content,
                    archive completed projects, and make sure that your tags remain relevant as your project evolves.
                </p>
            </div>
        </div>
    );
}
