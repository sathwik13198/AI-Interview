import React, { useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { InterviewTemplate, Test, Submission, Problem } from '../types';
import { SkeletonLoader, Icons, ALL_MOCK_PROBLEMS } from '../constants';
import ScoreChart from './ScoreChart';


const MOCK_TEMPLATES: InterviewTemplate[] = [
  {
    id: 'frontend-1',
    name: 'Frontend Engineer - Mid Level',
    description: 'Focuses on React, TypeScript, and core web fundamentals.',
    questions: [
      'Tell me about a challenging project you worked on with React.',
      'How do you ensure the performance of a web application?',
      'Explain the difference between `let`, `const`, and `var` in JavaScript.',
      'What are React Hooks? Can you give an example of a custom hook you\'ve created?',
      'Describe your process for debugging a CSS layout issue.'
    ],
  },
  {
    id: 'backend-1',
    name: 'Backend Engineer - Python/Django',
    description: 'Assesses Python proficiency, Django framework knowledge, and database design.',
    questions: [
      'Explain the Django ORM and how it works.',
      'Describe a time you had to optimize a slow database query.',
      'What are middlewares in Django?',
      'How would you design a REST API for a simple blog application?',
      'Discuss the difference between stateless and stateful applications.'
    ],
  },
];

const MOCK_TESTS: Test[] = [
  {
    id: 'test-1',
    title: 'Frontend Developer Screening',
    description: 'A standard screening test for mid-level frontend developers.',
    timeLimit: 45,
    allowedLanguages: ['javascript', 'python'],
    problemIds: ['two-sum'],
  },
  {
    id: 'test-2',
    title: 'General Problem Solving',
    description: 'A test focusing on algorithms and data structures.',
    timeLimit: 60,
    allowedLanguages: ['javascript', 'python', 'java', 'cpp'],
    problemIds: ['two-sum', 'valid-parentheses'],
  }
];

const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: 'sub_1678886400000',
    resumeText: 'A senior software engineer with experience in React and Node.js.',
    resumeSkills: ['React', 'TypeScript', 'Node.js', 'AWS', 'PostgreSQL'],
    codingScore: 88,
    codingResults: [
      { testCaseId: 1, passed: true, output: 'Passed' },
      { testCaseId: 2, passed: true, output: 'Passed' },
      { testCaseId: 3, passed: true, output: 'Passed' },
      { testCaseId: 4, passed: false, output: 'Expected [2,4] but got [4,2]' }
    ],
    interviewScore: {
      communication: 90,
      technicalKnowledge: 85,
      problemSolving: 92,
      overallScore: 89,
      feedback: 'The candidate demonstrated strong communication skills and a solid understanding of technical concepts. They effectively articulated their thought process during the problem-solving portion. Great performance overall.',
      strengths: ["Clear communication", "Solid understanding of React principles", "Good problem-solving approach"],
      areasForImprovement: ["Could provide more depth on system design questions", "Elaborate more on trade-offs in technical decisions"],
      learningRecommendations: [
        { topic: "Microservices Architecture", reason: "To gain a better understanding of building scalable backend systems, which is a key requirement for senior roles." },
        { topic: "Advanced TypeScript", reason: "Deepening knowledge of generics and advanced types will improve code quality and reusability." }
      ]
    },
    interviewTranscript: [
      { id: '1', text: 'Hello, let\'s start the interview.', sender: 'ai' },
      { id: '2', text: 'Sure, I\'m ready.', sender: 'user' },
    ]
  },
  {
    id: 'sub_1678886500000',
    resumeText: 'A junior developer passionate about frontend technologies.',
    resumeSkills: ['HTML', 'CSS', 'JavaScript', 'React'],
    codingScore: 75,
    codingResults: [
      { testCaseId: 1, passed: true, output: 'Passed' },
      { testCaseId: 2, passed: true, output: 'Passed' },
      { testCaseId: 3, passed: false, output: 'Failed' },
      { testCaseId: 4, passed: true, output: 'Passed' }
    ],
    interviewScore: {
      communication: 80,
      technicalKnowledge: 70,
      problemSolving: 75,
      overallScore: 75,
      feedback: 'The candidate has a good foundation but could benefit from more experience with complex state management and system design. Communication was clear, but technical answers sometimes lacked depth.',
      strengths: ["Enthusiastic and eager to learn", "Good grasp of fundamental JavaScript concepts"],
      areasForImprovement: ["Lacks experience with large-scale applications", "Needs to practice more complex algorithm problems"],
      learningRecommendations: [
        { topic: "State Management Libraries (Redux/Zustand)", reason: "To handle complex application state more effectively beyond React's built-in hooks." },
        { topic: "Data Structures and Algorithms", reason: "Focus on medium-level problems on platforms like LeetCode to improve problem-solving speed and efficiency." }
      ]
    },
    interviewTranscript: []
  }
];


const AVAILABLE_LANGUAGES = ['javascript', 'python', 'java', 'cpp'];


const RecruiterDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'templates' | 'testBuilder' | 'submissions'>('testBuilder');

    // State for Templates
    const [templates, setTemplates] = useState<InterviewTemplate[]>(MOCK_TEMPLATES);
    const [selectedTemplate, setSelectedTemplate] = useState<InterviewTemplate | null>(null);
    const [templateFormData, setTemplateFormData] = useState<Omit<InterviewTemplate, 'id'>>({ name: '', description: '', questions: [''] });
    const [isCreatingTemplate, setIsCreatingTemplate] = useState<boolean>(false);
    
    // State for Test Builder
    const [tests, setTests] = useState<Test[]>(MOCK_TESTS);
    const [selectedTest, setSelectedTest] = useState<Test | null>(null);
    const [isCreatingTest, setIsCreatingTest] = useState<boolean>(false);
    const [testFormData, setTestFormData] = useState<Omit<Test, 'id'>>({ title: '', description: '', timeLimit: 60, allowedLanguages: ['javascript'], problemIds: [] });
    const addProblemSelectRef = useRef<HTMLSelectElement>(null);

    // State for Submissions
    const [submissions, setSubmissions] = useState<Submission[]>(MOCK_SUBMISSIONS);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

    // Loading states
    const [isDetailLoading, setIsDetailLoading] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    // --- Handlers for Templates ---
    const handleSelectTemplate = (template: InterviewTemplate) => {
        setIsDetailLoading(true);
        setTimeout(() => {
            setSelectedTemplate(template);
            setTemplateFormData(template);
            setIsCreatingTemplate(false);
            setIsDetailLoading(false);
        }, 500);
    };

    const handleCreateNewTemplate = () => {
        setSelectedTemplate(null);
        setTemplateFormData({ name: '', description: '', questions: [''] });
        setIsCreatingTemplate(true);
    };

    const handleTemplateFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTemplateFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleQuestionChange = (index: number, value: string) => {
        const newQuestions = [...templateFormData.questions];
        newQuestions[index] = value;
        setTemplateFormData(prev => ({ ...prev, questions: newQuestions }));
    };

    const addQuestionField = () => {
        setTemplateFormData(prev => ({ ...prev, questions: [...prev.questions, ''] }));
    };

    const removeQuestionField = (index: number) => {
        const newQuestions = templateFormData.questions.filter((_, i) => i !== index);
        setTemplateFormData(prev => ({ ...prev, questions: newQuestions }));
    };

    const handleSaveTemplate = () => {
        if (!templateFormData.name.trim() || !templateFormData.description.trim()) {
            alert('Please fill out the template name and description.');
            return;
        }
        setIsSaving(true);
        setTimeout(() => {
            if (isCreatingTemplate) {
                const newTemplate: InterviewTemplate = { id: `template-${Date.now()}`, ...templateFormData };
                setTemplates(prev => [...prev, newTemplate]);
                setIsCreatingTemplate(false);
                setSelectedTemplate(newTemplate);
            } else if (selectedTemplate) {
                const updatedTemplate = { ...selectedTemplate, ...templateFormData };
                setTemplates(prev => prev.map(t => t.id === selectedTemplate.id ? updatedTemplate : t));
                setSelectedTemplate(updatedTemplate);
            }
            setIsSaving(false);
        }, 1000);
    };

    // --- Handlers for Test Builder ---
    const handleSelectTest = (test: Test) => {
        setIsDetailLoading(true);
        setTimeout(() => {
            setSelectedTest(test);
            setTestFormData({
                title: test.title,
                description: test.description,
                timeLimit: test.timeLimit,
                allowedLanguages: test.allowedLanguages,
                problemIds: test.problemIds
            });
            setIsCreatingTest(false);
            setIsDetailLoading(false);
        }, 500);
    };

    const handleCreateNewTest = () => {
        setSelectedTest(null);
        setTestFormData({ title: '', description: '', timeLimit: 60, allowedLanguages: ['javascript'], problemIds: [] });
        setIsCreatingTest(true);
    };
    
    const handleTestFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setTestFormData(prev => ({ 
            ...prev, 
            [name]: type === 'number' ? parseInt(value, 10) : value 
        }));
    };
    
    const handleLanguageChange = (language: string) => {
        setTestFormData(prev => {
            const newLangs = prev.allowedLanguages.includes(language)
                ? prev.allowedLanguages.filter(l => l !== language)
                : [...prev.allowedLanguages, language];
            return { ...prev, allowedLanguages: newLangs };
        });
    };
    
    const handleAddProblemToTest = () => {
        const problemId = addProblemSelectRef.current?.value;
        if (problemId && !testFormData.problemIds.includes(problemId)) {
            setTestFormData(prev => ({
                ...prev,
                problemIds: [...prev.problemIds, problemId]
            }));
        }
    };

    const handleRemoveProblemFromTest = (problemId: string) => {
        setTestFormData(prev => ({
            ...prev,
            problemIds: prev.problemIds.filter(id => id !== problemId)
        }));
    };
    
    const handleSaveTest = () => {
        if (!testFormData.title.trim() || !testFormData.description.trim()) {
            alert('Please fill out the test title and description.');
            return;
        }
        setIsSaving(true);
        setTimeout(() => {
            if (isCreatingTest) {
                const newTest: Test = { 
                    id: `test-${Date.now()}`, 
                    ...testFormData, 
                };
                setTests(prev => [...prev, newTest]);
                setIsCreatingTest(false);
                setSelectedTest(newTest);
            } else if (selectedTest) {
                const updatedTest = { ...selectedTest, ...testFormData };
                setTests(prev => prev.map(t => t.id === selectedTest.id ? updatedTest : t));
                setSelectedTest(updatedTest);
            }
            setIsSaving(false);
        }, 1000);
    };

    const availableProblems = useMemo(() => {
        return ALL_MOCK_PROBLEMS.filter(p => !testFormData.problemIds.includes(p.id));
    }, [testFormData.problemIds]);


    const tabBaseClass = "px-4 py-2 font-semibold transition-colors duration-200 focus:outline-none";
    const tabActiveClass = "border-b-2 border-blue-500 text-white";
    const tabInactiveClass = "text-gray-400 hover:text-white";

    const renderTemplates = () => (
        <>
            <div className="w-1/3 bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Interview Templates</h2>
                    <button onClick={handleCreateNewTemplate} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300">
                        Create New
                    </button>
                </div>
                <ul className="space-y-3 overflow-y-auto">
                    {templates.map(template => (
                        <li key={template.id} onClick={() => handleSelectTemplate(template)} className={`p-4 rounded-lg cursor-pointer transition-colors ${selectedTemplate?.id === template.id ? 'bg-blue-800' : 'bg-gray-700 hover:bg-gray-600'}`}>
                            <h3 className="font-bold">{template.name}</h3>
                            <p className="text-sm text-gray-400 truncate">{template.description}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="w-2/3 bg-gray-800 p-6 rounded-lg shadow-lg overflow-y-auto">
                {isDetailLoading ? <SkeletonLoader /> : (isCreatingTemplate || selectedTemplate ? (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">{isCreatingTemplate ? 'Create New Template' : 'Edit Template'}</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Template Name</label>
                                <input type="text" name="name" id="name" value={templateFormData.name} onChange={handleTemplateFormChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
                                <textarea name="description" id="description" value={templateFormData.description} onChange={handleTemplateFormChange} rows={3} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Questions</h3>
                                <div className="space-y-3">
                                    {templateFormData.questions.map((q, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <input type="text" value={q} onChange={(e) => handleQuestionChange(index, e.target.value)} className="flex-grow bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder={`Question ${index + 1}`} />
                                            <button onClick={() => removeQuestionField(index)} title="Remove question" className="text-red-500 hover:text-red-400 p-2 rounded-full bg-gray-700 hover:bg-gray-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={addQuestionField} className="mt-4 text-sm text-blue-400 hover:text-blue-300">+ Add Question</button>
                            </div>
                        </div>
                        <div className="mt-6">
                            <button onClick={handleSaveTemplate} disabled={isSaving} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center">
                                {isSaving && <Icons.Spinner />}
                                <span className={isSaving ? 'ml-2' : ''}>{isSaving ? 'Saving...' : 'Save Template'}</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                            <h3 className="mt-2 text-lg font-medium">No Template Selected</h3>
                            <p className="mt-1 text-sm">Select a template from the list to view its details, or create a new one.</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );

    const renderTestBuilder = () => (
         <>
            <div className="w-1/3 bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Coding Tests</h2>
                    <button onClick={handleCreateNewTest} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300">
                        Create New
                    </button>
                </div>
                <ul className="space-y-3 overflow-y-auto">
                    {tests.map(test => (
                        <li key={test.id} onClick={() => handleSelectTest(test)} className={`p-4 rounded-lg cursor-pointer transition-colors ${selectedTest?.id === test.id ? 'bg-blue-800' : 'bg-gray-700 hover:bg-gray-600'}`}>
                            <h3 className="font-bold">{test.title}</h3>
                            <p className="text-sm text-gray-400 truncate">{test.description}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="w-2/3 bg-gray-800 p-6 rounded-lg shadow-lg overflow-y-auto">
                 {isDetailLoading ? <SkeletonLoader /> : (isCreatingTest || selectedTest ? (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">{isCreatingTest ? 'Create New Test' : 'Edit Test'}</h2>
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-300">Test Title</label>
                                <input type="text" name="title" id="title" value={testFormData.title} onChange={handleTestFormChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
                                <textarea name="description" id="description" value={testFormData.description} onChange={handleTestFormChange} rows={3} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
                            </div>
                             <div>
                                <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-300">Time Limit (minutes)</label>
                                <input type="number" name="timeLimit" id="timeLimit" value={testFormData.timeLimit} onChange={handleTestFormChange} className="mt-1 block w-40 bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Allowed Languages</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {AVAILABLE_LANGUAGES.map(lang => (
                                        <label key={lang} className="flex items-center space-x-3 cursor-pointer">
                                            <input 
                                                type="checkbox"
                                                checked={testFormData.allowedLanguages.includes(lang)}
                                                onChange={() => handleLanguageChange(lang)}
                                                className="form-checkbox h-5 w-5 bg-gray-700 border-gray-600 rounded text-blue-500 focus:ring-blue-500"
                                            />
                                            <span className="text-white capitalize">{lang}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                             <div>
                                <h3 className="text-lg font-semibold mb-2">Problems in this Test</h3>
                                <div className="p-4 bg-gray-900/50 rounded-lg">
                                    {testFormData.problemIds.length > 0 ? (
                                        <ul className="space-y-2 mb-4">
                                        {testFormData.problemIds.map(problemId => {
                                            const problem = ALL_MOCK_PROBLEMS.find(p => p.id === problemId);
                                            return (
                                            <li key={problemId} className="flex justify-between items-center bg-gray-700 p-2 rounded">
                                                <span className="text-sm">{problem ? problem.title : 'Unknown Problem'}</span>
                                                <button onClick={() => handleRemoveProblemFromTest(problemId)} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                                            </li>
                                            )
                                        })}
                                        </ul>
                                    ) : <p className="text-sm text-gray-400 mb-4">No problems added yet. Use the dropdown below to add one.</p>}
                                    
                                    <div className="flex items-center gap-2">
                                        <select ref={addProblemSelectRef} defaultValue="" className="flex-grow bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                            <option value="" disabled>Select a problem to add...</option>
                                            {availableProblems.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                                        </select>
                                        <button onClick={handleAddProblemToTest} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-md transition text-sm">Add</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8">
                           <button onClick={handleSaveTest} disabled={isSaving} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center">
                                {isSaving && <Icons.Spinner />}
                                <span className={isSaving ? 'ml-2' : ''}>{isSaving ? 'Saving...' : 'Save Test'}</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center text-gray-500">
                             <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            <h3 className="mt-2 text-lg font-medium">No Test Selected</h3>
                            <p className="mt-1 text-sm">Select a test from the list to view its details, or create a new one.</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
    
    const renderSubmissions = () => (
        <div className="w-full flex gap-8">
            <div className="w-1/3 bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
                <h2 className="text-xl font-semibold mb-6">All Submissions</h2>
                <ul className="space-y-3 overflow-y-auto">
                    {submissions.map(sub => (
                        <li key={sub.id} onClick={() => setSelectedSubmission(sub)} className={`p-4 rounded-lg cursor-pointer transition-colors ${selectedSubmission?.id === sub.id ? 'bg-blue-800' : 'bg-gray-700 hover:bg-gray-600'}`}>
                            <h3 className="font-bold text-sm">Candidate: {sub.id}</h3>
                            <div className="flex justify-between text-xs text-gray-300 mt-2">
                                <span>Coding: <span className="font-semibold text-white">{sub.codingScore}%</span></span>
                                <span>Interview: <span className="font-semibold text-white">{sub.interviewScore?.overallScore ?? 'N/A'}%</span></span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
             <div className="w-2/3 bg-gray-800 p-6 rounded-lg shadow-lg overflow-y-auto">
                {selectedSubmission ? (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Results for {selectedSubmission.id}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                            <div className="flex flex-col items-center bg-gray-900/50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-300 mb-4">Coding Score</h3>
                                <ScoreChart score={selectedSubmission.codingScore} />
                            </div>
                            <div className="flex flex-col items-center bg-gray-900/50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-300 mb-4">Interview Score</h3>
                                <ScoreChart score={selectedSubmission.interviewScore?.overallScore ?? 0} />
                            </div>
                        </div>

                        {selectedSubmission.interviewScore && (
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold mb-2">AI Interview Feedback</h3>
                                <div className="bg-gray-700 p-4 rounded-lg space-y-4">
                                    <p className="text-gray-300 leading-relaxed italic">"{selectedSubmission.interviewScore.feedback}"</p>
                                    {selectedSubmission.interviewScore.strengths && <div>
                                        <h4 className="font-semibold text-green-400">Strengths:</h4>
                                        <ul className="list-disc list-inside text-sm text-gray-300">
                                            {selectedSubmission.interviewScore.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                        </ul>
                                    </div>}
                                    {selectedSubmission.interviewScore.areasForImprovement && <div>
                                        <h4 className="font-semibold text-yellow-400">Areas for Improvement:</h4>
                                        <ul className="list-disc list-inside text-sm text-gray-300">
                                            {selectedSubmission.interviewScore.areasForImprovement.map((a, i) => <li key={i}>{a}</li>)}
                                        </ul>
                                    </div>}
                                </div>
                            </div>
                        )}
                        
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Detected Skills from Resume</h3>
                            <div className="flex flex-wrap gap-2">
                                {selectedSubmission.resumeSkills.map((skill, index) => (
                                    <span key={index} className="bg-green-500/20 text-green-300 text-xs font-medium px-2.5 py-1 rounded-full">{skill}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            <h3 className="mt-2 text-lg font-medium">No Submission Selected</h3>
                            <p className="mt-1 text-sm">Select a submission from the list to view detailed results.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="p-8 h-screen bg-gray-900 text-white flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div className="flex border-b border-gray-700">
                    <button onClick={() => setActiveTab('templates')} className={`${tabBaseClass} ${activeTab === 'templates' ? tabActiveClass : tabInactiveClass}`}>
                        Interview Templates
                    </button>
                    <button onClick={() => setActiveTab('testBuilder')} className={`${tabBaseClass} ${activeTab === 'testBuilder' ? tabActiveClass : tabInactiveClass}`}>
                        Test Builder
                    </button>
                    <button onClick={() => setActiveTab('submissions')} className={`${tabBaseClass} ${activeTab === 'submissions' ? tabActiveClass : tabInactiveClass}`}>
                        Submissions
                    </button>
                </div>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors flex items-center text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Home
                </Link>
            </div>
            <div className="flex-grow flex gap-8 overflow-y-hidden">
                {activeTab === 'templates' && renderTemplates()}
                {activeTab === 'testBuilder' && renderTestBuilder()}
                {activeTab === 'submissions' && renderSubmissions()}
            </div>
        </div>
    );
};

export default RecruiterDashboard;
