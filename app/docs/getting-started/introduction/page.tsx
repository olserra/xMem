import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Introduction | xmem Documentation",
    description: "Getting started with xmem - A modern knowledge management system.",
};

export default function IntroductionPage() {
    return (
        <div className="space-y-6">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Introduction</h1>

            <div className="space-y-4">
                <p className="leading-7">
                    Welcome to <strong>xmem</strong>! This documentation will help you get started
                    with our modern knowledge management system designed to help individuals and teams efficiently
                    capture, organize, and share knowledge. xmem is built for flexibility, making it suitable
                    for both personal and collaborative use cases.
                </p>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">What is xmem?</h2>
                <p className="leading-7">
                    xmem is a next-generation knowledge management system that centralizes your notes,
                    documents, and memories in one place. Whether you&apos;re an individual looking to organize your thoughts
                    or a team collaborating on projects, xmem helps you stay organized, find information quickly, and
                    share insights effectively. It&apos;s designed to be simple to use but powerful enough to scale as your
                    knowledge base grows.
                </p>

                <p className="leading-7">
                    With xmem, your team or personal knowledge is always at your fingertips, making it easier
                    to manage and access critical information when needed. It&apos;s a platform built with modern teams in
                    mind, offering the flexibility to handle all types of data, from simple notes to complex projects.
                </p>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">Key Features</h2>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Project-based Organization:</strong> xmem helps you organize your knowledge by projects, allowing you to maintain focused, compartmentalized collections of information.</li>
                    <li><strong>Real-time Collaboration:</strong> Collaborate seamlessly with team members by sharing memories and working together on projects, ensuring that knowledge is accessible and actionable.</li>
                    <li><strong>Powerful Search Capabilities:</strong> xmem&apos;s search functionality is designed to help you find relevant information quickly, whether you&apos;re looking for a specific memory or a set of related documents.</li>
                    <li><strong>Version Control:</strong> Track the evolution of your documents and memories. xmem allows you to manage different versions of your content, providing full history and version rollback capabilities.</li>
                    <li><strong>AI Integration:</strong> Leverage artificial intelligence to analyze and synthesize information from your memories. Whether it&apos;s organizing insights or generating summaries, xmem&apos;s AI-powered features can enhance your productivity.</li>
                    <li><strong>APIs for Custom Integrations:</strong> xmem provides developers with APIs to integrate the platform with other tools and services, enabling seamless workflows and automation.</li>
                </ul>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">How xmem Benefits You</h2>
                <p className="leading-7">
                    xmem isn&apos;t just a note-taking app – it&apos;s a full knowledge management system designed to scale with your needs.
                    Whether you&apos;re managing your personal knowledge, collaborating with a team, or integrating data from other systems,
                    xmem adapts to ensure that your workflow remains smooth, efficient, and productive.
                </p>

                <p className="leading-7">
                    For developers, xmem provides an easy-to-use API to fetch your data, enabling you to integrate memories into any external application, such as an AI agent or custom dashboards. With this flexibility, you can build rich, data-driven applications that leverage your knowledge base for smarter decisions.
                </p>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">Getting Started</h2>
                <p className="leading-7">
                    To get started with xmem, follow the documentation on setting up your account, organizing your first project, and
                    creating your first memory. Whether you&apos;re using xmem for personal knowledge management or to drive your team&apos;s success,
                    this guide will provide you with the resources you need to start capturing valuable insights and knowledge.
                </p>
            </div>
        </div>
    );
}
