// decor.js: 確定性植被生成 (Mulberry32 PRNG)、路燈夜間發光與跨島 3D 貝茲能量流線
import * as THREE from 'three';
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
    this.streetLights = []; // 夜晚發光路燈集合
    this.flowParticles = []; // 貝茲流光動態粒子集合

    this.scene.add(this.decorGroup);
    this.scene.add(this.flowLinesGroup);
  }

  buildAllDecor() {
    this.buildVegetationAndLights();
    this.buildFlowLines();
  }

  // 1. 在各島嶼六角格子邊緣生成低多邊形積木樹與路燈
  buildVegetationAndLights() {
    const rng = mulberry32(108501); // 108課綱五上一期固定種子
    const islands = this.worldManager.curriculum.islands;

    islands.forEach(island => {
      const isCenter = island.id === 'center';
      const cells = island.cells;

      cells.forEach(([q, r], cellIdx) => {
        // 第一格通常放建築，其餘格子散落樹木與路燈
        const { x, z } = axialToWorld(q, r);

        // 每個六角格隨機在周圍邊緣種 1~2 棵積木樹
        const treeCount = isCenter ? 1 : Math.floor(rng() * 2) + 1;
        for (let i = 0; i < treeCount; i++) {
          const angle = rng() * Math.PI * 2;
          const dist = HEX_RADIUS * (0.45 + rng() * 0.35);
          const tx = x + Math.cos(angle) * dist;
          const tz = z + Math.sin(angle) * dist;

          const tree = this.createBlockTree(rng);
          tree.position.set(tx, HEX_HEIGHT, tz);
          this.decorGroup.add(tree);
        }

        // 部分格子生成帶夜間照明的路燈
        if (rng() > 0.45) {
          const lAngle = rng() * Math.PI * 2;
          const lDist = HEX_RADIUS * 0.7;
          const lx = x + Math.cos(lAngle) * lDist;
          const lz = z + Math.sin(lAngle) * lDist;

          const lamp = this.createStreetLight();
          lamp.position.set(lx, HEX_HEIGHT, lz);
          this.decorGroup.add(lamp);
          this.streetLights.push(lamp);
        }
      });
    });
  }

  // 雙層圓錐積木樹
  createBlockTree(rng) {
    const group = new THREE.Group();
    const scale = 0.8 + rng() * 0.4;

    // 四面方形積木樹幹
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.45, 2.6, 4), Materials.wood);
    trunk.position.y = 1.3;
    trunk.rotation.y = rng() * Math.PI;
    trunk.castShadow = true;
    group.add(trunk);

    // 雙層樹冠 (圓錐低多邊形)
    const foliageMat = rng() > 0.5 ? Materials.science : Materials.scienceAccent;
    const foliage1 = new THREE.Mesh(new THREE.ConeGeometry(1.9, 2.8, 5), foliageMat);
    foliage1.position.y = 3.2;
    foliage1.rotation.y = rng() * Math.PI;
    foliage1.castShadow = true;

    const foliage2 = new THREE.Mesh(new THREE.ConeGeometry(1.4, 2.2, 5), foliageMat);
    foliage2.position.y = 4.5;
    foliage2.rotation.y = foliage1.rotation.y + Math.PI / 5;
    foliage2.castShadow = true;

    group.add(foliage1);
    group.add(foliage2);
    group.scale.set(scale, scale, scale);

    return group;
  }

  // 微縮復古路燈 (頂部燈球自帶發光材質)
  createStreetLight() {
    const group = new THREE.Group();
    // 燈柱
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 4.5, 6), Materials.dirt);
    pole.position.y = 2.25;
    group.add(pole);

    // 燈罩
    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.6, 0.4, 6), Materials.dirt);
    cap.position.y = 4.6;
    group.add(cap);

    // 發光燈泡
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), bulbMat);
    bulb.position.y = 4.3;
    group.add(bulb);

    group.userData = { bulb, bulbMat };
    return group;
  }

  // 2. 跨島 3D 貝茲曲線與循環流動能量光球
  buildFlowLines() {
    const flows = this.worldManager.curriculum.flows || [];
    const islandCenters = this.worldManager.islandCenters;

    flows.forEach((flow, idx) => {
      const pFrom = islandCenters.get(flow.from);
      const pTo = islandCenters.get(flow.to);
      if (!pFrom || !pTo) return;

      const v0 = new THREE.Vector3(pFrom.x, HEX_HEIGHT + 3, pFrom.z);
      const v2 = new THREE.Vector3(pTo.x, HEX_HEIGHT + 3, pTo.z);

      // 弧頂中點控制點 (中點向上拱起形成彩虹拱弧)
      const midX = (v0.x + v2.x) / 2;
      const midZ = (v0.z + v2.z) / 2;
      const dist = v0.distanceTo(v2);
      const arcHeight = Math.max(16, dist * 0.35);
      const v1 = new THREE.Vector3(midX, HEX_HEIGHT + arcHeight, midZ);

      // 二次貝茲曲線幾何
      const curve = new THREE.QuadraticBezierCurve3(v0, v1, v2);
      const points = curve.getPoints(40);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(points);

      // 半透明流光管線
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.45
      });
      const line = new THREE.Line(curveGeo, lineMat);
      this.flowLinesGroup.add(line);

      // 沿曲線流動的發光能量球 (Orb)
      const orbMat = new THREE.MeshBasicMaterial({
        color: 0xffd700,
        transparent: true,
        opacity: 0.95
      });
      const orb = new THREE.Mesh(new THREE.SphereGeometry(1.2, 8, 8), orbMat);
      this.flowLinesGroup.add(orb);

      this.flowParticles.push({
        curve,
        mesh: orb,
        speed: 0.15 + (idx % 3) * 0.05,
        offset: idx * 0.25
      });
    });
  }

  // 每幀動態更新
  update(time, isNight) {
    // 1. 能量光球沿貝茲曲線巡航
    this.flowParticles.forEach(p => {
      const t = ((time * p.speed + p.offset) % 1.0);
      const pos = p.curve.getPoint(t);
      p.mesh.position.copy(pos);
    });

    // 2. 夜晚時路燈增強自發光
    this.streetLights.forEach(lamp => {
      if (lamp.userData && lamp.userData.bulbMat) {
        if (isNight) {
          lamp.userData.bulbMat.color.setHex(0xffea00);
        } else {
          lamp.userData.bulbMat.color.setHex(0xfef08a);
        }
      }
    });
  }
}
