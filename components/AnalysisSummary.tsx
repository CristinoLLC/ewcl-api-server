'use client'

import React, { useState } from 'react'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'

interface AnalysisSummaryProps {
  name: string;
  score: number;
  avgEntropy: number;
  maxEntropy: number;
  minEntropy: number;
  residues: number;
  onSave: () => void;
  entropyMap: Record<string, number>;
}

export default function AnalysisSummary({
  name,
  score,
  avgEntropy,
  maxEntropy,
  minEntropy,
  residues,
  onSave,
  entropyMap
}: AnalysisSummaryProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleExportCSV = () => {
    const csvRows = [
      ['Residue', 'Entropy', 'Classification'],
      ...Object.entries(entropyMap).map(([residue, entropy]) => {
        const classification =
          entropy < 0.25 ? 'Ordered' : entropy < 0.6 ? 'Transitional' : 'Disordered';
        return [residue, entropy.toFixed(3), classification];
      }),
    ];
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name}_entropy_data.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const data = {
      name,
      collapseScore: score,
      avgEntropy,
      maxEntropy,
      minEntropy,
      residues,
      entropyMap,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name}_analysis.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF()

    doc.setFontSize(16)
    doc.text('EWCL Analysis Report', 10, 10)
    doc.setFontSize(12)
    doc.text(`Protein Name: ${name}`, 10, 20)
    doc.text(`Collapse Score: ${score.toFixed(2)}`, 10, 30)
    doc.text(`Average Entropy: ${avgEntropy.toFixed(3)}`, 10, 40)
    doc.text(`Residues: ${residues}`, 10, 50)

    // Add a snapshot of the 3D structure viewer
    const viewerCanvas = document.querySelector('#viewer canvas') as HTMLCanvasElement
    if (viewerCanvas) {
      const imgData = viewerCanvas.toDataURL('image/png')
      doc.addImage(imgData, 'PNG', 10, 60, 180, 100)
    }

    doc.save(`${name}_analysis_report.pdf`)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Analysis Summary</h3>
      <p className="text-gray-600 mb-2">
        <strong>Protein Name:</strong> {name}
      </p>
      <div className="mb-4">
        <p className="text-gray-600 flex items-center">
          <strong>Collapse Score:</strong> {score.toFixed(2)}
          <span 
            className="ml-2 text-sm text-gray-500 cursor-pointer relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            ℹ️
            {showTooltip && (
              <span className="absolute bg-gray-800 text-white text-xs rounded p-2 -mt-20 ml-2 w-64 z-10">
                Collapse likelihood indicates the probability of a protein adopting a stable
                conformation based on entropy. Higher values suggest greater disorder.
              </span>
            )}
          </span>
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
          <div
            className="bg-gradient-to-r from-green-300 via-yellow-300 to-red-300 h-2.5 rounded-full"
            style={{ width: `${score * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {score < 0.3 ? 'Ordered' : score < 0.5 ? 'Partially Disordered' : 'Highly Disordered'}
        </p>
      </div>
      <p className="text-gray-600 mb-2">
        <strong>Residues:</strong> {residues}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>Avg. Entropy:</strong> {avgEntropy}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>Min Entropy:</strong> {minEntropy.toFixed(3)}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>Max Entropy:</strong> {maxEntropy.toFixed(3)}
      </p>
      
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Tools & Export</h4>
        <button
          onClick={handleExportJSON}
          className="block w-full bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 mb-2"
        >
          Download Analysis (JSON)
        </button>
        <button
          onClick={handleExportCSV}
          className="block w-full bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 mb-2"
        >
          Export Entropy Data (CSV)
        </button>
        <button
          onClick={handleDownloadPDF}
          className="block w-full bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 mb-2"
        >
          Download PDF Report
        </button>
        <button
          onClick={onSave}
          className="block w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mt-4"
        >
          Save Analysis to Firebase
        </button>
      </div>
    </div>
  )
}