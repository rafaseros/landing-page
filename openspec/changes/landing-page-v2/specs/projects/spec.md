# Spec: Projects Section
**Change**: landing-page-v2
**Domain**: projects
**Status**: draft

---

## SPEC-PROJ-001 — Projects Section Layout

### Requirements

- A new `Projects.astro` component MUST be created and inserted in `index.astro` between the Experience and Technologies sections.
- The section MUST use `id="proyectos"` and be included in the nav links data (`src/data/nav-links.ts`).
- The section MUST display 2-3 featured projects by default, sourced from `src/data/projects.ts`.
- The section header MUST follow the existing pattern: accent label ("Mis proyectos") + `<h2>` title ("Proyectos Destacados").
- The section background MUST alternate with adjacent sections (use `bg-(--bg-primary)` if Experience uses secondary, etc.).
- A "Ver todos" link or button MAY appear below the grid if more than 3 projects exist in data.

### Scenarios

**Scenario 1: Section renders with data**
- Given `src/data/projects.ts` contains 3 featured projects
- When the page loads
- Then the Projects section MUST render with all 3 project cards visible

**Scenario 2: Empty projects data**
- Given `src/data/projects.ts` is an empty array
- When the page loads
- Then the Projects section MUST NOT render (or render with a graceful empty state)
- And no broken layout MUST appear

**Scenario 3: Section in nav**
- Given "Proyectos" is in nav-links data
- When the user clicks "Proyectos" in the header
- Then smooth scroll MUST take them to `#proyectos`

### Acceptance Criteria

- [ ] `src/components/Projects.astro` exists
- [ ] Section has `id="proyectos"`
- [ ] "Proyectos" link is in `src/data/nav-links.ts`
- [ ] Section renders in `index.astro` between Experience and Technologies
- [ ] Section background alternates correctly with adjacent sections

---

## SPEC-PROJ-002 — Project Card Component

### Requirements

- Each project MUST be rendered as a `ProjectCard` sub-component (inline in `Projects.astro` or as a separate `ProjectCard.astro`).
- The card MUST display: project title, summary, tech tags, optional impact metric, optional GitHub link, and optional live link.
- The card MUST have a hover state: `translateY(-4px)` lift with a subtle box-shadow enhancement and `border-accent` transition.
- The card MUST use the existing card pattern: `bg-(--bg-primary)`, rounded-xl, border, hover:border-accent.
- GitHub and live links MUST open in a new tab with `rel="noopener noreferrer"`.
- If both `githubUrl` and `liveUrl` are absent, the link area MUST be hidden (not render empty anchors).
- The impact metric (if present) MUST be visually distinct — accent color, small badge style.
- Cards MUST include `animate-on-scroll` for scroll reveal (per SPEC-ANIM-001).

### Scenarios

**Scenario 1: Card with all fields**
- Given a project has `title`, `summary`, `tags`, `impact`, `githubUrl`, and `liveUrl`
- When the card renders
- Then all fields MUST be visible
- And both GitHub and live links MUST appear as distinct action buttons

**Scenario 2: Card without links**
- Given a project has no `githubUrl` and no `liveUrl`
- When the card renders
- Then no link buttons MUST appear
- And the card layout MUST not break or show empty space

**Scenario 3: Card hover lift**
- Given a project card is rendered
- When the user hovers over it
- Then the card MUST visually lift (`transform: translateY(-4px)`) with a shadow increase
- And the border MUST transition to `border-accent`

**Scenario 4: Tech tags render**
- Given a project has `tags: ['Laravel', 'MySQL', 'Docker']`
- When the card renders
- Then each tag MUST appear as a small badge with `bg-(--bg-secondary)` and rounded styling

### Acceptance Criteria

- [ ] Card renders title, summary, impact (if present), tags, and action links (if present)
- [ ] Hover applies `translateY(-4px)` via CSS transition (not JS)
- [ ] External links have `target="_blank"` and `rel="noopener noreferrer"`
- [ ] Card has `animate-on-scroll` class
- [ ] No render when optional fields are absent (graceful degradation)
- [ ] Visual review: card looks consistent with Experience and Technologies card styles

---

## SPEC-PROJ-003 — Projects Data Initialization

### Requirements

- `src/data/projects.ts` MUST be created with at least 2 real projects from Rafael's portfolio.
- Each entry MUST be typed as `Project` (from `src/data/types.ts`).
- At least 2 projects MUST have `featured: true` to appear in the initial grid.
- Projects MUST include realistic `tags` and an `impact` metric where verifiable.
- Suggested initial projects based on existing site context:
  1. Sistema de gestión hospitalaria (Clínica Foianini) — Laravel, MySQL, Docker
  2. Portal de admisiones digitales — PHP, REST APIs, integración B2B
  3. Sistema de reportes clínicos — GeneXus, PostgreSQL

### Acceptance Criteria

- [ ] `src/data/projects.ts` exists with minimum 2 entries
- [ ] All entries are typed as `Project[]`
- [ ] At least 2 have `featured: true`
- [ ] Each entry has `title`, `summary`, `tags`, and `featured` fields at minimum
