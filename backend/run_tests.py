"""
Standard Library Test Runner for SwarmOps Backend Engine
Runs all test assertions using Python's built-in unittest module.
"""

import unittest
from shared_context_graph import SharedContextGraph
from mcp_registry import McpToolRegistry
from a2a_protocol import check_circular_delegation
from langgraph_engine import DurableCheckpointer
from model_router import route_step
from eval_harness import run_200_eval_suite

class TestSwarmOpsBackend(unittest.TestCase):
    def test_shared_context_graph_query(self):
        graph = SharedContextGraph()
        res = graph.query("Fact")
        self.assertGreaterEqual(len(res["nodes"]), 1)
        self.assertLess(res["query_latency_ms"], 50.0)

    def test_mcp_trust_scores(self):
        registry = McpToolRegistry()
        score = registry.compute_trust_score("warehouse_sql_mcp")
        self.assertGreaterEqual(score, 0.90)
        self.assertFalse(registry.is_quarantined("warehouse_sql_mcp"))

        # legacy tool should be quarantined
        self.assertTrue(registry.is_quarantined("legacy_dom_scraper_mcp"))

    def test_circular_delegation_detection(self):
        # Circular: A -> B -> A
        circular = [
            {"from": "agent-01", "to": "agent-02"},
            {"from": "agent-02", "to": "agent-01"}
        ]
        is_circ, offender = check_circular_delegation(circular)
        self.assertTrue(is_circ)
        self.assertEqual(offender, "agent-01")

        # Linear: A -> B -> C
        linear = [
            {"from": "agent-01", "to": "agent-02"},
            {"from": "agent-02", "to": "agent-03"}
        ]
        is_circ_lin, _ = check_circular_delegation(linear)
        self.assertFalse(is_circ_lin)

    def test_durable_checkpointer(self):
        checkpointer = DurableCheckpointer()
        chk_id = checkpointer.save("th-1", "node-ingest", {"rows": 100})
        self.assertTrue(chk_id.startswith("chk-"))
        
        chk = checkpointer.get(chk_id)
        self.assertIsNotNone(chk)
        self.assertEqual(chk["channel_values"]["rows"], 100)
        self.assertTrue(chk["state_hash"].startswith("sha256:"))

    def test_model_router_tiers(self):
        t1 = route_step("Parse simple string", complexity=0.2, risk=0.1)
        self.assertEqual(t1["tier"], "tier1")

        t2 = route_step("Design SQL schema", complexity=0.6, risk=0.3)
        self.assertEqual(t2["tier"], "tier2")

        t3 = route_step("Formal audit signoff", complexity=0.9, risk=0.9)
        self.assertEqual(t3["tier"], "tier3")

    def test_200_eval_suite(self):
        res = run_200_eval_suite()
        self.assertEqual(res["total_prompts"], 200)
        self.assertEqual(res["passed"], 196)
        self.assertEqual(res["accuracy_pct"], 98.0)

if __name__ == '__main__':
    unittest.main()
