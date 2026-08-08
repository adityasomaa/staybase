---
name: staybase-infrastructure-ids
description: "Repo, Vercel project and team identifiers needed to deploy STAYBASE"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 80f396f3-0e6c-4a87-8a9b-75c4f204646c
  modified: 2026-08-08T07:07:53.566Z
---

STAYBASE hosting and source identifiers, none of which are derivable from the
code:

- Working repo: `adityasomaa/staybase` — https://github.com/adityasomaa/staybase (repo id `1327429041`)
- Archived first push: `adityasomaa/staybase-pms` (repo id `1327364909`) — nothing deploys from it
- Vercel project: `staybase-pms`, id `prj_srtnPeYsQWEwvzcb5uomZaUokODV`
- Vercel team: Onyx Creative Asia, id `team_kbdWnc8l2imilAGvKfLdsbXv`, Hobby plan
- Production URL: https://staybase-pms.vercel.app (region `sin1`)

As of 2026-08-08 the Vercel project is git-linked to **staybase**, production
branch `main`, so a push deploys. The project keeps the name `staybase-pms`
because the production URL hangs off the project name — renaming would move the
URL.

Composio has no tool for changing a project's git link. Use the workbench
proxy: `DELETE` then `POST` on `/v9/projects/{id}/link`, because Vercel refuses
to relink a project that is already linked.

Hobby plan limits that already bit: one cron run per day, one concurrent build.
See [[use-composio-for-github-and-vercel]].
