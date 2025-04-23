export function exportToCsv(entropyMap: Record<string, number>, proteinName: string) {
  // Generate CSV content
  let csvContent = "residue_number,entropy_value,state\n";
  
  Object.entries(entropyMap)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .forEach(([residue, entropy]) => {
      const state = entropy < 0.3 
        ? 'Ordered' 
        : entropy < 0.5 
          ? 'Transition' 
          : 'Disordered';
          
      csvContent += `${residue},${entropy.toFixed(4)},${state}\n`;
    });
  
  // Create and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${proteinName.replace(/\s+/g, '_')}_entropy.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJson(
  entropyMap: Record<string, number>, 
  proteinName: string, 
  entropyScore: number
) {
  // Create the JSON data
  const jsonData = {
    proteinName,
    entropyScore,
    analysisDate: new Date().toISOString(),
    residueEntropy: entropyMap
  };
  
  // Format the JSON string with indentation
  const jsonString = JSON.stringify(jsonData, null, 2);
  
  // Create and download the file
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${proteinName.replace(/\s+/g, '_')}_analysis.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportStructureImage() {
  // This would normally capture the current view of the MolstarViewer
  // For now, we'll just show an alert
  alert('This functionality would capture the current protein view as an image');
}