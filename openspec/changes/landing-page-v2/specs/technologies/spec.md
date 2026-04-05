# Spec: Technologies Section
**Change**: landing-page-v2
**Domain**: technologies
**Status**: draft

---

## SPEC-TECH-001 — Replace Skill Bars with Proficiency Badge Cards

### Requirements

- The current skill percentage bars in `Technologies.astro` MUST be replaced with badge/tag cards grouped by category.
- Each technology MUST display as a pill/badge showing the tech name and a proficiency level indicator.
- Proficiency levels MUST be one of: `Expert`, `Proficient`, `Familiar` (replacing numeric percentages).
- The mapping from current percentage to badge level MUST be: ≥85% → Expert, 70-84% → Proficient, <70% → Familiar.
- Category cards MUST retain the current grid layout: `md:grid-cols-2 lg:grid-cols-3`.
- The `Technology` interface from `src/data/types.ts` MUST drive the rendering (SPEC-DATA-001).
- No numeric percentage MUST appear anywhere in the Technologies section.

### Badge Visual Design

- Expert: `bg-accent/10 text-accent border border-accent/30` — red tint (accent color family)
- Proficient: `bg-blue-500/10 text-blue-400 border border-blue-500/30` — blue tint
- Familiar: `bg-(--bg-tertiary) text-(--text-secondary) border border-(--border)` — neutral

### Scenarios

**Scenario 1: Expert badge renders for PHP**
- Given PHP is mapped to level `Expert` in `src/data/technologies.ts`
- When the Technologies section renders
- Then PHP MUST appear as a badge with the Expert visual style (accent-tinted background)
- And no percentage number MUST appear

**Scenario 2: Multiple techs in one category**
- Given the Backend category has 3 technologies
- When the category card renders
- Then all 3 badges MUST appear in a flex-wrap layout within the card

**Scenario 3: Unknown level rejected at compile time**
- Given a developer adds `level: 'Advanced'` to a technology entry
- When TypeScript compiles
- Then a type error MUST be raised

**Scenario 4: Category card hover**
- Given a category card is rendered
- When the user hovers it
- Then the card border MUST transition to `border-accent` (existing hover behavior retained)

### Acceptance Criteria

- [ ] All 6 category cards render without percentage bars
- [ ] Each tech displays as a pill/badge with correct proficiency styling
- [ ] Three distinct visual styles for Expert, Proficient, Familiar
- [ ] `Technology.level` union type enforced — compile error on invalid values
- [ ] `src/data/technologies.ts` contains all techs from current component (migrated)
- [ ] Category grid layout unchanged (md:2-col, lg:3-col)
- [ ] No accessibility violations (color not the only differentiator — badge label also differs)

---

## SPEC-TECH-002 — Technologies Data Migration

### Requirements

- `src/data/technologies.ts` MUST be created exporting `technologies: TechnologyCategory[]`.
- All 6 existing categories and their technologies MUST be migrated from the inline data in `Technologies.astro`.
- Percentage values MUST be converted to proficiency levels during migration (see conversion table in SPEC-TECH-001).
- The `Technologies.astro` component MUST import from `src/data/technologies.ts` (no inline data).

### Migration Table

| Technology | Old Level | New Badge |
|---|---|---|
| PHP | 95% | Expert |
| Laravel | 90% | Expert |
| GeneXus | 85% | Expert |
| MySQL | 90% | Expert |
| PostgreSQL | 85% | Expert |
| JavaScript | 80% | Proficient |
| HTML/CSS | 85% | Expert |
| React | 70% | Proficient |
| Angular | 65% | Familiar |
| Docker | 75% | Proficient |
| Git | 85% | Expert |
| Linux | 70% | Proficient |
| Android | 70% | Proficient |
| WordPress | 80% | Proficient |
| REST APIs | 90% | Expert |
| Integraciones B2B | 85% | Expert |

### Acceptance Criteria

- [ ] `src/data/technologies.ts` exists with all 6 categories and 16 technologies
- [ ] All levels are valid union members (`Expert | Proficient | Familiar`)
- [ ] `Technologies.astro` imports from data file (no inline object literals)
- [ ] `tsc --noEmit` passes with zero errors
