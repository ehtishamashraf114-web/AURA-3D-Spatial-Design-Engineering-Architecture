import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface VercelDeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VercelDeployGuideModal: React.FC<VercelDeployGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#0C0D12] border border-white/10 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-neutral-400 hover:text-white p-1"
              aria-label="Close guide"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1.5">
                <svg className="w-4 h-4 fill-white" viewBox="0 0 76 65">
                  <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
                </svg>
                <span className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase">
                  Vercel Deployment Architecture
                </span>
              </div>
              <h2 className="text-2xl font-semibold text-white font-display">
                Vercel Ready Deployment Guide
              </h2>
              <p className="text-xs text-neutral-400 font-sans mt-1">
                Yeh project mukammal tor par Vercel ke liye configure kar diya gaya hai (Vite + Three.js + TypeScript).
              </p>
            </div>

            {/* Status Checklist Box */}
            <div className="bg-[#141620] border border-white/[0.08] rounded-xl p-4 mb-6">
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-2">
                Automated Configurations Included:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-300 font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>vercel.json SPA rewrite configured</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>npm run build creates dist/</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Zero external asset failures</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Clean TypeScript build (tsc)</span>
                </div>
              </div>
            </div>

            {/* 3 Step Deployment Instructions */}
            <div className="space-y-4 mb-6">
              {/* Method 1: GitHub to Vercel */}
              <div className="border border-white/[0.06] rounded-xl p-4 bg-white/[0.02]">
                <h3 className="text-sm font-semibold text-white mb-1">
                  Method 1: GitHub Dashboard (Recommended / Sab se asaan tareeqa)
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-xs text-neutral-300 font-sans leading-relaxed">
                  <li>
                    In files ko apne GitHub repository mein push ya upload karein.
                  </li>
                  <li>
                    <span className="text-white font-medium">vercel.com</span> par login karein aur <span className="text-[#D4AF37]">"Add New Project"</span> par click karein.
                  </li>
                  <li>
                    Apni GitHub repository select karein. Vercel automatically detect kar lega:
                    <div className="mt-2 bg-black/60 p-2.5 rounded font-mono text-[11px] text-neutral-300 space-y-1">
                      <div>Framework Preset: <span className="text-[#D4AF37]">Vite</span></div>
                      <div>Build Command: <span className="text-white">npm run build</span></div>
                      <div>Output Directory: <span className="text-white">dist</span></div>
                    </div>
                  </li>
                  <li>
                    <span className="text-white font-medium">"Deploy"</span> button dabayein. 1 minute mein aapki website live ho jayegi!
                  </li>
                </ol>
              </div>

              {/* Method 2: Vercel CLI */}
              <div className="border border-white/[0.06] rounded-xl p-4 bg-white/[0.02]">
                <h3 className="text-sm font-semibold text-white mb-1">
                  Method 2: Vercel CLI (Direct Terminal Deployment)
                </h3>
                <p className="text-xs text-neutral-400 mb-2 font-sans">
                  Agar aap apne terminal ya command prompt se direct deploy karna chahte hain:
                </p>
                <div className="flex items-center justify-between bg-black/60 px-3 py-2 rounded font-mono text-xs text-neutral-200">
                  <code>npx vercel --prod</code>
                  <button
                    onClick={() => copyToClipboard('npx vercel --prod', 1)}
                    className="text-[11px] text-[#D4AF37] hover:underline"
                  >
                    {copiedIndex === 1 ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-neutral-500 font-mono">
                Output: standard static bundle (dist)
              </span>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-white text-neutral-950 font-medium text-xs rounded-lg hover:bg-[#E5C48A] transition-colors"
              >
                Understood
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
