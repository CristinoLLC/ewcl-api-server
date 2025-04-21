'use client'

import React from 'react'

interface EntropyHeatmapProps {
  entropyValues: number[]
}

const EntropyHeatmap: React.FC<EntropyHeatmapProps> = ({ entropyValues }) => {
  // Get color for entropy value (blue-white-red gradient)
  const getColorForEntropy = (entropy: number): string => {
    // Normalized entropy (0-1)
    const normalized = Math.max(0, Math.min(1, entropy))
    
    if (normalized < 0.5) {
      // Blue (low entropy) to white (medium entropy)
      const intensity = Math.floor(255 * (normalized * 2))
      return `rgb(${intensity}, ${intensity}, 255)`
    } else {
      // White (medium entropy) to red (high entropy)
      const intensity = Math.floor(255 * (2 - normalized * 2))
      return `rgb(255, ${intensity}, ${intensity})`
    }
  }

  return (
    <div className="w-full my-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Entropy Distribution</h3>
      <div className="flex w-full h-10 rounded-md overflow-hidden border">
        {entropyValues.map((entropy, index) => (
          <div
            key={index}
            className="h-full flex-grow min-w-[2px]"
            style={{ 
              backgroundColor: getColorForEntropy(entropy),
              flexBasis: `${100 / entropyValues.length}%`
            }}
            title={`Residue ${index + 1}: ${entropy.toFixed(3)}`}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Low Entropy (Ordered)</span>
        <span>High Entropy (Disordered)</span>
      </div>
    </div>
  )
}

export default EntropyHeatmap