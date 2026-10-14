"""
Agent-to-Agent (A2A) Protocol
Handles machine-readable Agent Cards, delegation token chains, and circular loop detection.
"""

from typing import List, Dict, Any, Tuple

def check_circular_delegation(chain_links: List[Dict[str, str]]) -> Tuple[bool, str]:
    """
    Checks if a delegation chain contains cycles (e.g. A -> B -> A).
    Returns (is_circular, offending_agent).
    """
    visited = set()
    for link in chain_links:
        to_agent = link.get("to")
        from_agent = link.get("from")
        
        if to_agent in visited:
            return True, to_agent
        visited.add(from_agent)
        
    return False, ""
