// components/ui/Quiz.tsx
'use client';

import { skills } from '@/app/data/skills';
import React, { useState } from 'react';

export interface IQuiz {
    id: number;
    question: string;
    answer: string;
    options: string[];
    correctOptionIndex: number;
}

interface QuizProps {
    skillIndex: number; // The index of the skill for fetching questions
    userId: string; // User ID to associate the quiz result with the user
}

const Quiz: React.FC<QuizProps> = ({ skillIndex, userId }) => {
    const flashcards = skills[skillIndex]?.questions; // Optional chaining to safely access questions

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null); // State for selected answer
    const [userAnswers, setUserAnswers] = useState<number[]>([]); // Array to store user's answers
    const [quizCompleted, setQuizCompleted] = useState(false); // State to check if quiz is completed

    // Handle case when the skillIndex is invalid
    if (!flashcards) {
        return <div>Invalid skill selected.</div>; // Render error message if no questions are found
    }

    const handleNext = () => {
        if (selectedOption === null) {
            alert("Please select an answer before proceeding.");
            return;
        }

        // Store the selected answer
        setUserAnswers([...userAnswers, selectedOption]);

        // Check if we are at the last question
        if (currentIndex < flashcards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedOption(null); // Reset the selected option for the next question
        } else {
            setUserAnswers([...userAnswers, selectedOption]); // Save the last answer
            setQuizCompleted(true); // Mark the quiz as completed
            saveQuizResults(); // Call to save the quiz results
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setSelectedOption(null); // Reset the selected option for the previous question
        }
    };

    const calculateResults = () => {
        return userAnswers.filter((answer, index) => answer === flashcards[index].correctOptionIndex).length;
    };

    // Function to save quiz results to the database
    const saveQuizResults = async () => {
        const score = calculateResults();
        const totalQuestions = flashcards.length;

        try {
            const response = await fetch('/api/quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    skillId: String(skills[skillIndex].id.toString()),
                    name: skills[skillIndex].title, // Set the skill title as the quiz name
                    score,
                    totalQuestions,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save quiz results');
            }

            console.log('Quiz results saved successfully!');
        } catch (error) {
            console.error('Error saving quiz results:', error);
        }
    };

    return (
        <div className="border-2 border-gray-300 rounded-lg shadow-lg p-8 m-4 transition-shadow duration-300 hover:shadow-xl">
            {!quizCompleted ? (
                <>
                    <h2 className="text-lg font-semibold mb-4">Quiz {currentIndex + 1} of {flashcards.length}</h2>
                    <div>
                        <h3 className="text-xl font-medium">{flashcards[currentIndex].question}</h3>
                        <div className="mt-4">
                            {flashcards[currentIndex].options.map((option, index) => (
                                <div key={index}>
                                    <input
                                        type="radio"
                                        id={`option-${index}`}
                                        name="options"
                                        value={option}
                                        checked={selectedOption === index}
                                        onChange={() => setSelectedOption(index)}
                                    />
                                    <label htmlFor={`option-${index}`} className="ml-2">{option}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='flex justify-center gap-4 pt-4'>
                        <button
                            className="bg-gray-300 text-gray-800 p-2 rounded-lg focus:outline-none hover:bg-gray-400"
                            onClick={handleBack}
                            disabled={currentIndex === 0}
                        >
                            Back
                        </button>
                        <button
                            className="bg-black text-white p-2 rounded-lg focus:outline-none hover:bg-gray-700"
                            onClick={handleNext}
                            disabled={currentIndex === flashcards.length - 1 && selectedOption === null}
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <div className='flex flex-col'>
                    <h2 className="text-lg font-semibold mb-4">Quiz Completed!</h2>
                    <p className="mb-4">You answered {calculateResults()} out of {flashcards.length} questions correctly.</p>
                    <p className="text-xl font-bold">
                        {calculateResults() === flashcards.length ?
                            'Congratulations, you scored 100%! 🎉' :
                            `You scored ${calculateResults()}/${flashcards.length}. 🔎`}
                    </p>
                    <button
                        className="bg-blue-500 text-white p-2 rounded-lg focus:outline-none hover:bg-blue-600 max-w-32 center self-center mt-8"
                        onClick={() => {
                            setCurrentIndex(0);
                            setUserAnswers([]);
                            setQuizCompleted(false);
                            setSelectedOption(null); // Reset the selected option when restarting the quiz
                        }}
                    >
                        Restart Quiz
                    </button>
                </div>
            )}
        </div>
    );
};

export default Quiz;
