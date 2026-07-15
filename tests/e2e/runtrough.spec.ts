import { test, expect } from '@playwright/test'

test('Use the app for one election and get a result', async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })

  await page.goto('/')
  await page.getByRole('link', { name: "Test Election 1" }).click()

  await page.getByRole('button', { name: 'Weiter' }).click()

  await page.getByRole('button', { name: 'ja, finde ich auch' }).click()
  await page.getByRole('button', { name: 'These überspringen' }).click()

  await expect(page.getByText('3 /')).toBeVisible()

  for (let i = 0; i < 4; i++) {
    await page.getByRole('button', { name: 'ja, finde ich auch' }).click()
  }

  expect(page.getByRole('heading', { name: '1. Arbeit' })).toBeVisible()
  expect(
    page.getByRole('heading', { name: '5. Finanzen' }),
  ).toBeVisible()

  await expect(page.locator('form input[type="checkbox"]')).toHaveCount(5)

  await page.getByRole('button', { name: 'Weiter' }).first().click()

  await expect(page.getByLabel('Ergebnis').getByRole('heading')).toContainText(
    'Ihr Real-O-Mat Ergebnis',
  )

  // Share feature
  // Firefox does not support the clipboard-read permission
  if (browserName !== 'firefox') {
    await page.context().grantPermissions(["clipboard-read"]);
    await page.getByRole('button', { name: 'Ihr Ergebnis teilen' }).click();
    const handle = await page.evaluateHandle(() => navigator.clipboard.readText());
    const clipboardContent = await handle.jsonValue();

    expect(clipboardContent).toContain("Mein Real-O-Mat Ergebnis")
    expect(clipboardContent).toContain("🟪⬜")
  }

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
  await expect(page.getByRole('link', { name: "Test Election 1" })).toBeVisible()

  await page.getByRole('link', { name: "Test Election 1" }).click()
  // await page.getByRole('button', { name: 'Weiter' }).click()
  // await expect(page.getByRole('article')).toContainText('20 / 20')

  page.on('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Neustarten' }).click()
  await expect(page.getByRole('button', { name: "Weiter" })).toBeVisible()
})

test('Switch between multiple elections', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  page.on('dialog', (dialog) => dialog.accept())

  // Some answers in Election 1
  await page.goto('/')
  await page.getByRole('link', { name: 'Test Election 1' }).click();
  await page.getByRole('button', { name: 'Weiter' }).click();
  await page.getByRole('button', { name: 'ja, finde ich auch' }).click();
  await page.getByRole('button', { name: 'nein, geht mir zu weit' }).click();

  // Switch to Election 2
  await page.getByRole('link', { name: 'Real-O-Mat' }).click();
  await page.getByRole('link', { name: 'Test Election 2' }).click();
  await page.getByRole('button', { name: 'Weiter' }).click();
  // We are at the start of Election 2
  await expect(page.getByRole('article')).toContainText('1 / 6');

  // Switch back to Election 1
  await page.getByRole('link', { name: 'Real-O-Mat' }).click();
  await page.getByRole('link', { name: 'Test Election 1' }).click();

  // We are where we left off
  await expect(page.getByRole('article')).toContainText('3 / 6');


})
