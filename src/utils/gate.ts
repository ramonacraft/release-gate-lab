import type { ChecklistItem, DeployResult, SmokeResult } from '../types/gate'

export function requiredItemsReady(checklist: ChecklistItem[]): boolean {
  return checklist.filter((item) => item.required).every((item) => item.checked)
}

export function gateVerdict(checklist: ChecklistItem[]): 'ready' | 'not-ready' {
  return requiredItemsReady(checklist) ? 'ready' : 'not-ready'
}

export function smokeLabel(result: SmokeResult): string {
  switch (result) {
    case 'passed':
      return 'Smoke passed'
    case 'failed':
      return 'Smoke failed'
    case 'running':
      return 'Smoke running'
    case 'skipped':
      return 'Smoke skipped'
  }
}

export function deployLabel(result: DeployResult): string {
  switch (result) {
    case 'shipped':
      return 'Shipped'
    case 'blocked':
      return 'Deploy blocked'
    case 'pending':
      return 'Deploy pending'
  }
}
