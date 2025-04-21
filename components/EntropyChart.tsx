'use client'

import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface EntropyChartProps {
  entropyData: Record<string, number>
}

export default function EntropyChart({ entropyData }: EntropyChartProps) {
  // Convert data to chart format
  const sortedEntries = Object.entries(entropyData)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
  
  const labels = sortedEntries.map(([residue]) => residue)
  const values = sortedEntries.map(([, value]) => value)
  
  // Create moving average data (window of 5)
  const movingAvg = values.map((val, idx, arr) => {
    if (idx < 2 || idx > arr.length - 3) return val
    
    // Average of 5 points centered on current
    let sum = 0
    for (let i = idx - 2; i <= idx + 2; i++) {
      sum += arr[i]
    }
    return sum / 5
  })
  
  // Calculate stats for display
  const minEntropy = Math.min(...values)
  const maxEntropy = Math.max(...values)
  const avgEntropy = values.reduce((sum, val) => sum + val, 0) / values.length

  const data = {
    labels,
    datasets: [
      {
        label: 'Residue Entropy',
        data: values,
        borderColor: 'rgba(225, 29, 72, 0.4)',
        backgroundColor: 'rgba(225, 29, 72, 0.1)', 
        pointRadius: 1,
        borderWidth: 1,
      },
      {
        label: 'Moving Average (window=5)',
        data: movingAvg,
        borderColor: 'rgba(225, 29, 72, 1)',
        backgroundColor: 'transparent',
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  }
  
  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      y: {
        min: 0,
        max: Math.min(1, Math.ceil(Math.max(...values) * 1.1 * 10) / 10),
        title: {
          display: true,
          text: 'Entropy Value',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Residue Number',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          title: (items: any[]) => {
            if (!items.length) return ''
            const idx = items[0].dataIndex
            return `Residue ${labels[idx]}`
          }
        }
      }
    },
  }
  
  return (
    <div className="bg-white p-4 rounded-md">
      {Object.keys(entropyData).length > 0 ? (
        <div>
          <div className="h-[300px]">
            <Line options={options} data={data} />
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center mt-4">
            <div>
              <p className="text-sm text-gray-500">Min Entropy</p>
              <p className="font-semibold">{minEntropy.toFixed(3)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Entropy</p>
              <p className="font-semibold">{avgEntropy.toFixed(3)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Max Entropy</p>
              <p className="font-semibold">{maxEntropy.toFixed(3)}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="w-full bg-gradient-to-r from-blue-500 via-white via-yellow-400 to-red-500 h-2 rounded"></div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0.0 (Ordered)</span>
              <span>0.25</span>
              <span>0.6</span>
              <span>1.0 (Disordered)</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          No entropy data available
        </div>
      )}
    </div>
  )
}