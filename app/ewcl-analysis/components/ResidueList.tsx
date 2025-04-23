import React, { useState } from 'react';

interface ResidueListProps {
  entropyMap: Record<string, number>;
}

export default function ResidueList({ entropyMap }: ResidueListProps) {
  const [filterType, setFilterType] = useState<string>('all');
  
  const getResidueClass = (entropy: number) => {
    if (entropy < 0.3) return 'bg-green-600';
    if (entropy < 0.5) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const getResidueState = (entropy: number) => {
    if (entropy < 0.3) return 'Ordered';
    if (entropy < 0.5) return 'Transition';
    return 'Disordered';
  };
  
  const filteredResidues = Object.entries(entropyMap)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .filter(([_, entropy]) => {
      if (filterType === 'all') return true;
      if (filterType === 'ordered') return entropy < 0.3;
      if (filterType === 'transition') return entropy >= 0.3 && entropy < 0.5;
      if (filterType === 'disordered') return entropy >= 0.5;
      return true;
    });
  
  // Mock amino acid data (in a real app, this would come from the API)
  const getAminoAcid = (residueNumber: number) => {
    const aminoAcids = ['ALA', 'ARG', 'ASN', 'ASP', 'CYS', 'GLN', 'GLU', 'GLY', 'HIS', 'ILE', 
                        'LEU', 'LYS', 'MET', 'PHE', 'PRO', 'SER', 'THR', 'TRP', 'TYR', 'VAL'];
    return aminoAcids[residueNumber % aminoAcids.length];
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-medium mb-4">Residue Analysis</h3>
      
      <div className="mb-3">
        <label className="block text-sm text-gray-500 mb-1">Filter by state</label>
        <select 
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-sm"
        >
          <option value="all">All states</option>
          <option value="ordered">Ordered only (≤ 0.3)</option>
          <option value="transition">Transition only (0.3 - 0.5)</option>
          <option value="disordered">Disordered only (≥ 0.5)</option>
        </select>
      </div>
      
      <div className="overflow-auto max-h-80 border border-gray-200 rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AA</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entropy</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredResidues.map(([residue, entropy]) => (
              <tr key={residue} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-3 py-2 whitespace-nowrap text-sm">{residue}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm font-mono">{getAminoAcid(parseInt(residue))}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm">{entropy.toFixed(3)}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <span className={`inline-block h-4 w-4 rounded-full ${getResidueClass(entropy)}`} 
                    title={getResidueState(entropy)}></span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredResidues.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          No residues match the selected filter
        </div>
      )}
    </div>
  );
}