# Spec: Navigation
**Change**: landing-page-v2
**Domain**: navigation
**Status**: draft

---

## SPEC-NAV-001 — Active Section Highlighting on Scroll

### Requirements

- The header navigation MUST visually highlight the link corresponding to the section currently in the viewport.
- Active state MUST be determined using `IntersectionObserver` on all section elements with `id` attributes, NOT using scroll event listeners.
- The active link MUST receive an `is-active` class or equivalent styling: `text-accent` + `font-semibold`.
- Only one nav link MUST be active at a time.
- When no section is in view (e.g. between sections), the previously active link MUST remain highlighted.
- The observer threshold for section activation SHOULD be 0.4 (40% of section visible).

### Scenarios

**Scenario 1: Scroll into Experience section**
- Given the user is scrolling down the page
- When the Experience section (`#experiencia`) is 40% visible in the viewport
- Then the "Experiencia" nav link MUST receive the active class
- And all other nav links MUST lose the active class

**Scenario 2: Hero is active on page load**
- Given the page just loaded at the top
- When no interaction has happened yet
- Then no nav link needs to be active (or the first link MAY be pre-activated)

**Scenario 3: Section at page bottom**
- Given the user has scrolled to the Contact section at the bottom of the page
- When the section is fully visible
- Then "Contacto" MUST be the active link even if the section does not reach 40% threshold due to page end
- Note: Use a fallback that activates the last section when scrolled to page bottom

### Acceptance Criteria

- [ ] `IntersectionObserver` is used for section detection (no scroll listeners)
- [ ] Active class is applied to the correct nav link on scroll
- [ ] Only one link is active at any time
- [ ] Last section highlights correctly when scrolled to page bottom
- [ ] Active state survives theme toggle without visual glitch

---

## SPEC-NAV-002 — Mobile Menu (Backdrop, Focus Trap, Slide Animation)

### Requirements

- The mobile menu MUST slide in from the top (or side) with a CSS transition when opened, not abruptly appear.
- A semi-transparent backdrop overlay MUST appear behind the menu when it is open.
- Clicking the backdrop MUST close the menu.
- The menu button MUST update `aria-expanded` to `"true"` when open and `"false"` when closed.
- The menu button icon MUST change from a hamburger (≡) to a close (✕) when the menu is open.
- Focus MUST be trapped within the open menu (SPEC-A11Y-004 covers the implementation details).
- Pressing Escape MUST close the menu.
- All nav links inside the menu MUST close the menu when clicked.
- The menu MUST be implemented using `hidden` class toggling plus CSS transition, or a `<dialog>` element.
- The menu MUST NOT use `display: none` as the sole visibility toggle (must support transition).

### Scenarios

**Scenario 1: Menu opens with animation**
- Given the mobile menu is closed (`aria-expanded="false"`)
- When the user taps the hamburger button
- Then the menu MUST slide into view with a 200-300ms transition
- And `aria-expanded` MUST become `"true"`
- And the button icon MUST change to ✕

**Scenario 2: Backdrop closes menu**
- Given the mobile menu is open
- When the user taps outside the menu (on the backdrop)
- Then the menu MUST close with a slide-out transition
- And `aria-expanded` MUST become `"false"`

**Scenario 3: Nav link closes menu**
- Given the mobile menu is open
- When the user taps a navigation link
- Then the menu MUST close immediately after the link is clicked
- And smooth scroll to the target section MUST occur

**Scenario 4: Escape key closes menu**
- Given the mobile menu is open
- When the user presses Escape
- Then the menu MUST close
- And focus MUST return to the menu toggle button

### Acceptance Criteria

- [ ] Mobile menu uses CSS slide transition (transform or max-height), not abrupt show/hide
- [ ] Backdrop overlay renders when menu is open
- [ ] `aria-expanded` is toggled correctly on open/close
- [ ] Button icon switches between hamburger and close
- [ ] Escape key closes menu and restores focus
- [ ] Backdrop click closes menu
- [ ] All menu links close menu on click
- [ ] Focus trap is active while menu is open

---

## SPEC-NAV-003 — Nav Link Hover Micro-Interactions

### Requirements

- Desktop nav links MUST display an animated underline on hover, not a simple color change.
- The underline MUST animate from `width: 0` to `width: 100%` using CSS transition (not JS).
- The underline color MUST use `--color-accent` (#DC2626).
- The animation duration MUST be 200ms with ease-out timing.
- Active nav links (per SPEC-NAV-001) MUST show the underline permanently.
- The hover effect MUST NOT cause layout shift (use `::after` pseudo-element, positioned absolutely).

### Scenarios

**Scenario 1: Hover triggers underline expansion**
- Given a desktop nav link with `::after` pseudo-element (width: 0)
- When the user hovers the link
- Then the underline MUST expand from 0 to 100% width in 200ms

**Scenario 2: Active link always shows underline**
- Given a nav link has the active class
- When the page renders
- Then the link MUST show a full-width underline without requiring hover

### Acceptance Criteria

- [ ] Nav links use CSS `::after` pseudo-element for underline
- [ ] Transition is `width 200ms ease-out`
- [ ] Underline color is `var(--color-accent)`
- [ ] No layout shift on hover (underline is absolutely positioned)
- [ ] Active links show permanent underline
