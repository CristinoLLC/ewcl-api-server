declare module 'molstar/lib/mol-plugin-ui/context' {
  export interface PluginUIContext {
    builders: {
      data: {
        download: (options: { url: string }) => Promise<any>
        rawData: (options: { data: string }) => Promise<any>
      }
      structure: {
        parseTrajectory: (data: any, format: string) => Promise<any>
        hierarchy: {
          applyPreset: (trajectory: any, preset: string) => Promise<any>
        }
      }
    }
    managers: {
      structure: {
        hierarchy: {
          current: {
            structures: any[]
          }
        }
        component: {
          clear: (structures: any[]) => Promise<void>
          addRepresentation: (structures: any[], params: StructureRepresentationParams) => Promise<void>
        }
        focus: {
          set: (structures: any[]) => Promise<void>
        }
        selection: {
          clear: () => void
          fromExpression: (structures: any[], expression: string) => void
        }
      }
      camera: {
        reset: () => Promise<void>
        focusLoci: (loci: any) => Promise<void>
        setState: (state: CameraState) => Promise<void>
      }
      interactivity: {
        setProps: (props: InteractivityProps) => void
      }
    }
    canvas3d: {
      props: {
        renderer: {
          backgroundColor: Color
        }
      }
    }
    dispose: () => void
  }
}

interface Color {
  r: number
  g: number
  b: number
  a?: number
}

interface CameraState {
  position: { x: number; y: number; z: number }
  target: { x: number; y: number; z: number }
  up: { x: number; y: number; z: number }
}

interface InteractivityProps {
  clickMode?: 'select' | 'center' | 'measureDistance' | 'measureAngle' | 'measureDihedral'
  highlightColor?: Color
  selectMode?: 'atom' | 'residue' | 'chain'
}

interface StructureRepresentationParams {
  type: RepresentationType
  color?: ColorTheme | CustomColorTheme | ((residue: number) => CustomColorTheme)
  style?: Partial<StyleParams>
  selection?: string
  label?: LabelParams
}

type RepresentationType = 
  | 'cartoon'
  | 'ball-and-stick'
  | 'surface'
  | 'spacefill'
  | 'point'
  | 'line'
  | 'cross'
  | 'label'
  | 'distance'
  | 'contact'
  | 'ribbon'

interface StyleParams {
  smoothing: number
  opacity: number
  metalness: number
  roughness: number
  wireframe: boolean
  sizeAspectRatio: number
  dashed: boolean
  dashSize: number
  ignoreHydrogens: boolean
  quality: 'auto' | 'low' | 'medium' | 'high'
}

interface LabelParams {
  text?: string | ((residue: number) => string)
  color?: Color
  size?: number
  background?: boolean
  backgroundOpacity?: number
  attachment?: 'top-left' | 'top' | 'top-right' | 'right' | 'bottom-right' | 'bottom' | 'bottom-left' | 'left'
}

type ColorTheme = 
  | 'default'
  | 'element'
  | 'chain-id'
  | 'residue-name'
  | 'residue-index'
  | 'secondary-structure'
  | 'molecule-type'
  | 'entity-id'
  | 'operator-name'
  | 'model-index'
  | 'uniform'
  | 'hydrophobicity'
  | 'sequence-id'
  | 'depth'
  | 'random'

interface CustomColorTheme {
  name: string
  colors: {
    residue: (residue: number) => [number, number, number]
  }
}

declare module 'molstar/lib/mol-plugin-ui/spec' {
  export interface PluginUISpec {
    layout?: {
      initial?: {
        isExpanded?: boolean
        showControls?: boolean
        controlsDisplay?: 'reactive' | 'always' | 'never'
      }
    }
    components?: {
      remoteState?: 'none' | 'basic' | 'full'
      structureTools?: 'none' | 'basic' | 'full'
    }
  }

  export function DefaultPluginUISpec(): PluginUISpec
}

declare module 'molstar/lib/mol-plugin-ui/index' {
  import { PluginUIContext } from 'molstar/lib/mol-plugin-ui/context'
  import { PluginUISpec } from 'molstar/lib/mol-plugin-ui/spec'

  export function createPluginUI(
    target: HTMLElement,
    spec?: PluginUISpec
  ): Promise<PluginUIContext>
} 