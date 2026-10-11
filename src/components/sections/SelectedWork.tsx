import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Project {
  id: string;
  number: string;
  title: string;
  client: string;
  year: string;
  category: string;
  description: string;
  metrics: string;
  technologies: string[];
  features: string[];
}

const PROJECTS: Project[] = [
  {
    id: 'vektor',
    number: '01',
    title: 'Vektor Kinematics Configurator',
    client: 'Hyperion Dynamics',
    year: '2026',
    category: 'Spatial Product Configurator',
    description:
      'Real-time WebGL interactive vehicle chassis and suspension visualizer featuring dynamic stress tensor heatmaps and sub-millimeter component inspection.',
    metrics: '60 FPS sustained on mobile · 1.8MB asset footprint',
    technologies: ['Three.js', 'Custom PBR Shaders', 'WebGL 2.0', 'DRACO Compression'],
    features: [
      'Sub-surface scattering for composite carbon fiber',
      'Continuous gimbal kinematic simulation',
      'Dynamic studio reflection probes',
    ],
  },
  {
    id: 'solarium',
    number: '02',
    title: 'Solarium Architectural Pavilion',
    client: 'Nordic Architectural Forum',
    year: '2026',
    category: 'Architectural Visualization',
    description:
      'Digital twin of a parametric solar-responsive timber and glass pavilion in Oslo, calculating real-time solar azimuth angles and soft shadow projections.',
    metrics: '99.4% lighting accuracy compared to offline raytracing',
    technologies: ['React Three Fiber', 'HDR Lighting', 'PCF Soft Shadows', 'TypeScript'],
    features: [
      'Real-time solar azimuth calculation',
      'Micro-faceted dielectrics with dispersion',
      'Camera choreography across 8 spatial viewpoints',
    ],
  },
  {
    id: 'aether',
    number: '03',
    title: 'Aether Precision Tourbillon',
    client: 'Maison Genevoise',
    year: '2025',
    category: 'Haute Horology Interactive',
    description:
      'High-precision 3D mechanical watch tourbillon escapement rendered at 60 FPS in browser with functional gear trains and microscopic metallic bevels.',
    metrics: 'Over 120 synchronized mechanical gears in a single draw call',
    technologies: ['Three.js', 'Procedural Textures', 'Instanced Meshes', 'GLSL'],
    features: [
      'Anisotropic brushed metal reflections',
      'Interactive exploded component view',
      'Escapement gear train kinematic solver',
    ],
  },
  {
    id: 'crystalline',
    number: '04',
    title: 'Crystalline Sound Installation',
    client: 'Biennale di Venezia',
    year: '2025',
    category: 'Generative Interactive Installation',
    description:
      'Acoustic spatial sculpture combining procedural crystal refraction with real-time audio reactive mesh deformations and ambient lighting caustics.',
    metrics: 'Zero external network assets · Pure procedural geometry',
    technologies: ['Web Audio API', 'Three.js', 'Custom Glass Shaders', 'Vite'],
    features: [
      'Harmonic frequency mesh deformation',
      'Dynamic chromatic aberration',
      'Spatial binaural audio integration',
    ],
  },
];

export const SelectedWork: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="work" className="py-28 px-6 max-w-7xl mx-auto border-t border-white/[0.06] relative z-10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <span className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase block mb-2">
            Portfolio Archive
          </span>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-white font-display">
            Selected Spatial Work
          </h2>
        </div>
        <p className="text-sm text-neutral-400 max-w-md font-sans">
          A curated selection of real-time 3D experiences, spatial configurators,
          and architectural installations built for global creative clients.
        </p>
      </div>

      {/* Projects Grid with Motion Stagger */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {PROJECTS.map((project, index) => (
          <motion.article
            key={project.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            onClick={() => setSelectedProject(project)}
            className="group cursor-pointer bg-[#0D0E13]/80 backdrop-blur-sm border border-white/[0.08] hover:border-[#D4AF37]/50 rounded-2xl p-8 transition-colors duration-300 shadow-xl flex flex-col justify-between"
          >
            <div>
              {/* Card Meta Header */}
              <div className="flex items-center justify-between text-xs text-neutral-500 font-mono mb-4">
                <span>{project.number}</span>
                <div className="flex items-center gap-2">
                  <span>{project.client}</span>
                  <span aria-hidden="true">·</span>
                  <span>{project.year}</span>
                </div>
              </div>

              {/* Title & Category */}
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#D4AF37] block mb-1">
                {project.category}
              </span>
              <h3 className="text-2xl font-semibold text-white group-hover:text-[#E5C48A] transition-colors mb-3 font-display">
                {project.title}
              </h3>

              <p className="text-sm text-neutral-300 leading-relaxed font-sans mb-6">
                {project.description}
              </p>
            </div>

            <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between text-xs text-neutral-400">
              <span className="font-mono text-[11px]">{project.metrics}</span>
              <span className="text-white group-hover:translate-x-1.5 transition-transform inline-flex items-center gap-1 font-medium">
                View Blueprint →
              </span>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Detail Modal with AnimatePresence */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#0C0D12] border border-white/10 rounded-2xl max-w-2xl w-full p-8 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 text-neutral-400 hover:text-white p-1"
                aria-label="Close dialog"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider block mb-1">
                Case Study Specification · {selectedProject.number}
              </span>
              <h3 className="text-2xl font-semibold text-white mb-2 font-display">
                {selectedProject.title}
              </h3>
              <p className="text-xs text-neutral-400 font-mono mb-6">
                Client: {selectedProject.client} · Year: {selectedProject.year} · {selectedProject.category}
              </p>

              <p className="text-sm text-neutral-200 leading-relaxed mb-6 font-sans">
                {selectedProject.description}
              </p>

              <div className="mb-6">
                <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                  Technical Highlights
                </h4>
                <ul className="space-y-1.5 text-xs text-neutral-300 font-sans">
                  {selectedProject.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2 text-[11px] font-mono text-neutral-400">
                  {selectedProject.technologies.map((tech) => (
                    <span key={tech} className="bg-white/5 px-2.5 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-5 py-2.5 bg-white text-neutral-950 font-medium text-xs rounded-lg hover:bg-[#E5C48A] transition-colors"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
