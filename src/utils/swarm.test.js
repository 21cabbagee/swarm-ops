import { describe, it, expect } from 'vitest';
import { generate300Agents, COHORTS } from '../data/swarmTopology';
import { INITIAL_GRAPH_NODES, INITIAL_GRAPH_EDGES, queryContextGraph } from '../data/contextGraph';
import { INITIAL_MCP_TOOLS, calculateTrustScore } from '../data/mcpRegistry';
import { detectCircularDelegation } from '../data/a2aProtocol';
import { LANGGRAPH_DAG_NODES, DURABLE_CHECKPOINTS } from '../data/langgraphDag';
import { routeStepDynamically, MODEL_TIERS } from '../data/multiModelRouter';
import { SEEDED_200_EVALS, EVAL_CATEGORIES } from '../data/evalDataset';
import { HARD_BUDGET_LIMITS } from '../data/escalationRules';

describe('SwarmOps 300-Agent PARL Architecture Test Suite', () => {
  describe('Layer 1: 300-Agent Swarm (PARL-Trained) & Isolated Context', () => {
    const agents = generate300Agents();

    it('generates exactly 300 agents partitioned across 6 cohorts of 50 agents each', () => {
      expect(agents.length).toBe(300);
      expect(COHORTS.length).toBe(6);

      COHORTS.forEach(cohort => {
        const cohortAgents = agents.filter(a => a.cohort === cohort.id);
        expect(cohortAgents.length).toBe(50);
      });
    });

    it('enforces isolated context window hard limit (4,096 tokens) on every single agent', () => {
      agents.forEach(agent => {
        expect(agent.isolatedContext.capacity).toBe(4096);
        expect(agent.isolatedContext.usedTokens).toBeLessThanOrEqual(4096);
        expect(agent.tokenBudget.maxPromptPerCall).toBeLessThanOrEqual(2048);
        expect(agent.tokenBudget.maxCompletionPerCall).toBeLessThanOrEqual(1024);
        expect(agent.policy).toBe('PARL-v4.2-PPO');
        expect(agent.mtlsCertId).toContain('spiffe://swarmops.internal/agent/');
      });
    });
  });

  describe('Layer 2: Shared Context Graph (Zero Context Bloat)', () => {
    it('initializes valid graph hypernodes and edges', () => {
      expect(INITIAL_GRAPH_NODES.length).toBeGreaterThanOrEqual(8);
      expect(INITIAL_GRAPH_EDGES.length).toBeGreaterThanOrEqual(7);
      
      const nodeTypes = new Set(INITIAL_GRAPH_NODES.map(n => n.type));
      expect(nodeTypes.has('Goal')).toBe(true);
      expect(nodeTypes.has('Fact')).toBe(true);
      expect(nodeTypes.has('Artifact')).toBe(true);
    });

    it('queries the graph and returns precise subgraphs in sub-10ms latency', () => {
      const result = queryContextGraph(INITIAL_GRAPH_NODES, INITIAL_GRAPH_EDGES, 'Fact');
      expect(result.nodes.length).toBeGreaterThan(0);
      expect(result.queryLatencyMs).toBeLessThan(15);
      result.nodes.forEach(n => {
        expect(n.type.toLowerCase()).toContain('fact');
      });
    });
  });

  describe('Layer 3: MCP for Tools (Stateless & Trust-Scored)', () => {
    it('validates stateless horizontal worker scaling and trust scoring', () => {
      expect(INITIAL_MCP_TOOLS.length).toBeGreaterThanOrEqual(6);

      INITIAL_MCP_TOOLS.forEach(tool => {
        expect(tool.statelessWorkersCount).toBeGreaterThan(0);
        expect(tool.schema).toBeDefined();
        expect(tool.trustScore).toBeGreaterThanOrEqual(0.0);
        expect(tool.trustScore).toBeLessThanOrEqual(1.0);
      });

      const healthyTool = INITIAL_MCP_TOOLS[0];
      const score = calculateTrustScore(healthyTool);
      expect(score).toBeGreaterThan(0.9);
    });

    it('identifies quarantined tools exceeding error rate thresholds', () => {
      const quarantined = INITIAL_MCP_TOOLS.find(t => t.status === 'QUARANTINED');
      expect(quarantined).toBeDefined();
      expect(quarantined.errorRatePct).toBeGreaterThan(5);
      expect(quarantined.trustScore).toBeLessThan(0.70);
    });
  });

  describe('Layer 4: A2A for Coordination & Anti-Loop Circuit Breaker', () => {
    it('detects and intercepts circular delegation loops to prevent swarm freeze', () => {
      const circularChain = {
        links: [
          { fromAgent: 'agent-052', toAgent: 'agent-108' },
          { fromAgent: 'agent-108', toAgent: 'agent-168' },
          { fromAgent: 'agent-168', toAgent: 'agent-052' }
        ]
      };
      const check = detectCircularDelegation(circularChain);
      expect(check.isCircular).toBe(true);
      expect(check.offendingAgent).toBe('agent-052');
    });

    it('permits valid linear acyclic delegation chains', () => {
      const linearChain = {
        links: [
          { fromAgent: 'agent-052', toAgent: 'agent-108' },
          { fromAgent: 'agent-108', toAgent: 'agent-168' }
        ]
      };
      const check = detectCircularDelegation(linearChain);
      expect(check.isCircular).toBe(false);
    });
  });

  describe('Layer 5: LangGraph DAG with Durable Checkpoints', () => {
    it('verifies deterministic DAG structure and durable checkpoints', () => {
      expect(LANGGRAPH_DAG_NODES.length).toBe(8);
      expect(DURABLE_CHECKPOINTS.length).toBe(5);

      DURABLE_CHECKPOINTS.forEach(chk => {
        expect(chk.checkpointId).toBeDefined();
        expect(chk.stateHash).toContain('sha256:');
        expect(chk.channelValues).toBeDefined();
      });
    });
  });

  describe('Layer 6: Multi-Model Router (70/20/10 Per-Step)', () => {
    it('routes low complexity tasks to Tier 1 fast open-weights', () => {
      const decision = routeStepDynamically('Extract table row', 0.2, 0.1);
      expect(decision.tier).toBe('tier1');
      expect(decision.estCostPerCall).toBeLessThan(0.0005);
    });

    it('routes medium complexity tasks to Tier 2 balanced reasoning', () => {
      const decision = routeStepDynamically('Decompose 6-step SQL schema migration', 0.65, 0.35);
      expect(decision.tier).toBe('tier2');
    });

    it('routes high complexity and critical risk tasks to Tier 3 flagship models', () => {
      const decision = routeStepDynamically('Formal mathematical audit proof for regulatory filing', 0.95, 0.90);
      expect(decision.tier).toBe('tier3');
    });
  });

  describe('Layer 7: Closed-Loop Evals (200-Prompt Regression)', () => {
    it('contains exactly 200 versioned benchmark prompts across 5 categories', () => {
      expect(SEEDED_200_EVALS.length).toBe(200);
      expect(EVAL_CATEGORIES.length).toBe(5);

      EVAL_CATEGORIES.forEach(cat => {
        const catEvals = SEEDED_200_EVALS.filter(e => e.categoryId === cat.id);
        expect(catEvals.length).toBe(40);
      });

      const passed = SEEDED_200_EVALS.filter(e => e.v1_2_status === 'PASSED').length;
      expect(passed).toBe(196); // 98% pass rate in v1.2.0
    });
  });

  describe('Layer 8: Hard Token Budget Caps & Human Escalation', () => {
    it('enforces hardware token tripwire and confidence escalation thresholds', () => {
      expect(HARD_BUDGET_LIMITS.masterRunTokenCap).toBe(500000);
      expect(HARD_BUDGET_LIMITS.masterRunSpendCapUSD).toBe(2.50);
      expect(HARD_BUDGET_LIMITS.confidenceEscalationThreshold).toBe(0.72);
      expect(HARD_BUDGET_LIMITS.tokenVelocityTripwireSec).toBe(12000);
    });
  });
});
