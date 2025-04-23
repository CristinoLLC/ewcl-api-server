import React, { useEffect, useRef } from 'react';
import { PluginUIComponent } from 'molstar/lib/mol-plugin-ui/component';
import { PluginContext } from 'molstar/lib/mol-plugin/context';
import { Structure } from 'molstar/lib/mol-model/structure';
import { PluginConfig } from 'molstar/lib/mol-plugin/config';

interface MolstarViewerProps {
    pdbData: string; // PDB or JSON data
    entropyData: any; // Entropy overlay data
}

const MolstarViewer: React.FC<MolstarViewerProps> = ({ pdbData, entropyData }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const pluginRef = useRef<PluginUIComponent | null>(null);

    useEffect(() => {
        if (containerRef.current) {
            const plugin = new PluginUIComponent(containerRef.current, {
                layout: 'auto',
                // Additional configuration can be added here
            });
            pluginRef.current = plugin;

            // Load the structure
            plugin.loadStructure(pdbData).then(() => {
                // Apply entropy overlay if provided
                if (entropyData) {
                    plugin.applyEntropyOverlay(entropyData);
                }
            });

            return () => {
                plugin.dispose();
            };
        }
    }, [pdbData, entropyData]);

    return <div ref={containerRef} className="molstar-viewer" />;
};

export default MolstarViewer;