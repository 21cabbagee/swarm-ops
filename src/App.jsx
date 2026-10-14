import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SwarmTopologyView from './components/views/SwarmTopologyView';
import ContextGraphView from './components/views/ContextGraphView';
import McpRegistryView from './components/views/McpRegistryView';
import A2ACoordinationView from './components/views/A2ACoordinationView';
import LangGraphDagView from './components/views/LangGraphDagView';
import ModelRouterView from './components/views/ModelRouterView';
import ClosedLoopEvalsView from './components/views/ClosedLoopEvalsView';
import HumanEscalationView from './components/views/HumanEscalationView';

import { INITIAL_AGENTS } from './data/swarmTopology';
import { HARD_BUDGET_LIMITS, INITIAL_ESCALATION_QUEUE } from './data/escalationRules';

export default function App() {
  const [activeTab, setActiveTab] = useState('topology');
  const [agents, setAgents] = useState(() => {
    const saved = localStorage.getItem('swarmops_agents');
    return saved ? JSON.parse(saved) : INITIAL_AGENTS;
  });

  const [tokenMetrics, setTokenMetrics] = useState(() => {
    const saved = localStorage.getItem('swarmops_token_metrics');
    return saved ? JSON.parse(saved) : {
      usedTokens: 412400,
      capTokens: HARD_BUDGET_LIMITS.masterRunTokenCap,
      spendUSD: 2.06,
      capUSD: HARD_BUDGET_LIMITS.masterRunSpendCapUSD
    };
  });

  const [pendingEscalationsCount, setPendingEscalationsCount] = useState(
    INITIAL_ESCALATION_QUEUE.filter(t => t.status === 'PENDING_REVIEW').length
  );

  const [simulationToast, setSimulationToast] = useState(null);

  useEffect(() => {
    localStorage.setItem('swarmops_agents', JSON.stringify(agents));
  }, [agents]);

  useEffect(() => {
    localStorage.setItem('swarmops_token_metrics', JSON.stringify(tokenMetrics));
  }, [tokenMetrics]);

  const activeAgentsCount = agents.filter(a => a.status === 'active' || a.status === 'delegating').length;

  const handleSimulateStep = () => {
    // Increment tokens and spend
    const tokenIncrement = 2480;
    const spendIncrement = 0.012;

    setTokenMetrics(prev => ({
      ...prev,
      usedTokens: Math.min(prev.usedTokens + tokenIncrement, prev.capTokens),
      spendUSD: Number((Math.min(prev.spendUSD + spendIncrement, prev.capUSD)).toFixed(2))
    }));

    // Randomly update 3 agent states
    setAgents(prev => {
      const copy = [...prev];
      for (let k = 0; k < 3; k++) {
        const randIndex = Math.floor(Math.random() * copy.length);
        const agent = copy[randIndex];
        const nextUsed = Math.min(agent.isolatedContext.capacity, agent.isolatedContext.usedTokens + 120);
        copy[randIndex] = {
          ...agent,
          status: agent.status === 'active' ? 'delegating' : 'active',
          isolatedContext: {
            ...agent.isolatedContext,
            usedTokens: nextUsed,
            utilizationPct: Math.round((nextUsed / agent.isolatedContext.capacity) * 100)
          }
        };
      }
      return copy;
    });

    setSimulationToast(`Swarm Step executed: +${tokenIncrement} tokens consumed. Context graphs updated. LangSmith trace emitted.`);
    setTimeout(() => setSimulationToast(null), 4000);
  };

  const handleReset = () => {
    if (window.confirm('Reset SwarmOps runtime state and token counters to initial baseline?')) {
      localStorage.removeItem('swarmops_agents');
      localStorage.removeItem('swarmops_token_metrics');
      setAgents(INITIAL_AGENTS);
      setTokenMetrics({
        usedTokens: 412400,
        capTokens: HARD_BUDGET_LIMITS.masterRunTokenCap,
        spendUSD: 2.06,
        capUSD: HARD_BUDGET_LIMITS.masterRunSpendCapUSD
      });
      setSimulationToast('SwarmOps state reset to initial verified baseline.');
      setTimeout(() => setSimulationToast(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-swarm-950 text-slate-100 flex flex-col font-sans dot-pattern">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        agentsCount={agents.length}
        activeAgentsCount={activeAgentsCount}
        tokenMetrics={tokenMetrics}
        pendingEscalationsCount={pendingEscalationsCount}
        onSimulateStep={handleSimulateStep}
        onReset={handleReset}
      />

      {simulationToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-cyan-950/90 border border-cyan-500 text-cyan-200 px-4 py-3 rounded-xl shadow-2xl font-mono text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>{simulationToast}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'topology' && <SwarmTopologyView agents={agents} />}
        {activeTab === 'graph' && <ContextGraphView />}
        {activeTab === 'mcp' && <McpRegistryView />}
        {activeTab === 'a2a' && <A2ACoordinationView />}
        {activeTab === 'langgraph' && <LangGraphDagView />}
        {activeTab === 'router' && <ModelRouterView />}
        {activeTab === 'evals' && <ClosedLoopEvalsView />}
        {activeTab === 'escalation' && (
          <HumanEscalationView onUpdatePendingCount={setPendingEscalationsCount} />
        )}
      </main>

      <footer className="border-t border-swarm-900 bg-swarm-950/80 py-4 font-mono text-[11px] text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-2">
          <div>
            SwarmOps • 300-Agent PARL Swarm Mesh • Zero Context Bloat Architecture
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>LangGraph Checkpointer: <strong className="text-emerald-400">DURABLE</strong></span>
            <span>mTLS: <strong className="text-cyan-400">SPIFFE OK</strong></span>
            <span>Regression Evals: <strong className="text-white">196/200 (98%)</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
