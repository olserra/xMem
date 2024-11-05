'use client';

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { handleSignIn } from "./helpers/handleSignIn";
import { skills } from "./data/skills";

export interface Skill {
  title: string;
  description: string;
  category?: string;
  labels: string[];
}

export default function Home() {
  const { data: session } = useSession();

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
        <button className="bg-black cursor-pointer text-white text-sm px-4 py-2 mb-3 mt-5 rounded-lg focus:outline-none" onClick={handleChatClick}>
          <p>
            Chat with Tutor
          </p>
        </button>
        <h1 className="max-w-4xl text-4xl font-bold md:text-6xl lg:text-7xl">
          <span className="font-light">Your personal tutor</span>{" "} to learn and master AI
        </h1>
        <p className="mt-5 max-w-prose text-base text-zinc-700 sm:text-xl">
          Learn In-Demand Skills in AI and for a Brighter Future
        </p>

        {/* Labels Section */}
        <div className="mt-6 flex flex-wrap justify-center">
          {skills.map((skill: Skill) => (
            <div key={skill.title} className="bg-black text-white rounded-full px-3 md:px-6 py-1 md:py-3 m-1 text-sm">
              {skill.title}
            </div>
          ))}
        </div>
      </MaxWidthWrapper>
    </>
  );
}
