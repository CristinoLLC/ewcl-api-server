"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

interface EntropyStats {
  average: number
  max: number
  min: number
  totalResidues: number
}

interface EntropySummaryCardProps {
  stats: EntropyStats | null
  isLoading?: boolean
  proteinName?: string | null
}

export function EntropySummaryCard({ stats, isLoading = false, proteinName = null }: EntropySummaryCardProps) {
  const handleDownloadPDF = async () => {
    if (!stats || !proteinName) return

    try {
      // Create new PDF document
      const doc = new jsPDF()
      
      // Add title
      doc.setFontSize(20)
      doc.text("EWCL Analysis Report", 20, 20)
      
      // Add protein name
      doc.setFontSize(14)
      doc.text(`Protein: ${proteinName}`, 20, 30)
      
      // Add analysis summary
      doc.setFontSize(12)
      doc.text("Analysis Summary", 20, 40)
      doc.text(`Average Entropy: ${stats.average.toFixed(3)}`, 20, 50)
      doc.text(`Max Entropy: ${stats.max.toFixed(3)}`, 20, 60)
      doc.text(`Min Entropy: ${stats.min.toFixed(3)}`, 20, 70)
      doc.text(`Total Residues: ${stats.totalResidues}`, 20, 80)
      
      // Capture 3D viewer
      const viewer = document.querySelector("#viewer canvas")
      if (viewer) {
        const canvas = await html2canvas(viewer as HTMLElement)
        const imgData = canvas.toDataURL("image/png")
        doc.addImage(imgData, "PNG", 20, 90, 170, 170)
      }
      
      // Save PDF
      doc.save(`${proteinName}_analysis_report.pdf`)
    } catch (error) {
      console.error("Failed to generate PDF:", error)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-slate-900">Analysis Summary</CardTitle>
          {stats && proteinName && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPDF}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
          </div>
        ) : stats ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Average Entropy</p>
              <p className="mt-1 font-mono text-lg text-slate-900">
                {stats.average.toFixed(3)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Residues</p>
              <p className="mt-1 font-mono text-lg text-slate-900">
                {stats.totalResidues}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Max Entropy</p>
              <p className="mt-1 font-mono text-lg text-slate-900">
                {stats.max.toFixed(3)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Min Entropy</p>
              <p className="mt-1 font-mono text-lg text-slate-900">
                {stats.min.toFixed(3)}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            Upload a protein structure to view entropy analysis
          </p>
        )}
      </CardContent>
    </Card>
  )
} 