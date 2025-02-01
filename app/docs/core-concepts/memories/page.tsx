import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Memories | xmem Documentation",
    description: "Learn how to manage memories using the xmem API.",
};

export default function MemoriesPage() {
    return (
        <div className="space-y-6">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Memories</h1>

            <div className="space-y-4">
                <p className="leading-7">
                    Memories are the core units of data in xmem. Using the xmem API, you can create, retrieve, update, and delete memories within your projects, enabling efficient knowledge management.
                </p>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">Managing Memories via API</h2>
                <p className="leading-7">
                    The xmem API provides endpoints for performing CRUD operations on memories. Below are examples demonstrating how to use these endpoints.
                </p>

                <h3 className="scroll-m-20 text-xl font-semibold tracking-tight pt-2">Creating a Memory</h3>
                <pre className="bg-black text-white p-2 rounded mt-2">
                    {`POST /api/memories
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
    "content": "This is a memory",
    "type": "note",
    "projectId": "your-project-id"
}`}
                </pre>

                <h3 className="scroll-m-20 text-xl font-semibold tracking-tight pt-2">Retrieving Memories</h3>
                <pre className="bg-black text-white p-2 rounded mt-2">
                    {`GET /api/memories
Authorization: Bearer YOUR_API_KEY`}
                </pre>

                <h3 className="scroll-m-20 text-xl font-semibold tracking-tight pt-2">Updating a Memory</h3>
                <pre className="bg-black text-white p-2 rounded mt-2">
                    {`PUT /api/memories/{memoryId}
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
    "content": "Updated memory content",
    "type": "updated-type"
}`}
                </pre>

                <h3 className="scroll-m-20 text-xl font-semibold tracking-tight pt-2">Deleting a Memory</h3>
                <pre className="bg-black text-white p-2 rounded mt-2">
                    {`DELETE /api/memories/{memoryId}
Authorization: Bearer YOUR_API_KEY`}
                </pre>
            </div>
        </div>
    );
}
