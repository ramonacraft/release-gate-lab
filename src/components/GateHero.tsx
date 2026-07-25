import type { DeployResult, PipelineRun, SmokeResult } from '../types/gate'
import { deployLabel, smokeLabel } from '../utils/gate'
import './GateHero.css'

type GateHeroProps = {
  brand: string
  environment: string
  verdict: 'ready' | 'not-ready'
  latestRun: PipelineRun
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

export function GateHero({ brand, environment, verdict, latestRun }: GateHeroProps) {
  const headline = verdict === 'ready' ? 'Safe to ship' : 'Not ready'
  const support =
    verdict === 'ready'
      ? 'Required items are complete. Smoke is the automated gate; this board is the human gate.'
      : 'Finish the required checklist items before you treat this release as a go.'

  return (
    <header className="gate-hero" data-verdict={verdict}>
      <p className="gate-hero__brand">{brand}</p>
      <p className="gate-hero__env">{environment}</p>
      <h1 className="gate-hero__headline" data-testid="gate-verdict">
        {headline}
      </h1>
      <p className="gate-hero__support">{support}</p>
      <div className="gate-hero__meta" aria-label="Latest pipeline run">
        <StatusChip tone={latestRun.smoke}>{smokeLabel(latestRun.smoke)}</StatusChip>
        <StatusChip tone={latestRun.deploy}>{deployLabel(latestRun.deploy)}</StatusChip>
        <span className="gate-hero__run">
          {latestRun.buildNumber} · {latestRun.branch} · {latestRun.duration} ·{' '}
          {formatWhen(latestRun.startedAt)}
        </span>
      </div>
    </header>
  )
}
