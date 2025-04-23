'use client'
import React from 'react'

export function InlineMath({ formula }: { formula: string }) {
  return <code className="bg-gray-50 px-1 rounded">{formula}</code>;
}

export function BlockMath({ formula }: { formula: string }) {
  return (
    <div className="py-4 px-2 bg-gray-50 rounded-md overflow-x-auto text-center">
      <code className="text-lg">{formula}</code>
    </div>
  );
}