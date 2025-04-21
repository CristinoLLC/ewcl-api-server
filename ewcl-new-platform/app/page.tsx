import React from 'react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      {/* Header Section */}
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-teal-800">
          Entropy-Weighted Collapse Likelihood
        </h1>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          A cutting-edge tool for analyzing protein structures and molecular interactions. 
          Empower your research with precision and reliability.
        </p>
      </header>

      {/* Buttons Section */}
      <div className="flex space-x-4">
        <a
          href="/ewcl-analysis"
          className="px-6 py-3 bg-teal-800 text-white rounded-lg shadow hover:bg-teal-700 transition"
        >
          Try Analysis
        </a>
        <a
          href="/benchmarks"
          className="px-6 py-3 bg-gray-200 text-teal-800 rounded-lg shadow hover:bg-gray-300 transition"
        >
          See Benchmarks
        </a>
      </div>

      {/* Footer Section */}
      <footer className="mt-20 text-gray-500 text-sm">
        &copy; 2025 EWCL Platform. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;