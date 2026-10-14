import React, { useState } from 'react';
import { LANGGRAPH_DAG_NODES, LANGGRAPH_DAG_EDGES, DURABLE_CHECKPOINTS, LANGSMITH_TRACES } from '../../data/langgraphDag';
import { 
  GitFork, 
  History, 
  Activity, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Database,
  Sliders,
  Terminal,
  Play
} from 'lucide-react';

export default function LangGraphDagView() {
  const [nodes, setNodes] = useState(LANGGRAPH_DAG_NODES);
  const [selectedNode, setSelectedNode] = useState(LANGGRAPH_DAG_NODES[1]);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState(DURABLE_CHECKPOINTS[2]);
  const [timeTravelMessage, setTimeTravelMessage] = useState(null);

  const handleTimeTravel = (checkpoint) => {
    setSelectedCheckpoint(checkpoint);
    setTimeTravelMessage(`Swarm State successfully rewound to checkpoint [${checkpoint.checkpointId}] at node "${checkpoint.nodeName}". DAG fork ready for execution.`);
    setTimeout(() => setTimeTravelMessage(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-swarm-900 to-emerald-950/40 border border-cyan-500/30 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                <GitFork className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold font-mono text-white">LangGraph DAG Orchestration & Checkpoints</h2>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Executes as a deterministic StateGraph DAG with conditional branching, parallel fan-outs, and durable checkpoints. At every node boundary, a cryptographic state snapshot is persisted to durable storage, enabling fault recovery, human-in-the-loop pauses, and seamless time-travel replays.
            </p>
          </div>
          <div className="text-right font-mono bg-swarm-950/80 border border-swarm-800 rounded-xl p-3 shrink-0">
            <div className="text-xs text-slate-500">Durable Checkpoints</div>
            <div className="text-xl font-bold text-cyan-400">5 Snapshots</div>
            <div className="text-[10px] text-emerald-400">Time-Travel Enabled</div>
          </div>
        </div>
      </div>

      {timeTravelMessage && (
        <div className="bg-cyan-950/70 border border-cyan-500/50 p-4 rounded-xl text-xs font-mono text-cyan-300 flex items-center gap-2 animate-in fade-in">
          <History className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{timeTravelMessage}</span>
        </div>
      )}

      {/* DAG Node Pipeline */}
      <div className="bg-swarm-900 border border-swarm-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-swarm-800 pb-3">
          <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Active LangGraph DAG Execution State
          </span>
          <span className="text-[10px] font-mono text-slate-500">Run ID: th-swarm-run-8492</span>
        </div>

        {/* Horizontal Node Stepper */}
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto py-2">
          {nodes.map((node, idx) => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <React.Fragment key={node.id}>
                <button
                  onClick={() => setSelectedNode(node)}
                  className={`p-3 rounded-xl border text-left font-mono transition min-w-[170px] ${
                    isSelected 
                      ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-md shadow-cyan-500/10' 
                      : node.status === 'COMPLETED'
                        ? 'bg-swarm-950 border-emerald-500/40 text-slate-300'
                        : node.status === 'ACTIVE'
                          ? 'bg-swarm-950 border-amber-500/60 text-white animate-pulse'
                          : 'bg-swarm-950/50 border-swarm-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="text-slate-500">{node.type}</span>
                    <span className={`px-1.5 py-0.2 rounded-full ${
                      node.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-400' :
                      node.status === 'ACTIVE' ? 'bg-amber-950 text-amber-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {node.status}
                    </span>
                  </div>
                  <div className="text-xs font-bold truncate">{node.label}</div>
                  {node.durationMs > 0 && (
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{node.durationMs} ms</span>
                    </div>
                  )}
                </button>
                {idx < nodes.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Two Column: Checkpoints & LangSmith Tracing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Durable Checkpoints (Time Travel) */}
        <div className="bg-swarm-900 border border-swarm-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-swarm-800 pb-3">
            <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-2">
              <History className="w-4 h-4 text-violet-400" />
              Durable Checkpoints (State Snapshots)
            </span>
            <span className="text-[10px] font-mono text-slate-500">Postgres / SQLite Saver</span>
          </div>

          <div className="space-y-3">
            {DURABLE_CHECKPOINTS.map(chk => (
              <div 
                key={chk.checkpointId}
                className={`bg-swarm-950 border rounded-xl p-3.5 font-mono text-xs transition ${
                  selectedCheckpoint?.checkpointId === chk.checkpointId 
                    ? 'border-violet-500/80 bg-violet-950/10' 
                    : 'border-swarm-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-white">{chk.nodeName}</span>
                  <span className="text-[10px] text-slate-500">{chk.checkpointId}</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between mb-2">
                  <span>Hash: <code className="text-slate-300">{chk.stateHash}</code></span>
                  <span>{chk.timestamp.split(' ')[1]}</span>
                </div>

                <div className="bg-swarm-900 p-2 rounded text-[11px] text-emerald-400 border border-swarm-800/80 overflow-x-auto mb-2">
                  {JSON.stringify(chk.channelValues, null, 2)}
                </div>

                <button
                  onClick={() => handleTimeTravel(chk)}
                  className="w-full py-1.5 px-3 rounded bg-violet-950 hover:bg-violet-900 text-violet-300 border border-violet-500/40 text-[11px] font-semibold transition flex items-center justify-center gap-1.5"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Time-Travel Replay from Here</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* LangSmith Distributed Tracing Spans */}
        <div className="bg-swarm-900 border border-swarm-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-swarm-800 pb-3">
            <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              LangSmith Distributed Tracing Spans
            </span>
            <span className="text-[10px] font-mono text-slate-400">Total Latency: 2,462 ms</span>
          </div>

          <div className="space-y-2.5 font-mono">
            {LANGSMITH_TRACES[0].spans.map((span, idx) => (
              <div key={idx} className="bg-swarm-950 border border-swarm-800 p-3 rounded-lg text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{span.name}</span>
                  <span className="text-cyan-400 font-semibold">{span.latencyMs} ms</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-swarm-800/60">
                  <span>Model: <strong className="text-violet-400">{span.model}</strong></span>
                  <span>Tokens: <strong className="text-slate-300">{span.tokens}</strong> (${span.cost.toFixed(4)})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
