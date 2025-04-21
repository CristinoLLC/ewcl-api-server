import { EWCLPlugin } from '@/types/EWCLPlugin'
import { useEffect, useRef } from 'react'

export interface HeatmapOutput {
  // whatever shape your plugin’s run() returns
  canvasData: string
}

const EntropyHeatmap: EWCLPlugin<Record<string, number>, HeatmapOutput> = {
  id: 'entropy-heatmap',
  name: 'Entropy Heatmap',
  description: 'Visualize entropy as a color gradient heatmap',

  run: (entropyMap) => {
    // produce a HeatmapOutput from entropyMap
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    // ... draw gradient on ctx using entropyMap ...
    return { canvasData: canvas.toDataURL() }
  },

  render: (output) => {
    return (
      <div className="w-full">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Entropy Heatmap</h3>
        <img src={output.canvasData} alt="entropy heatmap" className="w-full rounded border border-gray-200" />
        <p className="text-xs text-gray-500 mt-1 text-center">
          Residue entropy from ordered (blue) to disordered (red)
        </p>
      </div>
    )
  }
}

export default EntropyHeatmap