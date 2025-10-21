import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProblemStatement from './ProblemStatement';
import CodeEditor from './CodeEditor';
import TestOutput from './TestOutput';
import { ALL_MOCK_PROBLEMS, Icons, FullPageSpinner, MOCK_RECRUITER_TESTS, MOCK_PRACTICE_TESTS } from '../constants';
import { TestResult, Problem, Test } from '../types';

const CandidateTestPage: React.FC = () => {
  const navigate = useNavigate();
  const { testId } = useParams<{ testId: string }>();

  const [test, setTest] = useState<Test | null>(null);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [language, setLanguage] = useState<string>('javascript');
  const [code, setCode] = useState<string>('');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [didLoadFromStorage, setDidLoadFromStorage] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);

  const progressKey = `candidateTestProgress-${testId}-${problem?.id}`;
  const supportedLanguages = problem ? Object.keys(problem.initialCode) : ['javascript'];

  useEffect(() => {
    // Simulate fetching problem data
    setTimeout(() => {
      const allTests = [...MOCK_RECRUITER_TESTS, ...MOCK_PRACTICE_TESTS];
      const currentTest = allTests.find(t => t.id === testId);
      if (currentTest && currentTest.problemIds.length > 0) {
        const firstProblemId = currentTest.problemIds[0]; // For MVP, we only handle the first problem of a test
        const currentProblem = ALL_MOCK_PROBLEMS.find(p => p.id === firstProblemId);
        
        if (currentProblem) {
          setTest(currentTest);
          setProblem(currentProblem);

          const savedProgressJSON = localStorage.getItem(`candidateTestProgress-${testId}-${currentProblem.id}`);
          if (savedProgressJSON) {
            try {
              const savedProgress = JSON.parse(savedProgressJSON);
              if (savedProgress.language && typeof savedProgress.code === 'string') {
                setLanguage(savedProgress.language);
                setCode(savedProgress.code);
                setDidLoadFromStorage(true);
                setIsPageLoading(false);
                return;
              }
            } catch (error) {
              console.error("Failed to parse saved progress", error);
              localStorage.removeItem(`candidateTestProgress-${testId}-${currentProblem.id}`);
            }
          }
          // Set initial code if no saved progress
          const initialLang = currentTest.allowedLanguages.includes('javascript') ? 'javascript' : currentTest.allowedLanguages[0];
          setLanguage(initialLang);
          setCode(currentProblem.initialCode[initialLang]);
        }
      }
      setIsPageLoading(false);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testId]);

  useEffect(() => {
    if (didLoadFromStorage) {
      setDidLoadFromStorage(false);
      return;
    }
    
    if (problem && problem.initialCode[language]) {
        setCode(problem.initialCode[language]);
    }
    setTestResults([]);
  }, [language, problem, didLoadFromStorage]);

  const handleRunTests = useCallback(() => {
    if (!problem) return;
    setIsRunning(true);
    setTestResults([]);

    // Helper to extract function name from JS code
    const getFunctionName = (jsCode: string): string | null => {
        const match = jsCode.match(/var\s+([a-zA-Z0-9_]+)\s*=\s*function/);
        return match ? match[1] : null;
    }

    if (language === 'javascript') {
      setTimeout(() => {
          const functionName = getFunctionName(code);
          if (!functionName) {
              setTestResults([{ testCaseId: 1, passed: false, output: 'Execution Error: Could not determine function name. Please do not change the original function definition.' }]);
              setIsRunning(false);
              return;
          }

          const results: TestResult[] = problem.testCases.map((testCase, index) => {
              try {
                  const fullCode = `
                    ${code}
                    return ${functionName}(...${JSON.stringify(testCase.input)});
                  `;
                  const result = new Function(fullCode)();
                  
                  // Sort arrays for consistent comparison, handle non-array results
                  const sortIfArray = (value: any) => Array.isArray(value) ? [...value].sort((a,b) => a - b) : value;
                  const sortedResult = sortIfArray(result);
                  const sortedExpected = sortIfArray(testCase.expected);

                  const passed = JSON.stringify(sortedResult) === JSON.stringify(sortedExpected);

                  return {
                      testCaseId: index + 1,
                      passed: passed,
                      output: passed ? `Passed` : `Expected: ${JSON.stringify(testCase.expected)}\nGot: ${JSON.stringify(result)}`,
                  };
              } catch (error: any) {
                  return {
                      testCaseId: index + 1,
                      passed: false,
                      output: `Runtime Error: ${error.message}`,
                  };
              }
          });
          setTestResults(results);
          setIsRunning(false);
      }, 500);
    } else {
      setTimeout(() => {
        const results: TestResult[] = problem.testCases.map((_, index) => ({
          testCaseId: index + 1,
          passed: Math.random() > 0.3, // Mock some passes and fails
          output: `Passed\n(Mocked result for ${language})`
        }));
        setTestResults(results);
        setIsRunning(false);
      }, 1500);
    }
  }, [code, language, problem]);

  const handleSubmit = useCallback(() => {
    if (!problem) return;
    setIsSubmitting(true);
    
    const passedTests = testResults.filter(r => r.passed).length;
    const totalTests = problem.testCases.length;
    const codingScore = Math.round(totalTests > 0 ? (passedTests / totalTests) * 100 : 0);

    const submissionId = `sub_${Date.now()}`;
    const submissionDataJSON = localStorage.getItem('currentSubmission');

    let submissionData = submissionDataJSON ? JSON.parse(submissionDataJSON) : {};

    submissionData.id = submissionId;
    submissionData.codingScore = codingScore;
    submissionData.codingResults = testResults;
    
    localStorage.setItem(submissionId, JSON.stringify(submissionData));
    localStorage.removeItem(progressKey); // Clean up saved code

    setTimeout(() => {
      alert(`Coding test submitted! Your score: ${codingScore}%. Now proceeding to the AI interview.`);
      setIsSubmitting(false);
      navigate(`/interview/${problem.id}?submissionId=${submissionId}`);
    }, 1000);
    
  }, [navigate, progressKey, testResults, problem]);

  const handleSaveProgress = () => {
    setSaveStatus('saving');
    const progress = { code, language };
    localStorage.setItem(progressKey, JSON.stringify(progress));
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  const getSaveButtonText = () => {
    switch (saveStatus) {
      case 'saving': return 'Saving...';
      case 'saved': return 'Progress Saved!';
      default: return 'Save Progress';
    }
  };

  if (isPageLoading) return <FullPageSpinner message="Preparing your test..." />;
  if (!problem || !test) return <div className="text-center p-8">Test not found or is invalid.</div>;

  return (
    <div className="flex flex-col h-screen overflow-hidden relative">
      <header className="bg-gray-800 p-3 flex justify-between items-center shadow-md z-10">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">Step 2: Coding Challenge</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-400">Time Remaining: {test.timeLimit}:00</span>
          <button
            onClick={handleSaveProgress}
            disabled={saveStatus !== 'idle'}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {getSaveButtonText()}
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting || testResults.length === 0}
            title={testResults.length === 0 ? "You must run the tests at least once before submitting." : "Submit your final code"}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center min-w-[240px] justify-center"
          >
            {isSubmitting && <Icons.Spinner />}
            <span className={isSubmitting ? 'ml-2' : ''}>
              {isSubmitting ? 'Submitting...' : 'Submit & Start AI Interview'}
            </span>
          </button>
        </div>
      </header>
      <div className="flex flex-1 overflow-auto">
        <div className="w-1/3 p-4 overflow-y-auto border-r border-gray-700">
          <ProblemStatement problem={problem} />
        </div>
        <div className="w-2/3 flex flex-col relative">
            <div className="absolute top-3 right-4 z-10">
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-gray-700 text-white rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {supportedLanguages.map(lang => (
                        <option key={lang} value={lang} className="capitalize">
                            {lang.charAt(0).toUpperCase() + lang.slice(1)}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex-grow h-2/3">
              <CodeEditor language={language} value={code} onChange={setCode} />
            </div>
            <div className="flex-shrink-0 h-1/3 border-t border-gray-700">
              <TestOutput results={testResults} onRunTests={handleRunTests} isRunning={isRunning} language={language}/>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateTestPage;