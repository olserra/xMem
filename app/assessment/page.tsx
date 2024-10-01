'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../Context';
import { handleSendEmail } from '../helpers/handleSendEmail';

interface Question {
    question: string;
    options: string[];
}

const questions: Question[] = [
    {
        question: 'What area are you most interested in?',
        options: ['Upskilling', 'Reskilling', 'Change career', 'Improve existing skills', 'Learn new skills'],
    },
    {
        question: 'How many hours per day would you like to spend on it?',
        options: ['< 1', '1-2', '2-4', '> 4'],
    },
    {
        question: 'What is your preferred learning style?',
        options: ['Visual', 'Auditory', 'Kinesthetic', 'Reading/Writing'],
    },
];

const Assessment: React.FC = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [responses, setResponses] = useState<string[]>(Array(questions.length).fill(''));
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const router = useRouter();
    const { userId, userEmail } = useUser();

    const handleOptionSelect = (option: string) => {
        if (currentQuestion === 0) {
            // For the first question, allow multiple selections
            setSelectedOptions(prev =>
                prev.includes(option) ? prev.filter(opt => opt !== option) : [...prev, option]
            );
        } else {
            // For other questions, allow single selection
            const updatedResponses = [...responses];
            updatedResponses[currentQuestion] = option;
            setResponses(updatedResponses);
        }
    };

    const handleNext = async () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // Handle API submission here
            const finalResponses = {
                interests: selectedOptions,
                skillLevel: responses[1],
                learningStyle: responses[2],
            };

            // Call the API to send the assessment data along with userId
            const response = await fetch('/api/assessment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    assessmentData: finalResponses,
                }),
            });

            if (response.ok) {
                console.log('Assessment submitted successfully');

                // Call the function to send an email
                await handleSendEmail(userId, userEmail);

                router.push('/progress');
            } else {
                console.error('Failed to submit assessment');
            }
        }
    };

    const handleBack = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleSkip = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            console.log('Final Responses (Skipped):', responses);
        }
    };

    return (
        <div className="flex flex-col items-center justify-start pt-12 h-screen px-4 bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-4">Initial Assessment</h2>
                <p className="text-center mb-4">{questions[currentQuestion].question}</p>
                <div className="flex flex-col space-y-2">
                    {questions[currentQuestion].options.map((option, index) => (
                        <button
                            key={index}
                            className={`text-black p-2 border rounded hover:bg-black hover:text-white focus:outline-none ${currentQuestion === 0 && selectedOptions.includes(option) ? 'bg-black text-white' :
                                currentQuestion > 0 && responses[currentQuestion] === option ? 'bg-black text-white' : ''
                                }`}
                            onClick={() => handleOptionSelect(option)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
                <div className="flex justify-between mt-4">
                    <button className="text-gray-500 hover:text-gray-700" onClick={handleSkip}>Skip</button>
                    <div className='flex justify-between gap-3'>
                        <button className="text-black border p-2 rounded" onClick={handleBack}>Back</button>
                        <button className="bg-black text-white p-2 rounded focus:outline-none" onClick={handleNext}>
                            {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Assessment;
