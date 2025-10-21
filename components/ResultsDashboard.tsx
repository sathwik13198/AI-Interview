import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Submission } from '../types';
import ScoreChart from './ScoreChart';

const ResultsDashboard: React.FC = () => {
    const { submissionId } = useParams<{ submissionId: string }>();
    const [submission, setSubmission] = useState<Submission | null>(null);

    useEffect(() => {
        if (submissionId) {
            const data = localStorage.getItem(submissionId);
            if (data) {
                setSubmission(JSON.parse(data));
            }
        }
    }, [submissionId]);

    if (!submission) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Loading Results...</h2>
                    <p className="text-gray-400 mt-2">If your results don't appear, please check if you have completed the interview.</p>
                </div>
            </div>
        );
    }

    const { codingScore, interviewScore, resumeSkills } = submission;

    return (
        <div className="max-w-6xl mx-auto p-8">
            <header className="mb-10 text-center">
                <h1 className="text-5xl font-extrabold text-white">Your Interview Results</h1>
                <p className="text-xl text-gray-400 mt-3">Thank you for completing the assessment!</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Score Section */}
                 <div className="bg-gray-800 p-8 rounded-2xl shadow-lg flex flex-col items-center">
                    <h2 className="text-3xl font-bold mb-8 text-white">Coding Score</h2>
                    <ScoreChart score={codingScore} />
                </div>
                <div className="bg-gray-800 p-8 rounded-2xl shadow-lg flex flex-col items-center">
                    <h2 className="text-3xl font-bold mb-8 text-white">Interview Score</h2>
                    <ScoreChart score={interviewScore?.overallScore ?? 0} />
                     <div className="grid grid-cols-3 gap-4 w-full mt-8 text-center">
                        <div className="bg-gray-700 p-3 rounded-lg">
                            <p className="text-sm text-gray-300">Communication</p>
                            <p className="text-xl font-bold text-blue-400">{interviewScore?.communication ?? 0}/100</p>
                        </div>
                        <div className="bg-gray-700 p-3 rounded-lg">
                             <p className="text-sm text-gray-300">Technical</p>
                            <p className="text-xl font-bold text-blue-400">{interviewScore?.technicalKnowledge ?? 0}/100</p>
                        </div>
                        <div className="bg-gray-700 p-3 rounded-lg">
                             <p className="text-sm text-gray-300">Problem Solving</p>
                            <p className="text-xl font-bold text-blue-400">{interviewScore?.problemSolving ?? 0}/100</p>
                        </div>
                    </div>
                </div>
            </div>

             {/* AI Feedback Section */}
            {interviewScore && (
                <div className="mt-8 bg-gray-800 p-8 rounded-2xl shadow-lg">
                    <h2 className="text-3xl font-bold mb-4 text-white">AI Interview Feedback</h2>
                    <p className="text-gray-300 leading-relaxed mb-8 italic">"{interviewScore.feedback}"</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-2xl font-semibold mb-4 text-green-400 border-l-4 border-green-400 pl-3">Strengths</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-300">
                                {interviewScore.strengths.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold mb-4 text-yellow-400 border-l-4 border-yellow-400 pl-3">Areas for Improvement</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-300">
                                {interviewScore.areasForImprovement.map((a, i) => <li key={i}>{a}</li>)}
                            </ul>
                        </div>
                    </div>

                    <div className="mt-10">
                        <h3 className="text-2xl font-semibold mb-4 text-blue-400 border-l-4 border-blue-400 pl-3">What to Learn Next</h3>
                        <div className="space-y-4">
                            {interviewScore.learningRecommendations.map((rec, i) => (
                                <div key={i} className="bg-gray-700 p-4 rounded-lg">
                                    <p className="font-bold text-white text-lg">{rec.topic}</p>
                                    <p className="text-sm text-gray-400 mt-1">{rec.reason}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-12 text-center">
                 <Link to="/dashboard" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300">
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default ResultsDashboard;
