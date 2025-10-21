
import React from 'react';
import { TestResult } from '../types';
import { Icons } from '../constants';

interface TestOutputProps {
  results: TestResult[];
  onRunTests: () => void;
  isRunning: boolean;
  language: string;
}

const TestOutput: React.FC<TestOutputProps> = ({ results, onRunTests, isRunning, language }) => {
  const isRunDisabled = isRunning;
  return (
    <div className="bg-gray-800 h-full flex flex-col p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Test Cases</h3>
        <button
          onClick={onRunTests}
          disabled={isRunDisabled}
          title="Run tests against your code"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isRunning ? <Icons.Spinner /> : null}
          <span>{isRunning ? 'Running...' : 'Run Tests'}</span>
        </button>
      </div>
      <div className="flex-grow overflow-y-auto bg-gray-900 rounded-lg p-3">
        {results.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            Click "Run Tests" to see the output.
          </div>
        ) : (
          <ul className="space-y-2">
            {results.map(result => (
              <li key={result.testCaseId} className={`p-3 rounded-md ${result.passed ? 'bg-green-800/50' : 'bg-red-800/50'}`}>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Case {result.testCaseId}</span>
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${result.passed ? 'bg-green-500 text-green-900' : 'bg-red-500 text-red-900'}`}>
                    {result.passed ? 'Passed' : 'Failed'}
                  </span>
                </div>
                {result.output && (
                  <pre className="text-xs text-gray-300 mt-2 bg-gray-800 p-2 rounded whitespace-pre-wrap">
                    <code>{result.output}</code>
                  </pre>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TestOutput;