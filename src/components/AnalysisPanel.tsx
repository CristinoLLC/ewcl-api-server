'use client'

import dynamic from 'next/dynamic'
import { EwclResponse } from '@/utils/api'

const PlotlyChart = dynamic(() => import('./PlotlyChart'), {
  ssr: false
})

interface AnalysisPanelProps {
  data: EwclResponse
  className?: string
}

export default function AnalysisPanel({ data, className = '' }: AnalysisPanelProps) {
  const plotData = [
    {
      type: 'scatter',
      mode: 'lines+markers',
      x: Object.keys(data.scores).map(Number),
      y: Object.values(data.scores),
      name: 'Entropy Scores',
      line: { color: 'rgb(75, 192, 192)' },
      marker: { size: 8 }
    }
  ]

  const layout = {
    title: 'Residue Entropy Analysis',
    xaxis: {
      title: 'Residue Number',
      showgrid: true,
      zeroline: true
    },
    yaxis: {
      title: 'Entropy Score',
      showgrid: true,
      zeroline: true
    },
    margin: { t: 50, r: 50, b: 50, l: 50 },
    height: 400
  }

  const config = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false
  }

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <h2 className="text-lg font-semibold mb-4">Analysis Results</h2>
      <div className="space-y-4">
        <PlotlyChart
          data={plotData}
          layout={layout}
          config={config}
          className="w-full"
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Statistics</h3>
            <p className="text-sm text-gray-600">
              Average: {(Object.values(data.scores).reduce((a, b) => a + b, 0) / Object.values(data.scores).length).toFixed(3)}
            </p>
            <p className="text-sm text-gray-600">
              Max: {Math.max(...Object.values(data.scores)).toFixed(3)}
            </p>
            <p className="text-sm text-gray-600">
              Min: {Math.min(...Object.values(data.scores)).toFixed(3)}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Metadata</h3>
            {data.metadata && (
              <>
                <p className="text-sm text-gray-600">
                  Runtime: {data.metadata.runtime.toFixed(2)}s
                </p>
                <p className="text-sm text-gray-600">
                  Model: {data.metadata.model_version}
                </p>
                <p className="text-sm text-gray-600">
                  Time: {new Date(data.metadata.timestamp).toLocaleString()}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 