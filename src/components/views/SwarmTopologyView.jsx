import React, { useState } from 'react';
import { COHORTS } from '../../data/swarmTopology';
import { 
  Boxes, 
  Search, 
  Filter, 
  ShieldCheck, 
  Lock, 
  Cpu, 
  Zap, 
  Info,
  Clock,
  ArrowRight,
  Database
} from 'lucide-react';

export default function SwarmTopologyView({ agents, onSelectAgent }) {
  const [selectedCohort, setSelectedCohort] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAgentModal, setActiveAgentModal] = useState(null);

  const filteredAgents = agents.filter(agent => {
    const matchesCohort = selectedCohort === 'all' || agent.cohort === selectedCohort;
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          agent.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCohort && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-swarm-900 border border-swarm-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Swarm Population</span>
            <Boxes className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">300 Agents</div>
          <div className="text-xs text-cyan-400 mt-1">PARL-v4.2-PPO Distributed Policy</div>
        </div>

        <div className="bg-swarm-900 border border-swarm-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Context Isolation</span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">4,096 Tokens</div>
          <div className="text-xs text-slate-400 mt-1">Hard Per-Agent Memory Isolation</div>
        </div>

        <div className="bg-swarm-900 border border-swarm-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>mTLS Identity Verification</span>
            <ShieldCheck className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-violet-400">100% SPIFFE</div>
          <div className="text-xs text-slate-400 mt-1">Zero-Trust Mutual TLS Pod Attestation</div>
        </div>

        <div className="bg-swarm-900 border border-swarm-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Coordination Metric</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">Cf = 0.94</div>
          <div className="text-xs text-slate-400 mt-1">Entropy β = 0.02 (PARL Optimized)</div>
        </div>
      </div>

      {/* Cohort Selector & Filters */}
      <div className="bg-swarm-900/60 border border-swarm-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedCohort('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
                selectedCohort === 'all' 
                  ? 'bg-slate-700 text-white font-semibold' 
                  : 'bg-swarm-800/80 text-slate-400 hover:text-white'
              }`}
            >
              All Cohorts (300)
            </button>
            {COHORTS.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCohort(c.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-1.5 ${
                  selectedCohort === c.id 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold' 
                    : 'bg-swarm-800/60 text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                <span>{c.name} ({c.range[0]}-{c.range[1]})</span>
              </button>
            ))}
          </div>

          {/* Search & Status Filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search agent ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-swarm-950 border border-swarm-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-44 font-mono"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-swarm-950 border border-swarm-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="all">Status: All</option>
              <option value="active">Active</option>
              <option value="idle">Idle</option>
              <option value="delegating">Delegating</option>
              <option value="waiting_lock">Waiting Lock</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-400 flex items-center justify-between pt-1 border-t border-swarm-800/40">
          <span>Showing <strong className="text-white font-mono">{filteredAgents.length}</strong> of 300 agents</span>
          <span className="text-[11px] text-slate-500">Click any agent pod to inspect isolated context buffer & token telemetry</span>
        </div>
      </div>

      {/* 300 Agent Swarm Density Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2.5 max-h-[640px] overflow-y-auto pr-1">
        {filteredAgents.map(agent => {
          const isContextHigh = agent.isolatedContext.utilizationPct > 70;
          return (
            <div
              key={agent.id}
              onClick={() => setActiveAgentModal(agent)}
              className="bg-swarm-900 border border-swarm-800/90 hover:border-cyan-500/50 rounded-lg p-2.5 cursor-pointer transition hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/5 group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-semibold text-white group-hover:text-cyan-400 transition">
                  {agent.id}
                </span>
                <span 
                  className={`w-2 h-2 rounded-full ${
                    agent.status === 'active' ? 'bg-emerald-400 animate-pulse' :
                    agent.status === 'delegating' ? 'bg-violet-400 animate-ping' :
                    agent.status === 'waiting_lock' ? 'bg-amber-400' : 'bg-slate-600'
                  }`}
                  title={`Status: ${agent.status}`}
                />
              </div>

              <div className="text-[11px] text-slate-400 truncate font-mono">
                {agent.cohortName.split(' ')[0]}
              </div>

              {/* Context Window Utilization Gauge */}
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Context:</span>
                  <span className={isContextHigh ? 'text-amber-400' : 'text-slate-300'}>
                    {agent.isolatedContext.utilizationPct}%
                  </span>
                </div>
                <div className="w-full bg-swarm-950 rounded-full h-1 overflow-hidden border border-slate-800">
                  <div 
                    className={`h-full rounded-full ${isContextHigh ? 'bg-amber-500' : 'bg-cyan-500'}`}
                    style={{ width: `${agent.isolatedContext.utilizationPct}%` }}
                  />
                </div>
              </div>

              {/* Token budget burn */}
              <div className="mt-1.5 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                <span>Burn:</span>
                <span className="text-slate-400">{agent.tokenBudget.budgetBurnPct}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Agent Detail Modal */}
      {activeAgentModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-swarm-900 border border-swarm-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold font-mono text-white">{activeAgentModal.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                    {activeAgentModal.cohortName}
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-400 mt-0.5">{activeAgentModal.mtlsCertId}</p>
              </div>
              <button
                onClick={() => setActiveAgentModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-swarm-800 text-sm font-mono"
              >
                ✕
              </button>
            </div>

            {/* Policy & Weights */}
            <div className="grid grid-cols-3 gap-2 bg-swarm-950 p-3 rounded-xl border border-swarm-800 text-xs font-mono">
              <div>
                <span className="text-slate-500 block">Policy</span>
                <span className="text-cyan-400 font-semibold">{activeAgentModal.policy}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Specialization</span>
                <span className="text-white font-semibold">{(activeAgentModal.specializationScore * 100).toFixed(0)}%</span>
              </div>
              <div>
                <span className="text-slate-500 block">Entropy (β)</span>
                <span className="text-amber-400 font-semibold">{activeAgentModal.entropy}</span>
              </div>
            </div>

            {/* Isolated Context Window Details */}
            <div className="bg-swarm-950 border border-swarm-800 p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  Isolated Context Window
                </span>
                <span className="text-cyan-400">
                  {activeAgentModal.isolatedContext.usedTokens} / {activeAgentModal.isolatedContext.capacity} tokens ({activeAgentModal.isolatedContext.utilizationPct}%)
                </span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full"
                  style={{ width: `${activeAgentModal.isolatedContext.utilizationPct}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 pt-1">
                <div>Pinned System Tokens: <span className="text-white">{activeAgentModal.isolatedContext.pinnedSystemTokens}</span></div>
                <div>Memory Buffer Items: <span className="text-white">{activeAgentModal.isolatedContext.bufferItemsCount} (FIFO)</span></div>
              </div>
            </div>

            {/* Token Budget */}
            <div className="bg-swarm-950 border border-swarm-800 p-4 rounded-xl space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-300 font-semibold">
                <span>Task Token Allocation:</span>
                <span className="text-emerald-400">
                  {activeAgentModal.tokenBudget.totalConsumed.toLocaleString()} / {activeAgentModal.tokenBudget.totalAllocated.toLocaleString()} ({activeAgentModal.tokenBudget.budgetBurnPct}%)
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                <div>Max Prompt/Call: <span className="text-white">{activeAgentModal.tokenBudget.maxPromptPerCall}</span></div>
                <div>Max Completion/Call: <span className="text-white">{activeAgentModal.tokenBudget.maxCompletionPerCall}</span></div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveAgentModal(null)}
                className="bg-swarm-800 hover:bg-swarm-700 text-white px-4 py-2 rounded-lg text-xs font-mono transition"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
