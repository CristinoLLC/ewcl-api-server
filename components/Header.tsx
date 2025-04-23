'use client'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-900">
          EWCL Platform
        </Link>
        <div className="flex gap-6">
          <Link href="/" className="text-gray-600 hover:text-blue-600">Home</Link>
          <Link href="/ewcl-analysis" className="text-gray-600 hover:text-blue-600">Analysis</Link>
          <Link href="/benchmarks" className="text-gray-600 hover:text-blue-600">Benchmarks</Link>
          <Link href="/ai" className="text-gray-600 hover:text-blue-600">AI Predictor</Link>
          <Link href="/about" className="text-gray-600 hover:text-blue-600">About</Link>
        </div>
      </nav>
    </header>
  )
}
