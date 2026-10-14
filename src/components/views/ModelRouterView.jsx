import React, { useState } from 'react';
import { MODEL_TIERS, ROUTER_DECISION_HISTORY, routeStepDynamically } from '../../data/multiModelRouter';
import { 
  Sliders, 
  Zap, 
  Cpu, 
  Activity, 
  DollarSign, 
  Clock, 
  Layers, 
  CheckCircle,
  Play
} from 'lucide-react';

export default function ModelRouterView() {
  const [testTask, setTestTask] = useState('Reconcile corporate balance sheet line items against SEC EDGAR disclosure');
  const [complexity, setComplexity] = useState(0.65);
  const [risk, setRisk] = useState(0.40);
  const [activeDecision, setActiveDecision] = useState(null);
  const [history, setHistory] = useState(ROUTER_DECISION_HISTORY);

  const handleTestRoute = (e) => {
    e?.preventDefault();
    const decision = routeStepDynamically(testTask, complexity, risk);
    setActiveDecision(decision);

    // Append to live history
    const newEntry = {
      stepId: `step-0${history.length + 1}`,
      agent: 'agent-168',
      task: testTask,
      complexityScore: complexity,
      riskScore: risk,
      selectedTier: decision.tier,
      selectedModel: decision.model,
      rationale: decision.reason,
      latencyMs: decision.expectedLatencyMs,
      costUSD: decision.estCostPerCall,
      timestamp: new Date().toTimeString().split(' ')[0]
    };
    setHistory(prev => [newEntry, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-swarm-900 to-amber-950/40 border border-cyan-500/30 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                <Sliders className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold font-mono text-white">Dynamic Multi-Model Router (70/20/10 Per-Step)</h2>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Instead of forcing all tasks through expensive frontier models, SwarmOps dynamically classifies every single agent invocation per step. 70% runs on ultra-fast, zero/low-cost open-weights (Groq LPU / Cerebras / Gemini Flash), 20% on mid-tier reasoning (Claude 3.5 Sonnet / GPT-4o), and 10% on flagship reasoning engines (o3-mini / Opus) for formal proofs and audit signoffs.
            </p>
          </div>
          <div className="text-right font-mono bg-swarm-950/80 border border-swarm-800 rounded-xl p-3 shrink-0">
            <div className="text-xs text-slate-500">Effective Blended Cost</div>
            <div className="text-xl font-bold text-emerald-400">$0.0014 / call</div>
            <div className="text-[10px] text-cyan-400">92% Cost Reduction</div>
          </div>
        </div>
      </div>

      {/* 3 Tier Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Tier 1 */}
        <div className="bg-swarm-900 border border-cyan-500/30 rounded-2xl p-5 space-y-4 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400">70% Target Traffic</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">Tier 1</span>
          </div>
          <h3 className="text-sm font-bold text-white">Fast & Open-Weights</h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Routine extraction, JSON formatting, entity resolution, text normalization, basic validation.
          </p>

          <div className="space-y-1.5 pt-2 border-t border-swarm-800">
            {MODEL_TIERS.tier1.models.map(m => (
              <div key={m.id} className="text-xs bg-swarm-950 p-2 rounded border border-swarm-800 flex justify-between">
                <span className="text-slate-300">{m.provider}</span>
                <span className="text-cyan-400 font-semibold">{m.latencyMs} ms</span>
              </div>
            ))}
          </div>
          <div className="text-[11px] text-slate-400">
            Average Cost: <strong className="text-emerald-400">${MODEL_TIERS.tier1.costPerMillionTokens} / M tokens</strong>
          </div>
        </div>

        {/* Tier 2 */}
        <div className="bg-swarm-900 border border-violet-500/30 rounded-2xl p-5 space-y-4 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-violet-400">20% Target Traffic</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-950 text-violet-300 border border-violet-500/30">Tier 2</span>
          </div>
          <h3 className="text-sm font-bold text-white">Mid-Tier Balanced Reasoning</h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Decomposition, DAG planning, SQL synthesis, code generation, multi-hop coordination.
          </p>

          <div className="space-y-1.5 pt-2 border-t border-swarm-800">
            {MODEL_TIERS.tier2.models.map(m => (
              <div key={m.id} className="text-xs bg-swarm-950 p-2 rounded border border-swarm-800 flex justify-between">
                <span className="text-slate-300">{m.provider}</span>
                <span className="text-violet-400 font-semibold">{m.latencyMs} ms</span>
              </div>
            ))}
          </div>
          <div className="text-[11px] text-slate-400">
            Average Cost: <strong className="text-emerald-400">${MODEL_TIERS.tier2.costPerMillionTokens} / M tokens</strong>
          </div>
        </div>

        {/* Tier 3 */}
        <div className="bg-swarm-900 border border-amber-500/30 rounded-2xl p-5 space-y-4 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400">10% Target Traffic</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/30">Tier 3</span>
          </div>
          <h3 className="text-sm font-bold text-white">Flagship Formal Reasoning</h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Audit signing, mathematical valuation proof, regulatory signoff, deadlock resolution, escalation triage.
          </p>

          <div className="space-y-1.5 pt-2 border-t border-swarm-800">
            {MODEL_TIERS.tier3.models.map(m => (
              <div key={m.id} className="text-xs bg-swarm-950 p-2 rounded border border-swarm-800 flex justify-between">
                <span className="text-slate-300">{m.provider}</span>
                <span className="text-amber-400 font-semibold">{m.latencyMs} ms</span>
              </div>
            ))}
          </div>
          <div className="text-[11px] text-slate-400">
            Average Cost: <strong className="text-emerald-400">${MODEL_TIERS.tier3.costPerMillionTokens} / M tokens</strong>
          </div>
        </div>
      </div>

      {/* Interactive Per-Step Router Testing Sandbox */}
      <div className="bg-swarm-900 border border-swarm-800 rounded-xl p-5 space-y-4 font-mono">
        <div className="flex items-center justify-between border-b border-swarm-800 pb-3">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            Interactive Step-Level Routing Governor
          </span>
          <span className="text-[10px] text-slate-500">Real-time Entropy & Risk Evaluation</span>
        </div>

        <form onSubmit={handleTestRoute} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Task / Substep Description</label>
            <input
              type="text"
              value={testTask}
              onChange={(e) => setTestTask(e.target.value)}
              className="w-full bg-swarm-950 border border-swarm-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Task Complexity:</span>
                <span className="text-cyan-400 font-bold">{Math.round(complexity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={complexity}
                onChange={(e) => setComplexity(parseFloat(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Failure Risk / Compliance Stakes:</span>
                <span className="text-rose-400 font-bold">{Math.round(risk * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={risk}
                onChange={(e) => setRisk(parseFloat(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Evaluate Dynamic Route</span>
            </button>
          </div>
        </form>

        {activeDecision && (
          <div className="bg-swarm-950 border border-cyan-500/40 p-4 rounded-xl text-xs space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-cyan-300 font-bold">
              <span>Routing Decision: <strong className="text-white uppercase">{activeDecision.tier}</strong> ({activeDecision.modelName})</span>
              <span className="text-emerald-400">Est. Latency: {activeDecision.expectedLatencyMs} ms</span>
            </div>
            <p className="text-slate-300">{activeDecision.reason}</p>
          </div>
        )}
      </div>

      {/* Live Routing Decision History */}
      <div className="bg-swarm-900 border border-swarm-800 rounded-xl p-5 space-y-3 font-mono">
        <div className="flex items-center justify-between border-b border-swarm-800 pb-2">
          <span className="text-xs font-semibold text-slate-300">Live Step-Level Routing Stream</span>
          <span className="text-[10px] text-slate-500">{history.length} Decisions Logged</span>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {history.map(item => (
            <div key={item.stepId} className="bg-swarm-950 border border-swarm-800 p-3 rounded-lg text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white truncate max-w-md">{item.task}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                  item.selectedTier === 'tier1' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30' :
                  item.selectedTier === 'tier2' ? 'bg-violet-950 text-violet-300 border border-violet-500/30' :
                  'bg-amber-950 text-amber-300 border border-amber-500/30'
                }`}>
                  {item.selectedModel}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-swarm-900">
                <span className="text-slate-500">{item.rationale}</span>
                <span className="text-emerald-400 font-semibold">{item.latencyMs} ms (${item.costUSD.toFixed(4)})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
