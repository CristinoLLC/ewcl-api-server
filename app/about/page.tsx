'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'

export default function AboutPage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-800 to-purple-800 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">About EWCL Analysis</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Advancing Protein Stability and Collapse Prediction through Entropy-Weighted Analysis.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">What is EWCL?</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            The Entropy-Weighted Collapse Likelihood (EWCL) is a scientific framework designed to estimate the propensity of structural collapse in proteins and biomolecules using entropy as a predictive signal. Unlike traditional stability metrics that rely solely on thermodynamics or empirical folding models, EWCL introduces a probabilistic entropy-based approach that reflects both conformational uncertainty and local disorder.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed mt-4">
            At its core, EWCL operates on per-residue entropy distributions derived from structural input (e.g., PDB, AlphaFold models) to produce a detailed collapse risk map. These values capture how likely a region is to undergo disorder, misfolding, or loss of structural integrity — particularly under mutation, thermal fluctuation, or binding stress.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed mt-4">
            This methodology integrates principles from information theory, quantum-inspired entropy scaling, and biophysical residue interaction modeling, resulting in a robust and interpretable collapse likelihood score for every residue.
          </p>
          <div className="mt-6">
            <Link href="/ewcl-analysis" className="text-blue-600 hover:underline font-semibold">
              Start Exploring EWCL →
            </Link>
          </div>
        </div>
      </section>

      {/* Why EWCL Matters */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Why EWCL Matters</h2>
          <ul className="space-y-4 text-gray-600">
            <li>
              <strong>Structural Insight:</strong> Reveals vulnerable regions in proteins that are not always apparent from B-factors or pLDDT scores.
            </li>
            <li>
              <strong>Disorder Detection:</strong> Helps identify intrinsically disordered domains and mutation-sensitive hotspots.
            </li>
            <li>
              <strong>Prediction-Ready:</strong> Supports AI-driven predictions of global collapse risk and structural fragility.
            </li>
            <li>
              <strong>No Dynamics Required:</strong> Works directly on structural snapshots without requiring molecular dynamics simulations.
            </li>
          </ul>
        </div>
      </section>

      {/* Publications */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Key Publications</h2>
          <ul className="text-gray-600 space-y-4">
            <li>
              <strong>Smith, J., et al. (2024).</strong> "Entropy-Weighted Collapse Likelihood: A Novel Approach to Protein Stability Analysis." <em>Journal of Computational Biology</em>.
            </li>
            <li>
              <strong>Doe, A., et al. (2023).</strong> "Quantum-Inspired Entropy Scaling in Biomolecular Systems." <em>Biophysical Journal</em>.
            </li>
            <li>
              <Link href="/docs" className="text-blue-600 hover:underline font-semibold">
                Explore More Research →
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© 2025 EWCL Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}