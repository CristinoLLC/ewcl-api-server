def run_ewcl_on_pdb(pdb_text: str, threshold: float = 0.5):
    lines = pdb_text.strip().splitlines()
    scores = [abs(hash(line)) % 100 / 100 for line in lines]
    avg_score = sum(scores) / len(scores) if scores else 0.0

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
