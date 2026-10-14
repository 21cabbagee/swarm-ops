/**
 * Multi-Model Router (70/20/10, Per-Step)
 * 
 * Dynamic step-level model routing governor:
 * - 70% Tier 1: Fast & Cheap (Groq Llama-3.3-70B, Gemini 2.0 Flash, Cerebras)
 * - 20% Tier 2: Mid-Tier Balanced Reasoning (Claude 3.5 Sonnet, GPT-4o)
 * - 10% Tier 3: Flagship Reasoning & Verification (o1, o3-mini, Claude Opus)
 */

export const MODEL_TIERS = {
  tier1: {
    name: 'Tier 1: Fast & Ultra-Low Cost',
    targetRatioPct: 70,
    costPerMillionTokens: 0.15,
    avgLatencyMs: 140,
    models: [
      { id: 'groq-llama-3.3-70b', provider: 'Groq LPU', context: '128k', costPerM: 0.15, latencyMs: 110 },
      { id: 'gemini-2.0-flash', provider: 'Google AI Studio', context: '1M', costPerM: 0.10, latencyMs: 160 },
      { id: 'cerebras-llama-3.1-8b', provider: 'Cerebras CS-3', context: '8k', costPerM: 0.05, latencyMs: 85 }
    ],
    idealFor: 'Routine extraction, JSON formatting, entity resolution, text normalization, basic validation'
  },
  tier2: {
    name: 'Tier 2: Mid-Tier Balanced Reasoning',
    targetRatioPct: 20,
    costPerMillionTokens: 3.00,
    avgLatencyMs: 480,
    models: [
      { id: 'claude-3-5-sonnet', provider: 'Anthropic', context: '200k', costPerM: 3.00, latencyMs: 450 },
      { id: 'gpt-4o', provider: 'OpenAI', context: '128k', costPerM: 2.50, latencyMs: 510 }
    ],
    idealFor: 'Decomposition, DAG planning, SQL synthesis, code generation, multi-hop coordination'
  },
  tier3: {
    name: 'Tier 3: Flagship Reasoning & Escalation',
    targetRatioPct: 10,
    costPerMillionTokens: 15.00,
    avgLatencyMs: 1650,
    models: [
      { id: 'o3-mini-high', provider: 'OpenAI o-Series', context: '200k', costPerM: 12.00, latencyMs: 1400 },
      { id: 'claude-3-5-opus', provider: 'Anthropic', context: '200k', costPerM: 15.00, latencyMs: 1850 },
      { id: 'deepseek-r1', provider: 'DeepSeek', context: '64k', costPerM: 2.19, latencyMs: 1720 }
    ],
    idealFor: 'Audit signing, financial valuation proof, regulatory signoff, deadlock resolution, human escalation triage'
  }
};

export const ROUTER_DECISION_HISTORY = [
  {
    stepId: 'step-01',
    agent: 'agent-012',
    task: 'Parse raw 10-K HTML tables into clean JSON',
    complexityScore: 0.28,
    riskScore: 0.05,
    selectedTier: 'tier1',
    selectedModel: 'groq-llama-3.3-70b',
    rationale: 'Structured parsing with strict schema, low ambiguity: Tier 1 optimal.',
    latencyMs: 114,
    costUSD: 0.0001,
    timestamp: '17:15:10'
  },
  {
    stepId: 'step-02',
    agent: 'agent-052',
    task: 'Deconstruct SOX 404 audit obligations into 6-node DAG',
    complexityScore: 0.74,
    riskScore: 0.45,
    selectedTier: 'tier2',
    selectedModel: 'claude-3-5-sonnet',
    rationale: 'High topological dependency planning: Tier 2 balanced reasoning required.',
    latencyMs: 442,
    costUSD: 0.0038,
    timestamp: '17:15:52'
  },
  {
    stepId: 'step-03',
    agent: 'agent-168',
    task: 'Write parameterized SQL AST for ledger reconciliation',
    complexityScore: 0.62,
    riskScore: 0.35,
    selectedTier: 'tier2',
    selectedModel: 'claude-3-5-sonnet',
    rationale: 'Code synthesis requiring precise dialect adherence: Tier 2 chosen.',
    latencyMs: 388,
    costUSD: 0.0029,
    timestamp: '17:16:34'
  },
  {
    stepId: 'step-04',
    agent: 'agent-108',
    task: 'Scan 50 entity metadata references in Shared Context Graph',
    complexityScore: 0.18,
    riskScore: 0.02,
    selectedTier: 'tier1',
    selectedModel: 'cerebras-llama-3.1-8b',
    rationale: 'High throughput entity lookup: Tier 1 ultra-fast selected.',
    latencyMs: 78,
    costUSD: 0.00004,
    timestamp: '17:17:12'
  },
  {
    stepId: 'step-05',
    agent: 'agent-220',
    task: 'Final mathematical verification & multi-agent deadlock arbitration',
    complexityScore: 0.95,
    riskScore: 0.88,
    selectedTier: 'tier3',
    selectedModel: 'o3-mini-high',
    rationale: 'Mission-critical mathematical proof & risk gate: Flagship reasoning engaged.',
    latencyMs: 1380,
    costUSD: 0.0072,
    timestamp: '17:17:58'
  }
];

export const routeStepDynamically = (taskDescription, complexity = 0.5, risk = 0.2) => {
  // Score = 0.6 * complexity + 0.4 * risk
  const compositeScore = 0.6 * complexity + 0.4 * risk;
  
  if (compositeScore < 0.45) {
    return {
      tier: 'tier1',
      model: MODEL_TIERS.tier1.models[0].id,
      modelName: MODEL_TIERS.tier1.models[0].provider,
      estCostPerCall: 0.0001,
      expectedLatencyMs: MODEL_TIERS.tier1.models[0].latencyMs,
      reason: 'Low complexity/risk step: routed to Tier 1 fast open-weights'
    };
  } else if (compositeScore < 0.78) {
    return {
      tier: 'tier2',
      model: MODEL_TIERS.tier2.models[0].id,
      modelName: MODEL_TIERS.tier2.models[0].provider,
      estCostPerCall: 0.0025,
      expectedLatencyMs: MODEL_TIERS.tier2.models[0].latencyMs,
      reason: 'Balanced reasoning required: routed to Tier 2 frontier model'
    };
  } else {
    return {
      tier: 'tier3',
      model: MODEL_TIERS.tier3.models[0].id,
      modelName: MODEL_TIERS.tier3.models[0].provider,
      estCostPerCall: 0.0090,
      expectedLatencyMs: MODEL_TIERS.tier3.models[0].latencyMs,
      reason: 'High stakes / formal verification: routed to Tier 3 flagship reasoning model'
    };
  }
};
