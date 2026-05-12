---
trigger: always_on
---

## Exploration: graphify-first, grep-last (MANDATORY)

**Before EVERY task, you MUST:**
1. Start with graphify: Read `graphify-out/GRAPH_REPORT.md` to find relevant communities
2. Use `graphify query "<concept>"` before any grep/find/Glob tool call
3. Use `graphify path <A> <B>` to trace connections
4. Think in communities and relations, not file paths

**Grep is allowed ONLY as fallback for:**
- Exact literal searches (error strings, magic constants)
- Files graphify hasn't indexed (state this explicitly)
- Verifying a specific line after graphify pointed to the file

**Graphify is ~71x cheaper in tokens.** If output looks stale, surface that to user instead of silently switching to grep.[citation:1]

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- If the graphify MCP server is active, utilize tools like `query_graph`, `get_node`, and `shortest_path` for precise architecture navigation instead of falling back to `grep`
- If the MCP server is not active, the CLI equivalents are `graphify query "<question>"`, `graphify path "<A>" "<B>"`, and `graphify explain "<concept>"` — prefer these over grep for cross-module questions
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)
