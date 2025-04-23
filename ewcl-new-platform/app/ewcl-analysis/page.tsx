import React from 'react'
import Link from 'next/link'
import MolstarViewer from '@/components/MolstarViewer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 space-y-8">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Welcome to EWCL Protein Analyzer
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Analyze protein structures with entropy-weighted collapse likelihood. Upload your protein data and visualize entropy trends in 3D.
        </p>

        {/* Hero Image or 3D Viewer */}
        <div className="w-full max-w-4xl h-96 bg-white shadow-lg rounded-lg">
          {/* Replace with MolstarViewer for 3D visualization */}
          <MolstarViewer proteinData="/maps/entropy_tau.json" />
        </div>

        {/* Call-to-Action Button */}
        <Link href="/ewcl-analysis">
          <a className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700">
            Get Started
          </a>
        </Link>
      </section>
    </div>
  )
}