# Release Gate Lab — Cursor agent notes

## Project

Release Gate dashboard (health + go/no-go checklist) with a lean Azure → Vercel quality gate.

## Stack

- Vite + React + TypeScript
- Playwright smoke tests in `tests/smoke/`
- Azure Pipelines via `azure-pipelines.yml`

## Conventions

- Recent runs: prefer `/api/runs` (live Azure); fall back to `src/data/mockGate.ts`
- Keep the Playwright suite tiny (about 5 tests). Do not grow it into a giant regression pack
- Never commit `.env`, Vercel tokens, Azure PATs, or GitHub tokens
- No employer names or private job-search details in code, README, or commits

## Scripts

- `npm run dev` — local dashboard
- `npm run build` — production bundle
- `npm run test:smoke` — Playwright smokes
- `npm run preview` — preview built app

## Related docs

- `README.md` — interview framing + quick start
- `docs/AZURE_VERCEL_SETUP.md` — connect Azure + Vercel secrets
- `docs/PHASE4_AND_DEMOS.md` — live Azure board, PR comments, failure-path demo
