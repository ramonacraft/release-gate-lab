# Azure Pipeline + Vercel deploy gate

Plain-English setup so the pipeline can build, smoke-test, and deploy **only when smoke passes**.

You need:

1. Your free **Azure DevOps** account
2. This GitHub repo connected to Azure Pipelines
3. A **Vercel** project for `release-gate-lab`
4. Secrets stored in Azure (never in git)

---

## Step 1 — Create a Vercel project

1. Open [vercel.com](https://vercel.com) and sign in.
2. Import the `cursorcraft-workspace` GitHub repo (or deploy from CLI later).
3. Set the **Root Directory** to `.` (repo root).
4. Framework preset: Vite. Build command: `npm run build`. Output: `dist`.
5. For the first connect, you can leave auto-deploy **off** if you want Azure to own production deploys. Either way, Azure will still call the Vercel CLI with a token.

Create a Vercel token:

1. Vercel → Account Settings → Tokens → Create
2. Copy the token once — you will paste it into Azure as a secret

Also note from the Vercel project settings:

- **Org / team ID** (`VERCEL_ORG_ID`)
- **Project ID** (`VERCEL_PROJECT_ID`)

---

## Step 2 — Connect Azure Pipelines to GitHub

1. Open [dev.azure.com](https://dev.azure.com) and create (or open) an organization + project.
2. Pipelines → New pipeline → GitHub → select `cursorcraft-workspace`.
3. Choose **Existing Azure Pipelines YAML file**.
4. Path: `azure-pipelines.yml`
5. Save (do not rely on the first run until secrets are set).

---

## Step 3 — Add secret variables in Azure

In Azure DevOps → Pipelines → your pipeline → Edit → Variables (or Library → Variable group):

| Name | Secret? | Where it comes from |
|------|---------|---------------------|
| `VERCEL_TOKEN` | Yes | Vercel account token |
| `VERCEL_ORG_ID` | Yes | Vercel project settings |
| `VERCEL_PROJECT_ID` | Yes | Vercel project settings |

Mark each as **secret**. Never put these in the YAML file or commit them.

---

## Step 4 — Confirm the gate works

### Happy path (expect deploy)

1. Push a small change in this repository.
2. Watch the Azure run: Install → Build → Smoke → Deploy.
3. Smoke should pass; Deploy job should run; Vercel should show a new deployment.

### Failure path (expect block)

1. Temporarily break one smoke assertion (or rename a `data-testid` the test needs).
2. Push and watch Azure.
3. Smoke fails → **Deploy job is skipped** → nothing new ships to Vercel.
4. Revert the break so main stays green.

That failure path is the interview demo: “the gate blocked a bad build.”

---

## Step 5 — What success looks like

- Green Azure run with four chapters: Node, Install, Build, Smoke, then Deploy
- Red smoke run stops before Deploy
- Dashboard still runs locally with `npm run dev` using mock data (Phase 1)
- Phase 4 (optional): wire live Azure run status into the UI

---

## Troubleshooting

| Symptom | Try this |
|---------|----------|
| Pipeline cannot find `package.json` | Confirm the pipeline YAML is at the repo root |
| Playwright browsers missing | Pipeline installs Chromium via `npx playwright install --with-deps chromium` |
| Vercel deploy auth error | Re-check secret names exactly: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` |
| Deploy runs after a failed smoke | Ensure Deploy job has `dependsOn: smoke` and `condition: succeeded('smoke')` |

---

## Security reminder

- Do not commit `.env` or tokens
- Rotate a token if it ever lands in chat logs or a screenshot
- Prefer Azure secret variables over putting credentials in scripts
