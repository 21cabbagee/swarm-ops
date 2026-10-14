import React, { useState } from 'react';
import { INITIAL_GRAPH_NODES, INITIAL_GRAPH_EDGES, queryContextGraph } from '../../data/contextGraph';
import { 
  Database, 
  Terminal, 
  Search, 
  Share2, 
  Layers, 
  CheckCircle, 
  Lock, 
  FileText, 
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';

export default function ContextGraphView() {
  const [nodes, setNodes] = useState(INITIAL_GRAPH_NODES);
  const [edges, setEdges] = useState(INITIAL_GRAPH_EDGES);
  const [cypherQuery, setCypherQuery] = useState('MATCH (n) RETURN n');
  const [queryResult, setQueryResult] = useState({ nodes: INITIAL_GRAPH_NODES, edges: INITIAL_GRAPH_EDGES, queryLatencyMs: 2.1 });
  const [selectedNode, setSelectedNode] = useState(INITIAL_GRAPH_NODES[0]);

  const handleRunQuery = (e) => {
    e?.preventDefault();
    const result = queryContextGraph(nodes, edges, cypherQuery);
    setQueryResult(result);
  };

  const sampleQueries = [
    { label: 'All Verified Facts', query: 'Fact' },
    { label: 'All Artifacts & DDL', query: 'Artifact' },
    { label: 'Distributed Locks', query: 'Lock' },
    { label: 'SEC 10-K Entity', query: '10-K' }
  ];

  const getNodeTypeBadge = (type) => {
    switch (type) {
      case 'Goal': return 'bg-violet-950 text-violet-300 border-violet-500/40';
      case 'Entity': return 'bg-cyan-950 text-cyan-300 border-cyan-500/40';
      case 'Fact': return 'bg-emerald-950 text-emerald-300 border-emerald-500/40';
      case 'Hypothesis': return 'bg-amber-950 text-amber-300 border-amber-500/40';
      case 'Artifact': return 'bg-blue-950 text-blue-300 border-blue-500/40';
      case 'Verification': return 'bg-rose-950 text-rose-300 border-rose-500/40';
      case 'Lock': return 'bg-yellow-950 text-yellow-300 border-yellow-500/40';
      default: return 'bg-slate-900 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-swarm-900 to-violet-950/40 border border-cyan-500/30 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                <Database className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold font-mono text-white">Shared Context Graph (Live Metadata Engine)</h2>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Standard multi-agent swarms dump entire conversation transcripts into every agent's context, incurring catastrophic $O(N^2)$ quadratic token inflation and hallucination. In SwarmOps, all 300 agents communicate by querying this centralized, reactive hypergraph. Agents keep their context windows bounded to 4K tokens, querying sub-100 token metadata slices on-demand.
            </p>
          </div>
          <div className="text-right font-mono bg-swarm-950/80 border border-swarm-800 rounded-xl p-3 shrink-0">
            <div className="text-xs text-slate-500">Live Graph Latency</div>
            <div className="text-xl font-bold text-cyan-400">{queryResult.queryLatencyMs} ms</div>
            <div className="text-[10px] text-emerald-400">Zero Token Pollution</div>
          </div>
        </div>
      </div>

      {/* Query Terminal */}
      <div className="bg-swarm-900 border border-swarm-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            Live Metadata Query Terminal (Cypher / Semantic Filter)
          </span>
          <div className="flex items-center gap-1.5">
            {sampleQueries.map(sq => (
              <button
                key={sq.label}
                onClick={() => { setCypherQuery(sq.query); queryContextGraph(nodes, edges, sq.query); }}
                className="text-[11px] font-mono px-2 py-1 bg-swarm-950 hover:bg-swarm-800 text-slate-300 rounded border border-swarm-800 transition"
              >
                {sq.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleRunQuery} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={cypherQuery}
              onChange={(e) => setCypherQuery(e.target.value)}
              placeholder="e.g. MATCH (f:Fact) WHERE confidence > 0.9 RETURN f"
              className="w-full bg-swarm-950 border border-swarm-800 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition active:scale-95"
          >
            <Zap className="w-3.5 h-3.5" />
            Execute Query
          </button>
        </form>
      </div>

      {/* Main Two-Column Graph & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nodes List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Graph Nodes ({queryResult.nodes.length})</span>
            <span>Edges ({queryResult.edges.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[580px] overflow-y-auto pr-1">
            {queryResult.nodes.map(node => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`bg-swarm-900 border rounded-xl p-4 cursor-pointer transition hover:border-cyan-500/50 space-y-2.5 ${
                    isSelected ? 'border-cyan-500 shadow-md shadow-cyan-500/10' : 'border-swarm-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getNodeTypeBadge(node.type)}`}>
                      {node.type}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{node.id}</span>
                  </div>

                  <h4 className="text-xs font-bold text-white font-mono line-clamp-2">{node.label}</h4>

                  <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between pt-1 border-t border-swarm-800/60">
                    <span>Author: <strong className="text-cyan-400">{node.author}</strong></span>
                    <span className="text-slate-500">{node.timestamp.split(' ')[1]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Node Inspector */}
        <div className="bg-swarm-900 border border-swarm-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-swarm-800 pb-3">
            <span className="text-xs font-mono font-semibold text-slate-300">Node Inspector</span>
            {selectedNode && (
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getNodeTypeBadge(selectedNode.type)}`}>
                {selectedNode.type}
              </span>
            )}
          </div>

          {selectedNode ? (
            <div className="space-y-4 font-mono text-xs">
              <div>
                <span className="text-slate-500 text-[11px] block">Label / Title</span>
                <span className="text-white font-bold text-sm block mt-0.5">{selectedNode.label}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-swarm-950 p-3 rounded-lg border border-swarm-800 text-[11px]">
                <div>
                  <span className="text-slate-500 block">Node ID</span>
                  <span className="text-cyan-400">{selectedNode.id}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Authoring Agent</span>
                  <span className="text-violet-400">{selectedNode.author} ({selectedNode.cohort})</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 text-[11px] block mb-1">Node Properties (Key-Value State)</span>
                <div className="bg-swarm-950 p-3 rounded-lg border border-swarm-800 text-[11px] space-y-1.5 overflow-x-auto">
                  {Object.entries(selectedNode.properties).map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-2 border-b border-swarm-900 pb-1">
                      <span className="text-slate-400">{k}:</span>
                      <span className="text-emerald-400 font-semibold">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Edge connections */}
              <div>
                <span className="text-slate-500 text-[11px] block mb-1">Connected Graph Edges</span>
                <div className="space-y-1.5">
                  {edges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).map(e => (
                    <div key={e.id} className="text-[10px] bg-swarm-950 border border-swarm-800 p-2 rounded flex items-center justify-between">
                      <span className="text-slate-400">{e.source}</span>
                      <span className="text-cyan-400 font-bold px-1.5 py-0.5 bg-cyan-950/60 rounded">-- {e.label} --&gt;</span>
                      <span className="text-slate-400">{e.target}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-slate-500 text-xs text-center py-10 font-mono">
              Select any graph node to inspect its live properties and hypergraph connections
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
