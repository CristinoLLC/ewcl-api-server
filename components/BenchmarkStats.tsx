'use client'

import * as React from 'react'
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, 
  Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar,
  AreaChart, Area
} from 'recharts'
import { Timestamp } from 'firebase/firestore'

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
      
      {/* Top-level stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-500">Total Benchmarks</div>
          <div className="text-2xl font-semibold mt-1">{benchmarks.length}</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-500">Avg Collapse Score</div>
          <div className="text-2xl font-semibold mt-1">
            {(benchmarks.reduce((sum, b) => sum + b.collapseScore, 0) / benchmarks.length).toFixed(3)}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-500">High Risk Proteins</div>
          <div className="text-2xl font-semibold mt-1 text-red-600">
            {benchmarks.filter(b => b.riskLevel === 'High').length}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-500">Unique Proteins</div>
          <div className="text-2xl font-semibold mt-1">
            {new Set(benchmarks.map(b => b.proteinName)).size}
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
    </div>
  )
}
