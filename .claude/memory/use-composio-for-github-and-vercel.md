---
name: use-composio-for-github-and-vercel
description: "Aditya wants GitHub and Vercel work done through the Composio toolkits, not raw APIs or the dashboards"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 80f396f3-0e6c-4a87-8a9b-75c4f204646c
  modified: 2026-08-08T07:02:59.132Z
---

Do GitHub and Vercel operations through Composio — repo creation, project
creation, deployments, project settings. The `github` and `vercel` toolkits are
already connected as `adityasomaa` / `adityasoma`.

**Why:** He asked for it explicitly on the first prompt and has repeated it. It
also keeps the credentials out of the local shell.

**How to apply:** `COMPOSIO_SEARCH_TOOLS` first to get the right slug, then
`COMPOSIO_MULTI_EXECUTE_TOOL`. Local `git push` is still fine for moving code —
the `gh` CLI is authenticated as `adityasomaa`. See [[staybase-infrastructure-ids]].
