import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tags | xmem Documentation",
    description: "Learn about tags in xmem, a system to categorize and organize your memories.",
};

export default function TagsPage() {
    return (
        <div className="space-y-6">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Tags</h1>

            <div className="space-y-4">
                <p className="leading-7">
                    Tags are a key feature in xmem that help you organize and categorize your memories. They provide an easy
                    way to search, filter, and group memories based on common themes, making it easier to retrieve the information you need.
                </p>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">What Are Tags?</h2>
                <p className="leading-7">
                    Tags are labels you assign to memories to categorize them. They are flexible, so you can create tags based
                    on topics, themes, or any other way that fits your organization system. Each memory can have multiple tags,
                    allowing you to group it with other related memories across projects.
                </p>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">Creating and Assigning Tags</h2>
                <p className="leading-7">
                    When creating or editing a memory, you can add tags to help categorize it. You can assign up to three tags to
                    each memory. To add tags:
                </p>
                <ol className="list-decimal list-inside space-y-2">
                    <li>Go to the memory creation or editing form.</li>
                    <li>Click on the <strong>Tags</strong> field.</li>
                    <li>Enter the relevant tags (separate them with commas) or select from existing tags.</li>
                    <li>Click <strong>Save</strong> to assign the tags to your memory.</li>
                </ol>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">Best Practices for Tagging</h2>
                <p className="leading-7">
                    To keep your memories organized, it&apos;s important to use tags consistently. Here are some best practices:
                </p>
                <ul className="list-disc list-inside space-y-2">
                    <li>Use meaningful tags that clearly describe the content of the memory.</li>
                    <li>Limit the number of tags to 3 per memory to keep them concise and relevant.</li>
                    <li>Group related memories using similar tags across different projects.</li>
                </ul>
            </div>
        </div>
    );
}
