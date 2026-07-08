import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Lightning from './components/Lightning';

function App() {
  return (
    <>
      <Navbar />

      {/* Full-page fixed WebGL lightning background */}
      <div className="fixed inset-0 -z-10 pointer-events-none w-full h-full opacity-30">
        <Lightning hue={230} xOffset={0} speed={0.8} intensity={1.2} size={1} />
      </div>

      <main className="flex flex-col flex-1">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
    </>
  );
}

export default App;
