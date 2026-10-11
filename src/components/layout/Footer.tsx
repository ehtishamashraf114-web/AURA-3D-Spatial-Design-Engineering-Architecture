import React from 'react';

interface FooterProps {
  onOpenDeployGuide: () => void;
  onOpenContact: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenDeployGuide,
  onOpenContact,
}) => {
  return (
    <footer className="border-t border-white/[0.08] bg-[#07080A] py-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <span className="text-sm font-semibold tracking-wider text-white font-display block mb-1">
            AURA STUDIO
          </span>
          <p className="text-xs text-neutral-400 font-sans max-w-sm">
            Spatial Design Engineering &amp; Architectural WebGL Installations.
            Engineered for seamless static deployment on Vercel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-400 font-sans">
          <a href="#work" className="hover:text-white transition-colors">
            Selected Work
          </a>
          <a href="#services" className="hover:text-white transition-colors">
            Capabilities
          </a>
          <a href="#philosophy" className="hover:text-white transition-colors">
            Philosophy
          </a>
          <button
            onClick={onOpenDeployGuide}
            className="hover:text-[#D4AF37] transition-colors"
          >
            Vercel Deployment Guide
          </button>
          <button
            onClick={onOpenContact}
            className="hover:text-white transition-colors"
          >
            Inquire
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-neutral-500">
        <div className="flex items-center gap-2">
          <span>Three.js PBR</span>
          <span aria-hidden="true">·</span>
          <span>ACES Filmic Tone Mapping</span>
          <span aria-hidden="true">·</span>
          <span>Vercel Ready</span>
        </div>
        <div>
          © {new Date().getFullYear()} AURA STUDIO. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
