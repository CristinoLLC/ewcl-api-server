'use client'

import { useState } from 'react'

export default function AIPredictorPage() {
  const [entropyData, setEntropyData] = useState('')
  const [collapseScore, setCollapseScore] = useState<number | null>(null)
  const [riskLevel, setRiskLevel] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setEntropyData(event.target?.result as string)
      }
      reader.readAsText(file)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('https://ewcl-platform.onrender.com/runaiinference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entropy: JSON.parse(entropyData) }),
      })

      if (!response.ok) {
        const errorBody = await response.text()
        throw new Error(`API error: ${response.status} - ${errorBody}`)
      }

      const result = await response.json()
      setCollapseScore(result.predicted_collapse_score)
      setRiskLevel(result.riskLevel || 'Unknown')
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify({ collapseScore, riskLevel }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'ai_prediction.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">AI Collapse Predictor</h1>
      <p className="text-gray-700 mb-6">
        Upload a file or paste entropy data to predict protein collapse scores using AI.
      </p>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Upload Entropy File</label>
        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="block w-full text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Or Paste JSON Data</label>
        <textarea
          value={entropyData}
          onChange={(e) => setEntropyData(e.target.value)}
          rows={6}
          className="block w-full text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
          placeholder="Paste JSON data here..."
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:opacity-50"
      >
        {loading ? 'Predicting...' : 'Run Prediction'}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {collapseScore !== null && (
        <div className="mt-6">
          <h2 className="text-xl font-bold">Prediction Results</h2>
          <p className="text-gray-700">Predicted Collapse Score: <strong>{collapseScore.toFixed(2)}</strong></p>
          <p className="text-gray-700">Risk Level: <strong>{riskLevel}</strong></p>

          <button
            onClick={handleDownload}
            className="mt-4 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900"
          >
            Download Results
          </button>
        </div>
      )}
    </div>
  )
}