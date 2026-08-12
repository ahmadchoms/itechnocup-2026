---
version: 1.0.0
name: DaurNusa-design-analysis
description: A clean, eco-sustainable circular marketplace anchored on a white canvas with Forest Emerald (#059669) as the primary brand color and Amber Gold (#f59e0b) for rewards and pricing. Type runs Plus Jakarta Sans at clean, highly legible weights. Designed mobile-first with soft rounded card radii ({rounded.md} ~12px) and clean badges ({rounded.full}) for waste categories.

colors:
  primary: "#059669"
  primary-active: "#047857"
  primary-disabled: "#a7f3d0"
  accent-amber: "#f59e0b"
  accent-amber-active: "#d97706"
  ink: "#0f172a"
  body: "#334155"
  muted: "#64748b"
  muted-soft: "#94a3b8"
  hairline: "#e2e8f0"
  hairline-soft: "#f1f5f9"
  border-strong: "#cbd5e1"
  canvas: "#ffffff"
  surface-soft: "#f8fafc"
  surface-card: "#ffffff"
  surface-dark: "#090d16"
  on-primary: "#ffffff"
  star-rating: "#f59e0b"
  scrim: "#000000"
  badge-organik-bg: "#dcfce7"
  badge-organik-text: "#15803d"
  badge-anorganik-bg: "#e0f2fe"
  badge-anorganik-text: "#0369a1"
  badge-logam-bg: "#f1f5f9"
  badge-logam-text: "#334155"
  badge-kopi-bg: "#fef3c7"
  badge-kopi-text: "#92400e"
  badge-ai-bg: "#f3e8ff"
  badge-ai-text: "#6b21a8"

typography:
  display-xl:
    fontFamily: "'Plus Jakarta Sans', Inter, sans-serif"
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.02em
  display-lg:
    fontFamily: "'Plus Jakarta Sans', Inter, sans-serif"
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: -0.01em
  display-md:
    fontFamily: "'Plus Jakarta Sans', Inter, sans-serif"
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.01em
  display-sm:
    fontFamily: "'Plus Jakarta Sans', Inter, sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  title-md:
    fontFamily: "'Plus Jakarta Sans', Inter, sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: 0
  title-sm:
    fontFamily: "'Plus Jakarta Sans', Inter, sans-serif"
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: 0
  body-md:
    fontFamily: "'Plus Jakarta Sans', Inter, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontFamily: "'Plus Jakarta Sans', Inter, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: 0
  caption:
    fontFamily: "'Plus Jakarta Sans', Inter, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.29
    letterSpacing: 0
  caption-sm:
    fontFamily: "'Plus Jakarta Sans', Inter, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.23
    letterSpacing: 0
  badge:
    fontFamily: "'Plus Jakarta Sans', Inter, sans-serif"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0
  mono:
    fontFamily: "'JetBrains Mono', Fira Code, monospace"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0

rounded:
  none: 0px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  base: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 64px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    padding: 12px 20px
    height: 48px
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    padding: 12px 20px
    height: 48px
  button-accent:
    backgroundColor: "{colors.accent-amber}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    padding: 12px 20px
    height: 48px
  waste-listing-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 16px
  match-proximity-card:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 16px
  deal-widget-box:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 16px
  ai-scanner-modal:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 24px
  analytics-stat-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-md}"
    rounded: "{rounded.md}"
    padding: 20px
---

## Overview

DaurNusa is a two-sided circular economy marketplace designed to connect **Sellers** (households and UMKM generating waste) with **Buyers** (collectors, farmers, and recycling industries). The design system is a hybrid synthesis drawn from top consumer platforms:

- **Airbnb & Wise (Marketplace & Trust):** A clean white canvas (`{colors.canvas}`) anchored by **Forest Emerald** (`{colors.primary}` — #059669) for eco-sustainability and **Amber Gold** (`{colors.accent-amber}` — #f59e0b) for pricing, deal highlights, and user rewards.
- **Uber (Proximity Logistics):** Distance-first cards and status pills highlighting kilometer proximity (`0.8 km away`) for fast waste pickup matching.
- **Intercom (Negotiation Chat):** Contextual floating deal boxes (`{component.deal-widget-box}`) embedded within real-time chat so users can finalize `final_price` and `final_quantity` seamlessly.
- **Vercel & Raycast (AI Computer Vision Modal):** A sleek dark overlay (`{component.ai-scanner-modal}`) providing automated waste image recognition with confidence rates and immediate manual override.
- **Supabase & Resend (Analytics Dashboard):** Developer-grade clean tables and stat cards tracking earnings and environmental impact.

Type runs **Plus Jakarta Sans** (with **Inter** as a fallback), giving a modern geometric feel with high legibility on mobile devices. Shape language is soft with 12px rounded cards (`{rounded.md}`) and pill-shaped badges (`{rounded.full}`).

**Key Characteristics:**

- Dual-brand palette: `{colors.primary}` (#059669) carries primary environmental actions, while `{colors.accent-amber}` (#f59e0b) carries economic value (pricing, points, star ratings).
- Mobile-First Architecture: Bottom Navigation Bar on mobile devices (<768px) switching automatically to a left-hand sidebar on desktop screens.
- Glanceable Semantic Badges: Clear visual distinction for waste categories (Organik, Anorganik, Logam, Ampas Kopi) and AI classification confidence.
- Single Shadow Elevation Tier: Flat canvas by default, elevated with subtle shadow (`0 4px 12px rgba(0,0,0,0.05)`) on hover cards, floating action buttons, and chat deal widgets.

## Colors

### Brand & Accent

- **Forest Emerald** (`{colors.primary}` — #059669): The core brand voltage. Used for primary CTAs (Submit Listing, Post Request), active tab indicators, and eco-impact highlights.
- **Forest Emerald Active** (`{colors.primary-active}` — #047857): Pressed/hover state for primary buttons.
- **Forest Emerald Disabled** (`{colors.primary-disabled}` — #a7f3d0): Tinted background for disabled CTAs.
- **Amber Gold** (`{colors.accent-amber}` — #f59e0b): Secondary accent for financial values, deal confirmation buttons, reward points, and star ratings.

### Surface

- **Canvas** (`{colors.canvas}` — #ffffff): The main background floor for public marketplace feeds and dashboard light mode.
- **Surface Soft** (`{colors.surface-soft}` — #f8fafc): Light grey background for card inner fills, table headers, and proximity match rows.
- **Surface Dark** (`{colors.surface-dark}` — #090d16): Dark surface reserved for the AI Computer Vision scanning modal and camera preview overlays.

### Hairlines & Borders

- **Hairline** (`{colors.hairline}` — #e2e8f0): Default 1px border stroke for card outlines, table splitters, and form fields.
- **Hairline Soft** (`{colors.hairline-soft}` — #f1f5f9): Secondary divider line for chat history and list items.
- **Border Strong** (`{colors.border-strong}` — #cbd5e1): Active/focused border color for input text boxes.

### Text

- **Ink** (`{colors.ink}` — #0f172a): Deep slate near-black text for primary titles, card headlines, and active links.
- **Body** (`{colors.body}` — #334155): Running paragraph text for descriptions and chat messages.
- **Muted** (`{colors.muted}` — #64748b): Subtitles, timestamps, distance text, and inactive nav labels.
- **Muted Soft** (`{colors.muted-soft}` — #94a3b8): Placeholder text in inputs and disabled labels.

### Semantic Category & Status Badges

- **Organik** (`{colors.badge-organik-bg}` / `{colors.badge-organik-text}`): Light green `#dcfce7` with text `#15803d`.
- **Anorganik** (`{colors.badge-anorganik-bg}` / `{colors.badge-anorganik-text}`): Light blue `#e0f2fe` with text `#0369a1`.
- **Logam** (`{colors.badge-logam-bg}` / `{colors.badge-logam-text}`): Slate grey `#f1f5f9` with text `#334155`.
- **Ampas Kopi** (`{colors.badge-kopi-bg}` / `{colors.badge-kopi-text}`): Warm amber `#fef3c7` with text `#92400e`.
- **AI Confidence** (`{colors.badge-ai-bg}` / `{colors.badge-ai-text}`): Purple tint `#f3e8ff` with text `#6b21a8`.

## Typography

### Font Family

The primary font is **Plus Jakarta Sans**, offering clean geometric shapes suited for modern web applications. Fallback fonts follow `Inter, system-ui, -apple-system, sans-serif`. Monospace elements (Transaction IDs, Coordinates) use **JetBrains Mono**.

### Hierarchy

| Token                     | Size | Weight | Line Height | Letter Spacing | Use                                   |
| ------------------------- | ---- | ------ | ----------- | -------------- | ------------------------------------- |
| `{typography.display-xl}` | 36px | 700    | 1.20        | -0.02em        | Hero headline on homepage             |
| `{typography.display-lg}` | 28px | 700    | 1.25        | -0.01em        | Dashboard page headers, profile names |
| `{typography.display-md}` | 22px | 600    | 1.30        | -0.01em        | Stat card big numbers, modal titles   |
| `{typography.display-sm}` | 18px | 600    | 1.40        | 0              | Section titles, chat usernames        |
| `{typography.title-md}`   | 16px | 600    | 1.25        | 0              | Card titles (`title`), item names     |
| `{typography.title-sm}`   | 16px | 500    | 1.25        | 0              | Table column titles, form labels      |
| `{typography.body-md}`    | 16px | 400    | 1.50        | 0              | Main description text, chat messages  |
| `{typography.body-sm}`    | 14px | 400    | 1.43        | 0              | Secondary descriptions, addresses     |
| `{typography.caption}`    | 14px | 500    | 1.29        | 0              | Proximity metrics, prices, weight     |
| `{typography.caption-sm}` | 13px | 400    | 1.23        | 0              | Timestamps, status subtitles          |
| `{typography.badge}`      | 12px | 600    | 1.20        | 0              | Waste category badges, AI tags        |
| `{typography.mono}`       | 13px | 500    | 1.40        | 0              | Transaction IDs, UUIDs, Lat/Lng       |

## Layout

### Spacing System

- **Base unit:** 4px grid.
- **Tokens:** `{spacing.xxs}` 2px · `{spacing.xs}` 4px · `{spacing.sm}` 8px · `{spacing.md}` 12px · `{spacing.base}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 64px.
- **Section Padding:** 24px on mobile screens, 48px–64px on desktop dashboards.
- **Card Padding:** 16px for waste cards; 20px–24px for analytics stat cards.

### Grid & Navigation Architecture

- **Mobile (<768px):** Bottom Navigation Bar (Height: 64px) with 4 tabs (`Beranda`, `Pencocokan`, `Pesan`, `Profil`) and a center floating AI Camera button.
- **Desktop (≥768px):** Left Sidebar Navigation (Width: 256px) with top header search bar and user profile dropdown.
- **Max Content Width:** Capped at `1280px` centered for marketplace feed and dashboard views.

## Elevation

The system utilizes flat design surfaces with elevation reserved for interactive overlays:

- **Flat (Baseline):** Page canvas, standard form inputs, static tables.
- **Card Hover Elevation:** `box-shadow: 0 4px 12px -2px rgba(15, 23, 42, 0.08)` — applied on hover to waste listing cards.
- **Floating Widget Elevation:** `box-shadow: 0 8px 24px -4px rgba(15, 23, 42, 0.12)` — applied to the floating deal box in chat and mobile bottom nav bar.
- **Modal Backdrop:** `{colors.scrim}` at 50% opacity for AI Scanner and confirmation dialogs.

## Components

### Buttons

- **`button-primary`**: Forest Emerald background, white text, 8px radius (`{rounded.sm}`). Used for "Jual Sampah", "Simpan Listing", "Kirim Pesan".
- **`button-secondary`**: White fill, 1px hairline border, ink text. Used for "Batal", "Edit Profile", "Filter".
- **`button-accent`**: Amber Gold background, white text. Used for "Setujui Deal", "Tandai Transaksi Selesai".

### Listing & Match Cards

- **`waste-listing-card`**: 4:3 photo container with rounded corners (`{rounded.md}`), waste category badge overlaid top-left, distance tag bottom-right, item title in `{typography.title-md}`, estimated price in Forest Emerald.
- **`match-proximity-card`**: Horizontal bar format featuring location icon, bold distance indicator (`0.8 km`), seller/buyer summary, and a quick "Chat" CTA button.

### Real-Time Chat & Deal Negotiation Widget

- **`deal-widget-box`**: Contextual card attached above chat input displaying:
  - Selected item title & quantity.
  - Negotiated price input (`final_price`).
  - Action button: "Sepakati Harga & Jumlah" (changes transaction status to `menunggu_konfirmasi`).

### AI Computer Vision Modal

- **`ai-scanner-modal`**: Dark backdrop container with live camera view/upload dropzone. Displays scanning laser animation, predicted category badge (`cv_predicted_category_id`), confidence percentage (`cv_confidence`), and an "Ubah Manual" override button.

### Analytics Dashboard

- **`analytics-stat-card`**: White card with 12px radius (`{rounded.md}`), border hairline, displaying metric number in `{typography.display-md}`, label in muted caption, and a green trend sparkline.

## Responsive Behavior

| Name    | Width        | Layout Changes                                                                                                                 |
| ------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Mobile  | < 768px      | Bottom navigation bar active; 1-column card feed; AI scanner full screen; Chat deal box anchored at bottom.                    |
| Tablet  | 768px–1024px | 2-column card feed; left sidebar collapsed to icons; modal overlays centered.                                                  |
| Desktop | > 1024px     | Left sidebar full width (256px); 3 or 4-column card grid; 2-column split chat view (conversation list + active message panel). |

### Touch Targets

- Primary CTAs and Bottom Nav items maintain a minimum target of 48×48px.
- Floating AI Camera action button size: 56×56px circular pill (`{rounded.full}`).

## Known Gaps

- **Custom Map Tile Styling:** OpenStreetMap/Nominatim tile custom pin colors not fully specified in tokens.
- **Audio Notifications:** Sound effect guidelines for incoming real-time chat messages not captured in CSS tokens.
- **Print Styles:** Print stylesheet for physical COD transaction receipts deferred to Phase 2.
