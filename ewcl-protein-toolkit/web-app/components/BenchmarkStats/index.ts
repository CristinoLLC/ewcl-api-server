'use client'

import * as React from 'react'
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, 
  Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar,
  AreaChart, Area
} from 'recharts'
import { Timestamp } from 'firebase/firestore'
import { saveAs } from 'file-saver'
import Modal from 'react-modal'
import MolViewer from './MolViewer' // Assuming you have a MolViewer component

// Import the Benchmark interface from your table component
interface Benchmark {
  id: string
  proteinName: string
  avgScore: number
  collapseScore: number
  maxEntropyResidue: number
  riskLevel: 'Low' | 'Medium' | 'High'
  timestamp: Timestamp // <-- explicitly typed
  length?: number
}

interface BenchmarkStatsProps {
  benchmarks: Benchmark[]
}

const COLORS = {
  Low: '#10B981', // Green
  Medium: '#F59E0B', // Yellow/Amber
  High: '#EF4444', // Red
}

export default function BenchmarkStats({ benchmarks }: BenchmarkStatsProps) {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [startDate, setStartDate] = React.useState<string>('')
  const [endDate, setEndDate] = React.useState<string>('')
  const [riskFilter, setRiskFilter] = React.useState<string>('All')
  const [filteredBenchmarks, setFilteredBenchmarks] = React.useState<Benchmark[]>(benchmarks)
  const [modalIsOpen, setModalIsOpen] = React.useState(false)
  const [selectedBenchmark, setSelectedBenchmark] = React.useState<Benchmark | null>(null)

  React.useEffect(() => {
    filterBenchmarks()
  }, [searchTerm, startDate, endDate, riskFilter, benchmarks])

  const filterBenchmarks = () => {
    const filtered = benchmarks.filter(b => {
      const date = b.timestamp instanceof Timestamp ? b.timestamp.toDate() : new Date(b.timestamp)
      const isWithinDateRange = (!startDate || date >= new Date(startDate)) && (!endDate || date <= new Date(endDate))
      const matchesRiskLevel = riskFilter === 'All' || b.riskLevel === riskFilter
      const matchesSearchTerm = b.proteinName.toLowerCase().includes(searchTerm.toLowerCase())
      return isWithinDateRange && matchesRiskLevel && matchesSearchTerm
    })
    setFilteredBenchmarks(filtered)
  }

  const handleExportCSV = () => {
    const csvRows = [
      ['Protein Name', 'Avg Score', 'Collapse Score', 'Risk Level', 'Date'],
      ...filteredBenchmarks.map(b => {
        const date = b.timestamp instanceof Timestamp ? b.timestamp.toDate() : new Date(b.timestamp)
        return [b.proteinName, b.avgScore, b.collapseScore, b.riskLevel, date.toISOString()]
      }),
    ]
    const csvContent = csvRows.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    saveAs(blob, 'filtered_benchmarks.csv')
  }

  const openModal = (benchmark: Benchmark) => {
    setSelectedBenchmark(benchmark)
    setModalIsOpen(true)
  }

  const closeModal = () => {
    setModalIsOpen(false)
    setSelectedBenchmark(null)
  }

  if (!benchmarks || benchmarks.length === 0) {
    return null
  }

  // Risk distribution data
  const riskCounts = benchmarks.reduce((acc, curr) => {
    acc[curr.riskLevel] = (acc[curr.riskLevel] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const pieData = Object.entries(riskCounts).map(([name, value]) => ({
    name,
    value,
  }))

  // Time series data (submissions by month)
  const submissionsByMonth = benchmarks.reduce((acc, curr) => {
    let date: Date
    if (curr.timestamp instanceof Timestamp) {
      date = curr.timestamp.toDate()
    } else if (typeof curr.timestamp === 'string' || typeof curr.timestamp === 'number') {
      date = new Date(curr.timestamp)
    } else {
      console.warn('Invalid timestamp:', curr.timestamp)
      return acc // skip invalid timestamps
    }

    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

    if (!acc[monthYear]) {
      acc[monthYear] = {
        month: monthYear,
        count: 0,
        avgScore: 0,
        highRisk: 0,
        mediumRisk: 0,
        lowRisk: 0,
      }
    }

    acc[monthYear].count += 1
    acc[monthYear].avgScore += curr.collapseScore

    if (curr.riskLevel === 'High') acc[monthYear].highRisk += 1
    if (curr.riskLevel === 'Medium') acc[monthYear].mediumRisk += 1
    if (curr.riskLevel === 'Low') acc[monthYear].lowRisk += 1

    return acc
  }, {} as Record<string, any>)
  
  // Calculate average score for each month
  Object.values(submissionsByMonth).forEach(month => {
    month.avgScore = month.avgScore / month.count
  })
  
  // Sort months chronologically
  const trendData = Object.values(submissionsByMonth)
    .sort((a, b) => a.month.localeCompare(b.month))

  // Most analyzed proteins
  const proteinCounts = benchmarks.reduce((acc, curr) => {
    acc[curr.proteinName] = (acc[curr.proteinName] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const topProteins = Object.entries(proteinCounts)
    .sort(([, countA], [, countB]) => countB - countA) // Sort by count, descending
    .slice(0, 5) // Take top 5
    .map(([name, count]) => ({ name, count }))

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-semibold text-gray-800">Benchmark Analytics</h3>

      {/* Filters */}
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search by Protein Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded p-2"
        />
        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="border rounded p-2"
        >
          <option value="All">All Risk Levels</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button
          onClick={handleExportCSV}
          className="bg-blue-500 text-white rounded p-2"
        >
          Export to CSV
        </button>
      </div>

      {/* Top-level stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-500">Total Benchmarks</div>
          <div className="text-2xl font-semibold mt-1">{filteredBenchmarks.length}</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-500">Avg Collapse Score</div>
          <div className="text-2xl font-semibold mt-1">
            {(filteredBenchmarks.reduce((sum, b) => sum + b.collapseScore, 0) / filteredBenchmarks.length).toFixed(3)}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-500">High Risk Proteins</div>
          <div className="text-2xl font-semibold mt-1 text-red-600">
            {filteredBenchmarks.filter(b => b.riskLevel === 'High').length}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-500">Unique Proteins</div>
          <div className="text-2xl font-semibold mt-1">
            {new Set(filteredBenchmarks.map(b => b.proteinName)).size}
          </div>
        </div>
      </div>
      
      {/* Risk distribution and trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-md font-medium mb-4">Risk Distribution</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry) => (
                    <Cell 
                      key={entry.name} 
                      fill={COLORS[entry.name as keyof typeof COLORS] || '#CCCCCC'} 
                    />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Submissions Over Time */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-md font-medium mb-4">Submissions Over Time</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stackId="1"
                  stroke="#8884d8" 
                  fill="#8884d8"
                  name="Total Submissions" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* More detailed charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Levels Over Time */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-md font-medium mb-4">Risk Levels Over Time</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="highRisk" stackId="a" name="High Risk" fill={COLORS.High} />
                <Bar dataKey="mediumRisk" stackId="a" name="Medium Risk" fill={COLORS.Medium} />
                <Bar dataKey="lowRisk" stackId="a" name="Low Risk" fill={COLORS.Low} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Average Score Trend */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-md font-medium mb-4">Average Collapse Score Trend</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 1]} />
                <RechartsTooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="avgScore" 
                  stroke="#2563eb" 
                  name="Avg. Collapse Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Most Analyzed Proteins */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h4 className="text-md font-medium mb-4">Most Analyzed Proteins</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topProteins}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" name="Submission Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Benchmark Table */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h4 className="text-md font-medium mb-4">Benchmark Details</h4>
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="border-b p-2">Protein Name</th>
              <th className="border-b p-2">Avg Score</th>
              <th className="border-b p-2">Collapse Score</th>
              <th className="border-b p-2">Risk Level</th>
              <th className="border-b p-2">Date</th>
              <th className="border-b p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBenchmarks.map(benchmark => {
              const date = benchmark.timestamp instanceof Timestamp ? benchmark.timestamp.toDate() : new Date(benchmark.timestamp)
              return (
                <tr key={benchmark.id}>
                  <td className="border-b p-2">{benchmark.proteinName}</td>
                  <td className="border-b p-2">{benchmark.avgScore}</td>
                  <td className="border-b p-2">{benchmark.collapseScore}</td>
                  <td className="border-b p-2">{benchmark.riskLevel}</td>
                  <td className="border-b p-2">{date.toISOString().split('T')[0]}</td>
                  <td className="border-b p-2">
                    <button
                      onClick={() => openModal(benchmark)}
                      className="bg-blue-500 text-white rounded p-1"
                    >
                      View 3D
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Modal for 3D Viewer */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="3D Viewer">
        <h2 className="text-xl font-semibold mb-4">3D View of {selectedBenchmark?.proteinName}</h2>
        {selectedBenchmark && (
          <MolViewer pdbFile={selectedBenchmark.id} entropyMap={selectedBenchmark.maxEntropyResidue} />
        )}
        <button onClick={closeModal} className="mt-4 bg-red-500 text-white rounded p-2">Close</button>
      </Modal>
    </div>
  )
}