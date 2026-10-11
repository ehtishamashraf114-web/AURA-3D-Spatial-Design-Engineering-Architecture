import React from 'react';
import { motion } from 'motion/react';

const CAPABILITIES = [
  {
    index: '01',
    title: 'WebGL & Three.js Systems',
    description:
      'Architecting real-time interactive 3D web applications with custom scene graphs, physically based materials, and smooth camera rigs.',
    deliverables: ['Custom PBR Materials', 'Dynamic Studio Lighting', 'Kinematic Solvers', 'Post-Processing'],
  },
  {
    index: '02',
    title: 'Blender & Procedural Art Direction',
    description:
      'Translating cinematic offline 3D concepts into lightweight, real-time geometry with mathematically generated textures and zero network dependency.',
    deliverables: ['Mathematical Curves & Ribbons', 'Procedural Canvas Textures', 'Specular & Caustic Approximations', 'PVD Metal Alloys'],
  },
  {
    index: '03',
    title: 'Performance & 60 FPS Discipline',
    description:
      'Rigorous GPU optimization guaranteeing sustained frame rates across mobile and desktop devices without draining battery or GPU memory.',
    deliverables: ['Batched Draw Calls', 'Context Loss Resilience', 'Adaptive Pixel Ratio', 'Memory Leak Prevention'],
  },
  {
    index: '04',
    title: 'Production Edge Delivery',
    description:
      'Engineered specifically for seamless Vercel and edge hosting with pre-configured headers, instant compilation, and zero server lock-in.',
    deliverables: ['Vercel SPA Rewrites', 'Vite Production Bundler', 'TypeScript Strict Mode', 'Instant Global CDN'],
  },
];

export const Services: React.FC = () => {
  return (
    <section id="services" className="py-28 px-6 max-w-7xl mx-auto border-t border-white/[0.06] relative z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <span className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase block mb-2">
            Core Disciplines
          </span>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-white font-display">
            Design Engineering Capabilities
          </h2>
        </div>
        <p className="text-sm text-neutral-400 max-w-md font-sans">
          Blending the aesthetics of industrial design and high-end architecture
          with production-grade frontend engineering.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CAPABILITIES.map((cap, idx) => (
          <motion.div
            key={cap.index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-[#0C0D12]/80 backdrop-blur-sm border border-white/[0.06] hover:border-[#D4AF37]/30 rounded-xl p-6 flex flex-col justify-between transition-colors shadow-lg"
          >
            <div>
              <span className="text-xs font-mono text-[#D4AF37] block mb-4">
                {cap.index}
              </span>
              <h3 className="text-lg font-semibold text-white mb-2 font-display">
                {cap.title}
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed font-sans mb-6">
                {cap.description}
              </p>
            </div>

            <div className="pt-4 border-t border-white/[0.06]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-2">
                Deliverables
              </span>
              <ul className="space-y-1 text-xs text-neutral-400 font-sans">
                {cap.deliverables.map((item, dIdx) => (
                  <li key={dIdx} className="flex items-center gap-1.5">
                    <span className="text-[#D4AF37] text-[10px]">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
