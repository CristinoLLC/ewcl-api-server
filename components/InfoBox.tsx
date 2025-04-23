'use client'

import { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'

interface InfoBoxProps {
  title?: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export default function InfoBox({ 
  title = "About EWCL Benchmarking", 
  children, 
  defaultOpen = true 
}: InfoBoxProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left text-blue-800 font-medium"
      >
        {title}
        {isOpen ? (
          <ChevronUpIcon className="h-5 w-5" />
        ) : (
          <ChevronDownIcon className="h-5 w-5" />
        )}
      </button>
      
      {isOpen && (
        <div className="px-4 pb-4 text-sm text-blue-700">
          {children}
        </div>
      )}
    </div>
  )
}