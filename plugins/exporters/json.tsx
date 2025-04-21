'use client'

import { useState } from 'react';
import { EWCLPlugin } from '../registry';

export const jsonExporter: EWCLPlugin = {
  id: 'json-exporter',
  name: 'JSON Exporter',
  description: 'Export full analysis data as JSON file',
  
  run: <string>(entropyMap: Record<string, number>, options?: { 
    proteinName: string, 
    collapseScore: number,
    avgEntropy: number,
    minEntropy: number,
    maxEntropy: number
  }): string => {
    // Create analysis data object
    const analysisData = {
      name: options?.proteinName || 'Unknown Protein',
      collapseScore: options?.collapseScore || 0,
      avgEntropy: options?.avgEntropy || 0,
      minEntropy: options?.minEntropy || 0,
      maxEntropy: options?.maxEntropy || 0,
      residueCount: Object.keys(entropyMap).length,
      entropy: entropyMap,
      exportedAt: new Date().toISOString()
    };
    
    return JSON.stringify(analysisData, null, 2);
  },
  
  render: (jsonContent: string, props?: {filename?: string}) => {
    const [isDownloading, setIsDownloading] = useState(false);
    
    const handleDownload = () => {
      setIsDownloading(true);
      try {
        // Create and download the JSON file
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = props?.filename || 'ewcl_analysis.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Failed to download JSON:', error);
      } finally {
        setIsDownloading(false);
      }
    };
    
    return (
      <button
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md mb-2 flex items-center justify-center"
        onClick={handleDownload}
        disabled={isDownloading}
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        {isDownloading ? 'Downloading...' : 'Download Analysis (JSON)'}
      </button>
    );
  }
};