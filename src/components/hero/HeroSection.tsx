import React, { useState } from 'react';
import { SceneCanvas } from '../3d/SceneCanvas';
import { HeroContent } from './HeroContent';
import { SceneHUD } from './SceneHUD';
import {
  CameraPresetId,
  Hotspot,
  LightingMoodId,
  MaterialPresetId,
} from '../../types/scene';

interface HeroSectionProps {
  reducedMotion: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ reducedMotion }) => {
  const [materialPreset, setMaterialPreset] =
    useState<MaterialPresetId>('obsidian_platinum');
  const [lightingMood, setLightingMood] =
    useState<LightingMoodId>('studio_key');
  const [cameraPreset, setCameraPreset] = useState<CameraPresetId>('hero');
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [isInspecting, setIsInspecting] = useState(false);

  const handleExploreExperience = () => {
    setIsInspecting(true);
    setCameraPreset('detail');
  };

  const handleResetScene = () => {
    setActiveHotspot(null);
    setCameraPreset('hero');
  };

  return (
    <section className="relative w-full min-h-screen bg-[#08090C] overflow-hidden flex flex-col justify-between">
      {/* 3D WebGL Canvas Layer (Full Viewport) */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <SceneCanvas
          materialPreset={materialPreset}
          lightingMood={lightingMood}
          cameraPreset={cameraPreset}
          activeHotspotId={activeHotspot?.id || null}
          onSelectHotspot={setActiveHotspot}
          isInspecting={isInspecting}
          reducedMotion={reducedMotion}
        />
      </div>

      {/* Atmospheric measured gradient scrim ensuring 4.5:1 text contrast */}
      <div
        className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-r from-[#08090C]/90 via-[#08090C]/40 to-transparent md:w-3/5"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-40 z-0 pointer-events-none bg-gradient-to-t from-[#08090C] via-[#08090C]/50 to-transparent"
        aria-hidden="true"
      />

      {/* Hero Typography & CTAs Layer */}
      <HeroContent onExploreExperience={handleExploreExperience} />

      {/* Interactive 3D HUD Dock Layer */}
      <SceneHUD
        materialPreset={materialPreset}
        onSelectMaterial={setMaterialPreset}
        lightingMood={lightingMood}
        onSelectLighting={setLightingMood}
        cameraPreset={cameraPreset}
        onSelectCamera={setCameraPreset}
        isInspecting={isInspecting}
        onToggleInspect={() => setIsInspecting(!isInspecting)}
        activeHotspot={activeHotspot}
        onCloseHotspot={() => setActiveHotspot(null)}
        onResetScene={handleResetScene}
      />
    </section>
  );
};
