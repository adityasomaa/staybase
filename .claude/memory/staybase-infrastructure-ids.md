---
name: staybase-infrastructure-ids
description: "Repo, Vercel project and team identifiers needed to deploy STAYBASE"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 80f396f3-0e6c-4a87-8a9b-75c4f204646c
  modified: 2026-08-08T07:03:10.759Z
---

STAYBASE hosting and source identifiers, none of which are derivable from the
code:

- Working repo: `adityasomaa/staybase` — https://github.com/adityasomaa/staybase (repo id `1327429041`)
- Legacy first push: `adityasomaa/staybase-pms` (repo id `1327364909`)
- Vercel project: `staybase-pms`, id `prj_srtnPeYsQWEwvzcb5uomZaUokODV`
- Vercel team: Onyx Creative Asia, id `team_kbdWnc8l2imilAGvKfLdsbXv`, Hobby plan
- Production URL: https://staybase-pms.vercel.app (region `sin1`)

The Vercel project is git-linked to **staybase-pms**, so pushing to `staybase`
does not deploy on its own — relink the project or trigger
`VERCEL_CREATE_NEW_DEPLOYMENT` with repo id `1327429041`. The production URL is
attached to the project rather than the repo, so it survives a relink.

Hobby plan limits that already bit: one cron run per day, one concurrent build.
See [[use-composio-for-github-and-vercel]].
