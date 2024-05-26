import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { MdEngineering, MdPeople, MdLeaderboard, MdManageAccounts, MdAnalytics, MdCreate, MdGroup, MdSelfImprovement, MdAutorenew, MdGavel, MdSupportAgent } from "react-icons/md";
import { TiSocialFlickr } from "react-icons/ti";

const skills = [
    { title: "Technical", description: "Develop technical skills.", icon: <MdEngineering size={30} /> },
    { title: "Social", description: "Improve your social skills.", icon: <MdPeople size={30} /> },
    { title: "Leadership", description: "Learn to lead effectively.", icon: <MdLeaderboard size={30} /> },
    { title: "Communication", description: "Enhance your communication.", icon: <TiSocialFlickr size={30} /> },
    { title: "Management", description: "Master management skills.", icon: <MdManageAccounts size={30} /> },
    { title: "Analytical", description: "Develop analytical thinking.", icon: <MdAnalytics size={30} /> },
    { title: "Creative", description: "Boost your creativity.", icon: <MdCreate size={30} /> },
    { title: "Interpersonal", description: "Improve interpersonal skills.", icon: <MdGroup size={30} /> },
    { title: "Self-Management", description: "Manage yourself effectively.", icon: <MdSelfImprovement size={30} /> },
    { title: "Adaptive", description: "Learn to adapt quickly.", icon: <MdAutorenew size={30} /> },
    { title: "Negotiation", description: "Negotiate successfully.", icon: <MdGavel size={30} /> },
    { title: "Customer Service", description: "Excel in customer service.", icon: <MdSupportAgent size={30} /> },
];

const Skills = () => {
    return (
        <>
            <div className="flex items-center justify-center py-12">
                <div className="flex flex-col gap-6 md:flex-row flex-wrap">
                    {skills.map((skill) => (
                        <Card key={skill.title} className="flex flex-col items-center justify-center gap-2 p-6 md:flex-1">
                            <CardTitle>{skill.title}</CardTitle>
                            <CardDescription className="mb-3 text-center">{skill.description}</CardDescription>
                            {skill.icon}
                        </Card>
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
