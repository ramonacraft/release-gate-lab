import type { DeployResult, PipelineRun, SmokeResult } from '../types/gate'

type AzureBuild = {
  id: number
  buildNumber: string
  status: string
  result?: string
  sourceBranch: string
  startTime?: string
  finishTime?: string
  queueTime?: string
}

export type AzureBuildsResponse = {
  value?: AzureBuild[]
}

function branchName(ref: string): string {
  return ref.replace(/^refs\/heads\//, '').replace(/^refs\/pull\/\d+\/merge$/, 'pr-merge')
}

function durationLabel(start?: string, finish?: string): string {
  if (!start) return '—'
  const startMs = Date.parse(start)
  const endMs = Date.parse(finish || new Date().toISOString())
  if (Number.isNaN(startMs) || Number.isNaN(endMs) || endMs < startMs) return '—'
  const totalSec = Math.round((endMs - startMs) / 1000)
  const minutes = Math.floor(totalSec / 60)
  const seconds = totalSec % 60
  if (minutes <= 0) return `${seconds}s`
  return `${minutes}m ${String(seconds).padStart(2, '0')}s`
}

function mapSmoke(status: string, result?: string): SmokeResult {
  if (status === 'inProgress' || status === 'notStarted') return 'running'
  if (result === 'succeeded') return 'passed'
  if (result === 'failed' || result === 'canceled') return 'failed'
  return 'skipped'
}

function mapDeploy(status: string, result?: string, branch?: string): DeployResult {
  if (status === 'inProgress' || status === 'notStarted') return 'pending'
  if (result === 'failed' || result === 'canceled') return 'blocked'
  if (result === 'succeeded' && branch === 'main') return 'shipped'
  if (result === 'succeeded') return 'pending'
  return 'blocked'
}

export function mapAzureBuildsToRuns(payload: AzureBuildsResponse): PipelineRun[] {
  const builds = payload.value ?? []
  return builds.map((build) => {
    const branch = branchName(build.sourceBranch || '')
    return {
      id: `azure-${build.id}`,
      buildNumber: build.buildNumber?.startsWith('#')
        ? build.buildNumber
        : `#${build.buildNumber}`,
      branch,
      smoke: mapSmoke(build.status, build.result),
      deploy: mapDeploy(build.status, build.result, branch),
      duration: durationLabel(build.startTime || build.queueTime, build.finishTime),
      startedAt: build.startTime || build.queueTime || new Date().toISOString(),
    }
  })
}
