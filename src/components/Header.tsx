"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-slate-900">
              EWCL Protein Toolkit
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link
                href="/ewcl-analysis"
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Analysis
              </Link>
              <Link
                href="/benchmarks"
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Benchmarks
              </Link>
              <Link
                href="/documentation"
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Documentation
              </Link>
            </nav>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/contact">Contact Lab</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}