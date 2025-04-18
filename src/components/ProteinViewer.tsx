'use client'

import React, { useEffect, useRef } from 'react'
import { PluginContextContainer, PluginConfig } from 'molstar/lib/mol-plugin/context'
import { DefaultPluginUISpec } from 'molstar/lib/mol-plugin-ui/spec'

interface ProteinViewerProps {
  proteinData: any
}

export function ProteinViewer({ proteinData }: ProteinViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function init() {
      if (!viewerRef.current || !proteinData) return

      try {
        const { createPluginUI } = await import('molstar/lib/mol-plugin-ui')
        const plugin = await createPluginUI(
          viewerRef.current,
          DefaultPluginUISpec(),
          new PluginConfig()
        )

        // Handle different types of protein data
        if (typeof proteinData === 'string') {
          // If it's a URL
          await plugin.loadStructureFromUrl(proteinData, 'pdb')
        } else if (proteinData instanceof File) {
          // If it's a File object
          const fileContent = await proteinData.text()
          await plugin.loadStructureFromData(fileContent, 'pdb')
        } else if (proteinData.data) {
          // If it's already parsed data
          await plugin.loadStructureFromData(proteinData.data, 'pdb')
        }

        return () => {
          plugin.dispose()
        }
      } catch (error) {
        console.error('Error initializing Mol* viewer:', error)
      }
    }

    init()
  }, [proteinData])

  return (
    <div className="w-full h-[600px] bg-white rounded-lg shadow">
      <div ref={viewerRef} className="w-full h-full" />
    </div>
  )
} 