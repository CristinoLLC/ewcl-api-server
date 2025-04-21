'use client'

import { useState } from 'react'
import ProteinViewer from '@/components/ProteinViewer'
import RunEwclButton from '@/components/RunEwclButton'
import { EwclResponse, runEWCLTest } from '@/utils/api'
import { toast } from 'react-toastify'

export default function SimulationPage() {
  const [visualizationOptions, setVisualizationOptions] = useState({
    showSurface: true,
    showCartoon: true,
    showBallsAndSticks: true,
    showLabels: true,
    colorScheme: 'entropy' as const
  })
  const [entropyScores, setEntropyScores] = useState<{ [residue: number]: number }>({})
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleFileSubmit = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first')
      return
    }

    try {
      setLoading(true)
      const result = await runEWCLTest(selectedFile)
      console.log("EWCL Result:", result)
      setEntropyScores(result.scores)
      toast.success('EWCL analysis completed successfully!')
    } catch (error) {
      console.error('EWCL analysis failed:', error)
      toast.error('Failed to run EWCL analysis')
    } finally {
      setLoading(false)
    }
  }

  const handleEwclResponse = (response: EwclResponse) => {
    setLoading(false)
    if (response.scores) {
      setEntropyScores(response.scores)
      toast.success('EWCL analysis completed successfully!')
    } else {
      toast.error('Failed to get entropy scores from EWCL response')
    }
  }

  const handleRunEwcl = () => {
    setLoading(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Protein Structure Analysis</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main viewer */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <ProteinViewer
              pdbUrl={selectedFile ? URL.createObjectURL(selectedFile) : "/pdbs/test.pdb"}
              entropyScores={entropyScores}
              visualizationOptions={{
                showSurface: true,
                showCartoon: true,
                colorScheme: entropyScores ? 'entropy' : 'secondary',
                style: {
                  opacity: 0.8,
                  metalness: 0.3,
                  roughness: 0.5,
                  quality: 'medium'
                }
              }}
            />
          </div>
        </div>

        {/* Controls and results */}
        <div className="space-y-6">
          {/* File Upload */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Upload PDB File</h2>
            <div className="space-y-4">
              <input
                type="file"
                accept=".pdb"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              <button
                onClick={handleFileSubmit}
                disabled={!selectedFile || loading}
                className={`
                  w-full px-4 py-2 rounded-md
                  font-medium text-sm
                  transition-colors duration-200
                  ${(!selectedFile || loading)
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                  }
                  text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                `}
              >
                {loading ? 'Analyzing...' : 'Analyze PDB File'}
              </button>
            </div>
          </div>

          {/* EWCL Analysis */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">EWCL Analysis</h2>
            <RunEwclButton
              pdbPath="/pdbs/test.pdb"
              onResult={handleEwclResponse}
              onClick={handleRunEwcl}
              disabled={loading}
            />
            {loading && (
              <div className="mt-4 text-sm text-gray-600">
                Running EWCL analysis... This may take a few minutes.
              </div>
            )}
          </div>

          {/* Visualization Controls */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Visualization Controls</h2>
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

          {/* Analysis Results */}
          {entropyScores && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Analysis Summary</h2>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Average Entropy: {
                    (Object.values(entropyScores).reduce((a, b) => a + b, 0) / Object.values(entropyScores).length).toFixed(3)
                  }
                </p>
                <p className="text-sm text-gray-600">
                  Residues Analyzed: {Object.keys(entropyScores).length}
                </p>
                <p className="text-sm text-gray-600">
                  Max Entropy: {Object.values(entropyScores).length > 0 ? Math.max(...Object.values(entropyScores)).toFixed(3) : 'N/A'}
                </p>
                <p className="text-sm text-gray-600">
                  Min Entropy: {Object.values(entropyScores).length > 0 ? Math.min(...Object.values(entropyScores)).toFixed(3) : 'N/A'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 