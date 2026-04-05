# Spec: Performance
**Change**: landing-page-v2
**Domain**: performance
**Status**: draft

---

## SPEC-PERF-001 — Self-Hosted Fonts

### Requirements

- Google Fonts CDN requests (`fonts.googleapis.com`, `fonts.gstatic.com`) MUST be replaced with self-hosted fonts via `@fontsource` packages.
- Required packages: `@fontsource/inter` and `@fontsource/space-grotesk`.
- Only used font weights MUST be imported to minimize bundle size.
  - Inter: 400, 500, 600, 700
  - Space Grotesk: 500, 600, 700
- The `<link rel="preconnect">` tags to Google domains in `Layout.astro` MUST be removed.
- The Google Fonts `<link rel="stylesheet">` MUST be removed from `Layout.astro`.
- Font imports MUST be added to `src/styles/global.css` using `@fontsource` import syntax.
- `@theme` declarations in `global.css` (`--font-heading`, `--font-body`) MUST remain unchanged.

### Scenarios

**Scenario 1: Fonts load without external requests**
- Given `@fontsource/inter` and `@fontsource/space-grotesk` are installed
- When the page loads in a browser with network throttling and all external domains blocked
- Then the fonts MUST load correctly from the site's own domain
- And no Google Fonts network requests MUST appear in DevTools Network tab

**Scenario 2: Only used weights are imported**
- Given only weights 400, 500, 600, 700 are imported for Inter
- When the Astro build runs
- Then only those weight files MUST be included in the `dist/` output
- And no unused weight files MUST be bundled

**Scenario 3: Typography unchanged after migration**
- Given fonts are migrated from CDN to self-hosted
- When the page renders
- Then headings MUST use Space Grotesk and body text MUST use Inter
- And visual appearance MUST be identical to the pre-migration state

### Acceptance Criteria

- [ ] `@fontsource/inter` and `@fontsource/space-grotesk` in `package.json` dependencies
- [ ] No `fonts.googleapis.com` or `fonts.gstatic.com` links in `Layout.astro`
- [ ] `global.css` imports both font families with specified weights only
- [ ] DevTools Network shows no external font requests on page load
- [ ] Font rendering is visually identical after migration

---

## SPEC-PERF-002 — Image Optimization

### Requirements

- All images MUST use Astro's `<Image>` component from `astro:assets` for automatic optimization.
- The profile photo (if used in Hero redesign) MUST be optimized: served in WebP format, with correct `width` and `height` attributes to prevent CLS.
- The `og-image.png` MUST be pre-optimized at 1200×630 px (not processed by Astro's pipeline — it is a static asset).
- No `<img>` tags MUST use images from `src/assets/` without going through `<Image>`.
- External images (e.g. social platform logos) are exempt from this rule.

### Scenarios

**Scenario 1: Profile photo served as WebP**
- Given the profile photo is placed in `src/assets/profile-photo.jpg`
- When `<Image src={profilePhoto} alt="..." width={400} height={400} />` is used
- Then Astro MUST generate an optimized WebP version
- And the browser MUST receive WebP (verified via DevTools Response headers)

**Scenario 2: No CLS from images**
- Given `<Image>` is used with explicit `width` and `height`
- When the page loads on a slow connection
- Then the image space MUST be reserved before the image loads
- And Cumulative Layout Shift (CLS) MUST be < 0.1

### Acceptance Criteria

- [ ] Profile photo uses `<Image>` from `astro:assets`
- [ ] `width` and `height` attributes are set on all `<Image>` components
- [ ] Lighthouse Performance audit CLS score < 0.1
- [ ] No raw `<img>` tags reference `src/assets/` files

---

## SPEC-PERF-003 — Lighthouse Score Targets

### Requirements

- After all v2 changes are implemented, the site MUST achieve a Lighthouse score ≥ 90 in all four categories: Performance, Accessibility, Best Practices, and SEO.
- These scores MUST be measured in Lighthouse "Mobile" simulation mode with a simulated slow 4G network.
- The site MUST have a First Contentful Paint (FCP) ≤ 2.5s on simulated mobile.
- The site MUST have a Largest Contentful Paint (LCP) ≤ 3.0s on simulated mobile.
- Total Blocking Time (TBT) MUST be ≤ 300ms.
- Cumulative Layout Shift (CLS) MUST be ≤ 0.1.

### Key Optimizations Required to Meet Targets

1. Self-hosted fonts (eliminates render-blocking Google Fonts) — SPEC-PERF-001
2. `<Image>` with correct dimensions (eliminates CLS) — SPEC-PERF-002
3. `astro:assets` automatic WebP conversion (reduces image payload)
4. Intersection Observer for animations (no heavy scroll listeners)
5. No unused JavaScript — scripts MUST use `is:inline` or be deferred via Astro defaults

### Scenarios

**Scenario 1: Lighthouse Performance ≥ 90 on mobile**
- Given all v2 features are implemented
- When Lighthouse is run in mobile mode on `https://devrafaseros.com`
- Then the Performance score MUST be ≥ 90

**Scenario 2: Lighthouse Accessibility ≥ 90**
- Given all accessibility specs (SPEC-A11Y-001 through SPEC-A11Y-004) are implemented
- When Lighthouse Accessibility is audited
- Then the score MUST be ≥ 90

**Scenario 3: Lighthouse SEO = 100**
- Given sitemap, robots.txt, canonical URL, meta tags, and structured data are in place
- When Lighthouse SEO is audited
- Then the score MUST be 100

### Acceptance Criteria

- [ ] Lighthouse Performance ≥ 90 (mobile simulation)
- [ ] Lighthouse Accessibility ≥ 90
- [ ] Lighthouse Best Practices ≥ 90
- [ ] Lighthouse SEO ≥ 90 (target: 100)
- [ ] FCP ≤ 2.5s, LCP ≤ 3.0s, TBT ≤ 300ms, CLS ≤ 0.1
- [ ] No render-blocking resources in Lighthouse report
- [ ] No unused JavaScript warnings for self-authored scripts

---

## SPEC-PERF-004 — Scroll Progress Indicator

### Requirements

- A horizontal scroll progress bar MUST be added at the very top of the viewport, above the sticky header.
- The bar MUST fill from left to right as the user scrolls down the page.
- Width MUST be calculated as: `(scrollTop / (documentHeight - viewportHeight)) * 100`%.
- The bar color MUST use `bg-accent` (#DC2626).
- The bar height MUST be 3px.
- The bar MUST use CSS custom property updates via JavaScript for smooth performance (avoid forced reflows).
- If `prefers-reduced-motion: reduce` is active, the bar MUST still show but without any transition animation.
- The bar MUST be `position: fixed` with `z-index: 60` (above the header at z-50).

### Scenarios

**Scenario 1: Bar fills on scroll**
- Given the user is at the top of the page (bar at 0% width)
- When the user scrolls halfway down the page
- Then the bar MUST show approximately 50% fill width

**Scenario 2: Bar at 100% at page bottom**
- Given the user has scrolled to the very bottom of the page
- When the scroll position equals `documentHeight - viewportHeight`
- Then the bar MUST be at 100% width (fully filled)

**Scenario 3: Smooth update performance**
- Given the bar updates on scroll
- When scrolling at 60fps
- Then the bar MUST update without visible jank
- And DevTools Performance panel MUST show no long tasks caused by the scroll handler

### Acceptance Criteria

- [ ] Scroll progress bar exists as a `position: fixed` element above the header
- [ ] Bar uses `bg-accent` color at 3px height
- [ ] Width updates correctly relative to scroll position
- [ ] `z-index: 60` ensures it renders above the header
- [ ] No jank measured in Chrome DevTools Performance tab during scroll
