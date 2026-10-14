import React from 'react';
import { 
  Cpu, 
  Database, 
  GitFork, 
  ShieldCheck, 
  Sliders, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Play, 
  RotateCcw,
  Boxes,
  Zap,
  Lock
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  agentsCount, 
  activeAgentsCount, 
  tokenMetrics, 
  pendingEscalationsCount,
  onSimulateStep,
  onReset
}) {
  const tokenPct = Math.round((tokenMetrics.usedTokens / tokenMetrics.capTokens) * 100);
  const spendPct = Math.round((tokenMetrics.spendUSD / tokenMetrics.capUSD) * 100);

  const navItems = [
    { id: 'topology', label: '300-Agent Swarm', icon: Boxes, badge: `${activeAgentsCount} live` },
    { id: 'graph', label: 'Shared Context Graph', icon: Database, badge: 'Zero-Bloat' },
    { id: 'mcp', label: 'MCP Tool Registry', icon: Cpu, badge: 'Stateless' },
    { id: 'a2a', label: 'A2A & mTLS', icon: Lock, badge: 'Delegation' },
    { id: 'langgraph', label: 'LangGraph DAG', icon: GitFork, badge: 'Checkpoints' },
    { id: 'router', label: '70/20/10 Router', icon: Sliders, badge: 'Per-Step' },
    { id: 'evals', label: '200 Closed Evals', icon: CheckCircle2, badge: '98% Pass' },
    { id: 'escalation', label: 'Human Escalation', icon: AlertTriangle, badge: pendingEscalationsCount, isAlert: pendingEscalationsCount > 0 }
  ];

  return (
    <header className="border-b border-swarm-800 bg-swarm-950/95 backdrop-blur-md sticky top-0 z-50">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-swarm-cyan via-swarm-violet to-swarm-rose p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-swarm-950 rounded-[10px] flex items-center justify-center">
              <Boxes className="w-5 h-5 text-swarm-cyan animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white font-mono">
                SwarmOps<span className="text-swarm-cyan">::</span>PARL
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 font-mono">
                300-Agent Swarm
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Mesh
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Policy-Aware RL • Isolated Context Windows • Shared Context Graph • Stateless MCP • LangGraph Checkpoints
            </p>
          </div>
        </div>

        {/* Global Token & Spend Hard Cap Meter */}
        <div className="flex items-center gap-6 bg-swarm-900/80 border border-swarm-800 rounded-xl px-4 py-2 text-xs font-mono">
          <div>
            <div className="flex justify-between items-center text-slate-400 mb-1">
              <span>Token Hard Cap:</span>
              <span className="text-cyan-400 font-semibold">{tokenMetrics.usedTokens.toLocaleString()} / {tokenMetrics.capTokens.toLocaleString()}</span>
            </div>
            <div className="w-40 bg-swarm-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${tokenPct > 80 ? 'bg-amber-500' : 'bg-cyan-500'}`} 
                style={{ width: `${Math.min(tokenPct, 100)}%` }}
              />
            </div>
          </div>

          <div className="border-l border-swarm-800 pl-4">
            <div className="flex justify-between items-center text-slate-400 mb-1">
              <span>Spend Limit:</span>
              <span className="text-emerald-400 font-semibold">${tokenMetrics.spendUSD.toFixed(2)} / ${tokenMetrics.capUSD.toFixed(2)}</span>
            </div>
            <div className="w-28 bg-swarm-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${spendPct > 80 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                style={{ width: `${Math.min(spendPct, 100)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pl-2">
            <button
              onClick={onSimulateStep}
              className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded-lg font-medium transition shadow-sm hover:shadow-cyan-500/20 active:scale-95"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Simulate Step</span>
            </button>
            <button
              onClick={onReset}
              title="Reset Swarm State"
              className="text-slate-400 hover:text-slate-200 p-1.5 hover:bg-swarm-800 rounded-lg transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto gap-1 border-t border-swarm-800/60 no-scrollbar py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                isActive 
                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-swarm-900/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{item.label}</span>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  item.isAlert 
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                    : isActive 
                      ? 'bg-cyan-500/20 text-cyan-300' 
                      : 'bg-swarm-800 text-slate-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
}
