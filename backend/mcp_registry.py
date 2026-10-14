"""
Model Context Protocol (MCP) Tool Registry
Stateless worker management, dynamic trust scoring, and quarantine circuit breakers.
"""

from typing import Dict, List, Any

class McpToolRegistry:
    def __init__(self):
        self.tools = {
            "web_search_mcp": {
                "name": "web_search_mcp",
                "workers": 16,
                "latency_p95_ms": 142,
                "error_rate_pct": 0.2,
                "hallucination_risk": 0.02,
                "status": "HEALTHY"
            },
            "python_sandbox_mcp": {
                "name": "python_sandbox_mcp",
                "workers": 32,
                "latency_p95_ms": 310,
                "error_rate_pct": 0.8,
                "hallucination_risk": 0.04,
                "status": "HEALTHY"
            },
            "warehouse_sql_mcp": {
                "name": "warehouse_sql_mcp",
                "workers": 24,
                "latency_p95_ms": 88,
                "error_rate_pct": 0.1,
                "hallucination_risk": 0.01,
                "status": "HEALTHY"
            },
            "legacy_dom_scraper_mcp": {
                "name": "legacy_dom_scraper_mcp",
                "workers": 4,
                "latency_p95_ms": 1850,
                "error_rate_pct": 9.4,
                "hallucination_risk": 0.28,
                "status": "QUARANTINED"
            }
        }

    def compute_trust_score(self, tool_name: str) -> float:
        tool = self.tools.get(tool_name)
        if not tool:
            return 0.0
        
        err_penalty = (tool["error_rate_pct"] / 100.0) * 0.4
        halluc_penalty = tool["hallucination_risk"] * 0.3
        lat_penalty = min(tool["latency_p95_ms"] / 2000.0, 1.0) * 0.3

        raw = 1.0 - (err_penalty + halluc_penalty + lat_penalty)
        return round(max(0.0, min(1.0, raw)), 2)

    def is_quarantined(self, tool_name: str) -> bool:
        score = self.compute_trust_score(tool_name)
        tool = self.tools.get(tool_name)
        if not tool or tool["status"] == "QUARANTINED" or score < 0.70:
            return True
        return False
