import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Projects | xmem Documentation",
    description: "Learn how to manage projects using the xmem API.",
};

export default function ProjectsPage() {
    return (
        <div className="space-y-6">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Projects</h1>

            <div className="space-y-4">
                <p className="leading-7">
                    Projects in xmem are containers that help you organize your memories. Using the xmem API, you can programmatically create, retrieve, update, and delete projects to structure your data effectively.
                </p>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">Managing Projects via API</h2>
                <p className="leading-7">
                    The xmem API provides endpoints to perform CRUD operations on projects. Below are examples of how to use these endpoints.
                </p>

                <h3 className="scroll-m-20 text-xl font-semibold tracking-tight pt-2">Creating a Project</h3>
                <pre className="bg-black text-white p-2 rounded mt-2">
                    {`POST /api/projects
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
    "name": "Project Name",
    "description": "Project Description"
}`}
                </pre>

                <h3 className="scroll-m-20 text-xl font-semibold tracking-tight pt-2">Retrieving Projects</h3>
                <pre className="bg-black text-white p-2 rounded mt-2">
                    {`GET /api/projects
Authorization: Bearer YOUR_API_KEY`}
                </pre>

                <h3 className="scroll-m-20 text-xl font-semibold tracking-tight pt-2">Updating a Project</h3>
                <pre className="bg-black text-white p-2 rounded mt-2">
                    {`PUT /api/projects/{projectId}
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
    "name": "Updated Project Name",
    "description": "Updated Description"
}`}
                </pre>

                <h3 className="scroll-m-20 text-xl font-semibold tracking-tight pt-2">Deleting a Project</h3>
                <pre className="bg-black text-white p-2 rounded mt-2">
                    {`DELETE /api/projects/{projectId}
Authorization: Bearer YOUR_API_KEY`}
                </pre>
            </div>
        </div>
    );
}
