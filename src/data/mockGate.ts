import type { GateSnapshot } from '../types/gate'

/** Mock gate data — includes a failed Playwright run for auto risk-note demos. */
export const initialGate: GateSnapshot = {
  releaseName: 'Release Gate Lab',
  environment: 'Pre-Prod Release',
  latestRun: {
    id: 'run-1042',
    buildNumber: '#1042',
    branch: 'main',
    smoke: 'passed',
    deploy: 'shipped',
    duration: '2m 18s',
    startedAt: '2026-07-21T19:40:00Z',
  },
  checklist: [
    {
      id: 'smoke',
      label: '✅ Playwright automation green',
      hint: '3–5 Playwright checks only — keep it reviewable',
      checked: true,
      required: true,
    },
    {
      id: 'changelog',
      label: '📝 Changelog reviewed',
      hint: 'What changed is clear to the person shipping',
      checked: true,
      required: true,
    },
    {
      id: 'owner',
      label: '👤 Release owner signed off',
      hint: 'A named human owns the go / no-go call',
      checked: false,
      required: true,
    },
    {
      id: 'rollback',
      label: '🔁 Rollback path known',
      hint: 'Optional but wise — how do we undo this?',
      checked: false,
      required: false,
    },
  ],
  recentRuns: [
    {
      id: 'run-1042',
      buildNumber: '#1042',
      branch: 'main',
      smoke: 'passed',
      deploy: 'shipped',
      duration: '2m 18s',
      startedAt: '2026-07-21T19:40:00Z',
    },
    {
      id: 'run-1041',
      buildNumber: '#1041',
      branch: 'main',
      smoke: 'failed',
      deploy: 'blocked',
      duration: '1m 52s',
      startedAt: '2026-07-21T18:12:00Z',
      failedTests: [
        {
          name: 'Homepage shows brand and gate verdict',
          kpi: 'Engagement',
          impact: 'Users may bounce if the release board (or equivalent surface) fails to load.',
        },
        {
          name: 'Owner sign-off flips Ready state',
          kpi: 'Revenue',
          impact: 'Go/no-go controls broken — bad builds could ship or good builds stall.',
        },
      ],
    },
    {
      id: 'run-1040',
      buildNumber: '#1040',
      branch: 'feat/checklist',
      smoke: 'passed',
      deploy: 'shipped',
      duration: '2m 05s',
      startedAt: '2026-07-21T16:30:00Z',
    },
    {
      id: 'run-1039',
      buildNumber: '#1039',
      branch: 'main',
      smoke: 'passed',
      deploy: 'shipped',
      duration: '2m 11s',
      startedAt: '2026-07-20T22:04:00Z',
    },
  ],
}
