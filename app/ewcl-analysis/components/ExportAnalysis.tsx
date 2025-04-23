'use client'

import React from 'react'

interface ExportAnalysisProps {
  proteinName: string
  residueEntropyMap: Record<string, number>
  averageEntropy: number
  maxEntropy: number
  minEntropy: number
  collapseScore: number
}

const ExportAnalysis: React.FC<ExportAnalysisProps> = ({
  proteinName,
  residueEntropyMap,
  averageEntropy,
  maxEntropy,
  minEntropy,
  collapseScore
}) => {
  const generateJson = () => {
    const data = {
      proteinName,
      entropyMap: residueEntropyMap,
      statistics: {
        averageEntropy,
        maxEntropy,
        minEntropy,
        collapseScore
      }
    }
    
    return JSON.stringify(data, null, 2)
  }
  
  const generateCsv = () => {
    const header = 'Residue,Entropy,State\n'
    
    const rows = Object.entries(residueEntropyMap)
      .map(([residueIndex, entropy]) => {
        let state = 'Transition'
        if (entropy < 0.25) state = 'Ordered'
        if (entropy > 0.6) state = 'Disordered'
        
        return `${residueIndex},${entropy.toFixed(4)},${state}`
      })
      .join('\n')
    
    return header + rows
  }
  
  const downloadJson = () => {
    const jsonString = generateJson()
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = 'entropy_map.json'
    document.body.appendChild(link)
    link.click()
    
    // Cleanup
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
  
  const downloadCsv = () => {
    const csvString = generateCsv()
    const blob = new Blob([csvString], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = 'entropy_scores.csv'
    document.body.appendChild(link)
    link.click()
    
    // Cleanup
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col space-y-2">
      <button
        onClick={downloadJson}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        Download entropy_map.json
      </button>
      
      <button
        onClick={downloadCsv}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        Download entropy_scores.csv
      </button>
    </div>
  )
}

export default ExportAnalysis