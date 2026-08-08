---
name: verify-ui-geometrically
description: "Screenshots do not work in this environment, so UI claims are verified with headless geometry checks instead"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 80f396f3-0e6c-4a87-8a9b-75c4f204646c
  modified: 2026-08-08T07:03:24.645Z
---

Screenshots fail in this environment ("the Browser pane is not displayed"), so
never claim a layout is fine because it looks fine — it cannot be looked at.
Verify with a headless pass instead: load every route at 1440 / 1024 / 768 /
390px and assert no horizontal overflow, no clipped text, no overlapping
siblings; then drive the interactive paths with real clicks and keystrokes.

**Why:** Aditya reported components colliding after a round where the work had
only been checked by reading the code. The geometric audit found four real
defects the code review had missed, including a nested `<main>` and a sticky
header anchored to the wrong scroller.

**How to apply:** Use `document.body.textContent`, not `innerText` — headless
Chrome reports empty `innerText` for fixed-position portal content such as an
open dialog. See [[staybase-project-context]].
