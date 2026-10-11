import React from 'react';
import { motion } from 'motion/react';

export const Philosophy: React.FC = () => {
  return (
    <section id="philosophy" className="py-28 px-6 max-w-7xl mx-auto border-t border-white/[0.06] relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Manifesto */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5"
        >
          <span className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase block mb-2">
            Studio Principles
          </span>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-white mb-6 font-display">
            The Intersection of Form, Code, and Materiality.
          </h2>
          <p className="text-sm text-neutral-300 leading-relaxed font-sans mb-6">
            We believe that 3D on the web has suffered from two extremes: either
            toy-like floating low-poly gadgets, or sluggish, unoptimized tech demos
            that freeze phones.
          </p>
          <p className="text-sm text-neutral-400 leading-relaxed font-sans">
            Our approach treats the browser as an architectural gallery. We pair
            rigorous mathematical geometry with physically based material shaders,
            subtle lighting, and zero external baggage.
          </p>
        </motion.div>

        {/* Right Column: Three Pillars */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              num: '01',
              title: 'Physical Truth',
              desc: 'Materials calibrated to real optical physics: Fresnel equations, micro-surface roughness, and dielectric refraction.',
            },
            {
              num: '02',
              title: 'Light & Shadow',
              desc: 'Three-point studio lighting with directional key soft shadows, cool fill bounce, and sharp silhouette rim highlights.',
            },
            {
              num: '03',
              title: 'Zero-Latency Motion',
              desc: 'Smooth camera parallax with damping, reduced-motion accessibility, and instant responsiveness to touch and pointer events.',
            },
          ].map((item, idx) => (
            <motion.div
              key={item.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-[#0C0D12]/80 backdrop-blur-sm border border-white/[0.06] hover:border-[#D4AF37]/30 rounded-xl p-6 transition-colors shadow-lg"
            >
              <span className="text-xs font-mono text-[#D4AF37] block mb-3">{item.num}</span>
              <h3 className="text-base font-semibold text-white mb-2 font-display">
                {item.title}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
