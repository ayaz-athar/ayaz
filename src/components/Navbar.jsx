import React, { useState, useEffect } from 'react';
import { Sparkles, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const [active, setActive] = useState('About');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = ['About', 'Skills', 'Projects', 'Contact'];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 inset-x-0 z-50 transition-all duration-300",
      isScrolled ? "mt-2" : "mt-4"
    )}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between rounded-full border border-white/10 bg-bg/70 backdrop-blur-xl px-3 sm:px-4 py-2 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]">
          <a href="#home" className="flex items-center gap-2 text-sm font-semibold tracking-tight pl-1 text-white">
            <span className="h-2.5 w-2.5 rounded-sm bg-gradient-to-br from-accent to-accent-2"></span>
            Ayaz Athar
          </a>
          
          <div className="hidden md:flex relative">
            <nav className="flex relative">
              <ul className="flex gap-2 list-none p-0 px-4 m-0 relative z-[3] text-white">
                {links.map((link) => (
                  <li key={link} className="relative cursor-pointer">
                    <a
                      href={`#${link.toLowerCase()}`}
                      onClick={() => setActive(link)}
                      className={cn(
                        "relative outline-none py-[0.6em] px-[1.2em] inline-block text-sm transition-all duration-300 z-10 rounded-full hover:scale-105 active:scale-95",
                        active === link ? "text-black" : "text-white hover:text-white/80 hover:bg-white/5"
                      )}
                    >
                      {link}
                    </a>
                    {active === link && (
                      <motion.div
                        layoutId="pill"
                        className="absolute inset-0 rounded-full bg-white z-0"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          
          <div className="flex items-center gap-2">
            <a href="#contact" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-accent via-white to-accent-2 text-black hover:scale-105 active:scale-95 shadow-[0_2px_24px_-4px_rgba(212,163,115,0.5)] hover:shadow-[0_0_25px_rgba(212,163,115,0.6)] h-10 px-5 shrink-0 text-xs sm:text-sm">
              <Sparkles size={16} />
              Hire Me
            </a>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex md:hidden h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-all duration-300 hover:scale-110 active:scale-90 hover:bg-white/10 hover:text-white"
            >
              {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
        
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <nav className="mt-2 flex flex-col gap-1 rounded-2xl border border-white/10 bg-bg/80 backdrop-blur-xl p-2 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]">
                {links.map((link) => (
                  <a 
                    key={link}
                    href={`#${link.toLowerCase()}`} 
                    onClick={() => { setActive(link); setIsMobileMenuOpen(false); }}
                    className={cn(
                      "rounded-xl px-4 py-2.5 text-sm transition-colors",
                      active === link ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {link}
                  </a>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
