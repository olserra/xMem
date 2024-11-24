'use client';

import { useState } from "react";
import { FaDatabase, FaCloud } from "react-icons/fa";
import { LuBrainCircuit } from "react-icons/lu";

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
          <span className="font-light">Preserve and access</span> your digital memories
        </h1>
        <p className="mt-5 max-w-prose text-sm text-zinc-700 sm:text-base md:text-xl">
          Join us in building a smarter way to store and connect your memories for the future.
        </p>

        {/* How It Works Section */}
        <div className="my-16 md:my-24 flex flex-col items-center text-center">
          <h2 className="text-xl font-bold mb-8 sm:text-2xl">How It Works</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6 w-full max-w-4xl">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <FaDatabase className="text-gray-600 text-4xl mb-4 md:text-5xl" />
              <h3 className="text-lg font-semibold">API for Your Memories</h3>
              <p className="mt-2 text-xs text-zinc-600 sm:text-sm">
                Store, retrieve, and manage your digital memories securely via our API.
              </p>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <LuBrainCircuit className="text-gray-600 text-4xl mb-4 md:text-5xl" />
              <h3 className="text-lg font-semibold">Digital Memory</h3>
              <p className="mt-2 text-xs text-zinc-600 sm:text-sm">
                Own and control your memories like a wallet that works like Web3 for your data.
              </p>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <FaCloud className="text-gray-600 text-4xl mb-4 md:text-5xl" />
              <h3 className="text-lg font-semibold">Seamless Integrations</h3>
              <p className="mt-2 text-xs text-zinc-600 sm:text-sm">
                Connect your memories to OpenAI, Copilot, and other tools effortlessly.
              </p>
            </div>
          </div>
        </div>

        {/* Email Collection Form */}
        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="mt-5 flex flex-col items-center space-y-3 w-full px-4"
          >
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
              className="w-full max-w-sm bg-black text-white p-3 rounded-lg focus:outline-none hover:bg-gray-700"
            >
              Notify Me
            </button>
          </form>
        ) : (
          <p className="mt-5 text-green-600">
            Thank you! We’ll let you know when we’re ready to launch.
          </p>
        )}
      </div>
    </>
  );
}
