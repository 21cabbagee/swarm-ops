"""
Pytest Test Suite for SwarmOps Backend Engine
Tests all 9 architectural layers in Python.
"""

from shared_context_graph import SharedContextGraph
from mcp_registry import McpToolRegistry
from a2a_protocol import check_circular_delegation
from langgraph_engine import DurableCheckpointer
from model_router import route_step
from eval_harness import run_200_eval_suite

def test_shared_context_graph_query():
    graph = SharedContextGraph()
    res = graph.query("Fact")
    assert len(res["nodes"]) >= 1
    assert res["query_latency_ms"] < 20.0

def test_mcp_trust_scores():
    registry = McpToolRegistry()
    score = registry.compute_trust_score("warehouse_sql_mcp")
    assert score >= 0.90
    assert not registry.is_quarantined("warehouse_sql_mcp")

    # legacy tool should be quarantined
    assert registry.is_quarantined("legacy_dom_scraper_mcp")

def test_circular_delegation_detection():
    # Circular: A -> B -> A
    circular = [
        {"from": "agent-01", "to": "agent-02"},
        {"from": "agent-02", "to": "agent-01"}
    ]
    is_circ, offender = check_circular_delegation(circular)
    assert is_circ is True
    assert offender == "agent-01"

    # Linear: A -> B -> C
    linear = [
        {"from": "agent-01", "to": "agent-02"},
        {"from": "agent-02", "to": "agent-03"}
    ]
    is_circ_lin, _ = check_circular_delegation(linear)
    assert is_circ_lin is False

def test_durable_checkpointer():
    checkpointer = DurableCheckpointer()
    chk_id = checkpointer.save("th-1", "node-ingest", {"rows": 100})
    assert chk_id.startswith("chk-")
    
    chk = checkpointer.get(chk_id)
    assert chk is not None
    assert chk["channel_values"]["rows"] == 100
    assert chk["state_hash"].startswith("sha256:")

def test_model_router_tiers():
    t1 = route_step("Parse simple string", complexity=0.2, risk=0.1)
    assert t1["tier"] == "tier1"

    t2 = route_step("Design SQL schema", complexity=0.6, risk=0.3)
    assert t2["tier"] == "tier2"

    t3 = route_step("Formal audit signoff", complexity=0.9, risk=0.9)
    assert t3["tier"] == "tier3"

def test_200_eval_suite():
    res = run_200_eval_suite()
    assert res["total_prompts"] == 200
    assert res["passed"] == 196
    assert res["accuracy_pct"] == 98.0
