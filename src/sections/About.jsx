import { motion } from "framer-motion";
import { profile, stats } from "../lib/data";
import SectionHeader from "../components/SectionHeader";

const EASE = [0.22, 1, 0.36, 1];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const up = {
  hidden: { opacity: 0, y: 34 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};
const left = {
  hidden: { opacity: 0, x: -44 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
};

/**
 * About — centered editorial column. Staggered, directional scroll reveals.
 */
export default function About() {
  return (
    <section
      id="about"
      className="relative z-20 -mt-[100vh] min-h-screen bg-mercedes-jet flex items-start justify-center px-6 md:px-12 pt-24 pb-32"
    >
      <div className="w-full max-w-3xl mx-auto">
        <SectionHeader number="01" eyebrow="Driver Profile" title="About Me" />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-90px" }}
        >
          <motion.div variants={left} className="flex items-center gap-4 mb-8">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.06, rotate: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
            >
              <div className="absolute -inset-1 rounded-full bg-petronas/20 blur-md" />
              <img
                src={profile.photoUrl}
                alt={profile.name}
                loading="lazy"
                className="relative h-16 w-16 rounded-full border border-petronas/50 object-cover"
              />
            </motion.div>
            <div>
              <div className="font-display text-sm text-mercedes-silver">
                {profile.fullName}
              </div>
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-petronas mt-1">
                ● Open to Race · {profile.location}
              </div>
            </div>
          </motion.div>

          <div className="space-y-4 text-base md:text-lg leading-relaxed text-mercedes-silver/90">
            {(Array.isArray(profile.bio) ? profile.bio : [profile.bio]).map(
              (para, i) => (
                <motion.p key={i} variants={up}>
                  {para}
                </motion.p>
              )
            )}
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-mercedes-silver-dark/15 pt-6">
            {stats.map((s) => (
              <motion.div
                key={s.label}
                variants={up}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="font-numeric text-3xl md:text-4xl text-petronas leading-none">
                  {s.value}
                </div>
                <div className="mt-2 font-mono text-[9px] tracking-[0.3em] uppercase text-mercedes-silver-dark">
                  {s.suffix}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
