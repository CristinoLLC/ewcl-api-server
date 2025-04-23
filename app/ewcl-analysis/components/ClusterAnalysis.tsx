'use client'

import React from 'react'

interface Cluster {
  start: number
  end: number
  meanEntropy: number
  classification: 'Stable' | 'Disordered'
}

interface ClusterAnalysisProps {
  residueEntropyMap: Record<string, number>
}

const ClusterAnalysis: React.FC<ClusterAnalysisProps> = ({ residueEntropyMap }) => {
  // Convert entropy map to ordered array
  const entropyArray = Object.entries(residueEntropyMap)
    .map(([residueIndex, entropy]) => ({ index: parseInt(residueIndex), entropy }))
    .sort((a, b) => a.index - b.index)

  // Find clusters of 5+ consecutive residues
  const clusters: Cluster[] = []
  let currentStart = -1
  let currentType: 'Stable' | 'Disordered' | null = null
  let currentEntropies: number[] = []

  entropyArray.forEach((item, i) => {
    const { index, entropy } = item
    const isStable = entropy < 0.2
    const isDisordered = entropy > 0.7
    
    // Check if this residue starts or continues a cluster
    if (isStable && (currentType === 'Stable' || currentType === null)) {
      // Start or continue stable cluster
      if (currentStart === -1) currentStart = index
      currentType = 'Stable'
      currentEntropies.push(entropy)
    } else if (isDisordered && (currentType === 'Disordered' || currentType === null)) {
      // Start or continue disordered cluster
      if (currentStart === -1) currentStart = index
      currentType = 'Disordered'
      currentEntropies.push(entropy)
    } else {
      // End current cluster if it exists
      if (currentStart !== -1 && currentEntropies.length >= 5) {
        clusters.push({
          start: currentStart,
          end: index - 1,
          meanEntropy: currentEntropies.reduce((a, b) => a + b, 0) / currentEntropies.length,
          classification: currentType!
        })
      }
      
      // Reset tracking
      currentStart = -1
      currentType = null
      currentEntropies = []
      
      // Check if current residue starts a new cluster
      if (isStable) {
        currentStart = index
        currentType = 'Stable'
        currentEntropies.push(entropy)
      } else if (isDisordered) {
        currentStart = index
        currentType = 'Disordered'
        currentEntropies.push(entropy)
      }
    }
  })
  
  // Add final cluster if it exists
  if (currentStart !== -1 && currentEntropies.length >= 5) {
    clusters.push({
      start: currentStart,
      end: entropyArray[entropyArray.length - 1].index,
      meanEntropy: currentEntropies.reduce((a, b) => a + b, 0) / currentEntropies.length,
      classification: currentType!
    })
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <h3 className="text-sm font-medium text-gray-700 p-4 border-b">Identified Structural Clusters</h3>
      {clusters.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">End</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Length</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mean Entropy</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Classification</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clusters.map((cluster, i) => (
              <tr key={i}>
                <td className="px-4 py-2 text-sm text-gray-900">{cluster.start}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{cluster.end}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{cluster.end - cluster.start + 1}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{cluster.meanEntropy.toFixed(3)}</td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      cluster.classification === 'Stable'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {cluster.classification}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="p-4 text-gray-500 text-center">No significant clusters identified</div>
      )}
    </div>
  );
};

export default ClusterAnalysis;