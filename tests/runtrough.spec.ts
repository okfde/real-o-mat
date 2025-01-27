import { test, expect } from '@playwright/test'

test('test', async ({ page }) => {
  test.setTimeout(60_000)

  await page.goto('/')
  await page.getByRole('button', { name: "Los geht's!" }).click()

  await page.getByRole('button', { name: 'Weiter' }).click()

  await page.waitForTimeout(500)

  await page.getByRole('button', { name: 'ja, finde ich auch' }).click()
  await page.waitForTimeout(500)
  await page.getByRole('button', { name: 'These überspringen' }).click()
  await page.waitForTimeout(500)

  await expect(page.getByRole('progressbar')).toHaveAttribute(
    'aria-valuenow',
    '3',
  )

  for (let i = 0; i < 18; i++) {
    await page.waitForTimeout(300)
    await page.getByRole('button', { name: 'ja, finde ich auch' }).click()
  }

  await page
    .locator('label')
    .filter({ hasText: '1. Arbeit' })
    .getByLabel('')
    .check()
  await page
    .locator('label')
    .filter({ hasText: '19. Landwirtschaft' })
    .getByLabel('')
    .check()

  await expect(page.locator('form input[type="checkbox"]')).toHaveCount(19)

  await page.getByRole('button', { name: 'Weiter' }).first().click()

  await expect(page.getByLabel('Ergebnis').getByRole('heading')).toContainText(
    'Ihr Real-O-Mat Ergebnis',
  )

  await page.getByRole('tab', { name: 'Parteienvergleich' }).click()
  await expect(
    page.getByLabel('Parteienvergleich').getByRole('heading'),
  ).toContainText('Vergleich')

  await expect(
    page.locator('tr:nth-child(1) > td:nth-child(2) div[aria-label]'),
  ).toHaveAttribute('aria-label', 'ja, finde ich auch')
  await expect(
    page.locator('tr:nth-child(2) > td:nth-child(2) div[aria-label]'),
  ).toHaveAttribute('aria-label', 'Position nicht wertbar')

  await page.getByRole('tab', { name: 'Begründungen' }).click()
  await expect(page.getByLabel('Begründungen').locator('h2')).toContainText(
    'Begründung der Thesen',
  )
  await expect(page.getByLabel('Springe zur These')).toHaveValue('0')

  await page.getByRole('button', { name: 'Weiter' }).click()
  await expect(page.getByLabel('Springe zur These')).toHaveValue('1')

  await page.getByRole('link', { name: 'Real-O-Mat' }).click()
  await expect(page.getByRole('button', { name: "Los geht's!" })).toBeVisible()

  await page.getByRole('button', { name: "Los geht's!" }).click()
  await page.getByRole('button', { name: 'Weiter' }).click()
  await expect(page.getByRole('article')).toContainText('20 / 20')

  page.on('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Neustarten' }).click()
  await expect(page.getByRole('button', { name: "Los geht's!" })).toBeVisible()
})
