import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // This is a minimal middleware that just passes through all requests
  return NextResponse.next()
}

// Optional: Configure middleware to run only on specific paths
export const config = {
  matcher: ['/ewcl-analysis/:path*'],
}
