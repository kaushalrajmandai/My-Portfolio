import { useEffect, useRef, useState } from "react";
import { motion, useScroll } from "framer-motion";
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
const HERO_VH = 250; // total scroll length of the hero, in vh
// Car finishes revolving into the launch pose well BEFORE About starts wiping
// up: with PIN = 150vh, the revolve ends ~42vh in, About only enters at ~50vh,
// so there's a brief hold on the fully-settled pose before the page moves.
const SETTLE_FRACTION = 0.28; // share of that scroll spent revolving into pose

export default function Home({ revealed = true }) {
  const ref = useRef(null);
  const progressRef = useRef(0);
  const [inView, setInView] = useState(true);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // The hero stays pinned & fully opaque the whole time. The exit is the About
  // section (opaque, stacked ABOVE this, pulled up with -mt-[100vh]) sliding up
  // and wiping over the pinned car — so the car literally drives BEHIND About.
  // No curtain, no fade, no dead black "tail". The hint/name copy still fades
  // out during phase 2 so it's gone before About covers it.

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
      className="relative z-10 text-mercedes-jet"
      style={{ height: `${HERO_VH}vh` }}
    >
      {/* Sticky stage — stays pinned while About (above it) slides up and over. */}
      <div className="sticky top-0 h-screen overflow-hidden bg-cream">
        {/* Soft studio light-pool */}
        <div className="pointer-events-none absolute inset-0 z-0 [background:radial-gradient(58%_52%_at_50%_40%,#f7f5ef,transparent_72%)]" />

        {/* Name (z-10) — sits BELOW the car so the launch pose can cover it.
            It does NOT fade: it simply gets occluded by the car, then hidden
            behind the opaque About section as that wipes up over the hero. */}
        <motion.div
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

        {/* Footer cues (z-10 = BEHIND the car, fades in phase 2):
            drag-hint bottom-left · tagline centered · scroll-cue bottom-right. */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-5 z-10 flex items-end justify-between gap-4 px-6 md:px-12"
        >
          {/* bottom-left — drag hint */}
          <span className="rounded-full border border-mercedes-jet/15 bg-cream/60 px-3 py-0.5 font-mono text-[9px] tracking-[0.3em] uppercase text-mercedes-jet/50 backdrop-blur-sm">
            ↻ Drag to rotate the car
          </span>

          {/* center — role + location (sits below Rajmandai's descenders) */}
          <span className="font-mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-mercedes-jet/55">
            {profile.tagline.split(" · ")[0]} · {profile.location}
          </span>

          {/* bottom-right — scroll cue + travelling line */}
          <span className="flex flex-col items-center gap-1.5">
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-mercedes-jet/40">
              Scroll to explore
            </span>
            <span className="relative block h-6 w-px overflow-hidden bg-mercedes-jet/15">
              <motion.span
                className="absolute left-0 top-0 block h-1/2 w-px bg-gradient-to-b from-transparent via-petronas-deep to-petronas-deep"
                animate={{ y: ["-100%", "200%"] }}
                transition={{
                  duration: 1.8,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 0.2,
                }}
              />
            </span>
          </span>
        </motion.div>
      </div>
    </section>
  );
}
