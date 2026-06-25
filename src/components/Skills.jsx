import React from 'react';
import { motion } from 'framer-motion';

export default function Skills() {
  const techStack = [
    "HTML5", "CSS3", "JavaScript", "React", "Python", "Java", "C", "C++",
    "SQL", "Git", "GitHub", "VS Code", "Netlify", "AI", "Machine Learning",
    "MERN Stack", "Cybersecurity", "UI/UX"
  ];

  const categories = [
    {
      title: "Frontend Development",
      skills: ["HTML5", "CSS3", "JavaScript", "React", "Responsive Design", "UI/UX"]
    },
    {
      title: "Programming Languages",
      skills: ["Python", "Java", "C", "C++"]
    },
    {
      title: "Tools & Databases",
      skills: ["Git", "GitHub", "VS Code", "Netlify", "SQL", "DBMS"]
    },
    {
      title: "Currently Exploring",
      skills: ["Artificial Intelligence", "Machine Learning", "MERN Stack", "Cybersecurity"]
    }
  ];

  return (
    <section id="skills" className="relative py-16 sm:py-20 md:py-24 overflow-hidden border-b border-white/10">
      {/* Background Gradients */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" style={{ backgroundImage: "linear-gradient(to bottom, rgba(212,163,115,0.05), transparent 30%, transparent 70%, rgba(250,237,205,0.05))" }}>
        <div className="absolute left-[-8%] top-[15%]" style={{ animationDelay: '0.3s', animationFillMode: 'both', '--shape-rotate': '-10deg', '--shape-rotate-start': '-25deg' }}>
          <div style={{ width: '560px', height: '140px' }} className="relative motion-safe:animate-shape-enter motion-safe:animate-shape-float">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r to-transparent from-[#d4a373]/[0.10] backdrop-blur-[2px] border-2 border-white/[0.15] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]"></div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 mb-16">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm text-accent mb-3">Skills & Expertise</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            A comprehensive stack across <span className="text-gradient">modern web & AI</span>
          </h2>
          <p className="mt-4 text-white/60 leading-relaxed">
            I continuously expand my skill set, mastering foundational programming languages while diving deep into cutting-edge domains like Artificial Intelligence and Cybersecurity.
          </p>
        </div>
      </div>

      {/* Infinite Marquee */}
      <div className="relative w-full overflow-hidden flex flex-col gap-4 mb-16 select-none group/marquee" style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
        <div 
          className="flex w-max gap-4 animate-marquee group-hover/marquee:[animation-play-state:paused]"
        >
          {[...techStack, ...techStack].map((tech, idx) => (
            <div key={idx} className="flex items-center gap-2 rounded-full border border-white/10 bg-surface px-5 py-2.5 text-sm text-white/80 whitespace-nowrap shadow-sm shadow-accent/5 transition-all duration-300 hover:scale-105 hover:border-accent/40 hover:bg-surface-2">
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-accent to-accent-2"></span>
              {tech}
            </div>
          ))}
        </div>
        
        <div 
          className="flex w-max gap-4 animate-marquee-reverse group-hover/marquee:[animation-play-state:paused]"
        >
          {[...techStack].reverse().concat([...techStack].reverse()).map((tech, idx) => (
            <div key={idx} className="flex items-center gap-2 rounded-full border border-white/10 bg-surface px-5 py-2.5 text-sm text-white/80 whitespace-nowrap shadow-sm shadow-accent/5 transition-all duration-300 hover:scale-105 hover:border-accent/40 hover:bg-surface-2">
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-accent to-accent-2"></span>
              {tech}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, idx) => (
            <div key={idx} className="group/category flex flex-col gap-4 rounded-2xl border border-white/10 bg-surface/50 p-6 transition-all duration-300 hover:border-accent/30 hover:bg-surface hover:-translate-y-1.5 hover:shadow-[0_15px_30px_-15px_rgba(212,163,115,0.15)]">
              <h3 className="font-medium text-white transition-colors duration-300 group-hover/category:text-accent-2">{category.title}</h3>
              <ul className="flex flex-col gap-2">
                {category.skills.map((skill, sIdx) => (
                  <li key={sIdx} className="text-sm text-white/60 flex items-center gap-2 transition-all duration-300 group-hover/category:text-white/85 group-hover/category:translate-x-1">
                    <span className="h-[1px] w-2 bg-accent/50 transition-all duration-300 group-hover/category:w-3 group-hover/category:bg-accent"></span>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
