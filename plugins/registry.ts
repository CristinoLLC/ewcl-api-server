import { createElement } from 'react';

// Define plugin interface
export interface EWCLPlugin {
  id: string;
  name: string;
  description?: string;
  run: <T>(data: any, options?: any) => T;
  render?: (output: any, props?: any) => JSX.Element;
}

// Registry API
const pluginRegistry = {
  plugins: {} as Record<string, EWCLPlugin>,
  
  register(plugin: EWCLPlugin) {
    this.plugins[plugin.id] = plugin;
    return this;
  },
  
  getPlugin(id: string) {
    return this.plugins[id];
  },
  
  runPlugin<T>(id: string, data: any, options?: any): T | null {
    const plugin = this.getPlugin(id);
    return plugin ? plugin.run<T>(data, options) : null;
  }
};

// CSV Exporter Plugin
pluginRegistry.register({
  id: 'csv-exporter',
  name: 'CSV Exporter',
  description: 'Export entropy data as CSV file',
  run: <string>(entropyMap: Record<string, number>): string => {
    let csvContent = 'Residue,Entropy,Classification\n';
    
    Object.entries(entropyMap)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .forEach(([residue, entropy]) => {
        let classification = 'Ordered';
        if (entropy > 0.5) classification = 'Disordered';
        else if (entropy > 0.3) classification = 'Transition';
        
        csvContent += `${residue},${entropy.toFixed(3)},${classification}\n`;
      });
      
    return csvContent;
  },
  render: (csvContent: string, props?: {filename?: string}) => {
    // Using createElement to avoid client component issues
    return createElement('button', {
      className: 'w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md mb-2 flex items-center justify-center',
      onClick: () => {
        // Create and download the CSV file
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = props?.filename || 'ewcl_entropy_data.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }, 
    [
      createElement('svg', {
        className: 'w-4 h-4 mr-2', 
        fill: 'none', 
        stroke: 'currentColor', 
        viewBox: '0 0 24 24',
        xmlns: 'http://www.w3.org/2000/svg'
      }, 
      createElement('path', {
        strokeLinecap: 'round', 
        strokeLinejoin: 'round', 
        strokeWidth: 2, 
        d: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
      })),
      'Export Entropy Data (CSV)'
    ]);
  }
});

// JSON Exporter Plugin
pluginRegistry.register({
  id: 'json-exporter',
  name: 'JSON Exporter',
  description: 'Export full analysis data as JSON file',
  run: <string>(entropyMap: Record<string, number>, options?: { 
    proteinName: string, 
    collapseScore: number,
    avgEntropy: number,
    minEntropy: number,
    maxEntropy: number
  }): string => {
    const analysisData = {
      name: options?.proteinName || 'Unknown Protein',
      collapseScore: options?.collapseScore || 0,
      avgEntropy: options?.avgEntropy || 0,
      minEntropy: options?.minEntropy || 0,
      maxEntropy: options?.maxEntropy || 0,
      residueCount: Object.keys(entropyMap).length,
      entropy: entropyMap,
      exported: new Date().toISOString()
    };
    
    return JSON.stringify(analysisData, null, 2);
  },
  render: (jsonContent: string, props?: {filename?: string}) => {
    return createElement('button', {
      className: 'w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md mb-2 flex items-center justify-center',
      onClick: () => {
        // Create and download the JSON file
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = props?.filename || 'ewcl_analysis.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }, 
    [
      createElement('svg', {
        className: 'w-4 h-4 mr-2', 
        fill: 'none', 
        stroke: 'currentColor', 
        viewBox: '0 0 24 24',
        xmlns: 'http://www.w3.org/2000/svg'
      }, 
      createElement('path', {
        strokeLinecap: 'round', 
        strokeLinejoin: 'round', 
        strokeWidth: 2, 
        d: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
      })),
      'Download Analysis (JSON)'
    ]);
  }
});

export default pluginRegistry;