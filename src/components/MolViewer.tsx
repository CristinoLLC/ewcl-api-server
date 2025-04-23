// TODO: Properly type Mol* API integration
// - Add proper type definitions for StructureRef and StructureComponentRef
// - Update method signatures to match Mol* API
// - Add proper error handling types
// - Consider using official Mol* React component as an alternative

'use client'

import React, { useEffect, useRef, useState } from 'react'
import { PluginUIContext } from 'molstar/lib/mol-plugin-ui/context';
import { DefaultPluginUISpec } from 'molstar/lib/mol-plugin-ui/spec';
import { createPluginUI } from 'molstar/lib/mol-plugin-ui/index';
import { StateObjectRef } from 'molstar/lib/mol-state';
import { PluginStateObject } from 'molstar/lib/mol-plugin-state/objects';
import { Structure } from 'molstar/lib/mol-model/structure';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'molstar/lib/mol-plugin-ui/skin/light.scss'

interface Variant {
  position: number
  type: string
  clinicalSignificance?: string
  frequency?: number
  impact?: 'HIGH' | 'MODERATE' | 'LOW'
  evidence?: string[]
}

interface MolViewerProps {
  pdbUrl?: string
  pdbData?: string
  entropyScores?: { [residue: number]: number }
  variants?: Variant[]
  compareStructure?: {
    pdbUrl?: string
    pdbData?: string
    label?: string
  }
  visualizationOptions?: {
    showSurface?: boolean
    showCartoon?: boolean
    showBallsAndSticks?: boolean
    showLabels?: boolean
    colorScheme?: 'entropy' | 'secondary' | 'hydrophobicity' | 'custom'
  }
}

export default function MolViewer({ 
  pdbUrl = '', 
  pdbData, 
  entropyScores, 
  variants,
  compareStructure,
  visualizationOptions = {
    showSurface: true,
    showCartoon: true,
    showBallsAndSticks: true,
    showLabels: true,
    colorScheme: 'entropy'
  }
}: MolViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null)
  const pluginRef = useRef<PluginUIContext | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!viewerRef.current) return
    if (pluginRef.current) return // avoid re-init

    async function init() {
      try {
        setIsLoading(true)
        
        const plugin = await createPluginUI(viewerRef.current!, {
          ...DefaultPluginUISpec(),
          layout: {
            initial: {
              isExpanded: false,
              showControls: true,
              controlsDisplay: 'reactive'
            }
          },
          components: {
            remoteState: 'none',
            structureTools: 'basic'
          }
        });

        pluginRef.current = plugin

        // Load main structure
        if (pdbUrl) {
          const data = await plugin.builders.data.download({ url: pdbUrl });
          const trajectory = await plugin.builders.structure.parseTrajectory(data, 'pdb');
          const structure = await plugin.builders.structure.hierarchy.applyPreset(trajectory, 'default');
        } else if (pdbData) {
          const data = await plugin.builders.data.rawData({ data: pdbData });
          const trajectory = await plugin.builders.structure.parseTrajectory(data, 'pdb');
          const structure = await plugin.builders.structure.hierarchy.applyPreset(trajectory, 'default');
        }

        // Load comparison structure if provided
        if (compareStructure) {
          if (compareStructure.pdbUrl) {
            const data = await plugin.builders.data.download({ url: compareStructure.pdbUrl });
            const trajectory = await plugin.builders.structure.parseTrajectory(data, 'pdb');
            const structure = await plugin.builders.structure.hierarchy.applyPreset(trajectory, 'default');
          } else if (compareStructure.pdbData) {
            const data = await plugin.builders.data.rawData({ data: compareStructure.pdbData });
            const trajectory = await plugin.builders.structure.parseTrajectory(data, 'pdb');
            const structure = await plugin.builders.structure.hierarchy.applyPreset(trajectory, 'default');
          }
        }

        // Apply visualization options
        const structures = plugin.managers.structure.hierarchy.current.structures;
        if (structures.length > 0) {
          const structureRef = structures[0];
          
          // Clear existing representations
          await plugin.managers.structure.component.clear([structureRef]);

          // Add surface representation
          if (visualizationOptions.showSurface) {
            // @ts-ignore
            await plugin.managers.structure.component.addRepresentation([structureRef], {
              type: 'surface',
              color: getColorScheme()
            });
          }

          // Add cartoon representation
          if (visualizationOptions.showCartoon) {
            // @ts-ignore
            await plugin.managers.structure.component.addRepresentation([structureRef], {
              type: 'cartoon',
              color: getColorScheme()
            });
          }

          // Add ball-and-stick representation for variants
          if (visualizationOptions.showBallsAndSticks && variants) {
            // @ts-ignore
            await plugin.managers.structure.component.addRepresentation([structureRef], {
              type: 'ball-and-sticks',
              selection: variants.map(v => `[${v.position}]`).join(' or '),
              color: getVariantColor
            });
          }

          // Add labels for variants
          if (visualizationOptions.showLabels && variants) {
            // @ts-ignore
            await plugin.managers.structure.component.addRepresentation([structureRef], {
              type: 'label',
              selection: variants.map(v => `[${v.position}]`).join(' or '),
              label: (residue: number) => {
                const variant = variants.find(v => v.position === residue);
                return variant ? `${variant.type} (${variant.impact || 'Unknown'})` : '';
              }
            });
          }
        }

        // Reset camera
        await plugin.managers.camera.reset();

      } catch (error) {
        console.error('Error initializing Mol* viewer:', error)
        toast.error('Failed to load protein structure')
      } finally {
        setIsLoading(false)
      }
    }

    init()

    return () => {
      if (pluginRef.current) {
        pluginRef.current.dispose()
      }
    }
  }, [pdbUrl, pdbData, compareStructure, visualizationOptions])

  function getColorScheme() {
    if (!entropyScores) return 'default'

    switch (visualizationOptions.colorScheme) {
      case 'entropy':
        return {
          name: 'entropy',
          colors: {
            residue: (residue: number) => {
              const score = entropyScores[residue]
              if (score === undefined) return [1, 1, 1]
              const normalized = (score - Math.min(...Object.values(entropyScores))) / 
                               (Math.max(...Object.values(entropyScores)) - Math.min(...Object.values(entropyScores)))
              return [normalized, 0, 1 - normalized]
            }
          }
        }
      case 'secondary':
        return 'secondary-structure'
      case 'hydrophobicity':
        return 'hydrophobicity'
      default:
        return 'default'
    }
  }

  function getVariantColor(residue: number) {
    const variant = variants?.find(v => v.position === residue)
    if (!variant) return [1, 1, 1]

    switch (variant.impact) {
      case 'HIGH':
        return [1, 0, 0] // red
      case 'MODERATE':
        return [1, 0.5, 0] // orange
      case 'LOW':
        return [0, 1, 0] // green
      default:
        return [0.5, 0.5, 0.5] // gray
    }
  }

  return (
    <div className="relative w-full h-[600px] bg-white rounded-lg shadow">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
        </div>
      )}
      <div ref={viewerRef} className="w-full h-full" />
    </div>
  )
} 
} 
