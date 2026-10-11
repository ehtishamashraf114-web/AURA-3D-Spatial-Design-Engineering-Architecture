import * as THREE from 'three';
import { LightingThemeConfig } from '../../types/scene';

export interface LightingRigNodes {
  group: THREE.Group;
  keyLight: THREE.DirectionalLight;
  fillLight: THREE.DirectionalLight;
  rimLight: THREE.DirectionalLight;
  ambientLight: THREE.AmbientLight;
  hemiLight: THREE.HemisphereLight;
  contactShadow: THREE.Mesh;
}

export function createLightingRig(
  config: LightingThemeConfig,
  scene: THREE.Scene
): LightingRigNodes {
  const group = new THREE.Group();
  group.name = 'LightingRig';

  // 1. Ambient & Hemisphere Light
  const ambientLight = new THREE.AmbientLight(
    new THREE.Color(config.ambientColor),
    config.ambientIntensity
  );
  group.add(ambientLight);

  const hemiLight = new THREE.HemisphereLight(
    new THREE.Color(config.keyColor),
    new THREE.Color(config.fillColor),
    0.35
  );
  group.add(hemiLight);

  // 2. Key Light (Optimized 1024x1024 shadow map)
  const keyLight = new THREE.DirectionalLight(
    new THREE.Color(config.keyColor),
    config.keyIntensity
  );
  keyLight.position.set(4.0, 6.0, 4.5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  keyLight.shadow.camera.near = 1.0;
  keyLight.shadow.camera.far = 16;
  keyLight.shadow.camera.left = -3.0;
  keyLight.shadow.camera.right = 3.0;
  keyLight.shadow.camera.top = 3.0;
  keyLight.shadow.camera.bottom = -3.0;
  keyLight.shadow.bias = -0.0003;
  keyLight.shadow.radius = 2.0;
  group.add(keyLight);

  // 3. Fill Light (Soft cool bounce, 0 shadow overhead)
  const fillLight = new THREE.DirectionalLight(
    new THREE.Color(config.fillColor),
    config.fillIntensity
  );
  fillLight.position.set(-4.5, 2.5, 3.0);
  fillLight.castShadow = false;
  group.add(fillLight);

  // 4. Rim Light (Champagne silhouette accent)
  const rimLight = new THREE.DirectionalLight(
    new THREE.Color(config.rimColor),
    config.rimIntensity
  );
  rimLight.position.set(2.5, 4.5, -4.0);
  rimLight.castShadow = false;
  group.add(rimLight);

  // 5. Lightweight Contact Shadow Disc (128x128 radial texture)
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 128;
  shadowCanvas.height = 128;
  const sCtx = shadowCanvas.getContext('2d');
  if (sCtx) {
    const grad = sCtx.createRadialGradient(64, 64, 10, 64, 64, 64);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
    grad.addColorStop(0.4, 'rgba(0, 0, 0, 0.4)');
    grad.addColorStop(0.8, 'rgba(0, 0, 0, 0.1)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 128, 128);
  }
  const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
  shadowTexture.generateMipmaps = false;
  shadowTexture.minFilter = THREE.LinearFilter;

  const shadowGeo = new THREE.PlaneGeometry(5.0, 5.0);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTexture,
    transparent: true,
    opacity: 0.65,
    depthWrite: false,
  });
  const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.y = -0.91;
  group.add(contactShadow);

  // 6. Exponential Fog
  scene.fog = new THREE.FogExp2(
    new THREE.Color(config.fogColor),
    config.fogDensity
  );

  return {
    group,
    keyLight,
    fillLight,
    rimLight,
    ambientLight,
    hemiLight,
    contactShadow,
  };
}

export function updateLightingRig(
  rig: LightingRigNodes,
  config: LightingThemeConfig,
  scene: THREE.Scene
): void {
  rig.keyLight.color.set(config.keyColor);
  rig.keyLight.intensity = config.keyIntensity;

  rig.fillLight.color.set(config.fillColor);
  rig.fillLight.intensity = config.fillIntensity;

  rig.rimLight.color.set(config.rimColor);
  rig.rimLight.intensity = config.rimIntensity;

  rig.ambientLight.color.set(config.ambientColor);
  rig.ambientLight.intensity = config.ambientIntensity;

  rig.hemiLight.color.set(config.keyColor);
  rig.hemiLight.groundColor.set(config.fillColor);

  if (scene.fog && scene.fog instanceof THREE.FogExp2) {
    scene.fog.color.set(config.fogColor);
    scene.fog.density = config.fogDensity;
  }
}
