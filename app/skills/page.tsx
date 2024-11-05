'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { handleSignIn } from '@/app/helpers/handleSignIn';
import { skills } from '../data/skills';
import { useRouter } from 'next/navigation';

const Skills = () => {
  const { data: session } = useSession();
  const [showAll, setShowAll] = useState(false);
  const router = useRouter(); // Initialize router

  // Function to handle skill click
  const handleSkillClick = (skillName: string) => {
    if (!session) {
      handleSignIn;
    } else {
      router.push(`/quiz?skillName=${encodeURIComponent(skillName)}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-6 md:px-12">
      <h2 className="text-2xl font-bold mb-4">Skills to Learn</h2>
      <ul className="w-full max-w-2xl">
        {skills.slice(0, showAll ? skills.length : 10).map((skill) => (
          <li
            key={skill.title}
            className="flex justify-between items-center border-b border-gray-300 py-4 cursor-pointer"
            onClick={() => handleSkillClick(skill.title)}
          >
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{skill.title.length > 30 ? `${skill.title.substring(0, 30)}...` : skill.title}</h3>
              <p className="text-gray-600 text-sm">
                {skill.description.length > 50 ? `${skill.description.substring(0, 50)}...` : skill.description}
              </p>
            </div>
            <div className="flex items-center">
              {skill.labels.map((label) => (
                <span
                  key={label}
                  className="inline-block px-2 py-1 text-xs text-white bg-black rounded-md ml-2"
                >
                  {label}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
      {!showAll && skills.length > 10 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(true)}
            className="text-lg text-gray-500 hover:text-gray-900 underline"
          >
            and many more...
          </button>
        </div>
      )}
    </div>
  );
};

export default Skills;
