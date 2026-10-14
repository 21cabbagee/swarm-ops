/**
 * LangGraph DAG with Durable Checkpoints & LangSmith Tracing
 * 
 * Features:
 * - Deterministic StateGraph with conditional nodes
 * - Durable Checkpointer capturing snapshot states at every transition
 * - Time-Travel Replay & State Diff viewer
 * - LangSmith Distributed Span Tracing
 */

export const LANGGRAPH_DAG_NODES = [
  {
    id: 'node-start',
    label: '__start__',
    type: 'entrypoint',
    status: 'COMPLETED',
    durationMs: 12,
    inputs: { prompt: 'Autonomous Enterprise Audit FY2025' }
  },
  {
    id: 'node-ingest',
    label: 'ingest_sec_corpus',
    type: 'worker_step',
    cohort: 'discovery',
    status: 'COMPLETED',
    durationMs: 420,
    checkpointerId: 'chk-001-ingest',
    agent: 'agent-012',
    model: 'Groq Llama-3.3-70B',
    tokenBurn: { prompt: 1200, completion: 480 }
  },
  {
    id: 'node-plan-decompose',
    label: 'decompose_audit_tasks',
    type: 'router_step',
    cohort: 'planner',
    status: 'COMPLETED',
    durationMs: 650,
    checkpointerId: 'chk-002-plan',
    agent: 'agent-052',
    model: 'Claude 3.5 Sonnet',
    tokenBurn: { prompt: 2100, completion: 940 }
  },
  {
    id: 'node-parallel-exec',
    label: 'fan_out_synthesis',
    type: 'parallel_fan_out',
    cohort: 'execution',
    status: 'COMPLETED',
    durationMs: 890,
    checkpointerId: 'chk-003-fanout',
    agent: 'agent-168',
    model: 'Groq Llama-3.3-70B',
    tokenBurn: { prompt: 3400, completion: 1420 }
  },
  {
    id: 'node-verify-sox',
    label: 'verify_compliance_sox404',
    type: 'audit_step',
    cohort: 'verification',
    status: 'COMPLETED',
    durationMs: 380,
    checkpointerId: 'chk-004-verify',
    agent: 'agent-214',
    model: 'Gemini 2.0 Flash',
    tokenBurn: { prompt: 1650, completion: 310 }
  },
  {
    id: 'node-human-gate',
    label: 'evaluate_risk_escalation',
    type: 'conditional_gate',
    cohort: 'verification',
    status: 'ACTIVE',
    durationMs: 110,
    checkpointerId: 'chk-005-gate',
    agent: 'agent-220',
    model: 'o3-mini',
    tokenBurn: { prompt: 850, completion: 220 },
    branchDecision: 'PASSED_THRESHOLD_PROCEED_TO_SYNTHESIS'
  },
  {
    id: 'node-final-synthesis',
    label: 'compile_executive_dossier',
    type: 'synthesis_step',
    cohort: 'synthesis',
    status: 'PENDING',
    durationMs: 0,
    checkpointerId: null,
    agent: 'agent-288',
    model: 'Claude 3.5 Sonnet',
    tokenBurn: { prompt: 0, completion: 0 }
  },
  {
    id: 'node-end',
    label: '__end__',
    type: 'terminal',
    status: 'PENDING',
    durationMs: 0
  }
];

export const LANGGRAPH_DAG_EDGES = [
  { source: 'node-start', target: 'node-ingest', condition: 'always' },
  { source: 'node-ingest', target: 'node-plan-decompose', condition: 'on_success' },
  { source: 'node-plan-decompose', target: 'node-parallel-exec', condition: 'on_dag_ready' },
  { source: 'node-parallel-exec', target: 'node-verify-sox', condition: 'join_barrier' },
  { source: 'node-verify-sox', target: 'node-human-gate', condition: 'requires_validation' },
  { source: 'node-human-gate', target: 'node-final-synthesis', condition: 'risk_score < 0.75' },
  { source: 'node-final-synthesis', target: 'node-end', condition: 'always' }
];

export const DURABLE_CHECKPOINTS = [
  {
    checkpointId: 'chk-001-ingest',
    threadId: 'th-swarm-run-8492',
    timestamp: '2026-10-14 17:15:15',
    nodeName: 'ingest_sec_corpus',
    stateHash: 'sha256:4a8b...19e2',
    channelValues: {
      rawCorpusChunks: 142,
      extractedTables: 18,
      status: 'INGESTED'
    },
    parentCheckpointId: null
  },
  {
    checkpointId: 'chk-002-plan',
    threadId: 'th-swarm-run-8492',
    timestamp: '2026-10-14 17:15:58',
    nodeName: 'decompose_audit_tasks',
    stateHash: 'sha256:7c9d...33b1',
    channelValues: {
      subtasksCount: 6,
      assignedAgents: ['agent-168', 'agent-172', 'agent-214'],
      criticalPathDurationEst: '14.2s'
    },
    parentCheckpointId: 'chk-001-ingest'
  },
  {
    checkpointId: 'chk-003-fanout',
    threadId: 'th-swarm-run-8492',
    timestamp: '2026-10-14 17:16:48',
    nodeName: 'fan_out_synthesis',
    stateHash: 'sha256:11aa...98e4',
    channelValues: {
      sqlQueriesExecuted: 12,
      tablesAudited: 8,
      varianceDiscrepancies: 0
    },
    parentCheckpointId: 'chk-002-plan'
  },
  {
    checkpointId: 'chk-004-verify',
    threadId: 'th-swarm-run-8492',
    timestamp: '2026-10-14 17:17:28',
    nodeName: 'verify_compliance_sox404',
    stateHash: 'sha256:99bb...41c8',
    channelValues: {
      soxComplianceScore: 0.998,
      penTestVulnerabilities: 0,
      piiSanitized: true
    },
    parentCheckpointId: 'chk-003-fanout'
  },
  {
    checkpointId: 'chk-005-gate',
    threadId: 'th-swarm-run-8492',
    timestamp: '2026-10-14 17:18:10',
    nodeName: 'evaluate_risk_escalation',
    stateHash: 'sha256:88ff...77a0',
    channelValues: {
      compositeRiskScore: 0.14,
      escalationRequired: false,
      recommendedAction: 'PROCEED_AUTOMATICALLY'
    },
    parentCheckpointId: 'chk-004-verify'
  }
];

export const LANGSMITH_TRACES = [
  {
    traceId: 'tr-ls-904128',
    runName: 'EnterpriseAutonomousAudit::Root',
    latencyTotalMs: 2462,
    tokenTotal: 10000,
    costUSD: 0.0094,
    spans: [
      { name: 'LangGraph::ingest_sec_corpus', latencyMs: 420, tokens: 1680, model: 'Groq Llama-3.3-70B', cost: 0.0001 },
      { name: 'MCP::warehouse_sql_mcp', latencyMs: 88, tokens: 410, model: 'N/A (Tool)', cost: 0.0 },
      { name: 'LangGraph::decompose_audit_tasks', latencyMs: 650, tokens: 3040, model: 'Claude 3.5 Sonnet', cost: 0.0042 },
      { name: 'LangGraph::fan_out_synthesis', latencyMs: 890, tokens: 4820, model: 'Groq Llama-3.3-70B', cost: 0.0004 },
      { name: 'LangGraph::verify_compliance_sox404', latencyMs: 380, tokens: 1960, model: 'Gemini 2.0 Flash', cost: 0.0001 },
      { name: 'LangGraph::evaluate_risk_escalation', latencyMs: 110, tokens: 1070, model: 'o3-mini', cost: 0.0046 }
    ]
  }
];
