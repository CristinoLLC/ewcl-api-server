'use client'

import dynamic from 'next/dynamic'
import '../styles/molstar.css'

const MolViewer = dynamic(
  () => import('./MolViewer'),
  { ssr: false }
)

export default function MolstarContainer(props: any) {
  return (
    <MolViewer {...props} />
  )
}