# Tasks: landing-page-v2

## Overview

4-phase transformation of devrafaseros.com from static CV to interactive Tech Lead brand platform.
Each phase leaves the site fully deployable. Total: 31 task groups across 4 phases.

---

## Phase 1 — Foundation

> Data layer extraction, TypeScript interfaces, SEO assets, self-hosted fonts, accessibility baseline.
> No visual changes. Strictly additive or safe rewrites.

### 1.1 Create TypeScript interfaces (data/types.ts)

- [ ] Create `src/data/types.ts` with interfaces: `SocialLink`, `NavLink`, `Technology` (level: `'Expert' | 'Proficient' | 'Familiar'`), `TechnologyCategory`, `Experience`, `Project` (with `role`, `impact?`, `featured?`, `repoUrl?`, `liveUrl?`, `image?`), `Talk`, `ContactMethod`, `SiteMetadata`, `Highlight` (with `numericValue` and `hasSuffix` for counter animation)
- [ ] Verify all interfaces are exported (no default exports — named only)
- [ ] Verify `Technology.level` is the union type, not `string`

**Specs**: SPEC-DATA-001  
**Files**: `src/data/types.ts`  
**Depends on**: nothing

---

### 1.2 Extract social links data file

- [ ] Create `src/data/social-links.ts` — `SocialLink[]` extracted from inline data in `Hero.astro`, `Contact.astro`, `Footer.astro`
- [ ] Import `SocialLink` from `../data/types`
- [ ] Update `Hero.astro` to import from `src/data/social-links.ts` (remove inline array)
- [ ] Update `Contact.astro` to import from `src/data/social-links.ts`
- [ ] Update `Footer.astro` to import from `src/data/social-links.ts`

**Specs**: SPEC-DATA-002  
**Files**: `src/data/social-links.ts`, `src/components/sections/Hero.astro`, `src/components/sections/Contact.astro`, `src/components/layout/Footer.astro`  
**Depends on**: 1.1

---

### 1.3 Extract nav links data file

- [ ] Create `src/data/nav-links.ts` — `NavLink[]` extracted from `Header.astro`
- [ ] Import `NavLink` from `../data/types`
- [ ] Update `Header.astro` to import from `src/data/nav-links.ts` (remove inline array)

**Specs**: SPEC-DATA-002  
**Files**: `src/data/nav-links.ts`, `src/components/layout/Header.astro`  
**Depends on**: 1.1

---

### 1.4 Extract technologies data file

- [ ] Create `src/data/technologies.ts` — `TechnologyCategory[]` migrating all 16 current techs from percentage bars to `Expert/Proficient/Familiar` tiers using thresholds: ≥85% → Expert, 70–84% → Proficient, <70% → Familiar
- [ ] Import `TechnologyCategory` and `Technology` from `../data/types`
- [ ] Verify all 16 technologies have a valid `level` value

**Specs**: SPEC-DATA-002, SPEC-TECH-002  
**Files**: `src/data/technologies.ts`  
**Depends on**: 1.1

---

### 1.5 Extract experience data file

- [ ] Create `src/data/experience.ts` — `Experience[]` extracted from `Experience.astro`
- [ ] Import `Experience` from `../data/types`
- [ ] Update `Experience.astro` to import from `src/data/experience.ts`

**Specs**: SPEC-DATA-002  
**Files**: `src/data/experience.ts`, `src/components/sections/Experience.astro`  
**Depends on**: 1.1

---

### 1.6 Create talks and projects data files

- [ ] Create `src/data/talks.ts` — `Talk[]` + interests data extracted from `Speaker.astro`
- [ ] Create `src/data/projects.ts` — `Project[]` with 2–3 real projects: hospital management system, admission portal, clinical reports module (all typed as `Project[]`)
- [ ] Import types from `../data/types`
- [ ] Update `Speaker.astro` to import from `src/data/talks.ts`

**Specs**: SPEC-DATA-002, SPEC-PROJ-003  
**Files**: `src/data/talks.ts`, `src/data/projects.ts`, `src/components/sections/Speaker.astro`  
**Depends on**: 1.1

---

### 1.7 Create site metadata data file

- [ ] Create `src/data/site.ts` — `SiteMetadata` with name, title, description, url, ogImage, twitterHandle, locale
- [ ] Import `SiteMetadata` from `../data/types`
- [ ] Update `Layout.astro` to import site metadata from `src/data/site.ts` instead of hardcoded strings (keep existing meta tag structure for now — just pull from data)

**Specs**: SPEC-DATA-002  
**Files**: `src/data/site.ts`, `src/layouts/Layout.astro`  
**Depends on**: 1.1

---

### 1.8 Generate and add favicon assets

- [ ] Generate `public/favicon-32x32.png` (32×32) from existing `public/favicon.svg`
- [ ] Generate `public/favicon-16x16.png` (16×16) from existing `public/favicon.svg`
- [ ] Generate `public/apple-touch-icon.png` (180×180) from existing `public/favicon.svg`
- [ ] Create `public/favicon.ico` (multi-size .ico with 16 and 32 variants)
- [ ] Verify `Layout.astro` already references these paths (confirmed in spec — they are referenced but files are missing)

**Specs**: SPEC-SEO-001  
**Files**: `public/favicon-32x32.png`, `public/favicon-16x16.png`, `public/apple-touch-icon.png`, `public/favicon.ico`  
**Depends on**: nothing

---

### 1.9 Create OG image

- [ ] Design and export `public/og-image.png` at 1200×630px — static image (not auto-generated), includes name, title "Tech Lead & Speaker", devrafaseros.com URL, color scheme matching site
- [ ] Verify `Layout.astro` OG meta tag references `/og-image.png`

**Specs**: SPEC-SEO-001  
**Files**: `public/og-image.png`  
**Depends on**: nothing

---

### 1.10 Add sitemap and robots.txt

- [ ] Install `@astrojs/sitemap` — `npm install @astrojs/sitemap`
- [ ] Update `astro.config.mjs` — add `site: 'https://devrafaseros.com'` and `integrations: [sitemap()]`
- [ ] Create `public/robots.txt` with `User-agent: *`, `Allow: /`, `Sitemap: https://devrafaseros.com/sitemap-index.xml`

**Specs**: SPEC-SEO-002  
**Files**: `astro.config.mjs`, `public/robots.txt`, `package.json`  
**Depends on**: nothing

---

### 1.11 Add JSON-LD structured data

- [ ] Add `<script type="application/ld+json">` in `Layout.astro` `<head>` with Person schema: name, url, jobTitle, sameAs (social profiles), knowsAbout
- [ ] Pull values from `src/data/site.ts` and `src/data/social-links.ts`

**Specs**: SPEC-SEO-003  
**Files**: `src/layouts/Layout.astro`  
**Depends on**: 1.7, 1.2

---

### 1.12 Self-host fonts

- [ ] Install `@fontsource/inter` and `@fontsource/space-grotesk` — `npm install @fontsource/inter @fontsource/space-grotesk`
- [ ] Import only weights 400, 500, 600, 700 for Inter and weights 400, 500, 600, 700 for Space Grotesk in `Layout.astro` (or a global CSS entry point)
- [ ] Remove Google Fonts `<link>` tags from `Layout.astro`
- [ ] Verify font-family references in `tailwind.config` / `global.css` still resolve correctly

**Specs**: SPEC-PERF-001  
**Files**: `src/layouts/Layout.astro`, `src/styles/global.css`, `package.json`  
**Depends on**: nothing

---

### 1.13 Add skip-to-content link

- [ ] Create `src/components/layout/SkipToContent.astro` — visually hidden link that becomes visible on focus, `href="#main-content"`, text "Saltar al contenido principal"
- [ ] Add `<SkipToContent />` as the first child inside `<body>` in `Layout.astro`, before `<Header>`
- [ ] Add `id="main-content"` to the `<main>` element in `Layout.astro`
- [ ] Add CSS for `.skip-to-content` — `position: absolute`, off-screen by default, `focus:translate-y-0` visible state with high z-index

**Specs**: SPEC-A11Y-001  
**Files**: `src/components/layout/SkipToContent.astro`, `src/layouts/Layout.astro`, `src/styles/global.css`  
**Depends on**: nothing

---

### 1.14 Add prefers-reduced-motion CSS baseline

- [ ] Add `@media (prefers-reduced-motion: reduce)` block in `src/styles/global.css` that sets `animation: none !important`, `transition: none !important`, `transform: none !important` for all elements (`*, *::before, *::after`)
- [ ] Verify existing `.animate-on-scroll` / `.animated` keyframes are inside normal media (not inside reduced-motion block)

**Specs**: SPEC-A11Y-002  
**Files**: `src/styles/global.css`  
**Depends on**: nothing

---

### 1.15 Audit and fix heading hierarchy and ARIA baseline

- [ ] Verify single `<h1>` exists only in `Hero.astro`
- [ ] Verify heading hierarchy: h1 (Hero) → h2 (section titles) → h3 (card titles) — fix any violations
- [ ] Add `aria-label` to all icon-only buttons (social links, GitHub/live links in future ProjectCard)
- [ ] Verify color contrast ≥ 4.5:1 for all text on backgrounds (check dark mode too)

**Specs**: SPEC-A11Y-003  
**Files**: All section `.astro` components  
**Depends on**: nothing

---

## Phase 2 — Functionality

> Scroll animation system, mobile menu rewrite, active nav highlighting, stats counter. All interactive behavior.

### 2.1 Create scroll animation script

- [ ] Create `src/scripts/scroll-animations.ts` — `IntersectionObserver` that adds `.animated` class to all `.animate-on-scroll` elements; threshold `0.15`, rootMargin `0px 0px -50px 0px`; `unobserve` element after first trigger
- [ ] Add `prefers-reduced-motion` check at top — if `matchMedia('(prefers-reduced-motion: reduce)').matches`, skip observer and add `.animated` to all elements immediately (show final state)
- [ ] Import / `<script>` tag in `Layout.astro` or per-section as needed

**Specs**: SPEC-ANIM-001  
**Files**: `src/scripts/scroll-animations.ts`, `src/layouts/Layout.astro`  
**Depends on**: 1.14

---

### 2.2 Add stagger delay CSS classes

- [ ] Add `.stagger-1` through `.stagger-8` CSS classes in `src/styles/global.css` — each adds `animation-delay` in 100ms increments (100ms, 200ms, ... 800ms)
- [ ] Add `.delay-600`, `.delay-700`, `.delay-900` utility classes for hero entrance sequence
- [ ] Verify these compose correctly with `.animate-on-scroll` and the existing `fade-in-up` keyframe

**Specs**: SPEC-ANIM-002  
**Files**: `src/styles/global.css`  
**Depends on**: 2.1

---

### 2.3 Rewrite mobile menu

- [ ] Create `src/scripts/mobile-menu.ts` — manages: open/close state, backdrop overlay, body scroll lock (`overflow: hidden` on `<body>`), focus trap (Tab/Shift+Tab cycle within menu), Escape key closes menu, hamburger/close icon swap
- [ ] Update `Header.astro` mobile menu markup — add `aria-expanded` on toggle button, `aria-controls` pointing to menu `id`, backdrop `<div>` overlay before menu panel, proper `role="navigation"` and `aria-label`
- [ ] Add slide-in CSS animation for menu panel (translateX or opacity+translateY, not abrupt display toggle)
- [ ] Add backdrop CSS — semi-transparent dark overlay, `z-index` below menu panel but above content
- [ ] Import `src/scripts/mobile-menu.ts` in `Header.astro` or `Layout.astro`

**Specs**: SPEC-NAV-002, SPEC-A11Y-004  
**Files**: `src/scripts/mobile-menu.ts`, `src/components/layout/Header.astro`, `src/styles/global.css`  
**Depends on**: 1.13 (focus trap needs visible focus rings)

---

### 2.4 Add active nav section highlighting

- [ ] Create `src/scripts/active-nav.ts` — `IntersectionObserver` with `rootMargin: '-80px 0px -60% 0px'` watching all `section[id]` elements; when a section intersects, add `.nav-active` to corresponding nav link; remove from others; last-section fallback (if scrolled past all sections, activate last link)
- [ ] Add `.nav-active` CSS class in `global.css` or `Header.astro` scoped styles — distinct visual treatment (e.g., accent color, underline)
- [ ] Import `src/scripts/active-nav.ts` in `Layout.astro`
- [ ] Verify nav link `href` values match section `id` attributes exactly

**Specs**: SPEC-NAV-001  
**Files**: `src/scripts/active-nav.ts`, `src/styles/global.css`, `src/layouts/Layout.astro`  
**Depends on**: 1.3

---

### 2.5 Add nav link hover micro-interactions

- [ ] Add CSS `::after` pseudo-element on `.nav-link` — `width: 0`, `height: 2px`, `bg-accent`, absolute positioned bottom, transitions to `width: 100%` on hover/focus in 200ms ease-out
- [ ] Verify no layout shift (use `position: absolute`, not changing box model)
- [ ] Apply to both desktop nav and mobile menu links

**Specs**: SPEC-NAV-003  
**Files**: `src/styles/global.css` or `Header.astro` scoped `<style>`  
**Depends on**: nothing

---

### 2.6 Add stats counter animation

- [ ] Create `src/scripts/counter.ts` — reads elements with `data-counter-target` (number) and `data-counter-suffix` attributes; uses `requestAnimationFrame` with 1500ms duration and ease-out cubic; fires once per element (no restart on re-enter); checks `prefers-reduced-motion` and skips to final value immediately if reduced
- [ ] Update `AboutMe.astro` stats section — add `data-counter-target` and `data-counter-suffix` attributes to each stat number element, add `.animate-on-scroll` class to trigger timing
- [ ] Import `src/scripts/counter.ts` in `Layout.astro`

**Specs**: SPEC-ANIM-003  
**Files**: `src/scripts/counter.ts`, `src/components/sections/AboutMe.astro`, `src/layouts/Layout.astro`  
**Depends on**: 2.1

---

## Phase 3 — Content

> Projects section, technology badge redesign, contact form with validation. Visual and structural changes.

### 3.1 Create Badge UI component

- [ ] Create `src/components/ui/Badge.astro` — props: `label: string`, `tier?: 'Expert' | 'Proficient' | 'Familiar'` (defaults to neutral), `size?: 'sm' | 'md'`
- [ ] Expert tier: accent color tint background
- [ ] Proficient tier: blue tint background
- [ ] Familiar tier: neutral/muted background
- [ ] Include `role="img"` or `aria-label` with tier context for screen readers (e.g., "TypeScript — Expert")

**Specs**: SPEC-TECH-001  
**Files**: `src/components/ui/Badge.astro`  
**Depends on**: 1.1

---

### 3.2 Rewrite Technologies section with badge cards

- [ ] Update `Technologies.astro` to import from `src/data/technologies.ts`
- [ ] Replace percentage bar rendering with `<Badge>` component per technology
- [ ] Group by `TechnologyCategory`, render category title as `<h3>`
- [ ] Add tier legend (Expert / Proficient / Familiar) with color key at top of section
- [ ] Remove all numeric percentage references from markup and data
- [ ] Add `.animate-on-scroll .stagger-N` to badge groups

**Specs**: SPEC-TECH-001, SPEC-TECH-002  
**Files**: `src/components/sections/Technologies.astro`, `src/components/ui/Badge.astro`  
**Depends on**: 1.4, 3.1

---

### 3.3 Create ProjectCard UI component

- [ ] Create `src/components/ui/ProjectCard.astro` — props: `project: Project`
- [ ] Renders: optional image (astro:assets `<Image>`), `role` badge, `title`, `summary`, optional `impact` metric (accent background highlight), tech tags (`tech[]` as small badges), GitHub link (if `repoUrl`), live link (if `liveUrl`)
- [ ] Hover effect: `translateY(-4px)` lift + subtle shadow increase, 200ms ease transition
- [ ] Add `.animate-on-scroll` class for scroll reveal
- [ ] `aria-label` on icon-only link buttons

**Specs**: SPEC-PROJ-002  
**Files**: `src/components/ui/ProjectCard.astro`  
**Depends on**: 1.1, 3.1 (Badge for tech tags)

---

### 3.4 Create Projects section

- [ ] Create `src/components/sections/Projects.astro` — `id="proyectos"`, `aria-labelledby` pointing to section heading
- [ ] Import `projects` from `src/data/projects.ts`, render `<ProjectCard>` for each
- [ ] Grid layout: 2-column max on desktop; featured projects (`featured: true`) span full width (`lg:col-span-2`)
- [ ] Add `.animate-on-scroll` to the section and stagger on cards
- [ ] Add section to `src/pages/index.astro` between Experience and Technologies sections

**Specs**: SPEC-PROJ-001, SPEC-PROJ-002  
**Files**: `src/components/sections/Projects.astro`, `src/pages/index.astro`  
**Depends on**: 1.6, 3.3

---

### 3.5 Create contact form validation script

- [ ] Create `src/scripts/contact-form.ts` — validates on blur and submit: name (min 2 chars), email (HTML5 type + regex), message (10–2000 chars); displays Spanish error messages; associates errors via `aria-describedby`; sets `aria-invalid="true"` on invalid fields
- [ ] Honeypot field handling — hidden checkbox `name="botcheck"`, if checked on submit, silently reject (return without sending)
- [ ] AJAX submission via `fetch()` to `PUBLIC_FORM_ENDPOINT` env var; disable button during submit; show success/error state in `aria-live="polite"` region; restore button on completion

**Specs**: SPEC-CONTACT-001, SPEC-CONTACT-002  
**Files**: `src/scripts/contact-form.ts`  
**Depends on**: nothing

---

### 3.6 Update Contact section with form

- [ ] Update `Contact.astro` to add HTML form — fields: name (`<input type="text">`), email (`<input type="email">`), message (`<textarea>`), honeypot (`<input type="checkbox" name="botcheck">` hidden via CSS), submit button
- [ ] Add `<input type="hidden" name="access_key">` for Web3Forms API key (value from `PUBLIC_FORM_ENDPOINT` or `PUBLIC_WEB3FORMS_KEY`)
- [ ] Add `aria-live="polite"` region for success/error messages
- [ ] Add `<label for="">` for every field, `aria-describedby` for error elements
- [ ] Import and initialize `src/scripts/contact-form.ts`
- [ ] Add `.env.example` with `PUBLIC_WEB3FORMS_KEY=your_key_here`

**Specs**: SPEC-CONTACT-001, SPEC-CONTACT-002  
**Files**: `src/components/sections/Contact.astro`, `src/scripts/contact-form.ts`, `.env.example`  
**Depends on**: 3.5

---

## Phase 4 — Polish

> Hero redesign, scroll progress indicator, image optimization, Lighthouse audit pass.

### 4.1 Redesign Hero with asymmetric layout

- [ ] Update `Hero.astro` — two-column desktop layout (60/40 split using CSS grid or flexbox): left column (text content), right column (photo area)
- [ ] Photo area right column: decorative accent ring (`border-accent`, `rounded-full`, positioned absolutely), `<Image>` component for photo (or fallback "RG" initials avatar if no photo file)
- [ ] If using real photo: add `public/images/rafael-gallegos.jpg` (or WebP), use `astro:assets` `<Image>` with `width`, `height`, `alt`, `loading="eager"`
- [ ] Verify single `<h1>` with name, subtitle with role/title

**Specs**: SPEC-HERO-001  
**Files**: `src/components/sections/Hero.astro`, `public/images/` (photo if available)  
**Depends on**: 1.7

---

### 4.2 Add Hero entrance animation sequence

- [ ] Update `Hero.astro` — 7 distinct animated elements: tagline/eyebrow (delay-100), h1 name (delay-200), role subtitle (delay-300), photo/avatar (delay-300), description paragraph (delay-400), CTA buttons (delay-500), social links (delay-600)
- [ ] Use existing `fade-in-up` keyframe + `delay-N` CSS classes
- [ ] CTA buttons: Contáctame → `#contacto`, Ver experiencia → `#experiencia`, optional Ver proyectos → `#proyectos`; primary button `hover:scale-105`; all use `scroll-margin-top: 5rem` on targets
- [ ] Verify prefers-reduced-motion skips all delays (CSS layer handles this via Phase 1.14)

**Specs**: SPEC-HERO-002, SPEC-HERO-003  
**Files**: `src/components/sections/Hero.astro`, `src/styles/global.css`  
**Depends on**: 1.14, 2.2, 4.1

---

### 4.3 Add scroll progress indicator

- [ ] Add scroll progress `<div>` in `Layout.astro` — fixed position, top: 0, left: 0, `height: 3px`, `background: var(--color-accent)`, `z-index: 60`, `width` controlled by CSS custom property `--scroll-progress`
- [ ] Add inline `<script>` in `Layout.astro` — `scroll` event listener updates `--scroll-progress` CSS custom property: `(scrollY / (documentHeight - viewportHeight)) * 100 + '%'`
- [ ] Verify it sits visually above the sticky header

**Specs**: SPEC-PERF-004  
**Files**: `src/layouts/Layout.astro`, `src/styles/global.css`  
**Depends on**: nothing

---

### 4.4 Optimize images with astro:assets

- [ ] Install `sharp` — `npm install sharp` (required for Astro image optimization)
- [ ] Update any `<img>` tags in section components to use `astro:assets` `<Image>` component — explicit `width`, `height`, `alt`, `format="webp"`, `loading="lazy"` (except hero: `loading="eager"`)
- [ ] Verify all images have explicit `width` and `height` to prevent CLS
- [ ] Verify hero photo uses `loading="eager"` and `fetchpriority="high"`

**Specs**: SPEC-PERF-002  
**Files**: All components with images, `package.json`  
**Depends on**: 4.1

---

### 4.5 Add card hover transforms

- [ ] Add `hover:translateY(-4px)` + shadow transition to `ProjectCard.astro` (may already be in 3.3 — verify and polish)
- [ ] Add subtle hover scale or lift to technology badge groups in `Technologies.astro`
- [ ] Add hover glow or border accent to social link cards in `Contact.astro` / `Footer.astro`
- [ ] Verify all transitions use `transition: transform 200ms ease, box-shadow 200ms ease` — compositor-only properties

**Specs**: SPEC-PROJ-002 (hover), SPEC-NAV-003 (micro-interactions)  
**Files**: `src/components/ui/ProjectCard.astro`, `src/components/sections/Technologies.astro`  
**Depends on**: 3.3, 3.2

---

### 4.6 Lighthouse audit and fixes

- [ ] Run Lighthouse (mobile simulation) against all four categories: Performance, Accessibility, Best Practices, SEO
- [ ] Identify any score below 90 — document findings
- [ ] Fix: any render-blocking resources, oversized images, missing alt text, contrast failures, missing meta
- [ ] Verify FCP ≤ 2.5s, LCP ≤ 3.0s, TBT ≤ 300ms, CLS ≤ 0.1
- [ ] Re-run after fixes — confirm all four categories ≥ 90

**Specs**: SPEC-PERF-003  
**Files**: varies based on findings  
**Depends on**: all previous tasks (final step)

---

## Task Summary

| Phase | Tasks | Specs Covered |
|-------|-------|---------------|
| Phase 1 — Foundation | 1.1–1.15 (15 groups) | SPEC-DATA-001/002, SPEC-SEO-001/002/003, SPEC-A11Y-001/002/003, SPEC-PERF-001 |
| Phase 2 — Functionality | 2.1–2.6 (6 groups) | SPEC-ANIM-001/002/003, SPEC-NAV-001/002/003, SPEC-A11Y-004 |
| Phase 3 — Content | 3.1–3.6 (6 groups) | SPEC-TECH-001/002, SPEC-PROJ-001/002/003, SPEC-CONTACT-001/002 |
| Phase 4 — Polish | 4.1–4.6 (6 groups) | SPEC-HERO-001/002/003, SPEC-PERF-002/003/004 |

**Total task groups**: 33  
**Critical path**: 1.1 → 1.2–1.7 → Phase 2 → 3.1 → 3.2/3.3 → 3.4 → 4.1 → 4.2 → 4.6

## New Files Created

```
src/data/types.ts
src/data/social-links.ts
src/data/nav-links.ts
src/data/technologies.ts
src/data/experience.ts
src/data/talks.ts
src/data/projects.ts
src/data/site.ts
src/scripts/scroll-animations.ts
src/scripts/active-nav.ts
src/scripts/mobile-menu.ts
src/scripts/counter.ts
src/scripts/contact-form.ts
src/components/layout/SkipToContent.astro
src/components/sections/Projects.astro
src/components/ui/Badge.astro
src/components/ui/ProjectCard.astro
public/favicon-32x32.png
public/favicon-16x16.png
public/apple-touch-icon.png
public/favicon.ico
public/og-image.png
public/robots.txt
.env.example
```

## Files Modified

```
src/layouts/Layout.astro          — fonts, skip-link, JSON-LD, scroll progress
src/styles/global.css             — reduced-motion, stagger delays, nav active, skip-link
src/components/layout/Header.astro — nav-links import, mobile menu markup, active-nav
src/components/layout/Footer.astro — social-links import
src/components/sections/Hero.astro — social-links import, asymmetric layout, entrance anim
src/components/sections/Contact.astro — social-links import, form markup
src/components/sections/Technologies.astro — data import, badge redesign
src/components/sections/Experience.astro — data import
src/components/sections/Speaker.astro — talks data import
src/components/sections/AboutMe.astro — counter data attrs
src/pages/index.astro             — add Projects section
astro.config.mjs                  — site URL, sitemap integration
package.json                      — new deps
```
