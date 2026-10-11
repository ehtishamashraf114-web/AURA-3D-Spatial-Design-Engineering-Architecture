import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/hero/HeroSection';
import { SelectedWork } from './components/sections/SelectedWork';
import { Services } from './components/sections/Services';
import { Philosophy } from './components/sections/Philosophy';
import { Footer } from './components/layout/Footer';
import { ContactModal } from './components/modals/ContactModal';
import { VercelDeployGuideModal } from './components/modals/VercelDeployGuideModal';

export default function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Initialize and listen to system prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setReducedMotion(e.matches);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Keyboard shortcut: Escape closes open modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsContactOpen(false);
        setIsDeployGuideOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#08090C] text-[#F3F4F6] selection:bg-[#D4AF37]/30 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        onOpenContact={() => setIsContactOpen(true)}
        onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion(!reducedMotion)}
      />

      {/* Main Hero Experience centered around real-time 3D Scene */}
      <main>
        <HeroSection reducedMotion={reducedMotion} />
        <SelectedWork />
        <Services />
        <Philosophy />
      </main>

      {/* Footer */}
      <Footer
        onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* Interactive Modals */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <VercelDeployGuideModal
        isOpen={isDeployGuideOpen}
        onClose={() => setIsDeployGuideOpen(false)}
      />
    </div>
  );
}
