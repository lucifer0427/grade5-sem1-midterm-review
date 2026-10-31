// kit.js: 共享幾何體庫、材質調色盤與 GC 零配置向量池
import * as THREE from 'three';

// 1. 全域共享變數池 (Zero GC Pool: 嚴禁在迴圈內 new Vector3)
export const Pool = {
  v0: new THREE.Vector3(),
  v1: new THREE.Vector3(),
  v2: new THREE.Vector3(),
  q0: new THREE.Quaternion(),
  m0: new THREE.Matrix4(),
  color0: new THREE.Color(),
  raycaster: new THREE.Raycaster(),
  mouse: new THREE.Vector2()
};

// 2. 幾何原語快取池
export const GeoPool = {
  box: new THREE.BoxGeometry(1, 1, 1),
  hexCylinder: new THREE.CylinderGeometry(1, 1, 1, 6),
  cylinder: new THREE.CylinderGeometry(1, 1, 1, 16),
  cone: new THREE.ConeGeometry(1, 1, 16),
  sphere: new THREE.SphereGeometry(1, 16, 16),
  lowSphere: new THREE.SphereGeometry(1, 8, 8),
  torus: new THREE.TorusGeometry(1, 0.2, 8, 24)
};

// 3. 學童清新明亮材質調色盤
export const Materials = {
  // 海面水體
  sea: new THREE.MeshLambertMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.85
  }),
  // 六角地塊基座 (草地/泥土)
  grass: new THREE.MeshLambertMaterial({ color: 0x86efac }),
  dirt: new THREE.MeshLambertMaterial({ color: 0xb45309 }),
  darkRock: new THREE.MeshLambertMaterial({ color: 0x334155 }),
  sandRim: new THREE.MeshLambertMaterial({ color: 0xfef08a }),
  rock: new THREE.MeshLambertMaterial({ color: 0x94a3b8 }),
  path: new THREE.MeshLambertMaterial({ color: 0xfde68a }),
  bridge: new THREE.MeshLambertMaterial({ color: 0xfcd34d }),

  // 白雲與浪花
  cloud: new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.92 }),
  foam: new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 }),

  // 窗戶與微縮夜景發光
  windowGlow: new THREE.MeshBasicMaterial({ color: 0xfef08a }),
  flowerPink: new THREE.MeshLambertMaterial({ color: 0xf472b6 }),
  flowerYellow: new THREE.MeshLambertMaterial({ color: 0xfde047 }),
  flowerBlue: new THREE.MeshLambertMaterial({ color: 0x60a5fa }),

  // 學科代表色 (建築主體)
  math: new THREE.MeshLambertMaterial({ color: 0x3b82f6 }),
  mathAccent: new THREE.MeshLambertMaterial({ color: 0x60a5fa }),
  english: new THREE.MeshLambertMaterial({ color: 0xeab308 }),
  englishAccent: new THREE.MeshLambertMaterial({ color: 0xfacc15 }),
  science: new THREE.MeshLambertMaterial({ color: 0x10b981 }),
  scienceAccent: new THREE.MeshLambertMaterial({ color: 0x34d399 }),
  social: new THREE.MeshLambertMaterial({ color: 0xf97316 }),
  socialAccent: new THREE.MeshLambertMaterial({ color: 0xfb923c }),
  chinese: new THREE.MeshLambertMaterial({ color: 0x8b5cf6 }),
  chineseAccent: new THREE.MeshLambertMaterial({ color: 0xa78bfa }),
  center: new THREE.MeshLambertMaterial({ color: 0xec4899 }),
  centerAccent: new THREE.MeshLambertMaterial({ color: 0xf43f5e }),

  // 建築細節材質
  whiteWall: new THREE.MeshLambertMaterial({ color: 0xf8fafc }),
  roofRed: new THREE.MeshLambertMaterial({ color: 0xef4444 }),
  roofBlue: new THREE.MeshLambertMaterial({ color: 0x2563eb }),
  roofOrange: new THREE.MeshLambertMaterial({ color: 0xea580c }),
  wood: new THREE.MeshLambertMaterial({ color: 0x78350f }),
  gold: new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    metalness: 0.6,
    roughness: 0.3
  }),
  glass: new THREE.MeshStandardMaterial({
    color: 0xa5f3fc,
    transparent: true,
    opacity: 0.5,
    roughness: 0.1
  }),

  // 發光粒子與光柱
  beaconGlow: new THREE.MeshBasicMaterial({
    color: 0xfde047,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
  }),
  neonPink: new THREE.MeshBasicMaterial({
    color: 0xff2a85,
    transparent: true,
    opacity: 0.9
  }),
  neonCyan: new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.9
  })
};

// 4. 程序化六角頂點計算
export const SQ3 = Math.sqrt(3);

export function hexVertex(radius, i) {
  const angle = (Math.PI / 3) * i - Math.PI / 6;
  return {
    x: radius * Math.cos(angle),
    z: radius * Math.sin(angle)
  };
}
