import { test, expect } from '@playwright/test'

test('test', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })

  await page.goto('/')
  await page.getByRole('button', { name: "Los geht's!" }).click()

  await page.getByRole('button', { name: 'Weiter' }).click()

  await page.getByRole('button', { name: 'ja, finde ich auch' }).click()
  await page.getByRole('button', { name: 'These überspringen' }).click()

  await expect(page.getByText('3 /')).toBeVisible()

  for (let i = 0; i < 18; i++) {
    await page.getByRole('button', { name: 'ja, finde ich auch' }).click()
  }

  expect(page.getByRole('heading', { name: '1. Arbeit' })).toBeVisible()
  expect(
    page.getByRole('heading', { name: '19. Landwirtschaft' }),
  ).toBeVisible()

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
    page.locator('tr:nth-child(1) > td:nth-child(2) span'),
  ).toHaveText('ja, finde ich auch')
  await expect(
    page.locator('tr:nth-child(2) > td:nth-child(2) span'),
  ).toHaveText('Position nicht wertbar')

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
