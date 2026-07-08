import React from 'react';
import { Mail, Globe } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="relative py-16 sm:py-20 md:py-24 overflow-hidden border-t border-white/10 mt-16">
      {/* Background radial */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" style={{ backgroundImage: "radial-gradient(ellipse 50% 50% at 50% 100%, rgba(212,163,115,0.05), transparent 70%)" }}>
      </div>

      <div className="mx-auto max-w-6xl px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-6">
          Ready to build something <span className="text-gradient">extraordinary?</span>
        </h2>
        <p className="text-lg text-white/60 max-w-2xl mx-auto mb-10">
          I'm currently open to new opportunities, collaborations, and freelance projects. Whether you have a question or just want to say hi, I'll try my best to get back to you!
        </p>

        <a 
          href="https://mail.google.com/mail/?view=cm&fs=1&to=ayaz.athar.44@gmail.com" 
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-300 bg-white text-black hover:scale-105 active:scale-95 shadow-[0_2px_24px_-4px_rgba(255,255,255,0.3)] hover:shadow-[0_0_35px_rgba(255,255,255,0.45)] h-14 px-8 text-lg mb-20"
        >
          <Mail size={20} />
          Say Hello
        </a>

        <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-8 gap-6">
          <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-white/80">
            <span className="h-2 w-2 rounded-sm bg-gradient-to-br from-accent to-accent-2"></span>
            Ayaz Athar
          </div>

          <div className="flex gap-4">
            {/* GitHub */}
            <a 
              href="https://github.com/ayaz-athar" 
              target="_blank" 
              rel="noreferrer" 
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all duration-300 hover:scale-115 hover:rotate-6 hover:text-accent hover:border-accent hover:bg-white/10" 
              aria-label="GitHub"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a 
              href="https://www.linkedin.com/in/ayazathar" 
              target="_blank" 
              rel="noreferrer" 
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all duration-300 hover:scale-115 hover:rotate-6 hover:text-accent hover:border-accent hover:bg-white/10" 
              aria-label="LinkedIn"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>

            {/* X (formerly Twitter) */}
            <a 
              href="https://x.com/_ayazathar" 
              target="_blank" 
              rel="noreferrer" 
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all duration-300 hover:scale-115 hover:rotate-6 hover:text-accent hover:border-accent hover:bg-white/10" 
              aria-label="X (formerly Twitter)"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a 
              href="https://instagram.com/_ayazathar" 
              target="_blank" 
              rel="noreferrer" 
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all duration-300 hover:scale-115 hover:rotate-6 hover:text-accent hover:border-accent hover:bg-white/10" 
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>

            {/* Personal Website */}
            <a 
              href="https://ayazathar.netlify.app/" 
              target="_blank" 
              rel="noreferrer" 
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all duration-300 hover:scale-115 hover:rotate-6 hover:text-accent hover:border-accent hover:bg-white/10" 
              aria-label="Portfolio"
            >
              <Globe size={18} />
            </a>
          </div>

          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Ayaz Athar. Designed with precision.
          </p>
        </div>
      </div>
    </section>
  );
}
