// decor.js: 確定性植被生成 (Mulberry32 PRNG)、路燈夜間發光與跨島 3D 貝茲能量流線
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { GeoPool, Materials, SQ3 } from './kit.js';
import { HEX_HEIGHT, HEX_RADIUS, axialToWorld } from './world.js';

// 確定性 PRNG: Mulberry32 (確保全島植被每次刷新位置絕對一致)
export function mulberry32(seed) {
  return function() {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class DecorManager {
  constructor(scene, worldManager) {
    this.scene = scene;
    this.worldManager = worldManager;
    this.decorGroup = new THREE.Group();
    this.flowLinesGroup = new THREE.Group();
    this.flowParticles = []; // 貝茲流光動態粒子集合
    this.instancedOrbs = null;
    this._dummyObj = new THREE.Object3D();

    this.scene.add(this.decorGroup);
    this.scene.add(this.flowLinesGroup);
  }

  buildAllDecor() {
    this.buildVegetationAndLights();
    this.buildFlowLines();
  }

  // 1. 在各島嶼六角格子邊緣生成低多邊形積木樹與路燈 (依材質合併幾何體，極致降至 <10 Draw Calls)
  buildVegetationAndLights() {
    const rng = mulberry32(108501); // 108課綱五上一期固定種子
    const islands = this.worldManager.curriculum.islands;

    const geosByMat = new Map();
    const addGeom = (mat, geo, matrix) => {
      if (!geosByMat.has(mat)) geosByMat.set(mat, []);
      geosByMat.get(mat).push(geo.clone().applyMatrix4(matrix));
    };

    const m = new THREE.Matrix4();
    const mSub = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const qIdentity = new THREE.Quaternion();

    // 共享幾何原型
    const roundTrunkGeo = new THREE.CylinderGeometry(0.3, 0.4, 2.4, 5);
    const sakuraTrunkGeo = new THREE.CylinderGeometry(0.28, 0.38, 2.2, 4);
    const blockTrunkGeo = new THREE.CylinderGeometry(0.3, 0.45, 2.6, 4);
    const cone1Geo = new THREE.ConeGeometry(1.9, 2.8, 5);
    const cone2Geo = new THREE.ConeGeometry(1.4, 2.2, 5);
    const petalGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.1, 5);
    const benchSeatGeo = new THREE.BoxGeometry(1.6, 0.15, 0.6);
    const benchBackGeo = new THREE.BoxGeometry(1.6, 0.5, 0.12);
    const benchLegGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.5, 4);
    const lampPoleGeo = new THREE.CylinderGeometry(0.12, 0.16, 4.5, 6);
    const lampCapGeo = new THREE.ConeGeometry(0.6, 0.4, 6);
    const lampBulbGeo = new THREE.SphereGeometry(0.3, 8, 8);

    islands.forEach(island => {
      const isCenter = island.id === 'center';
      const cells = island.cells;

      cells.forEach(([cellQ, cellR]) => {
        const { x, z } = axialToWorld(cellQ, cellR);

        // 1. 散落多樣化植被 (針葉松、日系圓球樹、粉彩櫻花樹)
        const treeCount = isCenter ? 1 : Math.floor(rng() * 2) + 1;
        for (let i = 0; i < treeCount; i++) {
          const angle = rng() * Math.PI * 2;
          const dist = HEX_RADIUS * (0.45 + rng() * 0.35);
          const tx = x + Math.cos(angle) * dist;
          const tz = z + Math.sin(angle) * dist;
          const treeType = rng();

          if (treeType < 0.45) {
            // 針葉松 (雙層圓錐)
            const scale = 0.8 + rng() * 0.4;
            const treeRotY = rng() * Math.PI;
            q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), treeRotY);

            // 樹幹
            m.compose(new THREE.Vector3(tx, HEX_HEIGHT + 1.3 * scale, tz), q, new THREE.Vector3(scale, scale, scale));
            addGeom(Materials.wood, blockTrunkGeo, m);

            // 雙層樹冠
            const foliageMat = Materials.science;
            m.compose(new THREE.Vector3(tx, HEX_HEIGHT + 3.2 * scale, tz), q, new THREE.Vector3(scale, scale, scale));
            addGeom(foliageMat, cone1Geo, m);

            const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), treeRotY + Math.PI / 5);
            m.compose(new THREE.Vector3(tx, HEX_HEIGHT + 4.5 * scale, tz), q2, new THREE.Vector3(scale, scale, scale));
            addGeom(foliageMat, cone2Geo, m);

          } else if (treeType < 0.8) {
            // 日系圓球樹
            const scale = 0.85 + rng() * 0.35;
            m.compose(new THREE.Vector3(tx, HEX_HEIGHT + 1.2 * scale, tz), qIdentity, new THREE.Vector3(scale, scale, scale));
            addGeom(Materials.wood, roundTrunkGeo, m);

            const foliageMat = Materials.science;
            m.compose(new THREE.Vector3(tx, HEX_HEIGHT + 3.2 * scale, tz), qIdentity, new THREE.Vector3(1.8 * scale, 1.8 * scale, 1.8 * scale));
            addGeom(foliageMat, GeoPool.lowSphere, m);

            m.compose(new THREE.Vector3(tx + 0.6 * scale, HEX_HEIGHT + 2.6 * scale, tz + 0.4 * scale), qIdentity, new THREE.Vector3(1.2 * scale, 1.1 * scale, 1.2 * scale));
            addGeom(foliageMat, GeoPool.lowSphere, m);

          } else {
            // 粉彩櫻花樹
            const scale = 0.9;
            m.compose(new THREE.Vector3(tx, HEX_HEIGHT + 1.1 * scale, tz), qIdentity, new THREE.Vector3(scale, scale, scale));
            addGeom(Materials.wood, sakuraTrunkGeo, m);

            m.compose(new THREE.Vector3(tx, HEX_HEIGHT + 3.0 * scale, tz), qIdentity, new THREE.Vector3(1.7 * scale, 1.5 * scale, 1.7 * scale));
            addGeom(Materials.flowerPink, GeoPool.lowSphere, m);
          }
        }

        // 2. 邊緣草地点綴微縮小花簇 (Flower Clusters)
        if (rng() > 0.35 && !isCenter) {
          const fAngle = rng() * Math.PI * 2;
          const fDist = HEX_RADIUS * (0.3 + rng() * 0.4);
          const fx = x + Math.cos(fAngle) * fDist;
          const fz = z + Math.sin(fAngle) * fDist;
          const mats = [Materials.flowerPink, Materials.flowerYellow];
          for (let pIdx = 0; pIdx < 4; pIdx++) {
            const fMat = mats[pIdx % mats.length];
            const px = fx + (rng() - 0.5) * 1.6;
            const pz = fz + (rng() - 0.5) * 1.6;
            m.compose(new THREE.Vector3(px, HEX_HEIGHT + 0.15, pz), qIdentity, new THREE.Vector3(1, 1, 1));
            addGeom(fMat, petalGeo, m);
          }
        }

        // 3. 部分格子生成公園長椅 (Park Bench)
        if (rng() > 0.7 && !isCenter) {
          const bAngle = rng() * Math.PI * 2;
          const bDist = HEX_RADIUS * 0.65;
          const bx = x + Math.cos(bAngle) * bDist;
          const bz = z + Math.sin(bAngle) * bDist;
          q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), bAngle + Math.PI / 2);

          // 椅面
          m.compose(new THREE.Vector3(bx, HEX_HEIGHT + 0.5, bz), q, new THREE.Vector3(1, 1, 1));
          addGeom(Materials.wood, benchSeatGeo, m);

          // 椅背
          const backOffset = new THREE.Vector3(0, 0.8, -0.24).applyQuaternion(q);
          m.compose(new THREE.Vector3(bx + backOffset.x, HEX_HEIGHT + backOffset.y, bz + backOffset.z), q, new THREE.Vector3(1, 1, 1));
          addGeom(Materials.wood, benchBackGeo, m);

          // 鐵件椅腳
          const l1Offset = new THREE.Vector3(-0.6, 0.25, 0).applyQuaternion(q);
          m.compose(new THREE.Vector3(bx + l1Offset.x, HEX_HEIGHT + l1Offset.y, bz + l1Offset.z), q, new THREE.Vector3(1, 1, 1));
          addGeom(Materials.darkRock, benchLegGeo, m);

          const l2Offset = new THREE.Vector3(0.6, 0.25, 0).applyQuaternion(q);
          m.compose(new THREE.Vector3(bx + l2Offset.x, HEX_HEIGHT + l2Offset.y, bz + l2Offset.z), q, new THREE.Vector3(1, 1, 1));
          addGeom(Materials.darkRock, benchLegGeo, m);
        }

        // 4. 夜間發光微縮路燈
        if (rng() > 0.45) {
          const lAngle = rng() * Math.PI * 2;
          const lDist = HEX_RADIUS * 0.72;
          const lx = x + Math.cos(lAngle) * lDist;
          const lz = z + Math.sin(lAngle) * lDist;

          // 燈柱與燈罩
          m.compose(new THREE.Vector3(lx, HEX_HEIGHT + 2.25, lz), qIdentity, new THREE.Vector3(1, 1, 1));
          addGeom(Materials.wood, lampPoleGeo, m);

          m.compose(new THREE.Vector3(lx, HEX_HEIGHT + 4.6, lz), qIdentity, new THREE.Vector3(1, 1, 1));
          addGeom(Materials.wood, lampCapGeo, m);

          // 發光燈泡
          m.compose(new THREE.Vector3(lx, HEX_HEIGHT + 4.3, lz), qIdentity, new THREE.Vector3(1, 1, 1));
          addGeom(Materials.windowGlow, lampBulbGeo, m);
        }
      });
    });

    // 依材質合併所有靜態裝飾網格
    geosByMat.forEach((geos, mat) => {
      if (geos.length > 0) {
        const merged = BufferGeometryUtils.mergeGeometries(geos);
        const mesh = new THREE.Mesh(merged, mat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.decorGroup.add(mesh);
      }
    });
  }

  // 2. 跨島 3D 貝茲曲線與循環流動能量光球 (合併管線 + 實例化粒子)
  buildFlowLines() {
    const flows = this.worldManager.curriculum.flows || [];
    const islandCenters = this.worldManager.islandCenters;
    if (flows.length === 0) return;

    const allLineSegments = [];
    const curves = [];

    flows.forEach((flow, idx) => {
      const pFrom = islandCenters.get(flow.from);
      const pTo = islandCenters.get(flow.to);
      if (!pFrom || !pTo) return;

      const v0 = new THREE.Vector3(pFrom.x, HEX_HEIGHT + 3, pFrom.z);
      const v2 = new THREE.Vector3(pTo.x, HEX_HEIGHT + 3, pTo.z);

      const midX = (v0.x + v2.x) / 2;
      const midZ = (v0.z + v2.z) / 2;
      const dist = v0.distanceTo(v2);
      const arcHeight = Math.max(16, dist * 0.35);
      const v1 = new THREE.Vector3(midX, HEX_HEIGHT + arcHeight, midZ);

      const curve = new THREE.QuadraticBezierCurve3(v0, v1, v2);
      curves.push(curve);

      const pts = curve.getPoints(36);
      for (let i = 0; i < pts.length - 1; i++) {
        allLineSegments.push(pts[i], pts[i + 1]);
      }

      this.flowParticles.push({
        curve,
        speed: 0.15 + (idx % 3) * 0.05,
        offset: idx * 0.25
      });
    });

    // 1. 合併流光曲線 (1 個 Draw Call)
    if (allLineSegments.length > 0) {
      const mergedLineGeo = new THREE.BufferGeometry().setFromPoints(allLineSegments);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.45
      });
      const line = new THREE.LineSegments(mergedLineGeo, lineMat);
      this.flowLinesGroup.add(line);
    }

    // 2. 實例化能量光球 (1 個 Draw Call)
    if (this.flowParticles.length > 0) {
      const orbMat = new THREE.MeshBasicMaterial({
        color: 0xffd700,
        transparent: true,
        opacity: 0.95
      });
      const orbGeo = new THREE.SphereGeometry(1.2, 8, 8);
      this.instancedOrbs = new THREE.InstancedMesh(orbGeo, orbMat, this.flowParticles.length);
      this.flowLinesGroup.add(this.instancedOrbs);
    }
  }

  // 每幀動態更新 (零 GC 實例化更新)
  update(time, isNight) {
    // 1. 能量光球沿貝茲曲線巡航 (實例化網格矩陣同步)
    if (this.instancedOrbs && this.flowParticles.length > 0) {
      for (let i = 0; i < this.flowParticles.length; i++) {
        const p = this.flowParticles[i];
        const t = ((time * p.speed + p.offset) % 1.0);
        const pos = p.curve.getPoint(t);
        this._dummyObj.position.copy(pos);
        this._dummyObj.updateMatrix();
        this.instancedOrbs.setMatrixAt(i, this._dummyObj.matrix);
      }
      this.instancedOrbs.instanceMatrix.needsUpdate = true;
    }

    // 2. 夜晚時路燈全島自發光色溫無縫切換
    Materials.windowGlow.color.setHex(isNight ? 0xffea00 : 0xfef08a);
  }
}
