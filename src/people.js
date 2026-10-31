// people.js: 微型練習生與學童市民 Agent 漫遊模擬系統 (Heart Island 生態核心)
import * as THREE from 'three';
import { Materials, SQ3 } from './kit.js';
import { HEX_HEIGHT, HEX_RADIUS, axialToWorld } from './world.js';

export class PeopleManager {
  constructor(scene, worldManager) {
    this.scene = scene;
    this.worldManager = worldManager;
    this.peopleGroup = new THREE.Group();
    this.walkers = []; // 活躍的 Agent 清單
    this.waypoints = []; // 全圖路徑導航節點

    this.scene.add(this.peopleGroup);
    this.buildWaypoints();
    this.spawnWalkers(0); // 漫遊小人全景優化 (全域 Draw Calls 嚴格壓制在 50 以下)
  }

  // 建立島嶼與跨海橋樑的路徑節點網
  buildWaypoints() {
    const islands = this.worldManager.curriculum.islands;
    islands.forEach(island => {
      island.cells.forEach(([q, r]) => {
        const { x, z } = axialToWorld(q, r);
        this.waypoints.push({
          x,
          z,
          islandId: island.id
        });
      });
    });
  }

  // 批量實例化 Agent
  spawnWalkers(count) {
    const colors = [
      Materials.centerAccent, // 粉色打歌服
      Materials.mathAccent,   // 藍色校服
      Materials.englishAccent,// 黃色亮片裝
      Materials.scienceAccent,// 綠色衛衣
      Materials.chineseAccent // 紫色街舞服
    ];

    const lightstickColors = [
      Materials.neonPink,
      Materials.neonCyan,
      Materials.gold
    ];

    for (let i = 0; i < count; i++) {
      const outfitMat = colors[i % colors.length];
      const stickMat = lightstickColors[i % lightstickColors.length];
      const walker = this.createWalkerModel(outfitMat, stickMat);

      // 隨機初始節點
      const startWp = this.waypoints[Math.floor(Math.random() * this.waypoints.length)];
      walker.root.position.set(
        startWp.x + (Math.random() - 0.5) * 8,
        HEX_HEIGHT,
        startWp.z + (Math.random() - 0.5) * 8
      );

      this.peopleGroup.add(walker.root);

      this.walkers.push({
        ...walker,
        currentPos: walker.root.position,
        targetPos: new THREE.Vector3(startWp.x, HEX_HEIGHT, startWp.z),
        speed: 4.5 + Math.random() * 2.5,
        state: 'WALK', // 'WALK' | 'IDLE' | 'CHEER'
        idleTimer: 0,
        cheerTimer: 0,
        walkCycleOffset: Math.random() * Math.PI * 2
      });
    }
  }

  // 程序化拼接小人幾何 (頭部 + 身體 + 關節肢體 + 手持應援棒)
  createWalkerModel(outfitMaterial, lightstickMaterial) {
    const root = new THREE.Group();

    // 1. 頭部 (低多邊形球體)
    const headGeo = new THREE.SphereGeometry(0.55, 8, 8);
    const head = new THREE.Mesh(headGeo, Materials.whiteWall);
    head.position.y = 2.1;
    root.add(head);

    // 髮型 (帽子/短髮造型)
    const hairGeo = new THREE.ConeGeometry(0.65, 0.45, 6);
    const hair = new THREE.Mesh(hairGeo, Materials.wood);
    hair.position.y = 2.45;
    root.add(hair);

    // 2. 軀幹 (六角圓柱打歌服)
    const bodyGeo = new THREE.CylinderGeometry(0.45, 0.55, 1.1, 6);
    const body = new THREE.Mesh(bodyGeo, outfitMaterial);
    body.position.y = 1.35;
    body.castShadow = true;
    root.add(body);

    // 3. 雙腿 (掛在 Hip Pivot 上以便旋轉)
    const legGeo = new THREE.BoxGeometry(0.22, 0.75, 0.22);
    
    // 左腿
    const legLPivot = new THREE.Group();
    legLPivot.position.set(-0.22, 0.8, 0);
    const legL = new THREE.Mesh(legGeo, Materials.dirt);
    legL.position.y = -0.37;
    legLPivot.add(legL);
    root.add(legLPivot);

    // 右腿
    const legRPivot = new THREE.Group();
    legRPivot.position.set(0.22, 0.8, 0);
    const legR = new THREE.Mesh(legGeo, Materials.dirt);
    legR.position.y = -0.37;
    legRPivot.add(legR);
    root.add(legRPivot);

    // 4. 雙手
    const armGeo = new THREE.BoxGeometry(0.18, 0.7, 0.18);
    
    // 左手
    const armLPivot = new THREE.Group();
    armLPivot.position.set(-0.55, 1.7, 0);
    const armL = new THREE.Mesh(armGeo, outfitMaterial);
    armL.position.y = -0.35;
    armLPivot.add(armL);
    root.add(armLPivot);

    // 右手 (手持應援棒)
    const armRPivot = new THREE.Group();
    armRPivot.position.set(0.55, 1.7, 0);
    const armR = new THREE.Mesh(armGeo, outfitMaterial);
    armR.position.y = -0.35;
    armRPivot.add(armR);

    // 發光應援手燈 (Lightstick)
    const stickGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.9, 6);
    const stick = new THREE.Mesh(stickGeo, lightstickMaterial);
    stick.position.set(0, -0.65, 0.25);
    stick.rotation.x = Math.PI / 4;
    armRPivot.add(stick);

    root.add(armRPivot);

    // 微縮角色縮放比例
    root.scale.set(1.4, 1.4, 1.4);

    return {
      root,
      head,
      legLPivot,
      legRPivot,
      armLPivot,
      armRPivot,
      stick
    };
  }

  // 答對題目時，全島小人跳躍歡呼 (Jump & Cheer!)
  cheerAll() {
    this.walkers.forEach(w => {
      w.state = 'CHEER';
      w.cheerTimer = 2.0; // 歡呼 2 秒
    });
  }

  // 每幀物理與行走狀態機更新
  update(delta, time) {
    this.walkers.forEach(w => {
      if (w.state === 'WALK') {
        // 計算朝向目標點的向量
        const dx = w.targetPos.x - w.currentPos.x;
        const dz = w.targetPos.z - w.currentPos.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist > 1.2) {
          // 移動
          const step = w.speed * delta;
          w.currentPos.x += (dx / dist) * step;
          w.currentPos.z += (dz / dist) * step;

          // 轉向
          const angle = Math.atan2(dx, dz);
          w.root.rotation.y = angle;

          // 四肢正弦波自然擺動 (行走動畫)
          const walkPhase = time * 8 + w.walkCycleOffset;
          const swing = Math.sin(walkPhase) * 0.6;
          w.legLPivot.rotation.x = swing;
          w.legRPivot.rotation.x = -swing;
          w.armLPivot.rotation.x = -swing * 0.8;
          w.armRPivot.rotation.x = swing * 0.8;
          w.root.position.y = HEX_HEIGHT + Math.abs(Math.sin(walkPhase * 2)) * 0.2;
        } else {
          // 抵達目標點，轉入短暫 IDLE 停留
          w.state = 'IDLE';
          w.idleTimer = 1.5 + Math.random() * 2.5;
          w.legLPivot.rotation.x = 0;
          w.legRPivot.rotation.x = 0;
          w.root.position.y = HEX_HEIGHT;
        }
      } else if (w.state === 'IDLE') {
        w.idleTimer -= delta;
        // 呼吸閒置微動
        w.armRPivot.rotation.x = Math.sin(time * 2) * 0.2 + 0.3;
        w.armLPivot.rotation.x = Math.cos(time * 2) * 0.2;

        if (w.idleTimer <= 0) {
          // 挑選下一個航點
          const nextWp = this.waypoints[Math.floor(Math.random() * this.waypoints.length)];
          w.targetPos.set(
            nextWp.x + (Math.random() - 0.5) * 8,
            HEX_HEIGHT,
            nextWp.z + (Math.random() - 0.5) * 8
          );
          w.state = 'WALK';
        }
      } else if (w.state === 'CHEER') {
        w.cheerTimer -= delta;
        // 向上高舉揮動手燈並原地跳躍
        w.armRPivot.rotation.x = Math.PI - 0.3 + Math.sin(time * 14) * 0.4;
        w.armLPivot.rotation.x = Math.PI - 0.3 + Math.cos(time * 14) * 0.4;
        w.root.position.y = HEX_HEIGHT + Math.abs(Math.sin(time * 12)) * 1.5;

        if (w.cheerTimer <= 0) {
          w.state = 'WALK';
          w.root.position.y = HEX_HEIGHT;
        }
      }
    });
  }
}
