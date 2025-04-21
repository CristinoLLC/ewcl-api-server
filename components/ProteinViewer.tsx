'use client';

import React, { useEffect } from 'react';

interface ProteinViewerProps {
  pdbBlob: File;
  collapseMap: number[];
  threshold: number;
}

export default function ProteinViewer({ pdbBlob, collapseMap, threshold }: ProteinViewerProps) {
  useEffect(() => {
    const loadNGL = async () => {
      const NGL = await import('ngl');
      const stage = new NGL.Stage('ngl-viewer');

      const blobUrl = URL.createObjectURL(pdbBlob);
      stage.loadFile(blobUrl, { ext: 'pdb' }).then((component) => {
        component.addRepresentation('cartoon', { color: 'spectrum' });
        component.autoView();
      });

      return () => {
        stage.dispose();
      };
    };

    loadNGL();
  }, [pdbBlob]);

  return <div id="ngl-viewer" className="w-full h-[500px] border border-gray-200" />;
}