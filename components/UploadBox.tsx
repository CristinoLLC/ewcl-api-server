'use client'

import React, { useRef, useState } from 'react'

interface UploadBoxProps {
  onUpload: (url: string, file: File) => void
  loading: boolean
}

export default function UploadBox({ onUpload, loading }: UploadBoxProps) {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      handleFile(file)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file)
    onUpload(url, file)
  }

  const onButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Upload Protein Structure</h3>
      <div 
        className={`border-2 ${
          dragActive ? 'border-red-500 bg-red-50' : 'border-dashed border-gray-300'
        } rounded-lg p-8 flex flex-col items-center justify-center transition-all`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          accept=".pdb,.json"
          disabled={loading}
        />
        
        <svg 
          className="w-10 h-10 text-red-500 mb-3" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
          />
        </svg>
        
        <p className="mb-4 text-gray-500">
          Upload a .pdb or .json file of a protein structure to analyze
        </p>
        
        <button
          onClick={onButtonClick}
          disabled={loading}
          className="px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Upload Protein File'}
        </button>
        
        <p className="mt-3 text-sm text-gray-500">
          {loading ? 'Analyzing protein structure...' : 'or drag and drop your file here'}
        </p>
      </div>
    </div>
  )
}