'use client';

import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Import the useRouter hook for navigation
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

interface Skill {
  title: string;
  description: string;
  icon: JSX.Element;
  category: string;
  labels?: string[];
}

const Skills = ({ skills }: { skills: Skill[] }) => {
  const { data: session } = useSession();
  const router = useRouter(); // Get the router instance

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

  const handleSkillClick = () => {
    if (!session) {
      signIn();
    } else {
      // Redirect to the external link
      window.open("https://chatgpt.com/g/g-kqRCHmM5H-openskills-online", "_blank");
    }
  };

  return (
    <>
      <div className="flex items-center justify-center py-6 md:px-12 ">
        <div className="flex flex-col gap-6 md:flex-row flex-wrap justify-center">
          {skills.map((skill: Skill) => (
            <div
              key={skill.title}
              onClick={handleSkillClick} // Call handleSkillClick when clicked
              className="cursor-pointer"
            >
              <Card className="flex flex-col items-center justify-center gap-2 p-6 md:flex-1">
                <CardTitle>{skill.title}</CardTitle>
                <CardDescription className="mb-3 text-center">{skill.description}</CardDescription>
                {skill.icon}
                {skill.labels && (
                  <div className="flex gap-2 mt-2">
                    {skill.labels.map((label: string) => (
                      <span key={label} className={`inline-block px-2 py-1 text-sm text-grey-700 ${getRandomColor()} rounded-xl`}>
                        {label}
                      </span>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-6 px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mt-4 text-lg text-gray-600">and many more...</p>
        </div>
      </div>
    </>
  );
};

export default Skills;
