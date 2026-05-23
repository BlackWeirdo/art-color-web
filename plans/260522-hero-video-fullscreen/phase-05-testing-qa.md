# Phase 05 — Testing & QA

## Context Links

- Parent: [plan.md](./plan.md)
- Deps: Phases 01-04 complete
- Research: [research/researcher-01-video-hero-bestpractices.md](./research/researcher-01-video-hero-bestpractices.md) (iOS quirks, LCP, accessibility)

## Overview

- **Date:** 2026-05-22
- **Description:** Cross-device + cross-browser smoke + accessibility verification. Gate: no regression on sticky CTA, View Transitions, product pages, reduced motion, theme toggle.
- **Priority:** P0 (release gate)
- **Implementation status:** pending (handed back to user — node CLI not installed on this machine)
- **Review status:** not reviewed

## Key Insights

- iOS Safari: `muted autoplay loop playsinline` + poster mandatory; Low Power Mode may still block — accept poster as fallback (no manual play button at launch — YAGNI)
- LCP candidate is now the video poster (above-fold image) — not the video itself
- View Transitions in Astro 5: video has `transition:persist` (Phase 02) — should not flash
- Theme toggle should not affect video playback; scrim should swap colors smoothly
- Sticky CTA still anchored to `[data-hero]` IntersectionObserver

## Requirements

1. Desktop browsers tested: Chrome, Firefox, Safari (latest)
2. Mobile tested: iOS Safari (real device or BrowserStack), Android Chrome
3. Accessibility: keyboard navigation, screen reader skip-link, reduced-motion, focus rings
4. Performance: LCP < 2.5s on Fast 4G, CLS < 0.1
5. No console errors / warnings during page load + navigation

## Architecture

### Test Matrix

| Scenario | Browser | Expected |
|---|---|---|
| Home load (cold) | Chrome desktop | Video autoplays muted, overlay text staggers in, header transparent |
| Home load (cold) | iOS Safari real | Poster visible immediately, video autoplays muted, overlay text instant or staggered |
| Scroll past hero | Any | Header transitions to solid bg + shadow; sticky CTA slides up |
| Scroll back to top | Any | Header transparent; sticky CTA slides down |
| Reduced motion ON | Chrome (DevTools) | No stagger animation; all overlay items visible at load; header still toggles solid on scroll |
| Theme toggle (dark → light) | Any | Video unchanged; scrim opacity holds text legible; smooth bg transition (no flash) |
| Navigate Home → Product → Home (View Transitions) | Chrome | Video does NOT restart (transition:persist); overlay re-animates OR persists |
| Slow 3G throttle | Chrome | Poster shows fast; video loads progressively without layout shift |
| Keyboard tab | Any | CTAs receive focus ring; header logo + nav reachable; no trap |
| Screen reader (NVDA/VoiceOver) | Chrome+NVDA / Safari+VO | Video ignored (aria-hidden); H1 "Wellness Living" read; CTAs announced |
| Light mode + bright video frame | Any | Scrim strong enough to keep white text legible (manual judgement) |
| iOS Low Power Mode | iPhone | Poster visible (acceptable fallback) |

## Related Code Files

- All Phase 01-04 touched files
- [src/components/sections/HomeHero.astro](../../src/components/sections/HomeHero.astro)
- [src/styles/global.css](../../src/styles/global.css)
- [src/scripts/animations.ts](../../src/scripts/animations.ts)
- [src/components/Header.astro](../../src/components/Header.astro)

## Implementation Steps

1. **(required)** Run `pnpm dev` → verify home page renders without console errors
2. **(required)** Run `pnpm build` → confirm no TS errors, no Astro warnings
3. **(required)** Manual desktop smoke (Chrome, Firefox, Safari) — Test Matrix rows 1, 3, 4
4. **(required)** Manual mobile smoke (iOS Safari + Android Chrome) — rows 2, 3
5. **(required)** DevTools → Rendering → Emulate `prefers-reduced-motion: reduce` → reload home, verify row 5
6. **(required)** Toggle theme button → verify row 6
7. **(required)** Click product link, then back → verify row 7 (video persistence)
8. **(required)** DevTools Network → Slow 3G → reload → verify row 8 (no CLS)
9. **(required)** Keyboard-only navigation → row 9
10. **(optional)** Screen reader pass — row 11 (requires NVDA/VO setup)
11. **(required)** Lighthouse audit (mobile preset) — verify LCP, CLS, accessibility ≥ 95
12. **(required)** Test on `light` theme — capture screenshot, judge scrim contrast
13. **(required)** Verify sticky CTA mobile bar appears/hides correctly (scroll past hero on mobile viewport)
14. **(required)** Run `pnpm astro check` — zero errors

## Todo

### Pre-flight (run on a machine with Node 22+)
- [ ] `pnpm install` (if not yet)
- [ ] `pnpm dev` clean load + no console errors
- [ ] `pnpm build` succeeds
- [ ] `pnpm astro check` zero errors

### Manual smoke (in browser)
- [ ] Desktop Chrome smoke pass
- [ ] Desktop Firefox smoke pass
- [ ] Desktop Safari smoke pass
- [ ] iOS Safari real-device smoke pass
- [ ] Android Chrome smoke pass
- [ ] Reduced-motion emulation pass (header still toggles solid)
- [ ] Theme toggle dark ↔ light pass
- [ ] View Transitions home ↔ product pass (video persists)
- [ ] Slow 3G throttle pass (no CLS)
- [ ] Keyboard nav pass
- [ ] Sticky CTA show/hide pass on mobile
- [ ] Lighthouse mobile LCP < 2.5s
- [ ] Lighthouse CLS < 0.1
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Manual contrast check on light theme video frame
- [ ] (optional) Screen reader pass
- [ ] Product pages NOT regressed (Hero.astro on PDP still works)

### Design follow-ups (logos under-spec'd)
- [ ] Replace `public/logos/art-color.png` with a ≥800px-wide PNG **or** SVG (current 100×101 too small for `h-12 md:h-16` overlay use)
- [ ] Replace `public/logos/technogym.png` with the dealer-portal authorized SVG (current 137×48; trademark constraints per `public/logos/README.md:40-48`)
- [ ] Drop `public/videos/hero-poster.jpg` (1920×1080 JPEG q75, 150-300 KB) — until then the hero shows a black frame until video decodes
- [ ] Drop `public/videos/hero-bg.mp4` + optional `hero-bg.webm` per `.gitkeep` spec

## Success Criteria

- All required Todo items checked
- No console errors in any tested browser
- Lighthouse thresholds met
- Sticky CTA logic unchanged
- Product pages render unchanged

## Risk Assessment

- **High**: real video file size on launch may blow LCP budget. Mitigation: poster + WebM mobile variant; verify with throttled Lighthouse
- **Med**: iOS Safari autoplay fails silently on some Low Power Mode states → poster acceptable; document as known limitation
- **Med**: light theme + bright video frame → scrim may be too soft. Mitigation: bump to `--overlay-strong` if QA fails
- **Low**: View Transitions video flash on first navigation (`transition:persist` only persists within client-side router — first hard load always restarts)

## Security Considerations

- Verify Technogym logo file matches authorized dealer asset
- Confirm `aria-hidden="true"` on video → no false "video" landmark for screen readers
- No third-party tracking pixels in video tag

## Next Steps

→ Hand-off to design for real video file
→ Open follow-up tickets for any unresolved Lighthouse issues
→ If LCP fails → add `<link rel="preload" as="image" href="/videos/hero-poster.jpg" fetchpriority="high">` in MainLayout head

## Unresolved Questions

- Acceptable LCP target on Cloudflare Pages edge? Need baseline measurement before/after
- Should "Tap to play" fallback button be added for iOS Low Power Mode? Currently NO (YAGNI); revisit if user reports
- Browser support matrix officially documented anywhere? (Brand/legal — may not need IE11 etc.)
- Mobile vs desktop video variant required for launch, or can desktop video stream to mobile with poster only? Cost vs polish trade-off.
