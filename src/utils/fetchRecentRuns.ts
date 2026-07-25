import { initialGate } from '../data/mockGate'
import type { PipelineRun } from '../types/gate'
import { mapAzureBuildsToRuns, type AzureBuildsResponse } from './azureRuns'

export type RunsSource = 'live' | 'mock'

export type RunsFetchResult = {
  runs: PipelineRun[]
  source: RunsSource
  message: string
}

/**
 * Prefer live Azure runs from /api/runs.
 * Fall back to mock data when the API is unavailable (local preview, missing secrets).
 */
export async function fetchRecentRuns(): Promise<RunsFetchResult> {
  try {
    const response = await fetch('/api/runs')
    if (!response.ok) {
      return {
        runs: initialGate.recentRuns,
        source: 'mock',
        message: 'Showing mock runs — live Azure API is not configured yet.',
      }
    }

    const payload = (await response.json()) as AzureBuildsResponse
    const runs = mapAzureBuildsToRuns(payload)
    if (runs.length === 0) {
      return {
        runs: initialGate.recentRuns,
        source: 'mock',
        message: 'No Azure runs returned yet — showing mock history.',
      }
    }

    return {
      runs,
      source: 'live',
      message: 'Live from Azure Pipelines.',
    }
  } catch {
    return {
      runs: initialGate.recentRuns,
      source: 'mock',
      message: 'Showing mock runs — could not reach the live Azure API.',
    }
  }
}
