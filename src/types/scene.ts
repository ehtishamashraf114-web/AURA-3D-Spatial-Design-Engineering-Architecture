export type MaterialPresetId = 'obsidian_platinum' | 'champagne_bronze' | 'minimal_titanium';

export type LightingMoodId = 'studio_key' | 'golden_dusk' | 'noir_architectural';

export type CameraPresetId = 'hero' | 'architectural' | 'detail' | 'monolith';

export interface Hotspot {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
  position: [number, number, number];
  cameraTarget: [number, number, number];
  cameraPosition: [number, number, number];
}

export interface MaterialThemeConfig {
  id: MaterialPresetId;
  name: string;
  paletteDescription: string;
  primaryMetalColor: string;
  secondaryMetalColor: string;
  accentMetalColor: string;
  stoneColor: string;
  glassColor: string;
  glassTransmission: number;
  glassRoughness: number;
  glassIor: number;
  coreGlowColor: string;
}

export interface LightingThemeConfig {
  id: LightingMoodId;
  name: string;
  description: string;
  keyColor: string;
  keyIntensity: number;
  fillColor: string;
  fillIntensity: number;
  rimColor: string;
  rimIntensity: number;
  ambientColor: string;
  ambientIntensity: number;
  coveColor: string;
  coveIntensity: number;
  fogColor: string;
  fogDensity: number;
}
