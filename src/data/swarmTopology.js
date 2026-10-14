/**
 * 300-Agent Swarm (PARL-Trained) Topology Data & Generation
 * 
 * Each agent features:
 * - Isolated context window (strictly bounded to 4,096 tokens)
 * - Strict per-agent token budget
 * - Policy-Aware Reinforcement Learning (PARL) specialization weights
 * - mTLS SPIFFE cryptographic identity
 */

export const COHORTS = [
  {
    id: 'discovery',
    name: 'Discovery & Ingestion',
    range: [1, 50],
    color: '#06b6d4', // cyan
    description: 'High-throughput document parsing, web probing, and unstructured schema extraction.',
    icon: 'Radar'
  },
  {
    id: 'planner',
    name: 'Decomposition & Planning',
    range: [51, 100],
    color: '#8b5cf6', // violet
    description: 'Goal breakdown, topological dependency ordering, and LangGraph DAG orchestration.',
    icon: 'GitFork'
  },
  {
    id: 'research',
    name: 'Research & Knowledge',
    range: [101, 150],
    color: '#3b82f6', // blue
    description: 'Deep factual retrieval, cross-referencing, and Shared Context Graph querying.',
    icon: 'Database'
  },
  {
    id: 'execution',
    name: 'Execution & Tool Calling',
    range: [151, 200],
    color: '#10b981', // emerald
    description: 'Code synthesis, SQL generation, API invocations, and sandbox task completion.',
    icon: 'Terminal'
  },
  {
    id: 'verification',
    name: 'Audit & Verification',
    range: [201, 250],
    color: '#f59e0b', // amber
    description: 'Static analysis, hallucination detection, unit testing, and policy compliance.',
    icon: 'ShieldCheck'
  },
  {
    id: 'synthesis',
    name: 'Synthesis & Reporting',
    range: [251, 300],
    color: '#f43f5e', // rose
    description: 'Executive deliverables, artifact packaging, and final output compilation.',
    icon: 'FileText'
  }
];

export const generate300Agents = () => {
  const agents = [];
  
  for (let i = 1; i <= 300; i++) {
    const paddedId = String(i).padStart(3, '0');
    let cohortId = 'discovery';
    if (i > 50 && i <= 100) cohortId = 'planner';
    else if (i > 100 && i <= 150) cohortId = 'research';
    else if (i > 150 && i <= 200) cohortId = 'execution';
    else if (i > 200 && i <= 250) cohortId = 'verification';
    else if (i > 250) cohortId = 'synthesis';
    
    const cohort = COHORTS.find(c => c.id === cohortId);
    
    // Seed realistic deterministic metrics
    const specializationScore = Number((0.88 + ((i * 17) % 11) * 0.01).toFixed(2));
    const tokenLimit = 4096;
    const usedTokens = 600 + ((i * 73) % 2900);
    const totalAllocated = 25000;
    const totalConsumed = 2400 + ((i * 181) % 18000);
    
    // Status distribution: ~45% active, ~40% idle, ~10% delegating, ~5% waiting_lock
    let status = 'idle';
    if (i % 7 === 0) status = 'delegating';
    else if (i % 19 === 0) status = 'waiting_lock';
    else if (i % 2 === 0 || i % 3 === 0) status = 'active';

    agents.push({
      id: `agent-${paddedId}`,
      num: i,
      name: `PARL-${cohort.name.split(' ')[0]}-${paddedId}`,
      cohort: cohortId,
      cohortName: cohort.name,
      color: cohort.color,
      policy: 'PARL-v4.2-PPO',
      specializationScore,
      coordinationFactor: 0.94,
      entropy: 0.02,
      isolatedContext: {
        capacity: tokenLimit,
        usedTokens,
        utilizationPct: Math.round((usedTokens / tokenLimit) * 100),
        bufferItemsCount: 4 + (i % 7),
        pinnedSystemTokens: 380,
      },
      tokenBudget: {
        maxPromptPerCall: 2048,
        maxCompletionPerCall: 1024,
        totalAllocated,
        totalConsumed,
        remainingBudget: totalAllocated - totalConsumed,
        budgetBurnPct: Math.round((totalConsumed / totalAllocated) * 100)
      },
      status,
      mtlsCertId: `spiffe://swarmops.internal/agent/${paddedId}`,
      assignedTask: status === 'active' ? `Task-DAG-Node-${(i % 12) + 1}` : null,
      delegationDepth: (i % 4) + 1
    });
  }

  return agents;
};

export const INITIAL_AGENTS = generate300Agents();
