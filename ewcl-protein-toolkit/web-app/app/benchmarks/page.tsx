'use client'

import * as React from 'react'
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, 
  Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar,
  AreaChart, Area
} from 'recharts'
import { Timestamp } from 'firebase/firestore'
import { useState } from 'react'
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
  timestamp: Timestamp
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
  const [searchTerm, setSearchTerm] = useState('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [riskFilter, setRiskFilter] = useState<string>('All')
  const [filteredBenchmarks, setFilteredBenchmarks] = useState<Benchmark[]>(benchmarks)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [selectedBenchmark, setSelectedBenchmark] = useState<Benchmark | null>(null)

  // Filter benchmarks based on search term, date range, and risk level
  const filterBenchmarks = () => {
    let filtered = benchmarks;

    if (searchTerm) {
      filtered = filtered.filter(b => b.proteinName.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (startDate) {
      filtered = filtered.filter(b => {
        const date = b.timestamp instanceof Timestamp ? b.timestamp.toDate() : new Date(b.timestamp);
        return date >= new Date(startDate);
      });
    }

    if (endDate) {
      filtered = filtered.filter(b => {
        const date = b.timestamp instanceof Timestamp ? b.timestamp.toDate() : new Date(b.timestamp);
        return date <= new Date(endDate);
      });
    }

    if (riskFilter !== 'All') {
      filtered = filtered.filter(b => b.riskLevel === riskFilter);
    }

    setFilteredBenchmarks(filtered);
  }

  // Export filtered benchmarks to CSV
  const exportToCSV = () => {
    const csvRows = [
      ['Protein Name', 'Avg Score', 'Collapse Score', 'Risk Level', 'Date'],
      ...filteredBenchmarks.map(b => [
        b.proteinName,
        b.avgScore,
        b.collapseScore,
        b.riskLevel,
        b.timestamp instanceof Timestamp ? b.timestamp.toDate().toISOString() : new Date(b.timestamp).toISOString(),
      ]),
    ];

    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    saveAs(blob, 'filtered_benchmarks.csv');
  }

  const openModal = (benchmark: Benchmark) => {
    setSelectedBenchmark(benchmark);
    setModalIsOpen(true);
  }

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedBenchmark(null);
  }

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
        <button onClick={filterBenchmarks} className="bg-blue-500 text-white rounded p-2">
          Filter
        </button>
        <button onClick={exportToCSV} className="bg-green-500 text-white rounded p-2">
          Export to CSV
        </button>
      </div>

      {/* Benchmark Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredBenchmarks.map(benchmark => (
          <div key={benchmark.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-md font-medium mb-2">{benchmark.proteinName}</h4>
            <p>Avg Score: {benchmark.avgScore}</p>
            <p>Collapse Score: {benchmark.collapseScore}</p>
            <p>Risk Level: {benchmark.riskLevel}</p>
            <p>Date: {benchmark.timestamp instanceof Timestamp ? benchmark.timestamp.toDate().toLocaleDateString() : new Date(benchmark.timestamp).toLocaleDateString()}</p>
            <button onClick={() => openModal(benchmark)} className="bg-blue-500 text-white rounded p-2 mt-2">
              View 3D
            </button>
          </div>
        ))}
      </div>

      {/* Modal for 3D Viewer */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="3D Viewer">
        <h2 className="text-xl font-semibold mb-4">3D View of {selectedBenchmark?.proteinName}</h2>
        {selectedBenchmark && (
          <MolViewer pdbFile={selectedBenchmark.id} entropyMap={selectedBenchmark.maxEntropyResidue} />
        )}
        <button onClick={closeModal} className="bg-red-500 text-white rounded p-2 mt-4">
          Close
        </button>
      </Modal>

      {/* Other existing charts and stats... */}
    </div>
  )
}