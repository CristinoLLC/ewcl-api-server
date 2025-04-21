'use client'

import React, { useEffect, useRef, useState } from 'react'

interface MolViewerProps {
  file: File | null
  entropyMap?: Record<string, number>
}

export default function MolViewer({ file, entropyMap = {} }: MolViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [proteinName, setProteinName] = useState<string | null>(null)
  const [entropyScore, setEntropyScore] = useState<number | null>(null)
  const [residueCount, setResidueCount] = useState<number | null>(null)
  const [maxEntropy, setMaxEntropy] = useState<number | null>(null)
  const [minEntropy, setMinEntropy] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!file || !viewerRef.current) return

    const load3DMol = async () => {
      const { default: $3Dmol } = await import('3dmol')

      const viewer = $3Dmol.createViewer(viewerRef.current, {
        backgroundColor: 'white',
      })

      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        const format = file.name.endsWith('.pdb') ? 'pdb' : 'json'
        const model = viewer.addModel(content, format)

        // Apply default style
        model.setStyle({}, { cartoon: { color: 'spectrum' } })

        // Apply entropy-based coloring
        if (Object.keys(entropyMap).length > 0) {
          Object.entries(entropyMap).forEach(([residue, entropy]) => {
            const color = `rgb(${Math.round(255 * entropy)}, 0, ${Math.round(255 * (1 - entropy))})`
            model.setStyle({ resi: Number(residue) }, { cartoon: { color } })
          })
        }

        viewer.zoomTo()
        viewer.render()
      }

      reader.readAsText(file)
    }

    load3DMol()
  }, [file, entropyMap])

  const handleUpload = async (url: string, uploadedFile: File) => {
    setFileUrl(url)
    setFile(uploadedFile)
    setLoading(true)

    try {
      const res = await fetch('https://ewcl-infer.onrender.com/api/ewcl-infer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileUrl: url }),
      })

      if (!res.ok) {
        throw new Error('Failed to fetch analysis data')
      }

      const result = await res.json()

      setProteinName(result.name || uploadedFile.name.split('.')[0])
      setEntropyMap(result.entropy)
      setEntropyScore(result.entropyScore)
      setResidueCount(Object.keys(result.entropy).length)
      setMaxEntropy(Math.max(...Object.values(result.entropy)))
      setMinEntropy(Math.min(...Object.values(result.entropy)))
    } catch (error) {
      console.error('Error running EWCL analysis:', error)
      alert('Failed to run EWCL analysis. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return <div ref={viewerRef} className="w-full h-[500px] border border-gray-200" />
}