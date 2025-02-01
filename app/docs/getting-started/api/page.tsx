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
                    The xmem API allows developers to programmatically manage projects and memories. This reference provides detailed information on how to use the API to perform CRUD operations and integrate xmem into your applications.
                </p>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">Authentication</h2>
                <p className="leading-7">
                    All API requests require authentication using an API key. To obtain your API key, log in to your xmem account and navigate to the API Management section. Include the API key in the `Authorization` header of your requests:
                </p>
                <pre className="bg-black text-white p-2 rounded mt-2">
                    Authorization: Bearer YOUR_API_KEY
                </pre>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">API Endpoints</h2>
                <p className="leading-7">Below are the key API endpoints available:</p>
                <ul className="list-disc list-inside space-y-2">
                    <li>
                        <strong>Projects:</strong>
                        <ul className="list-disc list-inside ml-6">
                            <li><strong>GET /api/projects</strong>: Retrieve all projects accessible by the authenticated user.</li>
                            <li><strong>POST /api/projects</strong>: Create a new project.</li>
                            <li><strong>GET /api/projects/{'{projectId}'}</strong>: Retrieve a specific project by its ID.</li>
                            <li><strong>PUT /api/projects/{'{projectId}'}</strong>: Update a project by its ID.</li>
                            <li><strong>DELETE /api/projects/{'{projectId}'}</strong>: Delete a project by its ID.</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Memories:</strong>
                        <ul className="list-disc list-inside ml-6">
                            <li><strong>GET /api/memories</strong>: Retrieve all memories accessible by the authenticated user.</li>
                            <li><strong>POST /api/memories</strong>: Create a new memory.</li>
                            <li>
                                <strong>GET /api/memories/{"{"}memoryId{"}"}</strong>: Retrieve a specific memory by its ID.
                            </li>
                            <li>
                                <strong>PUT /api/memories/{"{"}memoryId{"}"}</strong>: Update a memory by its ID.
                            </li>
                            <li>
                                <strong>DELETE /api/memories/{"{"}memoryId{"}"}</strong>: Delete a memory by its ID.
                            </li>
                        </ul>
                    </li>
                </ul>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">Example Requests</h2>

                <h3 className="scroll-m-20 text-xl font-semibold tracking-tight pt-2">Creating a Project</h3>
                <pre className="bg-black text-white p-2 rounded mt-2">
                    {`POST /api/projects
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
    "name": "My New Project",
    "description": "A description of my new project"
}`}
                </pre>

                <h3 className="scroll-m-20 text-xl font-semibold tracking-tight pt-2">Retrieving Memories</h3>
                <pre className="bg-black text-white p-2 rounded mt-2">
                    {`GET /api/memories
Authorization: Bearer YOUR_API_KEY`}
                </pre>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">Response Format</h2>
                <p className="leading-7">
                    All responses are returned in JSON format. Here's an example response for retrieving memories:
                </p>
                <pre className="bg-gray-100 p-2 rounded mt-2">
                    {`[
    {
        "id": "memoryId1",
        "content": "This is a memory",
        "type": "note",
        "projectId": "projectId1",
        "createdAt": "2023-01-01T10:00:00Z",
        "updatedAt": "2023-01-01T10:00:00Z"
    },
    {
        "id": "memoryId2",
        "content": "Another memory",
        "type": "idea",
        "projectId": "projectId2",
        "createdAt": "2023-01-02T10:00:00Z",
        "updatedAt": "2023-01-02T10:00:00Z"
    }
]`}
                </pre>
            </div>
        </div>
    );
}
