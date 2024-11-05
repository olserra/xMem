'use client';

import { useEffect, useState } from "react";
import { useUser } from "../Context";
import { AiFillDelete } from 'react-icons/ai';
import { FaRegCopy, FaCheck } from "react-icons/fa";
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

interface Quiz {
    id: string;
    skillId: number; // Assuming skillId is now a number
    name: string;
    score: number;
    totalQuestions: number;
}

const Skeleton: React.FC = () => (
    <div className="quiz-row flex items-center justify-between border border-1 border-gray-400 rounded-lg p-4 animate-pulse">
        <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded"></div>
            <div className="bg-gray-200 rounded-full h-2 mt-2 w-full"></div>
        </div>
    </div>
);

const handleCopyToClipboard = (userId: any, setCopied: (value: boolean) => void) => {
    navigator.clipboard.writeText(userId)
        .then(() => {
            console.log('User ID copied to clipboard:', userId);
            setCopied(true); // Set copied state to true

            // Reset copied state after 5 seconds
            setTimeout(() => setCopied(false), 5000);
        })
        .catch(err => {
            console.error('Failed to copy user ID:', err);
        });
};

const ProgressPage: React.FC = () => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const { userId } = useUser();
    const [loading, setLoading] = useState(true); // Loading state
    const [copied, setCopied] = useState(false); // State to track copy status
    const router = useRouter(); // Initialize the router

    useEffect(() => {
        const fetchUserQuizzes = async () => {
            if (!userId) return;
            try {
                const response = await fetch(`/api/quiz?userId=${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user quizzes');
                }
                const data = await response.json();
                const transformedQuizzes = data.map((item: any) => ({
                    id: item.id,
                    skillId: item.skill.id, // Make sure this matches your API response
                    name: item.skill.name, // Use the correct field from your API response
                    score: item.score,
                    totalQuestions: item.totalQuestions,
                }));
                setQuizzes(transformedQuizzes);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false); // Set loading to false after data fetching
            }
        };

        fetchUserQuizzes();
    }, [userId]);

    const handleDeleteQuiz = async (quizId: string) => {
        try {
            const response = await fetch(`/api/quiz`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quizId }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to delete quiz: ${response.status} ${errorText}`);
            }

            setQuizzes((prev) => prev.filter(quiz => quiz.id !== quizId));
        } catch (error) {
            console.error('Error deleting quiz:', error);
        }
    };

    return (
        <div className="flex flex-col justify-center text-center gap-6 mx-8 md:mx-40">
            <h1 className="mt-10 text-2xl">Track Your Quiz Results</h1>

            <div className="quizzes-container flex flex-col gap-4">
                {loading ? (
                    // Render skeletons while loading
                    Array.from({ length: 1 }).map((_, index) => (
                        <Skeleton key={index} />
                    ))
                ) : (
                    quizzes.length > 0 ? (
                        quizzes.map((quiz) => (
                            <div key={quiz.id} className="quiz-row flex items-center justify-between border border-1 border-gray-400 rounded-lg p-4">
                                <div className="flex-1">
                                    <h2 className="text-lg">{quiz.name}</h2>
                                    <p>Score: {quiz.score} / {quiz.totalQuestions}</p>
                                </div>
                                <div className="flex items-center">
                                    <button
                                        className="ml-2 text-grey-500"
                                        onClick={() => handleDeleteQuiz(quiz.id)}
                                        title="Delete Quiz"
                                    >
                                        <AiFillDelete size={24} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>
                            <p>No quizzes found. Start taking quizzes!</p>
                            <button
                                onClick={() => router.push('/skills')} // Navigate to the /skills page
                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Go to Skills
                            </button>
                        </div>
                    )
                )}
            </div>

            <div className="flex justify-center items-center gap-2" onClick={() => handleCopyToClipboard(userId, setCopied)}>
                <span>Copy my user ID</span>
                {copied ? (
                    <div className="flex items-center">
                        <FaCheck className="text-green-500 p-1 border border-green-500 rounded-lg" size={24} />
                        <span className="text-green-500 ml-2">Copied</span>
                    </div>
                ) : (
                    <FaRegCopy className="text-gray-500 p-1 border border-gray-500 rounded-lg cursor-pointer" size={34} />
                )}
            </div>
        </div>
    );
};

export default ProgressPage;
