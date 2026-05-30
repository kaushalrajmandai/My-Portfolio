import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/* ── Dark minimal loader ─────────────────────────────────────────────────
   Deep-olive bg. The Mercedes star turns slowly while a teal arc sweeps
   around it; a soft "LOADING" pulses below. Only rotate/opacity animate
   (GPU-composited, looping) so it stays perfectly smooth. */
const BG   = "#0e120c";
const TEAL = "#26D6C5";

export default function RaceStartLoader({ onComplete }) {
  const [exiting, setExiting] = useState(false);

  const done = useRef(onComplete);
  useEffect(() => { done.current = onComplete; }, [onComplete]);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const HOLD = reduce ? 600 : 2200;
    const OUT  = reduce ? 400 : 750;
    const t = [];
    t.push(setTimeout(() => setExiting(true), HOLD));
    t.push(setTimeout(() => done.current?.(), HOLD + OUT));
    return () => t.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: BG }}
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
      aria-label="Loading"
    >
      <motion.div
        className="relative"
        style={{ width: "clamp(104px, 15vw, 156px)", aspectRatio: "1" }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: exiting ? 1.12 : 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* teal arc sweeping — the continuous motion */}
        <motion.svg
          viewBox="0 0 200 200"
          className="absolute inset-0 h-full w-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          aria-hidden="true"
        >
          <circle cx="100" cy="100" r="93" fill="none" stroke="rgba(38,214,197,0.12)" strokeWidth="1.5" />
          <circle
            cx="100" cy="100" r="93"
            fill="none"
            stroke={TEAL}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="175 600"
          />
        </motion.svg>

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

      {/* soft pulsing label */}
      <motion.span
        className="absolute bottom-[clamp(44px,8vh,76px)] font-mono text-[10px] uppercase tracking-[0.5em]"
        style={{ color: "rgba(231,232,221,0.55)" }}
        animate={{ opacity: exiting ? 0 : [0.35, 0.8, 0.35] }}
        transition={
          exiting
            ? { duration: 0.3 }
            : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
        }
      >
        Loading
      </motion.span>
    </motion.div>
  );
}
