'use client'

import Header from '@/components/Header';
import EWCLBenchmarkTable from '@/components/EWCLBenchmarkTable'; // ← import your table

export default function BenchmarksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">EWCL Benchmarks</h1>
          
          {/* render the table component */}
          <EWCLBenchmarkTable />
        </div>
      </main>
    </div>
  );
}