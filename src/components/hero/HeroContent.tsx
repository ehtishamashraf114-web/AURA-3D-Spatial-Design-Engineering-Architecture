import React from 'react';
import { motion } from 'motion/react';

interface HeroContentProps {
  onExploreExperience: () => void;
}

export const HeroContent: React.FC<HeroContentProps> = ({
  onExploreExperience,
}) => {
  return (
    <div className="relative z-10 pointer-events-none max-w-7xl mx-auto px-6 pt-32 md:pt-40 pb-28 flex flex-col justify-between min-h-[calc(100vh-4rem)]">
      {/* Top Left Editorial Block */}
      <div className="max-w-2xl text-left pointer-events-auto">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2 mb-4 text-xs font-mono tracking-widest text-[#D4AF37] uppercase"
        >
          <span>Design Engineering</span>
          <span aria-hidden="true" className="text-neutral-600">/</span>
          <span>Immersive Digital Experiences</span>
        </motion.div>

        {/* Primary Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.08] mb-6 font-display text-balance"
        >
          Where Digital Design Meets the Third Dimension.
        </motion.h1>

        {/* Supporting Copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg text-neutral-300 font-normal leading-relaxed max-w-xl mb-8 font-sans"
        >
          Crafting immersive digital experiences through precise engineering,
          cinematic visuals, and interactive 3D environments.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onExploreExperience}
            className="px-6 py-3.5 text-xs uppercase tracking-widest font-semibold text-neutral-950 bg-white hover:bg-[#E5C48A] rounded-lg transition-colors duration-200 shadow-xl shadow-white/10 whitespace-nowrap"
          >
            Explore the Experience
          </motion.button>

          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="#work"
            className="px-6 py-3.5 text-xs uppercase tracking-widest font-semibold text-neutral-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors duration-200 whitespace-nowrap"
          >
            View Selected Work
          </motion.a>
        </motion.div>
      </div>

      {/* Bottom Editorial Specs Line (Unboxed metadata) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0, delay: 0.85 }}
        className="pt-12 flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-400 pointer-events-auto"
      >
        <div className="flex items-center gap-2">
          <span>WebGL Physically Based Shading</span>
          <span aria-hidden="true" className="text-neutral-600">·</span>
          <span>ACES Filmic Tone Mapping</span>
          <span aria-hidden="true" className="text-neutral-600">·</span>
          <span>Zero-Dependency Procedural Textures</span>
        </div>
      </motion.div>
    </div>
  );
};
