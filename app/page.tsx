'use client';

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { handleSignIn } from "./helpers/handleSignIn";

export interface Skill {
  title: string;
  description: string;
  category?: string; // Make category optional
  labels: string[];
}

export default function Home() {
  const { data: session } = useSession(); // Get session data

  useEffect(() => {
    // This is where you'd fetch or update the initial skill data if needed
  }, []);

  const handleChatClick = () => {
    if (!session) {
      handleSignIn;
    } else {
      window.open("https://chatgpt.com/g/g-kqRCHmM5H-openskills", "_blank");
    }
  };


  return (
    <>
      {/* Hero */}
      <MaxWidthWrapper className="mt-10 flex flex-col items-center justify-center text-center sm:mt-12">
        <h1 className="max-w-4xl text-4xl font-bold md:text-6xl lg:text-7xl">
          <span className="font-light">Your personal tutor</span>{" "} to learn and master AI
        </h1>
        <p className="mt-5 max-w-prose text-base text-zinc-700 sm:text-xl">
          Learn In-Demand Skills in AI and for a Brighter Future
        </p>
        <button className="bg-black cursor-pointer text-white text-sm px-4 py-2 mb-3 mt-5 rounded-lg focus:outline-none" onClick={handleChatClick}>
          <p>
            Chat with Tutor
          </p>
        </button>
      </MaxWidthWrapper>
    </>
  );
}
