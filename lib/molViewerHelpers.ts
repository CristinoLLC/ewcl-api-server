// Helper functions for MolViewer

// Color the structure based on entropy values
export function applyEntropyColoring(viewer: any, model: any, entropyMap: Record<string, number>) {
  if (!entropyMap || Object.keys(entropyMap).length === 0) return;
  
  // Clear previous styles
  model.setStyle({}, {cartoon: {color: 'white'}});
  
  // Apply entropy-based coloring
  Object.entries(entropyMap).forEach(([residue, entropy]) => {
    let color = 'green';
    if (entropy > 0.6) color = 'red';
    else if (entropy > 0.25) color = 'yellow';
    
    model.setStyle({resi: Number(residue)}, {cartoon: {color: color}});
  });
  
  viewer.render();
}

// Enable residue selection
export function enableResidueSelection(viewer: any, model: any, onResidueSelect: (residue: number) => void) {
  viewer.setClickable({}, true, (atom: any) => {
    if (atom && atom.resi) {
      onResidueSelect(atom.resi);
    }
  });
}