import React, { useState, useRef } from 'react';
import { Quote } from 'lucide-react';

export default function SplitTextReveal({ text = "Talk is cheap.", revealText = "Show me the code." }) {
  const containerRef = useRef(null);
  const [sliderX, setSliderX] = useState(0); // Default to 0% (only Talk is cheap is visible)
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderX(percentage);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setSliderX(0); // reset to hide reveal text when mouse leaves
      }}
      className="relative w-full h-24 flex items-center justify-center cursor-ew-resize select-none overflow-hidden rounded-xl border border-white/5 bg-black/20"
    >
      {/* Starry particle effect shown on the right side of the slider divider */}
      <div 
        className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${!isHovered ? 'transition-all duration-500 ease-out' : ''}`}
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '12px 12px',
          clipPath: `polygon(${sliderX}% 0, 100% 0, 100% 100%, ${sliderX}% 100%)`,
          opacity: isHovered ? 0.35 : 0.15
        }}
      />

      {/* Layer 1 (Bottom): Default Text (Talk is cheap) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <p className="text-base sm:text-lg font-bold tracking-widest uppercase text-white/30 whitespace-nowrap">
          {text}
        </p>
      </div>

      {/* Layer 2 (Top): Reveal Text (Show me the code) */}
      <div 
        className={`absolute inset-0 flex items-center justify-center pointer-events-none ${!isHovered ? 'transition-all duration-500 ease-out' : ''}`}
        style={{ 
          clipPath: `polygon(0 0, ${sliderX}% 0, ${sliderX}% 100%, 0 100%)`
        }}
      >
        <p className="text-base sm:text-lg font-bold tracking-widest uppercase bg-gradient-to-r from-accent via-white to-accent-2 bg-clip-text text-transparent whitespace-nowrap drop-shadow-[0_0_10px_rgba(212,163,115,0.45)]">
          {revealText}
        </p>
      </div>

      {/* Vertical Slider Divider Line */}
      <div 
        className={`absolute top-0 bottom-0 w-[1.5px] bg-gradient-to-b from-transparent via-accent to-transparent pointer-events-none shadow-[0_0_8px_rgba(212,163,115,0.8)] ${!isHovered ? 'transition-all duration-500 ease-out' : 'transition-opacity duration-300'}`}
        style={{ 
          left: `${sliderX}%`,
          opacity: isHovered ? 1 : 0
        }}
      />
      
      {/* Large faint quote icon behind the text */}
      <Quote className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-32 w-32 -translate-x-1/2 -translate-y-1/2 text-white/[0.02]" />
    </div>
  );
}
