'use client'

import { useEffect, useRef } from 'react'
// @ts-ignore - 3Dmol might not have TypeScript types
import * as $3Dmol from '3dmol'

interface ThreeDMolViewerProps {
  fileUrl: string
  entropyMap?: Record<string, number>
  viewerMode?: 'cartoon' | 'surface' | 'stick'
  selectedChain?: string
}

export default function ThreeDMolViewer({
  fileUrl,
  entropyMap,
  viewerMode = 'cartoon',
  selectedChain = 'A'
}: ThreeDMolViewerProps) {
  const viewerRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    // Safety check to avoid errors
    if (!fileUrl || !containerRef.current) return
    
    const config = { backgroundColor: 'white' }
    let viewer: any = null
    
    // Initialize the viewer
    try {
      // Try to use the glviewer if already exists
      if (viewerRef.current) {
        viewer = viewerRef.current
        viewer.clear()
      } else {
        viewer = $3Dmol.createViewer(containerRef.current, config)
        viewerRef.current = viewer
      }
      
      // Add a loading indicator
      const loadingEl = document.createElement('div')
      loadingEl.className = 'absolute inset-0 flex items-center justify-center bg-white bg-opacity-70'
      loadingEl.innerHTML = '<div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>'
      loadingEl.id = 'mol-loading'
      containerRef.current.appendChild(loadingEl)
      
      // Fetch and load the PDB file
      fetch(fileUrl)
        .then(response => {
          if (!response.ok) throw new Error('Failed to fetch protein file')
          return response.text()
        })
        .then(data => {
          // Remove loading indicator
          const loadingIndicator = document.getElementById('mol-loading')
          if (loadingIndicator) loadingIndicator.remove()
          
          // Add the model
          viewer.addModel(data, 'pdb')
          
          // Set style based on viewerMode
          if (viewerMode === 'cartoon') {
            viewer.setStyle({}, { cartoon: { color: 'spectrum' } })
          } else if (viewerMode === 'surface') {
            viewer.setStyle({}, { surface: { opacity: 0.8 } })
          } else if (viewerMode === 'stick') {
            viewer.setStyle({}, { stick: {} })
          }
          
          // If we have entropy data, color the structure accordingly
          if (entropyMap && Object.keys(entropyMap).length > 0) {
            viewer.setStyle({}, {
              cartoon: {
                colorscheme: {
                  prop: 'resi',
                  map: Object.entries(entropyMap).reduce((acc, [residue, entropy]) => {
                    // Convert entropy (0-1) to RGB: Blue (ordered) to Red (disordered)
                    const r = Math.floor(255 * entropy)
                    const b = Math.floor(255 * (1 - entropy))
                    acc[residue] = `rgb(${r}, 0, ${b})`
                    return acc
                  }, {} as Record<string, string>)
                }
              }
            })
          }
          
          // Center and zoom
          viewer.zoomTo()
          
          // Render the scene
          viewer.render()
        })
        .catch(error => {
          console.error('Error loading protein structure:', error)
          
          // Remove loading indicator and show error
          const loadingIndicator = document.getElementById('mol-loading')
          if (loadingIndicator) {
            loadingIndicator.innerHTML = `
              <div class="p-4 text-center">
                <p class="text-red-500 mb-2">Error loading protein structure</p>
                <p class="text-sm text-gray-500">${error.message}</p>
              </div>
            `
          }
        })
    } catch (err) {
      console.error('Failed to initialize 3DMol viewer:', err)
    }
    
    // Cleanup
    return () => {
      if (viewer) {
        viewer.clear()
      }
    }
  }, [fileUrl, entropyMap, viewerMode, selectedChain])
  
  return <div ref={containerRef} className="w-full h-full relative" />
}