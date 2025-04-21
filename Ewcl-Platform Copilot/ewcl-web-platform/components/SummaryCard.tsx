import React from 'react';

interface SummaryCardProps {
  averageEntropy: number;
  maxEntropy: number;
  minEntropy: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ averageEntropy, maxEntropy, minEntropy }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-2">Entropy Summary</h2>
      <div className="flex flex-col">
        <div className="mb-1">
          <span className="font-medium">Average Entropy:</span> {averageEntropy.toFixed(2)}
        </div>
        <div className="mb-1">
          <span className="font-medium">Max Entropy:</span> {maxEntropy.toFixed(2)}
        </div>
        <div className="mb-1">
          <span className="font-medium">Min Entropy:</span> {minEntropy.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;