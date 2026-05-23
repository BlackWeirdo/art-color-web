# Scout Report: Hero Section Replacement Impact
Date: 2026-05-22 | Scope: Change HomeHero.astro from grid to full-screen video with overlay

## FILES TO MODIFY

### 1. src/components/sections/HomeHero.astro (PRIMARY TARGET)
- Line 9: Section tag has `id="hero" data-hero class="px-4 md:px-8 ..."`
- Lines 10-58: Grid layout (2 cols: text left + gallery right)
- Lines 2-3: Imports `products` from data/product.ts, `BRAND` from data/site.ts
- Line 6: Uses `featured = products.slice(0, 4)`
- Selectors used: `#hero`, `data-hero`, `data-hero-meta` (line 12), `data-hero-title` (line 17), `data-hero-tagline` (line 23), `data-hero-price` (line 28), `data-hero-gallery` (line 34)
- ACTION: Replace grid with full-screen video element; overlay with logos + text

### 2. src/styles/global.css (ANIMATION SETUP)
- Lines 138-146: Anti-FOUC hidden selectors include `.js [data-hero-meta]`, `.js [data-hero-gallery]`, `.js [data-hero-title]`, `.js [data-hero-tagline]`, `.js [data-hero-price]`
- Lines 149-153: Initial transforms for hero elements (scale 0.97 for gallery, translateY for others)
- Lines 162-173: Reduced-motion resets for same selectors
- ACTION: Keep selectors if reusing; remove gallery scale rule (line 153)

### 3. src/scripts/animations.ts (HERO ANIMATIONS)
- Line 20: unhideAll() queries `[data-hero-meta]`, `[data-hero-gallery]`, `[data-hero-title]`, `[data-hero-tagline]`, `[data-hero-price]`
- Lines 50-68: heroEntrance() function - animate 5 items:
  * Line 52: `[data-hero-meta]` y:-8, delay:0.05
  * Line 53: `[data-hero-gallery]` scale:0.97, delay:0.1 (REMOVE this item)
  * Line 54: `[data-hero-title]` y:18, delay:0.18
  * Line 55: `[data-hero-tagline]` y:14, delay:0.28
  * Line 56: `[data-hero-price]` y:16, delay:0.38
- Lines 72-97: heroParallax() function targets gallery for scroll parallax (REMOVE entire function)
- Line 41: heroParallax() is called in initAnimations (remove this call)
- ACTION: Remove gallery from entrance array; delete heroParallax() function + its call

### 4. src/components/sections/PriceCTA.astro (SECONDARY - CONDITIONAL)
- Line 18: Has `data-hero-price` attribute
- NOTE: Used in product page hero, not HomeHero
- ACTION: No changes needed (only on product pages)

## FILES TO READ (CONTEXT ONLY)

### src/pages/index.astro
- Line 3: Imports HomeHero component
- Line 17: Renders `<HomeHero />`
- No changes needed

### src/scripts/stickyCta.ts
- Line 6: Watches `[data-hero]` element for IntersectionObserver
- Lines 53-59: Hides sticky CTA when hero is visible
- ACTION: No changes - works if section keeps id="hero" data-hero

### src/components/Header.astro
- Line 32: Sticky header at top-0 z-50 h-16 (64px)
- No hero height assumptions
- ACTION: No changes

### src/layouts/MainLayout.astro
- Line 80: Body has min-h-screen (ensures page fills viewport)
- No hero-specific rules
- ACTION: No changes

### src/components/sections/Hero.astro (PRODUCT DETAIL PAGE - DIFFERENT!)
- Lines 13-14: Has `id="hero" data-hero` attributes
- Line 18: Has `data-hero-gallery` for product images (separate component)
- IMPORTANT: This is NOT the homepage hero; do not confuse
- ACTION: No changes needed

### src/data/site.ts
- Line 2: `export const BRAND = 'Art Color'`
- Defines company name used in overlay
- ACTION: No changes

## ASSET GAPS

1. public/videos/hero-bg.mp4 - DOES NOT EXIST
   - Spec: 1920x1080+ H.264, <20MB, muted+autoplay+loop
   - Comment in public/videos/.gitkeep (lines 1-3) explains format
   - ACTION: Create/provide hero background video file

2. public/logos/art-color.png - EXISTS
   - Current: h-8/h-10 (header use)
   - For overlay: may need larger export (h-20 to h-32 for full-screen)
   - ACTION: Verify scaling or provide higher-res version

3. public/logos/technogym.png - EXISTS
   - Current: h-7/h-9 (header use)
   - For overlay: may need larger export
   - ACTION: Verify scaling or provide higher-res version

4. "Wellness Living" text - no asset needed (HTML+CSS text)

## SELECTOR TRACKING

| Selector | Location | Keep? | Update? |
|----------|----------|-------|---------|
| #hero | HomeHero.astro:9 | YES | Keep on video container |
| data-hero | HomeHero.astro:9 | YES | Keep on video container |
| data-hero-meta | HomeHero.astro:12, global.css:138,149,164, animations.ts:20,52 | YES | Keep if overlay has meta |
| data-hero-title | HomeHero.astro:17, global.css:140,150,166, animations.ts:20,54 | YES | Keep if overlay has title |
| data-hero-tagline | HomeHero.astro:23, global.css:141,151,166, animations.ts:20,55 | YES | Keep if overlay has tagline |
| data-hero-price | HomeHero.astro:28, global.css:142,152,167, PriceCTA:18, animations.ts:20,56 | YES | Keep for CTA buttons |
| data-hero-gallery | HomeHero.astro:34, global.css:139,153,165, animations.ts:20,53,73 | DELETE | Remove from all files |

## EXECUTION STEPS

1. Create public/videos/hero-bg.mp4 asset
2. Rewrite HomeHero.astro: full-screen video + overlay DOM with same data-hero-* selectors
3. Update global.css: keep selectors, remove .js [data-hero-gallery] rules + scale rule on line 153
4. Update animations.ts:
   - Remove item 2 from heroEntrance() array (gallery line 53)
   - Delete heroParallax() function entirely (lines 72-97)
   - Remove heroParallax() call (line 41)
   - Update unhideAll() query to exclude gallery
5. Test animations, sticky CTA, header interaction on mobile/desktop
6. Verify header scroll detection (stickyHeaderProgress) still works with new section height

## RISKS

1. Section height changes (content-flow to 100vh) may shift scroll positions
2. Full-screen video on mobile needs careful design (aspect ratio, fallback)
3. If heroParallax() is referenced elsewhere, code will break (unlikely)
4. Logo visibility on video background (contrast, placement)

