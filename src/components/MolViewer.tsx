'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Viewer } from 'molstar'
import { PluginConfig } from 'molstar'
import { toast } from 'react-toastify'

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
    surfaceStyle?: 'solid' | 'transparent' | 'mesh' | 'dots'
    showCartoon?: boolean
    cartoonStyle?: 'smooth' | 'sharp' | 'coil'
    showBallsAndSticks?: boolean
    showLabels?: boolean
    colorScheme?: 'entropy' | 'secondary' | 'hydrophobicity' | 'custom'
    customColors?: { [residue: number]: [number, number, number] }
    lighting?: {
      ambientIntensity?: number
      directIntensity?: number
      shadow?: boolean
    }
    background?: {
      color?: [number, number, number]
      opacity?: number
    }
    alignment?: {
      method?: 'sequence' | 'structure' | 'manual'
      reference?: 'main' | 'compare'
      showAlignment?: boolean
    }
  }
}

interface ExportOptions {
  format: 'png' | 'jpg' | 'svg'
  resolution: number
  quality?: number
  filename?: string
}

interface MolstarViewer extends Viewer {
  // Core viewer methods
  loadStructureFromUrl: (url: string, format: string, options?: { label?: string }) => Promise<void>
  loadStructureFromData: (data: string, format: string, options?: { label?: string }) => Promise<void>
  dispose: () => void
  reset: () => void
  clear: () => Promise<void>

  // Plugin access
  plugin: {
    // Structure management
    managers: {
      structure: {
        visual: {
          clear: () => Promise<void>
          addRepresentation: (type: string, options: any) => Promise<void>
          setActiveStructure: (name: string) => void
          removeRepresentation: (representation: any) => void
          updateRepresentation: (representation: any, options: any) => void
        }
        alignment: {
          align: (options: {
            method?: 'sequence' | 'structure' | 'manual'
            reference?: string
            target?: string
          }) => Promise<{ score: number }>
          clear: () => void
        }
        selection: {
          events: {
            hover: {
              subscribe: (callback: (e: any) => void) => void
              unsubscribe: (callback: (e: any) => void) => void
            }
          }
          setTooltip: (text: string) => void
          clear: () => void
        }
        hierarchy: {
          current: {
            structures: Array<{
              cell: {
                obj: {
                  data: any
                }
              }
            }>
          }
        }
      }
    }
    // Canvas and rendering
    canvas3d?: {
      setProps: (props: {
        renderer?: {
          ambientIntensity?: number
          directIntensity?: number
          shadow?: boolean
        }
        background?: {
          color?: [number, number, number]
          opacity?: number
        }
      }) => void
      exportImage: (format: string, resolution: number, quality?: number) => Promise<{ src: string }>
      reset: () => void
      clear: () => void
    }
    // Builders for creating representations
    builders: {
      structure: {
        representation: {
          addRepresentation: (structure: any, options: any) => Promise<void>
          updateRepresentation: (representation: any, options: any) => void
          removeRepresentation: (representation: any) => void
        }
      }
    }
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
    surfaceStyle: 'solid',
    showCartoon: true,
    cartoonStyle: 'smooth',
    showBallsAndSticks: true,
    showLabels: true,
    colorScheme: 'entropy',
    lighting: {
      ambientIntensity: 0.4,
      directIntensity: 0.6,
      shadow: true
    },
    background: {
      color: [1, 1, 1],
      opacity: 1
    },
    alignment: {
      method: 'structure',
      reference: 'main',
      showAlignment: true
    }
  }
}: MolViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null)
  const pluginRef = useRef<MolstarViewer>()
  const [isLoading, setIsLoading] = useState(false)
  const [activeStructure, setActiveStructure] = useState<'main' | 'compare'>('main')
  const [alignmentScore, setAlignmentScore] = useState<number | null>(null)
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'png',
    resolution: 2,
    quality: 0.92,
    filename: 'structure'
  })

  useEffect(() => {
    if (!viewerRef.current) return
    if (pluginRef.current) return // avoid re-init

    try {
      setIsLoading(true)
      pluginRef.current = new Viewer(viewerRef.current, {
        layoutIsExpanded: true,
        layoutShowControls: false,
        showImportControls: false,
        showSessionControls: false,
        showStructureSourceControls: false,
        config: [
          [PluginConfig.Viewer.DefaultRepresentationPreset, 'auto'],
        ]
      }) as MolstarViewer

      // Load main structure
      if (pdbUrl) {
        pluginRef.current.loadStructureFromUrl(pdbUrl, 'pdb')
      } else if (pdbData) {
        pluginRef.current.loadStructureFromData(pdbData, 'pdb')
      }

      // Load comparison structure if provided
      if (compareStructure) {
        if (compareStructure.pdbUrl) {
          pluginRef.current.loadStructureFromUrl(compareStructure.pdbUrl, 'pdb', {
            label: compareStructure.label || 'Comparison'
          })
        } else if (compareStructure.pdbData) {
          pluginRef.current.loadStructureFromData(compareStructure.pdbData, 'pdb', {
            label: compareStructure.label || 'Comparison'
          })
        }

        // Perform structure alignment if enabled
        if (visualizationOptions.alignment?.showAlignment) {
          alignStructures()
        }
      }

      // Apply initial visualization settings
      applyVisualization()

    } catch (error) {
      console.error('Error initializing Mol* viewer:', error)
      toast.error('Failed to load protein structure')
    } finally {
      setIsLoading(false)
    }

    return () => {
      if (pluginRef.current) {
        pluginRef.current.dispose()
      }
    }
  }, [pdbUrl, pdbData, compareStructure, visualizationOptions.alignment])

  async function alignStructures() {
    const plugin = pluginRef.current
    if (!plugin) return

    try {
      const alignment = await plugin.plugin.managers.structure.alignment.align({
        method: visualizationOptions.alignment?.method || 'structure',
        reference: visualizationOptions.alignment?.reference || 'main',
        target: visualizationOptions.alignment?.reference === 'main' ? 'comparison' : 'main'
      })

      setAlignmentScore(alignment.score)
      toast.success(`Alignment completed. Score: ${alignment.score.toFixed(2)}`)

      // Show alignment visualization
      await plugin.plugin.managers.structure.visual.addRepresentation('alignment', {
        opacity: 0.5,
        color: 'gray'
      })

    } catch (error) {
      console.error('Error aligning structures:', error)
      toast.error('Failed to align structures')
    }
  }

  async function applyVisualization() {
    const plugin = pluginRef.current
    if (!plugin) return

    try {
      // Clear existing representations
      await plugin.plugin.managers.structure.visual.clear()

      // Apply lighting settings
      if (visualizationOptions.lighting) {
        plugin.plugin.canvas3d?.setProps({
          renderer: {
            ambientIntensity: visualizationOptions.lighting.ambientIntensity,
            directIntensity: visualizationOptions.lighting.directIntensity,
            shadow: visualizationOptions.lighting.shadow
          }
        })
      }

      // Apply background settings
      if (visualizationOptions.background) {
        plugin.plugin.canvas3d?.setProps({
          background: {
            color: visualizationOptions.background.color,
            opacity: visualizationOptions.background.opacity
          }
        })
      }

      // Apply surface representation if enabled
      if (visualizationOptions.showSurface) {
        await plugin.plugin.managers.structure.visual.addRepresentation('surface', {
          color: getColorScheme(),
          opacity: visualizationOptions.surfaceStyle === 'transparent' ? 0.5 : 0.7,
          style: visualizationOptions.surfaceStyle || 'solid'
        })
      }

      // Apply cartoon representation if enabled
      if (visualizationOptions.showCartoon) {
        await plugin.plugin.managers.structure.visual.addRepresentation('cartoon', {
          color: getColorScheme(),
          opacity: 0.8,
          style: visualizationOptions.cartoonStyle || 'smooth'
        })
      }

      // Apply ball-and-stick representation for variants if enabled
      if (visualizationOptions.showBallsAndSticks && variants) {
        await plugin.plugin.managers.structure.visual.addRepresentation('ball-and-stick', {
          selection: variants.map(v => `[${v.position}]`).join(' or '),
          color: getVariantColor,
          radius: 0.3
        })
      }

      // Add labels if enabled
      if (visualizationOptions.showLabels && variants) {
        await plugin.plugin.managers.structure.visual.addRepresentation('label', {
          selection: variants.map(v => `[${v.position}]`).join(' or '),
          label: (residue: number) => {
            const variant = variants.find(v => v.position === residue)
            return variant ? `${variant.type} (${variant.impact || 'Unknown'})` : ''
          }
        })
      }

      // Set up hover tooltip
      plugin.plugin.managers.structure.selection.events.hover.subscribe((e: any) => {
        if (e.data && e.data.residue) {
          const residue = e.data.residue
          const score = entropyScores?.[residue]
          const variant = variants?.find(v => v.position === residue)
          
          if (score || variant) {
            let tooltip = `Residue ${residue}`
            if (score) tooltip += `\nEntropy Score: ${score.toFixed(2)}`
            if (variant) {
              tooltip += `\nVariant: ${variant.type}`
              if (variant.clinicalSignificance) tooltip += `\nClinical Significance: ${variant.clinicalSignificance}`
              if (variant.impact) tooltip += `\nImpact: ${variant.impact}`
              if (variant.frequency) tooltip += `\nFrequency: ${(variant.frequency * 100).toFixed(2)}%`
              if (variant.evidence?.length) tooltip += `\nEvidence: ${variant.evidence.join(', ')}`
            }
            
            plugin.plugin.managers.structure.selection.setTooltip(tooltip)
          }
        }
      })

    } catch (error) {
      console.error('Error applying visualization:', error)
    }
  }

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
      case 'custom':
        return visualizationOptions.customColors
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

  const exportImage = (options: ExportOptions = exportOptions) => {
    const plugin = pluginRef.current
    if (!plugin) return

    plugin.plugin.canvas3d?.exportImage(options.format, options.resolution, options.quality)
      .then((img: { src: string }) => {
        const a = document.createElement('a')
        a.href = img.src
        a.download = `${options.filename}.${options.format}`
        a.click()
      })
      .catch((error: Error) => {
        console.error('Error exporting image:', error)
        toast.error('Failed to export image')
      })
  }

  const toggleFullscreen = () => {
    const el = viewerRef.current
    if (!el) return
    if (el.requestFullscreen) {
      el.requestFullscreen()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => applyVisualization()} className="px-3 py-1 bg-blue-500 text-white rounded">
          Apply Visualization
        </button>
        <div className="relative group">
          <button className="px-3 py-1 bg-gray-700 text-white rounded">
            Export
          </button>
          <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md p-2 z-10">
            <div className="space-y-2">
              <select
                value={exportOptions.format}
                onChange={(e) => setExportOptions({ ...exportOptions, format: e.target.value as 'png' | 'jpg' | 'svg' })}
                className="w-full p-1 border rounded"
              >
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
                <option value="svg">SVG</option>
              </select>
              <input
                type="number"
                value={exportOptions.resolution}
                onChange={(e) => setExportOptions({ ...exportOptions, resolution: parseFloat(e.target.value) })}
                min="1"
                max="4"
                step="0.5"
                className="w-full p-1 border rounded"
                placeholder="Resolution (1-4)"
              />
              <input
                type="text"
                value={exportOptions.filename}
                onChange={(e) => setExportOptions({ ...exportOptions, filename: e.target.value })}
                className="w-full p-1 border rounded"
                placeholder="Filename"
              />
              <button
                onClick={() => exportImage()}
                className="w-full px-3 py-1 bg-indigo-600 text-white rounded"
              >
                Export
              </button>
            </div>
          </div>
        </div>
        <button onClick={toggleFullscreen} className="px-3 py-1 bg-purple-500 text-white rounded">
          Fullscreen
        </button>
      </div>
      <div className="relative w-full h-[600px] bg-white rounded-lg shadow">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
          </div>
        )}
        <div ref={viewerRef} className="w-full h-full" />
        
        {/* Structure Comparison Controls */}
        {compareStructure && (
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button
              className={`px-3 py-1 rounded-md text-sm ${
                activeStructure === 'main'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => {
                setActiveStructure('main')
                pluginRef.current?.plugin.managers.structure.visual.setActiveStructure('main')
              }}
            >
              Main Structure
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${
                activeStructure === 'compare'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => {
                setActiveStructure('compare')
                pluginRef.current?.plugin.managers.structure.visual.setActiveStructure('comparison')
              }}
            >
              Comparison
            </button>
          </div>
        )}

        {/* Alignment Score */}
        {alignmentScore !== null && (
          <div className="absolute top-4 right-4 bg-white bg-opacity-75 px-3 py-1 rounded-md text-sm">
            Alignment Score: {alignmentScore.toFixed(2)}
          </div>
        )}
      </div>
    </div>
  )
} 