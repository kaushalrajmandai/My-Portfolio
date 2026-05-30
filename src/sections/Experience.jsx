import { motion } from "framer-motion";
import { education, experience } from "../lib/data";
import SectionHeader from "../components/SectionHeader";

const EASE = [0.22, 1, 0.36, 1];

/**
 * Experience — centered 2-col timelines. Items slide in from the left with a
 * stagger and the marker dots pop in.
 */
export default function Experience() {
  return (
    <section
      id="experience"
      className="relative min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-20 py-32"
    >
      <div className="w-full max-w-3xl mx-auto">
        <SectionHeader
          number="03"
          eyebrow="Race History"
          title="Experience & Education"
        />

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
          <Timeline title="Race Wins" items={experience} />
          <Timeline title="Training Ground" items={education} />
        </div>
      </div>
    </section>
  );
}

function Timeline({ title, items }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, margin: "-80px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
    >
      <h3 className="font-mono text-[11px] tracking-[0.3em] uppercase text-petronas mb-5">
        ◆ {title}
      </h3>
      <ol className="relative border-l border-mercedes-silver-dark/25 pl-6 space-y-8">
        {items.length === 0 && (
          <li className="font-mono text-xs text-mercedes-silver-dark italic">
            — Rookie season —
          </li>
        )}
        {items.map((item, i) => (
          <motion.li
            key={i}
            variants={{
              hidden: { opacity: 0, x: -28 },
              show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
            }}
            className="relative group"
          >
            <motion.span
              variants={{
                hidden: { scale: 0 },
                show: { scale: 1, transition: { type: "spring", stiffness: 380, damping: 16 } },
              }}
              className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-petronas ring-4 ring-mercedes-jet shadow-[0_0_10px_rgba(38,214,197,0.55)] group-hover:shadow-[0_0_16px_rgba(38,214,197,0.9)] transition-shadow"
            />
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-petronas mb-1.5">
              {item.period}
            </div>
            <h4 className="font-display font-bold text-base text-mercedes-silver">
              {item.title}
            </h4>
            <div className="text-sm text-mercedes-silver-dark mb-2">
              {item.org}
            </div>
            <p className="text-sm text-mercedes-silver/85 leading-relaxed">
              {item.detail}
            </p>
          </motion.li>
        ))}
      </ol>
    </motion.div>
  );
}
