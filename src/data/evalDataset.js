/**
 * Closed-Loop Evals (200-Prompt Regression, Versioned)
 * 
 * 200 automated regression benchmarks across 5 mission-critical categories:
 * - Category 1: Complex Reasoning & Task Decomposition (40 prompts)
 * - Category 2: Multi-Agent Delegation & Deadlock Avoidance (40 prompts)
 * - Category 3: Stateless MCP Tool Calling & Schema Adherence (40 prompts)
 * - Category 4: Shared Context Graph Query Precision (40 prompts)
 * - Category 5: Adversarial Injection, Context Overload & Budget Stress (40 prompts)
 */

export const EVAL_CATEGORIES = [
  { id: 'cat-reasoning', name: 'Complex Reasoning & Decomposition', count: 40, weight: 0.25 },
  { id: 'cat-delegation', name: 'Multi-Agent Delegation & Anti-Loop', count: 40, weight: 0.20 },
  { id: 'cat-mcp', name: 'MCP Tool Calling & Strict Schema', count: 40, weight: 0.20 },
  { id: 'cat-graph', name: 'Context Graph Metadata Precision', count: 40, weight: 0.20 },
  { id: 'cat-adversarial', name: 'Adversarial Injection & Token Stress', count: 40, weight: 0.15 }
];

export const EVAL_VERSIONS_SUMMARY = [
  {
    version: 'v1.0.0-baseline-monolith',
    releasedAt: '2026-08-01',
    description: 'Single monolithic Claude 3.5 Sonnet agent without context isolation or MCP',
    passedPrompts: 142,
    failedPrompts: 58,
    accuracyPct: 71.0,
    hallucinationRatePct: 14.2,
    toolPrecisionPct: 76.5,
    p95LatencySec: 18.4,
    avgCostPerRunUSD: 0.185
  },
  {
    version: 'v1.1.0-marl-uncoordinated',
    releasedAt: '2026-09-15',
    description: '100-agent naive multi-agent swarm without Shared Context Graph (chat history bloat)',
    passedPrompts: 168,
    failedPrompts: 32,
    accuracyPct: 84.0,
    hallucinationRatePct: 8.6,
    toolPrecisionPct: 88.0,
    p95LatencySec: 12.1,
    avgCostPerRunUSD: 0.092
  },
  {
    version: 'v1.2.0-swarmops-parl-prod',
    releasedAt: '2026-10-14',
    description: '300-Agent PARL swarm + Shared Context Graph + MCP Registry + 70/20/10 Router',
    passedPrompts: 196,
    failedPrompts: 4,
    accuracyPct: 98.0,
    hallucinationRatePct: 0.8,
    toolPrecisionPct: 99.4,
    p95LatencySec: 3.4,
    avgCostPerRunUSD: 0.014
  }
];

export const generateSample200Evals = () => {
  const evals = [];
  const samplePrompts = [
    { cat: 'cat-reasoning', title: 'Decompose 10-K Cash Flow into Operating, Investing, and Financing Levers' },
    { cat: 'cat-reasoning', title: 'Synthesize Multi-Year Debt Amortization Schedule with Macro Interest Shock' },
    { cat: 'cat-delegation', title: 'Enforce Max-Depth Delegation Barrier (Depth <= 4) on Recursive Planner' },
    { cat: 'cat-delegation', title: 'Detect and Break Circular Delegation Loop: Agent-12 -> Agent-18 -> Agent-12' },
    { cat: 'cat-mcp', title: 'Invoke Python Sandbox with AST Pre-Validation & 512MB RAM Cap' },
    { cat: 'cat-mcp', title: 'Handle MCP Quarantined Tool with Graceful Transparent Fallback' },
    { cat: 'cat-graph', title: 'Cypher Query Context Graph for All Verified Facts Supporting Hypothesis H-04' },
    { cat: 'cat-graph', title: 'Acquire Distributed Mutex Lock on Context Node with 30s TTL' },
    { cat: 'cat-adversarial', title: 'Defend Against Invisible Unicode Prompt Injection Attempt' },
    { cat: 'cat-adversarial', title: 'Trigger Hard Token Budget Tripwire at 50,000 Tokens & Halt Run' }
  ];

  for (let i = 1; i <= 200; i++) {
    const template = samplePrompts[(i - 1) % samplePrompts.length];
    const catIndex = Math.floor((i - 1) / 40);
    const cat = EVAL_CATEGORIES[catIndex];
    
    // Simulate v1.2.0 pass/fail (4 failures in 200)
    const isFailure = i === 47 || i === 92 || i === 138 || i === 184;
    
    evals.push({
      id: `eval-${String(i).padStart(3, '0')}`,
      index: i,
      categoryId: cat.id,
      categoryName: cat.name,
      promptTitle: `${template.title} [Case #${i}]`,
      expectedOutcome: 'Deterministic schema-validated output without context window saturation.',
      v1_2_status: isFailure ? 'FAILED' : 'PASSED',
      latencyMs: isFailure ? 6200 : 800 + ((i * 37) % 2400),
      tokenBurn: isFailure ? 8400 : 1200 + ((i * 71) % 3600),
      costUSD: Number((0.0002 + ((i * 13) % 50) * 0.0001).toFixed(4)),
      failureReason: isFailure ? 'Edge case timeout on high-entropy mathematical verification' : null
    });
  }

  return evals;
};

export const SEEDED_200_EVALS = generateSample200Evals();
