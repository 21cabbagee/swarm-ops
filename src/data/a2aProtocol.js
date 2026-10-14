/**
 * Agent-to-Agent (A2A) Coordination Protocol
 * 
 * Features:
 * - Machine-readable Agent Cards
 * - Verifiable Cryptographic Delegation Chains with max-depth guards
 * - Mutual TLS (mTLS) Zero-Trust Identity Attestation
 * - Circular Delegation Loop Detection Engine
 */

export const SAMPLE_AGENT_CARDS = [
  {
    agentId: 'agent-052',
    name: 'PARL-Planner-052',
    cohort: 'planner',
    version: '1.4.0',
    capabilities: ['dag_orchestration', 'task_decomposition', 'sla_scheduling'],
    inputSchema: { type: 'object', required: ['highLevelGoal'], properties: { highLevelGoal: { type: 'string' } } },
    outputSchema: { type: 'object', required: ['taskDag'], properties: { taskDag: { type: 'array' } } },
    costPerCallUSD: 0.0012,
    p99SlaMs: 450,
    trustTier: 'GOLD',
    mTLS: {
      spiffeId: 'spiffe://swarmops.internal/agent/052',
      certFingerprint: 'SHA256:7b:91:f0:24:99:a4:e1:82:3d:ec:55:01:8a:e2:11:00',
      validUntil: '2027-10-14'
    }
  },
  {
    agentId: 'agent-168',
    name: 'PARL-Execution-168',
    cohort: 'execution',
    version: '2.1.0',
    capabilities: ['sql_synthesis', 'ddl_migration', 'snowflake_optimization'],
    inputSchema: { type: 'object', required: ['dataContract'], properties: { dataContract: { type: 'object' } } },
    outputSchema: { type: 'object', required: ['executableSql'], properties: { executableSql: { type: 'string' } } },
    costPerCallUSD: 0.0008,
    p99SlaMs: 320,
    trustTier: 'PLATINUM',
    mTLS: {
      spiffeId: 'spiffe://swarmops.internal/agent/168',
      certFingerprint: 'SHA256:3a:14:bb:78:09:ff:2a:11:90:bc:44:88:21:ee:09:fa',
      validUntil: '2027-10-14'
    }
  },
  {
    agentId: 'agent-214',
    name: 'PARL-Audit-214',
    cohort: 'verification',
    version: '1.8.2',
    capabilities: ['security_audit', 'pii_detection', 'ast_validation'],
    inputSchema: { type: 'object', required: ['artifactPayload'], properties: { artifactPayload: { type: 'string' } } },
    outputSchema: { type: 'object', required: ['auditPassed', 'violations'], properties: { auditPassed: { type: 'boolean' } } },
    costPerCallUSD: 0.0005,
    p99SlaMs: 210,
    trustTier: 'PLATINUM',
    mTLS: {
      spiffeId: 'spiffe://swarmops.internal/agent/214',
      certFingerprint: 'SHA256:de:ad:be:ef:12:34:56:78:90:ab:cd:ef:fe:dc:ba:09',
      validUntil: '2027-10-14'
    }
  }
];

export const ACTIVE_DELEGATION_CHAINS = [
  {
    chainId: 'chain-del-9801',
    rootGoal: 'SEC 10-K Ingestion & Autonomous Audit',
    depth: 3,
    maxDepth: 4,
    status: 'ACTIVE',
    links: [
      {
        fromAgent: 'agent-052 (Planner)',
        toAgent: 'agent-108 (Research)',
        action: 'DELEGATE_FACT_EXTRACTION',
        signedToken: 'eyJhbGciOiJFUzI1NiIsImtpZCI6InN3YXJtLWtleS0wMSJ9.eyJyZWZ...del_01',
        timestamp: '17:15:30',
        mTLSStatus: 'VERIFIED'
      },
      {
        fromAgent: 'agent-108 (Research)',
        toAgent: 'agent-168 (Execution)',
        action: 'DELEGATE_SQL_VERIFICATION',
        signedToken: 'eyJhbGciOiJFUzI1NiIsImtpZCI6InN3YXJtLWtleS0wMiJ9.eyJyZWZ...del_02',
        timestamp: '17:16:15',
        mTLSStatus: 'VERIFIED'
      },
      {
        fromAgent: 'agent-168 (Execution)',
        toAgent: 'agent-214 (Verification)',
        action: 'DELEGATE_SECURITY_AUDIT',
        signedToken: 'eyJhbGciOiJFUzI1NiIsImtpZCI6InN3YXJtLWtleS0wMyJ9.eyJyZWZ...del_03',
        timestamp: '17:17:02',
        mTLSStatus: 'VERIFIED'
      }
    ]
  },
  {
    chainId: 'chain-del-9802',
    rootGoal: 'Distributed Mutex Lock Acquisition',
    depth: 2,
    maxDepth: 4,
    status: 'COMPLETED',
    links: [
      {
        fromAgent: 'agent-180 (Execution)',
        toAgent: 'agent-055 (Planner)',
        action: 'REQUEST_LOCK_PERMISSION',
        signedToken: 'eyJhbGciOiJFUzI1NiIsImtpZCI6InN3YXJtLWtleS0wNCJ9.eyJyZWZ...del_04',
        timestamp: '17:18:00',
        mTLSStatus: 'VERIFIED'
      },
      {
        fromAgent: 'agent-055 (Planner)',
        toAgent: 'agent-180 (Execution)',
        action: 'GRANT_MUTEX_LOCK_TOKEN',
        signedToken: 'eyJhbGciOiJFUzI1NiIsImtpZCI6InN3YXJtLWtleS0wNSJ9.eyJyZWZ...del_05',
        timestamp: '17:18:18',
        mTLSStatus: 'VERIFIED'
      }
    ]
  }
];

export const detectCircularDelegation = (chain) => {
  const visited = new Set();
  for (const link of chain.links) {
    if (visited.has(link.toAgent)) {
      return { isCircular: true, offendingAgent: link.toAgent };
    }
    visited.add(link.fromAgent);
  }
  return { isCircular: false };
};
