---
name: verify
description: Build, run and visually verify the khaliplot Next.js app
---

# Verifying khaliplot changes

## Build & run

```bash
npm install            # if node_modules missing
npm run build          # works without .env.local (Supabase clients are lazy)
npm run start &        # serves the production build on :3000
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ --noproxy localhost
```

Gotchas:
- Always `--noproxy localhost` for curl — the sandbox routes HTTPS through a proxy.
- Kill stale servers with `pkill -f next-server` before restarting, or the new
  `npm run start` dies with EADDRINUSE while the old build keeps serving —
  you'll silently verify stale code.
- Without `.env.local`, any API route that writes to Supabase returns 500
  ("Couldn't save …"). That's the expected env-missing failure, not a bug.
- Anything else that needs `.env.local` (admin login, auth, live listings)
  degrades gracefully; pages still render with empty data.

## Drive the UI

Chromium is preinstalled at `/opt/pw-browsers/chromium`; install
`playwright-core` in the scratchpad (not the repo) and launch with
`executablePath: "/opt/pw-browsers/chromium"`.

Flows worth driving:
- `/` — header nav labels, hero text
- `/contact` — direct-contact buttons (check hrefs), social links, form
- Floating chatbox (all pages): open via `button[aria-label="Open KhaliPlot
  Assistant"]`, send messages via `input[aria-label="Chat message"]`; bot
  replies come from lib/chatbot-service.ts; each exchange POSTs /api/chatbox
  (2s per-IP rate limit — space probes with `sleep 3`)
- Mobile: 375px viewport, hamburger via `button[aria-label="Open menu"]`
