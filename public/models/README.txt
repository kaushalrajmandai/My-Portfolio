═══════════════════════════════════════════════════════════════
  Drop a real F1 car GLB here as `f1-car.glb`
═══════════════════════════════════════════════════════════════

The site auto-detects the file. While it's missing, the procedural
fallback car renders. The moment you drop a valid `.glb` here, refresh
the page and the real car appears — no code changes needed.

──────────────────────────────────────────────────────────────
  RECOMMENDED MODEL — Mercedes F1 W14 (free, your actual team's car)
──────────────────────────────────────────────────────────────

  https://sketchfab.com/3d-models/mercedes-f1-w14-free-26fda66f3e8a48d5a636056f8a64e299

  Steps:
   1. Open the link above in a browser.
   2. Click "Download 3D Model" (top-right of the model page).
      You'll need a free Sketchfab account — sign in with Google works.
   3. Choose "glTF" format. You'll get a .zip file.
   4. Unzip it. Look for a `.glb` file (single self-contained binary).
        - If the zip contains `.gltf` + `.bin` + `textures/` folder
          instead of a single .glb, drop the WHOLE folder here and
          rename the .gltf file to `f1-car.gltf`, then update
          `carConfig.modelPath` in `src/lib/data.js` to `/models/f1-car.gltf`.
   5. Rename the .glb to `f1-car.glb` and place it in this folder.
   6. Refresh `http://localhost:5173/` — real car renders.

──────────────────────────────────────────────────────────────
  TUNING (if the car looks wrong)
──────────────────────────────────────────────────────────────

Open `src/lib/data.js` and edit `carConfig`:

  • Too big / small             → adjust `scale` (try 0.5, 0.2, 0.05…)
  • Facing the wrong way        → adjust `rotation` (radians)
  • Floating / sunken in floor  → adjust `position[1]`
  • Camera angles look off      → tweak `cameraStops` (same file)

──────────────────────────────────────────────────────────────
  OTHER FREE MODELS (in case W14 doesn't work for you)
──────────────────────────────────────────────────────────────

  • Generic F1 car:       https://sketchfab.com/3d-models/formula-1-car-e89589184eac42c08028db5cba3f6499
  • Free F1 cars set:     https://sketchfab.com/50HAM/collections/free-f1-cars-5a9de4d0a3914861b3c9bc18e8970c9b
  • Generic F1 2022 GLB:  https://fetchcfd.com/threeDViewGltf/2894  (direct download, no login)

──────────────────────────────────────────────────────────────
  LICENSE NOTE
──────────────────────────────────────────────────────────────

Most Sketchfab free models are CC-BY — you must credit the author somewhere
on the site. The footer in `src/sections/Contact.jsx` is a good spot — add
a line like "F1 W14 model by [author] (CC-BY 4.0)".
