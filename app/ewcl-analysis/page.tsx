'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import MolViewer from '@/components/MolViewer'
import UploadBox from '@/components/UploadBox'
import { saveAnalysisToFirestore } from '@/lib/firebase'
import { saveAs } from 'file-saver'
import { ExclamationCircleIcon, DocumentTextIcon, ChartPieIcon } from '@heroicons/react/24/outline'
import { Tab } from '@headlessui/react'

export default function EWCLAnalysisPage() {
  const searchParams = useSearchParams()
  const [fileUrl, setFileUrl] = useState<string>('')
  const [entropyMap, setEntropyMap] = useState<Record<string, number>>({})
  const [proteinName, setProteinName] = useState('')
  const [entropyScore, setEntropyScore] = useState<number | null>(null)
  const [residueCount, setResidueCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedResidue, setSelectedResidue] = useState<string | null>(null)
  
  // Calculate entropy statistics
  const entropyStats = React.useMemo(() => {
    if (!entropyMap || Object.keys(entropyMap).length === 0) return null
    
    const values = Object.values(entropyMap)
    return {
      avg: values.reduce((sum, val) => sum + val, 0) / values.length,
      max: Math.max(...values),
      min: Math.min(...values),
      ordered: values.filter(v => v < 0.3).length,
      transitional: values.filter(v => v >= 0.3 && v <= 0.6).length,
      disordered: values.filter(v => v > 0.6).length,
    }
  }, [entropyMap])
  
  useEffect(() => {
    const preloadedProteinName = searchParams.get('proteinName')
    const preloadedPdbUrl = searchParams.get('pdbUrl')
    const preloadedEntropyMap = searchParams.get('entropyMap')

    if (preloadedProteinName && preloadedPdbUrl && preloadedEntropyMap) {
      try {
        const parsedEntropyMap = JSON.parse(decodeURIComponent(preloadedEntropyMap))
        setProteinName(decodeURIComponent(preloadedProteinName))
        setFileUrl(decodeURIComponent(preloadedPdbUrl))
        setEntropyMap(parsedEntropyMap)
        setEntropyScore(
          Object.values(parsedEntropyMap).reduce((a: number, b: number) => a + b, 0) /
            Object.keys(parsedEntropyMap).length
        )
        setResidueCount(Object.keys(parsedEntropyMap).length)
      } catch (e) {
        console.error('Error parsing preloaded benchmark data:', e)
        setError('Failed to load preloaded benchmark data')
      }
    }
  }, [searchParams])

  const handleRunAnalysis = async (url: string, uploadedFile: File) => {
    setFileUrl(url)
    setLoading(true)
    setError(null)
    
    try {
      // This line uses the environment variable. Make sure it's set correctly in .env.local
      const apiUrl = `${process.env.NEXT_PUBLIC_EWCL_API_URL || 'http://localhost:5000'}/api/ewcl-infer`;

      console.log('Sending request to:', apiUrl); // Check terminal output for this
      console.log('With file URL:', url)
      
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileUrl: url }),
      })
      
      if (!res.ok) {
        const errorText = await res.text().catch(() => 'Unknown error')
        console.error('API error details:', errorText)
        throw new Error(`API responded with status ${res.status}: ${errorText}`)
      }
      
      const result = await res.json()
      setProteinName(result.name || uploadedFile.name.split('.')[0])
      setEntropyMap(result.entropy || {})
      setEntropyScore(result.entropyScore)
      setResidueCount(Object.keys(result.entropy || {}).length)
      
    } catch (error) {
      console.error('Error running analysis:', error)
      setError(`${error.message}. Please check your API configuration.`)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadJSON = () => {
    if (!entropyMap || Object.keys(entropyMap).length === 0) {
      setError('No data available to download');
      return;
    }

    const data = {
      name: proteinName,
      collapseScore: entropyScore,
      residues: residueCount,
      entropyMap,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    saveAs(blob, `${proteinName}_analysis.json`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-gray-900">Upload Structure</h2>
                  <div className="mt-3">
                    <UploadBox onUpload={handleRunAnalysis} loading={loading} />
                  </div>
                </div>
              </div>
              
              {entropyScore !== null && (
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h2 className="text-lg font-medium text-gray-900">Analysis Summary</h2>
                    <dl className="mt-4 space-y-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Protein Name</dt>
                        <dd className="mt-1 text-md text-gray-900">{proteinName}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Collapse Score</dt>
                        <dd className="mt-1 flex items-center">
                          <span className="text-xl font-semibold text-gray-900">
                            {entropyScore.toFixed(2)}
                          </span>
                          <div className="ml-2 w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                entropyScore < 0.3 ? 'bg-green-500' : 
                                entropyScore < 0.6 ? 'bg-yellow-400' : 'bg-red-500'
                              }`}
                              style={{ width: `${entropyScore * 100}%` }}
                            ></div>
                          </div>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Residues</dt>
                        <dd className="mt-1 text-md text-gray-900">{residueCount}</dd>
                      </div>
                      
                      {entropyStats && (
                        <>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Avg. Entropy</dt>
                            <dd className="mt-1 text-md text-gray-900">{entropyStats.avg.toFixed(3)}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Classification</dt>
                            <dd className="mt-1">
                              <div className="flex items-center gap-1 text-xs">
                                <span className="inline-block w-3 h-3 bg-green-500 rounded-sm"></span>
                                <span className="text-gray-700">{entropyStats.ordered} ordered</span>
                                <span className="inline-block w-3 h-3 bg-yellow-400 rounded-sm ml-2"></span>
                                <span className="text-gray-700">{entropyStats.transitional} transitional</span>
                                <span className="inline-block w-3 h-3 bg-red-500 rounded-sm ml-2"></span>
                                <span className="text-gray-700">{entropyStats.disordered} disordered</span>
                              </div>
                            </dd>
                          </div>
                        </>
                      )}
                    </dl>
                  </div>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              {fileUrl ? (
                <div className="bg-white shadow-md rounded-lg p-4">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Structure Viewer</h2>
                  <div className="h-[600px] w-full">
                    <MolViewer
                      pdbUrl={fileUrl}
                      entropyMap={entropyMap}
                      proteinName={proteinName}
                      highlightedResidue={selectedResidue}
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-white shadow-md rounded-lg p-6 text-center flex items-center justify-center h-[600px]">
                  <div>
                    <ChartPieIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No protein structure</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Upload a protein structure file to visualize and analyze it.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}