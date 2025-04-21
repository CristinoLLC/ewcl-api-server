'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleSampleAnalysis = (sampleId: string) => {
    router.push(`/ewcl-analysis?sample=${sampleId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Animation */}
      <div className="relative bg-gradient-to-b from-indigo-50 via-rose-50 to-white overflow-hidden">
        {/* Animated protein structure background */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div className={`transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <div className="animate-float absolute top-1/4 left-1/4 w-64 h-64 bg-rose-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
            <div className="animate-float-delayed absolute top-1/3 right-1/4 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
            <div className="animate-float-slow absolute bottom-1/4 right-1/3 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className={`transition-all duration-700 delay-150 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 tracking-tight">
                EWCL <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-indigo-600">Analysis</span>
              </h1>
            </div>
            
            <div className={`transition-all duration-700 delay-300 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <p className="text-xl md:text-2xl text-gray-700 mb-10 leading-relaxed max-w-4xl mx-auto">
                Advanced protein structure analysis with entropy-weighted contact maps for identifying regions of order and disorder in biomolecular systems
              </p>
            </div>
            
            <div className={`transition-all duration-700 delay-450 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/ewcl-analysis" 
                  className="px-8 py-4 bg-gradient-to-r from-rose-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start Analysis
                </Link>
                <a 
                  href="#samples" 
                  className="px-8 py-4 bg-white text-gray-800 font-medium rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-300 border border-gray-200"
                >
                  View Samples
                </a>
              </div>
            </div>
            
            {/* Animated molecule visualization preview */}
            <div className={`mt-16 transition-all duration-1000 delay-600 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="relative h-64 md:h-96 bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* This would be replaced with an actual animation or image of a protein structure */}
                  <div className="w-full h-full bg-gradient-to-r from-gray-100 to-white flex items-center justify-center">
                    <div className="relative w-3/4 h-3/4">
                      <div className="animate-pulse-slow absolute w-32 h-32 md:w-48 md:h-48 bg-rose-100 rounded-full left-1/4 top-1/4 transform -translate-x-1/2 -translate-y-1/2"></div>
                      <div className="animate-pulse-slow absolute w-48 h-48 md:w-64 md:h-64 bg-blue-100 rounded-full right-1/4 bottom-1/4 transform translate-x-1/2 translate-y-1/2"></div>
                      <div className="animate-pulse-slow absolute w-24 h-24 md:w-40 md:h-40 bg-purple-100 rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl md:text-3xl font-light text-gray-400">Protein Structure Visualization</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Curved separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="white">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Key Features</h2>
          <p className="text-center text-gray-600 mb-16 max-w-3xl mx-auto">
            Powerful tools for researchers and scientists to analyze and understand protein structure dynamics
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-gradient-to-b from-white to-gray-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-3">Entropy Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Calculate and visualize residue-level entropy to identify regions of order and disorder within protein structures. Our algorithms provide insights into local stability and flexibility.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gradient-to-b from-white to-gray-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-3">3D Visualization</h3>
              <p className="text-gray-600 leading-relaxed">
                Interactive 3D visualization with entropy mapping, multiple representation styles, and residue highlighting. Explore protein structures with intuitive controls and export high-quality images.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gradient-to-b from-white to-gray-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-3">Comparative Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Compare multiple proteins or mutations to identify structural differences and changes in entropy profiles. Perfect for studying evolutionary relationships and functional variations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sample Analysis Section */}
      <div id="samples" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Research Samples</h2>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-16">
            Explore pre-loaded protein structures to see the toolkit in action. Each sample demonstrates different aspects of protein structure analysis.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sample 1 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-blue-50 h-56 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-50"></div>
                <img 
                  src="/samples/1ubq_preview.png" 
                  alt="Ubiquitin structure" 
                  className="max-h-full object-contain relative z-10"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://placehold.co/600x400/e0f2fe/0284c7?text=Ubiquitin";
                  }}
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <div className="h-8 w-1 bg-blue-500 rounded-full mr-3"></div>
                  <h3 className="font-bold text-2xl">Ubiquitin (1UBQ)</h3>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  A small regulatory protein with high structural order. 76 residues with a characteristic beta-grasp fold, serving critical functions in cellular processes.
                </p>
                <button 
                  onClick={() => handleSampleAnalysis('1ubq')}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 w-full font-medium"
                >
                  Analyze Structure
                </button>
              </div>
            </div>
            
            {/* Sample 2 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-green-50 h-56 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 opacity-50"></div>
                <img 
                  src="/samples/1cfc_preview.png" 
                  alt="Calmodulin structure" 
                  className="max-h-full object-contain relative z-10"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://placehold.co/600x400/dcfce7/16a34a?text=Calmodulin";
                  }}
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <div className="h-8 w-1 bg-green-500 rounded-full mr-3"></div>
                  <h3 className="font-bold text-2xl">Calmodulin (1CFC)</h3>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  A calcium-binding messenger protein with flexible linker regions. Exhibits both ordered and disordered domains, crucial for calcium signaling pathways.
                </p>
                <button 
                  onClick={() => handleSampleAnalysis('1cfc')}
                  className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 w-full font-medium"
                >
                  Analyze Structure
                </button>
              </div>
            </div>
            
            {/* Sample 3 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-purple-50 h-56 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100 opacity-50"></div>
                <img 
                  src="/samples/2ftl_preview.png" 
                  alt="Tau protein fragment" 
                  className="max-h-full object-contain relative z-10"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://placehold.co/600x400/f3e8ff/9333ea?text=Tau+Fragment";
                  }}
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <div className="h-8 w-1 bg-purple-500 rounded-full mr-3"></div>
                  <h3 className="font-bold text-2xl">Tau Fragment (2FTL)</h3>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  A fragment of the intrinsically disordered Tau protein. Shows high entropy values and minimal stable structure, relevant to neurodegenerative disease research.
                </p>
                <button 
                  onClick={() => handleSampleAnalysis('2ftl')}
                  className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 w-full font-medium"
                >
                  Analyze Structure
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Citation/Academic Section */}
      <div className="py-20 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Academic Research</h2>
            
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 mb-8">
              <h3 className="text-xl font-semibold mb-4">Citation</h3>
              <p className="font-mono text-sm bg-white p-4 rounded border border-gray-200 mb-4">
                Doe, J., Smith, A., & Johnson, B. (2025). Entropy-Weighted Contact Maps for Protein Structure Analysis. <em>Journal of Computational Structural Biology</em>, 42(3), 125-138. doi: 10.1234/jcsb.2025.42.3.125
              </p>
              <div className="flex justify-end">
                <button className="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                  </svg>
                  Copy Citation
                </button>
              </div>
            </div>
            
            <div className="text-center">
              <Link 
                href="/publications" 
                className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all duration-300 inline-flex items-center"
              >
                View Related Publications
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start">
            <div className="mb-10 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">EWCL Analysis</h3>
              <p className="text-gray-400 max-w-md">
                Advanced computational tools for structural biology research and biomolecular analysis.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
              <div>
                <h4 className="text-lg font-semibold mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tutorials</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Reference</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Community</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">GitHub</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Forum</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Publications</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">About</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Research Team</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Collaborators</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center md:text-left md:flex md:justify-between md:items-center">
            <p className="text-gray-500">© {new Date().getFullYear()} EWCL Analysis. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-6 justify-center md:justify-end">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(15px, -15px) rotate(5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        
        @keyframes float-delayed {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-15px, 15px) rotate(-5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        
        @keyframes float-slow {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(10px, 10px) rotate(3deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }

        @keyframes pulse-slow {
          0% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.05); opacity: 0.9; }
          100% { transform: scale(1); opacity: 0.7; }
        }
        
        .animate-float {
          animation: float 12s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 15s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
