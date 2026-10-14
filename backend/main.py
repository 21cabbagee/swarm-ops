"""
SwarmOps Engine API
FastAPI orchestrator server for 300-Agent PARL Swarm
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional

from shared_context_graph import SharedContextGraph
from mcp_registry import McpToolRegistry
from a2a_protocol import check_circular_delegation
from langgraph_engine import DurableCheckpointer
from model_router import route_step
from eval_harness import run_200_eval_suite

app = FastAPI(title="SwarmOps 300-Agent Engine API", version="1.2.0")

context_graph = SharedContextGraph()
mcp_registry = McpToolRegistry()
checkpointer = DurableCheckpointer()

class QueryRequest(BaseModel):
    query: str

class RouteRequest(BaseModel):
    task: str
    complexity: float = 0.5
    risk: float = 0.2

class DelegationCheckRequest(BaseModel):
    links: list

@app.get("/api/health")
def health():
    return {
        "status": "HEALTHY",
        "swarm_population": 300,
        "policy": "PARL-v4.2-PPO",
        "mesh_mtls": "ENFORCED"
    }

@app.post("/api/context-graph/query")
def query_graph(req: QueryRequest):
    return context_graph.query(req.query)

@app.get("/api/mcp/tools")
def get_tools():
    return {
        "tools": [
            {**t, "trust_score": mcp_registry.compute_trust_score(t["name"])}
            for t in mcp_registry.tools.values()
        ]
    }

@app.post("/api/router/classify")
def classify_step(req: RouteRequest):
    return route_step(req.task, req.complexity, req.risk)

@app.post("/api/evals/run-200")
def run_evals():
    return run_200_eval_suite()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
