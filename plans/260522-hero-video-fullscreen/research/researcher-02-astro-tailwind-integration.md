# Research: Astro 5 + Tailwind v4 HTML5 Video Integration

**Date:** 2026-05-22 | **Stack:** Astro 5.18.1, Tailwind 4.3.0, Motion 12.38.0

---

## Executive Summary

HTML5 video in Astro 5 requires strategic decisions on asset placement (`public/` vs `src/assets/`), View Transitions handling with `transition:persist`, and Tailwind v4's new OKLCH gradient system for overlays. Video should generally reside on CDN or use `public/` for unprocessed delivery to avoid build bloat. `transition:persist` prevents video restart on ClientRouter navigation. Tailwind v4 provides native `bg-linear-*/OKLCH` gradients ideal for dark overlays. Motion.dev's `inView` + `stagger` enable entrance animations without blocking LCP via poster image optimization.

---

## Key Findings

### 1. Asset Placement Strategy

**Public Directory:**
- Files served as-is, no bundling/hashing
- No optimization, no responsive variants
- Ideal for video: copy to `dist/` unchanged
- Small build footprint (copy vs process)

**src/assets Directory:**
- Bundled, transformed, optimized by Astro
- Hashed filenames for cache-busting
- Not suitable for videos (large files, no processing benefit)

**CDN (Recommended):**
- Move videos off local filesystem entirely
- Reduces build size significantly
- Cache headers, geographic distribution
- Best practice for hero video >5MB

**Decision:** Hero video → CDN or `public/videos/` (not `src/assets/`)

---

### 2. View Transitions + Video Behavior

**Default Behavior (No transition:persist):**
- Video restarts on page navigation
- DOM rebuilt, media elements re-instantiated
- Playback state lost

**With `transition:persist`:**
- Video element preserved across navigation
- Playback continues uninterrupted
- Attribute: `<video transition:persist>`
- Works with ClientRouter (enabled via `<ClientRouter />` in layout)

**Script Re-execution Risk:**
- Bundled module scripts execute once then ignored on transitions
- Solution: Use event listeners (`astro:after-swap`) to re-run animation setup
- Check navigation event: `document.addEventListener('astro:before-navigate')`

**For Hero Entrance Animation:**
- `transition:persist` on video element
- Separate animation script runs on `astro:after-swap` event
- Selectors `[data-hero-meta]`, `[data-hero-gallery]` etc. must survive DOM swap

---

### 3. Tailwind v4 Overlay Utilities

**Gradient Syntax (v4 breaking change):**
```html
<!-- v3 -->
<div class="bg-gradient-to-r from-black to-transparent"></div>

<!-- v4 -->
<div class="bg-linear-to-r from-black to-transparent"></div>
```

**OKLCH Color Interpolation:**
- Default: `bg-linear-to-r/oklch` (smoother, more vibrant)
- Explicit: `bg-linear-to-r/srgb` (v3 style, RGB interpolation)
- OKLCH: perceptually uniform, avoids muddy midtones
- Browser support: All modern browsers (2025)

**Overlay Pattern with Global OKLCH Variables:**
```css
/* global.css (using your existing --overlay-* vars) */
@property --overlay-strong { ... }  /* e.g., oklch(20% 0.1 0) = dark semi-transparent */
@property --overlay-medium { ... }  /* oklch(30% 0.08 0) */
@property --overlay-soft { ... }    /* oklch(50% 0.05 0) */
```

```html
<div class="relative">
  <video class="w-full aspect-video"></video>
  <!-- Overlay: absolute positioning + gradient -->
  <div class="absolute inset-0 bg-linear-to-t from-[var(--overlay-strong)] to-[var(--overlay-soft)]/0 backdrop-blur-sm"></div>
  <!-- Logo + text: z-10 positioning -->
  <div class="absolute inset-0 flex items-center justify-center z-10">
    <img src="/logos/art-color.png" alt="Art Color" class="w-20 h-auto" />
  </div>
</div>
```

**Backdrop Filters (v4):**
- `backdrop-blur-sm`, `backdrop-blur-md` built-in
- Combines with gradients: `backdrop-blur-sm` applies to overlay + underlying video
- Dark theme: Use dark OKLCH for `--overlay-strong`; light theme uses lighter shade

---

### 4. Responsive Video Delivery (Mobile vs Desktop)

**Source Media Queries (HTML-native):**
```html
<video class="w-full aspect-video" poster="/posters/hero-mobile.avif">
  <!-- Mobile: 480p, 2MB WebM -->
  <source src="/videos/hero-mobile.webm" type="video/webm" media="(max-width: 768px)">
  
  <!-- Desktop: 1080p, 8MB WebM -->
  <source src="/videos/hero-desktop.webm" type="video/webm" media="(min-width: 769px)">
  
  <!-- Fallback -->
  <source src="/videos/hero.mp4" type="video/mp4">
</video>
```

**Alternative Pattern (CSS-based visibility):**
```html
<video class="block md:hidden" src="/videos/hero-mobile.webm"></video>
<video class="hidden md:block" src="/videos/hero-desktop.webm"></video>
```

**LCP Optimization Critical:**
- Poster image **must** be responsive (use `<picture>` before `<video>`)
- Remove `poster=""` attribute from `<video>` (causes LCP flag)
- Serve mobile poster as tiny AVIF (<50KB) above fold
- Don't lazy-load hero video (kills LCP measurement)

---

### 5. Motion.dev Integration Pattern

**TypeScript Animation Setup (`src/scripts/animations.ts`):**

```typescript
import { animate, inView, stagger } from 'motion';

export function heroEntrance() {
  // Clear old selectors
  const oldHeroElements = document.querySelectorAll(
    '[data-hero-meta], [data-hero-gallery], [data-hero-title], [data-hero-tagline], [data-hero-price]'
  );
  oldHeroElements.forEach(el => {
    // Cleanup if needed (remove listeners, abort animations)
  });

  // New selectors for video hero overlay
  const heroLogo = document.querySelector('[data-hero-logo]');
  const heroText = document.querySelector('[data-hero-text]');

  if (!heroLogo || !heroText) return;

  // Fade-in + slide-up with stagger
  animate(
    [heroLogo, heroText],
    { opacity: [0, 1], y: [20, 0] },
    {
      duration: 0.8,
      delay: stagger(0.15),  // 150ms between elements
      easing: 'ease-out'
    }
  );

  // Scroll-triggered animation for overlay text
  inView('[data-hero-subtitle]', () => {
    return animate(
      '[data-hero-subtitle]',
      { opacity: [0, 1], x: [-20, 0] },
      { duration: 0.6 }
    );
  });
}

// Re-run on View Transitions
document.addEventListener('astro:after-swap', () => {
  heroEntrance();
});

// Initial load
heroEntrance();
```

**Module Script Integration:**
- Place in `<script>` tag with `type="module"` (not bundled)
- Or import in Astro component with `<script is:inline>`
- Use `astro:after-swap` event to re-run after navigation

**Best Practices:**
- `inView` triggers at 25% visibility by default
- `stagger()` function creates sequential delays
- `spring` easing available: `{ type: 'spring', stiffness: 100 }`
- Don't block page load: motion animations are non-blocking

---

### 6. Dark/Light Theme Overlay

**OKLCH Strategy:**
```css
/* light theme */
:root {
  --overlay-strong: oklch(20% 0.1 0);      /* nearly black, semi-transparent */
  --overlay-medium: oklch(35% 0.08 0);
  --overlay-soft: oklch(60% 0.05 0);
}

/* dark theme */
html[data-theme="dark"] {
  --overlay-strong: oklch(15% 0.08 0);     /* darker black for dark bg */
  --overlay-medium: oklch(30% 0.06 0);
  --overlay-soft: oklch(55% 0.03 0);
}
```

**Gradient Application:**
- Use CSS variables in Tailwind: `from-[var(--overlay-strong)]`
- Interpolation mode auto-applies OKLCH per v4 default
- Backdrop blur applies to both overlay + video contrast

---

## Implementation Checklist

- [ ] Place video in `public/videos/` or CDN (not `src/assets/`)
- [ ] Create mobile + desktop variants (WebM, 480p/1080p)
- [ ] Add responsive poster image via `<picture>` element
- [ ] Apply `transition:persist` to `<video>` tag
- [ ] Update `heroEntrance()` in `src/scripts/animations.ts` with new selectors
- [ ] Add `astro:after-swap` listener for re-running animations
- [ ] Define OKLCH overlay colors in `global.css` with theme variants
- [ ] Use `bg-linear-to-t from-[var(--overlay-strong)]` for gradient
- [ ] Test: mobile video loads, LCP <2.5s, animations run smoothly post-navigation

---

## Resources

- [Astro Images Guide](https://docs.astro.build/en/guides/images/)
- [Astro View Transitions Docs](https://docs.astro.build/en/guides/view-transitions/)
- [Astro Configuration Reference](https://docs.astro.build/en/reference/configuration-reference/)
- [Tailwind CSS v4 Blog](https://tailwindcss.com/blog/tailwindcss-v4)
- [Motion.dev inView Docs](https://motion.dev/docs/inview)
- [Motion.dev Stagger Docs](https://motion.dev/docs/stagger)
- [Responsive HTML5 Video Guide](https://imagekit.io/blog/responsive-html5-video/)
- [CSS Media Queries for Video Source](https://blog.stephaniestimac.com/posts/2023/12/css-media-video-source/)
- [Netlify: Motion with Astro](https://developers.netlify.com/guides/motion-animation-library-with-astro/)

---

## Unresolved Questions

1. **Video codec strategy:** Should use VP9 (better compression) vs WebM (wider support)? Need to test mobile device support.
2. **Poster timing:** When exactly does `<picture>` poster load vs video? Does poster block LCP if not in viewport initially?
3. **ClientRouter lifecycle:** Exact timing of `astro:before-navigate` vs `astro:after-swap`—which fires before/after DOM swap?
4. **Motion scroll integration:** Can `scroll()` function work with video playback timeline (scrub video with scroll)?
5. **Build optimization:** Should Astro have explicit config for large media assets (e.g., `assets.maxInlineSize`)?
6. **Theme switching:** Does OKLCH interpolation change mid-animation if user toggles dark mode during entrance? Test needed.
