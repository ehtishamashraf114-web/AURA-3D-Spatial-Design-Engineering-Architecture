import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  CameraPresetId,
  Hotspot,
  LightingMoodId,
  MaterialPresetId,
} from '../../types/scene';
import {
  CAMERA_PRESETS,
  HOTSPOTS,
  LIGHTING_THEMES,
  MATERIAL_THEMES,
} from '../../data/sceneConfig';
import {
  createArchitecturalInstallation,
  updateInstallationMaterials,
  InstallationNodes,
} from './ArchitecturalInstallation';
import {
  createLightingRig,
  updateLightingRig,
  LightingRigNodes,
} from './LightingRig';
import { createStudioEnvironmentMap } from '../../utils/proceduralTextures';

interface SceneCanvasProps {
  materialPreset: MaterialPresetId;
  lightingMood: LightingMoodId;
  cameraPreset: CameraPresetId;
  activeHotspotId: string | null;
  onSelectHotspot: (hotspot: Hotspot | null) => void;
  isInspecting: boolean;
  reducedMotion: boolean;
}

export const SceneCanvas: React.FC<SceneCanvasProps> = ({
  materialPreset,
  lightingMood,
  cameraPreset,
  activeHotspotId,
  onSelectHotspot,
  isInspecting,
  reducedMotion,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const [hotspotScreenCoords, setHotspotScreenCoords] = useState<
    { id: string; x: number; y: number; visible: boolean }[]
  >([]);

  // Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const installationRef = useRef<InstallationNodes | null>(null);
  const lightingRigRef = useRef<LightingRigNodes | null>(null);
  const envMapTargetRef = useRef<THREE.WebGLRenderTarget | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const reqIdRef = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(true);

  // Interaction tracking with high-precision damping
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollRef = useRef({ current: 0, target: 0 });
  const dragRef = useRef({
    isDragging: false,
    prevX: 0,
    prevY: 0,
    rotX: 0,
    rotY: 0,
    targetRotX: 0,
    targetRotY: 0,
    velocityX: 0,
    velocityY: 0,
  });

  // Reusable vectors to avoid garbage collection lag in render loop
  const tempVec1 = useRef(new THREE.Vector3());
  const tempVec2 = useRef(new THREE.Vector3());
  const tempIntroVec = useRef(new THREE.Vector3(0, 3.8, 8.5));

  // Cinematic intro animation timestamp
  const introStartTimeRef = useRef<number | null>(null);

  // Camera animation target
  const camAnimRef = useRef({
    currentPos: new THREE.Vector3(0, 3.8, 8.5),
    targetPos: new THREE.Vector3(0, 1.8, 5.2),
    currentLookAt: new THREE.Vector3(0, 0.4, 0),
    targetLookAt: new THREE.Vector3(0, 0.4, 0),
    currentFov: 40,
    targetFov: 38,
  });

  // Scroll listener for dynamic 3D camera choreography
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const maxScroll = Math.max(
            1,
            document.documentElement.scrollHeight - window.innerHeight
          );
          scrollRef.current.target = Math.min(
            1,
            Math.max(0, window.scrollY / maxScroll)
          );
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update camera targets based on cameraPreset or activeHotspot
  useEffect(() => {
    if (activeHotspotId) {
      const spot = HOTSPOTS.find((h) => h.id === activeHotspotId);
      if (spot) {
        camAnimRef.current.targetPos.set(...spot.cameraPosition);
        camAnimRef.current.targetLookAt.set(...spot.cameraTarget);
        camAnimRef.current.targetFov = 30;
        return;
      }
    }

    const preset = CAMERA_PRESETS[cameraPreset] || CAMERA_PRESETS.hero;
    camAnimRef.current.targetPos.set(...preset.position);
    camAnimRef.current.targetLookAt.set(...preset.target);
    camAnimRef.current.targetFov = preset.fov;
  }, [cameraPreset, activeHotspotId]);

  // Update Materials when materialPreset changes
  useEffect(() => {
    if (installationRef.current) {
      const theme = MATERIAL_THEMES[materialPreset];
      if (theme) {
        updateInstallationMaterials(installationRef.current, theme);
      }
    }
  }, [materialPreset]);

  // Update Lighting when lightingMood changes
  useEffect(() => {
    if (lightingRigRef.current && sceneRef.current) {
      const config = LIGHTING_THEMES[lightingMood];
      if (config) {
        updateLightingRig(lightingRigRef.current, config, sceneRef.current);
      }
    }
  }, [lightingMood]);

  // Pointer move handler with smooth parallax
  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (dragRef.current.isDragging) {
      const deltaX = e.clientX - dragRef.current.prevX;
      const deltaY = e.clientY - dragRef.current.prevY;
      dragRef.current.prevX = e.clientX;
      dragRef.current.prevY = e.clientY;

      dragRef.current.velocityX = deltaX * 0.005;
      dragRef.current.velocityY = deltaY * 0.004;

      dragRef.current.targetRotY += dragRef.current.velocityX;
      dragRef.current.targetRotX = Math.max(
        -0.45,
        Math.min(0.65, dragRef.current.targetRotX + dragRef.current.velocityY)
      );
    } else {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.targetX = nx;
      mouseRef.current.targetY = ny;
    }
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    dragRef.current.isDragging = true;
    dragRef.current.prevX = e.clientX;
    dragRef.current.prevY = e.clientY;
    dragRef.current.velocityX = 0;
    dragRef.current.velocityY = 0;
  }, []);

  const handlePointerUp = useCallback(() => {
    dragRef.current.isDragging = false;
  }, []);

  // Initialize Three.js WebGL scene
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(LIGHTING_THEMES[lightingMood].fogColor);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 40);
    camera.position.set(0, 3.8, 8.5);
    camera.lookAt(0, 0.4, 0);
    cameraRef.current = camera;

    // 3. Renderer setup (Optimized for maximum FPS & low GPU load)
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
      stencil: false,
      depth: true,
    });
    rendererRef.current = renderer;

    renderer.setSize(width, height);
    // Cap pixel ratio to 1.5 to prevent GPU bottleneck on Retina/4K
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // WebGL Context Loss listeners
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      cancelAnimationFrame(reqIdRef.current);
      setContextLost(true);
    };

    const handleContextRestored = () => {
      setContextLost(false);
      window.location.reload();
    };

    canvas.addEventListener('webglcontextlost', handleContextLost, false);
    canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

    // 4. Studio Environment Map (lightweight 512x256)
    try {
      const envTarget = createStudioEnvironmentMap(renderer);
      envMapTargetRef.current = envTarget;
      scene.environment = envTarget.texture;
    } catch {
      scene.environment = null;
    }

    // 5. Lighting Setup
    const lightingRig = createLightingRig(
      LIGHTING_THEMES[lightingMood],
      scene
    );
    lightingRigRef.current = lightingRig;
    scene.add(lightingRig.group);

    // 6. Architectural Installation
    const installation = createArchitecturalInstallation(
      MATERIAL_THEMES[materialPreset],
      scene.environment
    );
    installationRef.current = installation;
    scene.add(installation.group);

    // 7. Ambient Floating Dust Particles (Optimized count: 50 particles)
    const particleCount = 50;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 6.0;
      particlePositions[i * 3 + 1] = Math.random() * 4.0 - 0.4;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 6.0;

      particleSpeeds[i * 3] = (Math.random() - 0.5) * 0.04;
      particleSpeeds[i * 3 + 1] = Math.random() * 0.06 + 0.02;
      particleSpeeds[i * 3 + 2] = (Math.random() - 0.5) * 0.04;
    }

    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3)
    );

    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d');
    if (pCtx) {
      const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 235, 180, 0.95)');
      grad.addColorStop(0.4, 'rgba(215, 180, 110, 0.4)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, 32, 32);
    }
    const pTexture = new THREE.CanvasTexture(pCanvas);
    pTexture.generateMipmaps = false;
    pTexture.minFilter = THREE.LinearFilter;

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.08,
      map: pTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.6,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    particlesRef.current = particles;
    scene.add(particles);

    setIsLoaded(true);

    // 8. Visibility & Intersection Observer (Pause rendering when offscreen or tab inactive)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 9. Animation & Render Loop with Exponential Damping
    let lastTime = performance.now();

    const renderLoop = (time: number) => {
      reqIdRef.current = requestAnimationFrame(renderLoop);

      // Skip render if off-screen or tab is hidden to save 100% of GPU resources
      if (!isVisibleRef.current) {
        lastTime = time;
        return;
      }

      const delta = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      // Cinematic intro fly-in calculation
      if (introStartTimeRef.current === null) {
        introStartTimeRef.current = time;
      }
      const introElapsed = (time - introStartTimeRef.current) / 1000;
      const introProgress = Math.min(1, introElapsed / 2.4);
      const easeIntro = 1 - Math.pow(1 - introProgress, 3);

      // Smooth scroll interpolation
      scrollRef.current.current +=
        (scrollRef.current.target - scrollRef.current.current) * 0.06;
      const scrollNorm = scrollRef.current.current;

      // Mouse Parallax with smooth factor
      const parallaxFactor = reducedMotion ? 0.0 : 0.045;
      mouseRef.current.x +=
        (mouseRef.current.targetX - mouseRef.current.x) * parallaxFactor;
      mouseRef.current.y +=
        (mouseRef.current.targetY - mouseRef.current.y) * parallaxFactor;

      // Drag inertia
      if (!dragRef.current.isDragging) {
        dragRef.current.velocityX *= 0.94;
        dragRef.current.velocityY *= 0.94;
        dragRef.current.targetRotY += dragRef.current.velocityX;
        dragRef.current.targetRotX += dragRef.current.velocityY;
      }
      dragRef.current.rotX +=
        (dragRef.current.targetRotX - dragRef.current.rotX) * 0.075;
      dragRef.current.rotY +=
        (dragRef.current.targetRotY - dragRef.current.rotY) * 0.075;

      // Update particles
      if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3 + 1] += particleSpeeds[i * 3 + 1] * delta;
          if (positions[i * 3 + 1] > 3.6) {
            positions[i * 3 + 1] = -0.5;
          }
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Rotate installation and apply kinetic fluid motion
      if (installationRef.current) {
        const {
          group,
          sculptureCore,
          gyroscopeOuter,
          gyroscopeMiddle,
          gyroscopeInner,
          floatingPolyhedron,
        } = installationRef.current;

        // Apply drag rotation + scroll twist
        const scrollRotation = scrollNorm * Math.PI * 0.4;
        group.rotation.y = dragRef.current.rotY + scrollRotation;
        group.rotation.x = dragRef.current.rotX;

        // Kinetic motion
        const speedMultiplier = reducedMotion ? 0.12 : 1.0;
        gyroscopeOuter.rotation.y += delta * 0.28 * speedMultiplier;
        gyroscopeMiddle.rotation.x += delta * 0.36 * speedMultiplier;
        gyroscopeInner.rotation.z += delta * 0.48 * speedMultiplier;

        sculptureCore.rotation.y += delta * 0.16 * speedMultiplier;
        sculptureCore.rotation.z = Math.sin(time * 0.0009) * 0.07;
        sculptureCore.position.y = 0.85 + Math.sin(time * 0.0012) * 0.02;

        floatingPolyhedron.rotation.x += delta * 0.55 * speedMultiplier;
        floatingPolyhedron.rotation.y += delta * 0.45 * speedMultiplier;
        floatingPolyhedron.position.y =
          0.85 + Math.sin(time * 0.0018) * 0.04;
      }

      // Smooth Camera Animation using pre-allocated vectors (Zero GC pauses)
      if (cameraRef.current) {
        const cam = cameraRef.current;
        const anim = camAnimRef.current;

        tempVec1.current.copy(anim.targetPos);
        tempVec2.current.copy(anim.targetLookAt);

        if (scrollNorm > 0.05 && !activeHotspotId) {
          tempVec1.current.y += scrollNorm * 1.3;
          tempVec1.current.x += Math.sin(scrollNorm * Math.PI) * 1.6;
          tempVec1.current.z += scrollNorm * 0.9;
          tempVec2.current.y += scrollNorm * 0.25;
        }

        // Apply intro flight blend
        tempIntroVec.current.set(0, 3.8, 8.5).lerp(tempVec1.current, easeIntro);

        // Exponential smoothing on position and lookAt
        const dampFactor = 1 - Math.exp(-6.5 * delta);
        anim.currentPos.lerp(tempIntroVec.current, dampFactor);
        cam.position.copy(anim.currentPos);

        // Parallax cursor influence
        if (!reducedMotion) {
          cam.position.x += mouseRef.current.x * 0.38;
          cam.position.y += mouseRef.current.y * 0.26;
        }

        anim.currentLookAt.lerp(tempVec2.current, dampFactor);
        cam.lookAt(anim.currentLookAt);

        // Field-of-view smoothing
        if (Math.abs(cam.fov - anim.targetFov) > 0.05) {
          cam.fov += (anim.targetFov - cam.fov) * dampFactor;
          cam.updateProjectionMatrix();
        }

        // Project 3D Hotspots to 2D Screen Coordinates (only when visible)
        if (containerRef.current) {
          const cWidth = containerRef.current.clientWidth;
          const cHeight = containerRef.current.clientHeight;

          const projected = HOTSPOTS.map((h) => {
            const v = new THREE.Vector3(...h.position);
            if (installationRef.current) {
              v.applyEuler(installationRef.current.group.rotation);
            }
            v.project(cam);

            const isFront = v.z < 1.0;
            const sx = (v.x * 0.5 + 0.5) * cWidth;
            const sy = (-(v.y * 0.5) + 0.5) * cHeight;

            return {
              id: h.id,
              x: sx,
              y: sy,
              visible:
                isFront &&
                sx >= 20 &&
                sx <= cWidth - 20 &&
                sy >= 20 &&
                sy <= cHeight - 20,
            };
          });

          setHotspotScreenCoords(projected);
        }
      }

      renderer.render(scene, camera);
    };

    reqIdRef.current = requestAnimationFrame(renderLoop);

    // 10. Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    window.addEventListener('pointermove', handlePointerMove);

    // 11. Cleanup
    return () => {
      cancelAnimationFrame(reqIdRef.current);
      resizeObserver.disconnect();
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);

      if (particlesRef.current) {
        particlesRef.current.geometry.dispose();
        (particlesRef.current.material as THREE.Material).dispose();
      }
      if (envMapTargetRef.current) {
        envMapTargetRef.current.dispose();
      }
      renderer.dispose();
    };
  }, [reducedMotion, lightingMood, materialPreset, handlePointerMove, activeHotspotId]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ touchAction: 'none' }}
    >
      <canvas
        ref={canvasRef}
        className={`w-full h-full transition-opacity duration-700 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${isInspecting ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
      />

      {/* Loading state indicator */}
      {!isLoaded && !contextLost && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#08090C] z-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-neutral-700 border-t-[#D4AF37] animate-spin" />
            <p className="text-[11px] uppercase tracking-widest text-neutral-400 font-sans">
              Initializing 3D Viewport...
            </p>
          </div>
        </div>
      )}

      {/* WebGL Context Lost Fallback */}
      {contextLost && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#08090C] p-6 z-30">
          <div className="max-w-md p-6 bg-neutral-900 border border-neutral-800 rounded-xl text-center">
            <h3 className="text-lg font-semibold text-white mb-2">
              Graphics Context Interrupted
            </h3>
            <p className="text-sm text-neutral-400 mb-4">
              Your device temporarily suspended the 3D WebGL renderer.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-neutral-100 text-neutral-900 text-xs font-semibold rounded hover:bg-white transition-colors"
            >
              Restore Experience
            </button>
          </div>
        </div>
      )}

      {/* 3D Hotspot Interactive Markers */}
      {isLoaded &&
        !contextLost &&
        hotspotScreenCoords.map((hCoord) => {
          if (!hCoord.visible) return null;
          const spot = HOTSPOTS.find((h) => h.id === hCoord.id);
          if (!spot) return null;
          const isActive = activeHotspotId === spot.id;

          return (
            <div
              key={spot.id}
              style={{
                transform: `translate3d(${hCoord.x}px, ${hCoord.y}px, 0)`,
              }}
              className="absolute top-0 left-0 -ml-4 -mt-4 pointer-events-auto z-10 transition-transform duration-75"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectHotspot(isActive ? null : spot);
                }}
                className={`group relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 focus:outline-none ${
                  isActive
                    ? 'bg-[#D4AF37] text-neutral-950 scale-110 shadow-lg shadow-[#D4AF37]/40 ring-4 ring-[#D4AF37]/20'
                    : 'bg-black/80 backdrop-blur-md border border-white/20 text-white/90 hover:border-[#D4AF37] hover:scale-105'
                }`}
                aria-label={`Inspect ${spot.title}`}
              >
                <span className="text-[10px] font-mono font-medium">
                  {spot.number}
                </span>

                {/* Hotspot tooltip label */}
                <div
                  className={`absolute left-10 whitespace-nowrap px-3 py-1.5 rounded-lg bg-black/90 backdrop-blur-md border border-white/15 text-[11px] text-white tracking-wide transition-all pointer-events-none shadow-xl ${
                    isActive
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                  }`}
                >
                  <span className="text-[#D4AF37] text-[9px] uppercase font-mono block">
                    {spot.category}
                  </span>
                  <span className="font-medium">{spot.title}</span>
                </div>
              </button>
            </div>
          );
        })}
    </div>
  );
};
