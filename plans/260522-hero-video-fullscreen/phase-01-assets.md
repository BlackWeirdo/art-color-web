# Phase 01 — Asset Preparation

## Context Links

- Parent: [plan.md](./plan.md)
- Deps: none (foundational)
- Research: [research/researcher-01-video-hero-bestpractices.md](./research/researcher-01-video-hero-bestpractices.md) (codec, bitrate, poster)
- Scout: [scout/scout-01-hero-impact.md](./scout/scout-01-hero-impact.md) (asset gaps section)

## Overview

- **Date:** 2026-05-22
- **Description:** Document video spec + ship placeholder poster so dev environment renders without 404 cascade. Real video supplied later.
- **Priority:** P0 (blocks Phase 02 visual QA)
- **Implementation status:** done (code side) — placeholder poster + real video still owed by design
- **Review status:** not reviewed

## Key Insights

- Astro `public/` ships files as-is, no transform — correct location for video
- Without poster, iOS Safari shows black frame until first decode → mandatory
- Placeholder poster prevents broken-image icon during dev
- `.gitkeep` already documents expected format; expand it

## Requirements

1. Canonical filenames (case-sensitive — Cloudflare Linux): `hero-bg.mp4`, `hero-bg.webm`, `hero-poster.jpg`
2. Spec doc lists target bitrate, resolution, duration, file size cap
3. Dev does not see 404 spam (acceptable: `onerror` hides poster, video falls back to bg color)
4. Logos `art-color.png` + `technogym.png` already exist (per scout); only verify Retina scale

## Architecture

```
public/
  videos/
    .gitkeep         ← update with full spec
    hero-bg.mp4      ← (provided later — desktop primary)
    hero-bg.webm     ← (provided later — optional smaller alt)
    hero-poster.jpg  ← REQUIRED at launch; tiny placeholder OK
  logos/
    art-color.png    ← exists
    technogym.png    ← exists
```

## Related Code Files

- [public/videos/.gitkeep](../../public/videos/.gitkeep) — current spec note
- [public/logos/README.md](../../public/logos/README.md) — logo conventions
- [src/data/site.ts:2](../../src/data/site.ts#L2) — `BRAND` constant

## Implementation Steps

1. **(required)** Edit `public/videos/.gitkeep` → expand spec block:
   - Filename: `hero-bg.mp4` (H.264, 1920x1080, 24–30fps, 2.5–4 Mbps VBR, ≤ 8 MB target, 10–20s loop)
   - Filename: `hero-bg.webm` (VP9, same dimensions, 1.5–2.5 Mbps, ≤ 5 MB) — optional
   - Filename: `hero-poster.jpg` (1920x1080 first/representative frame, 150–300 KB, JPEG quality 75)
   - Attributes required at HTML level: `muted autoplay loop playsinline preload="metadata"`
2. **(required)** Drop placeholder `hero-poster.jpg` (any dark abstract image ~200KB) into `public/videos/`. **Do not** commit a real production poster yet — reserve filename.
3. **(optional)** If team has draft video already, drop it; otherwise leave note in `.gitkeep`.
4. **(required)** Verify `public/logos/art-color.png` natural width ≥ 400px (Retina). If not, flag in todo for design.
5. **(optional)** Consider `art-color-light.png` (white version) if dark logo readability over video poor — defer until visual QA Phase 05.

## Todo

- [x] Update `public/videos/.gitkeep` with expanded spec (mp4, webm, poster filenames + bitrate)
- [ ] Add placeholder `public/videos/hero-poster.jpg` — owed by user (binary file, cannot generate from text-only tool)
- [x] Inspect `art-color.png` natural dimensions → **100×101** (too small for `h-12 md:h-16` Retina). `technogym.png` is **137×48**.
- [x] Note logo dark/light variants + larger source files for design in phase-05 visual QA todo

## Success Criteria

- `.gitkeep` lists 3 filenames + spec
- `hero-poster.jpg` returns 200 in dev (not 404)
- Video file paths reserved (no other component blocks naming)

## Risk Assessment

- **Low**: pure asset scaffolding, no code change
- Real video oversized at launch → mitigated by Phase 05 LCP gate

## Security Considerations

- Technogym logo: ensure dealer-authorized version (legal — see `public/logos/README.md:40-48`)
- Video content: avoid copyrighted music; muted required regardless

## Next Steps

→ Phase 02 (HomeHero rewrite) consumes these asset paths

## Unresolved Questions

- Single video for mobile + desktop, or 2 variants? (Affects `<source media>` block in Phase 02)
- Final video source: CDN URL or `public/`? Default = `public/` until ops decides
