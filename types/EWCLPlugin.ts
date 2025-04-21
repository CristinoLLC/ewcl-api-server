export interface EWCLPlugin {
  id: string
  name: string
  description: string
  run: <T>(entropyMap: Record<string, number>, options?: any) => T
  render?: (output: any, props?: any) => JSX.Element
}

export interface PluginRegistry {
  register: (plugin: EWCLPlugin) => void
  getPlugins: () => EWCLPlugin[]
  getPlugin: (id: string) => EWCLPlugin | undefined
  runPlugin: <T>(id: string, entropyMap: Record<string, number>, options?: any) => T | null
}