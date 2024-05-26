import Link from 'next/link';
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { MdEngineering, MdPeople, MdLeaderboard, MdManageAccounts, MdAnalytics, MdCreate, MdGroup, MdSelfImprovement, MdAutorenew, MdGavel, MdSupportAgent } from "react-icons/md";
import { TiSocialFlickr } from "react-icons/ti";

const skills = [
    { title: "Technical", description: "Develop technical skills.", icon: <MdEngineering size={30} />, category: "technical" },
    { title: "Social", description: "Improve your social skills.", icon: <MdPeople size={30} />, category: "social" },
    { title: "Leadership", description: "Learn to lead effectively.", icon: <MdLeaderboard size={30} />, category: "leadership" },
    { title: "Communication", description: "Enhance your communication.", icon: <TiSocialFlickr size={30} />, category: "communication" },
    { title: "Management", description: "Master management skills.", icon: <MdManageAccounts size={30} />, category: "management" },
    { title: "Analytical", description: "Develop analytical thinking.", icon: <MdAnalytics size={30} />, category: "analytical" },
    { title: "Creative", description: "Boost your creativity.", icon: <MdCreate size={30} />, category: "creative" },
    { title: "Interpersonal", description: "Improve interpersonal skills.", icon: <MdGroup size={30} />, category: "interpersonal" },
    { title: "Self-Management", description: "Manage yourself effectively.", icon: <MdSelfImprovement size={30} />, category: "self-management" },
    { title: "Adaptive", description: "Learn to adapt quickly.", icon: <MdAutorenew size={30} />, category: "adaptive" },
    { title: "Negotiation", description: "Negotiate successfully.", icon: <MdGavel size={30} />, category: "negotiation" },
    { title: "Customer Service", description: "Excel in customer service.", icon: <MdSupportAgent size={30} />, category: "customer-service" },
];

const Skills = () => {
    return (
        <>
            <div className="flex items-center justify-center py-12 md:px-12 ">
                <div className="flex flex-col gap-6 md:flex-row flex-wrap justify-center">
                    {skills.map((skill) => (
                        <Link key={skill.title} href={`/${skill.category}/basic`}>
                            <Card className="flex flex-col items-center justify-center gap-2 p-6 md:flex-1">
                                <CardTitle>{skill.title}</CardTitle>
                                <CardDescription className="mb-3 text-center">{skill.description}</CardDescription>
                                {skill.icon}
                            </Card>
                        </Link>
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
