import { test, expect } from '@playwright/test';

// ─── CV page loads ────────────────────────────────────────────────────────────

test('cv page returns 200', async ({ page }) => {
  const response = await page.goto('/cv');
  expect(response?.status()).toBe(200);
});

// ─── Meta tags ────────────────────────────────────────────────────────────────

test('cv page has noindex meta tag', async ({ page }) => {
  await page.goto('/cv');
  const robots = await page.getAttribute('meta[name="robots"]', 'content');
  expect(robots).toContain('noindex');
});

test('cv page title contains CV info', async ({ page }) => {
  await page.goto('/cv');
  await expect(page).toHaveTitle(/Curriculum|CV/i);
});

// ─── Navigation ───────────────────────────────────────────────────────────────

test('cv page has Volver al sitio link', async ({ page }) => {
  await page.goto('/cv');
  const backLink = page.locator('a[href="/"]');
  await expect(backLink).toBeVisible();
});

// ─── Sections visible ─────────────────────────────────────────────────────────

test('cv page has Educación section', async ({ page }) => {
  await page.goto('/cv');
  await expect(page.locator('h2:has-text("Educación")')).toBeVisible();
});

test('cv page has Experiencia Profesional section', async ({ page }) => {
  await page.goto('/cv');
  await expect(page.locator('h2:has-text("Experiencia Profesional")')).toBeVisible();
});

test('cv page has Habilidades Técnicas section', async ({ page }) => {
  await page.goto('/cv');
  await expect(page.locator('h2:has-text("Habilidades Técnicas")')).toBeVisible();
});

test('cv page has Idiomas section', async ({ page }) => {
  await page.goto('/cv');
  await expect(page.locator('h2:has-text("Idiomas")')).toBeVisible();
});

// ─── Print action ─────────────────────────────────────────────────────────────

test('cv page has Imprimir CV button', async ({ page }) => {
  await page.goto('/cv');
  await expect(page.locator('button:has-text("Imprimir")')).toBeVisible();
});
