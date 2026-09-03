---
name: Andean Utility & Terrain
colors:
  surface: '#0e141a'
  surface-dim: '#0e141a'
  surface-bright: '#333a40'
  surface-container-lowest: '#080f14'
  surface-container-low: '#161c22'
  surface-container: '#1a2026'
  surface-container-high: '#242b31'
  surface-container-highest: '#2f353c'
  on-surface: '#dde3eb'
  on-surface-variant: '#c7c6ca'
  inverse-surface: '#dde3eb'
  inverse-on-surface: '#2b3137'
  outline: '#909094'
  outline-variant: '#46474a'
  surface-tint: '#c8c6c7'
  primary: '#c8c6c7'
  on-primary: '#303031'
  primary-container: '#1a1a1b'
  on-primary-container: '#848283'
  inverse-primary: '#5f5e5f'
  secondary: '#c0c7d5'
  on-secondary: '#2a313c'
  secondary-container: '#404753'
  on-secondary-container: '#aeb5c3'
  tertiary: '#ffba43'
  on-tertiary: '#432c00'
  tertiary-container: '#261700'
  on-tertiary-container: '#af7800'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e5e2e3'
  primary-fixed-dim: '#c8c6c7'
  on-primary-fixed: '#1b1b1c'
  on-primary-fixed-variant: '#474647'
  secondary-fixed: '#dce3f1'
  secondary-fixed-dim: '#c0c7d5'
  on-secondary-fixed: '#151c26'
  on-secondary-fixed-variant: '#404753'
  tertiary-fixed: '#ffddaf'
  tertiary-fixed-dim: '#ffba43'
  on-tertiary-fixed: '#281800'
  on-tertiary-fixed-variant: '#614000'
  background: '#0e141a'
  on-background: '#dde3eb'
  surface-variant: '#2f353c'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 64px
    fontWeight: '800'
    lineHeight: 72px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Montserrat
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-sm:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  section-padding-desktop: 120px
  section-padding-mobile: 60px
---

## Brand & Style
This design system focuses on the intersection of rugged durability and premium professionalism, specifically tailored for the high-altitude and diverse terrain of the Peruvian 4x4 market. The aesthetic balance is "Work-Ready Premium"—it avoids the overly polished look of luxury sedans in favor of a mechanical, engineered feel that inspires confidence in vehicle capability.

The style is **Modern Corporate with Industrial influences**. It utilizes a dark-mode foundation to represent the strength of charcoal and steel, punctuated by high-visibility accents reminiscent of industrial safety equipment. 

**Key Visual Principles:**
- **Mechanical Precision:** Use of rigid grids and structured layouts.
- **High-Visibility Accents:** Critical actions are treated as "Safety First" checkpoints using Amber/Orange.
- **Substantial Weight:** UI elements should feel heavy and grounded, avoiding thin lines or flighty animations.

## Colors
The palette is dominated by deep, matte surfaces to reduce glare and emphasize the metallic textures of the vehicles.

- **Primary Background (#1A1A1B):** A deep charcoal used for the main canvas. It provides a high-contrast backdrop for vehicle photography.
- **Surface Secondary (#333A45):** A cool slate gray used for cards, section dividers, and secondary containers. This mimics the tone of industrial steel.
- **Action Amber (#FFB000):** The primary accent. Used exclusively for CTAs, critical status indicators, and highlights. It ensures maximum legibility against the dark background.
- **Text & UI Neutral (#E2E8F0):** A light gray-white used for body text to maintain high readability without the harshness of pure white (#FFFFFF).

## Typography
The typography strategy utilizes **Montserrat** for its geometric stability and heavy weights, conveying a sense of "built to last." For body copy, **Inter** provides maximum legibility for technical specifications and long-form descriptions. 

**JetBrains Mono** is introduced as a label font for technical specs (e.g., Torque, Payload, Engine CC) to provide a "spec-sheet" or "engineered" look that aligns with the professional vehicle market.

- **Headlines:** Always Bold or Extra Bold. Use tighter letter spacing for large display text.
- **Labels:** Use uppercase for technical data headers to create a rhythmic, structured hierarchy.

## Layout & Spacing
The layout follows a **Fixed-Width Centered Grid** for desktop to maintain a premium, editorial feel. 

- **Grid:** 12-column system with a generous 24px gutter. 
- **Rhythm:** Use multiples of 8px (8, 16, 24, 32, 48, 64) for all internal spacing.
- **Mobile Reflow:** On mobile devices, the 12-column grid collapses to a 2-column or 1-column layout. Horizontal margins should be fixed at 20px to maximize screen real estate for vehicle imagery.
- **Section Breaks:** Use large vertical padding (120px+) between major sections to allow the design to breathe and emphasize the scale of the vehicles.

## Elevation & Depth
This design system uses **Tonal Layering** rather than traditional drop shadows to maintain a modern, "flat-industrial" aesthetic.

- **Level 0 (Base):** #1A1A1B (Deep Charcoal).
- **Level 1 (Cards/Navigation):** #333A45 (Slate Gray).
- **Level 2 (Active States):** Subtle 1px inner border of #FFB000 at 20% opacity.

When shadows are used for hover states on cards, they should be "Hard Shadows"—low blur (4px) and high opacity, giving the impression of a heavy object sitting firmly on a surface.

## Shapes
A "Rounded" approach (8px-12px) is used to soften the industrial edges, making the interface feel approachable and modern rather than aggressive.

- **Buttons & Inputs:** 8px corner radius (Standard).
- **Vehicle Feature Cards:** 16px corner radius (Large) to create a distinct frame for high-quality photography.
- **Search Bars:** Should remain consistent with the 8px radius; avoid pill-shapes to maintain a structural, rectangular feel.

## Components

### Buttons
- **Primary:** Background #FFB000, Text #1A1A1B, Bold Montserrat. These should feel like physical "Action" buttons.
- **Secondary:** Transparent with a 2px border of #E2E8F0.
- **Tertiary:** Text-only in Action Amber for inline links.

### Cards
Vehicle cards should feature a full-bleed image at the top, with a technical spec grid below. Use the #333A45 background for the content area to separate it from the main page background.

### Technical Spec Icons
Icons must be "Monoline" (consistent stroke weight) and colored in Action Amber. They should represent mechanical attributes: incline angles, towing capacity, and drivetrain configurations.

### Form Inputs
Inputs use a dark fill (#252526) with a bottom-only border in Slate Gray. On focus, the border transitions to Action Amber. Use JetBrains Mono for placeholder text to reinforce the technical vibe.

### Image Treatment
All vehicle imagery should have a slight "Cool" tint in the shadows to harmonize with the Slate Gray UI elements. Backgrounds in photos should ideally feature rugged landscapes (mountains, quarries, or rough roads).