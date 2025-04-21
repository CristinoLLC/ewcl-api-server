/**
 * This file is part of the EWCL platform.
 * Homepage component that provides access to protein structure analysis tools
 * and displays key research outputs from the EWCL model.
 * 
 * The layout prioritizes scientific clarity and research-focused content
 * while maintaining a clean, academic aesthetic.
 */

'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { UploadSection } from '@/components/UploadSection'
import ProteinViewer from '@/components/ProteinViewer'
import AnalysisPanel from '@/components/AnalysisPanel'
import { EwclResponse, runEWCLTest } from '@/utils/api'
import { toast } from 'react-toastify'
import { BeatLoader } from 'react-spinners'

export default function Home() {
  const [proteinData, setProteinData] = useState<{ pdb: string; analysisResults: EwclResponse | null }>({ 
    pdb: '',
    analysisResults: null
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleFileUpload = async (file: File) => {
    try {
      setIsLoading(true)
      const pdbContent = await file.text()
      const results = await runEWCLTest(file)
      setProteinData({
        pdb: pdbContent,
        analysisResults: results
      })
      toast.success('Analysis completed successfully')
    } catch (error) {
      toast.error('Error processing file: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Scientific Context */}
      <section className="relative bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 font-crimson sm:text-5xl md:text-6xl">
              EWCL Analysis Platform
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Analyze protein entropy and predict structural collapse likelihood using the 
              <span className="font-semibold"> Entropy-Weighted Collapse Likelihood </span>
              model.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Analysis Tools Section */}
        <section className="space-y-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <h2 className="text-2xl font-crimson font-bold text-gray-900 mb-4">Structure Analysis</h2>
              <div className="prose prose-slate max-w-none mb-6">
                <p>
                  Upload a protein structure file (.pdb) to analyze its entropy profile and predict regions of potential structural collapse.
                  The EWCL model evaluates local entropy patterns to identify residues prone to conformational changes.
                </p>
              </div>
              <UploadSection onUpload={handleFileUpload} />
              {isLoading && (
                <div className="flex items-center justify-center mt-4">
                  <BeatLoader color="#A51C30" />
                </div>
              )}
            </div>
          </div>

          {proteinData.pdb && (
            <>
              <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                <div className="p-6">
                  <h2 className="text-2xl font-crimson font-bold text-gray-900 mb-4">Structural Visualization</h2>
                  <div className="prose prose-slate max-w-none mb-6">
                    <p>
                      Interactive 3D visualization of the protein structure. Regions are colored by their entropy scores,
                      with warmer colors indicating higher collapse likelihood.
                    </p>
                  </div>
                  <ProteinViewer pdbData={proteinData.pdb} />
                </div>
              </div>

              {proteinData.analysisResults && (
                <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                  <div className="p-6">
                    <h2 className="text-2xl font-crimson font-bold text-gray-900 mb-4">Analysis Results</h2>
                    <div className="prose prose-slate max-w-none mb-6">
                      <p>
                        Detailed entropy analysis results showing per-residue collapse likelihood scores and statistical distributions.
                        Higher scores indicate regions more likely to undergo conformational changes.
                      </p>
                    </div>
                    <AnalysisPanel data={proteinData.analysisResults} />
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        {/* Research Context Section */}
        <section className="mt-16">
          <h2 className="text-3xl font-crimson font-bold text-gray-900 mb-8">Research Applications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Protein Dynamics",
                description: "Study conformational changes and structural flexibility in protein molecules through entropy-based analysis."
              },
              {
                title: "Structure Prediction",
                description: "Validate protein structure predictions by analyzing entropy patterns and identifying unstable regions."
              },
              {
                title: "Drug Design",
                description: "Identify potential binding sites and structural motifs for therapeutic targeting based on collapse likelihood."
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
              >
                <h3 className="text-xl font-crimson font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Documentation Section */}
        <section className="mt-16">
          <h2 className="text-3xl font-crimson font-bold text-gray-900 mb-8">Documentation</h2>
          <div className="prose prose-slate max-w-none">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-crimson font-semibold text-gray-900 mb-4">Using the EWCL Platform</h3>
              <ol className="list-decimal list-inside space-y-3">
                <li>Upload a protein structure file in PDB format</li>
                <li>The EWCL model will analyze local entropy patterns</li>
                <li>View the 3D structure with entropy-based coloring</li>
                <li>Examine detailed residue-level collapse likelihood scores</li>
                <li>Export results for further analysis or publication</li>
              </ol>
              <div className="mt-6">
                <Link 
                  href="/documentation"
                  className="text-[#A51C30] hover:text-[#8A1829] font-medium"
                >
                  View Full Documentation →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}