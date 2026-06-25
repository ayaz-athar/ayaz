import React from 'react';
import { Shield, Code } from 'lucide-react';
import SplitTextReveal from './SplitTextReveal';

export default function About() {
  return (
    <section id="about" className="relative py-16 sm:py-20 md:py-24 overflow-hidden border-b border-white/10">
      {/* Background Shapes */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" style={{ backgroundImage: "radial-gradient(ellipse 60% 50% at 20% 30%, rgba(212,163,115,0.07), transparent 70%)" }}>
        <div className="absolute right-[-8%] top-[10%]" style={{ animationDelay: '0.4s', animationFillMode: 'both', '--shape-rotate': '10deg', '--shape-rotate-start': '-5deg' }}>
          <div style={{ width: '520px', height: '130px' }} className="relative motion-safe:animate-shape-enter motion-safe:animate-shape-float">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r to-transparent from-[#b5835a]/[0.11] backdrop-blur-[2px] border-2 border-white/[0.15] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]"></div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm text-accent mb-3">About</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Developer, learner, and <span className="text-gradient">problem solver</span>
          </h2>
          <p className="mt-4 text-white/60 leading-relaxed">
            I am a B.Tech Computer Science Engineering student and an aspiring Software Engineer with a strong passion for Frontend Development, Artificial Intelligence, Machine Learning, Cybersecurity, and modern web technologies.
          </p>
          <p className="mt-4 text-white/60 leading-relaxed">
            My primary goal is to become a world-class developer while continuously learning new technologies and building impactful projects. I focus on clean architecture, modern aesthetics, and performant solutions.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 md:items-stretch">
          
          {/* Card 1 */}
          <div className="group flex flex-col rounded-2xl border border-white/10 bg-surface p-6 transition-colors hover:border-white/20 md:col-start-1">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-accent">
                <Code size={20} />
              </span>
              <div>
                <h3 className="font-semibold leading-tight">Software Engineering</h3>
                <p className="text-xs text-white/40">Frontend & Architecture</p>
              </div>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-white/60">
              Building beautiful, responsive, and accessible modern web experiences using HTML5, CSS3, React, and optimized JavaScript.
            </p>
            <div className="mt-auto flex flex-wrap gap-1.5">
              <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/60">Clean Code</span>
              <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/60">UI/UX</span>
            </div>
          </div>

          {/* Central Portrait / Motto Card */}
          <div className="relative order-first mx-auto w-full max-w-[320px] md:order-none md:col-start-2">
            <div className="relative overflow-hidden grid place-items-center border border-white/10 rounded-[18px] isolate transition-colors duration-200 bg-surface motion-safe:shadow-[0_0_40px_-8px_rgba(212,163,115,0.2)] aspect-[4/5]">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg/80 z-0"></div>
              <div className="absolute inset-0 z-10 flex h-full flex-col items-center justify-between p-6 text-center">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-accent-2">Quote</p>
                  <h3 className="mt-2 text-2xl font-semibold text-gradient">Ayaz Athar</h3>
                </div>
                
                <SplitTextReveal text="Talk is cheap." revealText="Show me the code." />
                
                <p className="text-sm text-white/60 leading-relaxed">
                  Consistently improving and building real-world projects.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group flex flex-col rounded-2xl border border-white/10 bg-surface p-6 transition-all duration-300 hover:border-accent/40 hover:-translate-y-2 hover:shadow-[0_15px_30px_-15px_rgba(212,163,115,0.25)] md:col-start-3">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-accent group-hover:scale-110 group-hover:text-accent-2 transition-all duration-300">
                <Shield size={20} />
              </span>
              <div>
                <h3 className="font-semibold leading-tight">AI & Security</h3>
                <p className="text-xs text-white/40">Machine Learning & Cyber</p>
              </div>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-white/60">
              Exploring intelligent systems, predictive models, and secure development practices to build robust applications.
            </p>
            <div className="mt-auto flex flex-wrap gap-1.5">
              <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/60 transition-colors duration-300 group-hover:border-accent/20 group-hover:text-accent-2">AI/ML</span>
              <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/60 transition-colors duration-300 group-hover:border-accent/20 group-hover:text-accent-2">Cybersecurity</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
