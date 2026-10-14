/**
 * Model Context Protocol (MCP) Tool Registry
 * 
 * Features:
 * - 100% Stateless horizontally scaled worker pools
 * - Dynamic Trust Scoring (0.00 to 1.00)
 * - Automatic Quarantine Circuit Breaker for failing/hallucinating tools
 * - Cryptographic tool signature verification & JSON schema enforcement
 */

export const INITIAL_MCP_TOOLS = [
  {
    id: 'mcp-tool-web-search',
    name: 'web_search_mcp',
    version: '2.4.0',
    statelessWorkersCount: 16,
    trustScore: 0.98,
    status: 'HEALTHY',
    endpoint: 'mcp://cluster-pool-1.swarm.internal:8001/tools/search',
    latencyP95Ms: 142,
    errorRatePct: 0.2,
    invocationsCount: 14820,
    hallucinationRisk: 0.02,
    schema: {
      type: 'object',
      required: ['query'],
      properties: {
        query: { type: 'string', description: 'Clean search term' },
        maxResults: { type: 'integer', default: 5 },
        domainFilter: { type: 'array', items: { type: 'string' } }
      }
    },
    capabilities: ['read_only', 'external_network']
  },
  {
    id: 'mcp-tool-code-sandbox',
    name: 'python_sandbox_mcp',
    version: '3.1.2',
    statelessWorkersCount: 32,
    trustScore: 0.96,
    status: 'HEALTHY',
    endpoint: 'mcp://cluster-pool-2.swarm.internal:8002/tools/exec_python',
    latencyP95Ms: 310,
    errorRatePct: 0.8,
    invocationsCount: 38290,
    hallucinationRisk: 0.04,
    schema: {
      type: 'object',
      required: ['code'],
      properties: {
        code: { type: 'string', description: 'Self-contained Python script' },
        timeoutSec: { type: 'integer', default: 10 },
        memoryLimitMb: { type: 'integer', default: 512 }
      }
    },
    capabilities: ['isolated_sandbox', 'ephemeral_filesystem', 'no_network']
  },
  {
    id: 'mcp-tool-sql-query',
    name: 'warehouse_sql_mcp',
    version: '1.9.0',
    statelessWorkersCount: 24,
    trustScore: 0.99,
    status: 'HEALTHY',
    endpoint: 'mcp://cluster-pool-3.swarm.internal:8003/tools/query_sql',
    latencyP95Ms: 88,
    errorRatePct: 0.1,
    invocationsCount: 52140,
    hallucinationRisk: 0.01,
    schema: {
      type: 'object',
      required: ['sqlStatement'],
      properties: {
        sqlStatement: { type: 'string', description: 'Read-only parameterized SQL query' },
        maxRows: { type: 'integer', default: 500 }
      }
    },
    capabilities: ['read_only_db', 'strict_ast_filter']
  },
  {
    id: 'mcp-tool-graph-query',
    name: 'context_graph_mcp',
    version: '4.0.0',
    statelessWorkersCount: 48,
    trustScore: 0.99,
    status: 'HEALTHY',
    endpoint: 'mcp://cluster-pool-core.swarm.internal:8000/tools/graph_query',
    latencyP95Ms: 12,
    errorRatePct: 0.0,
    invocationsCount: 182400,
    hallucinationRisk: 0.00,
    schema: {
      type: 'object',
      required: ['cypherPattern'],
      properties: {
        cypherPattern: { type: 'string', description: 'Cypher-like graph pattern' },
        depthLimit: { type: 'integer', default: 3 }
      }
    },
    capabilities: ['shared_context_read', 'subgraph_projection']
  },
  {
    id: 'mcp-tool-sec-scanner',
    name: 'vulnerability_sec_mcp',
    version: '1.1.4',
    statelessWorkersCount: 8,
    trustScore: 0.94,
    status: 'HEALTHY',
    endpoint: 'mcp://cluster-pool-sec.swarm.internal:8005/tools/scan_vuln',
    latencyP95Ms: 640,
    errorRatePct: 1.4,
    invocationsCount: 6420,
    hallucinationRisk: 0.05,
    schema: {
      type: 'object',
      required: ['targetAst'],
      properties: {
        targetAst: { type: 'string', description: 'AST representation of generated code' },
        cweRuleset: { type: 'string', default: 'TOP_25' }
      }
    },
    capabilities: ['static_analysis', 'compliance_audit']
  },
  {
    id: 'mcp-tool-unstable-scraper',
    name: 'legacy_dom_scraper_mcp',
    version: '0.8.1',
    statelessWorkersCount: 4,
    trustScore: 0.62,
    status: 'QUARANTINED',
    endpoint: 'mcp://cluster-pool-edge.swarm.internal:8009/tools/raw_dom',
    latencyP95Ms: 1850,
    errorRatePct: 9.4,
    invocationsCount: 1820,
    hallucinationRisk: 0.28,
    schema: {
      type: 'object',
      required: ['url'],
      properties: {
        url: { type: 'string' }
      }
    },
    capabilities: ['legacy_raw_network'],
    quarantineReason: 'Error rate > 5% and high hallucination risk. Traffic rerouted to web_search_mcp.'
  }
];

export const calculateTrustScore = (tool) => {
  const errorPenalty = (tool.errorRatePct / 100) * 0.4;
  const hallucinationPenalty = tool.hallucinationRisk * 0.3;
  const latencyPenalty = Math.min(tool.latencyP95Ms / 2000, 1.0) * 0.3;
  
  const rawScore = 1.0 - (errorPenalty + hallucinationPenalty + latencyPenalty);
  return Number(Math.max(0.0, Math.min(1.0, rawScore)).toFixed(2));
};
