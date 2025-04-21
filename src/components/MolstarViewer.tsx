"use client"

import { useEffect, useRef, useState } from "react"
import { createPluginUI } from "molstar/lib/mol-plugin-ui/index"
import { DefaultPluginUISpec } from "molstar/lib/mol-plugin-ui/spec"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import "molstar/lib/mol-plugin-ui/skin/light.scss"

type ViewStyle = "cartoon" | "surface" | "ball-and-stick" | "spacefill"
type ColorScheme = "entropy" | "chain-id" | "hydrophobicity" | "residue-type"

interface MolstarViewerProps {
  url: string
  entropyMap?: Record<string, number>
}

export function MolstarViewer({ url, entropyMap }: MolstarViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeStyles, setActiveStyles] = useState<ViewStyle[]>(["cartoon"])
  const [showLabels, setShowLabels] = useState(false)
  const [colorScheme, setColorScheme] = useState<ColorScheme>("chain-id")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!containerRef.current) return

    let plugin: any = null

    const initViewer = async () => {
      try {
        setIsLoading(true)
        // Initialize plugin
        plugin = await createPluginUI(containerRef.current!, {
          ...DefaultPluginUISpec,
          layout: {
            initial: {
              isExpanded: false,
              showControls: true,
              controlsDisplay: "reactive",
            },
          },
        })

        // Load structure
        const data = await plugin.builders.data.download({ url })
        const trajectory = await plugin.builders.structure.parseTrajectory(data)
        const model = await plugin.builders.structure.hierarchy.applyPreset(trajectory, "default")
        const structure = model.structures?.[0]
        
        if (!structure) {
          throw new Error("Failed to load structure")
        }

        // Clear existing representations
        const components = plugin.managers.structure.hierarchy.current.components
        for (const component of components) {
          const representations = component.representations
          for (const repr of representations) {
            await repr.remove()
          }
        }

        // Add representations based on active styles
        for (const style of activeStyles) {
          switch (style) {
            case "cartoon":
              await plugin.builders.structure.representation.addRepresentation(structure, {
                type: "cartoon",
                color: colorScheme,
              })
              break
            case "surface":
              await plugin.builders.structure.representation.addRepresentation(structure, {
                type: "molecular-surface",
                color: colorScheme,
                typeParams: { alpha: 0.7 },
              })
              break
            case "ball-and-stick":
              await plugin.builders.structure.representation.addRepresentation(structure, {
                type: "ball-and-stick",
                color: colorScheme,
              })
              break
            case "spacefill":
              await plugin.builders.structure.representation.addRepresentation(structure, {
                type: "spacefill",
                color: colorScheme,
              })
              break
          }
        }

        // Add labels if enabled
        if (showLabels) {
          await plugin.builders.structure.representation.addRepresentation(structure, {
            type: "label",
            text: "residue-name",
            color: "black",
            size: 2.0,
          })
        }

        // Apply entropy coloring if available
        if (entropyMap && colorScheme === "entropy") {
          const colorTheme = {
            name: "entropy",
            params: { entropyMap },
            factory: () => ({
              granularity: "residue",
              color: (location: any) => {
                const residueNumber = location.residueKey.sequence.toString()
                const entropy = entropyMap[residueNumber] || 0
                // Scientific color scheme: blue (low) → white → red (high)
                return { r: entropy, g: 0, b: 1 - entropy }
              },
            }),
          }

          plugin.representation.structure.themes.colorThemeRegistry.add(colorTheme)
          const components = plugin.managers.structure.hierarchy.current.components
          for (const component of components) {
            const representations = component.representations
            for (const repr of representations) {
              await repr.setTheme({
                color: "entropy",
              })
            }
          }
        }

        // Reset view
        if (plugin.canvas3d) {
          plugin.canvas3d.requestAnimation()
        }

        setError(null)
      } catch (error) {
        console.error("Failed to load structure:", error)
        setError("Failed to load protein structure. Please try again.")
        toast.error("Failed to load protein structure")
      } finally {
        setIsLoading(false)
      }
    }

    initViewer()

    return () => {
      if (plugin) {
        plugin.dispose()
      }
    }
  }, [url, entropyMap, activeStyles, showLabels, colorScheme])

  const toggleStyle = (style: ViewStyle) => {
    setActiveStyles(prev => 
      prev.includes(style)
        ? prev.filter(s => s !== style)
        : [...prev, style]
    )
  }

  if (error) {
    return (
      <Card className="p-4 bg-white">
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-white">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeStyles.includes("cartoon") ? "default" : "outline"}
            size="sm"
            onClick={() => toggleStyle("cartoon")}
          >
            Cartoon
          </Button>
          <Button
            variant={activeStyles.includes("surface") ? "default" : "outline"}
            size="sm"
            onClick={() => toggleStyle("surface")}
          >
            Surface
          </Button>
          <Button
            variant={activeStyles.includes("ball-and-stick") ? "default" : "outline"}
            size="sm"
            onClick={() => toggleStyle("ball-and-stick")}
          >
            Ball & Stick
          </Button>
          <Button
            variant={activeStyles.includes("spacefill") ? "default" : "outline"}
            size="sm"
            onClick={() => toggleStyle("spacefill")}
          >
            Spacefill
          </Button>
          <Button
            variant={showLabels ? "default" : "outline"}
            size="sm"
            onClick={() => setShowLabels(!showLabels)}
          >
            Labels
          </Button>
          <Button
            variant={colorScheme === "entropy" ? "default" : "outline"}
            size="sm"
            onClick={() => setColorScheme("entropy")}
            disabled={!entropyMap}
          >
            Entropy
          </Button>
          <Button
            variant={colorScheme === "chain-id" ? "default" : "outline"}
            size="sm"
            onClick={() => setColorScheme("chain-id")}
          >
            Chain ID
          </Button>
        </div>
      </Card>
      <div className="relative aspect-square">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
          </div>
        )}
        <div ref={containerRef} className="absolute inset-0" />
      </div>
    </div>
  )
} 