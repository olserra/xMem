import { Metadata } from "next";

export const metadata: Metadata = {
    title: "API Reference | xmem Documentation",
    description: "Detailed API reference for integrating and extending xmem.",
};

export default function ApiReferencePage() {
    return (
        <div className="space-y-6">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">API Reference</h1>

            <div className="space-y-4">
                <p className="leading-7">
                    The xmem API allows you to integrate your project&apos;s memories and data into other applications. You can
                    use the API to interact with your data programmatically, automate workflows, and extend the functionality
                    of xmem beyond its standard interface.
                </p>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">Overview</h2>
                <p className="leading-7">
                    xmem&apos;s API provides a set of RESTful endpoints that you can use to interact with your projects, memories,
                    and tags. The API is designed to be simple and flexible, allowing you to create, read, update, and delete
                    resources. You can use the API to access your data, integrate with third-party tools, and automate processes.
                </p>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">Authentication</h2>
                <p className="leading-7">
                    All API requests require authentication. You can authenticate using an API key, which you can generate from
                    the xmem dashboard. Once you have the API key, include it in the `Authorization` header of your requests.
                </p>
                <pre className="bg-black text-white p-2 rounded mt-2">
                    Authorization: Bearer YOUR_API_KEY
                </pre>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">API Endpoints</h2>
                <p className="leading-7">Here are the key API endpoints you can use to interact with xmem:</p>
                <ul className="list-disc list-inside space-y-2">
                    <li>
                        <strong>GET /api/projects</strong>: Retrieve all projects associated with the authenticated user.
                    </li>
                    <li>
                        <strong>POST /api/projects</strong>: Create a new project.
                    </li>
                    <li>
                        <strong>GET /api/memories</strong>: Retrieve all memories for a specific user and project.
                    </li>
                    <li>
                        <strong>POST /api/memories</strong>: Create a new memory within a project.
                    </li>
                    <li>
                        <strong>PUT /api/memories/&lt;id&gt;</strong>: Update an existing memory by its ID.
                    </li>
                </ul>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">Example Request</h2>
                <p className="leading-7">
                    Here is an example of how to fetch all memories using the xmem API:
                </p>
                <pre className="bg-black text-white p-2 rounded mt-2">
                    GET /api/memories?userId=your-user-id
                    Authorization: Bearer YOUR_API_KEY
                </pre>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">Response Format</h2>
                <p className="leading-7">
                    The API returns data in JSON format. Here&apos;s an example response for the <strong>GET /api/memories</strong> endpoint:
                </p>
                <pre className="bg-gray-100 p-2 rounded mt-2">
                    {`[
                        {
                            "id": "memoryId1",
                            "content": "This is a memory",
                            "tags": ["tag1", "tag2"],
                            "createdAt": "2025-01-01T10:00:00Z"
                        },
                        {
                            "id": "memoryId2",
                            "content": "Another memory",
                            "tags": ["tag3", "tag4"],
                            "createdAt": "2025-01-02T10:00:00Z"
                        }
                    ]`}
                </pre>
            </div>
        </div>
    );
}
