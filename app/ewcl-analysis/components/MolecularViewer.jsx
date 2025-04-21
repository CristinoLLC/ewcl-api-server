'use client'

import React, { useEffect, useRef } from 'react';
import * as $3Dmol from '3dmol';

const MolecularViewer = ({ fileUrl, entropyMap, viewerOptions }) => {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initialize viewer
    const viewer = $3Dmol.createViewer(containerRef.current, {
      backgroundColor: "white",
    });
    viewerRef.current = viewer;
    
    return () => {
      if (viewerRef.current) {
        // Clean up resources
        viewerRef.current = null;
      }
    };
  }, []);
  
  // Load structure when fileUrl changes
  useEffect(() => {
    if (!viewerRef.current || !fileUrl) return;
    
    const viewer = viewerRef.current;
    viewer.clear();
    
    fetch(fileUrl)
      .then(response => response.text())
      .then(data => {
        viewer.addModel(data, "pdb");
        updateVisualizations();
      })
      .catch(error => {
        console.error("Error loading structure:", error);
      });
  }, [fileUrl]);
  
  // Update visualizations when options change
  useEffect(() => {
    updateVisualizations();
  }, [viewerOptions]);
  
  const updateVisualizations = () => {
    if (!viewerRef.current) return;
    
    const viewer = viewerRef.current;
    viewer.removeAllShapes();
    viewer.setStyle({}, {});
    
    if (viewerOptions.cartoon) {
      viewer.setStyle({}, { cartoon: { color: 'spectrum' } });
    }
    
    if (viewerOptions.surface) {
      viewer.addSurface($3Dmol.SurfaceType.MS, {
        opacity: 0.7,
        colorscheme: 'whiteCarbon'
      });
    }
    
    if (viewerOptions.ballsAndSticks) {
      viewer.setStyle({}, { stick: {} });
    }
    
    viewer.zoomTo();
    viewer.render();
  };
  
  return (
    <div 
      ref={containerRef} 
      style={{ width: '100%', height: '100%', position: 'relative' }}
    >
      {!fileUrl && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
          <p>Upload a structure file to visualize</p>
        </div>
      )}
    </div>
  );
};

export default MolecularViewer;