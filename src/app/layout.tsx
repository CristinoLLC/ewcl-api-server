/**
 * This file is part of the EWCL platform.
 * Root layout component that provides the consistent header, navigation,
 * and footer across all pages. Follows academic institution styling.
 */

import './globals.css'
import { Inter, Crimson_Text } from 'next/font/google'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Link from 'next/link'
import type { Metadata } from "next"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const crimson = Crimson_Text({ 
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-crimson'
})

export const metadata: Metadata = {
  title: "EWCL Protein Toolkit",
  description: "Analyze protein structures using the Entropy-Weighted Collapse Likelihood (EWCL) model",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${crimson.variable} h-full`}>
      <body className={`${inter.className} flex min-h-full flex-col bg-white`}>
        <Header />
        <main className="flex-1 bg-slate-50">
          {children}
        </main>
        <Footer />
        <ToastContainer position="bottom-right" />
      </body>
    </html>
  )
}