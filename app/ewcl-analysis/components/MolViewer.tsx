'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'

// Add type definition for 3DMol on window object
declare global {
  interface Window {
    $3Dmol: any;
  }
}

interface MolViewerProps {
  pdbData?: string;
  fileUrl?: string;
  viewerMode?: 'cartoon' | 'surface' | 'ball';
  entropyMap?: Record<string, number>;
  width?: string | number;
  height?: string | number;
}

export default function MolViewer({ 
  pdbData, 
  fileUrl,
  viewerMode = 'cartoon', 
  entropyMap = {},
  width = '100%',
  height = '400px'
}: MolViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<any>(null)
  const scriptLoadedRef = useRef(false)

  // Handle 3DMol script loading
  const handleScriptLoad = () => {
    scriptLoadedRef.current = true
    initViewer()
  }

  // Initialize or update the 3D viewer
  const initViewer = async () => {
    if (!containerRef.current || typeof window === 'undefined' || !window.$3Dmol) return
    
    try {
      // Create viewer if it doesn't exist yet
      if (!viewerRef.current) {
        viewerRef.current = window.$3Dmol.createViewer(containerRef.current, {
          backgroundColor: 'white',
        })
      }
      
      const viewer = viewerRef.current
      
      // Clear any existing molecules
      viewer.clear()
      
      let modelData = pdbData
      
      // If file URL is provided but not pdbData, fetch the data
      if (fileUrl && !pdbData) {
        try {
          const response = await fetch(fileUrl)
          if (!response.ok) throw new Error('Failed to load PDB file')
          modelData = await response.text()
        } catch (error) {
          console.error('Error fetching PDB data:', error)
          return
        }
      }
      
      // Exit if no model data is available
      if (!modelData) return
      
      // Add the model from PDB data
      const model = viewer.addModel(modelData, 'pdb')
      
      // Apply styles based on viewerMode
      if (viewerMode === 'cartoon') {
        viewer.setStyle({}, { cartoon: { colorscheme: 'spectrum' } })
      } else if (viewerMode === 'surface') {
        viewer.setStyle({}, { surface: { opacity: 0.8 } })
      } else if (viewerMode === 'ball') {
        viewer.setStyle({}, { sphere: { scale: 0.3 }, stick: {} })
      }
      
      // Apply entropy coloring if available
      if (Object.keys(entropyMap).length > 0) {
        const colorMap: Record<number, string> = {}
        
        Object.entries(entropyMap).forEach(([residue, entropy]) => {
          const r = Math.floor(255 * entropy)
          const b = Math.floor(255 * (1 - entropy))
          colorMap[parseInt(residue)] = `rgb(${r},0,${b})`
        })
        
        viewer.setStyle({}, {
          cartoon: {
            color: function(atom: any) {
              return colorMap[atom.resi] || 'gray'
            }
          }
        })
      }
      
      // Zoom to fit the molecule and render
      viewer.zoomTo()
      viewer.render()
      
    } catch (error) {
      console.error('Error initializing 3DMol viewer:', error)
    }
  }
  
  // Effect to initialize/update viewer when props change
  useEffect(() => {
    if (scriptLoadedRef.current) {
      initViewer()
    }
  }, [pdbData, fileUrl, viewerMode, entropyMap])
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (viewerRef.current) {
        try {
          viewerRef.current.clear()
        } catch (e) {
          console.error('Error clearing 3DMol viewer:', e)
        }
      }
    }
  }, [])

  return (
    <>
      {/* Load 3DMol.js scripts */}
      <Script 
        src="https://3Dmol.org/build/3Dmol-min.js" 
        strategy="beforeInteractive"
        onLoad={handleScriptLoad}
      />
      <Script 
        src="https://3Dmol.org/build/3Dmol.ui-min.js" 
        strategy="beforeInteractive"
      />
      
      {/* Viewer container */}
      <div 
        ref={containerRef}
        id="viewer_container"
        style={{ width, height }}
        className="relative border border-gray-200 rounded-lg"
      >
        {!pdbData && !fileUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <p className="text-gray-500">Upload a protein file to view</p>
          </div>
        )}
      </div>
    </>
  )
}