import { useEffect, useMemo, useState } from 'react'
import { GateHero } from './components/GateHero'
import { GoNoGoChecklist } from './components/GoNoGoChecklist'
import { RecentRuns } from './components/RecentRuns'
import { RiskNote } from './components/RiskNote'
import { initialGate } from './data/mockGate'
import { buildRiskBrief, gateVerdict } from './utils/gate'
import { fetchRecentRuns, type RunsSource } from './utils/fetchRecentRuns'
import type { PipelineRun } from './types/gate'
import './App.css'

function App() {
  const [checklist, setChecklist] = useState(initialGate.checklist)
  const [runs, setRuns] = useState<PipelineRun[]>(initialGate.recentRuns)
  const [runsSource, setRunsSource] = useState<RunsSource>('mock')
  const [runsMessage, setRunsMessage] = useState('Loading pipeline runs…')
  const [runsLoading, setRunsLoading] = useState(true)
  const latestRun = runs[0] ?? initialGate.latestRun
  const verdict = gateVerdict(checklist)
  const riskBrief = useMemo(
    () => buildRiskBrief(latestRun, checklist, runs),
    [latestRun, checklist, runs],
  )

  useEffect(() => {
    let active = true

    void fetchRecentRuns().then((result) => {
      if (!active) return
      setRuns(result.runs)
      setRunsSource(result.source)
      setRunsMessage(result.message)
      setRunsLoading(false)
    })

    return () => {
      active = false
    }
  }, [])

  const handleToggle = (id: string) => {
    setChecklist((items) =>
      items.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)),
    )
  }

  return (
    <div className="shell">
      <nav className="shell__nav" aria-label="Release Gate Lab Dashboard">
        <div className="shell__nav-center">
          <p className="shell__logo">
            <span aria-hidden="true">👩‍💻</span>
            <span>Release Gate Lab Dashboard</span>
            <span aria-hidden="true">🤖</span>
          </p>
          <span className="shell__env-chip">{initialGate.environment}</span>
        </div>
      </nav>

      <div className="shell__content">
        <GateHero
          environment={initialGate.environment}
          verdict={verdict}
          latestRun={latestRun}
          checklist={checklist}
        />

        <div className="shell__board">
          <GoNoGoChecklist items={checklist} verdict={verdict} onToggle={handleToggle} />
          <RiskNote brief={riskBrief} />
        </div>

        <RecentRuns
          runs={runs}
          source={runsSource}
          message={runsMessage}
          loading={runsLoading}
        />

        <footer className="shell__footer">
          <p>
            Lean gate demo — small Playwright suite, human checklist, deploy only when both agree.
          </p>
          <p className="shell__footer-credit">
            <span>Ramona Bonitatis</span>
            <a
              href="https://github.com/ramonacraft/release-gate-lab"
              target="_blank"
              rel="noreferrer"
            >
              github.com/ramonacraft/release-gate-lab
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
