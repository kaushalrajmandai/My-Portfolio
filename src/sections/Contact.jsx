import { motion } from "framer-motion";
import { profile, carConfig } from "../lib/data";
import SectionHeader from "../components/SectionHeader";

const EASE = [0.22, 1, 0.36, 1];
const rowVariant = {
  hidden: { opacity: 0, x: -24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
};

/**
 * Contact — content anchored RIGHT (max-w-[520px]). Car gets the left half.
 * Stripped the heavy card wrapper; lets the contact links breathe.
 */
export default function Contact() {
  return (
    <section
      id="contact"
      className="relative min-h-screen flex items-center justify-center px-6 md:px-12 py-32"
    >
      <div className="w-full max-w-2xl mx-auto">
        <SectionHeader number="05" eyebrow="The Paddock" title="Get In Touch" />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="font-mono text-[11px] tracking-[0.3em] uppercase text-petronas mb-3"
        >
          ◆ TEAM RADIO — INCOMING
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="font-serif text-3xl md:text-4xl text-mercedes-silver leading-[1.18] mb-8"
        >
          Got a project, an internship, or just want to talk{" "}
          <span className="italic text-petronas">Mercedes</span> strategy?
          <br />
          <span className="italic text-mercedes-silver/70">
            The radio's open.
          </span>
        </motion.p>

        <motion.div
          className="space-y-2 mb-8"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        >
          <ContactRow
            label="Email"
            value={profile.email}
            href={`mailto:${profile.email}`}
          />
          <ContactRow
            label="GitHub"
            value={hostOf(profile.socials.github)}
            href={profile.socials.github}
          />
          <ContactRow
            label="LinkedIn"
            value={hostOf(profile.socials.linkedin)}
            href={profile.socials.linkedin}
          />
          <ContactRow label="Location" value={profile.location} href={null} />
        </motion.div>

        <motion.a
          href={`mailto:${profile.email}`}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-3 rounded-sm border border-petronas bg-petronas px-7 py-3.5 font-mono text-xs uppercase tracking-[0.3em] text-mercedes-jet hover:bg-petronas-soft transition-colors"
        >
          <span className="h-2 w-2 rounded-full bg-mercedes-jet animate-pulse" />
          Press To Talk
        </motion.a>

        {/* Driver dedication — Antonelli homage */}
        <div className="mt-12 pt-6 border-t border-mercedes-silver-dark/15 flex flex-col gap-2">
          <div className="font-mono text-[10px] tracking-[0.35em] uppercase text-mercedes-silver-dark">
            ◆ Driver dedication
          </div>
          <div className="font-display text-sm text-mercedes-silver">
            Inspired by{" "}
            <span className="text-petronas font-bold">
              ANDREA KIMI ANTONELLI
            </span>{" "}
            ·{" "}
            <span className="font-numeric text-petronas">#12</span>{" "}
            <span className="text-mercedes-silver-dark">
              · Mercedes-AMG Petronas
            </span>
          </div>
        </div>

        <footer className="mt-10 space-y-2 font-mono text-[10px] tracking-[0.3em] uppercase text-mercedes-silver-dark/60">
          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <span>
              © {new Date().getFullYear()} {profile.name} · #{profile.number}
            </span>
            <span>Built with React · Three.js · GSAP</span>
          </div>
          <div className="font-mono text-[9px] tracking-[0.2em] normal-case text-mercedes-silver-dark/40">
            3D model{" "}
            <a
              href={carConfig.attribution.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-dotted hover:text-petronas transition-colors"
            >
              "{carConfig.attribution.title}"
            </a>{" "}
            by{" "}
            <a
              href={carConfig.attribution.authorUrl}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-dotted hover:text-petronas transition-colors"
            >
              {carConfig.attribution.author}
            </a>{" "}
            ·{" "}
            <a
              href={carConfig.attribution.licenseUrl}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-dotted hover:text-petronas transition-colors"
            >
              {carConfig.attribution.license}
            </a>
          </div>
        </footer>
      </div>
    </section>
  );
}

function ContactRow({ label, value, href }) {
  const inner = (
    <div className="group flex items-baseline justify-between gap-4 py-2 border-b border-mercedes-silver-dark/15">
      <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-mercedes-silver-dark">
        {label}
      </span>
      <span className="text-mercedes-silver group-hover:text-petronas transition-colors text-right break-all">
        {value}
      </span>
    </div>
  );
  const body = href ? (
    <a href={href} target="_blank" rel="noreferrer" className="block">
      {inner}
    </a>
  ) : (
    inner
  );
  return <motion.div variants={rowVariant}>{body}</motion.div>;
}

function hostOf(url) {
  try {
    return new URL(url).pathname.replace(/^\/+/, "") || url;
  } catch {
    return url;
  }
}
