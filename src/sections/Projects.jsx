import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useVelocity,
  useSpring,
} from "framer-motion";
import { projects } from "../lib/data";
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

  // Measure synchronously before first paint so range is correct on mount.
  useLayoutEffect(() => {
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
  const x = useSpring(xRaw, { stiffness: 120, damping: 28, mass: 0.3 });

  const velocity = useVelocity(progress);
  const streakOpacity = useTransform(velocity, [-1.5, 0, 1.5], [0.6, 0, 0.6], { clamp: true });
  const streakScaleX = useTransform(velocity, [-1.5, 0, 1.5], [1.4, 1, 1.4], { clamp: true });

  // Track section visibility for video play/pause control.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
            static
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
              sectionInView={inView}
            />
          ))}
        </motion.div>


      </div>
    </section>
  );
}

/* ---------------- One card ---------------- */

function ProjectCardH({ project, index, count, progress, sectionInView }) {
  const videoRef = useRef(null);
  const center = count > 1 ? index / (count - 1) : 0.5;
  const span = 0.5 / count;

  // Play only when this card is the centered/active one.
  useEffect(() => {
    return progress.on("change", (p) => {
      const v = videoRef.current;
      if (!v) return;
      const isActive = sectionInView && Math.abs(p - center) < span * 1.5;
      if (isActive) {
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [progress, center, span, sectionInView]);
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

  const img = project.image || ogImage(project.github);

  return (
    <motion.article
      style={{ scale, opacity }}
      className="group relative shrink-0 w-[82vw] sm:w-[440px] md:w-[480px] h-[300px] overflow-hidden rounded-xl border border-mercedes-silver-dark/15 bg-mercedes-black"
    >
      {project.live && (
        <a
          href={project.live}
          target="_blank"
          rel="noreferrer"
          aria-label={`Visit ${project.name}`}
          className="absolute inset-0 z-[1]"
        />
      )}
      {project.video ? (
        <video
          ref={videoRef}
          src={project.video}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
        />
      ) : img ? (
        <img
          src={img}
          alt={project.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-petronas/25 via-mercedes-black to-mercedes-jet" />
      )}

      {/* readability scrim — heavier at bottom so text is always legible */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />

      <span className="absolute top-2 right-4 font-numeric text-6xl leading-none text-white/20">
        0{index + 1}
      </span>

      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="font-display font-black text-2xl text-white leading-tight drop-shadow-sm">
          {project.name}
        </h3>
        <p className="mt-1.5 max-w-[92%] text-xs leading-relaxed text-white/60 line-clamp-2">
          {project.blurb}
        </p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-x-2 font-mono text-[9px] tracking-[0.15em] uppercase text-white/45">
            {project.tech.slice(0, 4).map((t, i) => (
              <span key={t}>
                {t}
                {i < Math.min(project.tech.length, 4) - 1 && (
                  <span className="text-white/25 ml-2">·</span>
                )}
              </span>
            ))}
          </div>
          <div className="flex gap-2 shrink-0 relative z-[2]">
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
