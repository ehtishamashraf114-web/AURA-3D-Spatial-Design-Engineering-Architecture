import * as THREE from 'three';

/**
 * Ultra-lightweight procedural texture generators
 * Optimized for instant execution (<2ms) and low GPU memory footprint.
 */

// Procedural brushed metal texture (256x256 lightweight)
export function createBrushedMetalTexture(width = 256, height = 256): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#7A7A7A';
    ctx.fillRect(0, 0, width, height);

    // Fast linear brushed streaks
    for (let i = 0; i < 600; i++) {
      const y = Math.random() * height;
      const alpha = Math.random() * 0.12 + 0.04;
      const len = Math.random() * width * 0.7 + width * 0.3;
      const x = Math.random() * width - len * 0.5;
      const shade = Math.random() > 0.5 ? 230 : 50;

      ctx.fillStyle = `rgba(${shade}, ${shade}, ${shade}, ${alpha})`;
      ctx.fillRect(x, y, len, 1.5);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

// Procedural dark basalt stone bump texture (256x256 fast noise)
export function createStoneRoughnessTexture(width = 256, height = 256): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#1A1D24';
    ctx.fillRect(0, 0, width, height);

    // Fast speckle noise
    for (let i = 0; i < 2000; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 2 + 1;
      const alpha = Math.random() * 0.15 + 0.05;
      const shade = Math.random() > 0.5 ? 200 : 30;
      ctx.fillStyle = `rgba(${shade}, ${shade}, ${shade}, ${alpha})`;
      ctx.fillRect(x, y, size, size);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

// Radial architectural floor grid texture (512x512)
export function createArchitecturalFloorTexture(width = 512, height = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#0B0C10';
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    // Concentric precision brass/expansion rings
    const ringRadii = [45, 90, 140, 195, 240];
    ringRadii.forEach((r) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    });

    // Radial quadrant division lines
    const rays = 12;
    for (let i = 0; i < rays; i++) {
      const angle = (i * Math.PI * 2) / rays;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * 40, cy + Math.sin(angle) * 40);
      ctx.lineTo(cx + Math.cos(angle) * 245, cy + Math.sin(angle) * 245);
      ctx.strokeStyle = i % 3 === 0 ? 'rgba(212, 175, 55, 0.16)' : 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

// Lightweight Studio Equirectangular Environment Map (512x256)
export function createStudioEnvironmentMap(renderer: THREE.WebGLRenderer): THREE.WebGLRenderTarget {
  const width = 512;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Dark studio base gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#161822');
    bgGrad.addColorStop(0.5, '#0C0D12');
    bgGrad.addColorStop(1, '#040507');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Warm Key Softbox
    const softbox1 = ctx.createRadialGradient(width * 0.35, height * 0.28, 5, width * 0.35, height * 0.28, 120);
    softbox1.addColorStop(0, 'rgba(255, 245, 230, 0.95)');
    softbox1.addColorStop(0.4, 'rgba(240, 225, 200, 0.45)');
    softbox1.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = softbox1;
    ctx.fillRect(0, 0, width, height);

    // Champagne Rim Softbox
    const softbox2 = ctx.createRadialGradient(width * 0.82, height * 0.32, 5, width * 0.82, height * 0.32, 100);
    softbox2.addColorStop(0, 'rgba(255, 220, 160, 0.85)');
    softbox2.addColorStop(0.5, 'rgba(212, 175, 55, 0.3)');
    softbox2.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = softbox2;
    ctx.fillRect(0, 0, width, height);

    // Cool Fill Softbox
    const softbox3 = ctx.createRadialGradient(width * 0.12, height * 0.35, 5, width * 0.12, height * 0.35, 110);
    softbox3.addColorStop(0, 'rgba(170, 195, 225, 0.55)');
    softbox3.addColorStop(0.5, 'rgba(100, 130, 165, 0.12)');
    softbox3.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = softbox3;
    ctx.fillRect(0, 0, width, height);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.needsUpdate = true;

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  const renderTarget = pmremGenerator.fromEquirectangular(texture);

  texture.dispose();
  pmremGenerator.dispose();

  return renderTarget;
}
