import React from 'react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-900">
      <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200 text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-indigo-600 mb-2">Invoice Generator</h1>
        <p className="text-slate-600">Frontend initialized successfully with React, Vite, TypeScript & Tailwind CSS.</p>
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full border border-green-200">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          TypeScript + Tailwind CSS Active
        </div>
      </div>
    </div>
  );
};

export default App;
