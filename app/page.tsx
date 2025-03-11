'use client';

import { useState } from "react";
import { FaDatabase, FaSync, FaUserShield, FaSearch, FaBrain } from "react-icons/fa";
import { AiOutlineApi } from "react-icons/ai";
import Image from "next/image";
import IMG1 from "@/public/home1.png";
import { TypeAnimation } from 'react-type-animation';

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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        {/* Removed McpStatus */}
      </div>

      <div className="relative flex place-items-center">
        {/* Hero Section */}
        <div className="mt-10 px-4 md:px-12 flex flex-col items-center justify-center text-center sm:mt-12">
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

          {/* Screenshot with Animated Components Around */}
          <div className="w-full relative p-6 group">
            {/* Animated left and right lines for mobile */}
            <div className="absolute top-0 left-0 h-full w-[4px] bg-gray-600 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-[10px] transition-all duration-300 ease-in-out sm:w-[2px] sm:group-hover:translate-x-[5px]"></div>
            <div className="absolute top-0 right-0 h-full w-[4px] bg-gray-600 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-[-10px] transition-all duration-300 ease-in-out sm:w-[2px] sm:group-hover:translate-x-[-5px]"></div>

            {/* Animated top and bottom lines */}
            <div className="absolute top-0 left-0 w-full h-[4px] bg-gray-600 opacity-0 group-hover:opacity-100 transform group-hover:translate-y-[10px] transition-all duration-300 ease-in-out sm:h-[2px] sm:group-hover:translate-y-[5px]"></div>
            <div className="absolute bottom-0 left-0 w-full h-[4px] bg-gray-600 opacity-0 group-hover:opacity-100 transform group-hover:translate-y-[-10px] transition-all duration-300 ease-in-out sm:h-[2px] sm:group-hover:translate-y-[-5px]"></div>

            {/* Main Screenshot Image Container */}
            <div className="w-full h-[600px] bg-black rounded-lg overflow-hidden relative shadow-lg sm:h-[400px]">
              <Image
                src={IMG1}
                alt="screenshot"
                width={1200}
                height={800}
                className="p-8 border rounded-lg overflow-hidden w-full h-full object-cover"
              />
            </div>

            {/* Animated circles around the image */}
            <div className="absolute top-10 left-10 w-16 h-16 rounded-full bg-gray-600 opacity-0 group-hover:opacity-50 animate-pulse sm:w-12 sm:h-12 sm:top-6 sm:left-6"></div>
            <div className="absolute top-20 right-10 w-16 h-16 rounded-full bg-gray-600 opacity-0 group-hover:opacity-50 animate-pulse sm:w-12 sm:h-12 sm:top-10 sm:right-6"></div>
            <div className="absolute bottom-20 left-20 w-16 h-16 rounded-full bg-gray-600 opacity-0 group-hover:opacity-50 animate-pulse sm:w-12 sm:h-12 sm:bottom-10 sm:left-6"></div>
          </div>

          {/* Memory Persistence Examples */}
          <div className="w-full py-24 mx-12 bg-white mt-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-gray-800">
                Memory Persistence Examples
              </h2>
              <p className="text-gray-600 mt-4">
                Here are some examples of what could be remembered in a memory persistence system.
              </p>
            </div>

            {/* Black Border with Animation */}
            <div className="relative p-4 border-4 border-black rounded-lg overflow-hidden transition-all duration-500 hover:border-gray-800">
              {/* Input fields section - Horizontal layout */}
              <div className="flex flex-col gap-4 justify-between p-6 w-full">
                {/* Input Field 1 (start) */}
                <div className="w-full max-w-md">
                  <input
                    type="text"
                    value="Please do not provide comments on my code"
                    readOnly
                    className="w-full p-4 border border-gray-300 rounded-lg bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300 hover:bg-gray-100 text-lg" // Same text size
                  />
                </div>

                {/* Input Field 2 (middle) */}
                <div className="w-full max-w-lg">
                  <input
                    type="text"
                    value="Always use marketing best practices when we are talking about product and marketing"
                    readOnly
                    className="w-full p-4 border border-gray-300 rounded-lg bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300 hover:bg-gray-100 text-lg" // Same text size
                  />
                </div>

                {/* Input Field 3 (end) - With fake typing animation */}
                <div className="flex items-center justify-center text-center w-full max-w-xl"> {/* Same width as Input 2 */}
                  <TypeAnimation
                    sequence={[
                      'Remember that I prefer concise answers', // Typing the sentence
                      2000, // Wait for 2 seconds after typing
                      () => {
                        console.log('Typing sequence completed');
                      },
                    ]}
                    wrapper="span"
                    cursor={true}
                    repeat={Infinity}
                    style={{
                      fontSize: '1.25rem', // Ensures consistent text size
                      display: 'inline-block',
                      fontFamily: 'Arial, sans-serif',
                      padding: '4px',
                      width: '100%', // Ensures full width
                      height: '56px', // Set a fixed height to match Input 2
                    }}
                    className="w-full p-4 border border-gray-300 rounded-lg bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300 hover:bg-gray-100 text-lg" // Same text size
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-2 lg:text-left gap-4">
        {/* Removed ContextViewer */}
      </div>

      {/* Removed AiSuggestions */}

      {/* Email Collection Form */}
      {!submitted ? (
        <form
          id="email-form"
          onSubmit={handleSubmit}
          className="my-10 flex flex-col items-center space-y-3 w-full px-4"
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
          Thank you! We'll let you know when we're ready to launch.
        </p>
      )}
    </main>
  );
}
