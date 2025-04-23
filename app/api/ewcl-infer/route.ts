import { NextRequest, NextResponse } from 'next/server';

export const config = { api: { bodyParser: false } };

// Mock protein data for development
const mockProteins = {
  '1ubq': {
    name: 'Ubiquitin (1UBQ)',
    entropyScore: 0.27,
    entropy: generateMockEntropyMap(76, 0.15, 0.35)
  },
  '1cfc': {
    name: 'Calmodulin (1CFC)',
    entropyScore: 0.48,
    entropy: generateMockEntropyMap(148, 0.30, 0.70)
  },
  '2ftl': {
    name: 'Tau Fragment (2FTL)',
    entropyScore: 0.76,
    entropy: generateMockEntropyMap(42, 0.55, 0.95)
  }
};

// Generate mock entropy values for development
function generateMockEntropyMap(residueCount: number, minEntropy: number, maxEntropy: number) {
  const entropyMap: Record<string, number> = {};
  
  for (let i = 1; i <= residueCount; i++) {
    // Generate a pattern with some regions of higher/lower entropy
    const position = i / residueCount;
    let baseEntropy;
    
    if (position < 0.3) {
      // More ordered region
      baseEntropy = minEntropy + (maxEntropy - minEntropy) * 0.3;
    } else if (position > 0.7) {
      // More disordered region
      baseEntropy = minEntropy + (maxEntropy - minEntropy) * 0.8;
    } else {
      // Transition region
      baseEntropy = minEntropy + (maxEntropy - minEntropy) * 0.5;
    }
    
    // Add some random variation
    const randomVariation = (Math.random() - 0.5) * 0.2;
    const entropy = Math.max(0, Math.min(1, baseEntropy + randomVariation));
    
    entropyMap[i.toString()] = entropy;
  }
  
  return entropyMap;
}

// Function to generate entropy scores based on residue number (for demo)
function generateEntropyScore(residueNumber: number): number {
  // This is just a mock function - in reality, this would be calculated by your model
  
  // Create some patterns in the data to make it look realistic
  const baseline = Math.sin(residueNumber / 10) * 0.25 + 0.5; // Baseline oscillation
  const noise = (Math.random() - 0.5) * 0.2; // Random noise
  const value = baseline + noise;
  
  // Clamp between 0 and 1
  return Math.max(0, Math.min(1, value));
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const pdbText = await file.text();
    const lines = pdbText.trim().split('\n');
    const scores = lines.map(line => Math.abs(hashCode(line)) % 100 / 100);
    const avgScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0.0;

    let risk = "Low";
    if (avgScore > 0.7) {
      risk = "High";
    } else if (avgScore > 0.4) {
      risk = "Medium";
    }

    return NextResponse.json({
      per_residue_scores: scores,
      collapse_score: avgScore,
      risk_level: risk
    });
  } catch (err: any) {
    console.error('EWCL Real Test Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = new URL(request.url).searchParams;
  const id = searchParams.get('id');
  
  if (!id || !mockProteins[id as keyof typeof mockProteins]) {
    return NextResponse.json(
      { error: 'Sample not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(mockProteins[id as keyof typeof mockProteins]);
}

// Helper function to calculate hash code for a string
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return hash;
}