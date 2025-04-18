'use client'

import React, { useEffect, useRef, useState } from 'react'
import { PluginUIContext } from 'molstar/lib/mol-plugin-ui/context'
import { DefaultPluginUISpec } from 'molstar/lib/mol-plugin-ui/spec'
import { createPluginUI } from 'molstar/lib/mol-plugin-ui/index'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '../styles/molstar.scss'

interface ProteinViewerProps {
  pdbUrl?: string
  pdbData?: string
  onError?: (error: Error) => void
  visualizationOptions?: {
    showSurface?: boolean
    showCartoon?: boolean
    showBallsAndSticks?: boolean
    showLabels?: boolean
    showRibbon?: boolean
    showSpacefill?: boolean
    colorScheme?: 'entropy' | 'secondary' | 'hydrophobicity' | 'element' | 'chain' | 'residue' | 'custom'
    style?: {
      opacity?: number
      metalness?: number
      roughness?: number
      wireframe?: boolean
      quality?: 'auto' | 'low' | 'medium' | 'high'
    }
    background?: {
      color?: { r: number; g: number; b: number }
    }
    labels?: {
      size?: number
      background?: boolean
      backgroundOpacity?: number
      attachment?: 'top-left' | 'top' | 'top-right' | 'right' | 'bottom-right' | 'bottom' | 'bottom-left' | 'left'
    }
    interactivity?: {
      clickMode?: 'select' | 'center' | 'measureDistance' | 'measureAngle' | 'measureDihedral'
      selectMode?: 'atom' | 'residue' | 'chain'
    }
  }
  entropyScores?: { [residue: number]: number }
  variants?: {
    position: number
    type: string
    impact?: 'HIGH' | 'MODERATE' | 'LOW'
    description?: string
    evidence?: string[]
  }[]
  onSelect?: (selection: { type: string; id: number }[]) => void
  onMeasure?: (measurement: { type: string; value: number; units: string }) => void
}

export default function ProteinViewer({ 
  pdbUrl = '', 
  pdbData, 
  onError,
  visualizationOptions = {
    showSurface: true,
    showCartoon: true,
    showBallsAndSticks: true,
    showLabels: true,
    showRibbon: false,
    showSpacefill: false,
    colorScheme: 'entropy',
    style: {
      opacity: 1,
      metalness: 0,
      roughness: 1,
      wireframe: false,
      quality: 'medium'
    },
    background: {
      color: { r: 1, g: 1, b: 1 }
    },
    labels: {
      size: 1,
      background: true,
      backgroundOpacity: 0.5,
      attachment: 'top-right'
    },
    interactivity: {
      clickMode: 'select',
      selectMode: 'residue'
    }
  },
  entropyScores,
  variants,
  onSelect,
  onMeasure
}: ProteinViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null)
  const pluginRef = useRef<PluginUIContext | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedResidues, setSelectedResidues] = useState<number[]>([])

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
        })

        pluginRef.current = plugin

        // Set background color
        if (visualizationOptions.background?.color) {
          plugin.canvas3d.props.renderer.backgroundColor = visualizationOptions.background.color
        }

        // Set interactivity options
        if (visualizationOptions.interactivity) {
          plugin.managers.interactivity.setProps({
            clickMode: visualizationOptions.interactivity.clickMode,
            selectMode: visualizationOptions.interactivity.selectMode,
            highlightColor: { r: 1, g: 0.8, b: 0.1, a: 1 }
          })
        }

        // Load structure
        if (pdbUrl) {
          const data = await plugin.builders.data.download({ url: pdbUrl })
          const trajectory = await plugin.builders.structure.parseTrajectory(data, 'pdb')
          await plugin.builders.structure.hierarchy.applyPreset(trajectory, 'default')
        } else if (pdbData) {
          const data = await plugin.builders.data.rawData({ data: pdbData })
          const trajectory = await plugin.builders.structure.parseTrajectory(data, 'pdb')
          await plugin.builders.structure.hierarchy.applyPreset(trajectory, 'default')
        }

        // Apply visualization options
        const structures = plugin.managers.structure.hierarchy.current.structures
        if (structures.length > 0) {
          const structureRef = structures[0]
          
          // Clear existing representations
          await plugin.managers.structure.component.clear([structureRef])

          const defaultStyle = {
            opacity: visualizationOptions.style?.opacity ?? 1,
            metalness: visualizationOptions.style?.metalness ?? 0,
            roughness: visualizationOptions.style?.roughness ?? 1,
            wireframe: visualizationOptions.style?.wireframe ?? false,
            quality: visualizationOptions.style?.quality ?? 'medium'
          }

          // Add surface representation
          if (visualizationOptions.showSurface) {
            await plugin.managers.structure.component.addRepresentation([structureRef], {
              type: 'surface',
              color: getColorTheme(),
              style: defaultStyle
            })
          }

          // Add cartoon representation
          if (visualizationOptions.showCartoon) {
            await plugin.managers.structure.component.addRepresentation([structureRef], {
              type: 'cartoon',
              color: getColorTheme(),
              style: defaultStyle
            })
          }

          // Add ribbon representation
          if (visualizationOptions.showRibbon) {
            await plugin.managers.structure.component.addRepresentation([structureRef], {
              type: 'ribbon',
              color: getColorTheme(),
              style: defaultStyle
            })
          }

          // Add spacefill representation
          if (visualizationOptions.showSpacefill) {
            await plugin.managers.structure.component.addRepresentation([structureRef], {
              type: 'spacefill',
              color: getColorTheme(),
              style: defaultStyle
            })
          }

          // Add ball-and-stick representation for variants
          if (visualizationOptions.showBallsAndSticks && variants) {
            await plugin.managers.structure.component.addRepresentation([structureRef], {
              type: 'ball-and-stick',
              selection: variants.map(v => `[${v.position}]`).join(' or '),
              color: getVariantColor,
              style: defaultStyle
            })
          }

          // Add labels for variants
          if (visualizationOptions.showLabels && variants) {
            await plugin.managers.structure.component.addRepresentation([structureRef], {
              type: 'label',
              selection: variants.map(v => `[${v.position}]`).join(' or '),
              label: {
                text: (residue: number) => {
                  const variant = variants.find(v => v.position === residue)
                  return variant ? `${variant.type} (${variant.impact || 'Unknown'})` : ''
                },
                size: visualizationOptions.labels?.size,
                background: visualizationOptions.labels?.background,
                backgroundOpacity: visualizationOptions.labels?.backgroundOpacity,
                attachment: visualizationOptions.labels?.attachment
              }
            })
          }
        }

        // Reset camera
        await plugin.managers.camera.reset()

        // Set up selection handler
        if (onSelect) {
          plugin.managers.structure.selection.clear()
          plugin.managers.structure.selection.fromExpression(structures, selectedResidues.map(r => `[${r}]`).join(' or '))
        }

        // Set up measurement handler
        if (onMeasure && visualizationOptions.interactivity?.clickMode?.startsWith('measure')) {
          // TODO: Implement measurement handling
        }

      } catch (error) {
        console.error('Error loading protein structure:', error)
        toast.error('Failed to load protein structure')
        if (onError && error instanceof Error) {
          onError(error)
        }
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
  }, [pdbUrl, pdbData, onError, visualizationOptions, entropyScores, variants, selectedResidues, onSelect, onMeasure])

  function getColorTheme(): ColorTheme | CustomColorTheme {
    if (!entropyScores) return 'default'

    switch (visualizationOptions.colorScheme) {
      case 'entropy':
        return {
          name: 'entropy',
          colors: {
            residue: (residue: number): [number, number, number] => {
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
      case 'element':
        return 'element'
      case 'chain':
        return 'chain-id'
      case 'residue':
        return 'residue-name'
      default:
        return 'default'
    }
  }

  function getVariantColor(residue: number): CustomColorTheme {
    return {
      name: 'variant-impact',
      colors: {
        residue: (r: number): [number, number, number] => {
          const variant = variants?.find(v => v.position === r)
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
      }
    }
  }

  return (
    <div className="relative w-full h-[600px] bg-white rounded-lg shadow">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
        </div>
      )}
      <div ref={viewerRef} className="msp-plugin w-full h-full" />
    </div>
  )
} 