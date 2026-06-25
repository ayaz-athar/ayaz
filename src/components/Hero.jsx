import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
// Bundle the Spline Viewer runtime locally
import '@splinetool/viewer';

export default function Hero() {
  const [isSplineLoaded, setIsSplineLoaded] = useState(false);
  const splineRef = useRef(null);

  useEffect(() => {
    const spline = splineRef.current;
    if (!spline) return;

    // Safety timeout: if it doesn't load in 4.5 seconds, force fade-in so user isn't blocked
    const safetyTimeout = setTimeout(() => {
      console.log('Spline safety timeout reached. Forcing load state.');
      setIsSplineLoaded(true);
    }, 4500);

    const handleLoad = () => {
      clearTimeout(safetyTimeout);
      setIsSplineLoaded(true);
      
      // Attempt to hide spline logo from shadow DOM immediately
      try {
        const shadowRoot = spline.shadowRoot;
        if (shadowRoot) {
          const logo = shadowRoot.querySelector('#logo');
          if (logo) logo.style.display = 'none';
        }
      } catch (err) {
        console.warn('Could not access shadowRoot to hide logo:', err);
      }
    };

    spline.addEventListener('load', handleLoad);

    // Periodically check for canvas and hide logo
    const interval = setInterval(() => {
      try {
        const shadowRoot = spline.shadowRoot;
        if (shadowRoot) {
          // Hide logo if found
          const logo = shadowRoot.querySelector('#logo');
          if (logo) {
            logo.style.display = 'none';
          }
          
          // If canvas is present, the 3D scene is rendering. Trigger load state if not already set.
          const canvas = shadowRoot.querySelector('canvas');
          if (canvas) {
            clearTimeout(safetyTimeout);
            setIsSplineLoaded(true);
          }
        }
      } catch (err) {
        // Ignore cross-origin errors
      }
    }, 300);

    // Initial check in case it loaded instantly
    try {
      const shadowRoot = spline.shadowRoot;
      if (shadowRoot && shadowRoot.querySelector('canvas')) {
        clearTimeout(safetyTimeout);
        setIsSplineLoaded(true);
      }
    } catch (e) {}

    return () => {
      spline.removeEventListener('load', handleLoad);
      clearTimeout(safetyTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-10 sm:pt-24 sm:pb-12 md:pt-28 md:pb-16 border-b border-white/10">
      {/* Animated Background Shapes */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" style={{ backgroundImage: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,163,115,0.12), transparent 70%)" }}>
        
        <div className="absolute left-[-8%] top-[8%]" style={{ animationDelay: '0.3s', animationFillMode: 'both', '--shape-rotate': '12deg', '--shape-rotate-start': '-3deg' }}>
          <div style={{ width: '620px', height: '150px' }} className="relative motion-safe:animate-shape-enter motion-safe:animate-shape-float">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r to-transparent from-[#d4a373]/[0.12] backdrop-blur-[2px] border-2 border-white/[0.15] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] after:absolute after:inset-0 after:rounded-full after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"></div>
          </div>
        </div>

        <div className="absolute right-[-6%] top-[30%]" style={{ animationDelay: '0.5s', animationFillMode: 'both', '--shape-rotate': '-15deg', '--shape-rotate-start': '-30deg' }}>
          <div style={{ width: '520px', height: '130px' }} className="relative motion-safe:animate-shape-enter motion-safe:animate-shape-float">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r to-transparent from-[#faedcd]/[0.12] backdrop-blur-[2px] border-2 border-white/[0.15] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] after:absolute after:inset-0 after:rounded-full after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"></div>
          </div>
        </div>

        <div className="absolute left-[6%] bottom-[8%]" style={{ animationDelay: '0.4s', animationFillMode: 'both', '--shape-rotate': '-8deg', '--shape-rotate-start': '-23deg' }}>
          <div style={{ width: '340px', height: '90px' }} className="relative motion-safe:animate-shape-enter motion-safe:animate-shape-float">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r to-transparent from-[#b5835a]/[0.12] backdrop-blur-[2px] border-2 border-white/[0.15] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] after:absolute after:inset-0 after:rounded-full after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"></div>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-transparent to-[#050505]/50"></div>
      </div>

      <div className="relative mx-auto max-w-6xl w-full px-6 grid lg:grid-cols-2 gap-10 items-center">
        <div className="flex flex-col gap-6 text-center lg:text-left">
          
          <span className="inline-flex items-center gap-2 self-center lg:self-start rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:border-white/20">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent-2 opacity-75 animate-ping"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-2"></span>
            </span>
            Available for opportunities
          </span>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05]">
            Ayaz<br/>
            <span className="text-gradient">Athar</span>
          </h1>
          
          <p className="text-lg text-white/70 max-w-xl mx-auto lg:mx-0">
            Aspiring Software Engineer · Frontend Developer · AI & ML Enthusiast · Cybersecurity Student building modern, reliable web technologies and impactful projects.
          </p>
          
          <p className="inline-flex items-center justify-center lg:justify-start gap-2 text-sm text-white/40">
            <MapPin size={16} className="text-accent" />
            Computer Science Engineering Student
          </p>
          
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
            <a href="#contact" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-300 bg-gradient-to-r from-accent via-white to-accent-2 text-black hover:scale-105 active:scale-95 shadow-[0_2px_24px_-4px_rgba(212,163,115,0.5)] hover:shadow-[0_0_30px_rgba(212,163,115,0.6)] h-12 px-7 text-base">
              <Sparkles size={16} />
              Start a project
            </a>
            <a href="#projects" className="group/work inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-300 border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-accent hover:text-accent-2 hover:scale-105 active:scale-95 h-12 px-7 text-base">
              View work
              <ArrowRight size={16} className="group-hover/work:translate-x-1.5 transition-transform duration-300" />
            </a>
          </div>
        </div>
        
        <div className="relative h-[360px] sm:h-[460px] lg:h-[560px] w-full flex items-center justify-center">
          {/* Skeleton/Loader while the Spline scene is loading */}
          {!isSplineLoaded && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-full h-full max-w-md mx-auto flex flex-col items-center justify-center">
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                   className="absolute w-64 h-64 rounded-full border border-white/5"
                 />
                 <motion.div 
                   animate={{ rotate: -360 }}
                   transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                   className="absolute w-48 h-48 rounded-full border border-dashed border-accent/20"
                 />
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,163,115,0.05)_0%,transparent_70%)] animate-pulse mix-blend-screen" />
                 
                 <div className="flex flex-col items-center gap-3 z-10">
                    <div className="h-10 w-10 rounded-full border-2 border-accent border-r-transparent animate-spin"></div>
                    <span className="text-xs font-medium text-white/40 tracking-widest uppercase">Loading 3D Experience</span>
                 </div>
              </div>
            </div>
          )}

          {/* Spline Viewer for the Mystic Fox 3D Robot */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: isSplineLoaded ? 1 : 0, 
              scale: isSplineLoaded ? 1 : 0.95 
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full h-full relative z-10 pointer-events-auto"
          >
            <spline-viewer
              ref={splineRef}
              url="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              class="w-full h-full block"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
