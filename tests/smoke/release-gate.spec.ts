import { expect, test } from '@playwright/test'

/**
 * Lean smoke suite (intentionally small).
 * Goal: trusted gate checks — not hundreds of brittle UI paths.
 */
test.describe('Release Gate Lab smoke', () => {
  test('homepage shows brand and gate verdict', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText('Release Gate Lab', { exact: true }).first()).toBeVisible()
    await expect(page.getByTestId('gate-verdict')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Go / no-go checklist' })).toBeVisible()
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

  test('risk note accepts a short judgment call', async ({ page }) => {
    await page.goto('/')

    const note = page.getByTestId('risk-note')
    await expect(note).toBeVisible()
    await note.fill('Low risk — smoke green, UI polish only.')
    await expect(note).toHaveValue('Low risk — smoke green, UI polish only.')
  })

  test('recent runs table lists builds with a source badge', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Recent runs' })).toBeVisible()
    await expect(page.getByTestId('runs-source')).toBeVisible()
    // Local preview has no Azure API — mock fallback still shows blocked deploy story.
    await expect(page.getByTestId('run-1041')).toContainText('Deploy blocked')
  })
})
