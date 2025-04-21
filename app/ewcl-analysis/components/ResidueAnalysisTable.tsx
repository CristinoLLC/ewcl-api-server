'use client'

import React from 'react'

// Define the collapse state types
type ResidueState = 'Ordered' | 'Transition' | 'Disordered'

interface ResidueData {
  residueIndex: number
  entropy: number
  state: ResidueState
}

interface ResidueAnalysisTableProps {
  residueEntropyMap: Record<string, number>
}

const getResidueState = (entropy: number): ResidueState => {
  if (entropy < 0.25) return 'Ordered'
  if (entropy > 0.6) return 'Disordered'
  return 'Transition'
}

const ResidueAnalysisTable: React.FC<ResidueAnalysisTableProps> = ({ residueEntropyMap }) => {
  // Convert the entropy map into an array of residue data objects
  const residueDataList: ResidueData[] = Object.entries(residueEntropyMap).map(([residueIndex, entropy]) => ({
    residueIndex: parseInt(residueIndex),
    entropy,
    state: getResidueState(entropy)
  }))

  // Sort by residue index
  residueDataList.sort((a, b) => a.residueIndex - b.residueIndex)

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Residue</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entropy</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">State</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {residueDataList.map((residue) => (
            <tr key={residue.residueIndex}>
              <td className="px-4 py-2 text-sm text-gray-900">{residue.residueIndex}</td>
              <td className="px-4 py-2 text-sm text-gray-900">{residue.entropy.toFixed(3)}</td>
              <td className="px-4 py-2 text-sm text-gray-900">
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    residue.state === 'Ordered'
                      ? 'bg-green-100 text-green-800'
                      : residue.state === 'Disordered'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {residue.state}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ResidueAnalysisTable