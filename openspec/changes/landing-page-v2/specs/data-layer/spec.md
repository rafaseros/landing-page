# Spec: Data Layer
**Change**: landing-page-v2
**Domain**: data-layer
**Status**: draft

---

## SPEC-DATA-001 — TypeScript Interfaces for Domain Entities

### Requirements

- The project MUST define TypeScript interfaces for all shared data entities: `SocialLink`, `NavLink`, `Technology`, `TechnologyCategory`, `Experience`, `Project`, `Talk`.
- All interfaces MUST be exported from a single barrel file at `src/data/types.ts`.
- Every interface MUST include JSDoc comments describing each field's purpose.
- Optional fields MUST be marked with `?` and documented.
- No component MAY define local inline types for these entities — all types MUST be imported from `src/data/types.ts`.

### Interface Definitions

```typescript
// src/data/types.ts

export interface SocialLink {
  /** Display name, used as aria-label */
  name: string;
  /** Full URL or mailto: href */
  href: string;
  /** Inline SVG string or component reference */
  icon: string;
}

export interface NavLink {
  /** Anchor href pointing to a section id */
  href: string;
  /** Visible label text */
  label: string;
}

export interface Technology {
  /** Technology display name */
  name: string;
  /** Proficiency badge: Expert | Proficient | Familiar */
  level: 'Expert' | 'Proficient' | 'Familiar';
  /** Optional icon identifier or URL */
  icon?: string;
}

export interface TechnologyCategory {
  /** Category display name */
  name: string;
  /** Technologies within this category */
  techs: Technology[];
}

export interface Experience {
  /** Job title */
  title: string;
  /** Company name */
  company: string;
  /** Employment period, e.g. "2019 - Presente" */
  period: string;
  /** Location, e.g. "Santa Cruz, Bolivia" */
  location: string;
  /** Short description or achievements array */
  description: string[];
  /** Technology tags used in this role */
  tags: string[];
  /** Whether this is the current position */
  isCurrent?: boolean;
}

export interface Project {
  /** Project display title */
  title: string;
  /** Short summary (1-2 sentences) */
  summary: string;
  /** Technology tags */
  tags: string[];
  /** Optional GitHub repository URL */
  githubUrl?: string;
  /** Optional live demo URL */
  liveUrl?: string;
  /** Impact metric description, e.g. "Redujo tiempo de admisión en 60%" */
  impact?: string;
  /** Whether project is featured (shown in main grid) */
  featured: boolean;
}

export interface Talk {
  /** Talk title */
  title: string;
  /** Event or conference name */
  event: string;
  /** Year of delivery */
  year: number;
  /** Optional recording or slides URL */
  url?: string;
  /** Technology or topic tags */
  tags: string[];
}
```

### Scenarios

**Scenario 1: Import types in a component**
- Given a component needs to render a list of `SocialLink` items
- When the developer imports `SocialLink` from `src/data/types.ts`
- Then TypeScript compilation MUST succeed with full type inference
- And the IDE MUST provide autocomplete for all fields

**Scenario 2: Invalid level on Technology**
- Given a `Technology` object is created with `level: 'Beginner'`
- When TypeScript compiles the file
- Then a type error MUST be raised indicating `'Beginner'` is not assignable to the union type

**Scenario 3: Optional field omission**
- Given a `Project` object is created without `githubUrl` or `liveUrl`
- When TypeScript compiles the file
- Then no error MUST be raised, since both fields are optional

### Acceptance Criteria

- [ ] `src/data/types.ts` exists and exports all 7 interfaces
- [ ] All interface fields have JSDoc comments
- [ ] `Technology.level` is a discriminated union, not a plain string
- [ ] `tsc --noEmit` passes with zero errors
- [ ] No component file contains local type redefinitions of these entities

---

## SPEC-DATA-002 — Single Source of Truth Data Files

### Requirements

- All static site data MUST be defined in `src/data/` as typed TypeScript modules.
- Data files MUST be: `social-links.ts`, `nav-links.ts`, `technologies.ts`, `experience.ts`, `projects.ts`, `talks.ts`.
- Each file MUST export a single named constant array typed with the corresponding interface.
- Components MUST import data from `src/data/` and MUST NOT hardcode data inline.
- Data files MUST NOT contain any rendering logic, only plain data objects.

### Scenarios

**Scenario 1: navLinks deduplication**
- Given `navLinks` is currently defined inline in `Header.astro` and `Footer.astro`
- When refactoring to `src/data/nav-links.ts`
- Then both components MUST import from the same file
- And modifying the file MUST update both components without touching either component

**Scenario 2: Adding a new project**
- Given a developer adds a new entry to `src/data/projects.ts`
- When the page reloads
- Then the new project card MUST appear in the Projects section automatically
- And no component file MUST need modification

**Scenario 3: Type safety on data file**
- Given `src/data/technologies.ts` exports `technologies: TechnologyCategory[]`
- When a tech entry is added with a missing required field
- Then TypeScript MUST raise a compile-time error

### Acceptance Criteria

- [ ] Six data files exist under `src/data/`, one per domain entity
- [ ] Each file exports a typed array constant
- [ ] Zero inline data arrays remain in component files
- [ ] `tsc --noEmit` passes after migration
- [ ] Adding an item to any data file is reflected in the UI without component changes
