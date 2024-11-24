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
      <div className="mt-10 flex flex-col items-center justify-center text-center sm:mt-12">
        <h1 className="max-w-4xl text-4xl font-bold md:text-6xl lg:text-7xl">
          <span className="font-light">Preserve and access</span>{" "} your digital memories
        </h1>
        <p className="mt-5 max-w-prose text-base text-zinc-700 sm:text-xl">
          Join us in building a smarter way to store and connect your memories for the future.
        </p>

        <div className="my-24 flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            {/* Step 1: Provide an API */}
            <div className="flex flex-col items-center">
              <FaDatabase className="text-gray-600 text-5xl mb-4" />
              <h3 className="text-lg font-semibold">API for Your Memories</h3>
              <p className="mt-2 text-sm text-zinc-600">
                Store, retrieve, and manage your digital memories securely via our API.
              </p>
            </div>
            {/* Step 2: Connect with a Digital Wallet */}
            <div className="flex flex-col items-center">
              <LuBrainCircuit className="text-gray-600 text-5xl mb-4" />
              <h3 className="text-lg font-semibold">Digital Memory</h3>
              <p className="mt-2 text-sm text-zinc-600">
                Own and control your memories like a wallet that works like Web3 for your data.
              </p>
            </div>
            {/* Step 3: Integrate Seamlessly */}
            <div className="flex flex-col items-center">
              <FaCloud className="text-gray-600 text-5xl mb-4" />
              <h3 className="text-lg font-semibold">Seamless Integrations</h3>
              <p className="mt-2 text-sm text-zinc-600">
                Connect your memories to OpenAI, Copilot, and other tools effortlessly.
              </p>
            </div>
          </div>
        </div>


        {/* Email Collection Form */}
        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="mt-5 flex flex-col items-center space-y-3"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
              required
            />
            <button
              type="submit"
              className="bg-black text-white p-3 rounded-lg focus:outline-none hover:bg-gray-700 w-80"
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
