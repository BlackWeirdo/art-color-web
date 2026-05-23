# Phase 03 — CSS Updates (global.css)

## Context Links

- Parent: [plan.md](./plan.md)
- Deps: Phase 02 (selector decisions finalized)
- Research: [research/researcher-02-astro-tailwind-integration.md](./research/researcher-02-astro-tailwind-integration.md) (Tailwind 4 OKLCH overlays)
- Scout: [scout/scout-01-hero-impact.md](./scout/scout-01-hero-impact.md) (CSS rule mapping)

## Overview

- **Date:** 2026-05-22
- **Description:** Remove gallery selectors, add `[data-hero-logo]` to anti-FOUC + reduced-motion blocks, add header transparent-state rule when hero is in view, ensure overlay scrim works in both themes.
- **Priority:** P0
- **Implementation status:** done (2026-05-22)
- **Review status:** not reviewed

## Key Insights

- Existing anti-FOUC pattern uses `.js [data-...]` prefix — JS-only hiding
- `[data-hero-gallery]` rule at [global.css:139,153,165](../../src/styles/global.css#L139) becomes dead code → remove
- Existing `header[data-header].scrolled` rule ([global.css:185-188](../../src/styles/global.css#L185)) already handles solid bg state — reuse, only need to make **default** state transparent over hero
- `--overlay-strong/medium/soft` already defined ([global.css:58-60](../../src/styles/global.css#L58)) — reuse for scrim
- Tailwind 4 syntax: `bg-[--overlay-medium]` works in component (Phase 02). No new utility class needed in global.css

## Requirements

1. Add `[data-hero-logo]` to anti-FOUC opacity:0 rule + transform-init rule + reduced-motion reset
2. Remove all `[data-hero-gallery]` rules (lines 139, 153, 165 — gallery selector deleted)
3. Header default state on home → transparent / no border / no shadow when **NOT** `.scrolled`
4. Header `.scrolled` state unchanged (already solid)
5. No regression on product pages (header default state needs body-class gating or page-scoped rule)

## Architecture

### Anti-FOUC block ([global.css:136-153](../../src/styles/global.css#L136))

```css
.js [data-reveal],
.js [data-stagger-item],
.js [data-hero-meta],
.js [data-hero-logo],            /* NEW */
.js [data-hero-title],
.js [data-hero-tagline],
.js [data-hero-price],
.js [data-feature-image],
.js [data-feature-content] {
  opacity: 0;
}
.js [data-reveal] { transform: translateY(24px); }
.js [data-stagger-item] { transform: translateY(22px); }
.js [data-hero-meta] { transform: translateY(-8px); }
.js [data-hero-logo] { transform: translateY(-12px); }   /* NEW */
.js [data-hero-title],
.js [data-hero-tagline],
.js [data-hero-price] { transform: translateY(16px); }
/* DELETE: .js [data-hero-gallery] { transform: scale(0.97); } */
```

### Reduced-motion block ([global.css:162-173](../../src/styles/global.css#L162))

```css
.js [data-reveal],
.js [data-stagger-item],
.js [data-hero-meta],
.js [data-hero-logo],            /* NEW */
.js [data-hero-title],
.js [data-hero-tagline],
.js [data-hero-price],
.js [data-feature-image],
.js [data-feature-content] {
  opacity: 1 !important;
  transform: none !important;
}
/* DELETE [data-hero-gallery] line */
```

### Header transparent-over-hero (new rule)

```css
/* Home page hero overlay: header transparent until scrolled.
 * Gate by body[data-page="home"] OR a section preceding header — use body data attribute. */
body[data-page="home"] header[data-header]:not(.scrolled) {
  background-color: transparent;
  border-bottom-color: transparent;
  box-shadow: none;
}
```

OR (simpler — page-agnostic, relies on `.scrolled` toggling at scroll > 24px which is already inside hero on home):

```css
header[data-header]:not(.scrolled) {
  background-color: transparent;
  border-bottom-color: transparent;
}
header[data-header] {
  background-color: color-mix(in oklch, var(--color-bg) 85%, transparent);  /* current default — moves to .scrolled state */
}
```

**Decision required:** Page-scoped (safer, no product-page regression) vs global (simpler). Recommend **page-scoped** — add `data-page="home"` to body in `MainLayout` when route is `/`.

## Related Code Files

- [src/styles/global.css:136-174](../../src/styles/global.css#L136) — anti-FOUC + reduced-motion blocks
- [src/styles/global.css:179-188](../../src/styles/global.css#L179) — existing header sticky + scrolled rules
- [src/layouts/MainLayout.astro](../../src/layouts/MainLayout.astro) — needs `data-page` attribute on body (verify current state)
- [src/components/Header.astro:32](../../src/components/Header.astro#L32) — `bg-[--color-bg]/85 backdrop-blur` inline Tailwind utility (NEEDS REMOVAL or CSS override)

## Implementation Steps

1. **(required)** Open [src/styles/global.css](../../src/styles/global.css)
2. **(required)** In anti-FOUC selector list (line 136-144): add `.js [data-hero-logo],` line. Remove `.js [data-hero-gallery],` line
3. **(required)** Remove `.js [data-hero-gallery] { transform: scale(0.97); }` (line 153)
4. **(required)** Add `.js [data-hero-logo] { transform: translateY(-12px); }` rule (sibling to data-hero-meta)
5. **(required)** In reduced-motion block (line 162-173): add `.js [data-hero-logo],` line. Remove `.js [data-hero-gallery],` line
6. **(required)** Decide header strategy. If page-scoped:
   - Edit `src/layouts/MainLayout.astro` to add `data-page={Astro.url.pathname === '/' ? 'home' : 'inner'}` on `<body>`
   - Add CSS rule: `body[data-page="home"] header[data-header]:not(.scrolled) { background: transparent; border-bottom-color: transparent; box-shadow: none; backdrop-filter: none; }`
7. **(required)** Override or remove inline Tailwind `bg-[--color-bg]/85 backdrop-blur` on Header.astro line 32 — those compete with CSS rule. Options:
   - Strip those classes, let CSS rule handle default state (cleaner)
   - OR keep utility but increase specificity in CSS (`!important`)
   - Recommend: **strip** + drive entirely from CSS
8. **(optional)** Add transition rule for `backdrop-filter` to smooth scrim fade — already part of existing header transition list, verify
9. **(optional)** Light theme video frame may be bright → consider stronger scrim. Use `--overlay-strong` instead of `--overlay-medium` on light. Defer to QA.

## Todo

- [x] Add `[data-hero-logo]` to anti-FOUC opacity-0 selector list
- [x] Add `[data-hero-logo]` transform-init rule (`translateY(-12px)`)
- [x] Add `[data-hero-logo]` to reduced-motion reset list
- [x] Remove all `[data-hero-gallery]` references (3 locations)
- [x] Add `data-page` attribute to body in MainLayout (`pageKind` derived from `Astro.url.pathname`)
- [x] Add page-scoped transparent-header CSS rule (`body[data-page="home"] header[data-header]:not(.scrolled)`)
- [x] Remove inline `bg-[--color-bg]/85 backdrop-blur border-b border-[--color-border]` from Header.astro line 32 (moved to CSS)
- [x] Add CSS rule for default `header[data-header]` surface (replicates the removed Tailwind utility) + `.scrolled` boost retained
- [ ] Verify product-page header still solid by default — needs visual check by user (Phase 05)

## Success Criteria

- No `data-hero-gallery` references in global.css
- Home page: header transparent at scroll=0, solid bg after scroll>24px
- Product pages: header solid by default (no regression)
- Reduced-motion: hero overlay items all visible immediately

## Risk Assessment

- **Med**: Header.astro currently uses inline Tailwind for bg — removing may break product pages if CSS rule incomplete. Test both page types.
- **Low**: `.scrolled` toggle relies on `stickyHeaderProgress()` which is in animations.ts and **does not** run under reduced motion ([animations.ts:35-38](../../src/scripts/animations.ts#L35)). On reduced-motion → header stays transparent forever on home. **Fix in Phase 04**: move `stickyHeaderProgress()` out of reduced-motion gate.

## Security Considerations

- N/A (pure styling)

## Next Steps

→ Phase 04 must address reduced-motion + `stickyHeaderProgress()` gating
→ Phase 05 visual QA verifies scrim contrast across theme + video frames

## Unresolved Questions

- `data-page` attribute already present in MainLayout? (Verify — if yes, just consume; if no, add. Affects 1 line of layout code)
- Should `.scrolled` threshold remain 24px or increase to ~80vh on home (so header turns solid only at end of hero)? UX call
- Light theme + bright video frame → adjust scrim opacity or apply CSS `filter: brightness(0.7)` to video? Defer
