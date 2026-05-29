import { useEffect, useState } from "react";
import { navSections, profile } from "../lib/data";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // At the very top the navbar floats over the LIGHT cream hero, so text must
  // be dark; once scrolled onto the dark-olive sections it flips to light.
  const onLight = !scrolled;
  const accent = onLight ? "text-petronas-deep" : "text-petronas";
  const linkBase = onLight
    ? "text-mercedes-jet/70 hover:text-petronas-deep"
    : "text-mercedes-silver hover:text-petronas";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-md bg-mercedes-black/70 border-b border-petronas/20"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#home" className="flex items-center gap-3 group">
          <span className={`font-numeric text-2xl ${accent}`}>
            {profile.initials}
          </span>
          <span
            className={`hidden sm:block h-6 w-px ${
              onLight ? "bg-mercedes-jet/25" : "bg-mercedes-silver-dark/40"
            }`}
          />
          <span
            className={`hidden sm:block font-mono text-xs tracking-[0.3em] uppercase transition-colors ${linkBase}`}
          >
            #{profile.number} · {profile.name}
          </span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {navSections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`px-3 py-2 font-mono text-xs tracking-[0.25em] uppercase transition-colors ${linkBase}`}
              >
                {s.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className={`ml-3 inline-flex items-center gap-2 rounded-sm border px-4 py-2 font-mono text-xs uppercase tracking-[0.25em] transition-all ${
                onLight
                  ? "border-mercedes-jet/30 text-mercedes-jet hover:bg-mercedes-jet hover:text-cream"
                  : "border-petronas/60 bg-petronas/10 text-petronas hover:bg-petronas hover:text-mercedes-black"
              }`}
            >
              <span>Pit Wall</span>
              <span aria-hidden>↓</span>
            </a>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          className={`md:hidden p-2 ${
            onLight ? "text-mercedes-jet" : "text-mercedes-silver"
          }`}
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          <div className="space-y-1.5">
            <span
              className={`block h-0.5 w-6 bg-current transition-transform ${
                open ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-current transition-opacity ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-current transition-transform ${
                open ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile menu — always dark panel */}
      {open && (
        <ul className="md:hidden border-t border-petronas/20 bg-mercedes-black/95 backdrop-blur-md">
          {navSections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={() => setOpen(false)}
                className="block px-6 py-3 font-mono text-xs tracking-[0.3em] uppercase text-mercedes-silver hover:bg-petronas/10 hover:text-petronas"
              >
                {s.label}
              </a>
            </li>
          ))}
          <li className="px-6 py-3">
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="block w-full text-center rounded-sm border border-petronas/60 bg-petronas/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.25em] text-petronas"
            >
              Resume / Pit Wall ↓
            </a>
          </li>
        </ul>
      )}
    </header>
  );
}
