'use client'; // Marking this component as a Client Component

import { useEffect, useState } from 'react';
import Quiz from '@/components/ui/Quiz';
import { skills } from '@/app/data/skills'; // Ensure this path is correct
import { useUser } from '../Context'; // Import your user context

const QuizPage: React.FC = () => {
    const { userId } = useUser(); // Retrieve user ID from context
    const [skillIndex, setSkillIndex] = useState<number | null>(null); // State to store the skill index

    useEffect(() => {
        const skillName = new URLSearchParams(window.location.search).get('skillName'); // Get the skill name from the query parameters
        const index = skills.findIndex(skill => skill.title === skillName); // Find the skill index based on the skill name
        setSkillIndex(index !== -1 ? index : null); // Update the skill index state, or set to null if not found
    }, []); // Run once on component mount

    return (
        <div className="flex flex-col items-center justify-center px-4 py-6 md:px-12">
            <h2 className="text-2xl font-bold mb-4">Learning Center</h2>
            {skillIndex !== null ? ( // Check if the skill index is set
                userId ? ( // Check if userId is available
                    <>
                        <h3 className="text-xl font-semibold mb-2">{skills[skillIndex].title}</h3>
                        <Quiz skillIndex={skillIndex} userId={userId} /> {/* Pass the skill index and user ID to the Quiz component */}
                    </>
                ) : (
                    <h3 className="text-xl font-semibold mb-2">User not logged in</h3> // Render error message if userId is null
                )
            ) : (
                <h3 className="text-xl font-semibold mb-2">Skill not found</h3> // Render error message if no skill found
            )}
        </div>
    );
};

export default QuizPage;
