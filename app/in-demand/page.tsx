'use client'

import Link from 'next/link';
import React from 'react';

interface Skill {
    id: string;
    name: string;
    salaryRange: string;
    category: string;
    description: string;
    slug: string;
}

const HighIncomeSkillsPage: React.FC = () => {
    const skills: Skill[] = [
        {
            id: "software-development",
            name: "Software Development",
            salaryRange: "$95,000 - $115,000",
            category: "development",
            description: "Developing, maintaining, and improving technology systems. Skills in Python, Java, and C++ are highly valued.",
            slug: "software-development"
        },
        {
            id: "data-analysis",
            name: "Data Analysis",
            salaryRange: "$83,000 - $113,000",
            category: "data",
            description: "Analyzing data to provide insights for decision-making. Requires skills in Excel, SQL, Python, and Tableau.",
            slug: "data-analysis"
        },
        {
            id: "ux-design",
            name: "UX Design",
            salaryRange: "$70,000 - $93,000",
            category: "design",
            description: "Focusing on user experience in product design, requiring creativity and technical skills in UI/UX design.",
            slug: "ux-design"
        },
        {
            id: "web-development",
            name: "Web Development",
            salaryRange: "$71,000 - $90,000",
            category: "development",
            description: "Combines software development and design. Requires knowledge in front-end, back-end, and SEO.",
            slug: "web-development"
        },
        {
            id: "project-management",
            name: "Project Management",
            salaryRange: "$62,000 - $94,000",
            category: "management",
            description: "Managing and coordinating project teams, schedules, and budgets. A vital skill in organizational leadership.",
            slug: "project-management"
        },
        {
            id: "account-management",
            name: "Account Management",
            salaryRange: "$63,000 - $108,000",
            category: "sales",
            description: "Negotiating and maintaining customer relationships. Involves using CRM tools like Salesforce.",
            slug: "account-management"
        },
        {
            id: "content-creation",
            name: "Content Creation",
            salaryRange: "$55,000 - $109,000",
            category: "marketing",
            description: "Storytelling and marketing with creativity and social perceptiveness. Often involves marketing analytics.",
            slug: "content-creation"
        }
    ];

    return (
        <div className="flex flex-col justify-center text-center gap-6 mx-8 md:mx-40">
            <h1 className="mt-10 text-2xl">Top High-Income Skills to Learn in 2024</h1>

            {/* High-Income Skills List */}
            <div className="skills-container flex flex-col gap-4 mt-6">
                {skills.map((skill) => (
                    <div key={skill.id} className="skill-row flex items-center justify-between border border-1 border-gray-400 rounded-lg p-4">
                        <div className="flex-1">
                            <h2 className="text-lg">{skill.name}</h2>
                            <p>{skill.description}</p>
                            <p className="text-gray-600">Salary Range: {skill.salaryRange}</p>
                        </div>
                        <Link href={`/${skill.category}/details`}>
                            <button className="ml-4 bg-blue-500 text-white rounded-lg px-4 py-2">Learn More</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HighIncomeSkillsPage;
