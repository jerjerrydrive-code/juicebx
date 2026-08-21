---
name: JuiceBx Design System
version: "3.2.0"
description: "Industrial hardware-grade tactile audio player combining Rabbit R1 teenage-engineering minimalism, iOS 28 fluid glassmorphism, and Juice WRLD 999 tribute visual aesthetics."
tokens:
  colors:
    brand:
      rabbit_orange: "#ff4f00"
      rabbit_orange_glow: "rgba(255, 79, 0, 0.45)"
      juice_purple: "#a855f7"
      juice_purple_glow: "rgba(168, 85, 247, 0.40)"
      cyan_electric: "#06b6d4"
      emerald_matrix: "#10b981"
      ruby_pulse: "#ef4444"
      amber_gold: "#f59e0b"
    background:
      dark_app: "color-mix(in srgb, var(--pal-4) 45%, #030408)"
      dark_panel: "color-mix(in srgb, var(--pal-4) 45%, #030408)"
      dark_card: "color-mix(in srgb, var(--pal-3) 26%, rgba(18, 19, 26, 0.72))"
      dark_card_solid: "color-mix(in srgb, var(--pal-4) 38%, #0d0e14)"
      dark_input: "color-mix(in srgb, var(--pal-4) 32%, rgba(27, 28, 38, 0.55))"
      dark_nav: "color-mix(in srgb, var(--pal-4) 42%, rgba(10, 11, 16, 0.88))"
      dark_mini: "color-mix(in srgb, var(--pal-4) 45%, rgba(18, 19, 26, 0.92))"
      light_app: "#f4f5fa"
      light_card: "rgba(255, 255, 255, 0.88)"
      light_card_solid: "#ffffff"
      light_nav: "rgba(255, 255, 255, 0.95)"
    text:
      dark_primary: "#ffffff"
      dark_secondary: "#94a3b8"
      dark_tertiary: "#64748b"
      light_primary: "#0f172a"
      light_secondary: "#334155"
      light_tertiary: "#64748b"
    border:
      card: "color-mix(in srgb, var(--pal-2) 24%, rgba(255, 255, 255, 0.08))"
      input: "color-mix(in srgb, var(--pal-2) 28%, rgba(255, 255, 255, 0.12))"
      light_card: "rgba(0, 0, 0, 0.08)"
      light_input: "rgba(0, 0, 0, 0.12)"
  typography:
    font_families:
      display: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', system-ui, sans-serif"
      mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    scales:
      display_hero: "1.75rem" # 28px
      title_xl: "1.25rem" # 20px
      title_lg: "1.0625rem" # 17px
      body: "0.875rem" # 14px
      caption: "0.75rem" # 12px
      micro: "0.625rem" # 10px
      nano: "0.5625rem" # 9px
    weights:
      black: 900
      bold: 700
      semibold: 600
      medium: 500
      regular: 400
  radii:
    squircle_stage: "32px"
    card: "20px"
    card_sm: "16px"
    input: "12px"
    pill: "9999px"
    circle: "50%"
    r1_touch: "8px"
  shadows:
    card: "0 24px 48px -12px rgba(0, 0, 0, 0.8)"
    vinyl_3d: "0 20px 45px -8px rgba(0, 0, 0, 0.7), 0 10px 20px -4px rgba(0,0,0,0.4)"
    glow_rabbit: "0 0 20px rgba(255, 79, 0, 0.6)"
    glow_accent: "0 0 25px var(--accent-glow)"
  motion:
    spring_snappy: "cubic-bezier(0.2, 0.8, 0.2, 1)"
    spring_bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)"
    ease_default: "0.35s ease"
    spin_vinyl: "8s linear infinite"
  breakpoints:
    r1_hardware: "max-width: 340px, max-height: 340px"
    mobile: "max-width: 640px"
    tablet: "max-width: 1024px"
    desktop: "min-width: 1025px"
---

# JuiceBx Design System Specification (DESIGN.md)

`JuiceBx` is a tactile, hardware-grade music player engineered for both ultra-compact embedded hardware (Rabbit R1 2.88" 240×240) and high-resolution smartphones / desktop browsers. It fuses **Teenage Engineering industrial minimalism**, **iOS 28 / Material 3 fluid glassmorphism**, and a **999 Juice WRLD tribute aesthetic**.

---

## 1. Visual Atmosphere & Philosophy

* **Tactile Hardware Precision**: Components feel like machined aluminum, matte polycarbonate, and precision-cut sapphire glass. Buttons have tangible depth, micro-haptic audio feedback (synthesized through the Web Audio API), and instant snap response (`active:scale-[0.96]`).
* **Subtle Multi-Layered Atmosphere**: Backgrounds are not flat monochrome; they use real-time three-point radial ambient wallpaper light blooms that smoothly blend colors from the active 4-color palette matrix (`--pal-1` through `--pal-4`).
* **Content-First Hierarchy**: The album artwork and music timeline dominate the screen. Functional chrome is minimized, elevated through frosted glass (`backdrop-filter: blur(40px)`), and docked naturally at screen edges.

---

## 2. Color System & Dynamic Palette Engine

JuiceBx features the **OS 338 ColorHunt Palette Matrix** combined with real-time luminance calculation.

### 2.1 Core Functional Tokens

| Token | Dark Mode Default | Light Mode Default (Ceramic) | Role |
|---|---|---|---|
| `--rabbit-orange` | `#ff4f00` | `#ff4f00` | Rabbit R1 Hardware Accent, Active Indicators, Playheads |
| `--accent` | `#a855f7` (Neon Purple) | Dynamic / Saturated | Primary Active State, Scrubber Fill, Highlights |
| `--accent-glow` | `rgba(168, 85, 247, 0.45)` | `rgba(168, 85, 247, 0.20)` | Drop shadows, aura blooms, neon borders |
| `--bg-app` | `#030408` (Obsidian) | `#f4f5fa` (Ceramic Pod) | Root canvas background |
| `--bg-card` | `rgba(18, 19, 26, 0.72)` | `rgba(255, 255, 255, 0.88)` | Translucent glassmorphic cards |
| `--bg-card-solid` | `#0d0e14` | `#ffffff` | High-contrast opaque card surfaces |
| `--bg-nav` | `rgba(10, 11, 16, 0.88)` | `rgba(255, 255, 255, 0.95)` | Sticky bottom navigation dock |
| `--text-primary` | `#ffffff` | `#0f172a` | Headers, track titles, active items |
| `--text-secondary` | `#94a3b8` | `#334155` | Artist names, subtitles, timestamps |
| `--text-tertiary` | `#64748b` | `#64748b` | Inactive icons, badges, placeholders |
| `--border-card` | `rgba(255, 255, 255, 0.08)` | `rgba(0, 0, 0, 0.08)` | 1px sub-pixel hardware card borders |

### 2.2 Signature Hardware Presets

1. **Rabbit R1 Orange**: `#ff4f00` / `#0a0a0d` / `#16161c` (Tactile industrial orange)
2. **White Ceramic Pod**: `#ffffff` / `#f4f5fa` / `#0f172a` (Luxe Apple / Braun minimalist light ceramic)
3. **Matte Charcoal**: `#1e1e24` / `#121216` / `#0a0a0c` (Stealth obsidian audiophile deck)
4. **Aurora Borealis**: `#06b6d4` / `#a855f7` / `#10b981` (Vibrant cyan-emerald northern lights glow)
5. **Midnight 999 Tribute**: `#ff4f00` / `#a855f7` / `#050508` (Juice WRLD signature neon glow)

---

## 3. Typography & Hierarchy

The typography utilizes native Apple and system sans-serif fonts (`-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', system-ui`) for optical clarity at all sizes.

* **Display / Tribute Title (`text-[21px] font-black tracking-tight`)**: Header logos, artist names on Now Playing.
* **Track Title Hero (`text-sm / text-base font-black`)**: Dominant weight, zero line wrap on track names.
* **Secondary Meta (`text-[11px] / text-xs font-semibold`)**: Artist label, duration tags, album year badges.
* **Micro Tags (`text-[9px] font-black uppercase tracking-wider`)**: "999 CLUB", "100 TRACKS", "UNRELEASED", "LOSSLESS EQ".
* **Synced Karaoke Lyrics (`text-sm to text-lg font-black transition-all duration-200`)**: Active line highlighted in bright white/accent with glowing scale (`scale-105`), inactive lines dimmed to 30% opacity.

---

## 4. Component Library & Architecture

### 4.1 3D Holographic Vinyl Turntable (`#deck-display-vinyl`)
* **Geometry**: 220px to 280px circular vinyl platter with grooved radial gradients (`repeating-radial-gradient`).
* **Center Disc**: High-res track album cover masked in a 44% center circle with 3px sub-pixel border.
* **Real-Time Physics**: Smooth 60FPS CSS rotation (`animation: spinVinyl 8s linear infinite`) that pauses on pause and dynamically scales with the audio engine's live 808 bass transients (`levels.bass * 0.05`).
* **Spindle Tribute**: Center 999 brass spindle hole with active haptic trigger.

### 4.2 Unified Squircle Stage Window (`#deck-stage-window`)
* **Dimensions**: `w-[260px] h-[260px]` up to `w-[300px] h-[300px]` with `border-radius: 32px`.
* **Mode Pills (`.deck-mode-pill`)**: `SONG` | `VIDEO` | `LYRICS` pill switch with smooth sliding active pill pill background.
* **Interactive Morph**: Single-tap cycles between 5 expressive visualizers:
  1. *3D Holographic Vinyl Platter* (Default)
  2. *iOS 28 Liquid Siri Orb*
  3. *Material 3 Dynamic Chroma Ribbons*
  4. *Spatial Fluid Glass Metaballs*
  5. *Hi-Fi 38-Band Precision Spectrum*

### 4.3 100-Track Deep Shuffles Grid (`.genre-card`)
* **Format**: 2-column responsive touch cards with distinct high-energy gradients and contrast badges.
* **Categories**: *Hip-Hop & Trap Top 100*, *Juice WRLD Unreleased Vault*, *90s & 2000s Golden Era*, *Melodic Emo Rap*, *R&B Midnight Vibes*, *Pop & High Energy*, *Gym & Workout Hype*, *Lo-Fi Late Night Chill*.
* **Shuffle Logic**: Shuffles a full randomized batch of 100 top tracks on every tap.

### 4.4 Hardware-Grade Scrubber & Controls
* **Scrubber Track**: 5px rounded capsule with real-time accent fill and 14px illuminated thumb.
* **Transport Controls**: 56px massive center circular play/pause button flanked by 40px skip, shuffle, and repeat buttons with active glow states.
* **Hardware EQ Badges**: 5 Biquad DSP filters (`999 Bass Boost`, `Studio Master`, `Vinyl Warmth`, `Vocal Clarity`, `Emo Rock`).

### 4.5 Synced Karaoke Lyrics Stage (`#deck-display-lyrics`)
* **Offset Calibration Bar**: In-flight `±0.5s` sync nudging with microsecond compensation for any stream latency.
* **Live Auto-Scroll**: Centered line tracking with gentle kinetic easing.

---

## 5. Layout & Spatial Navigation (5-Panel Horizontal Flow)

JuiceBx organizes all functionality across a seamless **5-panel horizontal paged swipe canvas**:

```
┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│   PANEL 0    │   PANEL 1    │   PANEL 2    │   PANEL 3    │   PANEL 4    │
│  HOME 999    │ SEARCH & YT  │ NOW PLAYING  │  MY LIBRARY  │ THEME STUDIO │
│ Top Shuffles │ Direct Audio │ 3D Turntable │ Albums/Liked │ 338 Palettes │
└──────────────┴──────────────┴──────────────┴──────────────┴──────────────┘
```

* **Scroll Snapping**: CSS `scroll-snap-type: x mandatory` with smooth scroll easing.
* **Navigation Dock (`.glass-nav`)**: Fixed bottom dock with Phosphor icons (`ph-house`, `ph-magnifying-glass`, `ph-disc`, `ph-playlist`, `ph-gear-six`) and illuminated active indicator dot.
* **Floating Mini Player (`#mini-player`)**: Appears automatically on Panels 0, 1, 3, and 4 whenever a song is playing, providing quick transport controls and one-tap return to Panel 2.

---

## 6. Responsive Adaptation & Device Profiles

### 6.1 Rabbit R1 Hardware Profile (240×240 / 340px)
* Strips all GPU-intensive `backdrop-filter: blur()` layers to guarantee 60FPS on embedded MediaTek chipsets.
* Converts grid layouts into 1-column 44px touch buttons.
* Compresses Now Playing stage into a tight 195px hardware frame.

### 6.2 Mobile & Desktop Profile (> 400px)
* Full dynamic glassmorphism with 40px blur filters.
* 2-column genre shuffle cards and rich album grid cards.
* Expanded 3D vinyl turntable with ambient light blooming.

---

## 7. Voice & Copy Standards

* **Zero Placeholder Text**: No `Lorem Ipsum`, no generic `Song 1`, no empty placeholders.
* **Authentic Terminology**: "999 Forever", "Lossless Audio", "Unreleased Vault", "100 Track Shuffle", "Sync Offset", "Biquad EQ".
* **Clear State Feedback**: Displays actual elapsed timestamps (`1:24 / 3:45`) and explicit stream error resolutions.
