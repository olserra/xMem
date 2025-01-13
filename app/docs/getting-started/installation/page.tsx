import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Installation | xmem Documentation",
    description: "Learn how to install and set up xmem for your team.",
};

export default function InstallationPage() {
    return (
        <div className="space-y-6">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Installation</h1>

            <div className="space-y-4">
                <p className="leading-7">
                    Getting started with <strong>xmem</strong> is straightforward. This guide will walk you through the
                    process of setting up your environment and configuring xmem to get it up and running in no time.
                </p>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">Prerequisites</h2>
                <p className="leading-7">
                    Before you start, ensure that you have the following prerequisites installed and set up:
                </p>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Node.js 18 or higher:</strong> Make sure you are running Node.js version 18 or higher. This is required to run the server and handle modern JavaScript features.</li>
                    <li><strong>PostgreSQL Database:</strong> xmem requires PostgreSQL for persistent storage. You can either host it yourself or use a managed PostgreSQL service.</li>
                    <li><strong>GitHub Account:</strong> A GitHub account is necessary for authentication with the platform, as xmem integrates with GitHub for user management and authorization.</li>
                </ul>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">Setup Steps</h2>
                <p className="leading-7">
                    Follow these steps to install and configure xmem:
                </p>

                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-mono text-sm">1. Clone the repository</p>
                        <pre className="bg-black text-white p-2 rounded mt-2">
                            git clone https://github.com/yourusername/xmem.git
                        </pre>
                        <p className="leading-7">
                            This command will clone the xmem repository to your local machine. Ensure you replace `yourusername` with the actual GitHub username where xmem is hosted.
                        </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-mono text-sm">2. Install dependencies</p>
                        <pre className="bg-black text-white p-2 rounded mt-2">
                            cd xmem
                            pnpm install
                        </pre>
                        <p className="leading-7">
                            This step installs all the necessary dependencies using pnpm, a fast, disk space-efficient package manager. Make sure you have pnpm installed. If not, you can install it with <code>npm install -g pnpm</code>.
                        </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-mono text-sm">3. Set up environment variables</p>
                        <pre className="bg-black text-white p-2 rounded mt-2">
                            cp .env.example .env
                        </pre>
                        <p className="leading-7">
                            This step copies the example environment configuration to a `.env` file. Open the `.env` file and update the necessary values, such as your PostgreSQL connection string and GitHub authentication settings.
                        </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-mono text-sm">4. Run the database migrations</p>
                        <pre className="bg-black text-white p-2 rounded mt-2">
                            pnpm prisma migrate dev
                        </pre>
                        <p className="leading-7">
                            This will apply the database migrations to set up the required tables in your PostgreSQL database.
                        </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-mono text-sm">5. Start the development server</p>
                        <pre className="bg-black text-white p-2 rounded mt-2">
                            pnpm dev
                        </pre>
                        <p className="leading-7">
                            This will start the local development server. You should now be able to access xmem at <code>http://localhost:3000</code>.
                        </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-mono text-sm">6. Sign in with Google</p>
                        <p className="leading-7">
                            Once the server is running, you can sign in to xmem using your Google account. If it's the first time you're using the system, you may be asked to configure additional settings.
                        </p>
                    </div>
                </div>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">Next Steps</h2>
                <p className="leading-7">
                    Now that you’ve installed xmem, you can start capturing memories, organizing your knowledge into projects, and collaborating with your team.
                </p>
                <ul className="list-disc list-inside space-y-2">
                    <li><a href="/docs/getting-started" className="text-blue-500 hover:underline">Getting Started with Projects</a> – Learn how to create and manage projects in xmem.</li>
                    <li><a href="/docs/memory-management" className="text-blue-500 hover:underline">Memory Management</a> – Understand how to efficiently organize, search, and categorize your memories.</li>
                    <li><a href="/docs/integrations" className="text-blue-500 hover:underline">Integrations</a> – Explore the integrations with other tools to enhance your workflow.</li>
                </ul>
            </div>
        </div>
    );
}
