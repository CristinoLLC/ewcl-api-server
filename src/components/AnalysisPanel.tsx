'use client'

import { useState } from 'react'
import Plot from 'react-plotly.js'

interface AnalysisPanelProps {
  proteinData: any
  analysisResults: any
  onAnalyze: () => void
}

export function AnalysisPanel({ proteinData, analysisResults, onAnalyze }: AnalysisPanelProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    try {
      await onAnalyze()
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">EWCL Analysis</h2>
        <button
          onClick={handleAnalyze}
          disabled={!proteinData || isAnalyzing}
          className={`px-4 py-2 rounded-md text-sm font-medium text-white
            ${!proteinData || isAnalyzing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
        >
          {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
        </button>
      </div>

      {analysisResults && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-md font-medium text-gray-900 mb-2">Entropy Map</h3>
            <div className="h-[300px]">
              <Plot
                data={[
                  {
                    z: analysisResults.entropyMap,
                    type: 'heatmap',
                    colorscale: 'Viridis',
                  },
                ]}
                layout={{
                  width: undefined,
                  height: undefined,
                  autosize: true,
                  margin: { t: 30, r: 30, b: 30, l: 30 },
                }}
                config={{ responsive: true }}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-md font-medium text-gray-900 mb-2">Collapse Likelihood</h3>
              <div className="h-[200px]">
                <Plot
                  data={[
                    {
                      y: analysisResults.collapseLikelihood,
                      type: 'scatter',
                      mode: 'lines',
                    },
                  ]}
                  layout={{
                    width: undefined,
                    height: undefined,
                    autosize: true,
                    margin: { t: 30, r: 30, b: 30, l: 30 },
                  }}
                  config={{ responsive: true }}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-md font-medium text-gray-900 mb-2">Residue Stability</h3>
              <div className="h-[200px]">
                <Plot
                  data={[
                    {
                      y: analysisResults.residueStability,
                      type: 'bar',
                    },
                  ]}
                  layout={{
                    width: undefined,
                    height: undefined,
                    autosize: true,
                    margin: { t: 30, r: 30, b: 30, l: 30 },
                  }}
                  config={{ responsive: true }}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 