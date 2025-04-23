'use client'

import { useState, useRef } from 'react'
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'

interface FileUploaderProps {
  onFileSelected: (file: File) => void;
  isLoading: boolean;
}

export default function FileUploader({ onFileSelected, isLoading }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      onFileSelected(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      onFileSelected(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium mb-4">Upload Protein Structure</h2>
      
      <div 
        className={`border-2 ${dragActive ? 'border-rose-500 bg-rose-50' : 'border-dashed border-gray-300'} 
        rounded-lg p-8 flex flex-col items-center justify-center transition-colors duration-200`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdb,.json"
          className="hidden"
          onChange={handleFileChange}
          disabled={isLoading}
        />
        
        <ArrowUpTrayIcon className="h-12 w-12 text-rose-500 mb-3" />
        
        {fileName ? (
          <p className="mb-4 text-lg font-medium text-gray-700">{fileName}</p>
        ) : (
          <p className="mb-4 text-gray-500">Upload a .pdb or .json file for analysis</p>
        )}
        
        <button
          onClick={handleButtonClick}
          disabled={isLoading}
          className="px-6 py-3 bg-rose-600 text-white font-medium rounded-md hover:bg-rose-700 
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 shadow-md
          transition-colors duration-200 flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
              Upload Protein File
            </>
          )}
        </button>
        
        <p className="mt-3 text-sm text-gray-500">
          {isLoading ? 'Analyzing protein structure...' : 'or drag and drop your file here'}
        </p>
      </div>
    </div>
  );
}