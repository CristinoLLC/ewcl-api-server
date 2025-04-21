'use client'

import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine, TooltipProps 
} from 'recharts';

interface EntropyTrendChartProps {
  entropyMap: Record<string, number>;
}

export default function EntropyTrendChart({ entropyMap }: EntropyTrendChartProps) {
  // Convert entropy map to array for chart
  const chartData = Object.entries(entropyMap)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([residue, entropy]) => ({
      residue: parseInt(residue),
      entropy
    }));
  
  const getEntropyStatusColor = (value: number) => {
    if (value < 0.3) return '#10B981'; // Green for ordered
    if (value < 0.5) return '#FBBF24'; // Yellow for transition
    return '#EF4444'; // Red for disordered
  };
  
  const getEntropyStatus = (value: number) => {
    if (value < 0.3) return 'Ordered';
    if (value < 0.5) return 'Transition';
    return 'Disordered';
  };
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const entropy = payload[0].value as number;
      
      return (
        <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
          <p className="mb-1"><span className="font-medium">Residue:</span> {label}</p>
          <p className="mb-1"><span className="font-medium">Entropy:</span> {entropy.toFixed(3)}</p>
          <div className="flex items-center gap-2">
            <span className="font-medium">Status:</span>
            <span 
              className="px-2 py-0.5 text-xs rounded-full" 
              style={{ 
                backgroundColor: getEntropyStatusColor(entropy),
                color: entropy < 0.5 ? '#000' : '#fff'
              }}
            >
              {getEntropyStatus(entropy)}
            </span>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-4">Residue Entropy Profile</h3>
      <div className="h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="residue" 
              label={{ 
                value: 'Residue Position', 
                position: 'insideBottom', 
                offset: -5 
              }} 
            />
            <YAxis 
              domain={[0, 1]} 
              label={{ 
                value: 'Entropy', 
                angle: -90, 
                position: 'insideLeft' 
              }} 
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Reference lines for disorder thresholds */}
            <ReferenceLine y={0.3} stroke="#10B981" strokeDasharray="3 3" />
            <ReferenceLine y={0.5} stroke="#FBBF24" strokeDasharray="3 3" />
            
            {/* Main entropy line */}
            <Line
              type="monotone"
              dataKey="entropy"
              stroke="#EF4444"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, stroke: '#EF4444', strokeWidth: 1, fill: '#fff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="flex justify-center mt-4 gap-6">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 mr-2"></div>
          <span className="text-sm">Ordered (&lt;0.3)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-500 mr-2"></div>
          <span className="text-sm">Transition (0.3-0.5)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 mr-2"></div>
          <span className="text-sm">Disordered (&gt;0.5)</span>
        </div>
      </div>
    </div>
  );
}