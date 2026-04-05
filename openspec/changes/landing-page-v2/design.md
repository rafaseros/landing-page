# Technical Design: landing-page-v2

**Change**: landing-page-v2  
**Author**: SDD Design Agent  
**Date**: 2026-04-04  
**Status**: DRAFT

---

## 1. Component Architecture

### 1.1 Directory Structure

```
src/
  components/
    layout/                    # Structural components (page skeleton)
      Header.astro             # Sticky nav, theme toggle, mobile menu
      Footer.astro             # Site footer with nav, social, copyright
      Navigation.astro         # Desktop nav links (extracted from Header)
      MobileMenu.astro         # Mobile slide menu with backdrop + focus trap
      SkipToContent.astro      # Accessibility skip link
    sections/                  # Page sections (content blocks)
      Hero.astro               # Hero with CTA, social links, scroll indicator
      AboutMe.astro            # Bio + stats grid
      Projects.astro           # Project cards grid with optional filtering
      Experience.astro         # Timeline
      Technologies.astro       # Badge-based tech grid (replaces percentage bars)
      Speaker.astro            # Talks + interests
      Contact.astro            # Contact methods + form
    ui/                        # Reusable presentational primitives
      Button.astro             # Primary/secondary/ghost variants
      Badge.astro              # Tech badge, status badge, proficiency badge
      Card.astro               # Generic card container with hover effect
      SectionTitle.astro       # "Subtitle + H2" pattern used in every section
      SocialLinks.astro        # Renders SocialLink[] as icon buttons
      ProjectCard.astro        # Single project card
      StatCard.astro           # Single stat (number + label) with counter animation
  data/
    types.ts                   # ALL shared TypeScript interfaces (barrel)
    social-links.ts            # SocialLink[]
    nav-links.ts               # NavLink[]
    experience.ts              # Experience[]
    technologies.ts            # TechnologyCategory[]
    projects.ts                # Project[]
    talks.ts                   # Talk[] + interests string[]
    site.ts                    # SiteMetadata (title, description, author, etc.)
    contact.ts                 # ContactMethod[]
  layouts/
    Layout.astro               # HTML shell: self-hosted fonts, skip-to-content, JSON-LD, meta
  styles/
    global.css                 # Tailwind v4 @theme, CSS custom properties, keyframes, prefers-reduced-motion
  scripts/
    scroll-animations.ts       # Intersection Observer for .animate-on-scroll
    active-nav.ts              # Intersection Observer for nav highlighting
    mobile-menu.ts             # Menu state, backdrop, focus trap, Escape key, body scroll lock
    contact-form.ts            # Client-side validation + submission handling
    counter.ts                 # Animated number counter (stats)
  pages/
    index.astro                # Page composition only — imports Layout + sections
```

### 1.2 Layer Rationale

**Why `layout/` vs `sections/` vs `ui/`?**

This is a simplified atomic design hierarchy adapted for Astro (no atoms/molecules/organisms naming — those terms are meaningless to someone scanning a directory tree):

- **`layout/`** = Structural components that define the page skeleton. They appear once per page and handle positioning, navigation, and accessibility landmarks. A developer looking for "where does the header live?" goes here.
- **`sections/`** = Content blocks that compose the page. Each maps 1:1 to a visible section of the landing page. A developer looking for "where is the experience timeline?" goes here.
- **`ui/`** = Reusable presentational components that have no business logic or data. They receive props and render. A developer building a new section reaches for these. They follow the container-presentational pattern: sections are containers (fetch data, orchestrate), ui components are presentational (render props).

**Why NOT a deeper nesting?**

The site has ~15 components. Two levels of nesting (`components/category/Component.astro`) is sufficient. Three or more levels creates navigation friction for a project this size. If the project grows to 50+ components, revisit.

**Why `data/` instead of Astro Content Collections?**

See ADR-004. Short version: Content Collections add a build step, schema validation layer, and querying API that are overkill for 6 static arrays. TypeScript interfaces provide compile-time type safety without the runtime overhead.

**Why `scripts/` instead of inline `<script>` tags?**

Current inline scripts in Header.astro are untestable, unreusable, and invisible to import graphs. Extracting to `scripts/` modules means:
1. Astro bundles them automatically via Vite
2. Multiple components can import the same behavior
3. Tree-shaking eliminates unused code
4. TypeScript catches errors at compile time

---

## 2. TypeScript Interfaces

```typescript
// src/data/types.ts

/** Social media or contact link displayed as an icon button */
export interface SocialLink {
  /** Display name — used as aria-label for accessibility */
  name: string;
  /** Full URL, mailto:, or tel: href */
  href: string;
  /** Inline SVG markup string */
  icon: string;
}

/** Navigation link pointing to a page section */
export interface NavLink {
  /** Anchor href — must start with # and match a section id */
  href: string;
  /** Visible link text */
  label: string;
}

/** Single technology within a category */
export interface Technology {
  /** Technology display name, e.g. "Laravel" */
  name: string;
  /** Proficiency tier — replaces numeric percentage */
  level: 'Expert' | 'Proficient' | 'Familiar';
  /** Optional SVG icon markup or icon identifier */
  icon?: string;
}

/** Group of related technologies */
export interface TechnologyCategory {
  /** Category display name, e.g. "Backend" */
  name: string;
  /** Icon for the category header (optional SVG markup) */
  icon?: string;
  /** Technologies within this category */
  techs: Technology[];
}

/** Single job in the experience timeline */
export interface Experience {
  /** Job title, e.g. "Lider de Desarrollo" */
  title: string;
  /** Company name */
  company: string;
  /** City + country, e.g. "Santa Cruz, Bolivia" */
  location: string;
  /** Human-readable period, e.g. "Dic 2020 - Presente" */
  period: string;
  /** Whether this is the current active position */
  isCurrent: boolean;
  /** Short role description (1-2 sentences) */
  description: string;
  /** Key achievements as bullet points */
  achievements: string[];
  /** Technology/tool tags used in this role */
  tags: string[];
}

/** Portfolio project */
export interface Project {
  /** Project display title */
  title: string;
  /** Short summary (1-2 sentences max) */
  summary: string;
  /** Detailed description for expanded view (optional) */
  description?: string;
  /** Technology tags displayed as badges */
  tags: string[];
  /** Role in the project, e.g. "Tech Lead", "Solo Developer" */
  role: string;
  /** Quantifiable impact, e.g. "Redujo tiempo de admision en 60%" */
  impact?: string;
  /** Live project URL */
  liveUrl?: string;
  /** Source code repository URL */
  repoUrl?: string;
  /** Path to project screenshot/thumbnail (relative to src/assets/) */
  image?: string;
  /** Whether this project appears in the featured grid (larger card) */
  featured: boolean;
}

/** Conference talk or presentation */
export interface Talk {
  /** Talk title */
  title: string;
  /** Event or conference name */
  event: string;
  /** Year of delivery as string for display flexibility */
  year: string;
  /** Talk description or abstract */
  description: string;
  /** Topic tags */
  topics: string[];
  /** Recording, slides, or event URL */
  url?: string;
}

/** Contact method displayed as a card */
export interface ContactMethod {
  /** Method name, e.g. "Email", "LinkedIn" */
  name: string;
  /** Display value, e.g. "devrafaseros@gmail.com" */
  value: string;
  /** Full href (mailto:, https://, tel:) */
  href: string;
  /** Inline SVG icon markup */
  icon: string;
}

/** Site-wide metadata used in Layout.astro */
export interface SiteMetadata {
  /** Default page title */
  title: string;
  /** Default meta description */
  description: string;
  /** Author name */
  author: string;
  /** Site canonical base URL */
  url: string;
  /** Default OG image path (relative to public/) */
  ogImage: string;
  /** Site language */
  lang: string;
  /** Site locale for OG tags */
  locale: string;
  /** SEO keywords */
  keywords: string[];
}

/** Stat/highlight metric displayed in AboutMe */
export interface Highlight {
  /** The number or value to display, e.g. "12+" */
  value: string;
  /** The numeric part for counter animation, e.g. 12 */
  numericValue: number;
  /** Whether to show "+" suffix after animation */
  hasSuffix: boolean;
  /** Description label */
  label: string;
}
```

### 2.1 Type Design Decisions

- **`Technology.level` as union type**: Prevents arbitrary strings. The three tiers ("Expert", "Proficient", "Familiar") map to visual badge variants via a CSS class lookup.
- **`Experience.description` as `string` (not `string[]`)**: The current codebase uses a single description string per experience. Achievements are a separate array. This matches the existing data shape and avoids a breaking change.
- **`Talk.year` as `string`**: Keeps the existing data shape. The current code uses `"2025"` as a string. No need to force `number` when it is only displayed, never computed.
- **`Highlight.numericValue` + `hasSuffix`**: Separating the numeric value from the display format allows the counter animation script to animate from 0 to `numericValue`, then append "+" if `hasSuffix` is true.
- **`Project.role`**: Required field — every project should state the developer's role. This is what differentiates a portfolio from a link dump.

---

## 3. Animation System Design

### 3.1 Intersection Observer for Scroll Animations

```typescript
// src/scripts/scroll-animations.ts

/**
 * Initializes scroll-triggered animations using IntersectionObserver.
 * Elements with class .animate-on-scroll receive .animated when visible.
 * Respects prefers-reduced-motion.
 */
export function initScrollAnimations(): void {
  // Bail out if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Make all elements immediately visible without animation
    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      el.classList.add('no-motion');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target); // animate once, then stop observing
        }
      });
    },
    {
      threshold: 0.1,     // trigger when 10% of element is visible
      rootMargin: '0px 0px -50px 0px', // slight offset from bottom
    }
  );

  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el);
  });
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
  initScrollAnimations();
}
```

### 3.2 CSS Animation Classes

Added to `global.css`:

```css
/* ===== Scroll Animation Base ===== */
.animate-on-scroll {
  opacity: 0;
  will-change: opacity, transform;
}

.animate-on-scroll.animated {
  animation-duration: 0.6s;
  animation-timing-function: ease-out;
  animation-fill-mode: forwards;
}

/* Variant: Fade in from below (default) */
.animate-on-scroll.animated,
.animate-on-scroll.fade-in-up.animated {
  animation-name: fade-in-up;
}

/* Variant: Fade in from left */
.animate-on-scroll.fade-in-left.animated {
  animation-name: fade-in-left;
}

/* Variant: Fade in from right */
.animate-on-scroll.fade-in-right.animated {
  animation-name: fade-in-right;
}

/* Variant: Scale in from center */
.animate-on-scroll.scale-in.animated {
  animation-name: scale-in;
}

/* ===== Stagger Delays for Lists ===== */
.stagger-1 { animation-delay: 100ms; }
.stagger-2 { animation-delay: 200ms; }
.stagger-3 { animation-delay: 300ms; }
.stagger-4 { animation-delay: 400ms; }
.stagger-5 { animation-delay: 500ms; }
.stagger-6 { animation-delay: 600ms; }
.stagger-7 { animation-delay: 700ms; }
.stagger-8 { animation-delay: 800ms; }

/* ===== Keyframes ===== */
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in-left {
  from { opacity: 0; transform: translateX(-20px); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes fade-in-right {
  from { opacity: 0; transform: translateX(20px); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes scale-in {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}

/* ===== Reduced Motion ===== */
@media (prefers-reduced-motion: reduce) {
  .animate-on-scroll,
  .animate-on-scroll.animated,
  .animate-fade-in-up,
  .animate-fade-in {
    animation: none !important;
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
  
  .animate-on-scroll.no-motion {
    opacity: 1;
    transform: none;
  }
}
```

### 3.3 Stats Counter Animation

```typescript
// src/scripts/counter.ts

/**
 * Animates a number from 0 to target value using requestAnimationFrame.
 * Triggered by IntersectionObserver on elements with [data-counter-target].
 */
export function initCounters(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Show final values immediately
    document.querySelectorAll<HTMLElement>('[data-counter-target]').forEach((el) => {
      const target = parseInt(el.dataset.counterTarget!, 10);
      const suffix = el.dataset.counterSuffix ?? '';
      el.textContent = `${target}${suffix}`;
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          animateCounter(el);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('[data-counter-target]').forEach((el) => {
    observer.observe(el);
  });
}

function animateCounter(el: HTMLElement): void {
  const target = parseInt(el.dataset.counterTarget!, 10);
  const suffix = el.dataset.counterSuffix ?? '';
  const duration = 1500; // ms
  const start = performance.now();

  function update(now: number): void {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic for deceleration effect
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = `${current}${suffix}`;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}
```

Usage in StatCard.astro:
```html
<p
  class="font-heading text-4xl font-bold text-accent"
  data-counter-target={highlight.numericValue}
  data-counter-suffix={highlight.hasSuffix ? '+' : ''}
>
  0
</p>
```

### 3.4 Prefers-Reduced-Motion Strategy (Two-Layer)

1. **CSS layer** (defensive): The `@media (prefers-reduced-motion: reduce)` block in `global.css` kills ALL animations and transitions with `!important`. This works even if JS fails.
2. **JS layer** (proactive): Each script (`scroll-animations.ts`, `counter.ts`) checks `window.matchMedia('(prefers-reduced-motion: reduce)')` at initialization and either skips setup entirely or shows final states immediately.

This double defense ensures: if CSS is loaded but JS fails, animations are disabled. If JS runs but somehow CSS is not applied, JS still respects the preference.

---

## 4. Navigation System Design

### 4.1 Active Section Highlighting

A SEPARATE Intersection Observer instance from the animation one (different thresholds, different behavior):

```typescript
// src/scripts/active-nav.ts

export function initActiveNav(): void {
  const sections = document.querySelectorAll<HTMLElement>('section[id]');
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('nav a[href^="#"]');

  if (sections.length === 0 || navLinks.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const isActive = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('text-accent', isActive);
            link.classList.toggle('text-(--text-secondary)', !isActive);
            // Update aria-current for screen readers
            if (isActive) {
              link.setAttribute('aria-current', 'true');
            } else {
              link.removeAttribute('aria-current');
            }
          });
        }
      });
    },
    {
      // Large negative bottom margin means the section must be
      // well into the viewport before it "activates"
      rootMargin: '-80px 0px -60% 0px',
      threshold: 0,
    }
  );

  sections.forEach((section) => observer.observe(section));
}
```

**Why `-80px` top margin?** The sticky header is 64px tall (h-16). The 80px offset accounts for the header plus a small buffer, so a section is "active" when its top edge clears the header.

**Why `-60%` bottom margin?** This means only the top 40% of the viewport counts. A section becomes active when it occupies the top portion of the screen, which matches user perception of "I'm reading this section."

### 4.2 Mobile Menu Architecture

```typescript
// src/scripts/mobile-menu.ts

interface MobileMenuElements {
  button: HTMLButtonElement;
  menu: HTMLElement;
  backdrop: HTMLElement;
  links: NodeListOf<HTMLAnchorElement>;
  focusableElements: HTMLElement[];
}

export function initMobileMenu(): void {
  const button = document.getElementById('mobile-menu-button') as HTMLButtonElement | null;
  const menu = document.getElementById('mobile-menu') as HTMLElement | null;
  const backdrop = document.getElementById('mobile-menu-backdrop') as HTMLElement | null;
  
  if (!button || !menu || !backdrop) return;

  const links = menu.querySelectorAll<HTMLAnchorElement>('a');
  const focusableElements = [
    button,
    ...Array.from(links),
  ] as HTMLElement[];

  let isOpen = false;

  function open(): void {
    isOpen = true;
    menu!.classList.remove('hidden');
    backdrop!.classList.remove('hidden');
    button!.setAttribute('aria-expanded', 'true');
    button!.setAttribute('aria-label', 'Cerrar menu');
    document.body.style.overflow = 'hidden'; // lock scroll
    // Focus first link for keyboard users
    links[0]?.focus();
  }

  function close(): void {
    isOpen = false;
    menu!.classList.add('hidden');
    backdrop!.classList.add('hidden');
    button!.setAttribute('aria-expanded', 'false');
    button!.setAttribute('aria-label', 'Abrir menu');
    document.body.style.overflow = ''; // unlock scroll
    button!.focus(); // return focus to trigger
  }

  function toggle(): void {
    isOpen ? close() : open();
  }

  // Focus trap: Tab/Shift+Tab cycles within menu
  function handleKeydown(e: KeyboardEvent): void {
    if (!isOpen) return;

    if (e.key === 'Escape') {
      close();
      return;
    }

    if (e.key === 'Tab') {
      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  // Event listeners
  button.addEventListener('click', toggle);
  backdrop.addEventListener('click', close);
  links.forEach((link) => link.addEventListener('click', close));
  document.addEventListener('keydown', handleKeydown);
}
```

### 4.3 Mobile Menu HTML Structure (in Header.astro)

```html
<!-- Backdrop (sibling of nav, inside header) -->
<div
  id="mobile-menu-backdrop"
  class="hidden fixed inset-0 bg-black/50 z-40 md:hidden"
  aria-hidden="true"
></div>

<!-- Mobile Menu -->
<div
  id="mobile-menu"
  class="hidden fixed top-16 left-0 right-0 z-50 md:hidden bg-(--bg-primary) border-b border-(--border) shadow-lg"
  role="navigation"
  aria-label="Menu principal mobile"
>
  <div class="flex flex-col gap-2 p-4">
    {navLinks.map((link) => (
      <a href={link.href} class="...">
        {link.label}
      </a>
    ))}
  </div>
</div>
```

**Key ARIA attributes on the toggle button:**
- `aria-expanded="false"` (toggled to `"true"` when open)
- `aria-controls="mobile-menu"`
- `aria-label="Abrir menu"` (toggled to `"Cerrar menu"` when open)

### 4.4 Smooth Scroll with Header Offset

CSS `scroll-behavior: smooth` is already set on `<html>`. For the header offset, use `scroll-margin-top` on sections:

```css
/* In global.css */
section[id] {
  scroll-margin-top: 5rem; /* 80px = header height (64px) + 16px buffer */
}
```

This is a pure CSS solution. No JS needed for scroll offset. The `scroll-margin-top` property tells the browser to stop scrolling early so the section heading is not hidden behind the sticky header.

---

## 5. Projects Section Architecture

### 5.1 ProjectCard Component

```astro
---
// src/components/ui/ProjectCard.astro
import type { Project } from '../../data/types';
import Badge from './Badge.astro';

interface Props {
  project: Project;
  featured?: boolean;
}

const { project, featured = false } = Astro.props;
---

<article class:list={[
  'bg-(--bg-secondary) rounded-xl border border-(--border) hover:border-accent transition-colors overflow-hidden group',
  featured && 'lg:col-span-2' // featured cards span 2 columns
]}>
  {project.image && (
    <div class="aspect-video overflow-hidden">
      <img
        src={project.image}
        alt={`Screenshot de ${project.title}`}
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
    </div>
  )}
  
  <div class="p-6">
    <!-- Role badge -->
    <span class="text-xs font-medium text-accent">{project.role}</span>
    
    <!-- Title -->
    <h3 class="font-heading text-xl font-bold text-(--text-primary) mt-1 mb-2">
      {project.title}
    </h3>
    
    <!-- Summary -->
    <p class="font-body text-(--text-secondary) text-sm mb-4">
      {project.summary}
    </p>
    
    <!-- Impact metric (if present) -->
    {project.impact && (
      <div class="flex items-center gap-2 mb-4 p-3 bg-accent/5 rounded-lg border border-accent/10">
        <svg class="w-4 h-4 text-accent shrink-0" ...><!-- chart icon --></svg>
        <p class="font-body text-sm text-(--text-primary) font-medium">{project.impact}</p>
      </div>
    )}
    
    <!-- Tech tags -->
    <div class="flex flex-wrap gap-2 mb-4">
      {project.tags.map((tag) => (
        <Badge text={tag} variant="outline" />
      ))}
    </div>
    
    <!-- Links -->
    <div class="flex gap-3">
      {project.liveUrl && (
        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" class="...">
          Ver proyecto
        </a>
      )}
      {project.repoUrl && (
        <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" class="...">
          Codigo fuente
        </a>
      )}
    </div>
  </div>
</article>
```

### 5.2 Grid Layout Strategy

**Layout**: Responsive CSS grid with featured project support.

```css
/* Projects grid */
.projects-grid {
  display: grid;
  grid-template-columns: 1fr;  /* Mobile: 1 column */
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);  /* Tablet: 2 columns */
  }
}

@media (min-width: 1024px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);  /* Desktop: 2 columns (wider cards) */
  }
}
```

**Why 2 columns max, not 3?** Project cards contain substantial text (summary, impact metric, tags, links). At 3 columns on desktop the cards become too narrow to read comfortably. 2 columns with `featured` spanning both gives a magazine-style layout.

Featured projects use `lg:col-span-2` to span the full width, creating visual hierarchy: the first 1-2 projects are featured (full width), the rest are in the 2-column grid below.

### 5.3 Data Structure

```typescript
// src/data/projects.ts
import type { Project } from './types';

export const projects: Project[] = [
  {
    title: 'Sistema de Autoagendamiento',
    summary: 'Totem interactivo que permite a los pacientes gestionar citas medicas de forma autonoma, reduciendo tiempos de espera y carga administrativa.',
    tags: ['Laravel', 'PHP', 'MySQL', 'API REST'],
    role: 'Tech Lead',
    impact: 'Redujo tiempo de agendamiento de 15min a 2min por paciente',
    featured: true,
  },
  {
    title: 'Integracion con Aseguradoras',
    summary: 'Plataforma de validacion en tiempo real con aseguradoras Alianza y Bisa para autorizacion de cobertura medica.',
    tags: ['Laravel', 'API REST', 'B2B Integration'],
    role: 'Tech Lead',
    impact: 'Automatizo el 90% de validaciones que se hacian manualmente',
    featured: true,
  },
  // ... user provides remaining projects
];
```

---

## 6. Contact Form Architecture

### 6.1 Form Service: Web3Forms

**Choice**: Web3Forms over Formspree.

**Why**: Web3Forms has a generous free tier (250 submissions/month), no login required for the visitor, AJAX submission support, built-in spam filtering, and works as a simple `POST` to their endpoint. No account signup needed for visitors.

### 6.2 HTML Form Structure

```html
<form
  id="contact-form"
  action="https://api.web3forms.com/submit"
  method="POST"
  class="space-y-6"
  novalidate
>
  <!-- Access key (public, not a secret) -->
  <input type="hidden" name="access_key" value="{USER_PROVIDES_KEY}" />
  
  <!-- Honeypot (hidden from real users, bots fill it) -->
  <div class="hidden" aria-hidden="true">
    <label for="botcheck">Do not fill this</label>
    <input type="checkbox" id="botcheck" name="botcheck" />
  </div>
  
  <!-- Subject line for email -->
  <input type="hidden" name="subject" value="Nuevo mensaje desde devrafaseros.com" />
  
  <!-- Name -->
  <div>
    <label for="name" class="block font-body text-sm font-medium text-(--text-primary) mb-2">
      Nombre <span class="text-accent" aria-hidden="true">*</span>
    </label>
    <input
      type="text"
      id="name"
      name="name"
      required
      minlength="2"
      autocomplete="name"
      class="w-full px-4 py-3 bg-(--bg-primary) border border-(--border) rounded-lg font-body text-(--text-primary) focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
      aria-describedby="name-error"
    />
    <p id="name-error" class="hidden mt-1 text-sm text-red-500 font-body" role="alert"></p>
  </div>
  
  <!-- Email -->
  <div>
    <label for="email" class="block font-body text-sm font-medium text-(--text-primary) mb-2">
      Email <span class="text-accent" aria-hidden="true">*</span>
    </label>
    <input
      type="email"
      id="email"
      name="email"
      required
      autocomplete="email"
      class="..."
      aria-describedby="email-error"
    />
    <p id="email-error" class="hidden mt-1 text-sm text-red-500 font-body" role="alert"></p>
  </div>
  
  <!-- Message -->
  <div>
    <label for="message" class="block font-body text-sm font-medium text-(--text-primary) mb-2">
      Mensaje <span class="text-accent" aria-hidden="true">*</span>
    </label>
    <textarea
      id="message"
      name="message"
      required
      minlength="10"
      rows="5"
      class="..."
      aria-describedby="message-error"
    ></textarea>
    <p id="message-error" class="hidden mt-1 text-sm text-red-500 font-body" role="alert"></p>
  </div>
  
  <!-- Submit -->
  <button
    type="submit"
    class="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white font-body font-semibold px-8 py-4 rounded-lg transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <span id="submit-text">Enviar mensaje</span>
    <span id="submit-loading" class="hidden">Enviando...</span>
  </button>
  
  <!-- Status messages -->
  <div id="form-status" class="hidden" role="status" aria-live="polite"></div>
</form>
```

### 6.3 Client-Side Validation

```typescript
// src/scripts/contact-form.ts

interface ValidationRule {
  field: HTMLInputElement | HTMLTextAreaElement;
  errorEl: HTMLElement;
  validate: () => string | null; // returns error message or null
}

export function initContactForm(): void {
  const form = document.getElementById('contact-form') as HTMLFormElement | null;
  if (!form) return;

  const fields: ValidationRule[] = [
    {
      field: form.querySelector('#name')!,
      errorEl: form.querySelector('#name-error')!,
      validate() {
        const val = this.field.value.trim();
        if (!val) return 'El nombre es requerido';
        if (val.length < 2) return 'El nombre debe tener al menos 2 caracteres';
        return null;
      },
    },
    {
      field: form.querySelector('#email')!,
      errorEl: form.querySelector('#email-error')!,
      validate() {
        const val = this.field.value.trim();
        if (!val) return 'El email es requerido';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Ingresa un email valido';
        return null;
      },
    },
    {
      field: form.querySelector('#message')!,
      errorEl: form.querySelector('#message-error')!,
      validate() {
        const val = this.field.value.trim();
        if (!val) return 'El mensaje es requerido';
        if (val.length < 10) return 'El mensaje debe tener al menos 10 caracteres';
        return null;
      },
    },
  ];

  // Validate on blur for immediate feedback
  fields.forEach((rule) => {
    rule.field.addEventListener('blur', () => validateField(rule));
    // Clear error on input
    rule.field.addEventListener('input', () => clearError(rule));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    let hasErrors = false;
    fields.forEach((rule) => {
      if (validateField(rule)) hasErrors = true;
    });
    if (hasErrors) return;

    // Submit via fetch (AJAX)
    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    const submitText = form.querySelector('#submit-text') as HTMLElement;
    const submitLoading = form.querySelector('#submit-loading') as HTMLElement;
    const statusEl = form.querySelector('#form-status') as HTMLElement;

    submitBtn.disabled = true;
    submitText.classList.add('hidden');
    submitLoading.classList.remove('hidden');

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
      });

      if (response.ok) {
        statusEl.className = 'mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600 font-body text-sm';
        statusEl.textContent = 'Mensaje enviado correctamente. Te respondere pronto.';
        statusEl.classList.remove('hidden');
        form.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch {
      statusEl.className = 'mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 font-body text-sm';
      statusEl.textContent = 'Hubo un error al enviar el mensaje. Intenta de nuevo o contactame directamente por email.';
      statusEl.classList.remove('hidden');
    } finally {
      submitBtn.disabled = false;
      submitText.classList.remove('hidden');
      submitLoading.classList.add('hidden');
    }
  });
}

function validateField(rule: ValidationRule): boolean {
  const error = rule.validate();
  if (error) {
    rule.errorEl.textContent = error;
    rule.errorEl.classList.remove('hidden');
    rule.field.classList.add('border-red-500');
    rule.field.setAttribute('aria-invalid', 'true');
    return true;
  }
  clearError(rule);
  return false;
}

function clearError(rule: ValidationRule): void {
  rule.errorEl.classList.add('hidden');
  rule.field.classList.remove('border-red-500');
  rule.field.removeAttribute('aria-invalid');
}
```

### 6.4 Accessibility Details

- Every input has a `<label>` with explicit `for` attribute
- Error messages use `aria-describedby` linking to the error element
- Error elements have `role="alert"` for screen reader announcement
- Status messages use `aria-live="polite"` for non-intrusive updates
- Required fields marked with `aria-required="true"` (implicit via `required`)
- Invalid fields get `aria-invalid="true"`
- The honeypot field has `aria-hidden="true"` and is visually hidden

---

## 7. SEO Architecture

### 7.1 Favicon Generation Strategy

**Source**: `public/favicon.svg` (already exists)

**Generated assets** (create once, store in `public/`):
- `public/favicon.svg` — already exists, used as primary icon
- `public/favicon-16x16.png` — generated from SVG
- `public/favicon-32x32.png` — generated from SVG
- `public/apple-touch-icon.png` — 180x180, generated from SVG
- `public/favicon.ico` — 48x48 for legacy browsers

**Generation approach**: Use a build script (`scripts/generate-favicons.ts`) or a one-time manual generation via an online tool (realfavicongenerator.net). Since favicons are static assets generated once, a build-time script is overkill. Generate once, commit to repo.

### 7.2 OG Image Strategy

**Approach**: Static designed image, NOT auto-generated.

**Why static over auto-generated**: Auto-generation (e.g., `@vercel/og`) requires a serverless function or build-time rendering. This is a static site with a single page. One well-designed 1200x630 PNG is sufficient.

**File**: `public/og-image.png` — should include:
- Name "Rafael Gallegos"
- Title "Tech Lead en Healthtech"
- Brand color accent (#DC2626)
- Site URL devrafaseros.com

Placeholder: Generate a simple branded image with text overlay until a professional one is designed.

### 7.3 Sitemap Integration

```javascript
// astro.config.mjs
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://devrafaseros.com",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

The `@astrojs/sitemap` integration auto-generates `sitemap-index.xml` and `sitemap-0.xml` at build time from all pages.

### 7.4 robots.txt

```
# public/robots.txt
User-agent: *
Allow: /

Sitemap: https://devrafaseros.com/sitemap-index.xml
```

Static file in `public/`. No dynamic generation needed for a single-page site.

### 7.5 JSON-LD Structured Data (Person Schema)

Added to `Layout.astro` `<head>`:

```html
<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Rafael Gallegos",
  "url": "https://devrafaseros.com",
  "jobTitle": "Tech Lead",
  "worksFor": {
    "@type": "Organization",
    "name": "Clinica Foianini"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Santa Cruz de la Sierra",
    "addressCountry": "BO"
  },
  "sameAs": [
    "https://www.linkedin.com/in/devrafaseros/",
    "https://github.com/rafaseros"
  ],
  "knowsAbout": [
    "PHP", "Laravel", "MySQL", "PostgreSQL", "Docker",
    "Healthtech", "Digital Transformation", "Team Leadership"
  ]
})} />
```

**Why Person, not WebSite?** Google uses Person schema to populate Knowledge Graph panels. For a personal portfolio, Person is the primary entity. WebSite schema can be added but provides less value for individual brand pages.

---

## 8. Performance Architecture

### 8.1 Self-Hosted Fonts

**Packages**: `@fontsource/inter` and `@fontsource/space-grotesk`

**Integration** in `Layout.astro`:
```astro
---
// Import only the weights we use
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/600.css';
import '@fontsource/space-grotesk/700.css';
---
```

**Removes**: The `<link>` tags to `fonts.googleapis.com` and `fonts.gstatic.com` from `<head>`.

**Impact**:
- Eliminates 2 DNS lookups + 2 TLS handshakes to Google's CDN
- Eliminates render-blocking CSS fetch from Google Fonts
- Fonts are bundled into the site's own CSS, served from the same origin
- `font-display: swap` is built into @fontsource CSS

**Tailwind theme update** in `global.css`:
```css
@theme {
  --font-heading: "Space Grotesk", sans-serif;
  --font-body: "Inter", sans-serif;
}
```
No change needed — the font-family names are identical. Only the delivery mechanism changes.

### 8.2 Image Optimization

**Astro `<Image>` component** (Phase 4):
```astro
---
import { Image } from 'astro:assets';
import projectScreenshot from '../assets/projects/autoagendamiento.png';
---

<Image
  src={projectScreenshot}
  alt="Screenshot del sistema de autoagendamiento"
  width={800}
  height={450}
  format="webp"
  loading="lazy"
/>
```

Astro's built-in image optimization (powered by `sharp`):
- Converts to WebP/AVIF at build time
- Generates srcset for responsive sizes
- Injects proper `width`/`height` to prevent CLS
- `loading="lazy"` on all images except hero (above the fold)

### 8.3 CSS Strategy

| CSS type | Where | Why |
|----------|-------|-----|
| Theme tokens (`@theme`, custom properties) | `global.css` | Used by every component, must be globally available |
| Animation keyframes | `global.css` | Shared across multiple sections |
| `prefers-reduced-motion` | `global.css` | Must be global override |
| `scroll-margin-top` on sections | `global.css` | Applies to all sections uniformly |
| Component-specific styles | `<style>` in each `.astro` file | Astro scopes these automatically, zero leakage |

**What NOT to put in global.css**: Component-specific hover effects, card layouts, grid configurations. These belong in component-scoped `<style>` blocks where Astro auto-scopes them.

### 8.4 Lazy Loading Strategy

| Asset | Strategy | Reason |
|-------|----------|--------|
| Hero content | Eager (no lazy) | Above the fold — LCP candidate |
| Hero social icons SVGs | Inline SVG | Already inline, no network request |
| Section images (projects) | `loading="lazy"` | Below the fold |
| Fonts | Self-hosted, `font-display: swap` | No FOUT blocking, text visible immediately with fallback |
| Scripts (`scroll-animations.ts`, etc.) | Astro auto-defers client scripts | Scripts are non-blocking by default |
| Google Fonts CDN | REMOVED | Eliminated entirely via self-hosting |

---

## 9. Migration Strategy

### Phase 1: Foundation (Non-Breaking)

Every step leaves the site deployable.

**Step 1.1: Add data layer (additive)**
1. Create `src/data/types.ts` with all interfaces
2. Create `src/data/social-links.ts`, `nav-links.ts`, etc. — extract data from existing components
3. Components still work with their inline data at this point
4. **Deploy: YES** (new files only, nothing changed)

**Step 1.2: Wire components to data layer**
1. Update `Header.astro` to import `navLinks` from `src/data/nav-links.ts` — delete inline array
2. Update `Footer.astro` to import `navLinks` and `socialLinks` — delete inline arrays
3. Update `Hero.astro` to import `socialLinks` — delete inline array
4. Update remaining components similarly
5. **Deploy: YES** (same output, different source of truth)

**Step 1.3: Add accessibility baseline**
1. Add `SkipToContent.astro` to `Layout.astro`
2. Add `prefers-reduced-motion` CSS to `global.css`
3. Add ARIA attributes to Header (button, mobile menu)
4. **Deploy: YES** (additive, no visual change)

**Step 1.4: Self-host fonts**
1. Install `@fontsource/inter` and `@fontsource/space-grotesk`
2. Add imports to `Layout.astro`
3. Remove Google Fonts `<link>` tags
4. **Deploy: YES** (same fonts, different delivery)

**Step 1.5: SEO infrastructure**
1. Install `@astrojs/sitemap`, add to config
2. Add `public/robots.txt`
3. Generate favicon PNGs, add to `public/`
4. Add JSON-LD to `Layout.astro`
5. **Deploy: YES** (additive SEO, no visual change)

### Phase 2: Functionality (Progressive Enhancement)

**Step 2.1: Extract scripts**
1. Create `src/scripts/scroll-animations.ts`
2. Create `src/scripts/mobile-menu.ts`
3. Create `src/scripts/active-nav.ts`
4. Import scripts in components or `Layout.astro`
5. Remove inline `<script>` from `Header.astro`
6. **Deploy: YES** (same behavior, different code organization)

**Step 2.2: Enhance mobile menu**
1. Add backdrop element to `Header.astro`
2. Add focus trap, Escape key, body scroll lock via `mobile-menu.ts`
3. Add `aria-expanded`, `aria-controls` attributes
4. **Deploy: YES** (enhanced UX, no breaking change)

**Step 2.3: Add counter animation**
1. Create `src/scripts/counter.ts`
2. Update `AboutMe.astro` stat cards with `data-counter-target` attributes
3. **Deploy: YES** (enhancement, falls back to static numbers)

### Phase 3: Content (New Sections)

**Step 3.1: Create UI components**
1. Extract `SectionTitle.astro`, `Badge.astro`, `Card.astro` from repeating patterns
2. Refactor existing sections to use UI components
3. **Deploy: YES** (same output, DRY code)

**Step 3.2: Move components to subdirectories**
1. Move `Header.astro`, `Footer.astro` to `components/layout/`
2. Move section components to `components/sections/`
3. Update all imports in `index.astro`
4. **Deploy: YES** (reorganization, same output)

**Step 3.3: Add Projects section**
1. Create `src/data/projects.ts` with project data
2. Create `ProjectCard.astro` in `components/ui/`
3. Create `Projects.astro` in `components/sections/`
4. Add to `index.astro` between AboutMe and Experience
5. **Deploy: YES** (new section, additive)

**Step 3.4: Replace tech percentage bars**
1. Update `TechnologyCategory` data to use `level: 'Expert' | 'Proficient' | 'Familiar'`
2. Update `Technologies.astro` to render badges instead of progress bars
3. **Deploy: YES** (visual change, same data)

**Step 3.5: Add contact form**
1. Add form HTML to `Contact.astro` (alongside existing contact methods)
2. Create `src/scripts/contact-form.ts`
3. **Deploy: YES** (new form, existing methods still visible)

### Phase 4: Polish

**Step 4.1: Image optimization**
1. Install `sharp`
2. Replace `<img>` tags with Astro `<Image>` component
3. **Deploy: YES**

**Step 4.2: Micro-interactions and visual polish**
1. Add hover effects to buttons, cards
2. Add scroll progress indicator
3. **Deploy: YES**

**Step 4.3: Lighthouse audit**
1. Run Lighthouse
2. Fix any issues found
3. Target: 90+ across all categories
4. **Deploy: YES** (final tag)

---

## 10. Architecture Decision Records

### ADR-001: No Framework Islands (React/Vue/Svelte)

**Context**: The site needs interactive features: mobile menu with focus trap, scroll-triggered animations, counter animations, form validation. Astro supports "island architecture" where you can mount React/Vue/Svelte components for client-side interactivity.

**Decision**: Use vanilla TypeScript scripts (`src/scripts/`) instead of adding a UI framework.

**Rationale**:
- The interactive features are DOM manipulation (add/remove classes, observe intersection, validate inputs). None require reactive state management, component lifecycle, or virtual DOM diffing.
- Adding React for a focus trap is like hiring a construction crew to hang a painting. The overhead (framework JS bundle, hydration cost, additional dependency) far exceeds the need.
- Astro ships zero JS by default. Every framework island adds its runtime. Vanilla scripts keep the JS payload minimal.
- The scripts are ~150 lines total across all features. A React component for the same would be similar in code but add 40KB+ of framework runtime.

**Alternatives considered**:
- **React islands**: Rejected. Adds ~42KB minified runtime for features achievable in ~2KB of vanilla JS.
- **Preact islands**: Lighter (3KB), but still unnecessary abstraction for class toggling and IntersectionObserver.
- **Alpine.js**: Considered (6KB, declarative). Rejected because it adds a dependency for features that are straightforward in vanilla JS, and it is not in the existing stack.

**Consequences**: Developers must be comfortable with vanilla DOM APIs. If the site evolves to need complex state (e.g., filtering projects with multiple criteria, real-time search), revisit this decision.

---

### ADR-002: Self-Hosted Fonts Over Google Fonts CDN

**Context**: The site currently loads Inter and Space Grotesk via Google Fonts CDN with `<link>` tags in `<head>`.

**Decision**: Replace with `@fontsource/inter` and `@fontsource/space-grotesk` npm packages.

**Rationale**:
- **Performance**: Google Fonts requires 2 DNS lookups, 2 TLS handshakes, and a render-blocking CSS fetch before fonts begin downloading. Self-hosted fonts are served from the same origin with zero additional connections.
- **Privacy**: Google Fonts CDN sets cookies and logs visitor IPs. Self-hosting eliminates third-party tracking. This matters for GDPR compliance (European visitors).
- **Reliability**: No dependency on Google's CDN availability. The site works offline/behind firewalls that block Google domains.
- **Consistency**: Fontsource packages use the exact same font files as Google Fonts. There is zero visual difference.

**Alternatives considered**:
- **Keep Google Fonts CDN**: Simpler (no package install), but performance and privacy costs remain.
- **Manual font files**: Download `.woff2` files manually. Works, but @fontsource packages handle subsetting, formats, and `font-display: swap` declarations automatically.

**Consequences**: Slight increase in build output size (~100KB for font files). Acceptable tradeoff for eliminating external dependencies.

---

### ADR-003: Web3Forms Over Custom Backend for Contact Form

**Context**: The site needs a contact form. Options range from "mailto: link" (current) to a full backend API.

**Decision**: Use Web3Forms (form-to-email service) with client-side AJAX submission.

**Rationale**:
- **No backend needed**: The site is static (Astro SSG). Adding a backend (Node/Express, serverless function, or API route) for a single form is over-engineering.
- **Free tier sufficient**: 250 submissions/month is more than enough for a personal portfolio.
- **Built-in spam filtering**: Web3Forms includes hCaptcha and spam detection. Combined with a honeypot field, spam risk is low.
- **Simple integration**: HTML `action` attribute + `fetch()`. No SDK, no API keys to manage (the access key is public).

**Alternatives considered**:
- **Formspree**: Similar service, slightly more popular. Rejected because Web3Forms' free tier is more generous and does not require visitor account creation.
- **Netlify Forms**: Excellent but ties deployment to Netlify. The site may deploy elsewhere.
- **Custom serverless function**: Full control but requires AWS/Vercel/Cloudflare setup, environment variables, email sending (SendGrid/SES), error handling. Massive overhead for "send me an email."
- **mailto: link** (current): Zero effort but terrible UX. Opens the user's email client, which may not be configured (especially on mobile).

**Consequences**: Dependency on a third-party service. If Web3Forms shuts down, replace with Formspree (same HTML form pattern, different `action` URL). Migration cost: changing one URL.

---

### ADR-004: Flat Data Files Over Astro Content Collections

**Context**: The site's data (experiences, projects, technologies) needs to live somewhere. Astro offers Content Collections — a built-in system for managing structured content with schema validation, querying, and Markdown/MDX support.

**Decision**: Use flat TypeScript files in `src/data/` with typed exports.

**Rationale**:
- **Simplicity**: Content Collections are designed for blog posts, documentation, and other content-heavy sites with many entries, relationships, and querying needs. This site has 6 small arrays.
- **Type safety without Zod**: Content Collections use Zod schemas for validation. Our TypeScript interfaces provide compile-time type safety with zero runtime cost. Zod adds a validation layer that catches errors at build time — but `tsc --noEmit` already does this.
- **No querying needs**: We never need `getCollection().filter().sort()`. We import a typed array and `.map()` over it. The Collection API adds no value here.
- **Refactoring friction**: If data changes shape, changing a TypeScript interface is a one-line edit. Changing a Zod schema + updating the collection config + re-querying is more ceremony.
- **No Markdown content**: Our data is structured objects, not prose. Content Collections shine when you have Markdown/MDX with frontmatter. We have TypeScript objects.

**Alternatives considered**:
- **Astro Content Collections**: Rejected for the reasons above. Revisit if the site adds a blog or the project data grows to 50+ entries with complex relationships.
- **JSON files**: Possible, but loses TypeScript type inference at the definition site. TypeScript files get red squiggles immediately when you add a wrong field.
- **YAML + type generation**: Over-engineered. Adds a build step to generate types from YAML schemas.

**Consequences**: No automatic slug generation, no collection querying API, no Markdown rendering. None of these are needed for this site.

---

### ADR-005: CSS Animations Over JavaScript Animation Library

**Context**: The site needs scroll-triggered reveal animations, stagger effects, counter animations, and hover micro-interactions. Libraries like GSAP, Framer Motion, and Anime.js provide powerful animation APIs.

**Decision**: Use CSS `@keyframes` + `animation` properties, triggered by a vanilla IntersectionObserver script.

**Rationale**:
- **Performance**: CSS animations run on the compositor thread (GPU-accelerated for `transform` and `opacity`). JS animation libraries often run on the main thread, risking jank.
- **Bundle size**: GSAP core is ~27KB minified. Anime.js is ~17KB. Our entire animation CSS + trigger script is ~3KB total.
- **Complexity match**: Our animations are: fade in, slide in, scale in, and counter increment. These are trivially expressible in CSS. We do not need timeline sequencing, physics-based springs, SVG morphing, or scroll-linked progress — which is where GSAP shines.
- **Prefers-reduced-motion**: A single CSS `@media` query disables all CSS animations. With a JS library, you need to configure every animation instance to respect the preference.
- **No build dependency**: CSS animations work without any package. If the animation script fails to load, elements simply appear without animation (graceful degradation via the CSS fallback).

**Alternatives considered**:
- **GSAP**: Industry standard, incredibly powerful. Rejected because the animations required are simple reveals. GSAP is warranted when you need scroll-linked timelines, complex sequencing, or physics. Not for "fade in when visible."
- **CSS `@starting-style` + `transition-behavior: allow-discrete`**: Cutting-edge CSS (2024). Would eliminate the IntersectionObserver entirely. Rejected because browser support is not yet universal (Safari 17.5+, no Firefox as of 2026). Revisit in 2027.
- **View Transitions API**: Astro supports it natively. Relevant for page-to-page transitions, not within-page scroll reveals. Not applicable here.

**Consequences**: If animation requirements grow (e.g., scroll-linked parallax, complex sequencing), the CSS approach will hit its limits. At that point, add GSAP for specific complex animations while keeping simple reveals in CSS.

---

## Appendix: Component Prop Interfaces

For completeness, here are the Astro component prop interfaces that consume the data types:

```typescript
// SectionTitle.astro props
interface Props {
  subtitle: string;   // e.g. "Conoceme"
  title: string;      // e.g. "Sobre mi"
}

// Badge.astro props
interface Props {
  text: string;
  variant?: 'default' | 'outline' | 'accent' | 'proficiency';
  proficiency?: 'Expert' | 'Proficient' | 'Familiar';
}

// Button.astro props
interface Props {
  href?: string;       // renders <a> if present, <button> otherwise
  variant?: 'primary' | 'secondary' | 'ghost';
  class?: string;      // additional classes
}

// Card.astro props
interface Props {
  hover?: boolean;     // enable hover:border-accent effect
  padding?: 'sm' | 'md' | 'lg';
  class?: string;
}

// SocialLinks.astro props
interface Props {
  links: SocialLink[];
  size?: 'sm' | 'md';
}

// ProjectCard.astro props
interface Props {
  project: Project;
  featured?: boolean;
}

// StatCard.astro props
interface Props {
  highlight: Highlight;
  animate?: boolean;   // enable counter animation
}
```
