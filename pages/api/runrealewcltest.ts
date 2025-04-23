import { NextRequest, NextResponse } from 'next/server'

export const config = { api: { bodyParser: false } }

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Forward the file to your Render FastAPI backend
    const renderUrl = process.env.NEXT_PUBLIC_EWCL_API!
    const response = await fetch(renderUrl, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Render API error:', errorText)
      return NextResponse.json({ error: 'Render API error', details: errorText }, { status: response.status })
    }

    const result = await response.json()

    if (!Array.isArray(result?.per_residue_scores)) {
      return NextResponse.json({ error: 'Invalid inference output' }, { status: 502 })
    }

    return NextResponse.json({ result })
  } catch (err: any) {
    console.error('EWCL Real Test Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}