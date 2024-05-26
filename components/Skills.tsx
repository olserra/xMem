import Link from 'next/link';
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { MdEngineering, MdLeaderboard, MdOutlineSell, MdAnalytics, MdCreate, MdGroup, MdGavel } from "react-icons/md";
import { SiWeb3Dotjs } from "react-icons/si";
import { TbChartScatter } from "react-icons/tb";
import { FaMagic } from "react-icons/fa";
import { SiFreelancer } from "react-icons/si";

const skills = [
    { title: "Software Engineering", description: "Develop technical skills.", icon: <MdEngineering size={30} />, category: "software-engineering" },
    { title: "Leadership", description: "Learn to lead effectively.", icon: <MdLeaderboard size={30} />, category: "leadership" },
    { title: "Analytical", description: "Develop analytical thinking.", icon: <MdAnalytics size={30} />, category: "analytical" },
    { title: "Creative", description: "Boost your creativity.", icon: <MdCreate size={30} />, category: "creative" },
    { title: "Interpersonal", description: "Improve interpersonal skills.", icon: <MdGroup size={30} />, category: "interpersonal" },
    { title: "Artificial Intelligence", description: "Develop your AI skills.", icon: <FaMagic size={30} />, category: "artificial-intelligence" },
    { title: "Data Science", description: "Learn or improve your DS skills", icon: <TbChartScatter size={30} />, category: "data-science" },
    { title: "Negotiation", description: "Negotiate successfully.", icon: <MdGavel size={30} />, category: "negotiation" },
    { title: "Artistic", description: "Improve your artistic skills.", icon: <SiFreelancer size={30} />, category: "artistic" },
    { title: "Marketing", description: "Master the marketing skills", icon: <MdOutlineSell size={30} />, category: "marketing" },
    { title: "Web3", description: "Learn about Web3 technologies.", icon: <SiWeb3Dotjs size={30} />, category: "web3" },
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
