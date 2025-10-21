import React from 'react';

interface ScoreChartProps {
  score: number;
}

const ScoreChart: React.FC<ScoreChartProps> = ({ score }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getStrokeColor = () => {
    if (score >= 80) return '#4ade80'; // green-400
    if (score >= 50) return '#facc15'; // yellow-400
    return '#f87171'; // red-400
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-40 h-40" viewBox="0 0 120 120">
        <circle
          className="text-gray-700"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
        <circle
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke={getStrokeColor()}
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
          transform="rotate(-90 60 60)"
          style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
        />
      </svg>
      <span className="absolute text-4xl font-extrabold text-white">
        {score}
        <span className="text-2xl text-gray-400">%</span>
      </span>
    </div>
  );
};

export default ScoreChart;
