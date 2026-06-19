import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/* ── Dark minimal loader with a real, smooth load percentage ──────────────
   Deep-olive bg. The Mercedes star breathes in the centre while a teal ring
   FILLS to the true download progress (driven by drei's loading manager).
   A monospace "NN%" counts up beneath it.

   `progress` is the real value (0–100) from useProgress. We never snap to it:
   a rAF loop eases a *displayed* value toward the target every frame, so the
   ring and the number always rise buttery-smooth even when the underlying
   progress arrives in chunky steps (one event per file). */
const BG   = "#0e120c";
const TEAL = "#26D6C5";

const R = 93;                       // progress-ring radius (matches viewBox 200)
const CIRC = 2 * Math.PI * R;       // ring circumference

export default function RaceStartLoader({ ready = false, progress = 0, onComplete }) {
  const [exiting, setExiting] = useState(false);
  const [minElapsed, setMinElapsed] = useState(false);
  const [disp, setDisp] = useState(0); // smoothed, displayed percentage (0–100)

  const done = useRef(onComplete);
  useEffect(() => { done.current = onComplete; }, [onComplete]);

  // Latest real target in a ref so the rAF loop always reads fresh values
  // without re-subscribing. Until the model is fully ready we hold just shy of
  // 100 (download can finish a beat before Draco decode + parse signals ready),
  // then race the last bit to 100 the moment it is.
  const targetRef = useRef(0);
  useEffect(() => {
    targetRef.current = ready ? 100 : Math.min(progress, 99);
  }, [progress, ready]);

  // Smoothly ease the displayed value toward the target, monotonically.
  useEffect(() => {
    let raf;
    const tick = () => {
      setDisp((prev) => {
        const target = targetRef.current;
        if (target <= prev) return prev;            // never go backwards
        const next = prev + (target - prev) * 0.12;  // exponential ease-in
        return target - next < 0.4 ? target : next;  // snap when nearly there
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Minimum display so the loader never flashes away instantly.
  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setMinElapsed(true), reduce ? 300 : 800);
    return () => clearTimeout(t);
  }, []);

  // Start the exit once the model is ready, the min time has passed, AND the
  // displayed counter has actually reached 100 — so the user always sees it
  // complete before the curtain lifts.
  useEffect(() => {
    if (!ready || !minElapsed || disp < 99.5) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const OUT = reduce ? 400 : 750;
    setExiting(true);
    const t = setTimeout(() => done.current?.(), OUT);
    return () => clearTimeout(t);
  }, [ready, minElapsed, disp]);

  const pct = Math.round(disp);
  const dashOffset = CIRC * (1 - disp / 100);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: BG }}
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
      role="progressbar"
      aria-label="Loading"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className="relative"
        style={{ width: "clamp(104px, 15vw, 156px)", aspectRatio: "1" }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: exiting ? 1.12 : 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Determinate progress ring — fills clockwise from the top to `disp`. */}
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 h-full w-full -rotate-90"
          aria-hidden="true"
        >
          {/* faint track */}
          <circle
            cx="100" cy="100" r={R}
            fill="none" stroke="rgba(38,214,197,0.12)" strokeWidth="3.5"
          />
          {/* progress arc */}
          <circle
            cx="100" cy="100" r={R}
            fill="none"
            stroke={TEAL}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 80ms linear" }}
          />
        </svg>

        {/* Mercedes star — upright emblem with a gentle breathing pulse */}
        <motion.svg
          viewBox="0 0 200 200"
          className="absolute inset-0 h-full w-full"
          style={{ color: "#e7e8dd" }}
          animate={{ scale: exiting ? 1 : [1, 1.05, 1] }}
          transition={
            exiting ? { duration: 0.3 } : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
          }
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="chrome" x1="0" y1="0" x2="0.35" y2="1">
              <stop offset="0%"   stopColor="#f6f7f1" />
              <stop offset="45%"  stopColor="#d3d6c8" />
              <stop offset="72%"  stopColor="#9ba291" />
              <stop offset="100%" stopColor="#e2e4d8" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="66.5" fill="none" stroke="url(#chrome)" strokeWidth="6" />
          <path
            d="M100 39 L110.6 96 L154.5 133 L100 114 L45.5 133 L89.4 96 Z"
            fill="url(#chrome)"
          />
        </motion.svg>
      </motion.div>

      {/* Live percentage + label */}
      <motion.div
        className="absolute bottom-[clamp(40px,8vh,72px)] flex flex-col items-center gap-2"
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <span
          className="font-mono tabular-nums text-2xl md:text-3xl font-medium tracking-tight"
          style={{ color: "#e7e8dd" }}
        >
          {pct}
          <span className="text-base md:text-lg align-top" style={{ color: TEAL }}>%</span>
        </span>
        <span
          className="font-mono text-[10px] uppercase tracking-[0.5em]"
          style={{ color: "rgba(231,232,221,0.45)" }}
        >
          Loading
        </span>
      </motion.div>
    </motion.div>
  );
}
