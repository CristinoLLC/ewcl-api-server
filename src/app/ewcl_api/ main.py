def run_ewcl_on_pdb(pdb_text: str, threshold: float = 0.5):
    """
    Perform EWCL analysis on PDB text.

    Args:
      pdb_text: contents of a .pdb file as a string
      threshold: (unused in this mock) cutoff for risk classification

    Returns:
      Dict with per_residue_scores, collapse_score, and risk_level.
    """
    # tokenize input by lines
    lines = pdb_text.strip().splitlines()
    # generate a pseudo-entropy score per line
    scores = [abs(hash(line)) % 100 / 100 for line in lines]
    # average score
    avg_score = sum(scores) / len(scores) if scores else 0.0

    # classify risk
    risk = "Low"
    if avg_score > 0.7:
        risk = "High"
    elif avg_score > 0.4:
        risk = "Medium"

    return {
        "per_residue_scores": scores,
        "collapse_score": avg_score,
        "risk_level": risk,
    }

import { NextApiRequest, NextApiResponse } from 'next'
export const config = { api: { bodyParser: false } }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // …existing formData parsing…

  // use your live Render FastAPI URL:
  const renderUrl = 'https://ewcl-platform.onrender.com/runrealewcltest'

  try {
    const response = await fetch(renderUrl, {
      method: 'POST',
      body: formData,  // the parsed multipart formData
    })
    const result = await response.json()
    if (!response.ok) {
      return res.status(response.status).json({ error: result.error || 'Inference failed' })
    }
    return res.status(200).json({ result })
  } catch (err: any) {
    console.error('Proxy to Render failed:', err)
    return res.status(502).json({ error: 'Unable to reach EWCL backend' })
  }
}