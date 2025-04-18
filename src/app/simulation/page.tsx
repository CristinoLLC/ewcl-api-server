'use client'

import { useState } from 'react'
import MolViewer from '@/components/MolViewer'
import { useRouter } from 'next/navigation'

export default function SimulationPage() {
  const [pdbData, setPdbData] = useState<string | null>(null)
  const [visualizationOptions, setVisualizationOptions] = useState({
    showSurface: true,
    showCartoon: true,
    showBallsAndSticks: true,
    showLabels: true,
    colorScheme: 'entropy' as const
  })
  const router = useRouter()

  // Example entropy scores (replace with real data)
  const entropyScores = {
    1: 0.8,
    2: 0.6,
    3: 0.4,
    // ... more scores
  }

  // Example variants with enhanced information
  const variants = [
    { 
      position: 1, 
      type: 'R123W', 
      clinicalSignificance: 'Pathogenic',
      impact: 'HIGH',
      frequency: 0.001,
      evidence: ['ClinVar', 'COSMIC']
    },
    { 
      position: 2, 
      type: 'G456D', 
      clinicalSignificance: 'Likely Pathogenic',
      impact: 'MODERATE',
      frequency: 0.0005,
      evidence: ['ClinVar']
    },
    // ... more variants
  ]

  // Example comparison structure (wild-type vs mutant)
  const compareStructure = {
    pdbUrl: '/pdbs/BRCA1_wt.pdb',
    label: 'Wild Type'
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Simulation Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Protein</h3>
            <p className="text-lg font-semibold text-gray-900">BRCA1</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Residues</h3>
            <p className="text-lg font-semibold text-gray-900">1,863</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Variants</h3>
            <p className="text-lg font-semibold text-gray-900">3</p>
          </div>
        </div>
      </div>

      {/* Visualization Controls */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Visualization Options</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={visualizationOptions.showSurface}
              onChange={(e) => setVisualizationOptions({
                ...visualizationOptions,
                showSurface: e.target.checked
              })}
              className="rounded text-indigo-600"
            />
            <span>Surface</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={visualizationOptions.showCartoon}
              onChange={(e) => setVisualizationOptions({
                ...visualizationOptions,
                showCartoon: e.target.checked
              })}
              className="rounded text-indigo-600"
            />
            <span>Cartoon</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={visualizationOptions.showBallsAndSticks}
              onChange={(e) => setVisualizationOptions({
                ...visualizationOptions,
                showBallsAndSticks: e.target.checked
              })}
              className="rounded text-indigo-600"
            />
            <span>Balls & Sticks</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={visualizationOptions.showLabels}
              onChange={(e) => setVisualizationOptions({
                ...visualizationOptions,
                showLabels: e.target.checked
              })}
              className="rounded text-indigo-600"
            />
            <span>Labels</span>
          </label>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Color Scheme</label>
          <select
            value={visualizationOptions.colorScheme}
            onChange={(e) => setVisualizationOptions({
              ...visualizationOptions,
              colorScheme: e.target.value as any
            })}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="entropy">Entropy</option>
            <option value="secondary">Secondary Structure</option>
            <option value="hydrophobicity">Hydrophobicity</option>
          </select>
        </div>
      </div>

      {/* 3D Viewer */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">3D Structure</h2>
        <MolViewer
          pdbUrl="/pdbs/BRCA1.pdb"
          entropyScores={entropyScores}
          variants={variants}
          compareStructure={compareStructure}
          visualizationOptions={visualizationOptions}
        />
      </div>

      {/* Analysis Controls */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Analysis Controls</h2>
        <div className="flex space-x-4">
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            onClick={() => router.push('/simulation/compare')}
          >
            Compare Structures
          </button>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            onClick={() => router.push('/simulation/variants')}
          >
            View Variants
          </button>
        </div>
      </div>
    </div>
  )
} 