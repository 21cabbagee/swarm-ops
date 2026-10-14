"""
Multi-Model Router (70/20/10, Per-Step)
Classifies individual agent steps into Tier 1 (Fast/Cheap), Tier 2 (Balanced), or Tier 3 (Reasoning).
"""

from typing import Dict, Any

def route_step(task_description: str, complexity: float = 0.5, risk: float = 0.2) -> Dict[str, Any]:
    composite_score = 0.6 * complexity + 0.4 * risk

    if composite_score < 0.45:
        return {
            "tier": "tier1",
            "model": "groq-llama-3.3-70b",
            "provider": "Groq LPU",
            "cost_per_million": 0.15,
            "latency_ms": 110,
            "rationale": "Low complexity/risk: routed to Tier 1 fast open-weights"
        }
    elif composite_score < 0.78:
        return {
            "tier": "tier2",
            "model": "claude-3-5-sonnet",
            "provider": "Anthropic",
            "cost_per_million": 3.00,
            "latency_ms": 450,
            "rationale": "Balanced reasoning: routed to Tier 2 frontier model"
        }
    else:
        return {
            "tier": "tier3",
            "model": "o3-mini-high",
            "provider": "OpenAI",
            "cost_per_million": 12.00,
            "latency_ms": 1400,
            "rationale": "High-risk formal verification: routed to Tier 3 flagship reasoning model"
        }
