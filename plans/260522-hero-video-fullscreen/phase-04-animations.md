# Phase 04 — Animation Script Updates

## Context Links

- Parent: [plan.md](./plan.md)
- Deps: Phase 02 (new selectors), Phase 03 (CSS anti-FOUC alignment)
- Research: [research/researcher-02-astro-tailwind-integration.md](./research/researcher-02-astro-tailwind-integration.md) (motion.dev stagger pattern)

## Overview

- **Date:** 2026-05-22
- **Description:** Refactor `heroEntrance()` to new selector list (logo + meta + title + tagline + price), delete `heroParallax()` entirely, fix reduced-motion gating so header `.scrolled` state still works.
- **Priority:** P0
- **Implementation status:** done (2026-05-22)
- **Review status:** not reviewed

## Key Insights

- Existing `heroEntrance()` ([animations.ts:50-68](../../src/scripts/animations.ts#L50)) is array-driven — easy to swap items
- `heroParallax()` ([animations.ts:72-97](../../src/scripts/animations.ts#L72)) targets `[data-hero-gallery]` which no longer exists → dead code, delete
- `unhideAll()` at line 17-26 queries `[data-hero-gallery]` — must remove from list
- **Bug to fix**: `stickyHeaderProgress()` ([animations.ts:101-107](../../src/scripts/animations.ts#L101)) only runs when `reducedMotion=false` ([animations.ts:35-38](../../src/scripts/animations.ts#L35)). Header turns solid via class toggle — not an animation per se. Move outside reduced-motion gate so transparent-header UX still resolves to solid on scroll for accessibility users.
- Logo entrance: subtle fade-down (`y: -12 → 0`), shortest delay (first to appear)

## Requirements

1. `unhideAll()` selector list: drop `[data-hero-gallery]`, add `[data-hero-logo]`
2. `heroEntrance()` items: drop gallery entry, add logo entry at index 0 (first to animate)
3. `heroParallax()` function deleted
4. `heroParallax()` call at [animations.ts:41](../../src/scripts/animations.ts#L41) deleted
5. `stickyHeaderProgress()` extracted from reduced-motion gate — runs unconditionally
6. No `import { scroll }` usage left from parallax if removed (verify — `stickyHeaderProgress` still uses `scroll`, so keep import)

## Architecture

```ts
function unhideAll() {
  document.querySelectorAll<HTMLElement>(
    '[data-reveal], [data-stagger-item], [data-hero-meta], [data-hero-logo], [data-hero-title], [data-hero-tagline], [data-hero-price], [data-feature-image], [data-feature-content]',
  ).forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}

export function initAnimations() {
  if (typeof window === 'undefined') return;
  setupMenuDrawer();
  setupThemeIconAnim();
  stickyHeaderProgress();   // ← MOVED OUT: runs even under reduced motion (class toggle, not animation)

  if (reducedMotion) {
    unhideAll();
    return;
  }

  heroEntrance();
  // heroParallax();        ← DELETED
  sectionReveals();
  staggerChildren();
  featureRowReveals();
}

function heroEntrance() {
  const items = [
    { sel: '[data-hero-logo]',    y: -12, delay: 0.05 },
    { sel: '[data-hero-meta]',    y: -8,  delay: 0.15 },
    { sel: '[data-hero-title]',   y: 18,  delay: 0.25 },
    { sel: '[data-hero-tagline]', y: 14,  delay: 0.35 },
    { sel: '[data-hero-price]',   y: 16,  delay: 0.45 },
  ];
  items.forEach(({ sel, y, delay }) => {
    const el = document.querySelector<HTMLElement>(sel);
    if (!el) return;
    animate(
      el,
      { opacity: [0, 1], y: [y, 0] },
      { duration: 0.75, delay, ease: EASE_OUT_QUART },
    );
  });
}

// heroParallax() entirely removed
```

## Related Code Files

- [src/scripts/animations.ts:17-26](../../src/scripts/animations.ts#L17) — `unhideAll()`
- [src/scripts/animations.ts:28-46](../../src/scripts/animations.ts#L28) — `initAnimations()` orchestrator
- [src/scripts/animations.ts:50-68](../../src/scripts/animations.ts#L50) — `heroEntrance()`
- [src/scripts/animations.ts:72-97](../../src/scripts/animations.ts#L72) — `heroParallax()` (DELETE)
- [src/scripts/animations.ts:101-107](../../src/scripts/animations.ts#L101) — `stickyHeaderProgress()` (relocate call)
- [src/scripts/stickyCta.ts](../../src/scripts/stickyCta.ts) — verify no `data-hero-gallery` dep (none, safe)

## Implementation Steps

1. **(required)** Open [src/scripts/animations.ts](../../src/scripts/animations.ts)
2. **(required)** In `unhideAll()` selector string (line 20): swap `[data-hero-gallery]` → `[data-hero-logo]`. Keep all others.
3. **(required)** In `initAnimations()`: move `stickyHeaderProgress();` call to BEFORE the `if (reducedMotion)` block (between `setupThemeIconAnim()` and `if`)
4. **(required)** In `initAnimations()`: remove `heroParallax();` line (currently line 41)
5. **(required)** Delete entire `heroParallax()` function (currently lines 72-97)
6. **(required)** In `heroEntrance()` items array:
   - Remove `{ sel: '[data-hero-gallery]', scale: 0.97, delay: 0.1 }` entry
   - Prepend `{ sel: '[data-hero-logo]', y: -12, delay: 0.05 }` as first entry
   - Adjust other delays: meta=0.15, title=0.25, tagline=0.35, price=0.45 (cleaner stagger)
7. **(optional)** Simplify items type — `scale` no longer used in any entry; drop `scale?: number` from type + drop `scale: [scale, 1]` from animate call. Reduces noise (KISS).
8. **(required)** Verify `import { scroll }` from motion still in use by `stickyHeaderProgress()` — keep import
9. **(required)** Run TypeScript check: `pnpm astro check` or build to confirm no orphan refs

## Todo

- [x] Replace `[data-hero-gallery]` → `[data-hero-logo]` in `unhideAll()` query string
- [x] Move `stickyHeaderProgress()` call before reduced-motion guard
- [x] Remove `heroParallax()` call from `initAnimations()`
- [x] Delete `heroParallax()` function definition entirely (~26 lines incl. trailing blank)
- [x] Replace gallery entry in `heroEntrance` items with logo entry at index 0
- [x] Redistribute delays (0.05, 0.15, 0.25, 0.35, 0.45)
- [x] Drop `scale` from items typing (no entry uses it anymore)
- [ ] TypeScript check passes (`pnpm astro check`) — node CLI unavailable in this environment; user needs to run

## Success Criteria

- No `[data-hero-gallery]` string anywhere in animations.ts
- No `heroParallax` identifier anywhere in animations.ts
- Logo + 4 text/CTA elements stagger-in on home page load
- Header class toggles `scrolled` even with `prefers-reduced-motion: reduce` (verify via DevTools emulation)
- View Transitions: navigate to product page + back, animations re-run on `astro:after-swap` if listener exists (verify — current code does NOT have this listener; entrance only runs on initial load. Acceptable for now)

## Risk Assessment

- **Low**: motion.dev `animate()` resilient to missing selectors (`if (!el) return;` already guards)
- **Med**: `stickyHeaderProgress()` outside reduced-motion gate now runs `scroll()` listener unconditionally. motion's `scroll()` is non-animating — safe. Verify via screen reader / reduced-motion preference.
- **Low**: removing `heroParallax()` removes ~25 lines including `IntersectionObserver` + `scroll()` cleanup. No external consumers (scout confirms).

## Security Considerations

- N/A (no new event handlers, no DOM injection)

## Next Steps

→ Phase 05 testing validates animations + reduced-motion + view transitions
→ If View-Transitions re-entry animation desired: add `document.addEventListener('astro:after-swap', heroEntrance)` — defer until product team requests

## Unresolved Questions

- Should `heroEntrance()` re-fire on `astro:after-swap` event for cross-page navigations? Currently runs once on `DOMContentLoaded` (via callsite in MainLayout). Spec from research suggests yes for polish. Defer until P1.
- `motion`'s `scroll()` cleanup function: does `stickyHeaderProgress()` need explicit teardown on navigation? In SPA mode might leak — verify in Phase 05.
