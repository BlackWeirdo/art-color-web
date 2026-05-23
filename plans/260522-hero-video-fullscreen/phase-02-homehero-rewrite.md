# Phase 02 — HomeHero.astro Rewrite

## Context Links

- Parent: [plan.md](./plan.md)
- Deps: Phase 01 (asset filenames locked)
- Research: [research/researcher-01-video-hero-bestpractices.md](./research/researcher-01-video-hero-bestpractices.md) (HTML5 video attrs, accessibility)
- Research: [research/researcher-02-astro-tailwind-integration.md](./research/researcher-02-astro-tailwind-integration.md) (Tailwind 4 gradients, transition:persist)
- Scout: [scout/scout-01-hero-impact.md](./scout/scout-01-hero-impact.md) (selector table)

## Overview

- **Date:** 2026-05-22
- **Description:** Replace grid markup (text + 4 product images) with full-bleed `<video>` + absolute-positioned overlay containing logos, headline, CTAs. Drop product imports + `featured` slicing.
- **Priority:** P0 (core deliverable)
- **Implementation status:** done (2026-05-22)
- **Review status:** not reviewed

## Key Insights

- Section keeps `id="hero" data-hero` → sticky CTA observer ([stickyCta.ts:6](../../src/scripts/stickyCta.ts#L6)) keeps working untouched
- Full-bleed needs to escape parent `max-w-7xl` — section itself becomes width container, no `max-w-7xl mx-auto` on root
- Header is `sticky top-0 z-50` ([Header.astro:32](../../src/components/Header.astro#L32)) — video at z-0, overlay content z-10, header layer above naturally
- Retain `[data-hero-meta]`, `[data-hero-title]`, `[data-hero-tagline]`, `[data-hero-price]` selectors → CSS anti-FOUC + animations.ts reuse without churn (DRY)
- New selector `[data-hero-logo]` for logo cluster (Art Color + Technogym)
- `aria-hidden="true"` on `<video>` (decorative)
- Drop `products` + `featured` imports (no longer used)

## Requirements

1. Section fills viewport: `relative h-screen w-full overflow-hidden`
2. Video covers entire section: `absolute inset-0 w-full h-full object-cover`
3. Dark scrim: `absolute inset-0 bg-[--overlay-medium]` or gradient — readable white text
4. Overlay column: centered, flex-col, contains logos + "Wellness Living" + CTAs
5. CTAs use existing `<CtaButton>` (no new component)
6. Negative margin to undo `MainLayout` top padding if header sits above (verify — header sticky, not absolute, so no margin trick needed)
7. Theme-aware: video works in dark + light (scrim consistent)

## Architecture

```
<section id="hero" data-hero
         class="relative h-screen w-full overflow-hidden"
         style="margin-top: -4rem">  ← optional, pulls section under sticky header (header h-16=4rem)
                                     ← only if header NOT meant to consume layout space
  <video class="absolute inset-0 w-full h-full object-cover"
         autoplay muted loop playsinline preload="metadata"
         poster="/videos/hero-poster.jpg"
         aria-hidden="true"
         transition:persist>
    <source src="/videos/hero-bg.webm" type="video/webm" />
    <source src="/videos/hero-bg.mp4"  type="video/mp4" />
  </video>

  <!-- Scrim for text contrast -->
  <div class="absolute inset-0 bg-[--overlay-medium]" aria-hidden="true"></div>

  <!-- Overlay content -->
  <div class="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 md:px-8 text-white">
    <div data-hero-logo class="flex items-center gap-6 mb-8">
      <img src="/logos/art-color.png" alt="Art Color" class="h-12 md:h-16 w-auto" onerror="this.style.display='none'" />
      <span class="h-10 w-px bg-white/40" aria-hidden="true"></span>
      <img src="/logos/technogym.png" alt="Technogym" class="h-10 md:h-14 w-auto" onerror="this.style.display='none'" />
    </div>

    <p data-hero-meta class="text-xs md:text-sm uppercase tracking-[0.3em] text-white/80 font-semibold">
      Phân phối Technogym chính hãng
    </p>

    <h1 data-hero-title class="mt-4 text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95]">
      Wellness Living
    </h1>

    <p data-hero-tagline class="mt-6 text-lg md:text-xl text-white/85 max-w-2xl">
      Thiết bị fitness cao cấp cho gia đình, phòng tập chuyên nghiệp và doanh nghiệp.
    </p>

    <div data-hero-price class="mt-8 md:mt-10 flex flex-wrap gap-3 justify-center">
      <CtaButton href="#products">Khám phá sản phẩm</CtaButton>
      <CtaButton href="#contact" variant="outline" arrow={false}>Liên hệ tư vấn</CtaButton>
    </div>
  </div>
</section>
```

## Related Code Files

- [src/components/sections/HomeHero.astro](../../src/components/sections/HomeHero.astro) (full rewrite — 77 lines → ~50 lines)
- [src/components/ui/CtaButton.astro](../../src/components/ui/CtaButton.astro) (reused, untouched)
- [src/pages/index.astro:17](../../src/pages/index.astro#L17) (renders `<HomeHero />` — no change)
- [src/layouts/MainLayout.astro:80](../../src/layouts/MainLayout.astro#L80) (body min-h-screen — no change)

## Implementation Steps

1. **(required)** Open [src/components/sections/HomeHero.astro](../../src/components/sections/HomeHero.astro)
2. **(required)** Remove frontmatter imports: `products`, `featured` (keep `BRAND` only if used; current draft does NOT use it in overlay — remove). Keep `CtaButton` import
3. **(required)** Replace entire `<section>` body with structure in Architecture above
4. **(required)** Set section root: `class="relative h-screen w-full overflow-hidden"` — no `max-w-7xl`, no horizontal padding (full-bleed)
5. **(required)** Decide on header overlap technique:
   - **Option A** (recommended): keep header sticky, add `style="margin-top: -4rem"` to section so video starts at viewport top, header floats above. Adds `padding-top: 4rem` inside overlay to push content below header.
   - **Option B**: leave layout as-is, hero becomes `calc(100vh - 4rem)` and sits below header. Lose true full-bleed feel.
   - Choose **A** to honor "header đè lên video" requirement.
6. **(required)** Video element: `transition:persist` to survive View Transitions (Astro 5 ClientRouter)
7. **(required)** Add `aria-hidden="true"` to video + scrim div
8. **(required)** Logo cluster wrapped in `[data-hero-logo]` for animations.ts entrance stagger
9. **(optional)** Consider responsive video source via `<source media="(max-width: 768px)" src="/videos/hero-bg-mobile.webm">` — defer until Phase 01 produces mobile variant
10. **(required)** Verify no `data-hero-gallery` remains anywhere in file

## Todo

- [x] Remove `products` + `featured` imports from frontmatter
- [x] Rewrite section root to `relative w-full h-screen min-h-[100dvh] -mt-16 overflow-hidden` (added `dvh` + `-mt-16` for header overlap)
- [x] Add `<video>` with all attributes (`autoplay muted loop playsinline preload="metadata"` + `poster` + `aria-hidden` + `transition:persist`)
- [x] Add scrim layer — paired `bg-[var(--overlay-medium)]` + vertical gradient `from-[var(--overlay-soft)] via-transparent to-[var(--overlay-strong)]`
- [x] Add overlay flex container with z-10, padded `pt-16` to clear header
- [x] Add `[data-hero-logo]` cluster (Art Color + divider + Technogym)
- [x] Keep `[data-hero-meta]`, `[data-hero-title]`, `[data-hero-tagline]`, `[data-hero-price]`
- [x] Replace title text with "Wellness Living"
- [x] Update meta + tagline copy
- [x] Retain both CTAs with original copy
- [x] Apply Option A header overlap (`-mt-16` instead of inline style)
- [x] Manual check: no `data-hero-gallery` in file

## Success Criteria

- File compiles, no TypeScript/Astro errors
- Section fills viewport (visual check dev mode)
- All 4 retained selectors present
- New `[data-hero-logo]` selector present
- Sticky CTA still hides/shows correctly (Phase 05 verifies)
- View Transitions: navigate away + back, video does not flash-restart

## Risk Assessment

- **Med**: full-bleed under sticky header may misalign on iOS Safari (URL bar collapse changes 100vh). Mitigate with `dvh` units (`h-[100dvh]`) as fallback — defer to Phase 05 if seen.
- **Low**: logo images don't load in dev → `onerror` hides gracefully, text not shown (logos decorative; alt text reads to AT)

## Security Considerations

- Logos use `alt` — Technogym alt must remain "Technogym" (legally identifies trademark holder per dealer agreement)
- No external video URLs (avoid third-party tracking)
- No inline event handlers beyond existing `onerror` pattern (CSP-compatible if needed)

## Next Steps

→ Phase 03 (CSS) updates anti-FOUC selectors + adds transparent header rules
→ Phase 04 (Animations) refactors `heroEntrance()` for new selectors

## Unresolved Questions

- Mobile vs desktop video variants needed at launch? (Affects `<source media>` block)
- Use `h-screen` (vh) vs `h-[100dvh]` (dvh)? `dvh` safer on mobile but ~98% browser support
- Logo `art-color.png` may be dark — needs light variant for video overlay readability? Defer to visual QA
