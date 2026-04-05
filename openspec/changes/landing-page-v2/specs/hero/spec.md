# Spec: Hero Section
**Change**: landing-page-v2
**Domain**: hero
**Status**: draft

---

## SPEC-HERO-001 — Asymmetric Layout with Photo Area

### Requirements

- The Hero section MUST be redesigned from a centered single-column layout to a two-column asymmetric layout on desktop.
- Left column (60% width): text content (greeting, name, title, description, CTAs, social links).
- Right column (40% width): a circular or rounded photo area.
- The photo area MUST display a profile photo if `src/assets/profile-photo.jpg` (or `.webp`) exists, or a styled placeholder avatar with the initials "RG" if no photo is provided.
- On mobile (< `md` breakpoint), the layout MUST revert to single-column with the photo area centered above the text.
- The photo MUST use `<Image>` from `astro:assets` for automatic optimization.
- The photo container MUST have a decorative accent ring: `ring-4 ring-accent/30` or equivalent.
- A subtle gradient decoration (accent color, very low opacity) SHOULD appear in the background of the right column area.

### Scenarios

**Scenario 1: Desktop asymmetric layout**
- Given the viewport is ≥ 768px (md breakpoint)
- When the Hero section renders
- Then text content MUST be on the left (~60%) and photo area on the right (~40%)
- And both columns MUST be vertically centered

**Scenario 2: Mobile single-column layout**
- Given the viewport is < 768px
- When the Hero section renders
- Then the photo MUST appear centered above the text content
- And the text MUST be centered below

**Scenario 3: Missing profile photo fallback**
- Given no profile photo file exists at `src/assets/profile-photo.*`
- When the Hero section renders
- Then a styled placeholder with "RG" initials MUST appear in the photo area
- And no broken image or empty box MUST be visible

**Scenario 4: Photo decorative ring**
- Given the profile photo is present
- When the photo renders
- Then a ring/border in `ring-accent/30` MUST visually surround the photo

### Acceptance Criteria

- [ ] Desktop: two-column asymmetric layout (60/40 split)
- [ ] Mobile: stacked single-column layout
- [ ] Photo area uses `<Image>` from `astro:assets` when photo exists
- [ ] Fallback "RG" avatar renders when no photo file exists
- [ ] Decorative ring/border applied to photo container
- [ ] Existing entrance animations retained on text content

---

## SPEC-HERO-002 — Animated Entrance Sequence

### Requirements

- The Hero section MUST retain its current staggered entrance animation sequence.
- All animated elements MUST use `animation-fill-mode: forwards` and start with `opacity: 0`.
- The animation sequence order and delays MUST be:
  1. Greeting text ("¡Hola! Soy") — delay 100ms
  2. Name (`<h1>`) — delay 200ms
  3. Title (`<h2>`) — delay 300ms
  4. Description paragraph — delay 400ms
  5. CTA buttons — delay 500ms
  6. Social links — delay 600ms
  7. Photo area (new) — delay 300ms (concurrent with title, right column animates in together)
- If `prefers-reduced-motion: reduce` is active, all elements MUST be immediately visible (opacity: 1, no animation).

### Scenarios

**Scenario 1: Full animation sequence plays**
- Given the page loads without reduced motion preference
- When the Hero section mounts
- Then each element MUST fade in sequentially with the specified delays

**Scenario 2: Reduced motion bypass**
- Given `prefers-reduced-motion: reduce` is active
- When the page loads
- Then all Hero elements MUST be immediately visible with `opacity: 1`
- And no animation MUST play

### Acceptance Criteria

- [ ] All 7 animation elements have correct inline `animation-delay` values
- [ ] All use `animation-fill-mode: forwards` and start `opacity: 0`
- [ ] Photo area animates in at 300ms
- [ ] `@media (prefers-reduced-motion: reduce)` in CSS covers Hero elements
- [ ] Visual review confirms sequential cascade entrance

---

## SPEC-HERO-003 — CTA Buttons

### Requirements

- Two CTAs MUST be present: primary ("Contáctame") and secondary ("Ver experiencia").
- The primary CTA MUST link to `#contacto` with `bg-accent` styling.
- The secondary CTA MUST link to `#experiencia` with outlined/ghost styling.
- SHOULD add a third CTA: "Ver proyectos" linking to `#proyectos` (if Projects section is added).
- On mobile, CTAs MUST stack vertically (already implemented via `flex-col sm:flex-row`).
- Hover states MUST include a subtle scale transform: `hover:scale-105` or `hover:-translate-y-1`.

### Acceptance Criteria

- [ ] Primary CTA ("Contáctame") scrolls to `#contacto`
- [ ] Secondary CTA ("Ver experiencia") scrolls to `#experiencia`
- [ ] Optional third CTA ("Ver proyectos") links to `#proyectos` if Projects section exists
- [ ] CTAs stack vertically on mobile
- [ ] Hover transform applied to both buttons
