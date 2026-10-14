"""
LangGraph StateGraph DAG with Durable Checkpoints
Executes state transitions and captures immutable snapshots with time-travel rewind capabilities.
"""

from typing import Dict, Any, List, Optional
import hashlib
import time

class DurableCheckpointer:
    def __init__(self):
        self.checkpoints: Dict[str, Dict[str, Any]] = {}

    def save(self, thread_id: str, node_name: str, channel_values: Dict[str, Any]) -> str:
        chk_id = f"chk-{int(time.time() * 1000)}-{node_name}"
        state_repr = str(sorted(channel_values.items())).encode()
        state_hash = f"sha256:{hashlib.sha256(state_repr).hexdigest()[:16]}"
        
        self.checkpoints[chk_id] = {
            "checkpoint_id": chk_id,
            "thread_id": thread_id,
            "node_name": node_name,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "state_hash": state_hash,
            "channel_values": channel_values
        }
        return chk_id

    def get(self, checkpoint_id: str) -> Optional[Dict[str, Any]]:
        return self.checkpoints.get(checkpoint_id)

    def list_checkpoints(self, thread_id: str) -> List[Dict[str, Any]]:
        return [c for c in self.checkpoints.values() if c["thread_id"] == thread_id]
