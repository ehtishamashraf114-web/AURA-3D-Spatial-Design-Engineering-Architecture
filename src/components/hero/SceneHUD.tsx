import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CameraPresetId,
  Hotspot,
  LightingMoodId,
  MaterialPresetId,
} from '../../types/scene';
import {
  CAMERA_PRESETS,
  LIGHTING_THEMES,
  MATERIAL_THEMES,
} from '../../data/sceneConfig';

interface SceneHUDProps {
  materialPreset: MaterialPresetId;
  onSelectMaterial: (preset: MaterialPresetId) => void;
  lightingMood: LightingMoodId;
  onSelectLighting: (mood: LightingMoodId) => void;
  cameraPreset: CameraPresetId;
  onSelectCamera: (preset: CameraPresetId) => void;
  isInspecting: boolean;
  onToggleInspect: () => void;
  activeHotspot: Hotspot | null;
  onCloseHotspot: () => void;
  onResetScene: () => void;
}

export const SceneHUD: React.FC<SceneHUDProps> = ({
  materialPreset,
  onSelectMaterial,
  lightingMood,
  onSelectLighting,
  cameraPreset,
  onSelectCamera,
  isInspecting,
  onToggleInspect,
  activeHotspot,
  onCloseHotspot,
  onResetScene,
}) => {
  return (
    <>
      {/* Active Hotspot Detail Card with AnimatePresence */}
      <AnimatePresence>
        {activeHotspot && (
          <motion.aside
            key={activeHotspot.id}
            initial={{ opacity: 0, y: -16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.94 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            aria-label="3D Element Specification"
            className="absolute top-24 right-6 md:right-12 z-20 max-w-sm w-full bg-[#0C0D12]/92 backdrop-blur-2xl border border-white/15 rounded-2xl p-5 shadow-2xl text-left"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase">
                  {activeHotspot.category} · Specification {activeHotspot.number}
                </span>
                <h3 className="text-base font-semibold text-white mt-0.5">
                  {activeHotspot.title}
                </h3>
              </div>
              <button
                onClick={onCloseHotspot}
                className="p-1 text-neutral-400 hover:text-white transition-colors"
                aria-label="Close specification dialog"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed font-sans mb-4">
              {activeHotspot.description}
            </p>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Target Locked
              </span>
              <button
                onClick={onResetScene}
                className="text-[#D4AF37] hover:underline"
              >
                Reset Camera
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Docked Control Strip (Bottom Floating HUD) */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        aria-label="Interactive 3D Viewport Controls"
        className="absolute bottom-6 left-6 right-6 z-20 pointer-events-none flex flex-col md:flex-row items-end md:items-center justify-between gap-4"
      >
        {/* Left: Drag hint & Active preset indicator */}
        <div className="pointer-events-auto bg-[#0C0D12]/90 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2.5 text-xs text-neutral-300 flex items-center gap-3 shadow-xl">
          <button
            onClick={onToggleInspect}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
              isInspecting
                ? 'bg-[#D4AF37] text-neutral-950 font-semibold shadow-md shadow-[#D4AF37]/25'
                : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
              />
            </svg>
            {isInspecting ? 'Orbit Active (Drag Viewport)' : 'Enable 3D Orbit'}
          </button>
          <span className="hidden sm:inline text-neutral-600">|</span>
          <span className="hidden sm:inline text-[11px] text-neutral-400 font-mono">
            Markers 01–04 Active
          </span>
        </div>

        {/* Right: Studio Controls Dock (Camera, Material, Lighting) */}
        <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-2 bg-[#0C0D12]/90 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl">
          {/* Camera Angles Selector */}
          <div className="flex items-center gap-1 px-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 px-1 hidden lg:inline">
              Angle
            </span>
            {(['hero', 'architectural', 'detail'] as CameraPresetId[]).map((camKey) => (
              <button
                key={camKey}
                onClick={() => onSelectCamera(camKey)}
                className={`px-3 py-1.5 rounded-lg text-[11px] transition-all whitespace-nowrap ${
                  cameraPreset === camKey && !activeHotspot
                    ? 'bg-white/20 text-white font-medium shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {CAMERA_PRESETS[camKey].name.replace(' View', '').replace(' Angle', '')}
              </button>
            ))}
          </div>

          <div className="w-[1px] h-4 bg-white/10 mx-0.5 hidden sm:block" />

          {/* Material Finish Selector */}
          <div className="flex items-center gap-1 px-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 px-1 hidden lg:inline">
              Finish
            </span>
            {(['obsidian_platinum', 'champagne_bronze', 'minimal_titanium'] as MaterialPresetId[]).map(
              (matKey) => (
                <button
                  key={matKey}
                  onClick={() => onSelectMaterial(matKey)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] transition-all whitespace-nowrap ${
                    materialPreset === matKey
                      ? 'bg-[#D4AF37]/25 border border-[#D4AF37]/60 text-[#F5DEB3] font-medium shadow-sm'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {matKey === 'obsidian_platinum'
                    ? 'Obsidian'
                    : matKey === 'champagne_bronze'
                    ? 'Champagne'
                    : 'Titanium'}
                </button>
              )
            )}
          </div>

          <div className="w-[1px] h-4 bg-white/10 mx-0.5 hidden sm:block" />

          {/* Lighting Mood Selector */}
          <div className="flex items-center gap-1 px-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 px-1 hidden lg:inline">
              Light
            </span>
            {(['studio_key', 'golden_dusk', 'noir_architectural'] as LightingMoodId[]).map(
              (lightKey) => (
                <button
                  key={lightKey}
                  onClick={() => onSelectLighting(lightKey)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] transition-all whitespace-nowrap ${
                    lightingMood === lightKey
                      ? 'bg-white/20 text-white font-medium shadow-sm'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                  title={LIGHTING_THEMES[lightKey].description}
                >
                  {lightKey === 'studio_key'
                    ? 'Studio'
                    : lightKey === 'golden_dusk'
                    ? 'Dusk'
                    : 'Noir'}
                </button>
              )
            )}
          </div>
        </div>
      </motion.section>
    </>
  );
};
