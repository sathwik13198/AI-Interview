
import React from 'react';
import { Problem, Difficulty } from '../types';

interface ProblemStatementProps {
  problem: Problem;
}

const difficultyColorMap: { [key in Difficulty]: string } = {
  [Difficulty.EASY]: 'text-green-400',
  [Difficulty.MEDIUM]: 'text-yellow-400',
  [Difficulty.HARD]: 'text-red-400',
};

const ProblemStatement: React.FC<ProblemStatementProps> = ({ problem }) => {
  return (
    <div className="text-gray-300">
      <h2 className="text-2xl font-bold mb-2 text-white">{problem.title}</h2>
      <span className={`text-sm font-semibold ${difficultyColorMap[problem.difficulty]}`}>{problem.difficulty}</span>

      <div className="prose prose-invert prose-sm max-w-none mt-6" dangerouslySetInnerHTML={{ __html: problem.prompt.replace(/\n/g, '<br />') }} />

      {problem.examples.map((example, index) => (
        <div key={index} className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h3 className="font-semibold text-white mb-2">Example {index + 1}:</h3>
          <pre className="text-sm bg-gray-900 p-3 rounded">
            <code>
              <strong>Input:</strong> {example.in}<br />
              <strong>Output:</strong> {example.out}
              {example.explanation && <><br /><strong>Explanation:</strong> {example.explanation}</>}
            </code>
          </pre>
        </div>
      ))}
      
      <div className="mt-6">
        <h3 className="font-semibold text-white mb-2">Constraints:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          {problem.constraints.map((constraint, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: constraint }} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProblemStatement;
