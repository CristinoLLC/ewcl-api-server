'use client'

import React from 'react'

interface ProteinComparisonProps {
  originalName: string
  originalEntropyMap: Record<string, number>
  mutantName?: string
  mutantEntropyMap?: Record<string, number>
}

const ProteinComparison: React.FC<ProteinComparisonProps> = ({
  originalName,
  originalEntropyMap,
  mutantName = "Mutant Protein",
  mutantEntropyMap = {}
}) => {
  // Check if we have mutant data to compare
  const hasMutantData = Object.keys(mutantEntropyMap).length > 0
  
  // Get all residue indexes from both proteins
  const allResidues = new Set([
    ...Object.keys(originalEntropyMap).map(k => parseInt(k)),
    ...Object.keys(mutantEntropyMap).map(k => parseInt(k))
  ])
  
  // Convert to sorted array
  const residueIndices = Array.from(allResidues).sort((a, b) => a - b)
  
  // Find significant differences (> 0.1)
  const significantDifferences = residueIndices
    .filter(residue => {
      const origEntropy = originalEntropyMap[residue] || 0
      const mutEntropy = mutantEntropyMap[residue] || 0
      return Math.abs(origEntropy - mutEntropy) > 0.1
    })
    .map(residue => ({
      residue,
      originalEntropy: originalEntropyMap[residue] || 0,
      mutantEntropy: mutantEntropyMap[residue] || 0,
      difference: (mutantEntropyMap[residue] || 0) - (originalEntropyMap[residue] || 0)
    }))

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium">Protein Comparison</h3>
        {!hasMutantData && (
          <p className="text-gray-500 mt-2">Upload a second protein to compare entropy profiles.</p>
        )}
      </div>
      
      {hasMutantData && (
        <>
          <div className="p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Entropy Comparison</h4>
            <div className="h-64 relative">
              <EntropyComparisonChart 
                originalEntropyMap={originalEntropyMap}
                mutantEntropyMap={mutantEntropyMap}
                originalName={originalName}
                mutantName={mutantName}
              />
            </div>
          </div>
          
          <div className="p-4 border-t">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Significant Changes</h4>
            
            {significantDifferences.length === 0 ? (
              <p className="text-gray-500">No significant differences (>0.1) were found between the proteins.</p>
            ) : (
              <>
                <p className="text-gray-600 mb-3">
                  {significantDifferences.length} residues with significant entropy differences (>0.1).
                </p>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-3 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500">Residue</th>
                        <th className="px-3 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500">{originalName}</th>
                        <th className="px-3 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500">{mutantName}</th>
                        <th className="px-3 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500">Change</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {significantDifferences.slice(0, 10).map(diff => (
                        <tr key={diff.residue}>
                          <td className="px-3 py-2 text-sm text-gray-900">{diff.residue}</td>
                          <td className="px-3 py-2 text-sm text-gray-600">{diff.originalEntropy.toFixed(3)}</td>
                          <td className="px-3 py-2 text-sm text-gray-600">{diff.mutantEntropy.toFixed(3)}</td>
                          <td className={`px-3 py-2 text-sm ${diff.difference > 0 ? 'text-red-600' : 'text-blue-600'}`}>
                            {diff.difference > 0 ? '+' : ''}{diff.difference.toFixed(3)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// Chart component for comparing entropy profiles
const EntropyComparisonChart = ({ 
  originalEntropyMap, 
  mutantEntropyMap, 
  originalName, 
  mutantName 
}: { 
  originalEntropyMap: Record<string, number>, 
  mutantEntropyMap: Record<string, number>, 
  originalName: string, 
  mutantName: string 
}) => {
  // Get all residues from both proteins
  const allResidues = new Set([
    ...Object.keys(originalEntropyMap).map(k => parseInt(k)),
    ...Object.keys(mutantEntropyMap).map(k => parseInt(k))
  ])
  
  const residueIndices = Array.from(allResidues).sort((a, b) => a - b)
  
  // Find min/max residue for x-axis scale
  const minResidue = Math.min(...residueIndices)
  const maxResidue = Math.max(...residueIndices)
  
  // Scale helpers
  const getX = (residue: number): number => {
    return ((residue - minResidue) / (maxResidue - minResidue)) * 100
  }
  
  const getY = (entropy: number): number => {
    // Scale from entropy 0-1 to height percentage (inverted, 0 at bottom)
    return 100 - (entropy * 100)
  }
  
  // Generate path data for both proteins
  const getPathData = (entropyMap: Record<string, number>): string => {
    let path = ''
    
    residueIndices.forEach((residue, i) => {
      const entropy = entropyMap[residue] || 0
      if (i === 0) {
        path += `M ${getX(residue)} ${getY(entropy)}`
      } else {
        path += ` L ${getX(residue)} ${getY(entropy)}`
      }
    })
    
    return path
  }
  
  // Generate highlight areas for differences > 0.1
  const getDifferenceHighlights = () => {
    const highlights = residueIndices.map(residue => {
      const origEntropy = originalEntropyMap[residue] || 0
      const mutantEntropy = mutantEntropyMap[residue] || 0
      const diff = mutantEntropy - origEntropy
      
      if (Math.abs(diff) > 0.1) {
        return {
          x: getX(residue),
          isIncrease: diff > 0
        }
      }
      return null
    }).filter(Boolean)
    
    return highlights
  }
  
  const diffHighlights = getDifferenceHighlights()

  return (
    <div className="w-full h-full relative">
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Grid lines */}
        <line x1="0" y1="0" x2="100" y2="0" stroke="#eee" strokeWidth="0.5" />
        <line x1="0" y1="25" x2="100" y2="25" stroke="#eee" strokeWidth="0.5" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="#eee" strokeWidth="0.5" />
        <line x1="0" y1="75" x2="100" y2="75" stroke="#eee" strokeWidth="0.5" />
        <line x1="0" y1="100" x2="100" y2="100" stroke="#eee" strokeWidth="0.5" />
        
        {/* Difference highlights */}
        {diffHighlights.map((highlight, i) => (
          <rect
            key={i}
            x={highlight.x - 0.4}
            y="0"
            width="0.8"
            height="100"
            fill={highlight.isIncrease ? "rgba(244, 63, 94, 0.2)" : "rgba(59, 130, 246, 0.2)"}
          />
        ))}
        
        {/* Original protein line */}
        <path 
          d={getPathData(originalEntropyMap)} 
          fill="none" 
          stroke="#3b82f6" 
          strokeWidth="1.5"
        />
        
        {/* Mutant protein line */}
        <path 
          d={getPathData(mutantEntropyMap)} 
          fill="none" 
          stroke="#f43f5e" 
          strokeWidth="1.5"
          strokeDasharray="3,2"
        />
        
        {/* Y-axis labels */}
        <text x="1" y="1" fontSize="6" fill="#888" dominantBaseline="hanging">1.0</text>
        <text x="1" y="25" fontSize="6" fill="#888" dominantBaseline="middle">0.75</text>
        <text x="1" y="50" fontSize="6" fill="#888" dominantBaseline="middle">0.5</text>
        <text x="1" y="75" fontSize="6" fill="#888" dominantBaseline="middle">0.25</text>
        <text x="1" y="99" fontSize="6" fill="#888" dominantBaseline="middle">0</text>
      </svg>
      
      {/* Legend */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center mb-2 text-xs bg-white bg-opacity-75 py-1">
        <div className="flex items-center mr-4">
          <div className="w-3 h-1 bg-blue-500 mr-1"></div>
          <span>{originalName}</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-0 border-t border-dashed border-red-500 mr-1"></div>
          <span>{mutantName}</span>
        </div>
      </div>
    </div>
  )
}

export default ProteinComparison