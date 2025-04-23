'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface EntropyTrendChartProps {
  data: number[]
  residueRange?: [number, number]
}

export function EntropyTrendChart({ data, residueRange }: EntropyTrendChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !data.length) return

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove()

    // Setup dimensions
    const margin = { top: 20, right: 30, bottom: 40, left: 50 }
    const width = svgRef.current.clientWidth - margin.left - margin.right
    const height = svgRef.current.clientHeight - margin.top - margin.bottom

    // Create scales
    const startResidue = residueRange ? residueRange[0] : 1
    const x = d3.scaleLinear()
      .domain([startResidue, startResidue + data.length - 1])
      .range([0, width])

    const y = d3.scaleLinear()
      .domain([0, Math.max(...data)])
      .range([height, 0])
      .nice()

    // Create SVG
    const svg = d3.select(svgRef.current)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(10))
      .append('text')
      .attr('x', width / 2)
      .attr('y', 35)
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'middle')
      .text('Residue Number')

    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(y))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -height / 2)
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'middle')
      .text('Collapse Likelihood')

    // Create gradient
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'line-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0)
      .attr('y1', y(0))
      .attr('x2', 0)
      .attr('y2', y(Math.max(...data)))

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'rgb(0, 0, 255)')

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'rgb(255, 0, 0)')

    // Add the line
    const line = d3.line<number>()
      .x((d, i) => x(startResidue + i))
      .y(d => y(d))
      .curve(d3.curveMonotoneX)

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'url(#line-gradient)')
      .attr('stroke-width', 2)
      .attr('d', line)

    // Add hover effects
    const focus = svg.append('g')
      .style('display', 'none')

    focus.append('circle')
      .attr('r', 4)
      .attr('fill', 'white')
      .attr('stroke', 'black')
      .attr('stroke-width', 1.5)

    focus.append('text')
      .attr('x', 9)
      .attr('dy', '.35em')
      .attr('font-size', '12px')

    const overlay = svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .style('fill', 'none')
      .style('pointer-events', 'all')

    overlay.on('mouseover', () => focus.style('display', null))
      .on('mouseout', () => focus.style('display', 'none'))
      .on('mousemove', (event) => {
        const mouseX = d3.pointer(event)[0]
        const xInverse = x.invert(mouseX)
        const index = Math.round(xInverse - startResidue)
        
        if (index >= 0 && index < data.length) {
          const value = data[index]
          focus.attr('transform', `translate(${x(startResidue + index)},${y(value)})`)
          focus.select('text')
            .text(`Residue ${startResidue + index}: ${value.toFixed(3)}`)
            .attr('transform', `translate(${mouseX > width/2 ? -10 : 10},${-10})`)
            .style('text-anchor', mouseX > width/2 ? 'end' : 'start')
        }
      })

  }, [data, residueRange])

  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      style={{ minHeight: '300px' }}
    />
  )
} 