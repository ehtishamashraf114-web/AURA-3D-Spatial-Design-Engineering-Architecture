import * as THREE from 'three';
import { MaterialThemeConfig } from '../../types/scene';
import {
  createBrushedMetalTexture,
  createStoneRoughnessTexture,
  createArchitecturalFloorTexture,
} from '../../utils/proceduralTextures';

export interface InstallationNodes {
  group: THREE.Group;
  sculptureCore: THREE.Mesh;
  gyroscopeOuter: THREE.Group;
  gyroscopeMiddle: THREE.Group;
  gyroscopeInner: THREE.Group;
  floatingPolyhedron: THREE.Mesh;
  glassFins: THREE.Mesh[];
  plinthMesh: THREE.Mesh;
  floorMesh: THREE.Mesh;
  coveRingMesh: THREE.Mesh;
  coveLight: THREE.PointLight;
  materials: {
    primaryMetal: THREE.MeshPhysicalMaterial;
    secondaryMetal: THREE.MeshPhysicalMaterial;
    accentMetal: THREE.MeshPhysicalMaterial;
    stone: THREE.MeshStandardMaterial;
    glass: THREE.MeshPhysicalMaterial;
    coreLight: THREE.MeshStandardMaterial;
    floor: THREE.MeshStandardMaterial;
  };
}

export function createArchitecturalInstallation(
  theme: MaterialThemeConfig,
  envMap: THREE.Texture | null
): InstallationNodes {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'ArchitecturalInstallation';

  // Generate lightweight procedural textures
  const brushedTexture = createBrushedMetalTexture(256, 256);
  const stoneRoughness = createStoneRoughnessTexture(256, 256);
  const floorTexture = createArchitecturalFloorTexture(512, 512);

  // 1. Materials setup (Physically Based Rendering without expensive transmission passes)
  const primaryMetal = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(theme.primaryMetalColor),
    metalness: 0.92,
    roughness: 0.22,
    roughnessMap: brushedTexture,
    clearcoat: 0.3,
    clearcoatRoughness: 0.15,
    envMap: envMap,
    envMapIntensity: 1.3,
  });

  const secondaryMetal = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(theme.secondaryMetalColor),
    metalness: 0.95,
    roughness: 0.28,
    roughnessMap: brushedTexture,
    envMap: envMap,
    envMapIntensity: 1.1,
  });

  const accentMetal = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(theme.accentMetalColor),
    metalness: 0.95,
    roughness: 0.22,
    clearcoat: 0.4,
    clearcoatRoughness: 0.1,
    envMap: envMap,
    envMapIntensity: 1.4,
  });

  const stone = new THREE.MeshStandardMaterial({
    color: new THREE.Color(theme.stoneColor),
    roughness: 0.85,
    roughnessMap: stoneRoughness,
    metalness: 0.08,
    envMap: envMap,
    envMapIntensity: 0.3,
  });

  // Fast dielectric glass using clearcoat and transparency (0 extra render passes)
  const glass = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(theme.glassColor),
    transparent: true,
    opacity: 0.28,
    roughness: 0.06,
    metalness: 0.08,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
    envMap: envMap,
    envMapIntensity: 2.2,
  });

  const coreLight = new THREE.MeshStandardMaterial({
    color: new THREE.Color(theme.coreGlowColor),
    emissive: new THREE.Color(theme.coreGlowColor),
    emissiveIntensity: 0.8,
    roughness: 0.2,
    metalness: 0.8,
    envMap: envMap,
  });

  const floor = new THREE.MeshStandardMaterial({
    map: floorTexture,
    roughness: 0.7,
    metalness: 0.2,
    envMap: envMap,
    envMapIntensity: 0.4,
  });

  // 2. Base & Display Platform
  const floorGeo = new THREE.CircleGeometry(6.0, 32);
  const floorMesh = new THREE.Mesh(floorGeo, floor);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.y = -0.92;
  floorMesh.receiveShadow = true;
  rootGroup.add(floorMesh);

  // Stepped Plinth Substructure
  const plinthGroup = new THREE.Group();
  plinthGroup.position.y = -0.9;

  // Tier 1 (Lower disc)
  const tier1Geo = new THREE.CylinderGeometry(2.3, 2.4, 0.12, 32);
  const tier1Mesh = new THREE.Mesh(tier1Geo, stone);
  tier1Mesh.position.y = 0.06;
  tier1Mesh.receiveShadow = true;
  tier1Mesh.castShadow = true;
  plinthGroup.add(tier1Mesh);

  // Tier 2 (Brass reveal spacer)
  const spacerGeo = new THREE.CylinderGeometry(2.25, 2.25, 0.03, 32);
  const spacerMesh = new THREE.Mesh(spacerGeo, accentMetal);
  spacerMesh.position.y = 0.135;
  plinthGroup.add(spacerMesh);

  // Tier 3 (Fluted basalt column)
  const flutedGeo = new THREE.CylinderGeometry(1.65, 1.72, 0.45, 32);
  const plinthMesh = new THREE.Mesh(flutedGeo, stone);
  plinthMesh.position.y = 0.375;
  plinthMesh.receiveShadow = true;
  plinthMesh.castShadow = true;
  plinthGroup.add(plinthMesh);

  // Optimized single InstancedMesh for 24 fluting ridges (1 draw call instead of 24!)
  const flutesCount = 24;
  const fluteGeo = new THREE.BoxGeometry(0.04, 0.42, 0.06);
  const flutesInstanced = new THREE.InstancedMesh(fluteGeo, secondaryMetal, flutesCount);
  const dummy = new THREE.Object3D();

  for (let i = 0; i < flutesCount; i++) {
    const angle = (i * Math.PI * 2) / flutesCount;
    const r = 1.68;
    dummy.position.set(Math.cos(angle) * r, 0.375, Math.sin(angle) * r);
    dummy.rotation.set(0, -angle, 0);
    dummy.updateMatrix();
    flutesInstanced.setMatrixAt(i, dummy.matrix);
  }
  flutesInstanced.instanceMatrix.needsUpdate = true;
  plinthGroup.add(flutesInstanced);

  // Cove light ring
  const coveRingGeo = new THREE.TorusGeometry(1.66, 0.02, 8, 32);
  const coveRingMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(theme.accentMetalColor),
  });
  const coveRingMesh = new THREE.Mesh(coveRingGeo, coveRingMat);
  coveRingMesh.rotation.x = Math.PI / 2;
  coveRingMesh.position.y = 0.6;
  plinthGroup.add(coveRingMesh);

  // Crown plate
  const crownGeo = new THREE.CylinderGeometry(1.4, 1.48, 0.08, 32);
  const crownMesh = new THREE.Mesh(crownGeo, primaryMetal);
  crownMesh.position.y = 0.64;
  crownMesh.receiveShadow = true;
  crownMesh.castShadow = true;
  plinthGroup.add(crownMesh);

  // Cantilevered side monolith slabs
  const slabGeo = new THREE.BoxGeometry(0.35, 0.8, 1.6);
  const slabLeft = new THREE.Mesh(slabGeo, stone);
  slabLeft.position.set(-2.2, 0.4, -0.6);
  slabLeft.rotation.y = 0.25;
  slabLeft.castShadow = true;
  slabLeft.receiveShadow = true;
  plinthGroup.add(slabLeft);

  const slabRight = new THREE.Mesh(slabGeo, stone);
  slabRight.position.set(2.3, 0.3, -0.8);
  slabRight.rotation.y = -0.3;
  slabRight.castShadow = true;
  slabRight.receiveShadow = true;
  plinthGroup.add(slabRight);

  rootGroup.add(plinthGroup);

  // Recessed Cove Point Light
  const coveLight = new THREE.PointLight(new THREE.Color(theme.accentMetalColor), 1.0, 3.0, 2.0);
  coveLight.position.set(0, -0.28, 0);
  rootGroup.add(coveLight);

  // 3. Central Sculptural Monolith (Optimized knot geometry)
  const sculptureCoreGeo = new THREE.TorusKnotGeometry(0.72, 0.18, 80, 24, 2, 3);
  const sculptureCore = new THREE.Mesh(sculptureCoreGeo, primaryMetal);
  sculptureCore.position.set(0, 0.85, 0);
  sculptureCore.castShadow = true;
  sculptureCore.receiveShadow = true;
  rootGroup.add(sculptureCore);

  // Internal geometric polyhedron
  const polyhedronGeo = new THREE.IcosahedronGeometry(0.3, 0);
  const floatingPolyhedron = new THREE.Mesh(polyhedronGeo, coreLight);
  floatingPolyhedron.position.set(0, 0.85, 0);
  rootGroup.add(floatingPolyhedron);

  // 4. Concentric Gyroscopic Rings (64 segments)
  const gyroscopeOuter = new THREE.Group();
  gyroscopeOuter.position.set(0, 0.85, 0);
  const outerRingGeo = new THREE.TorusGeometry(1.26, 0.02, 12, 64);
  const outerRingMesh = new THREE.Mesh(outerRingGeo, secondaryMetal);
  outerRingMesh.castShadow = true;
  gyroscopeOuter.add(outerRingMesh);
  rootGroup.add(gyroscopeOuter);

  const gyroscopeMiddle = new THREE.Group();
  gyroscopeMiddle.position.set(0, 0.85, 0);
  const middleRingGeo = new THREE.TorusGeometry(1.06, 0.016, 12, 64);
  const middleRingMesh = new THREE.Mesh(middleRingGeo, accentMetal);
  middleRingMesh.castShadow = true;
  gyroscopeMiddle.add(middleRingMesh);
  rootGroup.add(gyroscopeMiddle);

  const gyroscopeInner = new THREE.Group();
  gyroscopeInner.position.set(0, 0.85, 0);
  const innerRingGeo = new THREE.TorusGeometry(0.88, 0.013, 12, 64);
  const innerRingMesh = new THREE.Mesh(innerRingGeo, primaryMetal);
  innerRingMesh.castShadow = true;
  gyroscopeInner.add(innerRingMesh);
  rootGroup.add(gyroscopeInner);

  // 5. Dielectric Glass Fins
  const glassFins: THREE.Mesh[] = [];
  const glassFinCount = 4;
  const finGeo = new THREE.BoxGeometry(0.06, 1.45, 0.4);

  for (let i = 0; i < glassFinCount; i++) {
    const angle = (i * Math.PI * 2) / glassFinCount + Math.PI / 4;
    const distance = 1.45;
    const finMesh = new THREE.Mesh(finGeo, glass);
    finMesh.position.set(Math.cos(angle) * distance, 0.85, Math.sin(angle) * distance);
    finMesh.rotation.y = -angle + 0.35;
    finMesh.castShadow = true;

    rootGroup.add(finMesh);
    glassFins.push(finMesh);
  }

  return {
    group: rootGroup,
    sculptureCore,
    gyroscopeOuter,
    gyroscopeMiddle,
    gyroscopeInner,
    floatingPolyhedron,
    glassFins,
    plinthMesh,
    floorMesh,
    coveRingMesh,
    coveLight,
    materials: {
      primaryMetal,
      secondaryMetal,
      accentMetal,
      stone,
      glass,
      coreLight,
      floor,
    },
  };
}

export function updateInstallationMaterials(
  nodes: InstallationNodes,
  theme: MaterialThemeConfig
): void {
  const { materials, coveRingMesh, coveLight } = nodes;

  materials.primaryMetal.color.set(theme.primaryMetalColor);
  materials.secondaryMetal.color.set(theme.secondaryMetalColor);
  materials.accentMetal.color.set(theme.accentMetalColor);
  materials.stone.color.set(theme.stoneColor);
  materials.glass.color.set(theme.glassColor);
  materials.coreLight.color.set(theme.coreGlowColor);
  materials.coreLight.emissive.set(theme.coreGlowColor);

  (coveRingMesh.material as THREE.MeshBasicMaterial).color.set(theme.accentMetalColor);
  coveLight.color.set(theme.accentMetalColor);
}
