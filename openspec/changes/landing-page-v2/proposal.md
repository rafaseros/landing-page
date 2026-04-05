# Change Proposal: landing-page-v2

> Transform devrafaseros.com from a static CV into an interactive Tech Lead brand platform.

**Author**: SDD Orchestrator  
**Date**: 2026-04-04  
**Status**: PROPOSED

---

## 1. Intent

Rafael Gallegos' portfolio at devrafaseros.com currently reads as a static curriculum vitae. For a Tech Lead with 12+ years of experience, the site needs to **communicate authority, showcase real work, and invite collaboration** — not just list skills with percentage bars.

**landing-page-v2** transforms the site into an interactive, accessible, SEO-complete personal brand platform that:
- Demonstrates technical craft through the site itself (clean code, performance, accessibility)
- Showcases real projects with measurable impact (the missing "Projects" section)
- Provides a professional contact experience
- Scores 90+ on all Lighthouse categories
- Meets WCAG 2.1 AA compliance

## 2. Scope

### 2.1 Phase 1 — Foundation (Infrastructure & Data)

**Goal**: Fix every broken reference, extract a data layer, add TypeScript interfaces, and establish accessibility baseline.

| Item | Description |
|------|-------------|
| **Missing assets** | Generate favicon PNGs (16x16, 32x32), apple-touch-icon.png (180x180), og-image.png (1200x630) — placeholder versions until real photo provided |
| **SEO infrastructure** | Add `@astrojs/sitemap` integration, generate `robots.txt` (static file in `public/`) |
| **Data layer extraction** | Create `src/data/` directory with typed data files: `navigation.ts`, `social-links.ts`, `experience.ts`, `technologies.ts`, `contact.ts`, `speaker.ts` |
| **TypeScript interfaces** | Add `src/types/` with interfaces for all component props and data structures |
| **Accessibility pass** | Skip-to-content link, `prefers-reduced-motion` media query, semantic landmark roles, ARIA labels on interactive elements |
| **Self-hosted fonts** | Replace Google Fonts CDN with `@fontsource/inter` + `@fontsource/space-grotesk` (eliminates render-blocking external requests) |

**Deliverable**: Zero broken references, single source of truth for all data, type-safe components, WCAG 2.1 AA baseline.

### 2.2 Phase 2 — Functionality (Interactions & UX)

**Goal**: Make the site feel alive with scroll-triggered animations, a proper mobile menu, and active navigation state.

| Item | Description |
|------|-------------|
| **Intersection Observer system** | Create `src/scripts/scroll-animations.ts` — generic observer that adds `.animated` class to `.animate-on-scroll` elements (the CSS already exists but the JS was never written) |
| **Mobile menu overhaul** | Add backdrop overlay, `aria-expanded` toggle, focus trap (Tab/Shift+Tab cycles within menu), Escape key closes, body scroll lock when open |
| **Active nav indicator** | Intersection Observer on sections to highlight current nav link |
| **Stats counter animation** | Animated number counters for key metrics (years of experience, projects, etc.) triggered on scroll |
| **Smooth scroll polyfill** | CSS `scroll-behavior: smooth` is set but no JS fallback — add for Safari compatibility |

**Deliverable**: Interactive, accessible navigation and scroll-driven animations with `prefers-reduced-motion` respect.

### 2.3 Phase 3 — Content (New Sections & Redesigns)

**Goal**: Add the missing Projects section, replace skill percentage bars, and add a contact form.

| Item | Description |
|------|-------------|
| **Projects section** | New `src/components/Projects.astro` — card grid with: project name, description, tech stack badges, role, impact metrics, links (live/repo). Data from `src/data/projects.ts`. Filterable by tech tag |
| **Technology badges** | Replace percentage bars (anti-pattern) with categorized badge groups showing proficiency tiers: "Expert", "Proficient", "Familiar" — no arbitrary numbers |
| **Contact form** | HTML form with Formspree/Web3Forms integration (no backend needed). Fields: name, email, message. Client-side validation, honeypot spam protection |
| **Section ordering** | Reorder to: Hero > About > Projects > Experience > Technologies > Speaker > Contact > Footer |

**Deliverable**: Portfolio tells a story of impact through real projects, technologies shown without fake percentages, functional contact form.

### 2.4 Phase 4 — Polish (Visual & Performance)

**Goal**: Elevate the visual design and optimize performance.

| Item | Description |
|------|-------------|
| **Hero redesign** | Add professional photo area (circular crop with accent ring), subtle background pattern or gradient mesh, typing effect on subtitle |
| **Scroll progress indicator** | Thin accent-colored bar at top of viewport showing page scroll progress |
| **Micro-interactions** | Button hover effects (subtle scale + shadow), card hover lifts, link underline animations |
| **Image optimization** | Add `sharp` dependency for Astro image optimization, lazy loading on all images |
| **Performance audit** | Target: <1s LCP, <100ms CLS, <100ms INP. Inline critical CSS, defer non-critical scripts |

**Deliverable**: Polished, performant site that scores 90+ across all Lighthouse categories.

## 3. Approach

### 3.1 Architectural Strategy

```
src/
├── components/         # Astro components (presentational)
│   ├── Header.astro
│   ├── Hero.astro
│   ├── Projects.astro  # NEW
│   ├── ...
│   └── ui/             # NEW — reusable primitives
│       ├── Badge.astro
│       ├── Card.astro
│       ├── SectionHeading.astro
│       └── SkipToContent.astro
├── data/               # NEW — single source of truth
│   ├── navigation.ts
│   ├── social-links.ts
│   ├── projects.ts
│   ├── experience.ts
│   ├── technologies.ts
│   ├── contact.ts
│   └── speaker.ts
├── types/              # NEW — shared interfaces
│   └── index.ts
├── scripts/            # NEW — client-side behavior
│   ├── scroll-animations.ts
│   ├── mobile-menu.ts
│   ├── active-nav.ts
│   └── contact-form.ts
├── layouts/
│   └── Layout.astro
├── pages/
│   └── index.astro
└── styles/
    └── global.css
```

### 3.2 Key Architectural Decisions

1. **Data layer extraction over hardcoded arrays**: Every component currently embeds its own data (socialLinks duplicated 3x, navLinks 2x with different items). Extract to `src/data/` so a single change propagates everywhere.

2. **UI primitives via `src/components/ui/`**: SectionHeading, Badge, Card patterns repeat across sections. Extract to composable primitives — not a design system, just DRY components.

3. **Script modules over inline scripts**: Current `<script>` tags are component-scoped and inline. Move to importable modules in `src/scripts/` for testability and reusability. Astro will bundle them correctly.

4. **No framework islands**: The site does not need React, Vue, or Svelte. Pure Astro components + vanilla TypeScript scripts. Zero JS framework overhead.

5. **Form service over backend**: Use Formspree or Web3Forms for contact form — no need for a server, API, or serverless function. HTML `action` attribute + honeypot field.

6. **Badge tiers over percentage bars**: "PHP 95%" is meaningless and invites scrutiny. "PHP — Expert" communicates the same thing without the false precision. Categories: Expert (daily driver, deep knowledge), Proficient (production experience), Familiar (working knowledge).

### 3.3 Data Deduplication Map

| Data | Currently in | Copies | Extracted to |
|------|-------------|--------|-------------|
| `socialLinks` | Hero.astro, Footer.astro, Contact.astro | 3 | `src/data/social-links.ts` |
| `navLinks` | Header.astro (5 items), Footer.astro (4 items, missing Speaker) | 2 (inconsistent) | `src/data/navigation.ts` |
| `contactMethods` | Contact.astro | 1 | `src/data/contact.ts` |
| `categories` (tech) | Technologies.astro | 1 | `src/data/technologies.ts` |

### 3.4 Dependency Additions

| Package | Purpose | Phase |
|---------|---------|-------|
| `@astrojs/sitemap` | Auto-generate sitemap.xml | 1 |
| `@fontsource/inter` | Self-hosted Inter font | 1 |
| `@fontsource/space-grotesk` | Self-hosted Space Grotesk font | 1 |
| `sharp` | Image optimization for Astro | 4 |

**NOT adding**: Three.js, GSAP, React, Vue, Svelte, any CSS-in-JS library, any animation framework. Vanilla CSS animations + Intersection Observer are sufficient.

## 4. Out of Scope

| Item | Reason |
|------|--------|
| Blog / CMS | Separate project — different information architecture, routing, content pipeline |
| Multi-language (i18n) | Single-language site (Spanish). Can be added later with `@astrojs/i18n` if needed |
| Backend / API | Static site — no server-side logic, no database, no auth |
| Analytics | Can be added independently (Plausible/Umami script tag) without architectural changes |
| Custom domain / hosting setup | Infrastructure concern, not a code change |
| Testimonials section | Requires content from third parties — can be Phase 5 if content becomes available |
| Dark mode redesign | Current dark mode works correctly. Only fixing accessibility, not redesigning colors |

## 5. External Dependencies

These items require USER INPUT before certain phases can proceed:

| Dependency | Needed for | Phase | Blocking? |
|------------|-----------|-------|-----------|
| Professional photo | Hero redesign (circular photo area) | 4 | NO — placeholder works, photo swapped later |
| Project descriptions | Projects section content | 3 | YES for Projects — need at least 3-4 project descriptions with: name, role, tech stack, impact, links |
| Formspree/Web3Forms account | Contact form endpoint | 3 | YES for contact form — need the form action URL |
| og-image design | Open Graph social preview | 1 | NO — generate placeholder, replace later |

## 6. Rollback Plan

Each phase is **independently deployable** and leaves the site in a working state.

| Phase | Rollback strategy |
|-------|------------------|
| Phase 1 | Git tag `v1.1-foundation`. Data extraction is additive — old imports still work until components are updated. Can revert entire phase with `git revert` range. |
| Phase 2 | Git tag `v1.2-functionality`. JS modules are progressive enhancement — removing them leaves a working static site. |
| Phase 3 | Git tag `v1.3-content`. New sections can be individually commented out of `index.astro`. Projects section is fully independent. |
| Phase 4 | Git tag `v1.4-polish`. Visual changes are CSS-only or image-only — easily revertible. |

**Branch strategy**: Work on `feat/landing-page-v2` branch. Each phase gets a PR to main. Tags after each merge.

## 7. Risk Matrix

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| Missing project content blocks Phase 3 | HIGH | MEDIUM | Start with placeholder projects, swap content when provided. Phase 3 can ship with placeholders. |
| Font self-hosting changes visual rendering | LOW | LOW | Fontsource packages use identical font files as Google Fonts CDN. Visual diff test before/after. |
| Intersection Observer not supported in old browsers | LOW | LOW | <1% of traffic on unsupported browsers. CSS animations still fire without JS (graceful degradation). |
| Form spam without backend validation | MEDIUM | MEDIUM | Honeypot field + Formspree/Web3Forms built-in spam filtering. No sensitive data at risk. |
| Scope creep into blog/CMS territory | HIGH | MEDIUM | Strict "out of scope" boundary. Projects section uses static data files, NOT a content collection. |
| Tailwind v4 CSS variable syntax breaks on update | MEDIUM | LOW | Pin Tailwind version. The `bg-(--var)` syntax is stable in v4.1+. |
| Lighthouse score regression during Phase 3 (new content) | MEDIUM | LOW | Run Lighthouse after each PR. Image optimization in Phase 4 recovers any regression. |

## 8. Success Criteria

- [ ] Zero broken asset references (favicons, OG image)
- [ ] sitemap.xml and robots.txt present and valid
- [ ] All data defined once, imported everywhere (zero duplication)
- [ ] TypeScript interfaces on all component props and data
- [ ] WCAG 2.1 AA: skip-to-content, prefers-reduced-motion, ARIA labels, focus management
- [ ] Mobile menu: backdrop, focus trap, Escape key, aria-expanded
- [ ] Scroll animations fire on viewport entry with reduced-motion respect
- [ ] Projects section with 3+ projects (content pending from user)
- [ ] Technology badges replace percentage bars
- [ ] Contact form functional with spam protection
- [ ] Lighthouse Performance 90+, Accessibility 90+, Best Practices 90+, SEO 90+
- [ ] All phases tagged and independently revertible

---

*This proposal covers the full v2 transformation. Next step: write specifications (sdd-spec) for Phase 1.*
