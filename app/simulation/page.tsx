'use client'
import Header from '@/components/Header'

export default function SimulationPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Entropy Simulator</h1>
          <p className="text-gray-600">
            Coming soon! This feature will allow you to simulate entropy-driven collapse dynamics with interactive controls.
          </p>
        </div>
      </main>
      <footer className="bg-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p>© 2025 EWCL Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}