'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Button } from './ui/button'
import { fetchBenchmarks } from '@/lib/firebase'

// Dynamically import the EwclViewer with ssr disabled
const EwclViewer = dynamic(() => import('./MolViewer'), { 
  ssr: false,
  loading: () => <div className="h-80 flex items-center justify-center">Loading viewer...</div>
})

interface MolViewerModalProps {
  isOpen: boolean
  onClose: () => void
  pdbUrl: string
  entropyData: Record<string, number>
  maxEntropyResidue: number
  proteinName: string
  resultUrl: string 
  benchmarkId: string
}

export default function MolViewerModal({
  isOpen,
  onClose,
  pdbUrl,
  entropyData,
  maxEntropyResidue,
  proteinName,
  resultUrl,
  benchmarkId
}: MolViewerModalProps) {
  const [similarBenchmarks, setSimilarBenchmarks] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch similar benchmarks for the same protein
  useEffect(() => {
    if (isOpen && proteinName) {
      setLoading(true)
      
      // Fetch similar benchmarks for comparison
      fetchBenchmarks()
        .then(benchmarks => {
          const similar = benchmarks
            .filter(b => 
              b.proteinName === proteinName && 
              b.id !== benchmarkId
            )
            .slice(0, 5) // Get up to 5 similar benchmarks
          
          setSimilarBenchmarks(similar)
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [isOpen, proteinName, benchmarkId, resultUrl])

  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center">
            <h3 className="text-lg font-medium">Protein: {proteinName}</h3>
            <a 
              href={pdbUrl} 
              download 
              className="ml-3 text-sm text-blue-600 hover:text-blue-800 flex items-center"
              title="Download PDB file"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              PDB
            </a>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 p-4 overflow-auto">
          <div className="h-[600px]">
            <EwclViewer
              pdbUrl={pdbUrl}
              entropyData={entropyData}
              maxEntropyResidue={maxEntropyResidue}
            />
          </div>
          
          {similarBenchmarks.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-3">Compare with Previous Runs</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Score</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collapse</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {similarBenchmarks.map(benchmark => (
                      <tr key={benchmark.id}>
                        <td className="px-4 py-2 text-sm">
                          {benchmark.timestamp.toDate().toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 text-sm">{benchmark.avgScore.toFixed(3)}</td>
                        <td className="px-4 py-2 text-sm">{benchmark.collapseScore.toFixed(3)}</td>
                        <td className="px-4 py-2 text-sm">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                            benchmark.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                            benchmark.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {benchmark.riskLevel}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(benchmark.blobUrl)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}