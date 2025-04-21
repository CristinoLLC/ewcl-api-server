'use client'

import React from 'react'
import Plot from 'react-plotly.js'
import { Layout, Config } from 'plotly.js'

interface PlotlyChartProps {
  data: any[]
  layout?: Partial<Layout>
  config?: Partial<Config>
  className?: string
}

const defaultLayout: Partial<Layout> = {
  margin: { t: 30, r: 30, b: 30, l: 30 },
  autosize: true
}

const defaultConfig: Partial<Config> = {
  responsive: true,
  displayModeBar: true,
  displaylogo: false
}

export function PlotlyChart({ 
  data, 
  layout = defaultLayout, 
  config = defaultConfig, 
  className = '' 
}: PlotlyChartProps) {
  return (
    <Plot
      data={data}
      layout={layout}
      config={config}
      className={className}
      style={{ width: '100%', height: '100%' }}
    />
  )
}

export default PlotlyChart 