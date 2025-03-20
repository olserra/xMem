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
                    The xmem API allows developers to programmatically manage data. This reference provides detailed information on how to use the API to perform CRUD operations and integrate xmem into your applications.
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
                        <strong>Data:</strong>
                        <ul className="list-disc list-inside ml-6">
                            <li><strong>GET /api/data</strong>: Retrieve all data accessible by the authenticated user.</li>
                            <li><strong>POST /api/data</strong>: Create a new data entry.</li>
                            <li><strong>GET /api/data/{"{"}dataId{"}"}</strong>: Retrieve a specific data entry by its ID.</li>
                            <li><strong>PUT /api/data/{"{"}dataId{"}"}</strong>: Update a data entry by its ID.</li>
                            <li><strong>DELETE /api/data/{"{"}dataId{"}"}</strong>: Delete a data entry by its ID.</li>
                        </ul>
                    </li>
                </ul>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">Example Requests</h2>

                <h3 className="scroll-m-20 text-xl font-semibold tracking-tight pt-2">Creating a Data Entry</h3>
                <pre className="bg-black text-white p-2 rounded mt-2">
                    {`POST /api/data
Authorization: Bearer fake-api-key-1234-5678-9876
Content-Type: application/json

{
    "content": "Training data on data management for AI agents.",
    "type": "training_data"
}`}
                </pre>

                <h3 className="scroll-m-20 text-xl font-semibold tracking-tight pt-2">Retrieving Data</h3>
                <pre className="bg-black text-white p-2 rounded mt-2">
                    {`GET /api/data?userId=fake-user-id-1234-5678
Authorization: Bearer fake-api-key-1234-5678-9876`}
                </pre>
                <h4 className="scroll-m-20 text-lg font-semibold tracking-tight pt-2">Sample Response:</h4>
                <pre className="bg-gray-100 p-2 rounded mt-2">
                    {`[
    {
        "id": "fake-data-id-1",
        "content": "Training data on data management for AI agents.",
        "type": "training_data",
        "createdAt": "2025-01-29T22:12:53.970Z",
        "updatedAt": "2025-01-29T22:12:53.970Z"
    },
    {
        "id": "fake-data-id-2",
        "content": "Ethical guidelines for training AI.",
        "type": "research_notes",
        "createdAt": "2025-01-29T12:10:28.197Z",
        "updatedAt": "2025-01-29T12:10:28.197Z"
    }
]`}
                </pre>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">Response Format</h2>
                <p className="leading-7">
                    All responses are returned in JSON format. Here's an example response for retrieving data:
                </p>
                <pre className="bg-gray-100 p-2 rounded mt-2">
                    {`[
    {
        "id": "fake-data-id-1",
        "content": "Training data on data management for AI agents.",
        "type": "training_data",
        "createdAt": "2025-01-29T22:12:53.970Z",
        "updatedAt": "2025-01-29T22:12:53.970Z"
    }
]`}
                </pre>
            </div>
        </div>
    );
}
