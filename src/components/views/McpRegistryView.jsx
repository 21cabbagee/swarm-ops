import React, { useState } from 'react';
import { INITIAL_MCP_TOOLS, calculateTrustScore } from '../../data/mcpRegistry';
import { 
  Cpu, 
  ShieldAlert, 
  CheckCircle, 
  Clock, 
  Activity, 
  AlertTriangle, 
  Lock, 
  Terminal, 
  RotateCw,
  Server
} from 'lucide-react';

export default function McpRegistryView() {
  const [tools, setTools] = useState(INITIAL_MCP_TOOLS);
  const [selectedTool, setSelectedTool] = useState(INITIAL_MCP_TOOLS[0]);

  const toggleQuarantine = (toolId) => {
    setTools(prev => prev.map(t => {
      if (t.id === toolId) {
        const nextStatus = t.status === 'QUARANTINED' ? 'HEALTHY' : 'QUARANTINED';
        return {
          ...t,
          status: nextStatus,
          trustScore: nextStatus === 'HEALTHY' ? 0.95 : 0.60
        };
      }
      return t;
    }));

    if (selectedTool?.id === toolId) {
      setSelectedTool(prev => ({
        ...prev,
        status: prev.status === 'QUARANTINED' ? 'HEALTHY' : 'QUARANTINED',
        trustScore: prev.status === 'QUARANTINED' ? 0.95 : 0.60
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-swarm-900 to-cyan-950/40 border border-emerald-500/30 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <Cpu className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold font-mono text-white">Model Context Protocol (MCP) Tool Registry</h2>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              All tools are executed through stateless, horizontally-scaled MCP worker pools. Tool health is governed continuously by a dynamic trust score algorithm: if error rates exceed 5% or hallucination risk spikes, the circuit breaker instantly quarantines the tool and falls back to safe alternatives.
            </p>
          </div>
          <div className="text-right font-mono bg-swarm-950/80 border border-swarm-800 rounded-xl p-3 shrink-0">
            <div className="text-xs text-slate-500">Stateless Workers</div>
            <div className="text-xl font-bold text-emerald-400">180 Pods</div>
            <div className="text-[10px] text-cyan-400">Horizontal Auto-Scaling</div>
          </div>
        </div>
      </div>

      {/* Grid of MCP Tools & Tool Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tool Cards */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Registered MCP Tool Endpoints ({tools.length})</span>
            <span>Trust Score Threshold: &gt; 0.70</span>
          </div>

          <div className="space-y-3">
            {tools.map(tool => {
              const isSelected = selectedTool?.id === tool.id;
              const isQuarantined = tool.status === 'QUARANTINED';
              const trustPct = Math.round(tool.trustScore * 100);

              return (
                <div
                  key={tool.id}
                  onClick={() => setSelectedTool(tool)}
                  className={`bg-swarm-900 border rounded-xl p-4 cursor-pointer transition hover:border-emerald-500/50 ${
                    isSelected ? 'border-emerald-500 shadow-lg shadow-emerald-500/10' : 
                    isQuarantined ? 'border-rose-500/40 bg-rose-950/10' : 'border-swarm-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-white">{tool.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-swarm-950 border border-slate-700 text-slate-300">
                          v{tool.version}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                          isQuarantined 
                            ? 'bg-rose-950 text-rose-300 border-rose-500/50 animate-pulse' 
                            : 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                        }`}>
                          {tool.status}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                        <Server className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-slate-300">{tool.statelessWorkersCount} stateless worker pods</span>
                        <span>•</span>
                        <span>{tool.invocationsCount.toLocaleString()} calls</span>
                      </div>
                    </div>

                    {/* Trust Score Badge */}
                    <div className="text-right font-mono">
                      <div className="text-xs text-slate-400">Trust Score</div>
                      <div className={`text-lg font-bold ${
                        tool.trustScore >= 0.90 ? 'text-emerald-400' :
                        tool.trustScore >= 0.70 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {(tool.trustScore * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>

                  {/* Telemetry Metrics */}
                  <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-swarm-800/60 text-xs font-mono">
                    <div className="bg-swarm-950 p-2 rounded border border-swarm-800">
                      <span className="text-slate-500 block text-[10px]">P95 Latency</span>
                      <span className="text-white font-semibold">{tool.latencyP95Ms} ms</span>
                    </div>
                    <div className="bg-swarm-950 p-2 rounded border border-swarm-800">
                      <span className="text-slate-500 block text-[10px]">Error Rate</span>
                      <span className={`${tool.errorRatePct > 5 ? 'text-rose-400' : 'text-slate-300'} font-semibold`}>
                        {tool.errorRatePct}%
                      </span>
                    </div>
                    <div className="bg-swarm-950 p-2 rounded border border-swarm-800">
                      <span className="text-slate-500 block text-[10px]">Hallucination Risk</span>
                      <span className={`${tool.hallucinationRisk > 0.1 ? 'text-rose-400' : 'text-emerald-400'} font-semibold`}>
                        {(tool.hallucinationRisk * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {isQuarantined && tool.quarantineReason && (
                    <div className="mt-2 text-xs font-mono bg-rose-950/40 border border-rose-500/30 p-2 rounded text-rose-300 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{tool.quarantineReason}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Tool Details & JSON Schema */}
        <div className="bg-swarm-900 border border-swarm-800 rounded-xl p-5 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-swarm-800 pb-3">
            <span className="font-semibold text-slate-300">MCP Schema & Protocol</span>
            <span className="text-[10px] text-emerald-400">Stateless RPC</span>
          </div>

          {selectedTool ? (
            <div className="space-y-4">
              <div>
                <span className="text-slate-500 text-[11px] block">MCP Endpoint</span>
                <span className="text-cyan-400 text-xs break-all bg-swarm-950 p-2 rounded border border-swarm-800 block mt-1">
                  {selectedTool.endpoint}
                </span>
              </div>

              <div>
                <span className="text-slate-500 text-[11px] block mb-1">Declared Capabilities</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTool.capabilities.map(cap => (
                    <span key={cap} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-500 text-[11px] block mb-1">JSON Schema (Strict Validation)</span>
                <pre className="bg-swarm-950 p-3 rounded-lg border border-swarm-800 text-[11px] text-slate-300 overflow-x-auto max-h-48">
                  {JSON.stringify(selectedTool.schema, null, 2)}
                </pre>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => toggleQuarantine(selectedTool.id)}
                  className={`w-full py-2 px-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                    selectedTool.status === 'QUARANTINED'
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-rose-600/80 hover:bg-rose-600 text-white'
                  }`}
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>
                    {selectedTool.status === 'QUARANTINED' ? 'Restore to Active Mesh' : 'Trigger Quarantine Circuit Breaker'}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-slate-500 text-center py-10">Select a tool to view schema</div>
          )}
        </div>
      </div>
    </div>
  );
}
