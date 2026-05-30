import { Suspense, useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  ContactShadows,
  OrbitControls,
} from "@react-three/drei";
import * as THREE from "three";
import CarModel from "./F1Car";

/**
 * Interactive hero car — a self-contained studio canvas.
 *
 * Scroll exit, driven by `progressRef` (0 hero top -> 1 hero bottom):
 *  PHASE 1  p 0 -> settleFraction:
 *    The camera REVOLVES from wherever the idle spin/drag left it to the fixed
 *    LAUNCH_CAM framing (top-down), proportional to scroll. Idle spin + drag are
 *    off the instant you scroll. (The page is held by the sticky hero in Home.)
 *  PHASE 2  p settleFraction -> 1:
 *    Camera holds at LAUNCH_CAM; the car DRIVES FORWARD (along +Z), no scaling,
 *    so it reads as going down/away behind the dark curtain Home raises.
 *
 * CAPTURE: set POSE_CAPTURE = true to drag freely and read the camera
 * `position` + `target` in the HUD (also console). Paste into LAUNCH_CAM/START.
 */

// ===== set true to read camera values in the HUD ===========================
const POSE_CAPTURE = false;
// ===========================================================================

// `baseRotY` decides which face shows at load — PI = head-on front.
const POSE = { baseRotY: Math.PI, initialScale: 1 };

// Framing ON LOAD (camera + orbit pivot).
const START = { position: [0.05, 0.09, 5.22], target: [0, 0.42, 0] };
const START_POS = new THREE.Vector3(...START.position);
const START_TGT = new THREE.Vector3(...START.target);

// Framing the car REVOLVES into when you start scrolling (captured top-down).
const LAUNCH_CAM = { position: [1.28, 5, 2.18], target: [0, 0.42, 0] };
const LAUNCH_POS = new THREE.Vector3(...LAUNCH_CAM.position);
const LAUNCH_TGT = new THREE.Vector3(...LAUNCH_CAM.target);

// Phase-2 forward drive distance (world +Z). The car drives forward as About
// wipes up over it — so it drives off behind the section. Raise for a longer
// drive, flip the sign to reverse.
const FWD_DIST = 6;

const SPIN_DELAY_MS = 1200;
const r2 = (n) => Math.round(n * 100) / 100;
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const smooth = (a, b, p) => {
  const t = clamp01((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};

function CarRig({ progressRef, spin, settleFraction, dragging }) {
  const ref = useRef();
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls);
  const fromPos = useMemo(() => new THREE.Vector3(), []);
  const fromTgt = useMemo(() => new THREE.Vector3(), []);
  const snapped = useRef(false);
  const homed = useRef(true); // camera begins at START on load

  useFrame((_, delta) => {
    const g = ref.current;
    if (!g) return;
    if (POSE_CAPTURE) return; // drag freely while capturing

    const k = 1 - Math.pow(0.0015, delta);
    const p = THREE.MathUtils.clamp(progressRef?.current ?? 0, 0, 1);
    const scrolling = p > 0.001;

    if (controls) {
      // Idle auto-spin only once the camera has settled back at START — so the
      // home-ease below isn't fought by autoRotate — and never while dragging.
      controls.autoRotate = !scrolling && spin && homed.current && !dragging;
      controls.enabled = !scrolling; // lock drag during the exit
    }

    if (!scrolling) {
      // idle — ease the car body back to the origin
      snapped.current = false;
      g.position.x += (0 - g.position.x) * k;
      g.position.y += (0 - g.position.y) * k;
      g.position.z += (0 - g.position.z) * k;

      // After a scroll exit the camera is left in the launch framing. Ease it
      // back to the default START pose so the hero fully resets when the user
      // scrolls back up. Skip while dragging so "drag to rotate" stays free.
      if (controls && !homed.current) {
        if (dragging) {
          homed.current = true; // user took over — stop auto-homing
        } else {
          camera.position.lerp(START_POS, k);
          controls.target.lerp(START_TGT, k);
          controls.update();
          if (camera.position.distanceTo(START_POS) < 0.02) homed.current = true;
        }
      }
      return;
    }

    // scrolling → the next idle should re-home the camera to START
    homed.current = false;

    // snapshot where the camera was the instant scrolling began, so the revolve
    // starts from there no matter where the idle spin/drag left it
    if (controls && !snapped.current) {
      fromPos.copy(camera.position);
      fromTgt.copy(controls.target);
      snapped.current = true;
    }

    // PHASE 1 — revolve the camera into the launch framing, tied to scroll
    const settle = smooth(0, settleFraction, p);
    if (controls) {
      camera.position.lerpVectors(fromPos, LAUNCH_POS, settle);
      controls.target.lerpVectors(fromTgt, LAUNCH_TGT, settle);
      controls.update();
    }

    // PHASE 2 — drive forward, tied to scroll (no scaling)
    const phase2 = smooth(settleFraction, 1, p);
    const targetZ = THREE.MathUtils.lerp(0, FWD_DIST, phase2);
    g.position.z += (targetZ - g.position.z) * k;
  });

  return (
    <group ref={ref} rotation={[0, POSE.baseRotY, 0]} scale={POSE.initialScale}>
      <CarModel />
    </group>
  );
}

export default function HeroCar({
  active = true,
  progressRef,
  revealed = true,
  settleFraction = 0.45,
}) {
  const [dragging, setDragging] = useState(false);
  const [captured, setCaptured] = useState(null);
  const [spin, setSpin] = useState(false);
  const [mobileRotate, setMobileRotate] = useState(false);
  const isMobile = useMemo(() => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches, []);

  // Auto-disable rotate mode after 5s of inactivity on mobile.
  const rotateTimer = useRef(null);
  const enableMobileRotate = useCallback(() => {
    setMobileRotate(true);
    clearTimeout(rotateTimer.current);
    rotateTimer.current = setTimeout(() => setMobileRotate(false), 5000);
  }, []);

  // Start the idle spin a short beat after the lights sequence reveals the site.
  useEffect(() => {
    if (!revealed) return;
    const id = setTimeout(() => setSpin(true), SPIN_DELAY_MS);
    return () => clearTimeout(id);
  }, [revealed]);

  // On mobile, canvas is pointer-events-none unless rotate mode is active.
  const canvasPointerEvents = isMobile ? (mobileRotate ? "auto" : "none") : "auto";

  return (
    <div className="relative h-full w-full" style={{ touchAction: "pan-y" }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        frameloop={active ? "always" : "never"}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
        camera={{ position: START.position, fov: 38 }}
        onPointerDown={() => setDragging(true)}
        onPointerUp={() => setDragging(false)}
        style={{ cursor: dragging ? "grabbing" : "grab", touchAction: "pan-y", pointerEvents: canvasPointerEvents }}
      >
        {/* Soft studio key/fill/rim for a dark car on a light backdrop */}
        <ambientLight intensity={0.55} />
        <directionalLight
          position={[4, 7, 5]}
          intensity={2.6}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0002}
        />
        <directionalLight position={[-6, 5, -4]} intensity={1.4} color="#eef2f6" />
        {/* warm rim from behind to pick out the car's silhouette + teal livery */}
        <directionalLight position={[-2, 2, -6]} intensity={1.1} color="#26d6c5" />
        <pointLight position={[2, 0.6, 3]} intensity={0.5} color="#ffffff" />

        <Suspense fallback={null}>
          <CarRig
            progressRef={progressRef}
            spin={spin && !POSE_CAPTURE}
            settleFraction={settleFraction}
            dragging={dragging}
          />

          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.42}
            scale={12}
            blur={2.6}
            far={4}
            color="#0c0f0a"
          />

          {/* Inline softbox reflections (no external HDRI fetch) */}
          <Environment frames={1} resolution={256} background={false}>
            <Lightformer
              intensity={2.4}
              position={[4, 6, 4]}
              rotation-y={Math.PI / 4}
              scale={[10, 12, 1]}
              color="#ffffff"
            />
            <Lightformer
              intensity={2.0}
              position={[-5, 5, -5]}
              rotation-y={-Math.PI / 4}
              scale={[12, 10, 1]}
              color="#eaf0f4"
            />
            <Lightformer
              intensity={1.2}
              position={[0, -3, 4]}
              rotation-x={Math.PI / 2}
              scale={[10, 10, 1]}
              color="#cfd6dc"
            />
            <Lightformer
              intensity={1.0}
              position={[-6, 1.5, 0]}
              rotation-y={Math.PI / 2}
              scale={[4, 4, 1]}
              color="#26d6c5"
            />
          </Environment>
        </Suspense>

        {/* Zoom is intentionally DISABLED — wheel/trackpad zoom was capturing the
            page scroll, trapping the viewer in the hero. Drag-to-rotate stays.
            Damping OFF so our scroll-driven camera moves aren't fought. */}
        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={false}
          autoRotate={false}
          autoRotateSpeed={0.72}
          enableDamping={false}
          touches={isMobile && !mobileRotate ? { ONE: undefined, TWO: undefined } : undefined}
          minPolarAngle={Math.PI * 0.16}
          maxPolarAngle={Math.PI * 0.52}
          target={START.target}
          onEnd={
            POSE_CAPTURE
              ? (e) => {
                  const c = e.target;
                  const cp = c.object.position;
                  const t = c.target;
                  const pose = {
                    position: [r2(cp.x), r2(cp.y), r2(cp.z)],
                    target: [r2(t.x), r2(t.y), r2(t.z)],
                  };
                  // eslint-disable-next-line no-console
                  console.log(
                    "CAR POSE -> position: [" +
                      pose.position +
                      "]  target: [" +
                      pose.target +
                      "]"
                  );
                  setCaptured(pose);
                }
              : undefined
          }
        />
      </Canvas>

      {POSE_CAPTURE && (
        <div className="pointer-events-none absolute left-3 top-3 rounded-md bg-black/85 px-3 py-2 font-mono text-[11px] leading-relaxed text-petronas">
          <div className="mb-1 text-white/60">DRAG THE CAR · then send me these</div>
          <div>position: [{(captured?.position ?? START.position).join(", ")}]</div>
          <div>target: [{(captured?.target ?? START.target).join(", ")}]</div>
        </div>
      )}

      {/* Mobile-only rotate toggle — tap to enable car rotation for 5s */}
      {isMobile && (
        <button
          onTouchStart={(e) => { e.stopPropagation(); enableMobileRotate(); }}
          onClick={enableMobileRotate}
          className="md:hidden absolute top-4 right-4 z-30 flex items-center gap-1.5 rounded-full border border-mercedes-jet/20 bg-cream/70 px-3 py-1.5 font-mono text-[9px] tracking-[0.25em] uppercase text-mercedes-jet/60 backdrop-blur-sm transition-colors"
          style={{ pointerEvents: "auto", touchAction: "manipulation" }}
        >
          {mobileRotate ? "↻ Rotating…" : "↻ Rotate car"}
        </button>
      )}
    </div>
  );
}
