'use client'

import { runRealEwcl, EwclResponse, getErrorMessage } from "@/utils/api"
import { useState } from "react"
import { toast } from 'react-toastify'

interface RunEwclButtonProps {
  pdbPath: string
  onResult?: (result: EwclResponse) => void
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export default function RunEwclButton({ 
  pdbPath, 
  onResult, 
  onClick,
  disabled = false,
  className = '' 
}: RunEwclButtonProps) {
  const [result, setResult] = useState<EwclResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [collapsePrediction, setCollapsePrediction] = useState<string | null>(null)

  const handleRun = async () => {
    try {
      setIsLoading(true)
      onClick?.()
      const response = await runRealEwcl(pdbPath)
      setResult(response)
      onResult?.(response)
      
      // Extract and set the collapse prediction if available
      if (response.prediction) {
        setCollapsePrediction(response.prediction)
        toast.success(`Collapse prediction: ${response.prediction}`)
      } else {
        toast.success('EWCL analysis completed successfully')
      }
    } catch (error) {
      console.error('EWCL analysis failed:', error)
      toast.error(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <button
        onClick={handleRun}
        disabled={isLoading || disabled}
        className={`
          inline-flex items-center justify-center
          px-4 py-2 rounded-md
          font-medium text-sm
          transition-colors duration-200
          ${(isLoading || disabled)
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
          }
          text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        `}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Running EWCL...
          </>
        ) : (
          'Run EWCL AI'
        )}
      </button>

      {collapsePrediction && (
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">Collapse Prediction</h3>
          </div>
          <div className="p-4 bg-white">
            <p className="text-sm text-gray-700">{collapsePrediction}</p>
          </div>
        </div>
      )}

      {result && (
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">Analysis Results</h3>
          </div>
          <div className="p-4 bg-white">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
          {result.metadata && (
            <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Runtime: {result.metadata.runtime.toFixed(2)}s | 
                Model: {result.metadata.model_version} | 
                Time: {new Date(result.metadata.timestamp).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 