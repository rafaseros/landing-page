# Spec: Animations
**Change**: landing-page-v2
**Domain**: animations
**Status**: draft

---

## SPEC-ANIM-001 — Intersection Observer Scroll Animation System

### Requirements

- A single `src/scripts/scroll-animations.ts` module MUST implement the Intersection Observer scroll-reveal system.
- The module MUST observe all elements with class `.animate-on-scroll` on `DOMContentLoaded`.
- When an observed element enters the viewport (threshold: 0.15), the module MUST add the `.animated` class to it.
- Once `.animated` is added, the element MUST be unobserved (no re-animation on scroll back up).
- The existing CSS in `global.css` (`.animate-on-scroll { opacity: 0 }` and `.animate-on-scroll.animated { animation: fade-in-up }`) MUST remain unchanged and drive the visual effect.
- If `prefers-reduced-motion: reduce` is detected, the module MUST immediately add `.animated` to all observed elements without waiting for scroll, and MUST set `opacity: 1` inline to prevent invisible content.
- The observer MUST use `rootMargin: '0px 0px -50px 0px'` to trigger slightly before the element fully enters the viewport.

### Scenarios

**Scenario 1: Element animates when scrolled into view**
- Given a section has elements with `.animate-on-scroll`
- When the user scrolls down until the element crosses the 15% viewport threshold
- Then the `.animated` class MUST be added to that element
- And the `fade-in-up` animation MUST play

**Scenario 2: Animation does not replay**
- Given an element has already received `.animated`
- When the user scrolls the element out of view and back in
- Then the animation MUST NOT replay
- And the element MUST remain fully visible

**Scenario 3: Reduced motion bypass**
- Given `prefers-reduced-motion: reduce` is active
- When the page loads
- Then all `.animate-on-scroll` elements MUST be immediately visible
- And no CSS animation MUST play

**Scenario 4: Late DOM insertion**
- Given additional elements are injected into the DOM after initial observation
- When those elements have `.animate-on-scroll`
- Then they SHOULD be observed on next scroll if a mutation observer is implemented, or MUST be manually triggered

### Acceptance Criteria

- [ ] `src/scripts/scroll-animations.ts` exists and is imported in `Layout.astro` or `index.astro`
- [ ] `IntersectionObserver` is used (not scroll event listeners)
- [ ] Threshold is 0.15 and rootMargin is `'0px 0px -50px 0px'`
- [ ] `observer.unobserve(entry.target)` is called after first intersection
- [ ] Reduced motion path skips animation and makes elements immediately visible
- [ ] All existing `.animate-on-scroll` elements in the codebase animate on scroll

---

## SPEC-ANIM-002 — Staggered Animation Delays

### Requirements

- Sections with multiple child elements MUST apply staggered animation delays so elements reveal sequentially rather than simultaneously.
- Delay increments SHOULD be 100ms per element (delay-100 through delay-500 already exist in CSS).
- New delay classes MUST be added for sequences longer than 5 elements: `delay-600` through `delay-900`.
- Stagger SHOULD be applied using the existing utility classes on child elements, not via JavaScript.
- The Hero section entrance animations (load-time, not scroll-triggered) MUST retain their current staggered inline `animation-delay` values.

### Scenarios

**Scenario 1: Projects grid stagger**
- Given the Projects section has 3 cards with `.animate-on-scroll` and delays 100ms, 200ms, 300ms
- When the section scrolls into view
- Then cards MUST animate in sequence, each 100ms after the previous

**Scenario 2: Technologies category stagger**
- Given the Technologies section has 6 category cards
- When the section scrolls into view
- Then each card MUST start its animation 100ms after the one before it

### Acceptance Criteria

- [ ] `delay-600` through `delay-900` classes exist in `global.css`
- [ ] Multi-item sections use staggered delay classes on child elements
- [ ] Visual review confirms sequential animation (not simultaneous)

---

## SPEC-ANIM-003 — Stats Counter Animation

### Requirements

- The 4 stat boxes in `AboutMe.astro` (years of experience, projects, etc.) MUST animate from 0 to their target value when the section scrolls into view.
- The counter animation MUST use `requestAnimationFrame` for smooth performance (not `setInterval`).
- Duration MUST be 1500ms by default.
- The counter MUST use an ease-out curve (decelerating towards the final value).
- If `prefers-reduced-motion: reduce` is active, the counter MUST display the final value immediately without animation.
- The counter MUST only start once (not restart on re-entry to viewport).

### Scenarios

**Scenario 1: Counter counts up on scroll**
- Given the AboutMe section is below the fold
- When the user scrolls until the section enters the viewport
- Then each stat number MUST begin counting from 0 to its target value
- And the count MUST complete in approximately 1500ms

**Scenario 2: Counter does not restart**
- Given a stat counter has already completed
- When the user scrolls away and back
- Then the counter MUST show the final value and not restart

**Scenario 3: Reduced motion**
- Given `prefers-reduced-motion: reduce` is active
- When the AboutMe section loads
- Then all counters MUST immediately display their final values

### Acceptance Criteria

- [ ] Counter animation uses `requestAnimationFrame`
- [ ] Duration is 1500ms with ease-out easing
- [ ] Counter does not restart on re-scroll
- [ ] `prefers-reduced-motion` check implemented before starting animation
- [ ] Visual test confirms smooth counting from 0 to target
