import { expect, test } from '@playwright/test'

/**
 * Lean smoke suite (intentionally small).
 * Goal: trusted gate checks — not hundreds of brittle UI paths.
 */
test.describe('Release Gate Lab smoke', () => {
  test('homepage shows brand and gate verdict', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText('Release Gate Lab Dashboard', { exact: true }).first()).toBeVisible()
    await expect(page.getByTestId('gate-verdict')).toBeVisible()
    await expect(page.getByRole('heading', { name: /Go \/ no-go checklist/i })).toBeVisible()
  })

  test('checklist rollup starts as Not ready until owner signs off', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByTestId('checklist-rollup')).toHaveText('Not ready')
    await expect(page.getByTestId('gate-verdict')).toHaveText('Not ready')
  })

  test('toggling required owner sign-off flips Ready state', async ({ page }) => {
    await page.goto('/')

    await page.getByTestId('check-owner').check()

    await expect(page.getByTestId('checklist-rollup')).toHaveText('Ready')
    await expect(page.getByTestId('gate-verdict')).toHaveText('Safe to ship')

    await page.getByTestId('check-owner').uncheck()

    await expect(page.getByTestId('checklist-rollup')).toHaveText('Not ready')
    await expect(page.getByTestId('gate-verdict')).toHaveText('Not ready')
  })

  test('risk note auto-fills for developers from gate signals', async ({ page }) => {
    await page.goto('/')

    const note = page.getByTestId('risk-note')
    await expect(note).toBeVisible()
    // Latest mock run is green; open human gate drives the auto brief.
    await expect(note).toContainText('Human gate open')
    await expect(note).toContainText('KPI impact')
    await expect(note).toContainText('Revenue continuity')

    await page.getByTestId('check-owner').check()
    await expect(note).toContainText('Gate clear')
  })

  test('recent runs table lists builds with a source badge', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Recent runs' })).toBeVisible()
    await expect(page.getByTestId('runs-source')).toBeVisible()
    await expect(page.getByTestId('run-1041')).toContainText('Deploy blocked')
    await expect(page.getByTestId('run-1042')).toContainText('Ready to ship')
  })
})
