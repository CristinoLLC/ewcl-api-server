'use client'

import React from 'react'
import { saveAs } from 'file-saver'
import { jsPDF } from 'jspdf'

interface AnalysisSummaryProps {
  name: string
  score: number
  avgEntropy: number
  maxEntropy: number
  minEntropy: number
  residues: number
  onSave: () => void
  entropyMap: Record<string, number>
}

export default function AnalysisSummary({
  name,
  score,
  avgEntropy,
  maxEntropy,
  minEntropy,
  residues,
  onSave,
  entropyMap,
}: AnalysisSummaryProps) {
  const handleDownloadJSON = () => {
    const data = { name, score, avgEntropy, maxEntropy, minEntropy, residues, entropyMap }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    saveAs(blob, `${name}_analysis.json`)
  }

  const handleDownloadPDF = () => {
    const doc = new jsPDF()
    doc.text('EWCL Analysis Report', 10, 10)
    doc.text(`Protein Name: ${name}`, 10, 20)
    doc.text(`Collapse Score: ${score.toFixed(2)}`, 10, 30)
    doc.text(`Average Entropy: ${avgEntropy.toFixed(3)}`, 10, 40)
    doc.text(`Residues: ${residues}`, 10, 50)
    doc.save(`${name}_analysis.pdf`)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Analysis Summary</h3>
      <p>Protein Name: {name}</p>
      <p>Collapse Score: {score.toFixed(2)}</p>
      <p>Average Entropy: {avgEntropy.toFixed(3)}</p>
      <p>Residues: {residues}</p>
      <button onClick={handleDownloadJSON} className="mt-4 bg-gray-100 px-4 py-2 rounded-md">
        Download JSON
      </button>
      <button onClick={handleDownloadPDF} className="mt-4 bg-gray-100 px-4 py-2 rounded-md">
        Download PDF
      </button>
      <button onClick={onSave} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md">
        Save to Firebase
      </button>
    </div>
  )
}