import json
from pathlib import Path


def load_fenced(path: str):
    text = Path(path).read_text()
    lines = text.splitlines()
    if lines and lines[0].startswith('```'):
        lines = lines[1:]
    if lines and lines[-1].startswith('```'):
        lines = lines[:-1]
    return json.loads('\n'.join(lines))


base = Path('/home/thang/Workspace/REACT-FASHION')
paths = [
    '/home/thang/.config/Code/User/workspaceStorage/02f751c77592664cdf86ec6a8ec33960/GitHub.copilot-chat/chat-session-resources/ad91ed13-c21b-4b17-b444-b535eee14c8c/call_i2clOXF3FVx3yUcMSCnYHbWC__vscode-1778320141717/content.txt',
    '/home/thang/.config/Code/User/workspaceStorage/02f751c77592664cdf86ec6a8ec33960/GitHub.copilot-chat/chat-session-resources/ad91ed13-c21b-4b17-b444-b535eee14c8c/call_Tv5PPAH0uKPiLzjre9iRoRYp__vscode-1778320141721/content.txt',
    '/home/thang/.config/Code/User/workspaceStorage/02f751c77592664cdf86ec6a8ec33960/GitHub.copilot-chat/chat-session-resources/ad91ed13-c21b-4b17-b444-b535eee14c8c/call_4cTm2Sea6bVQdoRcD9toeefA__vscode-1778320141719/content.txt',
    '/home/thang/.config/Code/User/workspaceStorage/02f751c77592664cdf86ec6a8ec33960/GitHub.copilot-chat/chat-session-resources/ad91ed13-c21b-4b17-b444-b535eee14c8c/call_W2dHsRSu3TeL2UdQVQkte4CM__vscode-1778320141720/content.txt',
]

merged = {'nodes': [], 'edges': [], 'hyperedges': []}
for path in paths:
    chunk = load_fenced(path)
    chunk_nodes = chunk.get('nodes', [])
    chunk_edges = chunk.get('edges', [])
    chunk_hyperedges = chunk.get('hyperedges', [])
    merged['nodes'].extend(chunk_nodes)
    merged['edges'].extend(chunk_edges)
    merged['hyperedges'].extend(chunk_hyperedges)
    for node in merged['nodes'][-len(chunk_nodes):]:
        node.setdefault('source_file', path)
    for edge in merged['edges'][-len(chunk_edges):]:
        edge.setdefault('source_file', path)
    for hyperedge in merged['hyperedges'][-len(chunk_hyperedges):]:
        hyperedge.setdefault('source_file', path)

Path(base / 'graphify-out/.graphify_extract.json').write_text(json.dumps(merged, indent=2))
print(f"Merged: {len(merged['nodes'])} nodes, {len(merged['edges'])} edges, {len(merged['hyperedges'])} hyperedges")
