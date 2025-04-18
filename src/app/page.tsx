'use client'

import { useState } from 'react'
import { ProteinViewer } from '@/components/ProteinViewer'
import { AnalysisPanel } from '@/components/AnalysisPanel'
import { UploadSection } from '@/components/UploadSection'

export default function Home() {
  const [proteinData, setProteinData] = useState<any>(null)
  const [analysisResults, setAnalysisResults] = useState<any>(null)

  const handleProteinUpload = async (file: File) => {
    // TODO: Implement file upload and processing
    console.log('Protein file uploaded:', file)
  }

  const handleAnalysis = async () => {
    // TODO: Implement EWCL analysis
    console.log('Starting analysis...')
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          EWCL Protein Analysis Platform
        </h1>
        <p className="text-gray-600">
          Upload your protein structure (PDB or AlphaFold model) to analyze its collapse behavior using the Entropy-Weighted Collapse Likelihood model.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <UploadSection onUpload={handleProteinUpload} />
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <ProteinViewer proteinData={proteinData} />
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <AnalysisPanel 
          proteinData={proteinData}
          analysisResults={analysisResults}
          onAnalyze={handleAnalysis}
        />
      </div>
    </div>
  )
}
