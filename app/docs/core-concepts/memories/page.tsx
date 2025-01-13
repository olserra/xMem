import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Memories | xmem Documentation",
    description: "Learn about memories in xmem, the core unit for capturing and organizing your knowledge.",
};

export default function MemoriesPage() {
    return (
        <div className="space-y-6">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Memories</h1>

            <div className="space-y-4">
                <p className="leading-7">
                    In xmem, memories are the core units of knowledge. They are used to capture thoughts, ideas, insights,
                    and any other type of information you wish to store. Memories are versatile and can be organized, tagged,
                    and searched to help you stay organized.
                </p>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">What Are Memories?</h2>
                <p className="leading-7">
                    Memories are individual pieces of knowledge you create within a project. A memory can be a simple note,
                    an idea, or any piece of content you want to capture. Each memory contains the following elements:
                </p>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Content:</strong> The main body of your memory, where you describe your thoughts or ideas.</li>
                    <li><strong>Tags:</strong> Labels you assign to categorize your memory. Tags help with organization and searching.</li>
                    <li><strong>Project:</strong> Memories belong to specific projects, making it easy to organize knowledge related to a particular theme.</li>
                    <li><strong>Metadata:</strong> Additional details such as the creation date and any custom information relevant to the memory.</li>
                </ul>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">Creating Memories</h2>
                <p className="leading-7">
                    To create a memory in xmem, you first need to create a project. Once you have a project, you can add memories
                    to it. Follow these steps to create a memory:
                </p>
                <ol className="list-decimal list-inside space-y-2">
                    <li>Go to your project page.</li>
                    <li>Click the <strong>&quot;Create Memory&quot;</strong> button.</li>
                    <li>Enter the content of your memory.</li>
                    <li>Add <strong>exactly 3 tags</strong> to categorize your memory.</li>
                    <li>Click <strong>Save</strong> to add your memory to the project.</li>
                </ol>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">Managing Memories</h2>
                <p className="leading-7">
                    You can edit, delete, or organize your memories within a project. By using tags, you can easily filter and
                    search for specific memories. Here are some tips for managing your memories effectively:
                </p>
                <ul className="list-disc list-inside space-y-2">
                    <li>Use meaningful tags that represent the content of your memory.</li>
                    <li>Group related memories within the same project for easy access.</li>
                    <li>Review and update your memories regularly to keep them relevant.</li>
                </ul>
            </div>
        </div>
    );
}
