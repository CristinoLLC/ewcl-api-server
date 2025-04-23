import React from 'react';
import { Line } from 'react-chartjs-2';

interface EntropyTrendChartProps {
  entropyData: number[];
  residueLabels: string[];
}

const EntropyTrendChart: React.FC<EntropyTrendChartProps> = ({ entropyData, residueLabels }) => {
  const data = {
    labels: residueLabels,
    datasets: [
      {
        label: 'Per-Residue Entropy',
        data: entropyData,
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold mb-4">Entropy Trend Chart</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default EntropyTrendChart;