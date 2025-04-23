'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

interface MolViewerProps {
  file: File | null;
  colorMapping?: Record<number, string>;
}

// Register Chart.js components globally
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function MolViewer({ file, colorMapping = {} }: MolViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null)
  const viewerInstanceRef = useRef<any>(null)
  const [is3DmolLoaded, setIs3DmolLoaded] = useState(false)

  // Initialize 3DMol only on client side
  useEffect(() => {
    console.log('MolViewer initialized', !!viewerRef.current);
    
    if (!viewerRef.current || typeof window === 'undefined') return;
    
    // Dynamic import - only runs in browser
    import('3dmol').then(($3Dmol) => {
      try {
        // Initialize 3Dmol viewer
        viewerInstanceRef.current = $3Dmol.createViewer(viewerRef.current, {
          backgroundColor: 'white',
          antialias: true,
        });
        setIs3DmolLoaded(true);
        console.log('3DMol viewer created successfully');
      } catch (err) {
        console.error('Error initializing 3DMol viewer:', err);
      }
    }).catch(err => {
      console.error('Failed to load 3DMol library:', err);
    });

    // Clean up on unmount
    return () => {
      if (viewerInstanceRef.current) {
        // No explicit dispose method in 3Dmol, but we can remove the canvas
        while (viewerRef.current?.firstChild) {
          viewerRef.current.removeChild(viewerRef.current.firstChild)
        }
        viewerInstanceRef.current = null
      }
    }
  }, [])

  // Load and display molecule when file changes
  useEffect(() => {
    if (!file || !viewerInstanceRef.current || !is3DmolLoaded) return;

    const viewer = viewerInstanceRef.current;
    viewer.clear();

    // Read file contents
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      // Determine file format
      const format = file.name.toLowerCase().endsWith('.pdb') ? 'pdb' : 'json';
      
      // Add model to viewer
      const model = viewer.addModel(content, format);
      
      // Apply colors if provided
      if (Object.keys(colorMapping).length > 0) {
        model.setStyle({}, {cartoon: {color: 'white'}});
        
        // Apply color mapping to specific residues
        Object.entries(colorMapping).forEach(([residueNumber, color]) => {
          model.setStyle({resi: Number(residueNumber)}, {cartoon: {color: color}});
        });
      } else {
        // Default style
        model.setStyle({}, {cartoon: {color: 'spectrum'}});
      }
      
      viewer.zoomTo();
      viewer.render();
    };
    
    reader.readAsText(file);
  }, [file, colorMapping, is3DmolLoaded]);

  return (
    <div className="relative w-full h-[500px] rounded-md overflow-hidden border border-gray-200">
      <div
        ref={viewerRef}
        className="absolute inset-0"
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Empty state */}
      {!file && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
          <svg className="w-16 h-16 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
          </svg>
          <p className="text-gray-500 font-medium">Upload a protein structure to visualize</p>
          <p className="text-gray-400 text-sm">Supported formats: PDB, JSON</p>
        </div>
      )}
      
      {/* Controls overlay */}
      {file && is3DmolLoaded && (
        <div className="absolute bottom-2 right-2 bg-white bg-opacity-75 rounded-md p-2 text-xs text-gray-600 shadow-sm">
          <div className="mb-1"><span className="font-medium">Left-click + drag:</span> Rotate</div>
          <div className="mb-1"><span className="font-medium">Scroll:</span> Zoom</div>
          <div><span className="font-medium">Right-click + drag:</span> Translate</div>
        </div>
      )}
    </div>
  )
}

export function ChartConfig({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}