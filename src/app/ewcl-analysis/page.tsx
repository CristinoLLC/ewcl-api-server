"use client"

import { useState } from "react"
import { toast } from "sonner"
import { MolstarViewer } from "@/components/MolstarViewer"
import { UploadDropzone } from "@/components/UploadDropzone"
import { EntropySummaryCard } from "@/components/EntropySummaryCard"

interface EntropyStats {
  average: number
  max: number
  min: number
  totalResidues: number
}

interface AnalysisResult {
  name: string
  entropyScore: number
  entropy: Record<string, number>
}

export default function EWCLAnalysisPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [structureUrl, setStructureUrl] = useState<string | null>(null)
  const [entropyStats, setEntropyStats] = useState<EntropyStats | null>(null)
  const [entropyMap, setEntropyMap] = useState<Record<string, number> | null>(null)
  const [proteinName, setProteinName] = useState<string | null>(null)

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true)
      
      // Create a temporary URL for the file
      const fileUrl = URL.createObjectURL(file)
      setStructureUrl(fileUrl)
      
      setIsUploading(false)
      setIsAnalyzing(true)
      
      // Call the EWCL analysis endpoint
      const response = await fetch("https://ewcl-infer.onrender.com/api/ewcl-infer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileUrl }),
      })

      if (!response.ok) {
        throw new Error("Analysis failed")
      }

      const result: AnalysisResult = await response.json()
      
      // Update state with analysis results
      setProteinName(result.name)
      setEntropyMap(result.entropy)
      
      // Calculate statistics from entropy map
      const values = Object.values(result.entropy)
      const stats: EntropyStats = {
        average: values.reduce((a, b) => a + b, 0) / values.length,
        max: Math.max(...values),
        min: Math.min(...values),
        totalResidues: values.length,
      }
      setEntropyStats(stats)
      
      setIsAnalyzing(false)
      toast.success("Analysis complete!")
    } catch (error) {
      console.error("Analysis failed:", error)
      toast.error("Failed to analyze protein structure")
      setIsUploading(false)
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">EWCL Analysis</h1>
        <p className="text-gray-600">
          Upload a protein structure to analyze its entropy and predict structural collapse.
        </p>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-8">
          {structureUrl ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <MolstarViewer 
                url={structureUrl} 
                entropyMap={entropyMap || undefined}
              />
            </div>
          ) : (
            <UploadDropzone 
              onFileUpload={handleFileUpload}
              isLoading={isUploading}
            />
          )}
        </div>
        <div>
          <EntropySummaryCard 
            stats={entropyStats}
            isLoading={isAnalyzing}
            proteinName={proteinName}
          />
        </div>
      </div>
    </div>
  )
} 