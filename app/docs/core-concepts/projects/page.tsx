import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Projects | xmem Documentation",
    description: "Learn about projects in xmem, a way to organize your memories and knowledge.",
};

export default function ProjectsPage() {
    return (
        <div className="space-y-6">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Projects</h1>

            <div className="space-y-4">
                <p className="leading-7">
                    In xmem, projects help you organize your knowledge into distinct categories. Projects allow you to keep
                    related memories together, whether for personal use or team collaboration. A project can hold many memories,
                    and you can easily switch between projects to stay organized.
                </p>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">What Are Projects?</h2>
                <p className="leading-7">
                    A project is a container for your memories. It helps group related pieces of knowledge under a common theme.
                    For example, you can have a project for personal notes, work-related documents, or a team project you&apos;re
                    collaborating on. Projects make it easy to manage different areas of your knowledge.
                </p>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">Creating a Project</h2>
                <p className="leading-7">
                    To create a project, follow these simple steps:
                </p>
                <ol className="list-decimal list-inside space-y-2">
                    <li>Go to the <strong>Projects</strong> page.</li>
                    <li>Click <strong>&quot;New Project&quot;</strong> at the top right.</li>
                    <li>Fill in the project name and description.</li>
                    <li>Click <strong>Create</strong> to finalize the project creation.</li>
                </ol>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">Managing Projects</h2>
                <p className="leading-7">
                    After creating your project, you can manage it by adding memories, editing the project&apos;s details, or
                    deleting it if it&apos;s no longer needed. Each project can have a unique set of memories and tags, making it easy
                    to stay organized.
                </p>
            </div>
        </div>
    );
}
