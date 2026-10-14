/**
 * Hard Token Budget Caps & Human Escalation Inbox (HITL)
 * 
 * Features:
 * - Sub-millisecond Token Burn Tripwires
 * - Dollar and Token Hard Caps per Task / Master Run
 * - Human-in-the-Loop (HITL) Escalation Inbox with Checkpoint Resumption
 */

export const HARD_BUDGET_LIMITS = {
  masterRunTokenCap: 500000,
  masterRunSpendCapUSD: 2.50,
  perAgentContextLimitTokens: 4096,
  perCallPromptCapTokens: 2048,
  tokenVelocityTripwireSec: 12000, // max tokens per second across swarm
  confidenceEscalationThreshold: 0.72
};

export const INITIAL_ESCALATION_QUEUE = [
  {
    id: 'esc-001',
    agentId: 'agent-168',
    agentName: 'PARL-Execution-168',
    timestamp: '2026-10-14 17:18:22',
    severity: 'HIGH_RISK_ACTION',
    title: 'Destructive DDL Migration on Production Ledger Table',
    details: 'Agent is requesting permission to execute: ALTER TABLE financial_ledger DROP COLUMN temp_legacy_balance. This action is irreversible.',
    confidenceScore: 0.68,
    checkpointId: 'chk-003-fanout',
    proposedAction: {
      tool: 'warehouse_sql_mcp',
      statement: 'ALTER TABLE financial_ledger DROP COLUMN temp_legacy_balance',
      estimatedImpact: '14,200 records altered'
    },
    status: 'PENDING_REVIEW', // PENDING_REVIEW, APPROVED, REJECTED
    resolutionNote: null
  },
  {
    id: 'esc-002',
    agentId: 'agent-220',
    agentName: 'PARL-Auditor-220',
    timestamp: '2026-10-14 17:19:05',
    severity: 'CONTRADICTION_DETECTED',
    title: 'Discrepancy in SEC 10-K vs Internal ERP Revenue Figures',
    details: 'Reported 10-K Net Revenue ($170.0B) exceeds ERP recorded closed invoices ($168.4B) by $1.6B. Flagged for human accountant signoff.',
    confidenceScore: 0.71,
    checkpointId: 'chk-005-gate',
    proposedAction: {
      tool: 'context_graph_mcp',
      action: 'ADD_CONTRADICTING_FACT_NODE',
      varianceAmount: '$1.6 Billion'
    },
    status: 'PENDING_REVIEW',
    resolutionNote: null
  },
  {
    id: 'esc-003',
    agentId: 'agent-055',
    agentName: 'PARL-Planner-055',
    timestamp: '2026-10-14 17:19:40',
    severity: 'BUDGET_WARNING',
    title: 'Swarm Run Token Consumption at 82% of Hard Cap',
    details: 'Total run consumption has reached 410,200 / 500,000 tokens ($2.05 / $2.50). Requesting human authorization to grant additional 100k token buffer.',
    confidenceScore: 0.95,
    checkpointId: 'chk-005-gate',
    proposedAction: {
      action: 'EXPAND_BUDGET_CAP',
      additionalTokensRequested: 100000,
      additionalSpendUSD: 0.50
    },
    status: 'PENDING_REVIEW',
    resolutionNote: null
  }
];
