import Image from "next/image";  // For handling images
import { Metadata } from "next";
import Logo from "@/public/logo.jpg"

export const metadata: Metadata = {
    title: "Help | Your Brand Documentation",
    description: "Need assistance? Reach out to our support community.",
};

export default function HelpPage() {
    return (
        <div className="flex flex-col items-start justify-start min-h-screen pt-4 md:pt-24">
            <div className="text-center">
                {/* Icon and Title */}
                <div className="flex flex-col items-center text-4xl font-bold text-gray-800">
                    <div className="flex justify-center">
                        {/* Replace with your logo */}
                        <Image
                            src={Logo}
                            alt="Your Logo"
                            width={100}
                            height={100}
                            className="mr-2 rounded-lg border"
                        />
                    </div>

                    <h1 className="mt-4 text-xl font-semibold text-gray-900">
                        Reach out on our official support platform.
                    </h1>
                </div>

                {/* Links to support */}
                <div className="flex space-x-8 justify-center mt-8">
                    {/* Vercel Community-like Section */}
                    <div className="bg-white shadow-md rounded-lg p-6 w-80">
                        <h3 className="text-xl font-semibold text-gray-800">Our Community</h3>
                        <p className="mt-2 text-gray-600 text-sm">
                            Join the conversation, ask questions, and get help from like-minded developers.
                        </p>
                        <a
                            href="https://discord.gg/uxbWduzU"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-block bg-black text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Go to our Community
                        </a>
                    </div>

                    {/* Customer Support Section */}
                    <div className="bg-white shadow-md rounded-lg p-6 w-80">
                        <h3 className="text-xl font-semibold text-gray-800">Customer Support</h3>
                        <p className="mt-2 text-gray-600 text-sm">
                            Submit a case directly to our customer success team for personalized help.
                        </p>
                        <a
                            href="mailto:support@yourdomain.com"  // Replace with your support email or link
                            className="mt-4 inline-block bg-black text-white text-center py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Get Help
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
