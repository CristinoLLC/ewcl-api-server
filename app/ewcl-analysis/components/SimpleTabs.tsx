'use client'

import React, { useState } from 'react'

export function Tabs({ defaultValue, children }) {
  const [selectedTab, setSelectedTab] = useState(defaultValue)
  
  // Clone children and pass the selectedTab state
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { selectedTab, setSelectedTab })
    }
    return child
  })
  
  return <div>{childrenWithProps}</div>
}

export function TabsList({ children, selectedTab, setSelectedTab }) {
  // Clone TabsTrigger children and pass the selectedTab state
  const triggers = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { selectedTab, setSelectedTab })
    }
    return child
  })
  
  return <div className="flex border-b">{triggers}</div>
}

export function TabsTrigger({ value, className = '', children, selectedTab, setSelectedTab }) {
  const isActive = selectedTab === value
  
  return (
    <button
      className={`px-4 py-2 flex-1 ${
        isActive 
          ? 'text-rose-600 border-b-2 border-rose-600' 
          : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
      } ${className}`}
      onClick={() => setSelectedTab(value)}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, children, selectedTab }) {
  if (value !== selectedTab) return null
  return <div>{children}</div>
}