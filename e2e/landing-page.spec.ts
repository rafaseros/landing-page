import { test, expect } from '@playwright/test';

// ─── Home page loads ──────────────────────────────────────────────────────────

test('home page returns 200', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
});

// ─── Main sections visible ────────────────────────────────────────────────────

test('hero section is visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#hero')).toBeVisible();
});

test('sobre-mi section is visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#sobre-mi')).toBeVisible();
});

test('experiencia section is visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#experiencia')).toBeVisible();
});

test('tecnologias section is visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#tecnologias')).toBeVisible();
});

test('proyectos section is visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#proyectos')).toBeVisible();
});

test('speaker section is visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#speaker')).toBeVisible();
});

test('contacto section is visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#contacto')).toBeVisible();
});

// ─── Meta tags ────────────────────────────────────────────────────────────────

test('page has a non-empty title', async ({ page }) => {
  await page.goto('/');
  const title = await page.title();
  expect(title).toBeTruthy();
  expect(title.length).toBeGreaterThan(0);
});

test('page has meta description', async ({ page }) => {
  await page.goto('/');
  const description = await page.getAttribute('meta[name="description"]', 'content');
  expect(description).toBeTruthy();
});

test('page has og:title', async ({ page }) => {
  await page.goto('/');
  const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
  expect(ogTitle).toBeTruthy();
});

test('page has og:description', async ({ page }) => {
  await page.goto('/');
  const ogDescription = await page.getAttribute('meta[property="og:description"]', 'content');
  expect(ogDescription).toBeTruthy();
});

test('page has og:image', async ({ page }) => {
  await page.goto('/');
  const ogImage = await page.getAttribute('meta[property="og:image"]', 'content');
  expect(ogImage).toBeTruthy();
});

// ─── Navigation ───────────────────────────────────────────────────────────────

test('nav links are present', async ({ page }) => {
  await page.goto('/');
  const nav = page.locator('nav');
  await expect(nav).toBeVisible();
  const links = nav.locator('a');
  await expect(links).toHaveCount({ minimum: 1 } as Parameters<typeof expect>[0] extends infer T ? any : any);
});

test('clicking a nav link scrolls to the corresponding section', async ({ page }) => {
  await page.goto('/');

  // Click the "Experiencia" nav link and verify the section is in view
  const experienciaLink = page.locator(`nav a[href="#experiencia"]`).first();
  await experienciaLink.click();

  // After click, the section should be reachable (in viewport or URL hash updated)
  await expect(page.locator('#experiencia')).toBeInViewport({ ratio: 0.1 });
});

// ─── Mobile menu ─────────────────────────────────────────────────────────────

test('mobile menu button is present on small screens', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');

  // The hamburger / mobile menu toggle button should exist
  const menuButton = page.locator('button[aria-label], button[aria-controls], #mobile-menu-button, [data-menu-toggle]').first();
  await expect(menuButton).toBeVisible();
});

test('mobile menu opens and closes', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');

  const menuButton = page.locator('button[aria-label], button[aria-controls], #mobile-menu-button, [data-menu-toggle]').first();

  // Open the menu
  await menuButton.click();

  // A mobile nav/menu container should become visible
  const mobileNav = page.locator('#mobile-menu, [data-mobile-menu], nav[data-state="open"]').first();
  await expect(mobileNav).toBeVisible();

  // Close the menu
  await menuButton.click();
  await expect(mobileNav).toBeHidden();
});
