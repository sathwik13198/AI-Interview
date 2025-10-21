import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { analyzeResume } from '../services/geminiService';
import { Icons, MOCK_RECRUITER_TESTS, MOCK_PRACTICE_TESTS } from '../constants';
import { Test } from '../types';

const ResumeUploadModal: React.FC<{
    onClose: () => void;
    onAnalyze: (file: File) => Promise<void>;
    isLoading: boolean;
}> = ({ onClose, onAnalyze, isLoading }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (selectedFile: File | null) => {
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setError(null);
        } else {
            setFile(null);
            setError('Please select a valid PDF file.');
        }
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            setError('Please select a resume to continue.');
            return;
        }
        await onAnalyze(file);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4">Step 1: Upload Resume</h2>
                <p className="text-gray-400 mb-6">Before starting the assessment, please upload your resume. The AI will use it to personalize your interview questions.</p>
                <div 
                    onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors duration-300 ${isDragging ? 'border-blue-500 bg-gray-700' : 'border-gray-600 hover:border-gray-500'}`}
                >
                    <input type="file" id="file-upload" className="hidden" accept=".pdf" onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)} />
                    <label htmlFor="file-upload" className="cursor-pointer">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                        <p className="mt-2 font-semibold">Drag & drop or click to upload</p>
                        <p className="mt-1 text-sm text-gray-400">(PDF only)</p>
                    </label>
                </div>
                {file && <div className="mt-4 text-center text-green-400"><strong>{file.name}</strong> selected.</div>}
                {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={onClose} className="py-2 px-4 text-gray-300 rounded-md hover:bg-gray-700 transition">Cancel</button>
                    <button onClick={handleSubmit} disabled={isLoading || !file} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition disabled:bg-blue-800 disabled:cursor-not-allowed flex items-center">
                        {isLoading && <Icons.Spinner />}
                        <span className={isLoading ? 'ml-2' : ''}>{isLoading ? 'Analyzing...' : 'Analyze & Start Test'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};


const TestCard: React.FC<{test: Test, onStart: () => void}> = ({ test, onStart }) => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-between">
        <div>
            <h3 className="text-xl font-bold text-white">{test.title}</h3>
            <p className="text-gray-400 mt-2 text-sm">{test.description}</p>
        </div>
        <div className="mt-6 flex justify-between items-center">
            <span className="text-sm text-gray-300">{test.timeLimit} min</span>
            <button onClick={onStart} className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-5 rounded-lg transition duration-300">
                Start
            </button>
        </div>
    </div>
);


const StudentDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTest, setSelectedTest] = useState<Test | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleStartRecruiterTest = (test: Test) => {
        setSelectedTest(test);
        setIsModalOpen(true);
    };

    const handleStartPracticeTest = (test: Test) => {
        localStorage.removeItem('currentSubmission'); // Ensure no old submission data is used
        navigate(`/test/${test.id}`);
    };

    const handleAnalyzeAndNavigate = async (file: File) => {
        if (!selectedTest) return;
        setIsLoading(true);
        try {
            const { text, skills } = await analyzeResume(file);
            const submissionData = { resumeText: text, resumeSkills: skills };
            localStorage.setItem('currentSubmission', JSON.stringify(submissionData));
            navigate(`/test/${selectedTest.id}`);
        } catch (e) {
            console.error(e);
            // Error handling is inside the modal for now
        } finally {
            setIsLoading(false);
            setIsModalOpen(false);
        }
    };
    
    return (
        <div className="max-w-6xl mx-auto p-8">
            {isModalOpen && <ResumeUploadModal onClose={() => setIsModalOpen(false)} onAnalyze={handleAnalyzeAndNavigate} isLoading={isLoading} />}
            <header className="mb-10">
                 <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors flex items-center mb-4 text-sm w-fit">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    Back to Home
                </Link>
                <h1 className="text-4xl font-bold text-white">Candidate Dashboard</h1>
                <p className="text-lg text-gray-400 mt-2">Here are your pending assessments and practice tests.</p>
            </header>

            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-6 border-l-4 border-purple-500 pl-4 text-white">Available Assessments</h2>
                {MOCK_RECRUITER_TESTS.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {MOCK_RECRUITER_TESTS.map(test => <TestCard key={test.id} test={test} onStart={() => handleStartRecruiterTest(test)} />)}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-gray-800 rounded-lg">
                        <p className="text-gray-400">You have no pending assessments. Great job!</p>
                    </div>
                )}
            </section>

            <section>
                 <h2 className="text-2xl font-semibold mb-6 border-l-4 border-green-500 pl-4 text-white">Practice Tests</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MOCK_PRACTICE_TESTS.map(test => <TestCard key={test.id} test={test} onStart={() => handleStartPracticeTest(test)} />)}
                 </div>
            </section>
        </div>
    );
};

export default StudentDashboard;