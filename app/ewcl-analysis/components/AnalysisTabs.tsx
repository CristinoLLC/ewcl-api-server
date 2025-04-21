'use client'

import { useState } from 'react'
import { Line } from 'react-chartjs-2'
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface AnalysisTabsProps {
  entropyMap: Record<string, number>
  getResidueClassification: (entropy: number) => string
}

export default function AnalysisTabs({ entropyMap, getResidueClassification }: AnalysisTabsProps) {
  const [activeTab, setActiveTab] = useState('entropy')
  
  // Process residue data
  const sortedResidues = Object.keys(entropyMap)
    .map(Number)
    .sort((a, b) => a - b)
    .map(String)
  
  const entropyValues = sortedResidues.map(residue => entropyMap[residue])
  
  // Count residues by classification
  const orderedCount = Object.values(entropyMap).filter(val => val < 0.3).length
  const transitionCount = Object.values(entropyMap).filter(val => val >= 0.3 && val <= 0.5).length
  const disorderedCount = Object.values(entropyMap).filter(val => val > 0.5).length
  
  // Create chart data
  const chartData = {
    labels: sortedResidues,
    datasets: [
      {
        label: 'Entropy',
        data: entropyValues,
        borderColor: 'rgb(220, 38, 38)',
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        borderWidth: 2,
        pointRadius: 1,
        pointHoverRadius: 5,
        fill: true
      }
    ]
  }
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems: any) => {
            return `Residue ${tooltipItems[0].label}`
          },
          label: (context: any) => {
            const value = context.parsed.y;
            const classification = getResidueClassification(value);
            return [
              `Entropy: ${value.toFixed(3)}`,
              `Classification: ${classification}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Residue Number'
        },
        ticks: {
          maxTicksLimit: 20
        }
      },
      y: {
        title: {
          display: true,
          text: 'Entropy Value'
        },
        min: 0,
        max: 1
      }
    }
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex">
          <button
            onClick={() => setActiveTab('entropy')}
            className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${
              activeTab === 'entropy'
                ? 'border-rose-500 text-rose-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Entropy Chart
          </button>
          <button
            onClick={() => setActiveTab('structure')}
            className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${
              activeTab === 'structure'
                ? 'border-rose-500 text-rose-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Structure Analysis
          </button>
          <button
            onClick={() => setActiveTab('residue')}
            className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${
              activeTab === 'residue'
                ? 'border-rose-500 text-rose-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Residue Analysis
          </button>
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'entropy' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Entropy Distribution</h3>
            <div className="h-64">
              <Line data={chartData} options={chartOptions} />
            </div>
            <div className="mt-4 flex space-x-4 text-sm">
              <div className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-green-500 mr-1"></span>
                <span className="text-gray-600">{'< 0.3: Ordered'}</span>
              </div>
              <div className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-yellow-500 mr-1"></span>
                <span className="text-gray-600">{'0.3-0.5: Transition'}</span>
              </div>
              <div className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-red-500 mr-1"></span>
                <span className="text-gray-600">{'>0.5: Disordered'}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'structure' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Structure Analysis</h3>
            
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-800 mb-2">Disorder Distribution</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Ordered Regions (&lt;0.3)</span>
                    <span>{Math.round(orderedCount / Object.keys(entropyMap).length * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${orderedCount / Object.keys(entropyMap).length * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Transition Regions (0.3-0.5)</span>
                    <span>{Math.round(transitionCount / Object.keys(entropyMap).length * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${transitionCount / Object.keys(entropyMap).length * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Disordered Regions (&gt;0.5)</span>
                    <span>{Math.round(disorderedCount / Object.keys(entropyMap).length * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${disorderedCount / Object.keys(entropyMap).length * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-medium text-gray-800 mb-2">Secondary Structure Estimation</h4>
              <p className="text-gray-600 mb-3">
                Estimated secondary structure based on entropy distribution:
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-gray-700">
                    {Math.round((orderedCount / Object.keys(entropyMap).length) * 60)}%
                  </div>
                  <div className="text-sm text-gray-600">Helices</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-gray-700">
                    {Math.round((orderedCount / Object.keys(entropyMap).length) * 40)}%
                  </div>
                  <div className="text-sm text-gray-600">Sheets</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-gray-700">
                    {Math.round((transitionCount + disorderedCount) / Object.keys(entropyMap).length * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Loops/Coils</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'residue' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Residue Analysis</h3>
            
            {/* Entropy Heatmap */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-800 mb-2">Entropy Heatmap</h4>
              <div className="w-full h-16 relative mb-1 bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 rounded-md">
                {sortedResidues.map((residue, index) => {
                  const entropy = entropyMap[residue];
                  const position = index / (sortedResidues.length - 1) * 100;
                  return (
                    <div 
                      key={residue}
                      className="absolute top-full mt-1 transform -translate-x-1/2"
                      style={{ left: `${position}%` }}
                    >
                      {index % 10 === 0 && (
                        <div className="text-xs text-gray-600">{residue}</div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-6">
                <span>0.0 (Ordered)</span>
                <span>0.5 (Transition)</span>
                <span>1.0 (Disordered)</span>
              </div>
            </div>
            
            {/* Residue Table */}
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Residue
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entropy
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Classification
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedResidues.map(residue => {
                    const entropy = entropyMap[residue];
                    const classification = getResidueClassification(entropy);
                    return (
                      <tr key={residue} className="hover:bg-gray-50">
                        <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          {residue}
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                          {entropy.toFixed(3)}
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${classification === 'Ordered' ? 'bg-green-100 text-green-800' : 
                              classification === 'Transition' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}`}>
                            {classification}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}