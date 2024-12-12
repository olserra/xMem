'use client';

import { useState } from "react";
import { FaDatabase, FaSync, FaUserShield, FaSearch, FaBrain } from "react-icons/fa";
import { AiOutlineApi } from "react-icons/ai";

export default function Home() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userEmail: email,
            userName: "User", // Replace with a dynamic name if available
          }),
        });

        if (response.ok) {
          console.log("Email submitted successfully:", email);
          setSubmitted(true);
          setEmail(''); // Reset the input field
        } else {
          const errorData = await response.json();
          console.error("Error:", errorData.error);
        }
      } catch (error) {
        console.error("Error sending email:", error);
      }
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div className="mt-10 px-4 flex flex-col items-center justify-center text-center sm:mt-12">
        <h1 className="max-w-4xl text-3xl font-bold sm:text-4xl md:text-6xl lg:text-7xl">
          Share Data <span className="font-light"> Across Platforms and LLMs</span>
        </h1>
        <p className="mt-5 max-w-prose text-sm text-zinc-700 sm:text-base md:text-xl">
          Empower your organization with organized, accessible, and secure data management solutions.
        </p>

        {/* Key Features Section */}
        <div className="my-16 md:my-24 flex flex-col items-center text-center w-full">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-3 w-full max-w-6xl">
            {/* Feature 1: Centralized Data Repository */}
            <div className="flex flex-col items-center p-4 border rounded-lg shadow-sm hover:shadow-md transition duration-200">
              <FaDatabase className="text-gray-600 text-3xl mb-4" />
              <h3 className="text-lg font-semibold">Centralized Data Repository</h3>
              <p className="mt-2 text-xs text-zinc-600 sm:text-sm">
                Consolidate all your organizational data, documentation, and best practices in one unified repository.
              </p>
            </div>
            {/* Feature 2: Robust API Access and Integration */}
            <div className="flex flex-col items-center p-4 border rounded-lg shadow-sm hover:shadow-md transition duration-200">
              <AiOutlineApi className="text-gray-600 text-3xl mb-4" />
              <h3 className="text-lg font-semibold">Robust API Access and Integration</h3>
              <p className="mt-2 text-xs text-zinc-600 sm:text-sm">
                Seamlessly connect xmem.xyz with your existing tools and platforms via our comprehensive API.
              </p>
            </div>
            {/* Feature 3: Real-Time Data Synchronization */}
            <div className="flex flex-col items-center p-4 border rounded-lg shadow-sm hover:shadow-md transition duration-200">
              <FaSync className="text-gray-600 text-3xl mb-4" />
              <h3 className="text-lg font-semibold">Real-Time Data Synchronization</h3>
              <p className="mt-2 text-xs text-zinc-600 sm:text-sm">
                Ensure all teams have access to the latest information with instant data syncing across your organization.
              </p>
            </div>
            {/* Feature 4: Role-Based Access Control (RBAC) */}
            <div className="flex flex-col items-center p-4 border rounded-lg shadow-sm hover:shadow-md transition duration-200">
              <FaUserShield className="text-gray-600 text-3xl mb-4" />
              <h3 className="text-lg font-semibold">Role-Based Access Control</h3>
              <p className="mt-2 text-xs text-zinc-600 sm:text-sm">
                Protect your data with customizable permissions, ensuring the right people have the right access.
              </p>
            </div>
            {/* Feature 5: Advanced Search and Intelligent Retrieval */}
            <div className="flex flex-col items-center p-4 border rounded-lg shadow-sm hover:shadow-md transition duration-200">
              <FaSearch className="text-gray-600 text-3xl mb-4" />
              <h3 className="text-lg font-semibold">Advanced Search and Intelligent Retrieval</h3>
              <p className="mt-2 text-xs text-zinc-600 sm:text-sm">
                Quickly locate the information you need with our powerful AI-driven search capabilities.
              </p>
            </div>
            {/* Feature 6: AI and LLM Integration */}
            <div className="flex flex-col items-center p-4 border rounded-lg shadow-sm hover:shadow-md transition duration-200">
              <FaBrain className="text-gray-600 text-3xl mb-4" />
              <h3 className="text-lg font-semibold">AI and LLM Integration</h3>
              <p className="mt-2 text-xs text-zinc-600 sm:text-sm">
                Enhance your workflows with seamless integration into LLMs, enabling intelligent data fetching and contextual interactions.
              </p>
            </div>
          </div>
        </div>

        {/* Email Collection Form */}
        {!submitted ? (
          <form
            id="email-form"
            onSubmit={handleSubmit}
            className="mt-10 flex flex-col items-center space-y-3 w-full px-4"
          >
            <h2 className="text-2xl font-semibold mb-4">Stay Updated</h2>
            <p className="text-zinc-600 mb-6">
              Join our community to receive the latest updates, features, and insights on knowledge management.
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full max-w-sm p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="w-full max-w-sm bg-black text-white p-3 rounded-lg focus:outline-none hover:bg-gray-700 transition duration-200"
            >
              Notify Me
            </button>
          </form>
        ) : (
          <p className="mt-10 text-green-600 text-lg">
            Thank you! We’ll let you know when we’re ready to launch.
          </p>
        )}
      </div>
    </>
  );
}
