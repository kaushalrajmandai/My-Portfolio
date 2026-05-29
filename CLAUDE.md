# CLAUDE.md — Project context (auto-loaded every session)

F1-themed React portfolio for **Kaushal Rajmandai** (1st-year B.Tech CSE, ITM
Skills University, Navi Mumbai). **Editorial-olive** theme (the landonorris.com
"premium" recipe — deep olive + warm sage-cream ink + one electric-teal accent +
serif/grotesque type), Antonelli #12 homage, a **light "studio" hero with a
fully interactive 3D W13 car** (drag to orbit), then smooth scroll-revealed
editorial sections.

> For the deeper handoff (file tree, open ideas, known limitations), read
> **`STATUS.md`** at the project root.

---

## Stack
**Vite + React 19** · **Tailwind v4** (`@tailwindcss/vite`) · **react-three-fiber + drei** · **three.js** · **framer-motion** (entrance + scroll reveals). `gsap` and `@react-three/postprocessing` are installed but **currently unused** (postprocessing was dropped with the old fixed scene).

Dev: `npm run dev` → http://localhost:5173/
Build: `npm run build` (bundle ~1.5 MB minified — Three.js heavy).

---

## Architecture — where to look first

| Want to change… | File |
|---|---|
| Any text / bio / project / skill / link | `src/lib/data.js` (single source of truth) |
| Car size / model swap | `src/lib/data.js` → `carConfig` (`targetSize`) |
| Hero car: camera, orbit interaction, studio lights, shadow | `src/three/HeroCar.jsx` |
| GLB loading, auto-fit, material tuning | `src/three/F1Car.jsx` (exports `CarModel`) |
| Cream hero layout (name-wraps-car) | `src/sections/Home.jsx` |
| Other section layouts (centered editorial) | `src/sections/*.jsx` |
| Colour tokens, fonts, serif/numeric rules | `src/index.css` `@theme` block |
| Race-start loader | `src/components/RaceStartLoader.jsx` |
| Section title / sector-board header | `src/components/SectionHeader.jsx` |

---

## Conventions that matter

1. **All visible text comes from `src/lib/data.js`.** Don't hard-code copy
   into components. The bio is intentionally an **array of paragraphs** to
   preserve the LinkedIn verbatim structure.

2. **Two visual zones.** The **hero (`Home.jsx`) is LIGHT** — a warm-cream
   studio backdrop (`--color-cream`) so the dark car pops; hero text is dark
   ink (`text-mercedes-jet`) + deep-teal accent (`text-petronas-deep`). A
   bottom gradient fades it into the **dark-olive** scroll sections below
   (About → Contact), which use sage-cream ink. Sections are **centered,
   full-width** editorial columns (`max-w-2xl/3xl/5xl mx-auto`) — there is no
   longer a car occupying one half, so nothing alternates L/R.

3. **Token `petronas` renders electric teal** (`#26d6c5`), the single accent —
   NOT gold (the old champagne-gold value is gone). The name is historical,
   kept to avoid renaming ~50 references. On the light hero use
   `text-petronas-deep` (`#159b8d`) for legibility on cream. `teal` is a deeper
   sibling reserved for the loader's hold pill.

4. **The hero car IS scroll-choreographed** (reinstated 2026-05-29 — reverses
   the old "no scroll choreography" rule). `HeroCar.jsx` is a self-contained
   transparent `<Canvas>` with `<OrbitControls>` (drag-rotate + gentle idle
   auto-spin; pan + **zoom OFF** — wheel-zoom trapped page scroll; don't
   re-enable). A **two-stage pinned scroll** exit, driven by `progressRef` from
   `Home.jsx`:
   - **Phase 1** (`0 → settleFraction`): on first scroll the camera **revolves**
     from wherever the spin left it to the fixed top-down `LAUNCH_CAM` framing —
     deterministic, proportional to scroll; idle spin + drag cut off.
   - **Phase 2** (`settleFraction → 1`): camera holds; the car **drives forward**
     (`FWD_DIST`, world +Z, no scaling) while `Home.jsx` raises a dark curtain
     (next section "coming up") that the car slips behind into About's black.
   `Home.jsx` is a **tall `HERO_VH` section with a sticky stage** (the pin) so
   the page can't advance until the choreography ends. Idle spin starts
   `SPIN_DELAY_MS` after the loader clears. Re-capture a pose via
   `POSE_CAPTURE = true` (drag → read `position`/`target` in the HUD). Render
   loop pauses off-screen (`active` ← IntersectionObserver). A **2nd tiny
   `<Canvas>` in `Projects.jsx`** (`DrivingCar3D`) reuses the same GLB as a
   side-profile car driving the garage (faces right on scroll-down, left up).

5. **Type pairing is the premium signature.** `font-display` = **Archivo**
   (heavy grotesque, headings + numbers), `font-serif` = **Fraunces** (editorial
   serif — emphasis words only, usually `italic font-medium text-petronas`),
   `font-body` = **Inter** (body), `font-mono` = **JetBrains Mono** (labels).
   The serif/sans contrast (final word of every `SectionHeader` title, the hero
   last name, the Contact pull-quote) is the "Lando WINS/LEGACY" move. Never use
   `font-light` on display copy — that read cheap.

6. **GLB has a procedural fallback** (`F1CarProcedural.jsx`). If
   `/public/models/f1-car/scene.gltf` is missing, the primitive car renders.
   `CarModel` (in `F1Car.jsx`) wraps it in a Suspense + ErrorBoundary fallback.
   Don't remove the fallback when iterating.

---

## What's already shipped — don't re-suggest

- ✅ Real Mercedes **W13 Concept** GLB with auto-fit + procedural fallback
- ✅ **Interactive hero car** — drag to orbit, gentle auto-spin idle (zoom disabled so it never traps page scroll), in a contained cream studio canvas with grounding contact shadow
- ✅ **Projects = horizontal "speed gallery"** (`Projects.jsx`, charlesleclerc.com homage) — pinned section, vertical scroll drives a horizontal card track, scroll-velocity motion-blur + speed streaks, a little F1 drives across the bottom, cards scale at centre; frames use GitHub OG preview images
- ✅ **Editorial-olive theme** — deep olive base, warm sage-cream ink, single electric-teal accent (reskinned 2026-05-29 from champagne-gold)
- ✅ **Serif + grotesque type** — Fraunces × Archivo × Inter (Russo One dropped; numerals ride Archivo 800)
- ✅ **Light cream hero** with name wrapping the car (KAUSHAL above / RAJMANDAI serif below), Lando-style
- ✅ Centered, full-width editorial sections with framer-motion scroll reveals
- ✅ Premium race-start lights loader (5-column gantry, FIA HUD, lights-out flash → cream hero reveal)
- ✅ Faint topographic contour backdrop (`TopoBackdrop` in `App.jsx`) + film grain over the dark sections
- ✅ All content from his LinkedIn (bio verbatim) + GitHub (top 6 repos featured)
- ✅ CV download wired to `public/resume.pdf` ("Pit Wall" button, adapts dark/light over hero)
- ✅ Antonelli dedication panel + W13 GLB attribution (CC-BY 4.0 — Nick Broad) in Contact footer

> **Removed in the 2026-05-29 restructure:** the fixed full-page `Scene.jsx`
> with scroll-driven `CameraRig`/`CarRig`, `sceneStops`, the steering-wheel HUD,
> `useScrollProgress`, and `scrollTiming` — all deleted. Don't reintroduce them.

---

## Common-tweak playbook

| Symptom | First lever |
|---|---|
| "Car too big / small" | `carConfig.targetSize` in `data.js` (currently `2.6`) |
| "Car framed wrong on load" | `camera.position` / `OrbitControls target` in `HeroCar.jsx` |
| "Can orbit under the floor" | `minPolarAngle`/`maxPolarAngle` in `HeroCar.jsx` (zoom is intentionally off) |
| "Auto-spin too fast / slow" | `autoRotateSpeed` in `HeroCar.jsx` (currently `0.55`) |
| "Projects scroll too fast / slow" | section height `h-[320vh]` in `Projects.jsx` (taller = slower horizontal pan) |
| "Car too dark on cream" | brighten the directionals / `Lightformer` intensities in `HeroCar.jsx` |
| "Hero backdrop shade" | `--color-cream` in `index.css` + the radial in `Home.jsx` |
| "Theme accent change" | `--color-petronas` value in `index.css` — no component edits needed |
| "Serif emphasis is too much" | drop the `font-serif` span in `SectionHeader.jsx` / `Home.jsx` |
| "Race number / initials / name change" | `profile.{name,initials,number}` in `data.js` |

---

## Working with Kaushal (style)

- He sees the difference between "functional" and "broadcast-quality". Default
  to **cinematic on first pass** — multi-layer glow, atmospheric layers, real
  motion choreography. "Functional then iterate" costs a round-trip.
- When he provides source text (LinkedIn About, etc.), **render it verbatim**
  including emoji and paragraph structure. Don't paraphrase or tighten without
  asking.
- He gives broad feedback ("feels off") + then a video. **Extract frames with
  ffmpeg** (installed at `/opt/homebrew/bin/ffmpeg`) — `qlmanage` only gives
  the first frame. Macros: `ffmpeg -ss <t> -i video.mov -vframes 1 frame.jpg`.
- He references other sites (e.g. landonorris.com) as targets — diagnose *why*
  they read premium (type pairing, warm ink, restraint) and apply the
  principle, not a literal copy.
- He'll iterate fast on visual things. Always note **what specific lever you
  turned** in your reply so he can revert/adjust.

---

## Known limitations (don't try to "fix" unless asked)

- **Bundle 1.5 MB** — Three.js is heavy. Code-splitting `HeroCar` behind a
  dynamic import would help but isn't blocking.
- **GLB textures 44 MB** — preloaded behind the race-start sequence (~5–8 s
  cover). Fine on broadband, slow on cellular.
- **`petronas` token is misleadingly named** — value is electric teal; comment
  in `index.css` documents it. A clean rename would touch ~50 references.
- **Mobile renders the hero 3D canvas** — could swap a static car image for
  perf, but no one's complained. The huge hero name may feel tight on small
  screens.
