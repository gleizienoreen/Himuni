# HIMUNI · ᜑᜒᜋᜓᜈᜒ

> **Every feeling has a sound.**  
> *Not every feeling needs words. Sometimes, it just needs a sound.*

**HIMUNI** is a mood-led music discovery experience inspired by the Filipino words **Himig** (*melody*) and **Muni-muni** (*quiet reflection*). Rather than imitating conventional streaming platforms, HIMUNI invites people to explore emotional states, personal energy levels, and lived moments through an editorial, interactive interface powered by real music from the official **Audius API**.

---

## Features & Implementation

### Phase 1: Brand & Interactive Mood Discovery
- **Brand Identity & Baybayin Mark**: Primary `HIMUNI` wordmark paired with its Baybayin inscription (`ᜑᜒᜋᜓᜈᜒ` — *hi-mu-ni*) rendered reliably via bundled `Noto Sans Tagalog`, alongside an abstract resonance-inspired symbol in light and dark treatments.
- **Interactive Mood Selection & 2D Mood Spectrum**: Eight emotional territories (*Dreamy*, *Focused*, *Melancholic*, *Energetic*, *Romantic*, *Nostalgic*, *Joyful*, *Calm*) synchronized two-way with a 2D cartographic map (**Calm ↔ Energetic**, **Introspective ↔ Bright**) and `0–100` personal energy refinement persisted in `localStorage`.
- **Responsive Layout**: Asymmetric editorial design language with Space Grotesk, DM Sans, and restrained typography.

### Phase 2: Real Music Discovery & Soundscapes
- **Mood- & Energy-Led Audius Discovery**: Curated mood-to-music associations (`src/data/moodRecommendations.js`) refined deterministically by low, balanced, and high energy levels—presenting **Recommended Tracks**, **Additional Discoveries**, and **Refresh recommendations** using real Audius metadata.
- **Featured Discoveries**: Editorial spotlight (*A discovery worth hearing*, *New sounds to explore*, and *Sounds outside your usual mood*) combining live Audius weekly trending selections with contrasting-mood sounds.
- **HIMUNI Soundscapes**: Five curated discovery editions (*A Little Sunshine*, *Somewhere Between Midnight and Morning*, *Soft Afternoons*, *Beautifully Overwhelmed*, *The Feeling of Starting Over*) with dedicated `/soundscapes/:soundscapeId` pages, live returned track counts, pagination, and Spectrum attunement.
- **Track & Artist Search**: Debounced catalog search (`/search` and inline on Discover) with `AbortController` cancellation, clear action, empty/error/rate-limit states, retry, and `Load more` pagination.
- **Contextual Audius Listening**: Lightweight inline listening via the official `GET /v1/tracks/{track_id}/stream?app_name=himuni` endpoint—stopping previous streams automatically, respecting creator-gated/unavailable tracks, handling playback errors, crediting artists and Audius, and avoiding any permanent bottom music player bar.

### Phase 3: Sound Postcards & Personal Collections
- **Sound Postcards Destination (`/postcards`)**:
  - Saved postcard gallery with search by title/note, mood filter, and sorting (newest/oldest).
  - Postcard preview modal with full details, edit shortcut, duplication, deletion, and PNG export.
  - Empty state guiding users to design their first card.
- **Dedicated Postcard Creator (`/postcards/new` & `/postcards/edit/:postcardId`)**:
  - **Three-Panel Creative Workspace on Desktop**: Left: Design & content controls; Center: Live responsive 4:5 canvas; Right: Properties, track metadata, and actions.
  - **Responsive Mobile Workspace**: Tabbed switcher (*Controls*, *Live Canvas*, *Properties*) optimized for compact screens with touch targets ≥ 40px.
  - **Featured Track Selection**: Audius track picker modal searching real tracks with instant preview, metadata snapshot fallback, or pre-filling from Discover track rows.
  - **5 Curated Color Themes**: *Lavender Dream*, *Golden Hour*, *Blue Reverie*, *Blush Moments*, and *Quiet Notes*.
  - **4 Editorial Layouts**: *Editorial* (structured asymmetric typography), *Minimal* (restrained, generous whitespace), *Abstract* (bold geometric expression), and *Memory* (reflective framed keepsake).
  - **Typography Options**: Editorial Serif, Clean Sans, Monospace, and alignments (left, center, right).
  - **High-Resolution PNG Export (1200 × 1500 px)**: Rendered cleanly via `html-to-image` using original SVG geometric motifs and CSS palettes without remote third-party CORS issues.
  - **Persistence**: Postcards saved under LocalStorage key `himuni.postcards.v1`.
- **Personal Collections (`/collections` & `/collections/:collectionId`)**:
  - **Collections Gallery (`/collections`)**: Editorial heading, search, mood filter, sort (recently updated, oldest, most items, A–Z), and empty state.
  - **Visual Cover Generation**: 7 distinctive HIMUNI palette themes (*Warm Cream*, *Electric Violet*, *Tangerine*, *Butter Yellow*, *Sky Blue*, *Blush*, *Deep Ink*) with abstract SVG brand geometry.
  - **Create/Edit Collection Modal**: Inline name validation, optional description, mood association, and cover theme selection.
  - **Save to Collection Action**: Available directly on Audius track rows and Soundscape cards with duplicate item prevention, immediate count updates, and inline new collection creation.
  - **Collection Detail Destination (`/collections/:collectionId`)**:
    - Complete header with cover art, mood badge, item counts, and dates.
    - Content listing with view filters (*All*, *Tracks*, *Soundscapes*).
    - Item reordering (*Move Up* / *Move Down* controls).
    - Removing items with immediate persistence.
    - Inline playback for tracks and direct navigation for soundscapes.
    - Safe collection deletion with confirmation.
  - **Persistence**: Collections saved under LocalStorage key `himuni.collections.v1`.

---

## Storage & State Keys

| Storage Key | Purpose | Structure |
|---|---|---|
| `himuni.preferences.v1` | Mood and energy preferences | `{ selectedMoodId, energy, coordinates }` |
| `himuni.postcards.v1` | Saved Sound Postcards | `Array<Postcard>` |
| `himuni.collections.v1` | Personal Music Collections | `Array<Collection>` |

---

## Audius API Integration

Read-only discovery operates out of the box using `app_name=himuni` against `https://api.audius.co/v1` with automatic discovery-node fallback.

To customize configuration or supply an optional public Audius API key, copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

> **Security Note**: Never place a Bearer token or private secret in `.env` or client-side code.

---

## Attribution & Content Rights

All tracks, audio streams, and cover artwork surfaced in HIMUNI are served directly from **Audius** and belong to their respective creators. HIMUNI does not download, rehost, or claim ownership of third-party audio or artwork; content licensing and streaming availability vary by artist and track. Sound Postcards render original abstract geometric artwork and typography, ensuring respectful fair use without unauthorized artwork redistribution.

---

## Technology Stack

- **React 18 + Vite** (JavaScript)
- **Tailwind CSS**
- **Framer Motion** (with `prefers-reduced-motion` support)
- **Lucide React**
- **html-to-image** (High-res client-side PNG export)
- **React Router**
- **Fontsource** (`Space Grotesk`, `DM Sans`, `Noto Sans Tagalog`)

---

## Getting Started

```bash
npm install
npm run dev
```

Build and preview production bundle:

```bash
npm run build
npm run preview
```
