'use client';

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Image from "next/image";
import Skills from "@/components/Skills";
import { useEffect } from "react";
import { skills } from "./data/skills"; // Import from the new external skills file
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
          <span className="text-blue-600">A personal AI Coach</span>{" "} Best way to learn DevOps
        </h1>
        <p className="mt-5 max-w-prose text-base text-zinc-700 sm:text-xl">
          Learn In-Demand Skills for a Brighter Future
        </p>
        <button className="bg-black cursor-pointer text-white text-sm px-4 py-2 mb-3 mt-5 rounded-lg focus:outline-none" onClick={handleChatClick}>
          <p>
            Chat with AI Coach
          </p>
        </button>
      </MaxWidthWrapper>

      {/* Value Prop */}
      <div>
        <div className="relative isolate">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#0a95ff] to-[#95f2fa] opacity-30 sm:left-[calc(50%-20rem)] sm:w-[72.1875rem] sm:translate-y-8"
            />
          </div>
          <Skills skills={skills} />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative right-[calc(50%-13rem)] aspect-[1155/678] w-[36.125rem] translate-x-1/3 rotate-[30deg] bg-gradient-to-tr from-[#0a95ff] to-[#95f2fa] opacity-30 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem] sm:translate-y-8"
            />
          </div>
        </div>
      </div>

      {/* Features */}
      <MaxWidthWrapper>
        <div className="mx-auto mt-20 flex max-w-5xl flex-col gap-20 sm:mt-40 sm:gap-40 ">
          {/* Intro */}
          <div>
            <div className="mb-6 px-6 lg:px-8">
              <div className="mx-auto max-w-2xl sm:text-center">
                <h2 className="mt-2 text-4xl font-bold text-gray-900 sm:text-5xl">
                  Start acquiring some skills
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  Improving your skillset has never been easier than with
                  OpenSkills.
                </p>
              </div>
            </div>
            {/* steps */}

            <ol className="my-2 space-y-4 pt-2 md:flex md:space-x-6 md:space-y-0 md:px-8">
              <li className="md:flex-1">
                <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-blue-600">
                    Step 1
                  </span>
                  <span className="text-xl font-semibold">
                    Sign up for a Free Account
                  </span>
                </div>
              </li>
              <li className="md:flex-1">
                <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-blue-600">
                    Step 2
                  </span>
                  <span className="text-xl font-semibold">
                    Choose a Skill
                  </span>
                </div>
              </li>
              <li className="md:flex-1">
                <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-blue-600">
                    Step 3
                  </span>
                  <span className="text-xl font-semibold">
                    Start Your Learning Session
                  </span>
                </div>
              </li>
            </ol>
          </div>

          {/* Feedback */}
          <div>
            <div className="mb-6 px-6 lg:px-8">
              <div className="mx-auto max-w-2xl sm:text-center">
                <h2 className="mt-2 text-4xl font-bold text-gray-900 sm:text-5xl">
                  Feedback
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  What are people saying about OpenSkill
                </p>
              </div>
            </div>
            {/* steps */}

            <div>
              <div className="mx-auto flex max-w-6xl justify-center px-6 lg:px-8">
                <div className="flow-root">
                  <div className="-m-2 w-fit rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10  lg:-m-4 lg:rounded-2xl lg:p-4">
                    <Image
                      width={2556}
                      height={1436}
                      quality={100}
                      src="/tweet_collage.png"
                      alt="Header image"
                      className="rounded-md bg-white p-2 shadow-2xl ring-1 ring-gray-900/10 md:p-8"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </>
  );
}
