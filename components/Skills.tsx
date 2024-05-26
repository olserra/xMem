import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

interface SkillsProps {
  skills: any[];
}

const Skills = ({ skills }: SkillsProps) => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSkillClick = (category: string) => {
    if (session) {
      router.push(`/${category}/basic`);
    } else {
      signIn();
    }
  };

  return (
    <>
      <div className="flex items-center justify-center py-6 md:px-12 ">
        <div className="flex flex-col gap-6 md:flex-row flex-wrap justify-center">
          {skills.map((skill) => (
            <div
              key={skill.title}
              onClick={() => handleSkillClick(skill.category)}
              className="cursor-pointer"
            >
              <Card className="flex flex-col items-center justify-center gap-2 p-6 md:flex-1">
                <CardTitle>{skill.title}</CardTitle>
                <CardDescription className="mb-3 text-center">{skill.description}</CardDescription>
                {skill.icon}
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
