'use client'

import React from 'react'

interface HeatmapDiagramProps {
  entropyData: Record<string, number>
}

export default function HeatmapDiagram({ entropyData }: HeatmapDiagramProps) {
  // Convert data to array and sort by residue number
  const sortedData = Object.entries(entropyData)
    .map(([residue, value]) => ({ residue: Number(residue), value }))
    .sort((a, b) => a.residue - b.residue)

  // Function to get color based on entropy value
  const getColor = (value: number) => {
    if (value <= 0.25) {
      // Blue to white gradient (ordered)
      const intensity = Math.floor(255 * (value / 0.25))
      return `rgb(${intensity}, ${intensity}, 255)`
    } else if (value <= 0.6) {
      // White to yellow gradient (transitional)
      const intensity = Math.floor(255 * ((value - 0.25) / 0.35))
      return `rgb(255, 255, ${255 - intensity})`
    } else {
      // Yellow to red gradient (disordered)
      const intensity = Math.floor(255 * ((value - 0.6) / 0.4))
      return `rgb(255, ${255 - intensity}, 0)`
    }
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="text-sm text-gray-500 mb-2">
        Residue entropy heatmap (hover for details)
      </div>
      
      <div className="flex flex-wrap" style={{ minHeight: '50px' }}>
        {sortedData.map(({ residue, value }) => (
          <div
            key={residue}
            className="w-6 h-6 flex-shrink-0 cursor-pointer transition-transform hover:scale-110"
            style={{ backgroundColor: getColor(value) }}
            title={`Residue ${residue}: ${value.toFixed(3)}`}
          />
        ))}
      </div>
      
      <div className="mt-4">
        <div className="w-full h-2 bg-gradient-to-r from-blue-500 via-white via-yellow-400 to-red-500"></div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0.0 (Ordered)</span>
          <span>0.25</span>
          <span>0.6</span>
          <span>1.0 (Disordered)</span>
        </div>
      </div>
    </div>
  )
}