'use client'

import React, { useState } from 'react'

interface CollapseScoreHelperProps {
  score: number
}

const CollapseScoreHelper: React.FC<CollapseScoreHelperProps> = ({ score }) => {
  const [showTooltip, setShowTooltip] = useState(false)
  
  const getScoreClassification = () => {
    if (score < 0.3) return { text: 'Globular/Ordered', color: 'bg-green-500' }
    if (score <= 0.5) return { text: 'Semi-Disordered', color: 'bg-yellow-500' }
    return { text: 'Disordered/IDP-like', color: 'bg-red-500' }
  }
  
  const { text, color } = getScoreClassification()

  return (
    <div className="inline-flex items-center relative">
      <div 
        className="flex items-center cursor-help ml-2" 
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <span className={`w-3 h-3 rounded-full ${color} mr-1.5`}></span>
        <span className="text-sm font-medium">{text}</span>
        
        {showTooltip && (
          <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-black bg-opacity-90 text-white text-xs rounded shadow-lg z-10">
            <p>
              <strong>Collapse Score Interpretation:</strong><br />
              &lt; 0.3: Globular/Ordered protein<br />
              0.3-0.5: Semi-Disordered protein<br />
              &gt; 0.5: Disordered/IDP-like protein
            </p>
            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black border-opacity-90"></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CollapseScoreHelper