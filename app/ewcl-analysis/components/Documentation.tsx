import Link from 'next/link'

export default function Documentation() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Documentation</h3>
      
      <p className="text-gray-600 mb-2"><strong>Entropy-Weighted Collapse Likelihood</strong></p>
      <p className="text-gray-600 mb-4">Measures the tendency of a protein to form a compact, folded structure versus a disordered ensemble</p>
      
      <p className="text-gray-600 mb-2">
        <span className="inline-block w-4 h-4 bg-green-300 mr-2"></span>
        <strong>Ordered Regions (&lt; 0.3)</strong>
      </p>
      <p className="text-gray-600 mb-4">Stable secondary structure elements like alpha helices and beta sheets</p>
      
      <p className="text-gray-600 mb-2">
        <span className="inline-block w-4 h-4 bg-yellow-300 mr-2"></span>
        <strong>Transition Regions (0.3 - 0.5)</strong>
      </p>
      <p className="text-gray-600 mb-4">Regions with some structure preference but higher flexibility</p>
      
      <p className="text-gray-600 mb-2">
        <span className="inline-block w-4 h-4 bg-red-300 mr-2"></span>
        <strong>Disordered Regions (&gt; 0.5)</strong>
      </p>
      <p className="text-gray-600 mb-4">Highly flexible regions that adopt multiple conformations</p>
      
      <Link href="/docs" className="text-red-500 hover:underline">View Full Documentation</Link>
    </div>
  )
}