'use client'

import { useEffect, useRef, useState } from 'react'
import '../styles/molstar.css'

interface MolViewerProps {
  fileUrl: string | null
  viewerMode?: 'cartoon' | 'surface' | 'ball'
  selectedChain?: string
  residueEntropyMap?: Record<string, number>
}

export default function SimpleMolViewer(props: MolViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const viewerRef = useRef<any>(null)

  // Initialize Mol* after component has mounted
  useEffect(() => {
    if (!containerRef.current) return
    
    const initViewer = async () => {
      try {
        console.log("Initializing Mol* viewer")
        // Import the entire molstar UI package
        const molstar = await import('molstar/lib/mol-plugin-ui')
        
        // Create the plugin UI context
        const plugin = molstar.createPluginUI(containerRef.current, {
          layoutIsExpanded: false,
          layoutShowControls: true,
          layoutShowRemoteState: false,
          layoutShowSequence: true,
          layoutShowLog: false,
          layoutShowLeftPanel: false
        })
        
        viewerRef.current = plugin
        console.log("Mol* viewer initialized successfully")
        
        // Load structure if URL provided
        if (props.fileUrl) {
          console.log("Loading structure from URL:", props.fileUrl)
          loadStructure(props.fileUrl)
        } else {
          console.log("No file URL provided")
          setIsLoading(false)
        }
      } catch (err) {
        console.error('Failed to initialize Mol* viewer:', err)
        setError(`Failed to initialize viewer: ${err instanceof Error ? err.message : String(err)}`)
        setIsLoading(false)
      }
    }
    
    initViewer()
    
    // Clean up function
    return () => {
      viewerRef.current = null
    }
  }, [])

  // Handle file URL changes
  useEffect(() => {
    if (props.fileUrl && viewerRef.current) {
      console.log("File URL changed:", props.fileUrl)
      loadStructure(props.fileUrl)
    }
  }, [props.fileUrl, props.viewerMode])

  const loadStructure = async (url: string) => {
    if (!viewerRef.current) return
    setIsLoading(true)
    setError(null)
    
    try {
      console.log("Clearing previous structure")
      // Clear any existing structure
      await viewerRef.current.clear()
      
      // Detect file format - handle data URIs and URLs without extensions
      let format = 'pdb' // Default format
      if (url.includes('.pdb')) {
        format = 'pdb'
      } else if (url.includes('.cif') || url.includes('.mmcif')) {
        format = 'mmcif'
      }
      
      console.log(`Loading structure with format: ${format}`)
      
      // Load the structure with error handling for each step
      try {
        console.log("Downloading data...")
        const data = await viewerRef.current.builders.data.download({ url }, { state: { isGhost: false } })
        
        console.log("Parsing trajectory...")
        const trajectory = await viewerRef.current.builders.structure.parseTrajectory(data, format)
        
        console.log("Creating model...")
        const model = await viewerRef.current.builders.structure.createModel(trajectory)
        
        console.log("Creating structure...")
        const structure = await viewerRef.current.builders.structure.createStructure(model)
        
        console.log("Applying representation...")
        // Apply the visual representation based on props.viewerMode
        if (props.viewerMode === 'cartoon') {
          await viewerRef.current.builders.structure.representation.addRepresentation(structure, { 
            type: 'cartoon',
            color: 'chain-id' 
          })
        } else if (props.viewerMode === 'surface') {
          await viewerRef.current.builders.structure.representation.addRepresentation(structure, { 
            type: 'molecular-surface',
            color: 'uniform',
            colorParams: { value: 0xCCCCCC }
          })
        } else if (props.viewerMode === 'ball') {
          await viewerRef.current.builders.structure.representation.addRepresentation(structure, { 
            type: 'ball-and-stick',
            color: 'element-symbol' 
          })
        } else {
          // Default to cartoon
          await viewerRef.current.builders.structure.representation.addRepresentation(structure, { 
            type: 'cartoon',
            color: 'chain-id' 
          })
        }
        
        console.log("Structure loaded successfully")
      } catch (specificErr) {
        console.error("Error in structure loading pipeline:", specificErr)
        throw new Error(`Structure loading failed at ${specificErr.message || 'unknown step'}`)
      }
    } catch (err) {
      console.error("Error loading structure:", err)
      setError(`Error loading protein structure: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="absolute inset-0" />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
            <span className="mt-3 text-gray-700">Loading structure...</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70">
          <div className="p-4 bg-white shadow-md rounded-md max-w-lg">
            <div className="text-red-500 font-medium">Error</div>
            <div className="text-sm mt-2 whitespace-pre-wrap">{error}</div>
          </div>
        </div>
      )}
      
      {!props.fileUrl && !isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500">No protein structure loaded</p>
            <p className="text-sm text-gray-400 mt-1">Upload a PDB file to visualize</p>
          </div>
        </div>
      )}
    </div>
  )
}