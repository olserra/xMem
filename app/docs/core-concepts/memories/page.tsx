import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Data | xmem Documentation",
    description: "Learn how to manage data using the xmem API.",
};

export default function DataPage() {
    return (
        <div className="space-y-6">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Data</h1>

            <div className="space-y-4">
                <p className="leading-7">
                    Data are the core units of data in xmem. Using the xmem API, you can create, retrieve, update, and delete data within your data, enabling efficient knowledge management.
                </p>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">Managing Data via API</h2>
                <p className="leading-7">
                    The xmem API provides endpoints for performing CRUD operations on data. Below are examples demonstrating how to use these endpoints.
                </p>

                <h3 className="scroll-m-20 text-xl font-semibold tracking-tight pt-2">Creating a Memory</h3>
                <pre className="bg-black text-white p-2 rounded mt-2">
                    {`POST /api/data
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
    "content": "This is a _data",
    "type": "note",
    "projectId": "your-project-id"
}`}
                </pre>

                <h3 className="scroll-m-20 text-xl font-semibold tracking-tight pt-2">Retrieving Data</h3>
                <pre className="bg-black text-white p-2 rounded mt-2">
                    {`GET /api/data
Authorization: Bearer YOUR_API_KEY`}
                </pre>

                <h3 className="scroll-m-20 text-xl font-semibold tracking-tight pt-2">Updating a Memory</h3>
                <pre className="bg-black text-white p-2 rounded mt-2">
                    {`PUT /api/data/{_dataId}
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
    "content": "Updated _data content",
    "type": "updated-type"
}`}
                </pre>

                <h3 className="scroll-m-20 text-xl font-semibold tracking-tight pt-2">Deleting a Memory</h3>
                <pre className="bg-black text-white p-2 rounded mt-2">
                    {`DELETE /api/data/{_dataId}
Authorization: Bearer YOUR_API_KEY`}
                </pre>
            </div>
        </div>
    );
}
