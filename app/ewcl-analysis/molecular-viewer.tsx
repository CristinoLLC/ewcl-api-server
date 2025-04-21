'use client'

import React from 'react'
import EntropyHeatmap, { HeatmapOutput } from '@/plugins/visualization/EntropyHeatmap'

interface MolecularViewerProps {
  entropyMap: Record<string, number>
}

export default function MolecularViewer({ entropyMap }: MolecularViewerProps) {
  // run the plugin
  const heatmapOutput: HeatmapOutput = EntropyHeatmap.run(entropyMap)

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Protein Analysis</h2>
      {EntropyHeatmap.render(heatmapOutput)}
    </div>
  )
}