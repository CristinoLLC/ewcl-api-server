'use client';

import { useState } from 'react';
import MolViewer from '@/components/MolViewer';

export default function EWCLAnalysisPage() {
  const [entropyMap, setEntropyMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunAnalysis = async (file: File) => {
    setLoading(true);
    setError(null);
    const form = new FormData();
    form.append('file', file);

    try {
      const res = await fetch('/api/runrealewcltest', { method: 'POST', body: form });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Status ${res.status}`);
      }
      const { result } = await res.json();
      setEntropyMap(result.entropy || {});
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">EWCL Analysis</h1>

      <div className="flex items-center space-x-4">
        <input
          type="file"
          accept=".pdb,.cif"
          disabled={loading}
          onChange={(e) => e.target.files?.[0] && handleRunAnalysis(e.target.files[0])}
          className="border p-2"
        />
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {loading && <p>Running analysis…</p>}
      {!loading && Object.keys(entropyMap).length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">3D Viewer</h2>
          <div className="border h-96">
            <MolViewer entropyScores={entropyMap} />
          </div>
        </div>
      )}
    </div>
  );
}