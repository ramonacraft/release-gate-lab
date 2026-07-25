export type SmokeResult = 'passed' | 'failed' | 'running' | 'skipped'
export type DeployResult = 'shipped' | 'blocked' | 'pending'

export type PipelineRun = {
  id: string
  buildNumber: string
  branch: string
  smoke: SmokeResult
  deploy: DeployResult
  duration: string
  startedAt: string
}

export type ChecklistItem = {
  id: string
  label: string
  hint: string
  checked: boolean
  required: boolean
}

export type GateSnapshot = {
  releaseName: string
  environment: string
  latestRun: PipelineRun
  checklist: ChecklistItem[]
  recentRuns: PipelineRun[]
}
