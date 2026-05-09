import json
from pathlib import Path

from graphify.analyze import god_nodes, surprising_connections
from graphify.build import build_from_json
from graphify.report import generate
from graphify.cluster import cluster
from graphify.export import to_html

extraction = json.loads(Path('graphify-out/.graphify_extract.json').read_text())
analysis = json.loads(Path('graphify-out/.graphify_analysis.json').read_text())
detection = json.loads(Path('graphify-out/.graphify_detect.json').read_text())

G = build_from_json(extraction)
communities = {int(k): v for k, v in analysis['communities'].items()}
gods = god_nodes(G)
surprises = surprising_connections(G, communities)

token_cost = {
    'input_tokens': extraction.get('input_tokens', 0),
    'output_tokens': extraction.get('output_tokens', 0),
}
report = generate(G, communities, {}, {}, gods, surprises, detection, token_cost, str(Path('.').resolve()))
Path('graphify-out/GRAPH_REPORT.md').write_text(report)
print('GRAPH_REPORT.md written')

try:
    to_html(G, cluster(G), 'graphify-out/graph.html')
    print('graph.html written')
except ValueError as e:
    print(f'Visualization skipped: {e}')
