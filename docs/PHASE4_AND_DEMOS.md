# Phase 4 + interview demos

Live Azure runs on the board, GitHub PR comments, and a safe failure-path demo.

## 1) Live Azure status on the board

The dashboard calls `/api/runs` (Vercel serverless). That function reads Azure DevOps with a PAT **on the server** — the browser never sees the token.

If the API is missing or fails, the UI falls back to **mock** runs (local `npm run dev` will usually show mock).

### Vercel environment variables

In Vercel → Project **release-gate-lab** → Settings → Environment Variables, add:

| Name | Example | Notes |
|------|---------|--------|
| `AZURE_DEVOPS_ORG` | your org name from `dev.azure.com/ORG/...` | No URL, just the org segment |
| `AZURE_DEVOPS_PROJECT` | `ReleaseGateLab` | Project name |
| `AZURE_DEVOPS_PAT` | (secret) | See below |
| `AZURE_PIPELINE_DEFINITION_ID` | `1` | Optional but recommended |

Create a PAT in Azure DevOps:

1. User menu → **Personal access tokens** → New token  
2. Scopes: **Build (Read)**  
3. Copy once → paste into Vercel as `AZURE_DEVOPS_PAT`  
4. Redeploy the Vercel project (Deployments → … → Redeploy) so the API picks up env vars  

Find the definition ID:

1. Azure DevOps → Pipelines → your pipeline  
2. Look at the URL: `.../definitions/3` or open a run and check definition id in the UI  

### What success looks like

On https://release-gate-lab.vercel.app/ the Recent runs badge says **Live Azure** (not Mock data).

---

## 2) PR comment gate

After smoke (pass or fail), PR builds post a short comment on the GitHub pull request.

### Azure variable

Add pipeline secret:

| Name | Secret? | Value |
|------|---------|--------|
| `GITHUB_TOKEN` | Yes | GitHub fine-grained PAT |

PAT permissions:

- Repository access: `cursorcraft-workspace`  
- **Pull requests:** Read and write  
- Contents: Read (optional)

### Demo

1. Open a small PR that touches `projects/release-gate-lab/`  
2. Azure PR pipeline runs  
3. Check the PR conversation for the Release Gate Lab comment  

If `GITHUB_TOKEN` is missing, the step warns and skips (does not fail the job).

---

## 3) Failure-path demo (safe — no permanent broken tests)

Do **not** leave a failing test on `main`. Use the pipeline toggle instead.

1. Azure → Pipelines → your pipeline → **Run pipeline**  
2. Turn **ON**: `FORCE SMOKE FAIL (interview demo — blocks deploy)`  
3. Run  
4. Expect: **Build and smoke** red → **Deploy to Vercel** skipped  
5. Run again with the toggle **OFF** so you’re green for real work  

Interview line: “I can demonstrate the gate holding a bad build without shipping.”

---

## 4) Risk note on the board

The **Risk note** field next to go/no-go is local judgment text (saved in the browser). Use it in demos to show human release thinking next to automation.
