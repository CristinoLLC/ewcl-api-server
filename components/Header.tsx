'use client'

import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow-md py-4">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">EWCL Analysis</h1>
        <nav>
          <Link href="/" className="text-gray-600 hover:text-red-500 mx-4">
            Home
          </Link>
          <Link href="/simulation" className="text-gray-600 hover:text-red-500 mx-4">
            Simulation
          </Link>
          <Link href="/benchmarks" className="text-gray-600 hover:text-red-500">
            Benchmarks
          </Link>
        </nav>
      </div>
    </header>
  )
}
