import type { ChecklistItem, DeployResult, PipelineRun, SmokeResult } from '../types/gate'
import { deployLabel, smokeLabel } from '../utils/gate'
import './GateHero.css'

type GateHeroProps = {
  environment: string
  verdict: 'ready' | 'not-ready'
  latestRun: PipelineRun
  checklist: ChecklistItem[]
}

function formatWhen(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

function StatusChip({
  tone,
  children,
}: {
  tone: SmokeResult | DeployResult | 'ready' | 'not-ready'
  children: string
}) {
  return <span className={`status-chip status-chip--${tone}`}>{children}</span>
}

function barClass(kind: 'smoke' | 'deploy' | 'checklist', value: string): string {
  if (kind === 'smoke') {
    if (value === 'passed') return 'hi-teal'
    if (value === 'failed') return 'hi-rose'
    if (value === 'running') return 'hi-amber'
    return 'hi-slate'
  }
  if (kind === 'deploy') {
    if (value === 'shipped') return 'hi-teal'
    if (value === 'blocked') return 'hi-rose'
    return 'hi-amber'
  }
  return value === 'ready' ? 'hi-teal' : 'hi-amber'
}

function fillPercent(kind: 'smoke' | 'deploy' | 'checklist', value: string, checklistRatio: number): number {
  if (kind === 'checklist') return Math.round(checklistRatio * 100)
  if (kind === 'smoke') {
    if (value === 'passed') return 100
    if (value === 'failed') return 40
    if (value === 'running') return 55
    return 20
  }
  if (value === 'shipped') return 100
  if (value === 'blocked') return 35
  return 50
}

export function GateHero({ environment, verdict, latestRun, checklist }: GateHeroProps) {
  const headline = verdict === 'ready' ? 'Safe to ship' : 'Not ready'
  const headlineEmoji = verdict === 'ready' ? '🚀' : '🚧'
  const support =
    verdict === 'ready'
      ? 'Required items are complete. Playwright automation is the automated gate; this board is the human gate.'
      : 'Finish the required checklist items before you treat this release as a go.'

  const required = checklist.filter((item) => item.required)
  const requiredDone = required.filter((item) => item.checked).length
  const checklistRatio = required.length === 0 ? 1 : requiredDone / required.length

  const rows = [
    {
      key: 'smoke',
      label: '🧪 Playwright',
      detail: smokeLabel(latestRun.smoke),
      fill: fillPercent('smoke', latestRun.smoke, checklistRatio),
      tone: barClass('smoke', latestRun.smoke),
    },
    {
      key: 'deploy',
      label: '📦 Deploy',
      detail: deployLabel(latestRun.deploy),
      fill: fillPercent('deploy', latestRun.deploy, checklistRatio),
      tone: barClass('deploy', latestRun.deploy),
    },
    {
      key: 'checklist',
      label: '📋 Checklist',
      detail: `${requiredDone}/${required.length} required`,
      fill: fillPercent('checklist', verdict, checklistRatio),
      tone: barClass('checklist', verdict),
    },
  ] as const

  return (
    <header className="gate-pulse" data-verdict={verdict}>
      <div className="gate-pulse__left">
        <p className="gate-pulse__label">Gate status</p>
        <p className="gate-pulse__emoji" aria-hidden="true">
          {headlineEmoji}
        </p>
        <h1 className="gate-pulse__headline" data-testid="gate-verdict">
          {headline}
        </h1>
        <p className="gate-pulse__env">{environment}</p>
        <p className="gate-pulse__run">
          {latestRun.buildNumber} · {latestRun.branch} · {latestRun.duration} ·{' '}
          {formatWhen(latestRun.startedAt)}
        </p>
      </div>

      <div className="gate-pulse__right">
        <p className="gate-pulse__support">{support}</p>
        <div className="gate-pulse__rows" aria-label="Release signal bars">
          {rows.map((row) => (
            <div key={row.key} className="gate-pulse__row">
              <div className="gate-pulse__row-label">
                <span>{row.label}</span>
                <span>{row.detail}</span>
              </div>
              <div className="gate-pulse__bar" aria-hidden="true">
                <span
                  className={`gate-pulse__bar-fill gate-pulse__bar-fill--${row.tone}`}
                  style={{ width: `${row.fill}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="gate-pulse__chips" aria-label="Latest pipeline run">
          <StatusChip tone={latestRun.smoke}>{smokeLabel(latestRun.smoke)}</StatusChip>
          <StatusChip tone={latestRun.deploy}>{deployLabel(latestRun.deploy)}</StatusChip>
          <StatusChip tone={verdict}>{verdict === 'ready' ? 'Ready' : 'Not ready'}</StatusChip>
        </div>
      </div>
    </header>
  )
}
