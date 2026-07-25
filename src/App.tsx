import { useEffect, useState } from 'react'
import { GateHero } from './components/GateHero'
import { GoNoGoChecklist } from './components/GoNoGoChecklist'
import { RecentRuns } from './components/RecentRuns'
import { RiskNote } from './components/RiskNote'
import { initialGate } from './data/mockGate'
import { gateVerdict } from './utils/gate'
import { fetchRecentRuns, type RunsSource } from './utils/fetchRecentRuns'
import type { PipelineRun } from './types/gate'
import './App.css'

const RISK_NOTE_KEY = 'release-gate-lab.risk-note'

function readStoredRiskNote(): string {
  try {
    return localStorage.getItem(RISK_NOTE_KEY) ?? ''
  } catch {
    return ''
  }
}

function App() {
  const [checklist, setChecklist] = useState(initialGate.checklist)
  const [riskNote, setRiskNote] = useState(readStoredRiskNote)
  const [runs, setRuns] = useState<PipelineRun[]>(initialGate.recentRuns)
  const [runsSource, setRunsSource] = useState<RunsSource>('mock')
  const [runsMessage, setRunsMessage] = useState('Loading pipeline runs…')
  const [runsLoading, setRunsLoading] = useState(true)
  const verdict = gateVerdict(checklist)

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

  const handleRiskNoteChange = (value: string) => {
    setRiskNote(value)
    try {
      localStorage.setItem(RISK_NOTE_KEY, value)
    } catch {
      // ignore quota / private mode
    }
  }

  return (
    <div className="shell">
      <div className="shell__atmosphere" aria-hidden="true" />
      <div className="shell__content">
        <GateHero
          brand={initialGate.releaseName}
          environment={initialGate.environment}
          verdict={verdict}
          latestRun={runs[0] ?? initialGate.latestRun}
        />
        <GoNoGoChecklist items={checklist} verdict={verdict} onToggle={handleToggle} />
        <RiskNote value={riskNote} onChange={handleRiskNoteChange} />
        <RecentRuns
          runs={runs}
          source={runsSource}
          message={runsMessage}
          loading={runsLoading}
        />
        <footer className="shell__footer">
          <p>
            Lean gate demo — small smoke suite, human checklist, deploy only when both agree.
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
