import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quick Start | xmem Documentation",
    description: "Get up and running with xmem in minutes.",
};

export default function QuickStartPage() {
    return (
        <div className="space-y-6">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Quick Start</h1>

            <div className="space-y-4">
                <p className="leading-7">
                    Welcome to the <strong>xmem</strong> Quick Start guide! In this section, we'll walk you through the
                    basics of getting started with xmem, from creating your first project to adding memories, so you can
                    start organizing your knowledge right away.
                </p>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">Creating Your First Project</h2>
                <p className="leading-7">
                    A project in xmem helps you organize your memories and notes. Follow these steps to create your first
                    project:
                </p>
                <ol className="list-decimal list-inside space-y-2">
                    <li>Navigate to the <strong>Projects</strong> page from the main dashboard.</li>
                    <li>Click the <strong>"New Project"</strong> button at the top right of the page.</li>
                    <li>Fill in the project details, including the name and description, to help you identify the project later.</li>
                    <li>Click <strong>Create</strong> to finalize your project. Your new project will now appear on the dashboard.</li>
                </ol>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">Adding Memories</h2>
                <p className="leading-7">
                    Memories are the core elements within each project. You can add your thoughts, notes, and insights as memories.
                    Once you’ve created a project, follow these steps to add memories to it:
                </p>
                <ol className="list-decimal list-inside space-y-2">
                    <li>Go to the <strong>Project</strong> page that you just created.</li>
                    <li>Click the <strong>"Create Memory"</strong> button to open the memory creation form.</li>
                    <li>Enter the content of your memory. This can include notes, ideas, or anything you’d like to capture.</li>
                    <li>Add <strong>exactly 3 tags</strong> to your memory to categorize it. Tags are important for easy searching and organizing your content later.</li>
                    <li>Click <strong>Save</strong> to add your memory to the project. Your memory will now be listed under the project’s details.</li>
                </ol>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                    <p className="text-yellow-700">
                        <strong>Tip:</strong> Tags are essential for organizing your memories. Consistently use relevant tags for each memory
                        to make it easier to search and filter later.
                    </p>
                </div>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">Next Steps</h2>
                <p className="leading-7">
                    Now that you’ve created your first project and added a memory, you’re ready to explore more advanced features.
                    Here are some next steps you can take:
                </p>
                <ul className="list-disc list-inside space-y-2">
                    <li><a href="/docs/memory-management" className="text-blue-500 hover:underline">Learn how to manage your memories</a> – Organize, search, and edit your memories.</li>
                    <li><a href="/docs/integrations" className="text-blue-500 hover:underline">Integrate xmem with other tools</a> – Connect your knowledge base to external applications for enhanced workflows.</li>
                    <li><a href="/docs/advanced-features" className="text-blue-500 hover:underline">Explore advanced features</a> – Discover advanced options like collaboration and version control.</li>
                </ul>
            </div>
        </div>
    );
}
