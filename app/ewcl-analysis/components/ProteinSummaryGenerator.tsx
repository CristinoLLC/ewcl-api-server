'use client'

import React from 'react'

interface ProteinSummaryGeneratorProps {
  proteinName: string
  collapseScore: number
  residueEntropyMap: Record<string, number>
}

const ProteinSummaryGenerator: React.FC<ProteinSummaryGeneratorProps> = ({
  proteinName,
  collapseScore,
  residueEntropyMap,
}) => {
  const generateSummary = () => {
    // First sentence - about collapse score
    let summary = `This protein has a collapse score of ${collapseScore.toFixed(2)}, indicating `
    
    if (collapseScore < 0.3) {
      summary += 'a highly ordered, globular structure. '
    } else if (collapseScore < 0.5) {
      summary += 'mild disorder with partially structured regions. '
    } else {
      summary += 'significant disorder characteristic of intrinsically disordered proteins. '
    }
    
    // Second sentence - about regions of interest
    const entropyArray = Object.entries(residueEntropyMap)
      .map(([residueIndex, entropy]) => [parseInt(residueIndex), entropy] as [number, number])
      .sort((a, b) => a[0] - b[0])
    
    // Find regions with high entropy (potential disorder)
    const highEntropyRegions = findRegions(entropyArray, 0.6)
    
    if (highEntropyRegions.length > 0) {
      const regionText = formatRegions(highEntropyRegions.slice(0, 2))
      summary += `Region${highEntropyRegions.length > 1 ? 's' : ''} ${regionText} show${highEntropyRegions.length === 1 ? 's' : ''} elevated entropy, suggesting possible intrinsic disorder domains.`
    } else {
      // Find stable regions if no high entropy regions
      const stableRegions = findRegions(entropyArray, 0, 0.2)
      if (stableRegions.length > 0) {
        const regionText = formatRegions(stableRegions.slice(0, 2))
        summary += `Region${stableRegions.length > 1 ? 's' : ''} ${regionText} exhibit${stableRegions.length === 1 ? 's' : ''} very low entropy values, indicating stable structural elements.`
      }
    }
    
    return summary
  }
  
  // Helper function to find contiguous regions meeting a threshold
  const findRegions = (entropyArray: [number, number][], minThreshold = 0.6, maxThreshold = 1.0) => {
    const regions: { start: number, end: number, avgEntropy: number }[] = []
    let currentRegion: { start: number, end: number, sum: number, count: number } | null = null
    
    entropyArray.forEach(([residue, entropy]) => {
      if (entropy >= minThreshold && entropy <= maxThreshold) {
        // Extend or start a new region
        if (!currentRegion) {
          currentRegion = { start: residue, end: residue, sum: entropy, count: 1 }
        } else if (residue === currentRegion.end + 1) {
          currentRegion.end = residue
          currentRegion.sum += entropy
          currentRegion.count += 1
        } else {
          // Save previous region if significant (5+ residues)
          if (currentRegion.count >= 5) {
            regions.push({
              start: currentRegion.start,
              end: currentRegion.end,
              avgEntropy: currentRegion.sum / currentRegion.count
            })
          }
          currentRegion = { start: residue, end: residue, sum: entropy, count: 1 }
        }
      } else if (currentRegion) {
        // End current region if it exists
        if (currentRegion.count >= 5) {
          regions.push({
            start: currentRegion.start,
            end: currentRegion.end,
            avgEntropy: currentRegion.sum / currentRegion.count
          })
        }
        currentRegion = null
      }
    })
    
    // Add final region if there is one
    if (currentRegion && currentRegion.count >= 5) {
      regions.push({
        start: currentRegion.start,
        end: currentRegion.end,
        avgEntropy: currentRegion.sum / currentRegion.count
      })
    }
    
    return regions.sort((a, b) => (b.end - b.start) - (a.end - a.start))
  }
  
  // Format regions as string like "10-25, 40-52"
  const formatRegions = (regions: { start: number, end: number }[]) => {
    return regions.map(region => `${region.start}–${region.end}`).join(', ')
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Protein Summary</h3>
      <p className="text-gray-800">{generateSummary()}</p>
    </div>
  )
}

export default ProteinSummaryGenerator