import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import HeroCar from "../three/HeroCar";
import { profile } from "../lib/data";

/**
 * Home — light "studio" hero with a scroll-pinned car exit.
 *
 * The section is tall (HERO_VH) with a STICKY inner stage, so as you scroll the
 * hero stays put — the page doesn't advance until the choreography is done:
 *   p 0 -> SETTLE_FRACTION : the car revolves into the top-down launch pose.
 *   SETTLE_FRACTION -> 1   : the car drives forward while a dark curtain rises
 *                            (the next section "coming up"); the car slips
 *                            behind it. Then About continues below.
 */
const HERO_VH = 240; // total scroll length of the hero, in vh
const SETTLE_FRACTION = 0.45; // share of that scroll spent revolving into pose

export default function Home({ revealed = true }) {
  const ref = useRef(null);
  const progressRef = useRef(0);
  const [inView, setInView] = useState(true);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Phase 2 visuals: dark curtain rises, finishing right as the pin releases so
  // About rises up on the SAME black with no dead pinned-black stretch.
  const curtainH = useTransform(
    scrollYProgress,
    [SETTLE_FRACTION, 1],
    ["0%", "102%"]
  );
  const fade = useTransform(
    scrollYProgress,
    [SETTLE_FRACTION, SETTLE_FRACTION + 0.18],
    [1, 0]
  );

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      progressRef.current = v;
    });
    return () => unsub();
  }, [scrollYProgress]);

  // Pause the WebGL render loop when the hero scrolls out of view (perf).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.02,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const [first, ...rest] = profile.name.split(" ");
  const last = rest.join(" ");

  return (
    <section
      id="home"
      ref={ref}
      className="relative bg-cream text-mercedes-jet"
      style={{ height: `${HERO_VH}vh` }}
    >
      {/* Sticky stage — stays put while the section scrolls past (the "pin"). */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Soft studio light-pool */}
        <div className="pointer-events-none absolute inset-0 z-0 [background:radial-gradient(58%_52%_at_50%_40%,#f7f5ef,transparent_72%)]" />

        {/* Name (z-10) — sits BELOW the car so the launch pose can cover it. */}
        <motion.div
          style={{ opacity: fade }}
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-[30vh] px-6 text-center md:gap-[34vh]"
        >
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="mb-4 font-mono text-[11px] tracking-[0.45em] uppercase text-petronas-deep"
            >
              ◆ Box Box · Driver #{profile.number}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25 }}
              className="font-display font-black uppercase leading-[0.86] tracking-[-0.04em] text-7xl md:text-8xl lg:text-9xl text-mercedes-jet"
            >
              {first}
            </motion.h1>
          </div>

          <div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4 }}
              className="font-serif italic font-medium leading-[0.82] text-6xl md:text-8xl lg:text-9xl text-petronas-deep"
            >
              {last}
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.6 }}
              className="mt-6 font-mono text-[11px] md:text-xs tracking-[0.35em] uppercase text-mercedes-jet/55"
            >
              {profile.tagline.split(" · ")[0]} · {profile.location}
            </motion.div>
          </div>
        </motion.div>

        {/* Interactive car (z-20) — above the name, behind the curtain. */}
        <div className="absolute inset-0 z-20">
          <HeroCar
            active={inView}
            progressRef={progressRef}
            revealed={revealed}
            settleFraction={SETTLE_FRACTION}
          />
        </div>

        {/* Interaction hint + scroll cue (z-10 = BEHIND the car, fades in phase 2) */}
        <motion.div
          style={{ opacity: fade }}
          className="pointer-events-none absolute inset-x-0 bottom-7 z-10 flex flex-col items-center gap-3"
        >
          <span className="rounded-full border border-mercedes-jet/15 bg-cream/60 px-3 py-1 font-mono text-[9px] tracking-[0.3em] uppercase text-mercedes-jet/50 backdrop-blur-sm">
            ↻ Drag to rotate the car
          </span>
          <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-mercedes-jet/40">
            Scroll · Formation Lap
          </span>
          <span className="h-7 w-px bg-gradient-to-b from-mercedes-jet/40 to-transparent" />
        </motion.div>

        {/* Rising dark curtain (z-30) — the next section "coming up". The car
            drives down behind this as it grows from the bottom. */}
        <motion.div
          style={{ height: curtainH }}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-mercedes-jet from-70% via-mercedes-jet/95 to-transparent"
        />
      </div>
    </section>
  );
}
