import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'

export const config = { api: { bodyParser: false } }

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('Content-Type') || ''
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Expected multipart/form-data' }, { status: 400 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const threshold = parseFloat((formData.get('threshold') as string) || '0.5')
    const proteinName = (formData.get('name') as string) || 'unknown'

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // upload .pdb to Vercel Blob
    const buffer = await file.arrayBuffer()
    const blob = new Blob([buffer], { type: file.type || 'application/octet-stream' })
    const upload = await put(`ewcl/${proteinName}-${Date.now()}.pdb`, blob)
    const blobUrl = upload.url

    // call primary FastAPI
    let result: any = null
    let success = false
    try {
      const renderResp = await fetch('https://ewcl-platform.onrender.com/runrealewcltest', {
        method: 'POST',
        body: formData,
      })
      result = await renderResp.json()
      success = renderResp.ok
    } catch (e) {
      console.warn('Render backend failed:', e)
    }

    // fallback to DeepInfra
    if (!success) {
      const text = await file.text()
      const deepResp = await fetch(
        'https://api.deepinfra.com/v1/inference/crKu0dVZjIWTXxYh75HTlwf1AJsANFHB',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.DEEPINFRA_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pdb: text }),
        }
      )
      result = await deepResp.json()
      success = deepResp.ok
    }

    // after calling DeepInfra and before uploading results.json
    if (!success) {
      return NextResponse.json({ error: 'Inference failed from both sources' }, { status: 502 })
    }

    // defensive check for per_residue_scores
    if (!Array.isArray(result.per_residue_scores)) {
      return NextResponse.json({ error: 'Invalid inference output' }, { status: 502 })
    }

    // upload results.json
    const resultBlob = new Blob([JSON.stringify(result)], { type: 'application/json' })
    const resultUpload = await put(`ewcl/${proteinName}-${Date.now()}-results.json`, resultBlob)
    const resultUrl = resultUpload.url

    // persist summary to Firestore
    const scores = result.per_residue_scores as number[]
    const maxScore = Math.max(...scores)
    const maxIndex = scores.indexOf(maxScore)
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length

    await addDoc(collection(db, 'benchmarks'), {
      proteinName,
      blobUrl,
      resultUrl,
      timestamp: new Date(),
      length: scores.length,
      maxEntropyResidue: maxIndex,
      avgScore,
      collapseScore: result.collapse_score ?? avgScore,
      riskLevel: result.risk_level ?? 'Unknown',
    })

    return NextResponse.json({
      proteinName,
      blobUrl,
      resultUrl,
      maxEntropyResidue: maxIndex,
      avgScore,
      result,
    })
  } catch (err: any) {
    console.error('EWCL Real Test Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Example usage of the API
const form = new FormData()
form.append('file', selectedPDBFile)
form.append('name', 'Tau')
form.append('threshold', '0.6')

await fetch('/api/ewcl-infer', {
  method: 'POST',
  body: form,
})