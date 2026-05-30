// Central data file — all on-screen content lives here.

export const profile = {
  name: "Kaushal Rajmandai",
  fullName: "Kaushal Dinesh Rajmandai",
  initials: "KR",
  tagline: "Visual Web Developer · 3D & Interactive UI",
  number: "12",
  // Exact LinkedIn About — split by paragraphs (rendered as <p> blocks)
  bio: [
    "Hi, I'm Kaushal Rajmandai — a first-year B.Tech CSE student at ITM Skills University, Kharghar.",
    "I'm passionate about technology, software development, and building interactive digital experiences. I enjoy exploring how ideas can turn into real products through design, development, and problem-solving.",
    "Currently, I'm focused on strengthening my skills in React JS, DSA (C++), and frontend development while building projects that improve both my technical knowledge and practical experience.",
    "Outside academics, I stay dedicated to fitness and gym training, which helps me build discipline, consistency, and focus—qualities I carry into my studies and projects.",
    "🌱 Currently learning, building, and working toward becoming a skilled developer while connecting with peers, mentors, and professionals in tech and innovation.",
  ],
  location: "Navi Mumbai, India",
  email: "rajmandaikaushal16@gmail.com",
  resumeUrl: import.meta.env.BASE_URL + "resume.pdf",
  photoUrl: "https://avatars.githubusercontent.com/u/87120610?v=4",
  openToWork: true,
  socials: {
    github: "https://github.com/kaushalrajmandai",
    linkedin: "https://www.linkedin.com/in/kaushal-rajmandai-b7b091383/",
    repos: "https://github.com/kaushalrajmandai?tab=repositories",
  },
};

export const skills = [
  { name: "JavaScript", level: 88, group: "Languages" },
  { name: "TypeScript", level: 70, group: "Languages" },
  { name: "Python", level: 78, group: "Languages" },
  { name: "C++ · DSA", level: 72, group: "Languages" },

  { name: "React", level: 78, group: "Frontend" },
  { name: "Next.js", level: 68, group: "Frontend" },
  { name: "HTML & CSS", level: 92, group: "Frontend" },
  { name: "Tailwind CSS", level: 80, group: "Frontend" },
  { name: "Three.js / WebGL", level: 72, group: "Frontend" },

  { name: "Node.js / Fastify", level: 65, group: "Backend" },
  { name: "Python · FastAPI", level: 68, group: "Backend" },
  { name: "PostgreSQL", level: 55, group: "Backend" },

  { name: "Git & GitHub", level: 85, group: "Tools" },
  { name: "Figma & Design", level: 70, group: "Tools" },
];

export const education = [
  {
    title: "B.Tech in Computer Science",
    org: "ITM Skills University, Kharghar",
    period: "2025 — Present",
    detail:
      "First-year B.Tech CSE. CGPA: 8.52. Focus areas: React, DSA in C++, frontend engineering, and 3D web (Three.js / WebGL).",
  },
  {
    title: "HSC · Science (12th Standard)",
    org: "S S High School & Junior College, Seawoods",
    period: "Feb 2025",
    detail:
      "Maharashtra State Board (Mumbai Division). Stream: Science. Passed.",
  },
  {
    title: "SSC (10th Standard)",
    org: "Holy Rose English School, Titwala",
    period: "Mar 2023",
    detail:
      "Maharashtra State Board. 89.60% — 448 / 500. Science & Technology: 95 · Mathematics: 91 · Marathi: 91.",
  },
];

export const experience = [
  {
    title: "Web Developer · Freelance & Personal Projects",
    org: "Self-employed · India (Hybrid)",
    period: "Oct 2025 — Present",
    detail:
      "Designed and shipped responsive sites in HTML/CSS/JS. Built interactive WebGL experiences with Three.js. Concepted and prototyped sites for local businesses (gyms, tutoring). Owned the full loop — design → dev → deploy.",
  },
  {
    title: "Member · Research & Development Club",
    org: "ITM Skills University, School of Future Tech",
    period: "Sept 2024 — May 2025",
    detail:
      "Automated the club's certificate-distribution workflow with a Python + SMTP pipeline — replaced a tedious manual task with a one-click run that sends personalised certificates to 47 recipients.",
  },
  {
    title: "Attendee · Practical Workshop on Research Methodology & Data Science Applications",
    org: "ITM Skills University, School of Future Tech · R&D Club",
    period: "Feb 2026",
    detail:
      "Completed a hands-on workshop on research methodology and data science applications, earning a Certificate of Excellence.",
  },
  {
    title: "Participant · Summer Hacks 2026",
    org: "ITM Skills University",
    period: "Apr 2026",
    detail:
      "Pushed through a full hackathon weekend — ideation to working build under deadline.",
  },
];

export const projects = [
  {
    name: "AI-Orchestrator",
    blurb:
      "No-code platform where multiple AI models collaborate on a goal — task decomposition, sequential execution, human checkpoints, and a live pipeline dashboard.",
    tech: ["Next.js", "TypeScript", "Fastify", "FastAPI", "Postgres"],
    github: "https://github.com/kaushalrajmandai/Ai-Orchestrator",
    live: "",
    featured: true,
  },
  {
    name: "STRIVE FITNESS",
    blurb:
      "Experimental WebGL gym website with cursor-driven image-reveal effects. The project that got me obsessed with 3D web.",
    tech: ["Three.js", "WebGL", "JavaScript", "GLSL"],
    github: "https://github.com/kaushalrajmandai/strive-fitness",
    live: "https://kaushalrajmandai.github.io/strive-fitness/",
    featured: true,
  },
  {
    name: "Tutorbridge Portal",
    blurb:
      "Responsive one-on-one tutoring portal with tutor listings, profile pages, an interactive booking calendar, and pricing plans.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    github: "https://github.com/kaushalrajmandai/Tutorbridge-portal",
    live: "",
  },
  {
    name: "Bulk Certificate Email Sender",
    blurb:
      "Zero-dependency Python script that sends personalised PDF certificates via Gmail SMTP. Used by the R&D Club to deliver 47 certificates in one click.",
    tech: ["Python", "SMTP", "Gmail"],
    github: "https://github.com/kaushalrajmandai/bulk-certificate-email-sender",
    live: "",
  },
  {
    name: "Bill Splitter",
    blurb:
      "React mini-app that splits bills and calculates tip per person in real time.",
    tech: ["React", "JavaScript"],
    github: "https://github.com/kaushalrajmandai/bill-splitter",
    live: "",
  },
  {
    name: "F1 Portfolio (this site)",
    blurb:
      "Editorial-olive livery, race-start lights loader, and a fully interactive 3D W13 you can drag to spin. The site you're on right now.",
    tech: ["React", "Three.js", "GSAP", "Framer Motion", "Tailwind"],
    github: "",
    live: "",
  },
];

export const stats = [
  { label: "Public repos", value: "33+", suffix: "BUILDS" },
  { label: "Years coding", value: "4+", suffix: "YRS" },
  { label: "Followers on LinkedIn", value: "700+", suffix: "NETWORK" },
];

export const navSections = [
  { id: "home", label: "Grid" },
  { id: "about", label: "Driver" },
  { id: "skills", label: "Telemetry" },
  { id: "experience", label: "Race History" },
  { id: "projects", label: "Garage" },
  { id: "activity", label: "Data Log" },
  { id: "contact", label: "Paddock" },
];

// 3D car configuration — used by src/three/HeroCar.jsx (GLB loader).
// The loader auto-fits the model so its longest dimension equals `targetSize`,
// centres it on X/Z and sits it on the floor (Y=0). The car is now a single
// INTERACTIVE hero element (drag to orbit) — there is no per-section scroll
// choreography any more.
export const carConfig = {
  modelPath: import.meta.env.BASE_URL + "models/f1-car/scene.gltf",
  targetSize: 3.2, // longest dim in world units — raise/lower for car size
  // CC-BY attribution — must be displayed somewhere on the site.
  // Used by src/sections/Contact.jsx footer.
  attribution: {
    title: "F1 Mercedes W13 Concept",
    author: "Nick Broad",
    authorUrl: "https://sketchfab.com/nickbroad",
    sourceUrl:
      "https://sketchfab.com/3d-models/f1-mercedes-w13-concept-b9e85594aec847f78883343d67ee97fb",
    license: "CC-BY 4.0",
    licenseUrl: "http://creativecommons.org/licenses/by/4.0/",
  },
};
