import React from 'react';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

interface SummaryCardProps {
  proteinName: string;
  entropyScore: number;
  residueCount: number;
  avgEntropy: number;
  minEntropy: number;
  maxEntropy: number;
}

export default function SummaryCard({
  proteinName,
  entropyScore,
  residueCount,
  avgEntropy,
  minEntropy,
  maxEntropy
}: SummaryCardProps) {
  
  // Determine collapse score classification
  const getCollapseScoreStatus = () => {
    if (entropyScore < 0.3) {
      return {
        label: 'Ordered',
        color: 'bg-green-100 text-green-800 border-green-200',
        description: 'Protein is likely to have a stable, well-defined structure'
      };
    } else if (entropyScore < 0.5) {
      return {
        label: 'Partially Disordered',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        description: 'Protein contains both structured and flexible regions'
      };
    } else {
      return {
        label: 'Highly Disordered',
        color: 'bg-red-100 text-red-800 border-red-200',
        description: 'Protein is likely to be intrinsically disordered'
      };
    }
  };
  
  const statusInfo = getCollapseScoreStatus();

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-medium mb-4">Analysis Summary</h3>
      
      <div className="mb-6">
        <span className="text-sm text-gray-500">Protein Name</span>
        <h2 className="text-xl font-bold">{proteinName}</h2>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm text-gray-500">Collapse Score</span>
            <div className="group relative ml-1 cursor-help">
              <QuestionMarkCircleIcon className="h-4 w-4 text-gray-400" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 w-48 z-10">
                The Entropy-Weighted Collapse Likelihood measures the overall disorder tendency of the protein structure
              </div>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-sm ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>
        
        <div className="mt-2">
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full`}
              style={{ 
                width: `${entropyScore * 100}%`, 
                background: 'linear-gradient(to right, #10B981, #FBBF24, #EF4444)' 
              }} 
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Ordered (0.0)</span>
            <span>{entropyScore.toFixed(2)}</span>
            <span>Disordered (1.0)</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mt-2">{statusInfo.description}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="text-sm text-gray-500">Residues</div>
          <div className="text-xl font-semibold">{residueCount}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="text-sm text-gray-500">Avg. Entropy</div>
          <div className="text-xl font-semibold">{avgEntropy.toFixed(3)}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="text-sm text-gray-500">Min Entropy</div>
          <div className="text-xl font-semibold">{minEntropy.toFixed(3)}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="text-sm text-gray-500">Max Entropy</div>
          <div className="text-xl font-semibold">{maxEntropy.toFixed(3)}</div>
        </div>
      </div>
    </div>
  );
}