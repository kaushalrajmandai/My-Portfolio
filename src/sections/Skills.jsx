import { motion } from "framer-motion";
import { skills } from "../lib/data";
import SectionHeader from "../components/SectionHeader";

const EASE = [0.22, 1, 0.36, 1];

/**
 * Skills — centered 2-col grid of grouped skill bars on the dark-olive base.
 * Groups stagger in; each bar fills from 0 with a teal glow when scrolled to.
 */
export default function Skills() {
  const groups = skills.reduce((acc, s) => {
    (acc[s.group] = acc[s.group] || []).push(s);
    return acc;
  }, {});

  return (
    <section
      id="skills"
      className="relative min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-20 py-32"
    >
      <div className="w-full max-w-3xl mx-auto">
        <SectionHeader number="02" eyebrow="Live Telemetry" title="Skills & Stack" />

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
          {Object.entries(groups).map(([group, items], gi) => (
            <motion.div
              key={group}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: EASE, delay: gi * 0.08 }}
            >
              <h3 className="font-mono text-[11px] tracking-[0.3em] uppercase text-petronas mb-4">
                ◆ {group}
              </h3>
              <ul className="space-y-3">
                {items.map((s, i) => (
                  <SkillBar key={s.name} skill={s} index={i} />
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillBar({ skill, index }) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: EASE, delay: index * 0.06 }}
      className="group"
    >
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="font-display text-sm text-mercedes-silver transition-colors group-hover:text-petronas">
          {skill.name}
        </span>
        <span className="font-mono text-[10px] tracking-[0.2em] text-mercedes-silver-dark tabular-nums">
          {skill.level}%
        </span>
      </div>
      <div className="relative h-[3px] bg-mercedes-silver-dark/15 rounded-sm overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-petronas shadow-[0_0_8px_rgba(38,214,197,0.6)]"
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.15 + index * 0.06 }}
        />
      </div>
    </motion.li>
  );
}
