// world.js: 六角軸向座標系 (Axial (q,r))、島嶼生成與路徑拓撲
import * as THREE from 'three';
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
    this.foamRings = []; // 水面白色浪花圈
    
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
    this.curriculum.islands.forEach(island => {
      const isCenter = island.id === 'center';
      const cellMaterial = isCenter ? Materials.center : Materials.grass;

      // 計算島嶼中心座標 (平均值)
      let sumX = 0, sumZ = 0;
      const count = island.cells.length;

      island.cells.forEach(([q, r]) => {
        const { x, z } = axialToWorld(q, r);
        sumX += x;
        sumZ += z;

        // 1. 六角底層岩石基座 (深色岩壁)
        const baseH = HEX_HEIGHT * 0.7;
        const baseMesh = new THREE.Mesh(GeoPool.hexCylinder, Materials.darkRock);
        baseMesh.scale.set(HEX_RADIUS * 0.99, baseH, HEX_RADIUS * 0.99);
        baseMesh.position.set(x, baseH / 2, z);
        baseMesh.rotation.y = Math.PI / 6;
        baseMesh.receiveShadow = true;
        this.islandGroup.add(baseMesh);

        // 2. 六角頂層地表柱體 (鮮明草皮/舞台粉)
        const topH = HEX_HEIGHT * 0.35;
        const hexMesh = new THREE.Mesh(GeoPool.hexCylinder, cellMaterial);
        hexMesh.scale.set(HEX_RADIUS * 0.96, topH, HEX_RADIUS * 0.96);
        hexMesh.position.set(x, HEX_HEIGHT - topH / 2, z);
        hexMesh.rotation.y = Math.PI / 6;
        hexMesh.castShadow = true;
        hexMesh.receiveShadow = true;

        hexMesh.userData = {
          type: 'hex_cell',
          islandId: island.id,
          axial: [q, r]
        };

        this.islandGroup.add(hexMesh);
        this.interactiveObjects.push(hexMesh);

        // 3. 地塊邊框頂部飾邊 (暖白/沙灘金色細圈)
        const topRim = new THREE.Mesh(GeoPool.hexCylinder, Materials.sandRim);
        topRim.scale.set(HEX_RADIUS * 0.93, 0.35, HEX_RADIUS * 0.93);
        topRim.position.set(x, HEX_HEIGHT + 0.18, z);
        topRim.rotation.y = Math.PI / 6;
        this.islandGroup.add(topRim);

        // 4. 水面白色泡沫浪花圈 (Shore Foam Ring: 微縮模型玩具箱質感關鍵)
        const foamMesh = new THREE.Mesh(GeoPool.hexCylinder, Materials.foam);
        foamMesh.scale.set(HEX_RADIUS * 1.05, 0.15, HEX_RADIUS * 1.05);
        foamMesh.position.set(x, 1.05, z);
        foamMesh.rotation.y = Math.PI / 6;
        this.islandGroup.add(foamMesh);
        this.foamRings.push({ mesh: foamMesh, baseX: HEX_RADIUS * 1.05, baseZ: HEX_RADIUS * 1.05, offset: (q * 3 + r * 5) % 10 });
      });

      const centerX = sumX / count;
      const centerZ = sumZ / count;
      this.islandCenters.set(island.id, { x: centerX, z: centerZ });
    });
  }

  // 自動在島嶼邊緣間生成跨海橋樑
  buildBridges() {
    const islands = this.curriculum.islands;
    const bridgeMaterial = Materials.bridge;

    // 連接中央舞台與周邊 5 大島嶼
    const centerPos = this.islandCenters.get('center');
    if (!centerPos) return;

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

      // 橋樑本體 (Box)
      const bridgeLen = Math.max(10, dist - HEX_RADIUS * 3.2);
      const bridgeMesh = new THREE.Mesh(GeoPool.box, bridgeMaterial);
      bridgeMesh.scale.set(bridgeLen, 1.2, 5);
      bridgeMesh.position.set(midX, HEX_HEIGHT - 0.5, midZ);
      bridgeMesh.rotation.y = -angle;
      bridgeMesh.castShadow = true;
      bridgeMesh.receiveShadow = true;
      bridgeMesh.userData = {
        type: 'hex_cell',
        isBridge: true
      };
      this.bridgesGroup.add(bridgeMesh);
      this.interactiveObjects.push(bridgeMesh);

      // 橋墩
      const pierMesh = new THREE.Mesh(GeoPool.cylinder, Materials.whiteWall);
      pierMesh.scale.set(2, HEX_HEIGHT, 2);
      pierMesh.position.set(midX, HEX_HEIGHT / 2 - 0.5, midZ);
      this.bridgesGroup.add(pierMesh);
    });
  }

  // 註冊可被 Raycast 拾取的建築物
  registerBuilding(mesh, buildingData, islandData) {
    mesh.userData = {
      type: 'building',
      buildingId: buildingData.id,
      islandId: islandData.id,
      name: buildingData.name,
      unit: buildingData.unit || '',
      conceptSummary: buildingData.conceptSummary,
      details: buildingData.details || [],
      quizCount: buildingData.quizCount || 5
    };

    // 建立加大版點擊碰撞體 (Hitbox: 半徑 9、高 24)，確保滑鼠或平板點擊 100% 觸發
    const hitboxGeo = new THREE.CylinderGeometry(9, 9, 24, 8);
    const hitboxMat = new THREE.MeshBasicMaterial({ visible: false });
    const hitbox = new THREE.Mesh(hitboxGeo, hitboxMat);
    hitbox.position.y = 10;
    mesh.add(hitbox);

    this.interactiveObjects.push(mesh);
    this.buildingMeshes.set(buildingData.id, mesh);
    this.buildingsGroup.add(mesh);

    // 建立 3D 頂部懸浮指示看板 (Billboard Badge)
    this.createFloatingBadge(buildingData, islandData, mesh);
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
    // 1. 水面泡沫圈自然呼吸
    this.foamRings.forEach(item => {
      const scaleFactor = 1.0 + Math.sin(time * 2.5 + item.offset) * 0.04;
      item.mesh.scale.x = item.baseX * scaleFactor;
      item.mesh.scale.z = item.baseZ * scaleFactor;
    });
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
