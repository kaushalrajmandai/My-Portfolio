# Portfolio — Where We Left Off

F1-themed React portfolio for Kaushal Rajmandai. **Editorial-olive** theme
(deep olive + warm sage-cream + electric teal, serif/grotesque type), a **light
cream "studio" hero with a fully interactive 3D W13** (drag to orbit), then
smooth scroll-revealed editorial sections.

---

## Resume after restart

```bash
cd /Users/kaushal/Desktop/Portfolio
npm run dev
```

Open **http://localhost:5173/**

If something's broken, sanity-check:
```bash
npm run build       # surface any compile errors
```

---

## The files you'll touch 90% of the time

| File | What lives here |
|---|---|
| `src/lib/data.js` | **All content** — bio, skills, projects, education, experience, social links + `carConfig` (model path, `targetSize`, CC-BY attribution). |
| `src/three/HeroCar.jsx` | The interactive hero canvas — studio lights, inline `Environment` reflections, `ContactShadows`, and `<OrbitControls>` (drag-rotate + gentle auto-spin; **zoom disabled** so the trackpad doesn't trap page scroll; polar clamped). Pauses its render loop off-screen via the `active` prop. |
| `src/three/F1Car.jsx` | Exports `CarModel` — GLB loader + auto-fit (bbox-measure, scale, centre, sit on floor) + material tune. Falls back to `F1CarProcedural.jsx` if the GLB is missing. |
| `src/sections/Home.jsx` | The cream hero. Name wraps the car (KAUSHAL above / RAJMANDAI serif below) + IntersectionObserver that pauses the canvas. |
| `src/sections/*.jsx` | About, Skills, Experience, Projects, Contact — centered, full-width editorial blocks on dark olive, with framer-motion scroll reveals. |
| `src/index.css` | Tailwind v4 `@theme` — colour tokens + the Fraunces/Archivo/Inter type system + `.font-serif` / `.font-numeric` rules. |

---

## Tunable knobs

In `src/lib/data.js`:
```js
profile  = { ... }   // name, bio, socials, photo URL, race number, tagline
skills   = [ ... ]   // bars in Skills
projects = [ ... ]   // cards in Projects (2-col grid)
education / experience = [ ... ]   // Experience timelines
stats    = [ ... ]   // 3 stat tiles in About

carConfig = {
  modelPath: "/models/f1-car/scene.gltf",
  targetSize: 3.2,   // longest dim in world units — raise/lower for car size
  attribution: { ... },   // CC-BY credit, rendered in Contact footer
}
```

**Most-likely tweaks:**
- "Car too big/small" → `carConfig.targetSize`
- "Car too small / framed wrong" → `carConfig.targetSize` + `camera.position` / `OrbitControls` (`target`, `min`/`maxPolarAngle`, `autoRotateSpeed`) in `HeroCar.jsx` (zoom is intentionally off)
- "Car too dark on cream" → directional / `Lightformer` intensities in `HeroCar.jsx`
- "Theme accent colour" → `--color-petronas` in `index.css` (cascades everywhere)
- "Hero backdrop shade" → `--color-cream` in `index.css` + the radial gradient in `Home.jsx`

---

## What's built (the scope)

### Hero & 3D
- ✅ Real **Mercedes W13 Concept** GLB (Sketchfab, CC-BY, credited in footer)
- ✅ Auto-fit loader (any model — bbox-measure, scale, centre, floor)
- ✅ Procedural primitive car as silent fallback (`F1CarProcedural.jsx`)
- ✅ **Fully interactive** hero car — `<OrbitControls>` drag-rotate + gentle auto-spin (zoom disabled so it doesn't trap page scroll; polar clamped); render loop pauses when scrolled away
- ✅ **Two-stage pinned scroll exit** (`HeroCar.jsx` + tall sticky `Home.jsx`): Phase 1 revolves the camera to the top-down `LAUNCH_CAM`, Phase 2 drives the car forward (`FWD_DIST`) behind a rising dark curtain into About's black. Tunables: `LAUNCH_CAM`/`FWD_DIST`/`POSE_CAPTURE` in `HeroCar.jsx`, `HERO_VH`/`SETTLE_FRACTION` in `Home.jsx`
- ✅ **`DrivingCar3D`** in `Projects.jsx` — 2nd tiny GLB canvas (same cached W13) driving the garage; faces right scrolling down, left scrolling up
- ✅ Light **cream studio** backdrop (transparent canvas) + soft directional/rim/`Lightformer` setup + `ContactShadows` grounding the car

### Theme & type
- ✅ Editorial-olive palette: `mercedes-jet #1a1f17` base, `mercedes-silver #e7e8dd` sage-cream ink, `petronas #26d6c5` electric-teal accent, `cream #eceae2` hero
- ✅ Fraunces (serif) × Archivo (grotesque) × Inter (body) × JetBrains Mono (labels); serif emphasis on every section title's last word, the hero name, and the Contact pull-quote
- ✅ Faint topographic contour backdrop + 3.5% film grain over the dark sections

### Race-start lights loader
- ✅ Premium 5-column gantry, real F1 sequence (L→R light, random hold, instant out)
- ✅ "LIGHTS OUT" white flash + speed streaks → reveals the cream hero
- ✅ Broadcast HUD overlay (FIA Live tag, driver number, track conditions)

### Layout & content
- ✅ Centered full-width editorial sections (About / Skills / Experience / Contact) with strong staggered/directional framer-motion scroll reveals
- ✅ **Projects** is a horizontal "speed gallery" (charlesleclerc.com homage) — pinned section, vertical scroll → horizontal card track, scroll-velocity motion-blur + speed streaks, a little F1 driving across the bottom, cards scale at centre; frames use GitHub OG preview images
- ✅ Navbar adapts dark↔light text over the cream hero vs. dark sections
- ✅ Content from LinkedIn (verbatim bio) + GitHub (top 6 repos featured)
- ✅ CV download ("Pit Wall"), Antonelli dedication, GLB attribution in footer

### Removed in the 2026-05-29 restructure
- ❌ Fixed full-page `Scene.jsx` + scroll-driven `CameraRig`/`CarRig`
- ❌ `sceneStops` choreography, `useScrollProgress`, `scrollTiming`
- ❌ Steering-wheel HUD (`SteeringWheel.jsx`)
- ❌ Champagne-gold palette, Inter-only type, Russo One numerals

---

## Open ideas (not commitments)

1. **Code-split `HeroCar`** behind a dynamic `import()` → cuts the initial bundle; the race-start loader already covers the load.
2. **Deploy** to Vercel / Netlify (`npm run build` → drag `dist/`, or connect the GitHub repo).
3. **Mobile pass** — hero name + 3D canvas can feel tight; consider a static car image on small screens for perf.
4. **Project case studies** — Projects shows cards; could add per-project detail pages.
5. **Scroll-snap / parallax polish** between sections for an even smoother feel.

---

## Where it lives on disk

```
/Users/kaushal/Desktop/Portfolio/
├── public/
│   ├── favicon.svg
│   ├── resume.pdf                              ← CV (Pit Wall button)
│   └── models/
│       ├── README.txt                          ← swap-the-model instructions
│       └── f1-car/                             ← W13 GLB + textures (44 MB)
│           ├── scene.gltf · scene.bin · license.txt · textures/
├── src/
│   ├── App.jsx                                 ← loader + topo backdrop + sections
│   ├── lib/data.js                             ← *all* content + carConfig
│   ├── three/
│   │   ├── HeroCar.jsx                          ← interactive studio canvas + OrbitControls
│   │   ├── F1Car.jsx                            ← CarModel: GLB loader + auto-fit
│   │   └── F1CarProcedural.jsx                  ← fallback primitive car
│   ├── components/
│   │   ├── Navbar.jsx                           ← adapts dark/light over hero
│   │   ├── RaceStartLoader.jsx                  ← 5-light gantry intro
│   │   └── SectionHeader.jsx                    ← sector-board header (serif last word)
│   ├── sections/
│   │   ├── Home.jsx                             ← CREAM hero, name-wraps-car, interactive
│   │   ├── About.jsx                            ← centered editorial
│   │   ├── Skills.jsx                           ← centered 2-col bars
│   │   ├── Experience.jsx                       ← centered 2-col timelines
│   │   ├── Projects.jsx                         ← horizontal speed-gallery (scroll-driven)
│   │   └── Contact.jsx                          ← centered, serif pull-quote
│   └── index.css                               ← @theme tokens + type rules
├── index.html                                  ← Archivo/Fraunces/Inter/JetBrains font links
├── vite.config.js · package.json
└── STATUS.md                                   ← this file
```

---

## Known limitations / "good enough for now"

- **Bundle ~1.5 MB minified** (Three.js + drei). Code-splitting would help. Not blocking.
- **Mobile renders the hero 3D canvas** — heavy on low-end devices; no per-device asset swap yet.
- **GLB textures are 44 MB** — preloaded behind the race-start loader (~5–8 s cover); procedural fallback shows briefly on slow networks.
- **`petronas` token name is misleading** — value is electric teal, not gold. Comment in `src/index.css` explains. A clean rename would touch ~50 references.

---

Last picked up: 2026-05-29. Restructured from scroll-driven car choreography to
a **light interactive hero (drag-to-spin W13) + editorial scroll sections**, on
the new editorial-olive + Fraunces/Archivo theme. `npm run build` green.
