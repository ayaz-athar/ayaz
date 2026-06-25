import React from 'react';
import { ExternalLink, Code, Folder } from 'lucide-react';

export default function Projects() {
  const projects = [
    {
      title: "Credit Card Fraud Detection",
      description: "Machine Learning model built to accurately identify fraudulent credit card transactions using advanced classification algorithms.",
      tags: ["Python", "Scikit-Learn", "Machine Learning"],
      github: "https://github.com/ayaz-athar",
    },
    {
      title: "Personal Portfolio Website",
      description: "A premium, luxury-themed portfolio showcasing my skills, projects, and professional brand using modern web technologies.",
      tags: ["React", "TailwindCSS", "Framer Motion"],
      github: "https://github.com/ayaz-athar",
      demo: "https://ayazathar.netlify.app/"
    },
    {
      title: "Flappy Boom Game",
      description: "An interactive, browser-based game inspired by Flappy Bird, featuring custom mechanics and smooth animations.",
      tags: ["HTML5", "CSS3", "JavaScript"],
      github: "https://github.com/ayaz-athar",
    },
    {
      title: "Frontend UI Experiments",
      description: "A collection of modern user interfaces, complex layouts, and micro-animations exploring the boundaries of frontend design.",
      tags: ["UI/UX", "CSS3", "React"],
      github: "https://github.com/ayaz-athar",
    },
    {
      title: "Python Learning Repository",
      description: "Comprehensive repository of Python scripts, data structures, and algorithms to build a strong foundation in backend logic.",
      tags: ["Python", "Data Structures", "Algorithms"],
      github: "https://github.com/ayaz-athar",
    },
    {
      title: "AI/ML Learning Projects",
      description: "Various smaller machine learning models and artificial intelligence scripts exploring data science and predictive analytics.",
      tags: ["Python", "Jupyter", "Data Science"],
      github: "https://github.com/ayaz-athar",
    }
  ];

  return (
    <section id="projects" className="relative py-16 sm:py-20 md:py-24 overflow-hidden border-b border-white/10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm text-accent mb-3">Selected Work</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Building reliable <span className="text-gradient">digital experiences</span>
          </h2>
          <p className="mt-4 text-white/60 leading-relaxed">
            A selection of my recent projects ranging from Machine Learning models to modern, interactive web applications.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, idx) => (
            <div key={idx} className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-surface p-6 transition-all duration-300 hover:border-accent/30 hover:scale-[1.02] hover:-translate-y-1.5 hover:shadow-[0_12px_40px_-12px_rgba(212,163,115,0.25)]">
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-accent group-hover:scale-110 group-hover:text-accent-2 group-hover:bg-accent/10 transition-all duration-300">
                    <Folder size={20} />
                  </div>
                  <div className="flex gap-3">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noreferrer" className="text-white/40 hover:text-accent hover:scale-120 transition-all duration-300" aria-label="View Source">
                        <Code size={20} />
                      </a>
                    )}
                    {project.demo && (
                      <a href={project.demo} target="_blank" rel="noreferrer" className="text-white/40 hover:text-accent hover:scale-120 transition-all duration-300" aria-label="View Live Demo">
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                </div>
                
                <h3 className="mb-2 text-xl font-semibold group-hover:text-accent transition-all duration-300">{project.title}</h3>
                <p className="mb-6 text-sm text-white/60 leading-relaxed">
                  {project.description}
                </p>
              </div>
              
              <div className="mt-auto flex flex-wrap gap-2">
                {project.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="rounded-md border border-white/5 bg-white/5 px-2 py-1 text-[11px] text-white/50 transition-all duration-300 hover:scale-105 hover:border-accent/30 hover:text-accent-2 hover:bg-white/10">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
