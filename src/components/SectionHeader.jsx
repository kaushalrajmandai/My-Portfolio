import { motion } from "framer-motion";

/**
 * Trackside sector-board styled section header used by every section.
 *   number — sector number (01, 02, …)
 *   eyebrow — small uppercase label
 *   title — large display title (final word gets the editorial serif accent)
 */
export default function SectionHeader({ number, eyebrow, title }) {
  // Lead words in heavy Archivo, final word in Fraunces italic teal — the
  // serif/sans contrast that reads premium.
  const words = title.trim().split(" ");
  const last = words.pop();
  const lead = words.join(" ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-12 flex items-end gap-6"
    >
      <span className="font-numeric text-6xl md:text-8xl leading-none text-petronas/15">
        {number}
      </span>
      <div className="pb-2">
        <div className="font-mono text-xs tracking-[0.4em] uppercase text-petronas mb-2">
          ◆ {eyebrow}
        </div>
        <h2 className="font-display font-black text-4xl md:text-5xl text-mercedes-silver leading-[1.02] tracking-[-0.02em]">
          {lead && <span>{lead} </span>}
          <span className="font-serif italic font-medium text-petronas">
            {last}
          </span>
        </h2>
      </div>
    </motion.div>
  );
}
