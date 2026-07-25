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
        message:
          'Demo history for walkthroughs. Azure Pipelines powers the real gate; connect live runs when ready.',
      }
    }

    const payload = (await response.json()) as AzureBuildsResponse
    const runs = mapAzureBuildsToRuns(payload)
    if (runs.length === 0) {
      return {
        runs: initialGate.recentRuns,
        source: 'mock',
        message:
          'Demo history for walkthroughs. Azure Pipelines powers the real gate; connect live runs when ready.',
      }
    }

    return {
      runs,
      source: 'live',
      message: 'Live Azure Pipelines runs — Playwright automation results from CI.',
    }
  } catch {
    return {
      runs: initialGate.recentRuns,
      source: 'mock',
      message:
        'Demo history for walkthroughs. Azure Pipelines powers the real gate; connect live runs when ready.',
    }
  }
}
