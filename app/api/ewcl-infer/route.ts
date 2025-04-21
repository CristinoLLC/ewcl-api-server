import { NextRequest, NextResponse } from 'next/server';

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    if (!body || !body.fileUrl) {
      return NextResponse.json({ error: 'Invalid input: fileUrl is required' }, { status: 400 });
    }

    // Simulate EWCL inference logic (replace with real backend logic)
    const entropyMap = {
      1: 0.2,
      2: 0.5,
      3: 0.8,
      4: 0.6,
      5: 0.3,
    };

    return NextResponse.json({
      proteinName: "Mock Protein",
      entropyMap,
      entropyScore: 0.5,
      residueCount: Object.keys(entropyMap).length,
      maxEntropy: Math.max(...Object.values(entropyMap)),
      minEntropy: Math.min(...Object.values(entropyMap)),
    });
  } catch (err) {
    console.error(err);
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