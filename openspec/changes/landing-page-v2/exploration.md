# Exploration: landing-page-v2

**Date**: 2026-04-04  
**Explorer**: SDD Sub-Agent  
**Change**: Complete redesign of devrafaseros.com personal landing page

---

## 1. Current Architecture Analysis

### Structure

```
src/
  assets/          # astro.svg, background.svg, favicon.svg
  components/      # 8 flat components (no subdirectories)
    Header.astro
    Hero.astro
    AboutMe.astro
    Experience.astro
    Technologies.astro
    Speaker.astro
    Contact.astro
    Footer.astro
  layouts/
    Layout.astro   # Single layout, handles SEO + dark mode
  pages/
    index.astro    # Single page, imports all components in order
  styles/
    global.css     # Tailwind v4 config, custom properties, animations
public/
  favicon.svg      # Only favicon asset
```

### Patterns In Use

- **Flat component model**: All 8 components live at the same level with no grouping by feature or type. Works for a small site but won't scale.
- **Data co-location**: All content data (experiences, skills, talks) is declared as inline const arrays inside each `.astro` file's frontmatter. No separation of data from presentation.
- **CSS Custom Properties bridge**: Smart pattern — Tailwind v4 `@theme` tokens defined for both light/dark, then CSS custom properties (`--bg-primary`, `--text-primary`, etc.) dynamically switch on `.dark` class. Avoids Tailwind's `dark:` prefix explosion.
- **Dark mode**: Implemented via localStorage + `window.toggleTheme()` in `Layout.astro` using `is:inline` script. Correctly avoids FOUC.
- **No TypeScript interfaces**: The `Layout.astro` has a `Props` interface — it's the ONLY component that does. All others have zero type safety on their props (though they accept none currently).
- **No Astro integrations**: Zero integrations registered in `astro.config.mjs`. No sitemap, no image optimization, no MDX.

### What's Good

1. **Tailwind v4 via Vite plugin** — modern, correct approach, not the deprecated PostCSS plugin.
2. **CSS variable theming system** — clean, maintainable, no `dark:` class explosion.
3. **Semantic HTML structure** — proper `<header>`, `<main>`, `<footer>`, `<section>` with `id` anchors.
4. **Scroll-smooth** — applied at `<html>` level, correct.
5. **Canonical URL** — properly constructed with `Astro.site`.
6. **OG tags complete** — all required Open Graph and Twitter Card meta tags present.
7. **Font preconnect** — Google Fonts loaded with `preconnect` hints.
8. **Mobile menu** — basic implementation works, closes on link click.

### What's Bad (Critical Issues)

1. **Missing assets**: `og-image.png`, `favicon-32x32.png`, `favicon-16x16.png`, `apple-touch-icon.png` are ALL referenced but don't exist in `public/`. This breaks OG previews and causes 404s.
2. **socialLinks duplicated 3 times**: Identical arrays in `Hero.astro`, `Contact.astro`, and `Footer.astro`. A single `src/data/social.ts` would fix this.
3. **navLinks duplicated 2 times**: `Header.astro` and `Footer.astro` both define the same nav array. They're not even identical (Footer is missing "Speaker").
4. **No Intersection Observer**: The `.animate-on-scroll` CSS class exists with `.animated` state, but NO JavaScript ever adds the `.animated` class. The scroll animation system is completely broken — it's dead code.
5. **No skip-to-content link**: Fails basic accessibility WCAG 2.1 AA.
6. **No `prefers-reduced-motion`**: All animations play regardless of user OS preference. Fails WCAG 2.1 AA.
7. **Mobile menu incomplete**: Toggle works but no backdrop overlay, no animation (just `hidden`/`block` toggle), no `aria-expanded` attribute update, no trap focus.
8. **No contact form**: Contact section only shows links. No way to send a message directly.
9. **No Projects section**: Biggest gap for a Tech Lead portfolio — there's no showcase of actual work.
10. **No sitemap or robots.txt**: Bad for SEO.
11. **No `<html lang>` on dark mode apply**: The `lang="es"` is correct, but `dir` attribute not set (minor).
12. **Technology section uses progress bars**: The "skill percentage" anti-pattern (who decided Laravel is "90%"?). Meaningless metric that top portfolios have abandoned.
13. **Experience data includes very thin entries**: "Soporte IT" at Dresco (3 months, "montaje de equipos") and "Practicante" at DataSoft dilute the narrative. A Tech Lead portfolio should be curated, not exhaustive.
14. **Hero is entirely text-centered**: No visual hierarchy beyond typography. No image, no animated element, no distinctive visual identity marker.

---

## 2. Design Language Analysis

### Color System

- **Accent**: `#DC2626` (red-600) — strong, bold choice. Conveys energy and confidence.
- **Light bg**: `#FFFFFF` / `#F8FAFC` / `#F1F5F9` — clean Slate scale.
- **Dark bg**: `#0F172A` / `#1E293B` / `#334155` — Slate 900/800/700. Deep, professional.
- **Text light**: `#1E293B` / `#64748B` — high contrast on white, good readability.
- **Text dark**: `#F8FAFC` / `#94A3B8` — appropriate for dark backgrounds.

The color system is **coherent and professional**. The red accent is distinctive. No gradient usage anywhere — everything is flat/solid.

### Typography

- **Headings**: Space Grotesk (500, 600, 700) — geometric, modern, tech-feel. Excellent choice.
- **Body**: Inter (400, 500, 600, 700) — industry standard for readability.
- **Scale**: `text-4xl` to `text-7xl` for hero h1. Responsive with `sm:` and `md:` breakpoints.

Good choices. Missing: no letter-spacing customization, no line-height fine-tuning beyond Tailwind defaults.

### Spacing

- **Container**: `max-w-6xl` (72rem/1152px) consistently across all sections. Good.
- **Section padding**: `py-20` uniformly (80px top/bottom). Could vary for rhythm.
- **Alternating backgrounds**: `bg-(--bg-primary)` / `bg-(--bg-secondary)` — creates visual section separation without borders. Smart.

### Animations

Current state:
- `fade-in-up` and `fade-in` keyframes defined in global.css.
- Hero elements use `animate-fade-in-up opacity-0` with inline `animation-delay` + `animation-fill-mode: forwards`.
- `.animate-on-scroll` + `.animated` pattern defined but NEVER triggered (dead code).
- Scroll indicator uses Tailwind's `animate-bounce`.

Result: Only Hero has working animations. All other sections are static.

### Component Visual Language

Consistent card pattern: `bg-(--bg-secondary) p-6 rounded-xl border border-(--border) hover:border-accent transition-colors`. This pattern repeats across Experience, Technologies, Speaker, Contact — good consistency but also a bit monotonous.

---

## 3. Competitive Analysis: What Exceptional Portfolios Do

### brittanychiang.com

- Fixed sidebar navigation (vertical, left-aligned) that highlights active section on scroll.
- Distinctive numbered sections ("01. About", "02. Experience").
- Heavy use of the teal accent color as a brand color — consistent, memorable.
- Featured Projects section with screenshots, tech stack tags, GitHub/external links.
- Project cards hover with full color overlay showing description.
- "Other Noteworthy Projects" archive grid below featured ones.
- Scroll progress indicator.
- NO progress bars for skills — skills shown as tags only.
- Sticky email + social links on left sidebar.

**Key takeaway**: The PROJECTS section is what makes this memorable, not the about/experience.

### leerob.io

- Minimal design, almost brutal in its simplicity.
- No hero section — starts immediately with content.
- Blog integration — articles are a first-class feature.
- Dark-by-default aesthetic.
- Content IS the product — writing shows expertise better than a skill bar.
- Uses Next.js ISR for dynamic data (GitHub stars, view counts).
- The personal voice in writing is the differentiator.

**Key takeaway**: Authority is demonstrated through writing and open-source contributions visible directly on the page.

### joshwcomeau.com

- Playful, interactive elements everywhere (cursor effects, toggle animations).
- Strong brand identity with distinctive illustration style.
- Color-coded syntax highlighting as a design element.
- Blog as the centerpiece — not a portfolio, a learning resource.
- Interactive code snippets embedded in pages.
- Personal photo with custom illustration overlay.

**Key takeaway**: The PERSONALITY is the product. Technical creativity shown through the site itself.

### Common Exceptional Portfolio Traits

1. **Projects showcase is mandatory** — code/screenshots/live demos.
2. **No skill percentage bars** — replaced with tech tags or written context.
3. **Scroll-triggered animations** — content reveals as you scroll, not just on load.
4. **Personal photo** — humanizes the brand, builds trust.
5. **Active section highlighting** in navigation.
6. **Reading/writing** — blog or articles demonstrate expertise beyond CVs.
7. **Open-source presence** — GitHub contribution graph or pinned repos.
8. **Testimonials** — social proof from colleagues/clients.
9. **Clear value proposition** in hero — "I build X for Y" not just "12 years experience".
10. **Dark mode as default** or as a designed experience, not an afterthought.

---

## 4. Proposed Approach

### Vision

Transform devrafaseros.com from a **static CV page** into an **interactive Tech Lead brand platform** that:
- Demonstrates technical capability through the site itself (performance, animations, code quality).
- Shows real projects with context and impact.
- Positions Rafael as a Healthtech authority, not just a developer.
- Converts visitors (recruiters, clients, conference organizers) with clear CTAs per audience segment.

### Architecture Improvements

**Data Layer Separation** (critical):
```
src/data/
  social.ts        # Single source of truth for social links
  nav.ts           # Single source of truth for nav links
  experience.ts    # Experience timeline data with TypeScript interfaces
  technologies.ts  # Tech stack data
  projects.ts      # NEW: Portfolio projects data
  talks.ts         # Speaking engagement data
  testimonials.ts  # NEW: Testimonials data
```

**Component Organization**:
```
src/components/
  layout/          # Header, Footer, Navigation
  sections/        # Hero, About, Experience, Projects, Technologies, Speaker, Contact
  ui/              # Button, Card, Badge, Tag, SectionHeader
  animations/      # ScrollReveal, FadeIn (Astro component wrappers)
```

**TypeScript Interfaces** for all data shapes:
```typescript
interface SocialLink { name: string; href: string; icon: string; }
interface NavLink { href: string; label: string; }
interface Experience { title: string; company: string; period: string; current: boolean; achievements: string[]; tech: string[]; }
interface Project { title: string; description: string; tech: string[]; github?: string; demo?: string; image?: string; featured: boolean; }
```

### New Sections

1. **Projects** (highest priority): 2-3 featured projects (Autoagendamiento tótem, Insurance integrations system, etc.) with:
   - Project card with tech stack badges.
   - Impact metrics ("Reduced patient wait time by X%").
   - GitHub link if public, or "Private / Enterprise" badge.
   - Screenshot or visual representation.

2. **Testimonials** (medium priority): 2-3 quotes from colleagues, managers, or conference attendees. Social proof is underused in LatAm portfolios.

3. **Blog/Articles** (future): Could link to external content (Medium, dev.to, LinkedIn articles). Astro's Content Collections are built for this.

### Interaction Improvements

**Intersection Observer System** (fix existing dead code):
```typescript
// src/scripts/scroll-animations.ts
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      observer.unobserve(entry.target); // once is enough
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
```

**Active Nav Highlighting**: Use Intersection Observer on sections to update active nav link as user scrolls.

**Mobile Menu**: Add backdrop overlay, smooth slide-in animation (`transform translate-x`), `aria-expanded` attribute, focus trap.

**`prefers-reduced-motion`** respect:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Skip-to-content**:
```html
<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] bg-accent text-white px-4 py-2 rounded">
  Saltar al contenido
</a>
```

### Visual Identity Upgrades

1. **Hero redesign**: Move from center-aligned text block to asymmetric layout:
   - Left: Name, title, description, CTAs.
   - Right: Photo with subtle gradient overlay, or an animated SVG avatar.
   - Background: Subtle grid or noise texture (CSS-only, no images).
   - The red accent used as an underline/highlight element on "Healthtech".

2. **Gradient accents**: Add subtle red-to-transparent gradients as decorative elements (not backgrounds). Think `radial-gradient` behind the hero or section dividers.

3. **Replace progress bars**: Technology section should use icon+badge cards grouped by category, not percentage bars. Much more honest and visually richer.

4. **Micro-interactions**:
   - Nav links: Underline animation (width: 0% to 100% on hover).
   - Cards: Subtle `translateY(-2px)` lift on hover (already has border-accent, add transform).
   - Scroll indicator: Replace the static SVG with a proper animated scroll-progress bar at top of page.

5. **Stats counter animation**: The 4 highlight stats in AboutMe (`12+`, `7`, `5`, `4`) should count up when they scroll into view.

### SEO & Performance

1. **`@astrojs/sitemap`**: Add and configure. One-line install.
2. **`sharp`**: Add for Astro image optimization (needed for `<Image>` component).
3. **`robots.txt`**: Create in `public/`.
4. **`og-image.png`**: Generate (can be HTML/CSS rendered to PNG, or a static design). Dimensions: 1200x630px.
5. **Favicon PNGs**: Generate from the existing `favicon.svg`.
6. **`<meta name="theme-color">`**: Add for mobile browser UI theming.
7. **Font loading optimization**: Switch from Google Fonts `<link>` to `@fontsource` packages (self-hosted, eliminates external network request).
8. **`astro check`** in CI: Currently not enforced. Add as a pre-commit or GitHub Action.

### Contact Form

Add a real contact form using:
- **Option A (Netlify Forms)**: Zero backend, works on Netlify deploy. Add `netlify` attribute to `<form>`.
- **Option B (Formspree/Formspark)**: API-based, works anywhere, free tier available.
- **Option C (custom endpoint)**: Only if deploying to a server with PHP/Node backend.

Recommendation: **Formspree** (Option B) — works with any hosting, no vendor lock-in, 50 submissions/month free.

---

## 5. Technology Additions

### Must-Have Additions

| Package | Purpose | Priority |
|---------|---------|---------|
| `@astrojs/sitemap` | Auto-generate sitemap.xml | HIGH |
| `sharp` | Image optimization for `<Image>` component | HIGH |
| `@fontsource/inter` + `@fontsource/space-grotesk` | Self-hosted fonts, eliminate Google Fonts RTT | MEDIUM |

### Recommended Additions

| Package | Purpose | Priority |
|---------|---------|---------|
| `motion` (Motion One / Framer Motion for web) | Production-ready animation library | MEDIUM |
| `astro-icon` | SVG icon system (replaces inline SVG strings) | MEDIUM |
| `@astrojs/check` (already in Astro CLI) | Type checking pipeline | LOW |

### Optional / Future

| Package | Purpose | Priority |
|---------|---------|---------|
| `@astrojs/mdx` | Blog/articles via MDX | LOW (future) |
| `astro-seo` | SEO utilities component | LOW (already implemented manually) |

### NOT Recommended

- **Three.js / WebGL**: Overkill for this site. Performance cost not justified. The complexity signal is "I like demos", not "I build production software".
- **GSAP**: Heavy for this use case. Motion One (3kb) or pure CSS + Intersection Observer sufficient.
- **React/Vue islands**: No interactive components that justify a framework. Astro's native interactivity is enough.
- **Lottie animations**: JSON animations are heavy. CSS keyframes or SVG animations are lighter.

---

## 6. Risk Assessment

### Approach A: Incremental Fix (Low Risk)

Fix all current issues without redesigning:
- Fix missing assets (og-image, favicons).
- Extract data to `src/data/`.
- Add TypeScript interfaces.
- Fix Intersection Observer.
- Add skip-to-content, prefers-reduced-motion.
- Fix mobile menu.
- Add sitemap, robots.txt.

**Risk**: LOW. No visual regression. Existing functionality preserved.  
**Impact**: MEDIUM. Site goes from broken to correct, but not exceptional.  
**Effort**: 1-2 days.

### Approach B: Visual Redesign + New Sections (Medium Risk)

Everything in A, plus:
- New Projects section.
- Hero redesign (asymmetric layout, photo or visual element).
- Replace skill bars with tech badges.
- Add contact form.
- Scroll animations working.
- Stats counter animation.
- Active nav highlighting.

**Risk**: MEDIUM. Hero redesign can break visual identity if not executed carefully. Photo needs to be available and properly sized.  
**Impact**: HIGH. This is the portfolio that wins interviews and conference slots.  
**Effort**: 3-5 days.

### Approach C: Full Rebrand (High Risk)

Everything in B, plus:
- New typography/color system.
- Self-hosted fonts (eliminating Google Fonts).
- Testimonials section.
- Blog integration.
- Custom OG image generation.
- Animation library integration.

**Risk**: HIGH. Color/typography changes can derail the identity if not carefully designed. Blog requires content strategy, not just code.  
**Impact**: EXCEPTIONAL. Top 1% personal sites.  
**Effort**: 1-2 weeks.

### Specific Risks to Watch

1. **Photo unavailability**: The asymmetric hero requires a good photo. Without it, the layout needs a fallback visual.
2. **Progress bar removal political risk**: The user may feel attached to the skills bars. Technically the right call, but requires buy-in.
3. **Contact form spam**: Any public form needs honeypot or rate limiting. Formspree handles this.
4. **Tailwind v4 gotchas**: v4 is still relatively new. The `bg-(--var)` syntax for CSS custom properties in Tailwind classes is v4-specific. Not all community resources/plugins target v4 yet.
5. **Font self-hosting complexity**: `@fontsource` packages are simple but need CSS import changes. Low risk but easy to get wrong.

---

## 7. Recommended Priority Order

Based on impact-to-effort ratio:

### Phase 1: Foundation (non-negotiable fixes)
1. Generate and add `og-image.png`, favicon PNGs, `apple-touch-icon.png`
2. Create `robots.txt`
3. Add `@astrojs/sitemap` integration
4. Extract data to `src/data/` (social.ts, nav.ts, experience.ts, technologies.ts, talks.ts)
5. Add TypeScript interfaces for all data
6. Add `skip-to-content` link
7. Add `prefers-reduced-motion` CSS

### Phase 2: Functionality (fix what's broken)
1. Fix Intersection Observer scroll animation system
2. Fix mobile menu (backdrop, aria-expanded, animation)
3. Add active nav section highlighting on scroll
4. Add stats counter animation for AboutMe highlights
5. Add `sharp` for image optimization

### Phase 3: Content & Conversion (new value)
1. Create Projects section with 2-3 featured projects
2. Replace technology progress bars with badge/tag cards
3. Add contact form (Formspree)
4. Add testimonials (2-3 if available)

### Phase 4: Polish (exceptional)
1. Hero visual redesign (photo + asymmetric layout)
2. Scroll progress indicator
3. Self-hosted fonts migration
4. Nav micro-interactions (underline animation)
5. Card hover transforms (translateY lift)
6. Gradient accent decorations

---

## 8. Summary

The current v1 is a **solid structural foundation with critical execution gaps**. The architecture decisions (Tailwind v4, Space Grotesk + Inter, CSS variable theming, Astro) are correct. The content is real and substantial.

What kills it:
- **Missing assets** (404s on OG image and favicons) — embarrassing for a developer portfolio.
- **Zero scroll animations** despite the infrastructure being there.
- **No Projects section** — the biggest content gap for a Tech Lead brand.
- **Data duplication** across components — maintenance nightmare.

The path to exceptional isn't a full rewrite — it's **fixing what's broken + adding what's missing**. The visual identity (red, dark Slate, Space Grotesk) is actually good. The structure is clean. The content is real. This site is 60% of the way to excellent, just needs the other 40% executed properly.
