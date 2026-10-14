import React, { useState } from 'react';
import { SAMPLE_AGENT_CARDS, ACTIVE_DELEGATION_CHAINS, detectCircularDelegation } from '../../data/a2aProtocol';
import { 
  Lock, 
  ShieldCheck, 
  GitCommit, 
  ArrowRight, 
  AlertOctagon, 
  CheckCircle2, 
  Key, 
  FileCode,
  Network
} from 'lucide-react';

export default function A2ACoordinationView() {
  const [chains, setChains] = useState(ACTIVE_DELEGATION_CHAINS);
  const [selectedChain, setSelectedChain] = useState(ACTIVE_DELEGATION_CHAINS[0]);
  const [testResult, setTestResult] = useState(null);

  const runAntiLoopTest = () => {
    // Simulate circular chain attempt: Agent A -> Agent B -> Agent A
    const circularTestChain = {
      links: [
        { fromAgent: 'agent-052', toAgent: 'agent-108' },
        { fromAgent: 'agent-108', toAgent: 'agent-168' },
        { fromAgent: 'agent-168', toAgent: 'agent-052' } // Circular!
      ]
    };
    const result = detectCircularDelegation(circularTestChain);
    setTestResult(result);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-violet-950/40 via-swarm-900 to-cyan-950/40 border border-violet-500/30 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/40">
                <Network className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold font-mono text-white">Agent-to-Agent (A2A) Coordination & mTLS</h2>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Every agent advertises a machine-readable <strong>Agent Card</strong> defining capability schemas, SLA, and trust tiers. Inter-agent task delegations are governed by cryptographically signed tokens with strict recursion depth barriers ($d \le 4$) and automated circular deadlock detection. All transport uses mutual TLS (mTLS) with SPIFFE identities.
            </p>
          </div>
          <div className="text-right font-mono bg-swarm-950/80 border border-swarm-800 rounded-xl p-3 shrink-0">
            <div className="text-xs text-slate-500">Max Delegation Depth</div>
            <div className="text-xl font-bold text-violet-400">d ≤ 4</div>
            <div className="text-[10px] text-emerald-400">Anti-Deadlock Enforced</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delegation Chains */}
        <div className="bg-swarm-900 border border-swarm-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-swarm-800 pb-3">
            <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-violet-400" />
              Active Verifiable Delegation Chains
            </span>
            <button
              onClick={runAntiLoopTest}
              className="text-[11px] font-mono px-2.5 py-1 bg-violet-950 hover:bg-violet-900 text-violet-300 border border-violet-500/40 rounded transition"
            >
              Test Anti-Loop Circuit
            </button>
          </div>

          {testResult && (
            <div className="bg-rose-950/50 border border-rose-500/40 p-3 rounded-xl text-xs font-mono space-y-1 animate-in fade-in">
              <div className="flex items-center gap-2 text-rose-300 font-bold">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                <span>Circular Delegation Attempt Intercepted & Blocked!</span>
              </div>
              <p className="text-slate-300">
                Lineage cycle detected at <strong>{testResult.offendingAgent}</strong>. Chain terminated before deadlock could freeze swarm threads.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {chains.map(chain => (
              <div key={chain.chainId} className="bg-swarm-950 border border-swarm-800 rounded-xl p-4 space-y-3 font-mono">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{chain.rootGoal}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-950 text-violet-300 border border-violet-500/30">
                    Depth: {chain.depth} / {chain.maxDepth}
                  </span>
                </div>

                <div className="space-y-2 pt-1">
                  {chain.links.map((link, idx) => (
                    <div key={idx} className="bg-swarm-900 border border-swarm-800/80 p-2.5 rounded-lg text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-cyan-400 font-semibold">{link.fromAgent}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-violet-400 font-semibold">{link.toAgent}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-swarm-800/40">
                        <span>Action: <strong className="text-slate-300">{link.action}</strong></span>
                        <span className="text-emerald-400 font-bold">mTLS: {link.mTLSStatus}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Cards & SPIFFE mTLS Certs */}
        <div className="bg-swarm-900 border border-swarm-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-swarm-800 pb-3">
            <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Machine-Readable Agent Cards & mTLS Identities
            </span>
            <span className="text-[10px] font-mono text-slate-500">A2A Spec v1.0</span>
          </div>

          <div className="space-y-4">
            {SAMPLE_AGENT_CARDS.map(card => (
              <div key={card.agentId} className="bg-swarm-950 border border-swarm-800 rounded-xl p-4 font-mono text-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{card.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      v{card.version}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold">
                    {card.trustTier}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-swarm-900 p-2.5 rounded border border-swarm-800/60">
                  <div>
                    <span className="text-slate-500 block">P99 SLA</span>
                    <span className="text-cyan-400 font-semibold">{card.p99SlaMs} ms</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Cost / Call</span>
                    <span className="text-emerald-400 font-semibold">${card.costPerCallUSD}</span>
                  </div>
                </div>

                <div className="text-[11px] space-y-1">
                  <span className="text-slate-500 block">SPIFFE mTLS Identity</span>
                  <div className="bg-swarm-900 p-2 rounded text-slate-300 border border-swarm-800/60 break-all text-[10px]">
                    {card.mTLS.spiffeId}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    Cert: {card.mTLS.certFingerprint}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
