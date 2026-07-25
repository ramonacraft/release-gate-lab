import type { ChecklistItem, DeployResult, PipelineRun, SmokeResult } from '../types/gate'

export function requiredItemsReady(checklist: ChecklistItem[]): boolean {
  return checklist.filter((item) => item.required).every((item) => item.checked)
}

export function gateVerdict(checklist: ChecklistItem[]): 'ready' | 'not-ready' {
  return requiredItemsReady(checklist) ? 'ready' : 'not-ready'
}

export function smokeLabel(result: SmokeResult): string {
  switch (result) {
    case 'passed':
      return 'Playwright automation tests passed'
    case 'failed':
      return 'Playwright automation tests failed'
    case 'running':
      return 'Playwright automation tests running'
    case 'skipped':
      return 'Playwright automation tests skipped'
  }
}

export function deployLabel(result: DeployResult): string {
  switch (result) {
    case 'shipped':
      return 'Ready to ship'
    case 'blocked':
      return 'Deploy blocked'
    case 'pending':
      return 'Deploy pending'
  }
}

export type RiskBrief = {
  tone: 'failure' | 'human-gate' | 'clear'
  eyebrow: string
  title: string
  summary: string
  impacts: { kpi: string; level: 'high' | 'med' | 'low'; detail: string }[]
  action: string
}

/** Auto risk brief for developers — no free-text entry. */
export function buildRiskBrief(
  latestRun: PipelineRun,
  checklist: ChecklistItem[],
  recentRuns: PipelineRun[],
): RiskBrief {
  if (latestRun.smoke === 'failed') {
    const failures = latestRun.failedTests ?? [
      {
        name: 'Core user journey smoke',
        kpi: 'Conversion',
        impact: 'Checkout or sign-in path may be broken for a slice of users.',
      },
    ]

    return {
      tone: 'failure',
      eyebrow: '👀 Developer to review',
      title: 'Playwright automation failures detected',
      summary: `${latestRun.buildNumber} on ${latestRun.branch} failed automated checks. Deploy stays blocked until green. Review the failing cases below and estimate business impact before re-running the gate.`,
      impacts: failures.map((item) => ({
        kpi: item.kpi,
        level: 'high' as const,
        detail: `${item.name} — ${item.impact}`,
      })),
      action: 'Fix the failing Playwright case(s), push, and re-run Azure smoke before any production deploy.',
    }
  }

  if (!requiredItemsReady(checklist)) {
    const open = checklist
      .filter((item) => item.required && !item.checked)
      .map((item) => item.label.replace(/^[^A-Za-z0-9]+/, ''))
    const priorFail = recentRuns.find((run) => run.smoke === 'failed')
    const impacts: RiskBrief['impacts'] = [
      {
        kpi: 'Release quality',
        level: 'med',
        detail: `Still open: ${open.join(', ') || 'required checklist items'}.`,
      },
      {
        kpi: 'Revenue continuity',
        level: 'low',
        detail: 'Latest Playwright automation is green; risk is incomplete human sign-off.',
      },
    ]
    if (priorFail) {
      impacts.push({
        kpi: 'Recent automation',
        level: 'med',
        detail: `${priorFail.buildNumber} failed earlier — keep that fix in mind before the next ship window.`,
      })
    }
    return {
      tone: 'human-gate',
      eyebrow: '🟡 Human gate open',
      title: 'Automation is green — release owner still needed',
      summary:
        'Playwright automation tests passed on the latest run, but required go/no-go items are incomplete. This is a process hold, not an automation failure.',
      impacts,
      action: 'Complete required checklist items (owner sign-off) before treating this as Safe to ship.',
    }
  }

  return {
    tone: 'clear',
    eyebrow: '✅ Gate clear',
    title: 'Low risk — automation and human gate agree',
    summary:
      'Playwright automation tests passed and required checklist items are complete. Treat this as ready to ship with normal rollback awareness.',
    impacts: [
      {
        kpi: 'Revenue',
        level: 'low',
        detail: 'No failed smoke signal tied to checkout or playback paths on the latest run.',
      },
      {
        kpi: 'Engagement',
        level: 'low',
        detail: 'Core journey checks in the lean suite are green.',
      },
    ],
    action: 'Ship when the window is open. Keep the known rollback path handy.',
  }
}
