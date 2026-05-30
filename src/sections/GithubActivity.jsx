import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { profile } from "../lib/data";
import SectionHeader from "../components/SectionHeader";

// Pull the GitHub handle straight from the profile socials so it stays in sync.
const USERNAME = profile.socials.github.replace(/\/+$/, "").split("/").pop();

// Electric-teal ramp — deep olive at level 0 → glowing petronas at level 4.
// Echoes the reference "data log" glowing-tile grid but in the editorial-olive
// livery (teal accent) instead of red, to stay on-brand.
const LEVELS = [
  { fill: "rgba(231,232,221,0.05)", glow: "none" },
  { fill: "rgba(20,168,155,0.40)", glow: "0 0 4px rgba(38,214,197,0.20)" },
  { fill: "rgba(20,168,155,0.70)", glow: "0 0 6px rgba(38,214,197,0.35)" },
  { fill: "rgba(38,214,197,0.85)", glow: "0 0 9px rgba(38,214,197,0.55)" },
  { fill: "rgba(74,240,223,1)", glow: "0 0 13px rgba(74,240,223,0.80)" },
];

// Pad the front of the day list so the first column lands on the right weekday
// (GitHub columns run Sun→Sat), then chunk into 7-day week columns.
function buildWeeks(days) {
  const weeks = [];
  let week = [];
  const firstDay = days.length ? new Date(days[0].date).getDay() : 0;
  for (let i = 0; i < firstDay; i++) week.push(null);
  for (const day of days) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
}

/**
 * GitHub Activity — a "DATA LOG" contribution heatmap. Pulls the last year of
 * contributions from a public proxy of the GitHub GraphQL API, then renders a
 * glowing teal tile grid that staggers in on scroll.
 */
export default function GithubActivity() {
  const [days, setDays] = useState(null);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    let alive = true;
    fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("bad status"))))
      .then((data) => {
        if (!alive) return;
        const contributions = data.contributions || [];
        setDays(contributions);
        setTotal(contributions.reduce((s, d) => s + d.count, 0));
      })
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, []);

  // Keep the most recent weeks in view on first paint (grid scrolls on mobile).
  useEffect(() => {
    if (days && scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [days]);

  const weeks = days ? buildWeeks(days) : [];

  return (
    <section
      id="activity"
      className="relative bg-mercedes-jet px-6 md:px-12 py-32"
    >
      <div className="w-full max-w-5xl mx-auto">
        <SectionHeader number="06" eyebrow="Data Log" title="GitHub Activity" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-xl border border-mercedes-silver-dark/15 bg-mercedes-black/60 p-6 md:p-8"
        >
          <div className="mb-7 flex items-baseline justify-between gap-4">
            <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-mercedes-silver-dark">
              ◆ Telemetry · last 12 months
            </span>
            {days && (
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-petronas">
                <span className="font-numeric text-petronas">
                  {total.toLocaleString()}
                </span>{" "}
                contributions
              </span>
            )}
          </div>

          {error && (
            <div className="py-16 text-center text-sm text-mercedes-silver-dark">
              Telemetry offline — view the live feed on{" "}
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noreferrer"
                className="text-petronas hover:underline"
              >
                github.com/{USERNAME}
              </a>
            </div>
          )}

          {!days && !error && (
            <div className="py-16 text-center text-sm text-mercedes-silver-dark animate-pulse">
              Receiving telemetry…
            </div>
          )}

          {days && (
            <div ref={scrollRef} className="overflow-x-auto pb-1 -mx-1 px-1">
              <div className="flex gap-[3px] min-w-max">
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-[3px]">
                    {week.map((day, di) =>
                      day ? (
                        <motion.div
                          key={di}
                          title={`${day.count} contribution${
                            day.count === 1 ? "" : "s"
                          } · ${day.date}`}
                          className="h-3.5 w-3.5 rounded-[2px]"
                          style={{
                            backgroundColor: (LEVELS[day.level] || LEVELS[0])
                              .fill,
                            boxShadow: (LEVELS[day.level] || LEVELS[0]).glow,
                          }}
                          initial={{ opacity: 0, scale: 0.4 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.3,
                            delay: Math.min(wi * 0.012 + di * 0.004, 1.2),
                          }}
                        />
                      ) : (
                        <div key={di} className="h-3.5 w-3.5 rounded-[2px]" />
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {days && (
            <div className="mt-6 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.25em] text-mercedes-silver-dark">
              <span>Less</span>
              {LEVELS.map((l, i) => (
                <span
                  key={i}
                  className="h-3 w-3 rounded-[2px]"
                  style={{ backgroundColor: l.fill, boxShadow: l.glow }}
                />
              ))}
              <span>More</span>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
