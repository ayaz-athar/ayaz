/**
 * Midnight Index design reminder:
 * A premium editorial developer portfolio: #080808 canvas, precise Manrope typography,
 * hairline structure, asymmetric project artifacts, Circuit Moss used only as a technical accent.
 */
import {
  ArrowDown,
  ArrowUpRight,
  Code2,
  ExternalLink,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

type Project = {
  index: string;
  title: string;
  description: string;
  stack: string[];
  image?: string;
  url?: string;
  visualType: "snake" | "flappy" | "slither" | "fraud";
  className: string;
};

const navigation = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

const projects: Project[] = [
  {
    index: "01",
    title: "3D Snake",
    description: "A spatial game experiment built around movement, timing, and three-dimensional interaction.",
    stack: ["JavaScript", "3D", "Game logic"],
    image: "/manus-storage/ayaz-project-snake_e43cf48f.jpg",
    url: "https://github.com/ayaz-athar/3D_Snake",
    visualType: "snake",
    className: "project-wide",
  },
  {
    index: "02",
    title: "Flappy Bird Game",
    description: "A focused browser-game build exploring input, collision, and responsive game flow.",
    stack: ["JavaScript", "HTML", "CSS"],
    image: "/manus-storage/ayaz-project-flappy_2048d218.jpg",
    url: "https://github.com/ayaz-athar/flappy-bird-game",
    visualType: "flappy",
    className: "project-tall",
  },
  {
    index: "03",
    title: "Slither.io Clone",
    description: "A multiplayer-inspired interaction study centred on continuous motion and play systems.",
    stack: ["JavaScript", "Canvas", "Game logic"],
    image: "/manus-storage/ayaz-project-slither_76bc39b5.jpg",
    url: "https://github.com/ayaz-athar/slither.io",
    visualType: "slither",
    className: "project-compact",
  },
  {
    index: "04",
    title: "Credit Card Fraud Detection",
    description: "A Python and AI/ML project focused on identifying meaningful patterns in transaction data.",
    stack: ["Python", "Machine Learning", "AI/ML"],
    visualType: "fraud",
    className: "project-research",
  },
];

const skillGroups = [
  { label: "Languages", values: "Python · JavaScript · HTML · CSS" },
  { label: "Frontend", values: "React · Next.js" },
  { label: "Backend", values: "Node.js · Express.js" },
  { label: "Database", values: "MongoDB · SQL" },
  { label: "AI / ML", values: "Python · Machine Learning · AI" },
  { label: "Tools", values: "Git · GitHub · VS Code · Vercel" },
];

const journey = [
  "Learning Computer Science",
  "Web Development",
  "Full-Stack Development",
  "AI / ML",
  "Building Projects",
  "Preparing for a career in AI Development",
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com/ayaz-athar", icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/ayazathar", icon: Linkedin },
  { label: "Instagram", href: "https://www.instagram.com/_ayazathar", icon: Instagram },
  { label: "X", href: "https://x.com/ayazathar", icon: ExternalLink },
];

function SectionMarker({ number, label }: { number: string; label: string }) {
  return (
    <div className="section-marker" aria-hidden="true">
      <span>{number}</span>
      <i />
      <small>{label}</small>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const content = (
    <>
      <div className="project-visual">
        {project.image ? <img src={project.image} alt="" /> : <div className="research-visual" aria-hidden="true"><Code2 size={42} strokeWidth={1.05} /></div>}
        <div className={`project-artifact artifact-${project.visualType}`} aria-hidden="true">
          {Array.from({ length: 6 }).map((_, index) => <span key={index} />)}
        </div>
        <span className="project-index">{project.index}</span>
        {project.url ? <span className="project-view">View project <ArrowUpRight size={16} /></span> : <span className="project-view project-study">AI / ML study</span>}
      </div>
      <div className="project-copy">
        <div>
          <p className="project-kicker">Selected work</p>
          <h3>{project.title}</h3>
        </div>
        <p className="project-description">{project.description}</p>
        <ul className="tag-list" aria-label={`${project.title} technologies`}>
          {project.stack.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>
      </div>
    </>
  );

  return project.url ? (
    <a className={`project-item ${project.className}`} href={project.url} target="_blank" rel="noreferrer" aria-label={`View ${project.title} on GitHub`}>
      {content}
    </a>
  ) : (
    <article className={`project-item ${project.className}`}>
      {content}
    </article>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="portfolio-shell">
      <header className="site-header">
        <a href="#top" className="wordmark" onClick={closeMenu} aria-label="Ayaz Athar home">
          <span className="index-mark" aria-hidden="true"><i /><i /><b /></span>
          <span>AYAZ ATHAR</span>
        </a>
        <button className="menu-toggle" type="button" onClick={() => setMenuOpen((isOpen) => !isOpen)} aria-expanded={menuOpen} aria-controls="main-navigation" aria-label={menuOpen ? "Close navigation" : "Open navigation"}>
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
        <nav className={menuOpen ? "site-nav nav-open" : "site-nav"} id="main-navigation" aria-label="Main navigation">
          {navigation.map((item) => <a href={item.href} key={item.href} onClick={closeMenu}>{item.label}</a>)}
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-image" aria-hidden="true"><img src="/manus-storage/ayaz-hero-cinematic_0f173e58.jpg" alt="" /></div>
          <div className="hero-content reveal">
            <p className="micro-label">AYAZ ATHAR — DEVELOPER</p>
            <h1 id="hero-heading">Building digital experiences<br />with <em>code &amp; intelligence.</em></h1>
            <p className="hero-summary">Computer Science student focused on AI, full-stack development and modern web experiences.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#projects">View Projects <ArrowDown size={16} /></a>
              <a className="button button-quiet" href="https://github.com/ayaz-athar" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={16} /></a>
            </div>
          </div>
          <div className="availability" aria-label="Available for projects"><span /> Available for projects</div>
          <a className="scroll-cue" href="#about" aria-label="Scroll to About"><span>Scroll to explore</span><ArrowDown size={16} /></a>
        </section>

        <section className="about section-wrap" id="about" aria-labelledby="about-heading">
          <SectionMarker number="01" label="About" />
          <div className="about-lead reveal">
            <p className="micro-label">A focused introduction</p>
            <h2 id="about-heading">Systems-minded.<br /><em>Product curious.</em></h2>
          </div>
          <div className="about-copy reveal reveal-later">
            <p>I’m Ayaz Athar, a Computer Science &amp; Engineering student interested in AI, full-stack development and building useful digital products.</p>
            <div className="identity-lines">
              <span>B.Tech Computer Science &amp; Engineering</span>
              <span>AI Developer / Full-Stack Developer</span>
            </div>
          </div>
        </section>

        <section className="projects section-wrap" id="projects" aria-labelledby="projects-heading">
          <SectionMarker number="02" label="Selected work" />
          <div className="section-heading reveal">
            <p className="micro-label">Projects</p>
            <h2 id="projects-heading">A few things<br />I’ve <em>built.</em></h2>
            <p>Game experiments, interface systems, and machine-learning work—with every project treated as a chance to learn in public.</p>
          </div>
          <div className="project-grid">
            {projects.map((project) => <ProjectCard key={project.title} project={project} />)}
          </div>
        </section>

        <section className="skills section-wrap" id="skills" aria-labelledby="skills-heading">
          <SectionMarker number="03" label="Capabilities" />
          <div className="skills-top reveal">
            <div>
              <p className="micro-label">Skills index</p>
              <h2 id="skills-heading">Tools for building<br /><em>what’s next.</em></h2>
            </div>
            <p>I’m developing across the stack while growing a deeper practice in AI and machine learning.</p>
          </div>
          <dl className="skills-list">
            {skillGroups.map((group, index) => (
              <div className="skill-row" key={group.label}>
                <dt><span>0{index + 1}</span>{group.label}</dt>
                <dd>{group.values}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="journey section-wrap" aria-labelledby="journey-heading">
          <SectionMarker number="04" label="Journey" />
          <div className="journey-heading reveal">
            <p className="micro-label">In progress</p>
            <h2 id="journey-heading">The work is<br /><em>still moving.</em></h2>
          </div>
          <ol className="journey-line">
            {journey.map((item, index) => (
              <li key={item} className={index === journey.length - 1 ? "journey-current" : ""}>
                <span>0{index + 1}</span>
                <p>{item}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="github-callout section-wrap" aria-labelledby="github-heading">
          <SectionMarker number="05" label="Open source" />
          <div className="github-copy reveal">
            <Github size={29} strokeWidth={1.3} aria-hidden="true" />
            <p className="micro-label">GitHub</p>
            <h2 id="github-heading">More experiments,<br />projects and code<br /><em>on GitHub.</em></h2>
            <a className="button button-primary" href="https://github.com/ayaz-athar" target="_blank" rel="noreferrer">Explore GitHub <ArrowUpRight size={16} /></a>
          </div>
        </section>

        <section className="contact section-wrap" id="contact" aria-labelledby="contact-heading">
          <SectionMarker number="06" label="Contact" />
          <div className="contact-lead reveal">
            <p className="micro-label">Collaboration channel</p>
            <h2 id="contact-heading">Have an idea?<br /><em>Let’s build it.</em></h2>
            <p className="contact-preamble">Open to thoughtful technical collaboration.</p>
          </div>
          <div className="contact-actions reveal reveal-later">
            <a className="email-link" href="mailto:ayaz.athar.44@gmail.com"><Mail size={18} /> ayaz.athar.44@gmail.com <ArrowUpRight size={17} /></a>
            <div className="social-list" aria-label="Social links">
              {socialLinks.map(({ label, href, icon: Icon }) => <a key={label} href={href} target="_blank" rel="noreferrer"><Icon size={15} /> {label}</a>)}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div><strong>AYAZ ATHAR</strong><span>AI / FULL-STACK DEVELOPER</span></div>
        <p>© {new Date().getFullYear()} Ayaz Athar</p>
        <a href="#top">Back to top <ArrowUpRight size={14} /></a>
      </footer>
    </div>
  );
}
