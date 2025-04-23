'use client'

import React, { useEffect, useState } from 'react'
import { fetchBenchmarks } from '@/lib/firebase'

// Define a simple Button component
function Button({ children, onClick, className }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  )
}

export default function EWCLBenchmarkTable() {
  const [benchmarks, setBenchmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchBenchmarks()
        if (data && data.length > 0) {
          setBenchmarks(data)
        } else {
          setBenchmarks([])
        }
      } catch (err) {
        console.error('Error fetching benchmarks:', err)
        setError('Failed to load benchmarks.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>Loading benchmarks...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <table className="min-w-full bg-white border border-gray-200">
      <thead>
        <tr>
          <th className="px-4 py-2 border-b">Name</th>
          <th className="px-4 py-2 border-b">Score</th>
          <th className="px-4 py-2 border-b">Date</th>
        </tr>
      </thead>
      <tbody>
        {benchmarks.map((benchmark) => (
          <tr key={benchmark.id}>
            <td className="px-4 py-2 border-b">{benchmark.name}</td>
            <td className="px-4 py-2 border-b">{benchmark.score}</td>
            <td className="px-4 py-2 border-b">{new Date(benchmark.createdAt.seconds * 1000).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}