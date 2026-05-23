# Hero Section — Full-Screen Video Overlay

**Date:** 2026-05-22 | **Owner:** Frontend | **Stack:** Astro 5.18.1 + Tailwind 4.3.0 + Motion 12.38.0

## Task Summary

Replace homepage hero from grid (text + 4 product images) to full-bleed 100vh video background with transparent header overlay + centered logos (Art Color, Technogym), "Wellness Living" headline + dual CTA. Header fades from transparent to solid on scroll past hero. Video placeholder paths used; assets ship later.

## Locked Decisions

1. **Layout** = `h-screen` (100vh) full-bleed, `position: relative`, header z-50 overlays video
2. **Header** = transparent on hero (mix-blend or `bg-transparent`), `.scrolled` class triggers solid `bg-[--color-bg]/85 backdrop-blur` — reuse existing scroll trigger ([animations.ts:104-107](../../src/scripts/animations.ts#L104))
3. **CTAs retained** below "Wellness Living" — same `<CtaButton>` component
4. **Video** = `/videos/hero-bg.mp4` + `.webm` + poster `/videos/hero-poster.jpg` (placeholder paths). Fallback = dark `--color-bg` + poster bg-image so layout never breaks if asset 404s
5. **Selectors** = keep `[data-hero]` + `[data-hero-meta|title|tagline|price]`, **drop** `[data-hero-gallery]`. Add new `[data-hero-logo]`
6. **Animations** = delete `heroParallax()` entirely; `heroEntrance()` refactored to 4-item stagger; remove gallery selector from `unhideAll()`
7. **Theme** = video unchanged across light/dark; overlay scrim uses `--overlay-strong` (already theme-aware)

## Phases

| # | File | Status | Progress |
|---|------|--------|----------|
| 01 | [phase-01-assets.md](./phase-01-assets.md) | done (asset code) | 100% — placeholder poster + real video pending design |
| 02 | [phase-02-homehero-rewrite.md](./phase-02-homehero-rewrite.md) | done | 100% |
| 03 | [phase-03-css-updates.md](./phase-03-css-updates.md) | done | 100% |
| 04 | [phase-04-animations.md](./phase-04-animations.md) | done | 100% |
| 05 | [phase-05-testing-qa.md](./phase-05-testing-qa.md) | pending | 0% — needs `pnpm dev`/browser run by user (node not on this machine) |

## Implementation Notes (2026-05-22)

- `art-color.png` is 100×101 and `technogym.png` is 137×48. At `h-12 md:h-16` they will look soft on Retina. Surface to design — request ≥ 800px-wide PNG or SVG variants. Tracked in phase-05 todo.
- Hero section uses `h-screen min-h-[100dvh] -mt-16` — `dvh` fallback addresses iOS URL bar collapse; `-mt-16` (`-4rem`) pulls section under the sticky `h-16` header.
- Header now drives all surface styling from CSS (transparent over home hero via `body[data-page="home"] header:not(.scrolled)`). Inline Tailwind `bg-[--color-bg]/85 backdrop-blur border-b` removed from `Header.astro:32`.
- `heroParallax()` deleted entirely; `stickyHeaderProgress()` moved out of the reduced-motion gate so accessibility users still get the solid header state when scrolling.
- `transition:persist` on `<video>` — Astro ClientRouter keeps playback alive across navigations.

## Key References

- Research video best practices: [research/researcher-01-video-hero-bestpractices.md](./research/researcher-01-video-hero-bestpractices.md)
- Research Astro 5 + Tailwind 4: [research/researcher-02-astro-tailwind-integration.md](./research/researcher-02-astro-tailwind-integration.md)
- Impact scout: [scout/scout-01-hero-impact.md](./scout/scout-01-hero-impact.md)
- Current hero: [src/components/sections/HomeHero.astro](../../src/components/sections/HomeHero.astro)
- Animation engine: [src/scripts/animations.ts](../../src/scripts/animations.ts)
- Anti-FOUC + reduced-motion CSS: [src/styles/global.css:133-174](../../src/styles/global.css#L133)
- Sticky CTA observer: [src/scripts/stickyCta.ts](../../src/scripts/stickyCta.ts)
- Header: [src/components/Header.astro:32](../../src/components/Header.astro#L32)

## Risks (high-level)

- LCP regression from large video → poster + `preload="metadata"` + WebM mobile variant
- iOS autoplay quirks → `muted playsinline` + poster mandatory
- Header transparent state contrast with light theme video → verify scrim
- Sticky CTA observer behavior unchanged (still watches `[data-hero]`)

## Unresolved Questions (rolled up from phases)

- Video asset source (CDN vs `public/`)? Defer to ops.
- Mobile-specific shorter video variant needed at launch? (Phase 01)
- Header transparent state on `light` theme — text contrast over bright video frame? (Phase 03)
