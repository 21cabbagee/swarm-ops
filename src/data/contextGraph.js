/**
 * Shared Context Graph (Live Metadata Engine)
 * 
 * Instead of dumping chat histories into agent context windows, agents query
 * this centralized, reactive hypergraph for live metadata, dependency states,
 * and validated artifacts with zero token pollution.
 */

export const INITIAL_GRAPH_NODES = [
  {
    id: 'node-goal-01',
    label: 'Enterprise Autonomous Audit Pipeline',
    type: 'Goal',
    cohort: 'planner',
    author: 'agent-052',
    timestamp: '2026-10-14 17:15:00',
    properties: {
      status: 'IN_PROGRESS',
      targetSLA: '180s',
      riskTier: 'CRITICAL',
      maxTokens: 150000
    }
  },
  {
    id: 'node-entity-sec-filing',
    label: '10-K SEC Filing Corpus (FY2025)',
    type: 'Entity',
    cohort: 'discovery',
    author: 'agent-012',
    timestamp: '2026-10-14 17:15:12',
    properties: {
      source: 'https://sec.gov/edgar/data/0001018724',
      format: 'XBRL / JSON',
      sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      byteSize: '14.2 MB'
    }
  },
  {
    id: 'node-fact-rev-growth',
    label: 'Verified Q4 Net Revenue: $170.0B (+14% YoY)',
    type: 'Fact',
    cohort: 'research',
    author: 'agent-108',
    timestamp: '2026-10-14 17:15:45',
    properties: {
      confidence: 0.994,
      verificationSource: '10-K Item 7, Page 34',
      mathVerified: true
    }
  },
  {
    id: 'node-hypothesis-margin',
    label: 'Hypothesis: Cloud OPEX Efficiency expanded Gross Margin by 180bps',
    type: 'Hypothesis',
    cohort: 'research',
    author: 'agent-134',
    timestamp: '2026-10-14 17:16:10',
    properties: {
      status: 'VERIFYING',
      confidence: 0.82,
      falsifiable: true,
      counterFactsCount: 0
    }
  },
  {
    id: 'node-artifact-sql-schema',
    label: 'SQL Data Warehouse Audit Schema (Snowflake DDL)',
    type: 'Artifact',
    cohort: 'execution',
    author: 'agent-168',
    timestamp: '2026-10-14 17:16:55',
    properties: {
      language: 'SQL',
      checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      lintScore: 100
    }
  },
  {
    id: 'node-audit-compliance-check',
    label: 'SOX 404 Internal Controls & PII Quarantine Test',
    type: 'Verification',
    cohort: 'verification',
    author: 'agent-214',
    timestamp: '2026-10-14 17:17:30',
    properties: {
      passed: true,
      violationsFound: 0,
      piiLeakageRisk: '0.00%'
    }
  },
  {
    id: 'node-artifact-exec-summary',
    label: 'Executive Board Valuation & Audit Dossier',
    type: 'Artifact',
    cohort: 'synthesis',
    author: 'agent-288',
    timestamp: '2026-10-14 17:18:05',
    properties: {
      pages: 18,
      format: 'Markdown + LaTeX + PDF',
      readyForSignoff: true
    }
  },
  {
    id: 'node-lock-ledger',
    label: 'Distributed Mutex Lock: Financial Ledger Write',
    type: 'Lock',
    cohort: 'execution',
    author: 'agent-180',
    timestamp: '2026-10-14 17:18:20',
    properties: {
      lockedBy: 'agent-180',
      ttlRemainingSec: 24,
      reentrant: false
    }
  }
];

export const INITIAL_GRAPH_EDGES = [
  { id: 'edge-1', source: 'node-goal-01', target: 'node-entity-sec-filing', label: 'REQUIRES', weight: 1.0 },
  { id: 'edge-2', source: 'node-entity-sec-filing', target: 'node-fact-rev-growth', label: 'EXTRACTED_FROM', weight: 0.95 },
  { id: 'edge-3', source: 'node-fact-rev-growth', target: 'node-hypothesis-margin', label: 'SUPPORTS', weight: 0.88 },
  { id: 'edge-4', source: 'node-hypothesis-margin', target: 'node-artifact-sql-schema', label: 'PROVOKED', weight: 0.75 },
  { id: 'edge-5', source: 'node-artifact-sql-schema', target: 'node-audit-compliance-check', label: 'VALIDATES', weight: 1.0 },
  { id: 'edge-6', source: 'node-audit-compliance-check', target: 'node-artifact-exec-summary', label: 'CERTIFIED_BY', weight: 0.98 },
  { id: 'edge-7', source: 'node-artifact-sql-schema', target: 'node-lock-ledger', label: 'ACQUIRED_LOCK', weight: 1.0 }
];

export const queryContextGraph = (nodes, edges, queryStr) => {
  const query = queryStr.toLowerCase().trim();
  if (!query || query === '*' || query === 'match (n) return n') {
    return { nodes, edges, queryLatencyMs: 3.2 };
  }

  // Filter nodes matching text or type
  const matchedNodes = nodes.filter(n => 
    n.label.toLowerCase().includes(query) ||
    n.type.toLowerCase().includes(query) ||
    n.cohort.toLowerCase().includes(query) ||
    n.author.toLowerCase().includes(query)
  );

  const matchedIds = new Set(matchedNodes.map(n => n.id));
  const matchedEdges = edges.filter(e => matchedIds.has(e.source) || matchedIds.has(e.target));

  return {
    nodes: matchedNodes,
    edges: matchedEdges,
    queryLatencyMs: Number((1.5 + Math.random() * 2.5).toFixed(1)),
    totalMatched: matchedNodes.length
  };
};
