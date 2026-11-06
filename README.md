# HIMUNI · ᜑᜒᜋᜓᜈᜒ

> **Every feeling has a sound.**  
> *Not every feeling needs words. Sometimes, it just needs a sound.*

**HIMUNI** is a mood-led music discovery experience inspired by the Filipino words **Himig** (*melody*) and **Muni-muni** (*quiet reflection*). Rather than imitating conventional streaming platforms, HIMUNI invites people to explore emotional states, personal energy levels, and lived moments through an editorial, interactive interface powered by real music from the official **Audius API**.

---

## Implemented Experience (Phase 1 + Phase 2)

- **Brand Identity & Baybayin Companion Mark**: Primary `HIMUNI` wordmark paired with its Baybayin inscription (`ᜑᜒᜋᜓᜈᜒ` — *hi-mu-ni*) rendered reliably via bundled `Noto Sans Tagalog`, alongside an abstract resonance-inspired symbol in light and dark treatments.
- **Interactive Mood Selection & 2D Mood Spectrum**: Eight emotional territories (*Dreamy*, *Focused*, *Melancholic*, *Energetic*, *Romantic*, *Nostalgic*, *Joyful*, *Calm*) synchronized two-way with a 2D cartographic map (**Calm ↔ Energetic**, **Introspective ↔ Bright**) and `0–100` personal energy refinement persisted in `localStorage`.
- **Mood- & Energy-Led Audius Discovery**: Curated mood-to-music associations (`src/data/moodRecommendations.js`) refined deterministically by low, balanced, and high energy levels—presenting **Recommended Tracks**, **Additional Discoveries**, and **Refresh recommendations** using real Audius metadata.
- **Featured Discoveries**: Editorial spotlight (*A discovery worth hearing*, *New sounds to explore*, and *Sounds outside your usual mood*) combining live Audius weekly trending selections with contrasting-mood sounds.
- **HIMUNI Soundscapes**: Five curated discovery editions (*A Little Sunshine*, *Somewhere Between Midnight and Morning*, *Soft Afternoons*, *Beautifully Overwhelmed*, *The Feeling of Starting Over*) with dedicated `/soundscapes/:soundscapeId` pages, live returned track counts, pagination, and Spectrum attunement.
- **Track & Artist Search**: Debounced catalog search (`/search` and inline on Discover) with `AbortController` cancellation, clear action, empty/error/rate-limit states, retry, and `Load more` pagination.
- **Contextual Audius Listening**: Lightweight inline listening via the official `GET /v1/tracks/{track_id}/stream?app_name=himuni` endpoint—stopping previous streams automatically, respecting creator-gated/unavailable tracks, handling playback errors, crediting artists and Audius, and avoiding any permanent bottom music player bar.

---

## Audius API Configuration

Read-only discovery works out of the box using `app_name=himuni` against `https://api.audius.co/v1` with automatic discovery-node fallback.

To customize configuration or supply an optional public Audius API key, copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

> **Security Note**: Never place a Bearer token or private secret in `.env` or client-side code.

---

## Attribution & Content Rights

All tracks, audio streams, and cover artwork surfaced in HIMUNI are served directly from **Audius** and belong to their respective creators. HIMUNI does not download, rehost, or claim ownership of third-party audio or artwork; content licensing and streaming availability vary by artist and track.

---

## Technology Stack

- **React 18 + Vite** (JavaScript)
- **Tailwind CSS**
- **Framer Motion** (with `prefers-reduced-motion` support)
- **Lucide React**
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
