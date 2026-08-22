# 🎨 Official Neumorphic Design Specification — Concept 1 (Master Reference)

> [!IMPORTANT]
> This document is the **Permanent Golden Master Reference** for all UI/UX implementations on the `neumorphic-ui` branch.
> **CORE ARCHITECTURE DIRECTIVE**: Concept 1 is designed and built strictly as a **Native Android Mobile App** (APK / Phone). It is not constrained by or designed for desktop browsers. Every dimension, touch target, safe-area inset, haptic response, and animation is tailored 100% for mobile phone ergonomics.

---

## 🖼️ Visual Reference
- **Source Mockup:** `player_header_mockups_1787358411486.jpg` (Concept 1: Neumorphic)

---

## 🎨 Color Palette & Shadow Physics

| Component | Light Value / Hex | Dark Neumorphic Value | CSS Variable |
|---|---|---|---|
| **App Canvas Background** | `#eef2f7` (Clay Canvas) | `#0d0f18` | `--bg-app` |
| **Neumorphic Card Surface** | `#eef2f7` | `#131726` | `--bg-card` |
| **Sunken / Inset Recess** | `#dce4ed` | `#080a10` | `--bg-inset` |
| **Primary Text** | `#0f172a` (Deep Slate) | `#f8fafc` | `--text-primary` |
| **Secondary Text** | `#475569` (Muted Slate) | `#94a3b8` | `--text-secondary` |
| **Active Pill Gradient** | `linear-gradient(135deg, #dbeafe, #eff6ff)` | `linear-gradient(135deg, #3b82f6, #6366f1)` | `--pill-active` |
| **Active Accent Color** | `#2563eb` (Royal Blue) | `#60a5fa` | `--accent` |

### 📐 Standard Neumorphic Shadow Formulas:
- **Floating / Raised Surface (Convex Extrusion)**:
  ```css
  box-shadow: 6px 6px 14px rgba(166, 180, 200, 0.55), -6px -6px 14px rgba(255, 255, 255, 0.95);
  ```
- **Sunken / Pressed Surface (Concave Inset)**:
  ```css
  box-shadow: inset 3px 3px 6px rgba(166, 180, 200, 0.65), inset -3px -3px 6px rgba(255, 255, 255, 0.95);
  ```
- **Hero Play Button (Deep Extrusion)**:
  ```css
  box-shadow: 8px 8px 18px rgba(166, 180, 200, 0.6), -8px -8px 18px rgba(255, 255, 255, 0.95);
  ```

---

## 📱 Component Architecture

### 1. Top Header Card ("Now Playing")
- **Shape**: Rounded rectangular card (`border-radius: 24px`), raised with soft dual shadows.
- **Header Label**: `NOW PLAYING` in small, uppercase, muted text (`text-[10px]`, `font-bold`, `tracking-wider`, `#64748b`).
- **Track & Artist**: Bold, centered typography (`font-black`, `#0f172a`).

### 2. Segmented Mode Switcher (`[ SONG | VIDEO | LYRICS ]`)
- **Outer Well**: Sunken track pill with deep inner shadows (`border-radius: 999px`).
- **Active Pill ("SONG")**: Soft extruded convex pill with light-blue gradient and bold blue text (`#2563eb`).
- **Inactive Pills ("VIDEO", "LYRICS")**: Flat text (`#64748b`) with smooth hover state.

### 3. Center Stage / Album Art Window
- **Shape**: Large square-proportioned squircle (`border-radius: 28px`).
- **Depth**: Prominent dual-light raised extrusion (`10px 10px 24px`).
- **Content**: Framed album artwork, vinyl platter, or reactive visualizer smoothly contained within rounded corners.

### 4. Track Details & Action Row
- **Left**: Large bold Track Title and Artist name.
- **Right**: Soft extruded circular `•••` action button.

### 5. Recessed Scrubber Bar
- **Track**: Sunken recessed groove with inner shadows (`border-radius: 999px`, height: `6px`).
- **Fill**: Smooth `#3b82f6` progress beam.
- **Thumb Knob**: Circular convex knob (`14px x 14px`) with soft drop shadow.
- **Time Labels**: Crisp timestamps (`0:01` and `-3:35`) flanking the bar.

### 6. Transport Controls Dock
- **Layout**: 5 buttons horizontally aligned (`Shuffle`, `Previous`, `Play/Pause Hero`, `Next`, `Repeat`).
- **Hero Play/Pause**: Large circular convex button (`64px x 64px`) centered with tactile pressed depth.
- **Secondary Controls**: Soft circular pill buttons (`40px x 40px`).
