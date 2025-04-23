import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  console.log('Rendered Navbar Links:', [
    { name: 'Home', href: '/' },
    { name: 'EWCL Analysis', href: '/ewcl-analysis' },
    { name: 'Benchmark', href: '/benchmarks' },
    { name: 'EWCL-AI', href: '/ai' },
  ])

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-lg font-bold text-gray-900">
              Home
            </Link>
          </div>

          <nav className="flex items-center space-x-6">
            <Link
              href="/ewcl-analysis"
              className={`text-sm font-medium ${pathname === '/ewcl-analysis' ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'}`}
            >
              EWCL Analysis
            </Link>
            <Link
              href="/benchmarks"
              className={`text-sm font-medium ${pathname === '/benchmarks' ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'}`}
            >
              Benchmark
            </Link>
            <Link
              href="/ai"
              className={`text-sm font-medium ${pathname === '/ai' ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'}`}
            >
              EWCL-AI
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}