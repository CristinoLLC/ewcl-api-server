'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { ArrowRightIcon, BarChartIcon } from '@radix-ui/react-icons'
import clsx from 'clsx'
import { Mail, Github, Dna, FlaskConical, Brain } from 'lucide-react'
import { InlineMath, BlockMath } from '@/components/MathEquation'
import 'katex/dist/katex.min.css'

export default function LandingPage() {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-purple-900 py-24">
        <div className="container mx-auto px-4">
          <div className={`text-center text-white transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">EWCL Analysis Platform</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Advanced Protein Structure Analysis with Entropy-Weighted Collapse Likelihood
            </p>
            <Button
              onClick={() => router.push('/ewcl-analysis')}
              className="bg-white text-blue-900 hover:bg-blue-100 px-6 py-3 rounded-md text-lg font-medium"
            >
              Start Analysis →
            </Button>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Overview</h2>
        <p className="text-gray-600 max-w-3xl mx-auto text-center text-lg">
          The Entropy-Weighted Collapse Likelihood (EWCL) metric revolutionizes protein structure analysis by predicting residue-level structural collapse probabilities in biomolecular systems.
          By integrating quantum-inspired entropy principles with classical protein analysis, EWCL quantifies instability driven by entropy, offering researchers a powerful tool to study protein dynamics.
        </p>
      </section>

      {/* Core Equation Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">The Core Equation</h2>
          <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8 text-center">
            <BlockMath formula="\\text{EWCL}(r_i) = -k_B \\sum_j P_{ij} \\log P_{ij}" />
            <p className="text-gray-600 mt-4">
              The EWCL equation calculates the entropy-weighted collapse likelihood for residue{' '}
              <InlineMath formula="r_i" />. Here, <InlineMath formula="k_B" /> is the Boltzmann constant, and{' '}
              <InlineMath formula="P_{ij}" /> represents the probabilistic contact or fluctuation metric between residues{' '}
              <InlineMath formula="i" /> and <InlineMath formula="j" />, modulated by entropy.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Tools Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Interactive Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ToolCard
            icon={<FlaskConical className="h-12 w-12 text-blue-600 mb-4" />}
            title="Entropy Simulator"
            description="Simulate entropy-driven collapse dynamics with interactive controls."
            link="/simulation"
            linkText="Try Now →"
          />
          <ToolCard
            icon={<BarChartIcon className="h-12 w-12 text-blue-600 mb-4" />}
            title="Benchmark Dashboard"
            description="Review and compare historical analysis results with detailed metrics."
            link="/benchmarks"
            linkText="Explore →"
          />
          <ToolCard
            icon={<Brain className="h-12 w-12 text-blue-600 mb-4" />}
            title="Collapse Risk Predictor"
            description="Leverage AI to predict protein collapse scores with high accuracy."
            link="/ai"
            linkText="Predict →"
          />
          <ToolCard
            icon={<Dna className="h-12 w-12 text-blue-600 mb-4" />}
            title="Mutation Overlay Tool"
            description="Visualize the impact of mutations on collapse likelihood (coming soon)."
            link="#"
            linkText="Coming Soon"
            disabled
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">EWCL Analysis</h3>
              <p className="text-gray-400">
                Empowering researchers with advanced tools for protein structure analysis.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/simulation">Simulation</Link>
                </li>
                <li>
                  <Link href="/benchmarks">Benchmarks</Link>
                </li>
                <li>
                  <Link href="/ai">AI Predictor</Link>
                </li>
                <li>
                  <Link href="/docs">Documentation</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  <a href="mailto:support@ewclplatform.com" className="text-gray-400 hover:text-white">
                    support@ewclplatform.com
                  </a>
                </li>
                <li className="flex items-center">
                  <Github className="h-5 w-5 mr-2" />
                  <Link href="https://github.com/youruser/EWCL-platform" className="text-gray-400 hover:text-white">
                    GitHub
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400">
            <p>© 2025 EWCL Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Utility Button Component
function Button({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

// Utility ToolCard Component
function ToolCard({ icon, title, description, link, linkText, disabled }: any) {
  return (
    <div className={`p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      {icon}
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      {!disabled && (
        <Link href={link} className="text-blue-600 hover:underline font-semibold">
          {linkText}
        </Link>
      )}
    </div>
  )
}

// Utility function for AI inference
async function runAIInference(data: any) {
  try {
    const response = await fetch('https://ewcl-platform.onrender.com/runaiinference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching AI inference:', error);
    throw new Error('Failed to fetch AI inference results.');
  }
}

// Utility function for handling file upload
async function handleUpload(data: any) {
  try {
    const result = await runAIInference(data);
    // handle successful result
  } catch (error) {
    console.error(error);
    alert('There was an error processing your request. Please try again later.');
  }
}