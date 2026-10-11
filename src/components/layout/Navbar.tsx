import React, { useState } from 'react';

interface NavbarProps {
  onOpenContact: () => void;
  onOpenDeployGuide: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenContact,
  onOpenDeployGuide,
  reducedMotion,
  onToggleReducedMotion,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#08090C]/80 backdrop-blur-md border-b border-white/[0.06] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#"
          className="text-base font-semibold tracking-wider text-white font-display whitespace-nowrap shrink-0 hover:text-[#D4AF37] transition-colors"
        >
          AURA STUDIO
        </a>

        {/* Zone 2: Single-line Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest text-neutral-400 font-sans">
          <a
            href="#work"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1"
          >
            Selected Work
          </a>
          <a
            href="#services"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1"
          >
            Capabilities
          </a>
          <a
            href="#philosophy"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1"
          >
            Philosophy
          </a>
          <button
            onClick={onOpenDeployGuide}
            className="hover:text-[#D4AF37] transition-colors whitespace-nowrap shrink-0 py-1 text-neutral-300"
          >
            Vercel Deployment
          </button>
        </nav>

        {/* Zone 3: Primary Action + Utility */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleReducedMotion}
            aria-label="Toggle motion preference"
            title={reducedMotion ? 'Enable Full 3D Motion' : 'Enable Reduced Motion'}
            className="hidden sm:inline-flex items-center px-2.5 py-1 text-[11px] font-mono tracking-tight text-neutral-400 hover:text-white border border-white/10 rounded transition-colors whitespace-nowrap shrink-0"
          >
            {reducedMotion ? 'Motion: Off' : 'Motion: On'}
          </button>

          <button
            onClick={onOpenContact}
            className="px-4 py-2 text-xs font-medium uppercase tracking-wider text-neutral-950 bg-white hover:bg-[#E5C48A] rounded transition-all duration-200 whitespace-nowrap shrink-0 shadow-sm"
          >
            Inquire Project
          </button>

          {/* Mobile menu hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-400 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0C0D12] border-b border-white/10 px-6 py-4 space-y-3 text-xs uppercase tracking-widest text-neutral-300">
          <a
            href="#work"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-white"
          >
            Selected Work
          </a>
          <a
            href="#services"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-white"
          >
            Capabilities
          </a>
          <a
            href="#philosophy"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-white"
          >
            Philosophy
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenDeployGuide();
            }}
            className="block text-left w-full py-2 text-[#D4AF37]"
          >
            Vercel Deployment Guide
          </button>
          <button
            onClick={() => {
              onToggleReducedMotion();
              setMobileMenuOpen(false);
            }}
            className="block text-left w-full py-2 text-neutral-400 border-t border-white/5 pt-3"
          >
            {reducedMotion ? 'Switch to Full Motion' : 'Switch to Reduced Motion'}
          </button>
        </div>
      )}
    </header>
  );
};
