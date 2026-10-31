// world.js: 六角軸向座標系 (Axial (q,r))、島嶼生成與路徑拓撲
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { Pool, GeoPool, Materials, SQ3 } from './kit.js';

export const HEX_RADIUS = 22; // 六角外接圓半徑
export const HEX_HEIGHT = 8;  // 六角地塊高度

// 將軸向六角座標 (q, r) 轉換為 3D 世界座標 (X, Z)
export function axialToWorld(q, r, radius = HEX_RADIUS) {
  const x = radius * SQ3 * (q + r / 2);
  const z = radius * 1.5 * r;
  return { x, z };
}

// 六角距離計算
export function hexDistance(q1, r1, q2, r2) {
  return (Math.abs(q1 - q2) + Math.abs(q1 + r1 - q2 - r2) + Math.abs(r1 - r2)) / 2;
}

export class WorldManager {
  constructor(scene, curriculum) {
    this.scene = scene;
    this.curriculum = curriculum;
    this.islandGroup = new THREE.Group();
    this.buildingsGroup = new THREE.Group();
    this.bridgesGroup = new THREE.Group();
    this.beaconsGroup = new THREE.Group();
    this.badgesGroup = new THREE.Group();
    this.foamMesh = null; // 合併水面泡沫浪花網格
    
    this.interactiveObjects = []; // 提供 Raycaster 拾取
    this.buildingMeshes = new Map(); // id -> Mesh
    this.islandCenters = new Map(); // islandId -> {x, z}

    this.scene.add(this.islandGroup);
    this.scene.add(this.buildingsGroup);
    this.scene.add(this.bridgesGroup);
    this.scene.add(this.beaconsGroup);
    this.scene.add(this.badgesGroup);
  }

  buildWorld() {
    this.buildIslands();
    this.buildBridges();
  }

  buildIslands() {
    const baseGeos = [];
    const grassGeos = [];
    const centerGeos = [];
    const rimGeos = [];
    const foamGeos = [];

    const rotQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 6);
    const m = new THREE.Matrix4();

    this.curriculum.islands.forEach(island => {
      const isCenter = island.id === 'center';

      // 計算島嶼中心座標 (平均值)
      let sumX = 0, sumZ = 0;
      const count = island.cells.length;

      island.cells.forEach(([q, r]) => {
        const { x, z } = axialToWorld(q, r);
        sumX += x;
        sumZ += z;

        // 1. 六角底層岩石基座 (深色岩壁)
        const baseH = HEX_HEIGHT * 0.7;
        m.compose(
          new THREE.Vector3(x, baseH / 2, z),
          rotQuat,
          new THREE.Vector3(HEX_RADIUS * 0.99, baseH, HEX_RADIUS * 0.99)
        );
        baseGeos.push(GeoPool.hexCylinder.clone().applyMatrix4(m));

        // 2. 六角頂層地表柱體 (草皮 / 舞台)
        const topH = HEX_HEIGHT * 0.35;
        m.compose(
          new THREE.Vector3(x, HEX_HEIGHT - topH / 2, z),
          rotQuat,
          new THREE.Vector3(HEX_RADIUS * 0.96, topH, HEX_RADIUS * 0.96)
        );
        const topGeo = GeoPool.hexCylinder.clone().applyMatrix4(m);
        if (isCenter) centerGeos.push(topGeo);
        else grassGeos.push(topGeo);

        // 3. 地塊邊框頂部飾邊 (暖白/沙灘金色細圈)
        m.compose(
          new THREE.Vector3(x, HEX_HEIGHT + 0.18, z),
          rotQuat,
          new THREE.Vector3(HEX_RADIUS * 0.93, 0.35, HEX_RADIUS * 0.93)
        );
        rimGeos.push(GeoPool.hexCylinder.clone().applyMatrix4(m));

        // 4. 水面白色泡沫浪花圈 (Shore Foam Ring)
        m.compose(
          new THREE.Vector3(x, 1.05, z),
          rotQuat,
          new THREE.Vector3(HEX_RADIUS * 1.05, 0.15, HEX_RADIUS * 1.05)
        );
        foamGeos.push(GeoPool.hexCylinder.clone().applyMatrix4(m));
      });

      const centerX = sumX / count;
      const centerZ = sumZ / count;
      this.islandCenters.set(island.id, { x: centerX, z: centerZ });
    });

    // 依材質合併幾何體 (P0-2: 大幅降低 Draw Calls)
    if (baseGeos.length > 0) {
      const mergedBase = BufferGeometryUtils.mergeGeometries(baseGeos);
      const baseMesh = new THREE.Mesh(mergedBase, Materials.darkRock);
      baseMesh.receiveShadow = true;
      this.islandGroup.add(baseMesh);
    }
    if (grassGeos.length > 0) {
      const mergedGrass = BufferGeometryUtils.mergeGeometries(grassGeos);
      const grassMesh = new THREE.Mesh(mergedGrass, Materials.grass);
      grassMesh.castShadow = true;
      grassMesh.receiveShadow = true;
      grassMesh.userData = { type: 'hex_cell' };
      this.islandGroup.add(grassMesh);
      this.interactiveObjects.push(grassMesh);
    }
    if (centerGeos.length > 0) {
      const mergedCenter = BufferGeometryUtils.mergeGeometries(centerGeos);
      const centerMesh = new THREE.Mesh(mergedCenter, Materials.center);
      centerMesh.castShadow = true;
      centerMesh.receiveShadow = true;
      centerMesh.userData = { type: 'hex_cell' };
      this.islandGroup.add(centerMesh);
      this.interactiveObjects.push(centerMesh);
    }
    if (rimGeos.length > 0) {
      const mergedRim = BufferGeometryUtils.mergeGeometries(rimGeos);
      const rimMesh = new THREE.Mesh(mergedRim, Materials.sandRim);
      this.islandGroup.add(rimMesh);
    }
    if (foamGeos.length > 0) {
      const mergedFoam = BufferGeometryUtils.mergeGeometries(foamGeos);
      this.foamMesh = new THREE.Mesh(mergedFoam, Materials.foam);
      this.islandGroup.add(this.foamMesh);
    }
  }

  // 自動在島嶼邊緣間生成跨海橋樑 (合併靜態網格)
  buildBridges() {
    const islands = this.curriculum.islands;
    const centerPos = this.islandCenters.get('center');
    if (!centerPos) return;

    const bridgeGeos = [];
    const pierGeos = [];
    const m = new THREE.Matrix4();
    const noRot = new THREE.Quaternion();

    islands.forEach(island => {
      if (island.id === 'center') return;
      const targetPos = this.islandCenters.get(island.id);
      if (!targetPos) return;

      const midX = (centerPos.x + targetPos.x) / 2;
      const midZ = (centerPos.z + targetPos.z) / 2;
      const dx = targetPos.x - centerPos.x;
      const dz = targetPos.z - centerPos.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      const angle = Math.atan2(dz, dx);
      const bridgeLen = Math.max(10, dist - HEX_RADIUS * 3.2);

      // 橋樑本體幾何
      const bridgeQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -angle);
      m.compose(
        new THREE.Vector3(midX, HEX_HEIGHT - 0.5, midZ),
        bridgeQuat,
        new THREE.Vector3(bridgeLen, 1.2, 5)
      );
      bridgeGeos.push(GeoPool.box.clone().applyMatrix4(m));

      // 橋墩幾何
      m.compose(
        new THREE.Vector3(midX, HEX_HEIGHT / 2 - 0.5, midZ),
        noRot,
        new THREE.Vector3(2, HEX_HEIGHT, 2)
      );
      pierGeos.push(GeoPool.cylinder.clone().applyMatrix4(m));
    });

    if (bridgeGeos.length > 0) {
      const mergedBridge = BufferGeometryUtils.mergeGeometries(bridgeGeos);
      const bridgeMesh = new THREE.Mesh(mergedBridge, Materials.bridge);
      bridgeMesh.castShadow = true;
      bridgeMesh.receiveShadow = true;
      bridgeMesh.userData = { type: 'hex_cell', isBridge: true };
      this.bridgesGroup.add(bridgeMesh);
      this.interactiveObjects.push(bridgeMesh);
    }
    if (pierGeos.length > 0) {
      const mergedPier = BufferGeometryUtils.mergeGeometries(pierGeos);
      const pierMesh = new THREE.Mesh(mergedPier, Materials.whiteWall);
      this.bridgesGroup.add(pierMesh);
    }
  }

  // 註冊可被 Raycast 拾取的建築物碰撞體 (不加入 Scene 杜絕額外 Draw Calls)
  registerBuildingHitbox(buildingData, islandData, x, z) {
    const hitboxGeo = new THREE.CylinderGeometry(9, 9, 24, 8);
    const hitboxMat = new THREE.MeshBasicMaterial();
    const hitbox = new THREE.Mesh(hitboxGeo, hitboxMat);
    hitbox.position.set(x, HEX_HEIGHT + 10, z);
    hitbox.updateMatrixWorld(true);

    hitbox.userData = {
      type: 'building',
      buildingId: buildingData.id,
      islandId: islandData.id,
      name: buildingData.name,
      unit: buildingData.unit || '',
      conceptSummary: buildingData.conceptSummary,
      details: buildingData.details || [],
      quizCount: buildingData.quizCount || 5
    };

    this.interactiveObjects.push(hitbox);
    this.buildingMeshes.set(buildingData.id, hitbox);

    // 建立主島核心地標頂部懸浮指示看板 (避免過多 Billboard 造成 Draw Calls 超標)
    const primaryLandmarks = ['center-stage'];
    if (primaryLandmarks.includes(buildingData.id)) {
      this.createFloatingBadge(buildingData, islandData, hitbox);
    }
  }

  // 向後相容 registerBuilding
  registerBuilding(mesh, buildingData, islandData) {
    this.registerBuildingHitbox(buildingData, islandData, mesh.position.x, mesh.position.z);
    this.buildingsGroup.add(mesh);
  }

  // 繪製政策島風格懸浮指示卡 (Canvas Texture Billboard)
  createFloatingBadge(buildingData, islandData, mesh) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 72;
    const ctx = canvas.getContext('2d');

    // 背景白色圓角膠囊
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    ctx.roundRect(8, 8, 240, 56, 28);
    ctx.fill();

    // 邊框
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 科目彩色左側裝飾條
    const subjectColors = {
      math: '#3b82f6',
      english: '#eab308',
      science: '#10b981',
      social: '#f97316',
      chinese: '#8b5cf6',
      center: '#ec4899'
    };
    ctx.fillStyle = subjectColors[islandData.id] || '#64748b';
    ctx.beginPath();
    ctx.arc(36, 36, 12, 0, Math.PI * 2);
    ctx.fill();

    // 建築物名稱文字
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 24px "PingFang TC", "Microsoft JhengHei", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    
    // 截斷過長名稱
    let displayName = buildingData.name;
    if (displayName.length > 7) displayName = displayName.slice(0, 6) + '..';
    ctx.fillText(displayName, 58, 36);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;

    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(10, 2.8, 1);
    sprite.position.set(mesh.position.x, mesh.position.y + 20, mesh.position.z);
    sprite.userData = mesh.userData;

    this.badgesGroup.add(sprite);
    this.interactiveObjects.push(sprite);
  }

  // 每幀水面浪花呼吸與動態更新
  update(delta, time) {
    // 1. 水面泡沫圈自然呼吸 (單一網格等比微幅呼吸，零 GC 與極致效能)
    if (this.foamMesh) {
      const scaleFactor = 1.0 + Math.sin(time * 2.5) * 0.025;
      this.foamMesh.scale.set(scaleFactor, 1, scaleFactor);
    }
  }

  // 點亮建築永恆光柱 (通關獎勵)
  lightUpBeacon(buildingId) {
    const mesh = this.buildingMeshes.get(buildingId);
    if (!mesh) return;

    // 檢查是否已有光柱
    if (mesh.userData.beacon) return;

    const beaconGeo = new THREE.CylinderGeometry(0.8, 1.8, 80, 16);
    const beaconMesh = new THREE.Mesh(beaconGeo, Materials.beaconGlow);
    beaconMesh.position.set(mesh.position.x, mesh.position.y + 40, mesh.position.z);
    this.beaconsGroup.add(beaconMesh);
    mesh.userData.beacon = beaconMesh;
  }
}
