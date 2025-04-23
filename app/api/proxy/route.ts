import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')
  
  if (!url) {
    return NextResponse.json({ error: 'No URL provided' }, { status: 400 })
  }
  
  try {
    const response = await fetch(url)
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch from source: ${response.statusText}` },
        { status: response.status }
      )
    }
    
    const contentType = response.headers.get('content-type') || 'text/plain'
    const data = await response.text()
    
    return new NextResponse(data, {
      headers: {
        'content-type': contentType,
        'access-control-allow-origin': '*'
      }
    })
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch the requested URL' },
      { status: 500 }
    )
  }
}