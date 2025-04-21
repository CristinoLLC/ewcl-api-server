'use client'

import { useState } from 'react'
import { saveAs } from 'file-saver'

interface AnalysisSummaryProps {
  proteinName: string
  collapseScore: number
  collapseScoreInterpretation: { text: string; color: string }
  residueCount: number
  avgEntropy: number
  minEntropy: number
  maxEntropy: number
  entropyMap: Record<string, number>
  onSave: () => Promise<boolean>
}

export default function AnalysisSummary({
  proteinName,
  collapseScore,
  collapseScoreInterpretation,
  residueCount,
  avgEntropy,
  minEntropy,
  maxEntropy,
  entropyMap,
  onSave,
}: AnalysisSummaryProps) {
  const [saving, setSaving] = useState(false)
  const [comparing, setComparing] = useState(false)

  const handleDownloadJSON = () => {
    const data = {
      name: proteinName,
      collapseScore,
      residueCount,
      avgEntropy,
      minEntropy,
      maxEntropy,
      entropyMap,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    saveAs(blob, `${proteinName.replace(/\s+/g, '_')}_analysis.json`)
  }

  const handleExportCSV = () => {
    // Create CSV content
    let csvContent = 'Residue,Entropy,Classification\n'

    // Sort residues numerically
    const sortedResidues = Object.keys(entropyMap)
      .map(Number)
      .sort((a, b) => a - b)
      .map(String)

    // Add data rows
    sortedResidues.forEach(residue => {
      const entropy = entropyMap[residue]
      let classification = 'Ordered'
      
      if (entropy > 0.5) {
        classification = 'Disordered'
      } else if (entropy > 0.3) {
        classification = 'Transition'
      }
      
      csvContent += `${residue},${entropy.toFixed(4)},${classification}\n`
    })

    const blob = new Blob([csvContent], { type: 'text/csv' })
    saveAs(blob, `${proteinName.replace(/\s+/g, '_')}_entropy.csv`)
  }

  const handleSaveImage = () => {
    // Get the canvas element from the MolstarContainer
    const canvas = document.querySelector('canvas')
    if (canvas) {
      canvas.toBlob(blob => {
        if (blob) {
          saveAs(blob, `${proteinName.replace(/\s+/g, '_')}_structure.png`)
        }
      })
    } else {
      alert('Could not capture structure image. Please try again.')
    }
  }

  const handleSaveAnalysis = async () => {
    setSaving(true)
    try {
      const success = await onSave()
      if (success) {
        // Success is handled by the onSave function
      }
    } catch (error) {
      console.error('Error saving analysis:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleCompareProtein = () => {
    setComparing(true)
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.pdb,.json'
    
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        // This would trigger comparison in a real implementation
        alert(`Comparing ${proteinName} with ${file.name}...\nFeature coming soon!`)
      }
      setComparing(false)
    }
    
    fileInput.click()
  }

  const getScoreBadgeColor = () => {
    switch (collapseScoreInterpretation.color) {
      case 'green':
        return 'bg-green-100 text-green-800'
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800'
      case 'red':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium">Analysis Summary</h2>
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="text-sm text-gray-500">Protein Name</h3>
            <p className="font-medium">{proteinName}</p>
          </div>
          
          <div>
            <h3 className="text-sm text-gray-500">Collapse Score</h3>
            <div className="flex items-center">
              <p className="font-medium mr-2">{collapseScore.toFixed(2)}</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreBadgeColor()}`}>
                {collapseScoreInterpretation.text}
              </span>
              
              <div className="ml-2 relative group">
                <span className="cursor-help text-gray-400 hover:text-gray-600">ⓘ</span>
                <div className="hidden group-hover:block absolute z-10 w-64 p-2 text-xs bg-gray-800 text-white rounded shadow-lg left-0 bottom-full mb-1">
                  <p className="font-medium mb-1">Collapse Score Interpretation:</p>
                  <p>&lt; 0.3: Ordered protein (stable structure)</p>
                  <p>0.3–0.5: Partially disordered protein</p>
                  <p>&gt; 0.5: Highly disordered protein (unstable)</p>
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div
                className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-2 rounded-full"
                style={{ width: `${collapseScore * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm text-gray-500">Residues</h3>
              <p className="font-medium">{residueCount}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Avg. Entropy</h3>
              <p className="font-medium">{avgEntropy.toFixed(3)}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Min. Entropy</h3>
              <p className="font-medium">{minEntropy.toFixed(3)}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Max. Entropy</h3>
              <p className="font-medium">{maxEntropy.toFixed(3)}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h2 className="text-lg font-medium mb-4">Tools & Export</h2>
        <div className="space-y-2">
          <button
            onClick={handleDownloadJSON}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Analysis (JSON)
          </button>
          
          <button
            onClick={handleExportCSV}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Entropy Data (CSV)
          </button>
          
          <button
            onClick={handleSaveImage}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Save Structure Image
          </button>
          
          <button
            onClick={handleCompareProtein}
            disabled={comparing}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m-4 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Compare With Another Protein
          </button>
          
          <div className="pt-2">
            <button
              onClick={handleSaveAnalysis}
              disabled={saving}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium py-2 px-4 rounded flex items-center justify-center"
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save Analysis
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}