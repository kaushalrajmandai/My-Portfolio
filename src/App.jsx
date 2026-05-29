import { useState } from "react";
import RaceStartLoader from "./components/RaceStartLoader";
import Navbar from "./components/Navbar";
import Home from "./sections/Home";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <RaceStartLoader onComplete={() => setLoading(false)} />}

      <div
        className={`transition-opacity duration-1000 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
        aria-hidden={loading}
      >
        {/* Topographic relief texture over the dark olive sections (whisper
            faint). The light hero sits on top of it as an opaque cream block. */}
        <TopoBackdrop />

        {/* Content. The 3D car now lives ONLY inside <Home /> as an
            interactive studio element — there is no fixed full-page scene. */}
        <div className="relative z-10">
          <Navbar />
          <main>
            <Home revealed={!loading} />
            <About />
            <Skills />
            <Experience />
            <Projects />
            <Contact />
          </main>
        </div>
      </div>
    </>
  );
}

/* Faint topographic contour lines over the dark sections. To dial it up/down,
   change the wrapper opacity; to remove entirely, delete this component. */
function TopoBackdrop() {
  const lines = [
    "M-60 90 C 280 30 560 150 840 80 C 1120 20 1360 140 1520 70",
    "M-60 200 C 300 130 580 270 880 190 C 1140 120 1380 250 1520 180",
    "M-60 320 C 260 250 540 390 820 310 C 1120 240 1360 380 1520 300",
    "M-60 430 C 300 360 600 500 900 420 C 1160 350 1380 480 1520 410",
    "M-60 472 C 300 402 600 542 900 462 C 1160 392 1380 522 1520 452",
    "M-60 620 C 280 560 560 700 860 620 C 1140 550 1380 690 1520 610",
    "M-60 740 C 300 670 600 810 900 730 C 1160 660 1380 800 1520 720",
    "M-60 860 C 280 800 560 940 860 860 C 1140 790 1380 930 1520 850",
  ];
  return (
    <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.055] text-mercedes-silver-dark">
      <svg
        className="h-full w-full"
        viewBox="0 0 1440 950"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        aria-hidden="true"
      >
        {lines.map((d, i) => (
          <path
            key={i}
            d={d}
            stroke="currentColor"
            strokeWidth="1.4"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
    </div>
  );
}
