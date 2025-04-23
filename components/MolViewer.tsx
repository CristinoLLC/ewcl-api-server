'use client'

import React, { useEffect, useRef, useState } from 'react'

interface MolViewerProps {
  pdbUrl: string
  entropyMap: Record<string, number>
  proteinName: string
  highlightedResidue?: string | null
}

export default function MolViewer({
  pdbUrl,
  entropyMap,
  proteinName,
  highlightedResidue
}: MolViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewerInstance, setViewerInstance] = useState<any>(null)
  const $3Dmol = useRef<any>(null)

  // Initialize 3Dmol library dynamically
  useEffect(() => {
    import('3dmol').then(mol => {
      $3Dmol.current = mol
      if (viewerRef.current && !$3Dmol.current.viewer) {
        try {
          const viewer = $3Dmol.current.createViewer(viewerRef.current, {
            backgroundColor: 'white',
            antialias: true,
            id: 'molViewerInstance',
            highResolution: true
          })
          setViewerInstance(viewer)
          setError(null)
        } catch (err) {
          console.error('Failed to initialize 3Dmol viewer:', err)
          setError('Failed to initialize 3D viewer.')
        }
      }
    }).catch(err => {
      console.error('Failed to load 3Dmol library:', err)
      setError('Failed to load 3D viewer library.')
    })

    return () => {
      if (viewerInstance) {
        try {
          viewerInstance.clear()
        } catch (e) {
          console.warn('Error cleaning up viewer:', e)
        }
        setViewerInstance(null)
      }
      if (viewerRef.current) {
        viewerRef.current.innerHTML = ''
      }
    }
  }, [])

  // Load PDB model when URL changes or viewer/library is ready
  useEffect(() => {
    if (!$3Dmol.current || !viewerInstance || !pdbUrl) return

    let isMounted = true
    setLoading(true)
    setError(null)

    const loadModel = async () => {
      try {
        viewerInstance.removeAllModels()

        console.log('MolViewer: Fetching PDB from URL:', pdbUrl)

        const urlToFetch = pdbUrl.startsWith('http')
          ? `/api/proxy?url=${encodeURIComponent(pdbUrl)}`
          : pdbUrl

        console.log('MolViewer: Using fetch URL:', urlToFetch)

        const response = await fetch(urlToFetch, { cache: 'no-store' })

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`MolViewer: Failed to fetch PDB via proxy/direct: ${response.status}`, errorText)
          throw new Error(`Failed to fetch PDB file (${response.status})`)
        }

        const pdbData = await response.text()

        if (!isMounted) return

        // --- DEBUG LOG ---
        console.log("MolViewer: Data being passed to addModel:", pdbData.substring(0, 500) + "..."); // Log first 500 chars
        // --- END DEBUG LOG ---

        viewerInstance.addModel(pdbData, 'pdb', { keepH: true })
        // Apply the coloring *after* adding the model
        applyEntropyColoring(viewerInstance, entropyMap, highlightedResidue)
        viewerInstance.zoomTo()
        viewerInstance.render()

        if (isMounted) setLoading(false)
      } catch (err: any) {
        console.error('MolViewer: Error loading PDB model:', err)
        if (isMounted) {
          setError(`Failed to load structure: ${err.message}. Check PDB URL and proxy.`)
          setLoading(false)
        }
      }
    }

    loadModel()

    return () => {
      isMounted = false
    }
  // Ensure entropyMap is in the dependency array so coloring updates if it changes
  }, [pdbUrl, viewerInstance, entropyMap, highlightedResidue])

  // --- MODIFIED applyEntropyColoring function with LOGS ---
  const applyEntropyColoring = (viewer: any, currentEntropyMap: Record<string, number>, highlightResidueId?: string | null) => {
    if (!viewer || !$3Dmol.current) {
      console.log('ApplyColoring: Viewer or 3Dmol library not ready.'); // Log 1
      return;
    }

    // Log 2: Check the entropy map received by the function
    console.log('ApplyColoring: Received entropyMap:', currentEntropyMap);
    if (!currentEntropyMap || Object.keys(currentEntropyMap).length === 0) {
      console.log('ApplyColoring: Entropy map is empty. No custom colors will be applied.');
      // Still apply default style and render
      viewer.setStyle({}, { cartoon: { colorscheme: 'whiteCarbon' } });
      viewer.removeAllSurfaces();
      viewer.render();
      return;
    }

    try {
      console.log('ApplyColoring: Applying default style...'); // Log 3
      viewer.setStyle({}, { cartoon: { colorscheme: 'whiteCarbon' } });
      viewer.removeAllSurfaces();

      console.log('ApplyColoring: Iterating through entropy map entries...'); // Log 4
      let colorsAppliedCount = 0; // Counter for debugging

      Object.entries(currentEntropyMap).forEach(([residueId, score]) => {
        const resi = parseInt(residueId, 10);
        if (isNaN(resi)) {
          // Log 5: Skip invalid residue IDs
          // console.log(`ApplyColoring: Skipping invalid residueId: ${residueId}`);
          return;
        }

        let color: string;
        if (score < 0.4) {
          color = '0x00C800'; // Green
        } else if (score < 0.7) {
          color = '0xFFA500'; // Orange
        } else {
          color = '0xFF0000'; // Red
        }

        // Log 6: Log the residue and color being applied
        // console.log(`ApplyColoring: Setting residue ${resi} to color ${color} (score: ${score})`);
        viewer.setStyle({ resi: resi }, { cartoon: { color: color } });
        colorsAppliedCount++;
      });

      // Log 7: Report how many colors were attempted
      console.log(`ApplyColoring: Attempted to apply color to ${colorsAppliedCount} residues.`);

      // Apply highlighting (code remains the same)
      if (highlightResidueId) {
        const resi = parseInt(highlightResidueId, 10);
        if (!isNaN(resi)) {
          console.log(`ApplyColoring: Highlighting residue ${resi}`); // Log 8
          viewer.setStyle({ resi: resi }, {
            cartoon: { color: '0x3366ff' },
            stick: { radius: 0.2, colorscheme: 'whiteCarbon', color: '0x3366ff' }
          });
          viewer.addSurface($3Dmol.current.SurfaceType.VDW, {
            opacity: 0.7,
            color: '0x3366ff'
          }, { resi: resi });
          // viewer.zoomTo({ resi: resi });
        } else {
           console.log(`ApplyColoring: Invalid highlightResidueId: ${highlightResidueId}`); // Log 9
        }
      }

      console.log('ApplyColoring: Rendering changes...'); // Log 10
      viewer.render();
    } catch (err) {
      console.error('Error applying entropy coloring:', err); // Log 11
    }
  };
  // --- END OF MODIFIED FUNCTION ---

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700">
          {proteinName || 'Protein Structure'}
        </h3>
        {loading && (
          <span className="inline-flex items-center text-xs text-blue-600">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </span>
        )}
      </div>

      {error && (
        <div className="bg-red-50 p-3 rounded-md mb-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div
        ref={viewerRef}
        className="w-full h-full rounded-md border border-gray-200 flex-grow relative"
        style={{ minHeight: '500px' }}
      />

      {/* --- UPDATED LEGEND --- */}
      <div className="flex justify-center mt-2 text-xs space-x-4">
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: '#00C800' }}></span>
          <span>Low Risk (&lt;0.4)</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: '#FFA500' }}></span>
          <span>Medium Risk (0.4-0.7)</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: '#FF0000' }}></span>
          <span>High Risk (&gt;0.7)</span>
        </div>
        {highlightedResidue && (
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: '#3366FF' }}></span>
            <span>Selected (#{highlightedResidue})</span>
          </div>
        )}
      </div>
      {/* --- END OF UPDATED LEGEND --- */}
    </div>
  )
}