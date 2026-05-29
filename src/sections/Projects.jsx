import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  motion,
  useScroll,
  useTransform,
  useVelocity,
  useSpring,
} from "framer-motion";
import { projects } from "../lib/data";
import CarModel from "../three/F1Car";
import SectionHeader from "../components/SectionHeader";

/**
 * Projects — horizontal "speed gallery" (charlesleclerc.com homage). Vertical
 * scroll through a tall pinned section drives a horizontal card track; scroll
 * VELOCITY adds a motion-blur + speed-streak feel, a little F1 drives across
 * the bottom, and each card scales up as it passes the viewport centre.
 */
export default function Projects() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [range, setRange] = useState(0);
  const [inView, setInView] = useState(false);
  const [facingRight, setFacingRight] = useState(true);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Guard: before the tall section is laid out, scroll progress can briefly be
  // NaN. That produces invalid keyframes (scale(NaN), blur(NaNpx)) and makes
  // WAAPI's element.animate() throw a TypeError. Coerce to a finite value
  // before anything downstream consumes it.
  const progress = useTransform(scrollYProgress, (v) =>
    Number.isFinite(v) ? v : 0
  );

  // Measure how far the track must translate so the last card reaches the edge.
  useEffect(() => {
    const measure = () => {
      if (trackRef.current)
        setRange(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const xRaw = useTransform(progress, [0, 1], [0, -range]);
  const x = useSpring(xRaw, { stiffness: 90, damping: 22, mass: 0.4 });

  // Scroll velocity → speed-streak intensity (transform/opacity only — no
  // animated `filter`, which WAAPI handles unreliably).
  const velocity = useVelocity(progress);
  const smoothVel = useSpring(velocity, { stiffness: 200, damping: 40 });
  const streakOpacity = useTransform(smoothVel, [-1.5, 0, 1.5], [0.6, 0, 0.6], {
    clamp: true,
  });
  const streakScaleX = useTransform(smoothVel, [-1.5, 0, 1.5], [1.4, 1, 1.4], {
    clamp: true,
  });

  // Car faces against the scroll: left on the way down, right on the way up.
  useEffect(() => {
    const unsub = smoothVel.on("change", (v) => {
      if (v > 0.0005) setFacingRight(false);
      else if (v < -0.0005) setFacingRight(true);
    });
    return () => unsub();
  }, [smoothVel]);

  // Only run the little car's WebGL loop while the garage is on screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Little F1 drives across the bottom as you scroll through the garage.
  const carX = useTransform(progress, [0, 1], ["-14vw", "104vw"]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative h-[320vh] bg-mercedes-jet"
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        <SpeedStreaks opacity={streakOpacity} scaleX={streakScaleX} />

        {/* Header pinned top-left */}
        <div className="absolute top-24 left-6 md:left-12 z-20">
          <SectionHeader
            number="04"
            eyebrow="The Garage"
            title="Featured Projects"
          />
        </div>

        {/* Horizontal card track */}
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex items-center gap-6 md:gap-8 px-[8vw] will-change-transform"
        >
          {projects.map((p, i) => (
            <ProjectCardH
              key={p.name}
              project={p}
              index={i}
              count={projects.length}
              progress={progress}
            />
          ))}
        </motion.div>

        {/* The track — a single fine line the car runs along. Faded ends keep it
            premium (no hard edges); appears/disappears with the car. */}
        <motion.div
          aria-hidden="true"
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="pointer-events-none absolute inset-x-0 bottom-[2.75rem] z-0"
        >
          <div className="h-px w-full bg-gradient-to-r from-transparent via-mercedes-silver-dark/40 to-transparent" />
          <div className="h-4 w-full bg-gradient-to-b from-mercedes-silver-dark/[0.06] to-transparent blur-[2px]" />
        </motion.div>

        {/* Driving car (real W13 GLB) — with a soft contact shadow grounding it
            on the track as it moves. */}
        <motion.div style={{ x: carX }} className="absolute bottom-10 left-0 z-10">
          <div className="relative">
            <DrivingCar3D active={inView} facingRight={facingRight} />
            <div className="pointer-events-none absolute bottom-[3px] left-1/2 h-[6px] w-28 -translate-x-1/2 rounded-[50%] bg-black/40 blur-md" />
          </div>
        </motion.div>

      </div>
    </section>
  );
}

/* ---------------- One card ---------------- */

function ProjectCardH({ project, index, count, progress }) {
  // Card peaks (scales up) when scroll brings it to the viewport centre.
  const center = count > 1 ? index / (count - 1) : 0.5;
  const span = 0.5 / count;
  const scale = useTransform(
    progress,
    [center - span * 2, center, center + span * 2],
    [0.9, 1.03, 0.9],
    { clamp: true }
  );
  const opacity = useTransform(
    progress,
    [center - span * 3, center, center + span * 3],
    [0.5, 1, 0.5],
    { clamp: true }
  );

  const img = ogImage(project.github);

  return (
    <motion.article
      style={{ scale, opacity }}
      className="group relative shrink-0 w-[82vw] sm:w-[440px] md:w-[480px] h-[300px] overflow-hidden rounded-xl border border-mercedes-silver-dark/15 bg-mercedes-black"
    >
      {img ? (
        <img
          src={img}
          alt={project.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-petronas/25 via-mercedes-black to-mercedes-jet" />
      )}

      {/* readability scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-mercedes-jet via-mercedes-jet/55 to-transparent" />

      <span className="absolute top-2 right-4 font-numeric text-6xl leading-none text-petronas/25">
        0{index + 1}
      </span>

      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="font-display font-black text-2xl text-mercedes-silver leading-tight">
          {project.name}
        </h3>
        <p className="mt-1.5 max-w-[92%] text-xs leading-relaxed text-mercedes-silver-dark line-clamp-2">
          {project.blurb}
        </p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-x-2 font-mono text-[9px] tracking-[0.15em] uppercase text-mercedes-silver-dark">
            {project.tech.slice(0, 4).map((t, i) => (
              <span key={t}>
                {t}
                {i < Math.min(project.tech.length, 4) - 1 && (
                  <span className="text-mercedes-silver-dark/30 ml-2">·</span>
                )}
              </span>
            ))}
          </div>
          <div className="flex gap-2 shrink-0">
            {project.github && (
              <IconLink href={project.github} label="GitHub">
                <GitHubIcon />
              </IconLink>
            )}
            {project.live && (
              <IconLink href={project.live} label="Live">
                <ExternalIcon />
              </IconLink>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ---------------- Speed streaks ---------------- */

function SpeedStreaks({ opacity, scaleX }) {
  const rows = [14, 28, 42, 60, 74, 86];
  return (
    <motion.div
      style={{ opacity, scaleX }}
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden="true"
    >
      {rows.map((top, i) => (
        <div
          key={i}
          className="absolute h-px bg-gradient-to-r from-transparent via-mercedes-silver-dark/60 to-transparent blur-[1px]"
          style={{ top: `${top}%`, left: `${(i * 17) % 70}%`, width: `${30 + i * 9}%` }}
        />
      ))}
    </motion.div>
  );
}

/* ---------------- Driving F1 car (real W13 GLB) ---------------- */

// Reuses the hero's W13 GLB (useGLTF caches by URL — no extra download) as a
// tiny side-profile car driving across the garage. The outer group mirrors on
// X to flip facing with scroll direction. SIZE = the wrapper's width/height.
function DrivingCar3D({ active, facingRight }) {
  return (
    <div style={{ width: 150, height: 66 }}>
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0.25, 3.4], fov: 26 }}
      >
        <ambientLight intensity={0.85} />
        <directionalLight position={[3, 6, 4]} intensity={2.2} />
        <directionalLight position={[-4, 3, -3]} intensity={0.8} color="#26d6c5" />
        <Suspense fallback={null}>
          <group scale={[facingRight ? 1 : -1, 1, 1]}>
            {/* rotate to a side profile; nudge by ±PI/2 if it shows front/rear */}
            <group position={[0, -0.2, 0]} rotation={[0, Math.PI / 2, 0]}>
              <CarModel />
            </group>
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
}

/* ---------------- Helpers + icons ---------------- */

// GitHub auto-generates an OpenGraph preview image per repo — reused here as
// the project "photo". Returns null for projects without a repo.
function ogImage(githubUrl) {
  if (!githubUrl) return null;
  try {
    const path = new URL(githubUrl).pathname.replace(/^\/+|\/+$/g, "");
    if (!path.includes("/")) return null;
    return `https://opengraph.githubassets.com/1/${path}`;
  } catch {
    return null;
  }
}

function IconLink({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-sm bg-mercedes-jet/60 text-mercedes-silver hover:text-petronas transition-colors"
    >
      {children}
    </a>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.92.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.32-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.26.74-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18.91-.25 1.89-.38 2.86-.39.97.01 1.95.14 2.86.39 2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56C20.21 21.38 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 3h7v7M21 3l-9 9M5 5h6M19 13v6H5V5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
