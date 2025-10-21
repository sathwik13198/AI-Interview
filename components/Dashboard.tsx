import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Let TypeScript know that VANTA will be on the window object
declare const window: any;

const Dashboard: React.FC = () => {
  const vantaRef = useRef(null);

  useEffect(() => {
    let vantaEffect: any = null;
    if (window.VANTA && vantaRef.current) {
        vantaEffect = window.VANTA.GLOBE({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x8b5cf6, // tailwind violet-500
            backgroundColor: 0x111827, // tailwind gray-900
            size: 1.2,
        });
    }
    
    // Cleanup function to destroy the effect on component unmount
    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, []); // Run only once on mount

  const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-purple-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const BriefcaseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-green-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  return (
    <div ref={vantaRef} className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10 bg-gray-900 bg-opacity-30">
            <div className="text-center mb-12 animate-fade-in-down">
                <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight">
                    The Future of
                    <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mt-2">
                       Technical Interviews
                    </span>
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-300">
                    Harness the power of AI to conduct realistic, unbiased, and efficient coding interviews. Identify top talent faster than ever before.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl animate-fade-in-up">
                
                {/* Candidate Card */}
                <div className="group relative bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-2xl p-8 border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-2">
                   <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"></div>
                   <div className="relative text-center">
                        <UserIcon />
                        <h2 className="text-2xl font-bold text-white mb-3">For Candidates</h2>
                        <p className="text-gray-400 mb-6">Ready to showcase your skills? Start your AI-powered assessment now and land your dream job.</p>
                        <Link to="/student-dashboard" className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-lg transition duration-300 inline-block shadow-lg hover:shadow-purple-500/50">
                            Start Application
                        </Link>
                    </div>
                </div>

                {/* Recruiter Card */}
                <div className="group relative bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-2xl p-8 border border-gray-700 hover:border-green-500 transition-all duration-300 transform hover:-translate-y-2">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-600 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"></div>
                    <div className="relative text-center">
                        <BriefcaseIcon />
                        <h2 className="text-2xl font-bold text-white mb-3">For Recruiters</h2>
                        <p className="text-gray-400 mb-6">Streamline your hiring. Create tests, manage candidates, and get deep, AI-driven insights.</p>
                        <Link to="/recruiter" className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-lg transition duration-300 inline-block shadow-lg hover:shadow-green-500/50">
                            Recruiter Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;