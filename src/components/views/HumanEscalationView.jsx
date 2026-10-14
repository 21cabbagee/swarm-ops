import React, { useState } from 'react';
import { HARD_BUDGET_LIMITS, INITIAL_ESCALATION_QUEUE } from '../../data/escalationRules';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  Lock, 
  DollarSign, 
  Sliders, 
  Clock, 
  FileText,
  UserCheck,
  Send
} from 'lucide-react';

export default function HumanEscalationView({ onUpdatePendingCount }) {
  const [queue, setQueue] = useState(INITIAL_ESCALATION_QUEUE);
  const [selectedTicket, setSelectedTicket] = useState(INITIAL_ESCALATION_QUEUE[0]);
  const [operatorNote, setOperatorNote] = useState('');

  const handleResolve = (ticketId, status) => {
    const updated = queue.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status,
          resolutionNote: operatorNote || (status === 'APPROVED' ? 'Approved by human supervisor' : 'Rejected by human supervisor')
        };
      }
      return t;
    });

    setQueue(updated);
    const pendingCount = updated.filter(t => t.status === 'PENDING_REVIEW').length;
    onUpdatePendingCount?.(pendingCount);

    if (selectedTicket?.id === ticketId) {
      setSelectedTicket(prev => ({
        ...prev,
        status,
        resolutionNote: operatorNote || (status === 'APPROVED' ? 'Approved by human supervisor' : 'Rejected by human supervisor')
      }));
    }
    setOperatorNote('');
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-rose-950/40 via-swarm-900 to-amber-950/40 border border-rose-500/30 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold font-mono text-white">Hard Token Budget Caps & Human Escalation (HITL)</h2>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Autonomous execution halts immediately whenever sub-millisecond token velocity tripwires are crossed, high-risk production actions are proposed, or agent confidence drops below $\tau = 0.72$. Checkpointed states are frozen and queued here for cryptographic human authorization.
            </p>
          </div>
          <div className="text-right font-mono bg-swarm-950/80 border border-swarm-800 rounded-xl p-3 shrink-0">
            <div className="text-xs text-slate-500">Confidence Gate</div>
            <div className="text-xl font-bold text-rose-400">τ &lt; 0.72</div>
            <div className="text-[10px] text-amber-400">Human Signoff Required</div>
          </div>
        </div>
      </div>

      {/* Hard Limits Meters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-swarm-900 border border-swarm-800 rounded-xl p-4 space-y-1">
          <span className="text-slate-500 block text-[11px]">Master Token Cap</span>
          <div className="text-lg font-bold text-white">{HARD_BUDGET_LIMITS.masterRunTokenCap.toLocaleString()}</div>
          <span className="text-[10px] text-cyan-400">Sub-1ms Hardware Tripwire</span>
        </div>

        <div className="bg-swarm-900 border border-swarm-800 rounded-xl p-4 space-y-1">
          <span className="text-slate-500 block text-[11px]">Financial Spend Limit</span>
          <div className="text-lg font-bold text-emerald-400">${HARD_BUDGET_LIMITS.masterRunSpendCapUSD.toFixed(2)} USD</div>
          <span className="text-[10px] text-slate-400">Hard API Budget Barrier</span>
        </div>

        <div className="bg-swarm-900 border border-swarm-800 rounded-xl p-4 space-y-1">
          <span className="text-slate-500 block text-[11px]">Token Velocity Tripwire</span>
          <div className="text-lg font-bold text-amber-400">12,000 tok/sec</div>
          <span className="text-[10px] text-slate-400">Auto-Halts Runaway Loops</span>
        </div>

        <div className="bg-swarm-900 border border-swarm-800 rounded-xl p-4 space-y-1">
          <span className="text-slate-500 block text-[11px]">Per-Agent Context Bound</span>
          <div className="text-lg font-bold text-violet-400">4,096 Tokens</div>
          <span className="text-[10px] text-slate-400">Zero Attention Bloat</span>
        </div>
      </div>

      {/* Escalation Queue & Ticket Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-2 space-y-3 font-mono">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Pending Escalation Queue ({queue.filter(q => q.status === 'PENDING_REVIEW').length} Open)</span>
            <span>Checkpointer: FROZEN</span>
          </div>

          <div className="space-y-3">
            {queue.map(ticket => {
              const isSelected = selectedTicket?.id === ticket.id;
              const isPending = ticket.status === 'PENDING_REVIEW';
              const isApproved = ticket.status === 'APPROVED';

              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`bg-swarm-900 border rounded-xl p-4 cursor-pointer transition hover:border-rose-500/50 space-y-2 ${
                    isSelected ? 'border-rose-500 shadow-lg shadow-rose-500/10' : 'border-swarm-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        ticket.severity === 'HIGH_RISK_ACTION' ? 'bg-rose-950 text-rose-300 border border-rose-500/40' :
                        ticket.severity === 'CONTRADICTION_DETECTED' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                        'bg-yellow-950 text-yellow-300 border border-yellow-500/40'
                      }`}>
                        {ticket.severity}
                      </span>
                      <span className="text-[11px] text-slate-500">{ticket.id}</span>
                    </div>

                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isPending ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse' :
                      isApproved ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white line-clamp-1">{ticket.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{ticket.details}</p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-swarm-800/60">
                    <span>Agent: <strong className="text-cyan-400">{ticket.agentName}</strong></span>
                    <span>Confidence: <strong className={ticket.confidenceScore < 0.72 ? 'text-rose-400' : 'text-emerald-400'}>{(ticket.confidenceScore * 100).toFixed(0)}%</strong></span>
                    <span>Frozen at: <strong className="text-violet-400">{ticket.checkpointId}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Ticket Action Panel */}
        <div className="bg-swarm-900 border border-swarm-800 rounded-xl p-5 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-swarm-800 pb-3">
            <span className="font-semibold text-slate-300 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-rose-400" />
              Human Supervisor Action
            </span>
            {selectedTicket && (
              <span className="text-[10px] text-slate-400">{selectedTicket.id}</span>
            )}
          </div>

          {selectedTicket ? (
            <div className="space-y-4">
              <div>
                <span className="text-slate-500 text-[11px] block">Incident Title</span>
                <span className="text-white font-bold text-sm block mt-0.5">{selectedTicket.title}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[11px] block">Full Technical Description</span>
                <p className="bg-swarm-950 p-3 rounded-lg border border-swarm-800 text-slate-300 text-[11px] leading-relaxed mt-1">
                  {selectedTicket.details}
                </p>
              </div>

              <div>
                <span className="text-slate-500 text-[11px] block mb-1">Proposed Payload Action</span>
                <pre className="bg-swarm-950 p-3 rounded-lg border border-swarm-800 text-[11px] text-amber-300 overflow-x-auto">
                  {JSON.stringify(selectedTicket.proposedAction, null, 2)}
                </pre>
              </div>

              {selectedTicket.status === 'PENDING_REVIEW' ? (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Operator Signoff / Guidance Note</label>
                    <textarea
                      rows={2}
                      value={operatorNote}
                      onChange={(e) => setOperatorNote(e.target.value)}
                      placeholder="Add supervisor reasoning or modified parameter instructions..."
                      className="w-full bg-swarm-950 border border-swarm-800 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleResolve(selectedTicket.id, 'APPROVED')}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg font-bold text-xs transition flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Resume</span>
                    </button>
                    <button
                      onClick={() => handleResolve(selectedTicket.id, 'REJECTED')}
                      className="bg-rose-600 hover:bg-rose-500 text-white py-2 rounded-lg font-bold text-xs transition flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject & Terminate</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-swarm-950 border border-slate-800 p-3 rounded-lg text-xs space-y-1">
                  <span className="text-slate-400 block">Resolution Status: <strong className="text-white uppercase">{selectedTicket.status}</strong></span>
                  <span className="text-slate-500 block">Operator Note: {selectedTicket.resolutionNote}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-slate-500 text-center py-10">Select an escalation ticket to review</div>
          )}
        </div>
      </div>
    </div>
  );
}
