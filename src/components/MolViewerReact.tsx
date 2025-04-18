'use client'

import React, { useEffect, useState } from 'react'
import { PluginUIContext } from 'molstar/lib/mol-plugin-ui/context';
import { DefaultPluginUISpec } from 'molstar/lib/mol-plugin-ui/spec';
import { createPluginUI } from 'molstar/lib/mol-plugin-ui/index';
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

interface MolViewerReactProps {
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

export default function MolViewerReact({ 
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
}: MolViewerReactProps) {
  const [plugin, setPlugin] = useState<PluginUIContext | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const viewerRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!viewerRef.current) return
    if (plugin) return // avoid re-init

    async function init() {
      try {
        const newPlugin = await createPluginUI(viewerRef.current!, {
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
        setPlugin(newPlugin)
      } catch (error) {
        console.error('Error initializing Mol* viewer:', error)
        toast.error('Failed to initialize protein viewer')
      }
    }

    init()

    return () => {
      if (plugin) {
        plugin.dispose()
      }
    }
  }, [])

  useEffect(() => {
    if (!plugin) return

    async function loadStructure() {
      try {
        setIsLoading(true)

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
            await plugin.managers.structure.component.addRepresentation([structureRef], {
              type: 'surface',
              color: getColorScheme()
            });
          }

          // Add cartoon representation
          if (visualizationOptions.showCartoon) {
            await plugin.managers.structure.component.addRepresentation([structureRef], {
              type: 'cartoon',
              color: getColorScheme()
            });
          }

          // Add ball-and-stick representation for variants
          if (visualizationOptions.showBallsAndSticks && variants) {
            await plugin.managers.structure.component.addRepresentation([structureRef], {
              type: 'ball-and-sticks',
              selection: variants.map(v => `[${v.position}]`).join(' or '),
              color: getVariantColor
            });
          }

          // Add labels for variants
          if (visualizationOptions.showLabels && variants) {
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
        console.error('Error loading structure:', error)
        toast.error('Failed to load protein structure')
      } finally {
        setIsLoading(false)
      }
    }

    loadStructure()
  }, [plugin, pdbUrl, pdbData, compareStructure, visualizationOptions])

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