import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CandidateTestPage from './components/CandidateTestPage';
import AiInterview from './components/AiInterview';
import Dashboard from './components/Dashboard';
import RecruiterDashboard from './components/RecruiterDashboard';
import StudentDashboard from './components/StudentDashboard';
import ResultsDashboard from './components/ResultsDashboard';

const App: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/test/:testId" element={<CandidateTestPage />} />
        <Route path="/interview/:problemId" element={<AiInterview />} />
        <Route path="/recruiter" element={<RecruiterDashboard />} />
        <Route path="/results/:submissionId" element={<ResultsDashboard />} />
        {/* Default redirect for candidate, assuming they always start at the student dashboard */}
        <Route path="/candidate" element={<Navigate to="/student-dashboard" />} />
      </Routes>
    </div>
  );
};

export default App;