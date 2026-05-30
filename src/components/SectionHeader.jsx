import { motion } from "framer-motion";

export default function SectionHeader({ number, eyebrow, title, static: isStatic = false }) {
  const words = title.trim().split(" ");
  const last = words.pop();
  const lead = words.join(" ");

  const inner = (
    <>
      <span className="font-numeric text-6xl md:text-8xl leading-none text-petronas/15">
        {number}
      </span>
      <div className="pb-2">
        <div className="font-mono text-xs tracking-[0.4em] uppercase text-petronas mb-2">
          ◆ {eyebrow}
        </div>
        <h2 className="font-display font-black text-4xl md:text-5xl text-mercedes-silver leading-[1.02] tracking-[-0.02em]">
          {lead && <span>{lead} </span>}
          <span className="font-serif italic font-medium text-petronas">{last}</span>
        </h2>
      </div>
    </>
  );

  if (isStatic) {
    return <div className="mb-12 flex items-end gap-6">{inner}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mb-12 flex items-end gap-6"
    >
      {inner}
    </motion.div>
  );
}
