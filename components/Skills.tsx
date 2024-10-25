'use client';

import { useSession } from 'next-auth/react';
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Skill } from '@/app/page';
import { useState } from 'react'; // Import useState
import { handleSignIn } from '@/app/helpers/handleSignIn';

const Skills = ({ skills }: { skills: Skill[] }) => {
  const { data: session } = useSession();
  const [showAll, setShowAll] = useState(false); // State to manage visibility of additional skills

  // Define an array of possible label colors
  const labelColors = [
    'bg-blue-200',
    'bg-red-200',
    'bg-green-200',
    'bg-yellow-200',
    'bg-purple-200',
    'bg-pink-200',
    'bg-teal-200',
    'bg-orange-200',
  ];

  // Function to get a random color from the labelColors array
  const getRandomColor = () => {
    return labelColors[Math.floor(Math.random() * labelColors.length)];
  };

  const handleSkillClick = (skillName: string) => {
    if (!session) {
      handleSignIn;
    } else {
      // Redirect to the external link with skillName as a query parameter
      const url = `https://chatgpt.com/g/g-kqRCHmM5H-openskills?skillName=${encodeURIComponent(skillName)}`;
      window.open(url, "_blank");
    }
  };

  return (
    <>
      <div className="flex items-center justify-center px-4 py-6 md:px-12">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {skills.slice(0, showAll ? skills.length : 10).map((skill: Skill) => (
            <Card
              key={skill.title}
              className="flex flex-col items-center justify-center gap-2 p-6 cursor-pointer"
              onClick={() => handleSkillClick(skill.title)} // Add click handler
            >
              <CardTitle>{skill.title}</CardTitle>
              <CardDescription className="mb-3 text-center">{skill.description}</CardDescription>
              {skill.labels && skill.labels.length > 0 && (
                <div className="flex flex-col gap-2 mt-2 w-full">
                  {skill.labels.map((label: string) => (
                    <span
                      key={label}
                      className={`inline-block px-2 py-1 text-sm text-grey-700 ${getRandomColor()} rounded-xl w-full text-center`}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
      {!showAll && skills.length > 10 && (
        <div className="mb-6 px-6 lg:px-8 text-center">
          <button
            onClick={() => setShowAll(true)}
            className="text-lg text-gray-500 hover:text-gray-900 underline"
          >
            and many more...
          </button>
        </div>
      )}
    </>
  );
};

export default Skills;
