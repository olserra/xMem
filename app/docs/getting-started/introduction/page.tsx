import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Introduction | xmem Documentation",
    description: "Getting started with xmem – A powerful API for managing projects and memories.",
};

export default function IntroductionPage() {
    return (
        <div className="space-y-6">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Introduction</h1>

            <div className="space-y-4">
                <p className="leading-7">
                    Welcome to <strong>xmem</strong>! xmem is a powerful API that allows developers to create, read, update, and delete (CRUD) projects and memories. This documentation will help you get started with integrating xmem into your applications, enabling you to manage knowledge and data programmatically.
                </p>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">What is xmem?</h2>
                <p className="leading-7">
                    xmem is a modern, API-driven knowledge management system that developers can integrate into their applications. It provides a set of RESTful API endpoints to manage projects and memories, allowing you to build custom solutions for organizing and accessing knowledge.
                </p>

                <p className="leading-7">
                    With xmem, you can create applications that store and retrieve data in a structured way, enabling efficient knowledge sharing and collaboration across different platforms and services.
                </p>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">Key Features</h2>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>API-First Approach:</strong> xmem provides a comprehensive RESTful API for managing projects and memories, giving developers full control over their data.</li>
                    <li><strong>Flexible Data Management:</strong> Create, read, update, and delete projects and memories programmatically to suit your application's needs.</li>
                    <li><strong>Authentication and Security:</strong> Secure your data with API keys and authentication mechanisms to ensure only authorized access.</li>
                    <li><strong>Scalability:</strong> xmem is designed to handle growing amounts of data, making it suitable for applications of any size.</li>
                    <li><strong>Integration-Friendly:</strong> Easily integrate xmem's API with your existing applications, services, and workflows.</li>
                </ul>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">Getting Started</h2>
                <p className="leading-7">
                    To start using xmem, you need to obtain an API key and familiarize yourself with the available endpoints. The following sections will guide you through the process of setting up your API key and making your first API calls.
                </p>
            </div>
        </div>
    );
}
