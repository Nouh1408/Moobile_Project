---
version: "alpha"
name: "Flat Design"
description: "Flat, 2D interface with bold colors, no shadows/gradients, clean lines, simple geometric shapes, icon-heavy, typography-focused, minimal ornamentation. Ideal for landing pages, saas. AI-ready template."
colors:
  primary: "#1A1A1A"
  secondary: "#4A4A4A"
  tertiary: "#0066FF"
  neutral: "#FFFFFF"
typography:
  h1:
    fontFamily: System UI stack
    fontSize: 2.25rem
    fontWeight: 700
  body-md:
    fontFamily: System UI stack
    fontSize: 1rem
    fontWeight: 400
  label-caps:
    fontFamily: System UI stack
    fontSize: 0.75rem
    fontWeight: 500
rounded:
  sm: 2px
  md: 4px
  lg: 8px
---

## Overview

Flat, 2D interface with bold colors, no shadows/gradients, clean lines, simple geometric shapes, icon-heavy, typography-focused, minimal ornamentation. Ideal for landing pages, saas. AI-ready template. Microsoft fired the first shot. Windows Phone's Metro UI in 2010 stripped everything back to typography and color blocks — no chrome, no bevels, no apologies. Most designers shrugged it off as corporate minimalism. Then Apple nuked skeuomorphism overnight with iOS 7 in 2013, and suddenly every leather texture and drop shadow on the internet looked embarrassing. The industry pivoted in months.

Google complicated things with Material Design in 2014, reintroducing elevation and shadow as meaningful hierarchy tools. Purists called it a betrayal. Pragmatists called it usable. Either way, it proved that pure flat had accessibility problems — when everything sits on the same plane, users lose depth cues.

By 2026, flat won the war but absorbed the lessons. Neumorphism came and went like a fever dream. Glassmorphism had its moment on Dribbble and mostly stayed there. What survived is flat's core conviction — that interfaces should communicate through color, type, and space, not simulate physical materials. The shadows that remain are functional, not decorative. That's the settlement.

- Density: 3/10 — Airy
- Variance: 3/10 — Restrained
- Motion: 4/10 — Subtle

- **Style:** Simple, Clean, Colorful, Geometric
- **Keywords:** 2D, minimalist, bold colors, no shadows, clean lines, simple shapes, typography-focused, modern, icon-heavy
- **Era:** 2010s Modern
- **Light/Dark:** ✓ Full / ✓ Full

## Colors

- Palette derived from style keywords and era context


## Typography

- **Display / Hero:** System UI stack (-apple-system, sans-serif) — Weight 700, tight tracking, used for headline impact
- **Body:** System UI stack (-apple-system, sans-serif) — Weight 400, 16px/1.6 line-height, max 72ch per line
- **UI Labels / Captions:** System UI stack (-apple-system, sans-serif) — 0.875rem, weight 500, slight letter-spacing
- **Monospace:** JetBrains Mono — Used for code, metadata, and technical values

Scale:
- Hero: clamp(2.5rem, 5vw, 4rem)
- H1: 2.25rem
- H2: 1.5rem
- Body: 1rem / 1.6
- Small: 0.875rem


## Layout

- **Grid:** CSS Grid primary. Max-width containment: 1280px centered with 1.5rem side padding.
- **Spacing rhythm:** Balanced. Base unit: 0.5rem (8px).
- **Section vertical gaps:** clamp(4rem, 8vw, 8rem).
- **Hero layout:** Split-screen (text left, visual right).
- **Feature sections:** Zig-zag alternating text+image rows. No 3-equal-columns.
- **Mobile collapse:** All multi-column layouts collapse below 768px. No horizontal overflow.
- **z-index contract:** base (0) / sticky-nav (100) / overlay (200) / modal (300) / toast (500).


## Elevation & Depth

No gradients/shadows, simple hover (color/opacity shift), fast loading, clean transitions (150-200ms ease), minimal icons

- **Physics:** Ease-out curves, 200-300ms duration. Smooth and predictable.
- **Entry animations:** Fade + translate-Y (16px → 0) over 420ms ease-out. Staggered cascades for lists: 80ms between items.
- **Hover states:** Subtle color shift + shadow adjustment over 200ms.
- **Page transitions:** Fade only (200ms).
- **Performance:** Only transform and opacity animated. No layout-triggering properties.


## Shapes

Base corner radius: 2px. See rounded tokens in front matter for the full scale.


## Components

- **Primary Button:** Sharp edges (0px) shape. Accent color fill. Hover: 8% darken + subtle lift shadow. Active: -1px translate tactile press. Font weight 600. No outer glows.
- **Secondary / Ghost Button:** Outline variant. 1.5px border in muted color. Text in primary color. Hover: subtle background fill.
- **Cards:** Sharp edges (0px) corners. Surface background. Subtle shadow (0 2px 12px rgba(0,0,0,0.06)). 1px border stroke.
- **Inputs:** Label above input. 1px border stroke. Focus ring: 2px accent color offset 2px. Error text below in semantic red. No floating labels.
- **Navigation:** Primary surface background. Active item: accent color indicator. Font weight 500 when active.
- **Skeletons:** Shimmer animation matching component dimensions. No circular spinners.
- **Empty States:** Icon-based composition with descriptive text and action button.


## Do's and Don'ts

- No emojis in UI — use icon system only (Lucide, Heroicons)
- No decorative gradients — flat color only
- No shadows heavier than 0 2px 8px rgba(0,0,0,0.08)
- No pure black (#000000) — use off-black or charcoal variants
- No oversaturated accent colors (saturation cap: 80%)
- No 3-column equal-width feature layouts — use zig-zag or asymmetric grid
- No `h-screen` — use `min-h-[100dvh]`
- No AI copywriting clichés: "Elevate", "Seamless", "Unleash", "Next-Gen"
- No broken external image links — use picsum.photos or inline SVG
- No generic lorem ipsum in demos

- Do No shadows/gradients
- Do 4-6 solid colors max
- Do Clean lines consistent
- Do Simple shapes used
- Do Icon-heavy layout
- Do High saturation colors
- Do Fast loading verified


## Use Case

Landing pages, SaaS
