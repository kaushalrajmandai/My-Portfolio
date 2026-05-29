import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { profile } from "../lib/data";

/**
 * Premium F1 race-start loader.
 *
 * Timeline:
 *   0.0s  intro — gantry drops in, broadcast HUD slides in, ambient red breathes
 *   1.2s  sequencing — 5 columns illuminate left→right (1s apart) with filament warm-up
 *   6.2s  hold — random 0.2–3.0s with all 10 lit, subtle gantry hum
 *    +    lights-out — instant blackout → white flash → motion smear → "LIGHTS OUT GO GO GO"
 *    +    exit — fade to site
 */

const STAGE = {
  INTRO: "intro",
  SEQUENCING: "sequencing",
  GO: "go",
  EXIT: "exit",
};

export default function RaceStartLoader({ onComplete }) {
  const [stage, setStage] = useState(STAGE.INTRO);
  const [litColumns, setLitColumns] = useState(0);

  useEffect(() => {
    const timers = [];
    const INTRO_END = 1200;
    const COL_INTERVAL = 1000;

    timers.push(setTimeout(() => setStage(STAGE.SEQUENCING), INTRO_END));

    for (let i = 1; i <= 5; i++) {
      timers.push(
        setTimeout(() => setLitColumns(i), INTRO_END + i * COL_INTERVAL)
      );
    }

    const holdMs = 200 + Math.random() * 2800;
    const lightsOutAt = INTRO_END + 5 * COL_INTERVAL + holdMs;

    timers.push(
      setTimeout(() => {
        setLitColumns(0);
        setStage(STAGE.GO);
      }, lightsOutAt)
    );

    timers.push(setTimeout(() => setStage(STAGE.EXIT), lightsOutAt + 1100));
    timers.push(setTimeout(() => onComplete?.(), lightsOutAt + 1800));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const allLit = litColumns === 5;
  const exiting = stage === STAGE.EXIT;

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-hidden bg-[#020203]"
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      role="status"
      aria-live="polite"
      aria-label="Race start sequence"
    >
      {/* Layer 0: deep vignette + scanlines */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.9)_100%)]" />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.4) 1px, transparent 1px, transparent 3px)",
        }}
      />

      {/* Layer 1: ambient red atmosphere — builds with lit columns */}
      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-screen"
        animate={{
          background:
            litColumns > 0
              ? `radial-gradient(ellipse 80% 60% at center 38%, rgba(255,24,1,${0.05 + litColumns * 0.045}) 0%, transparent 65%)`
              : "transparent",
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      />

      {/* Layer 2: broadcast HUD */}
      <BroadcastHUD stage={stage} litColumns={litColumns} />

      {/* Layer 3: the gantry (centerpiece) */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: "1400px" }}
        animate={
          stage === STAGE.GO
            ? { scaleX: 8, filter: "blur(40px)", opacity: 0 }
            : allLit
              ? { x: [0, -0.6, 0.6, -0.4, 0.4, 0], y: [0, 0.3, -0.3, 0.2, 0] }
              : { scaleX: 1, filter: "blur(0px)", opacity: 1 }
        }
        transition={
          stage === STAGE.GO
            ? { duration: 0.55, ease: [0.7, 0, 0.3, 1] }
            : { duration: 0.12, repeat: allLit ? Infinity : 0 }
        }
      >
        <Gantry stage={stage} litColumns={litColumns} />
      </motion.div>

      {/* Layer 4: lights-out white flash */}
      <AnimatePresence>
        {stage === STAGE.GO && (
          <motion.div
            key="flash"
            className="absolute inset-0 pointer-events-none bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.95, 0] }}
            transition={{ duration: 0.18, times: [0, 0.15, 1] }}
          />
        )}
      </AnimatePresence>

      {/* Layer 5: horizontal speed streaks */}
      <AnimatePresence>
        {stage === STAGE.GO && <SpeedStreaks />}
      </AnimatePresence>

      {/* Layer 6: GO! typography */}
      <AnimatePresence>
        {stage === STAGE.GO && <LightsOutText />}
      </AnimatePresence>
    </motion.div>
  );
}

/* ---------------- Gantry ---------------- */

function Gantry({ stage, litColumns }) {
  const intro = stage === STAGE.INTRO;

  return (
    <motion.div
      className="relative"
      initial={{ y: -120, opacity: 0, rotateX: -6 }}
      animate={
        intro
          ? { y: -120, opacity: 0, rotateX: -6 }
          : { y: 0, opacity: 1, rotateX: 3 }
      }
      transition={{ duration: 0.85, ease: [0.2, 0.8, 0.2, 1], delay: 0.15 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Suspension cables */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-32 flex gap-36">
        <Cable />
        <Cable />
      </div>

      {/* Top aluminum support bar — fixed width, rivets at extremes only */}
      <div
        className="relative mx-auto h-[14px] w-[480px] rounded-[2px] border-t border-white/15 border-b border-black/80"
        style={{
          background:
            "linear-gradient(180deg, #b8babd 0%, #797c80 38%, #404347 70%, #1d2024 100%)",
          boxShadow:
            "0 5px 12px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.32)",
        }}
      >
        {[0.03, 0.97].map((p) => (
          <span
            key={p}
            className="absolute top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-black/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
            style={{ left: `${p * 100}%`, transform: "translate(-50%, -50%)" }}
          />
        ))}
      </div>

      {/* Mounting brackets — small vertical tabs hanging from bar above each housing */}
      <div className="flex justify-center gap-[10px] -mt-px">
        {[1, 2, 3, 4, 5].map((col) => (
          <div
            key={col}
            className="h-[6px] w-[68px] flex justify-center"
          >
            <span
              className="block h-[6px] w-3 bg-gradient-to-b from-[#5a5d61] to-[#1d2024]"
              style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)" }}
            />
          </div>
        ))}
      </div>

      {/* Light housing row — strictly equal-width columns */}
      <div className="flex justify-center gap-[10px]">
        {[1, 2, 3, 4, 5].map((col) => (
          <LightHousing key={col} on={col <= litColumns} />
        ))}
      </div>

      {/* FIA-style branding strip */}
      <div className="mt-4 mx-auto w-[480px] flex items-center justify-between px-1 font-mono text-[9px] tracking-[0.4em] uppercase text-white/25">
        <span>● Start Lights · Zone A</span>
        <span>System 04 — Armed</span>
      </div>
    </motion.div>
  );
}

function Cable() {
  return (
    <div
      className="h-32 w-[3px] rounded-full"
      style={{
        background:
          "linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 50%, #0a0a0a 100%)",
        boxShadow: "1px 0 0 rgba(0,0,0,0.6), -1px 0 0 rgba(255,255,255,0.05)",
      }}
    />
  );
}

function LightHousing({ on }) {
  return (
    <div
      className="relative flex flex-col items-center gap-2 rounded-md w-[68px] px-2 py-3"
      style={{
        background:
          "linear-gradient(180deg, #25272a 0%, #131517 60%, #08090b 100%)",
        boxShadow:
          "0 6px 14px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.07), inset 0 -1px 0 rgba(0,0,0,0.7)",
        border: "1px solid rgba(0,0,0,0.85)",
      }}
    >
      <Light on={on} />
      <Light on={on} />
    </div>
  );
}

function Light({ on }) {
  return (
    <div
      className="relative h-[46px] w-[46px] rounded-full"
      style={{
        background: on
          ? "radial-gradient(circle at 42% 36%, #ff8a78 0%, #ff2412 30%, #b50500 68%, #4a0100 100%)"
          : "radial-gradient(circle at 42% 36%, #1f0606 0%, #100202 60%, #040000 100%)",
        boxShadow: on
          ? `
            inset 0 0 5px rgba(0,0,0,0.45),
            inset 0 2px 3px rgba(255,180,160,0.38),
            0 0 14px 4px rgba(255,28,12,0.8),
            0 0 30px 10px rgba(255,28,12,0.45),
            0 0 64px 22px rgba(255,40,18,0.2)
          `
          : `
            inset 0 3px 5px rgba(0,0,0,0.95),
            inset 0 -1px 2px rgba(255,255,255,0.03)
          `,
        transition: "background 220ms ease-out, box-shadow 180ms ease-out",
      }}
    >
      {on && (
        <motion.span
          className="absolute left-1/2 top-[36%] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: [0.4, 1.12, 1], opacity: [0, 1, 0.88] }}
          transition={{ duration: 0.2, times: [0, 0.6, 1], ease: "easeOut" }}
          style={{
            width: 11,
            height: 11,
            background: "#fff5e8",
            filter: "blur(1.5px)",
            boxShadow: "0 0 12px 3px #ffd0bc",
          }}
        />
      )}

      {/* Lens sheen */}
      <span
        className="pointer-events-none absolute inset-x-2 top-1 h-[7px] rounded-full opacity-25"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, transparent 100%)",
        }}
      />
    </div>
  );
}

/* ---------------- Broadcast HUD ---------------- */

function BroadcastHUD({ stage, litColumns }) {
  const intro = stage === STAGE.INTRO;
  const slide = intro ? -20 : 0;

  return (
    <>
      {/* Top-left FIA tag */}
      <motion.div
        className="absolute left-6 top-6 flex items-center gap-3"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: intro ? 0 : 1, x: slide }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center gap-2 rounded-sm bg-race-red px-2.5 py-1 font-display font-black text-xs tracking-[0.2em] text-white">
          ● LIVE
        </div>
        <div className="font-display font-black text-sm tracking-[0.25em] text-white/90">
          FORMULA 1 · RACE START
        </div>
      </motion.div>

      {/* Top-right session info */}
      <motion.div
        className="absolute right-6 top-6 text-right font-mono text-[10px] tracking-[0.3em] uppercase text-white/60"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: intro ? 0 : 1, x: intro ? 20 : 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <div className="text-petronas">SESSION · RACE</div>
        <div>LAP 1 / 58</div>
      </motion.div>

      {/* Bottom-left track conditions */}
      <motion.div
        className="absolute bottom-6 left-6 font-mono text-[10px] tracking-[0.3em] uppercase text-white/60 space-y-0.5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: intro ? 0 : 1, y: intro ? 20 : 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div>
          AIR <span className="text-white/90">28°C</span>{" "}
          <span className="ml-3">TRACK</span>{" "}
          <span className="text-white/90">42°C</span>
        </div>
        <div>
          WIND <span className="text-white/90">12 KM/H NE</span>
        </div>
        <div>
          TYRE <span className="text-petronas">SOFT</span> · COMPOUND C4
        </div>
      </motion.div>

      {/* Bottom-right driver tag */}
      <motion.div
        className="absolute bottom-6 right-6 text-right"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: intro ? 0 : 1, y: intro ? 20 : 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        <div className="flex items-center justify-end gap-3">
          <div className="text-right">
            <div className="font-display font-black text-base tracking-[0.18em] text-white/90 uppercase leading-none">
              {profile.name}
            </div>
            <div className="mt-1 font-mono text-[10px] tracking-[0.3em] text-petronas">
              {profile.initials} · INDEPENDENT
            </div>
          </div>
          <div className="rounded-sm border-l-4 border-petronas bg-mercedes-black px-3 py-2 font-numeric text-3xl text-white leading-none">
            {profile.number}
          </div>
        </div>
      </motion.div>

      {/* Center status pill */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 bottom-28 font-mono text-xs tracking-[0.45em] uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: intro ? 0 : 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {stage === STAGE.SEQUENCING && litColumns < 5 && (
          <span className="text-white/40">
            ◆ Lights Sequence · {litColumns} / 5
          </span>
        )}
        {stage === STAGE.SEQUENCING && litColumns === 5 && (
          <motion.span
            className="text-race-red font-bold"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 0.4, repeat: Infinity }}
          >
            ● STANDBY ●
          </motion.span>
        )}
      </motion.div>
    </>
  );
}

/* ---------------- Lights-out FX ---------------- */

function SpeedStreaks() {
  const streaks = Array.from({ length: 14 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {streaks.map((_, i) => {
        const top = (i / streaks.length) * 100 + (Math.random() * 4 - 2);
        const delay = Math.random() * 0.1;
        const len = 30 + Math.random() * 50;
        return (
          <motion.span
            key={i}
            className="absolute h-px"
            style={{
              top: `${top}%`,
              left: 0,
              width: `${len}%`,
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)",
              filter: "blur(0.5px)",
            }}
            initial={{ x: "-30%", opacity: 0 }}
            animate={{ x: "130%", opacity: [0, 1, 0] }}
            transition={{
              duration: 0.45,
              delay,
              ease: [0.7, 0, 0.3, 1],
            }}
          />
        );
      })}
    </div>
  );
}

function LightsOutText() {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, delay: 0.08 }}
    >
      <motion.div
        className="font-display font-black text-white tracking-[0.18em] text-5xl md:text-8xl"
        style={{
          textShadow:
            "0 0 14px rgba(255,255,255,0.7), 0 0 40px rgba(255,24,1,0.5)",
        }}
        initial={{ scale: 0.92, letterSpacing: "0.4em" }}
        animate={{ scale: 1, letterSpacing: "0.18em" }}
        transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
      >
        LIGHTS OUT
      </motion.div>
      <motion.div
        className="mt-4 font-display font-black text-race-red tracking-[0.3em] text-2xl md:text-4xl"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: [0, 1, 1, 0.4, 1, 0.4, 1], y: 0 }}
        transition={{ duration: 0.9, delay: 0.15, times: [0, 0.1, 0.25, 0.4, 0.55, 0.7, 0.9] }}
      >
        GO · GO · GO
      </motion.div>
    </motion.div>
  );
}
