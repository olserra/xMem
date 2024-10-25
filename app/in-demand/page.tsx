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
            id: "devops-engineer",
            name: "DevOps Engineer",
            salaryRange: "$100,000 - $130,000",
            category: "devops",
            description: "Integrating development and operations to improve deployment frequency and quality. Requires skills in CI/CD, cloud services, and containerization.",
            slug: "devops-engineer"
        },
        {
            id: "cloud-engineer",
            name: "Cloud Engineer",
            salaryRange: "$110,000 - $140,000",
            category: "devops",
            description: "Designing and managing cloud infrastructure and services. Proficiency in AWS, Azure, or Google Cloud is essential.",
            slug: "cloud-engineer"
        },
        {
            id: "site-reliability-engineer",
            name: "Site Reliability Engineer",
            salaryRange: "$105,000 - $135,000",
            category: "devops",
            description: "Ensuring the reliability and uptime of services. Combines software engineering with systems administration.",
            slug: "site-reliability-engineer"
        },
        {
            id: "automation-engineer",
            name: "Automation Engineer",
            salaryRange: "$95,000 - $120,000",
            category: "devops",
            description: "Developing automated systems for software development and deployment processes. Requires scripting and programming skills.",
            slug: "automation-engineer"
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
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HighIncomeSkillsPage;
