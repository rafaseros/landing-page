# Spec: Accessibility
**Change**: landing-page-v2
**Domain**: accessibility
**Status**: draft

---

## SPEC-A11Y-001 — Skip-to-Content Link

### Requirements

- The layout MUST include a visually hidden skip link as the very first focusable element in the DOM.
- The link MUST become visible on keyboard focus (not hidden with `display:none` or `visibility:hidden`).
- The link target MUST be `#main-content` and the `<main>` element MUST carry `id="main-content"`.
- The link text MUST be descriptive, e.g. "Saltar al contenido principal".
- The skip link MUST move focus to `#main-content` on activation, bypassing the navigation.

### Scenarios

**Scenario 1: Keyboard user skips navigation**
- Given the page has loaded
- When a keyboard user presses Tab as their first interaction
- Then the skip link MUST become visible in the top-left corner of the viewport
- And pressing Enter MUST move focus directly to `#main-content`

**Scenario 2: Mouse user does not see skip link**
- Given a mouse user visits the page
- When they do not use the keyboard at all
- Then the skip link MUST remain visually hidden (off-screen, not blocking layout)

**Scenario 3: Screen reader announces skip link**
- Given a screen reader user navigates the page
- When they reach the first interactive element
- Then the screen reader MUST announce the skip link text

### Acceptance Criteria

- [ ] First DOM element inside `<body>` is an `<a>` with `href="#main-content"`
- [ ] Link has CSS that moves it off-screen by default and on-screen on `:focus`
- [ ] `<main id="main-content">` exists and wraps page content
- [ ] axe-core / WAVE audit reports no missing skip link violation
- [ ] Manual keyboard test: Tab → Enter navigates past the header

---

## SPEC-A11Y-002 — prefers-reduced-motion Support

### Requirements

- All CSS animations and transitions MUST be disabled or reduced when `prefers-reduced-motion: reduce` is active.
- The global CSS MUST include a `@media (prefers-reduced-motion: reduce)` block that sets `animation-duration: 0.01ms`, `animation-iteration-count: 1`, and `transition-duration: 0.01ms` for all elements.
- The Intersection Observer animation system MUST check `window.matchMedia('(prefers-reduced-motion: reduce)')` and skip adding the `.animated` class if the user prefers reduced motion — instead, elements MUST become immediately visible.
- The stats counter animation MUST be skipped entirely under reduced motion (display final value immediately).
- The body theme transition (`transition: background-color 0.3s`) MUST be excluded from reduced motion or set to instant.

### Scenarios

**Scenario 1: User enables reduced motion in OS**
- Given the OS accessibility setting "Reduce motion" is on
- When the page loads
- Then no scroll-triggered animation MUST play
- And all sections MUST be immediately visible without fade-in

**Scenario 2: Scroll animation with reduced motion**
- Given `prefers-reduced-motion: reduce` is active
- When the Intersection Observer fires for an `.animate-on-scroll` element
- Then the JS MUST add immediate visibility (e.g. `opacity: 1`) without triggering the CSS animation

**Scenario 3: Stats counter with reduced motion**
- Given the AboutMe section has animated counters
- When the section is in view with reduced motion active
- Then the counter MUST display its final value immediately, skipping the counting animation

### Acceptance Criteria

- [ ] `global.css` contains `@media (prefers-reduced-motion: reduce)` with universal animation reset
- [ ] Intersection Observer JS checks `prefers-reduced-motion` before applying `.animated`
- [ ] Counter animation JS checks `prefers-reduced-motion` before starting the count loop
- [ ] axe-core reports no motion-related violations
- [ ] DevTools Rendering → "Emulate prefers-reduced-motion" confirms no animations play

---

## SPEC-A11Y-003 — ARIA Attributes and Semantic HTML

### Requirements

- All interactive elements MUST have accessible names via `aria-label`, `aria-labelledby`, or visible text.
- Icon-only buttons MUST have an `aria-label` describing their action.
- The mobile menu button MUST use `aria-expanded` (set to `"true"` when open, `"false"` when closed) and `aria-controls="mobile-menu"`.
- The mobile menu panel MUST have `id="mobile-menu"` and `role="navigation"` if not inside a `<nav>`.
- Section headings MUST form a logical hierarchy: one `<h1>` per page, `<h2>` for section titles, `<h3>` for subsections.
- Social link anchors MUST have `aria-label` matching the platform name.
- External links MUST include `rel="noopener noreferrer"` and SHOULD indicate they open in a new tab via `aria-label` or visible text.
- Color contrast MUST meet WCAG 2.1 AA: 4.5:1 for normal text, 3:1 for large text.

### Scenarios

**Scenario 1: Mobile menu aria-expanded toggle**
- Given the mobile menu button has `aria-expanded="false"`
- When the user clicks the button to open the menu
- Then `aria-expanded` MUST change to `"true"`
- And when the menu closes, it MUST revert to `"false"`

**Scenario 2: Icon button accessible name**
- Given the theme toggle button contains only an SVG icon
- When a screen reader focuses the button
- Then it MUST announce "Cambiar tema" or equivalent

**Scenario 3: Heading hierarchy audit**
- Given the full page renders
- When a heading audit tool is run
- Then there MUST be exactly one `<h1>`
- And all section titles MUST use `<h2>`
- And no heading levels MUST be skipped

### Acceptance Criteria

- [ ] Mobile menu button has `aria-expanded` and `aria-controls`
- [ ] All icon-only buttons have `aria-label`
- [ ] Exactly one `<h1>` exists on the page
- [ ] Color contrast ratio ≥ 4.5:1 for body text (verified via DevTools)
- [ ] axe-core audit returns 0 critical violations
- [ ] All external links have `rel="noopener noreferrer"`

---

## SPEC-A11Y-004 — Keyboard Navigation and Focus Management

### Requirements

- All interactive elements MUST be reachable and operable via keyboard alone.
- Visible focus indicators MUST be present on all focusable elements (ring or outline, not removed).
- The mobile menu MUST implement a focus trap: Tab and Shift+Tab MUST cycle focus within the menu while it is open.
- Pressing Escape MUST close the mobile menu and return focus to the menu button.
- Focus MUST not become lost (trapped in an element with no keyboard exit) at any point.
- The page MUST be fully operable without a mouse.

### Scenarios

**Scenario 1: Focus trap in mobile menu**
- Given the mobile menu is open
- When the user presses Tab repeatedly
- Then focus MUST cycle through only the menu's links and the close button
- And focus MUST NOT escape to elements behind the menu

**Scenario 2: Escape closes menu**
- Given the mobile menu is open and focus is inside it
- When the user presses Escape
- Then the menu MUST close
- And focus MUST return to the mobile menu toggle button

**Scenario 3: Visible focus ring**
- Given the site uses Tailwind CSS with default `outline: none` resets
- When any interactive element receives focus
- Then a visible ring (min 2px, contrasting color) MUST be visible around the element

### Acceptance Criteria

- [ ] Focus trap is implemented for mobile menu
- [ ] Escape key closes mobile menu and restores focus
- [ ] `outline: none` is NOT applied without a custom focus indicator replacement
- [ ] All nav links, buttons, and form fields reachable via Tab
- [ ] No focus loss reported during keyboard-only test session
