'use client';

import React, { useState } from 'react';

export default function EWCLSimulation() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    setFile(uploadedFile);
  };

  const handleRunSimulation = async () => {
    if (!file) {
      alert('Please upload a file first.');
      return;
    }

    setLoading(true);

    const form = new FormData();
    form.append('file', file);

    try {
      const res = await fetch('/api/runrealewcltest', {
        method: 'POST',
        body: form,
      });

      if (!res.ok) {
        throw new Error(`API responded with status ${res.status}`);
      }

      const data = await res.json();
      console.log('Simulation Result:', data);
      setResult(data);
    } catch (error) {
      console.error('Error running simulation:', error);
      alert(`Failed to run simulation: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">EWCL Simulation</h1>

      <input
        type="file"
        accept=".pdb,.cif"
        onChange={handleFileChange}
        className="mb-4"
      />

      <button
        onClick={handleRunSimulation}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? 'Running Simulation...' : 'Run Simulation'}
      </button>

      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-bold">Simulation Result</h2>
          <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}