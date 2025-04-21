// API base URL configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:10000'

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// API response types
export interface EwclResponse {
  scores: { [residue: number]: number }
  prediction?: string
  metadata?: {
    runtime: number
    model_version: string
    timestamp: string
  }
}

// Generic API call handler with error handling
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        errorData.message || `API call failed with status ${response.status}`,
        response.status.toString(),
        errorData
      )
    }

    return response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      'UNKNOWN'
    )
  }
}

// EWCL-specific API calls
export async function runRealEwcl(pdbPath: string): Promise<EwclResponse> {
  const response = await fetch('http://localhost:10000/runrealewcltest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pdb_path: pdbPath })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || `API call failed with status ${response.status}`,
      response.status.toString(),
      errorData
    );
  }

  return response.json();
}

// Additional EWCL-related API calls
export async function validatePdb(pdbData: string): Promise<{ isValid: boolean; message?: string }> {
  return apiCall('/validate-pdb', {
    method: 'POST',
    body: JSON.stringify({ pdb_data: pdbData }),
  })
}

export async function getEwclStatus(): Promise<{ status: string; version: string }> {
  return apiCall('/status', {
    method: 'GET',
  })
}

export async function runEwclBatch(pdbPaths: string[]): Promise<{ [pdbPath: string]: EwclResponse }> {
  return apiCall('/run-ewcl-batch', {
    method: 'POST',
    body: JSON.stringify({ pdb_paths: pdbPaths }),
  })
}

// File-based EWCL test
export async function runEWCLTest(file: File): Promise<EwclResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("http://localhost:10000/runrealewcltest", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || `EWCL test failed with status ${response.status}`,
      response.status.toString(),
      errorData
    );
  }

  return response.json();
}

// Error handling utilities
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return `${error.message}${error.code ? ` (${error.code})` : ''}`
  }
  return error instanceof Error ? error.message : 'An unknown error occurred'
} 