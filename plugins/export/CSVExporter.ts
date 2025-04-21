import { EWCLPlugin } from '@/types/EWCLPlugin'
import { useState } from 'react'

const ExportCSV: EWCLPlugin = {
  id: 'csv-exporter',
  name: 'CSV Exporter',
  description: 'Export entropy data as CSV file',
  run: (entropyMap: Record<string, number>) => {
    // Create CSV content
    let csvContent = 'Residue,Entropy,Classification\n'
    
    Object.entries(entropyMap)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .forEach(([residue, entropy]) => {
        // Classify based on entropy value
        let classification = 'Ordered'
        if (entropy > 0.5) classification = 'Disordered'
        else if (entropy > 0.3) classification = 'Transition'
        
        csvContent += `${residue},${entropy.toFixed(3)},${classification}\n`
      })
      
    return csvContent
  },
  render: (csvContent: string, props?: {filename?: string}) => {
    const [isDownloading, setIsDownloading] = useState(false)
    
    const handleDownload = () => {
      setIsDownloading(true)
      try {
        // Create and download the CSV file
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = props?.filename || 'ewcl_entropy_data.csv'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } catch (error) {
        console.error('Failed to download CSV:', error)
      } finally {
        setIsDownloading(false)
      }
    }
    
    return (
      <button
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md mb-2 flex items-center justify-center"
        onClick={handleDownload}
        disabled={isDownloading}
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        {isDownloading ? 'Downloading...' : 'Export Entropy Data (CSV)'}
      </button>
    )
  }
}

export default ExportCSV