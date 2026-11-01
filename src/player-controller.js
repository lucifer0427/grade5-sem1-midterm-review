// player-controller.js: 玩家 3D 角色即時操縱、跳躍、加速、拾取星石與幸運盲盒系統
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { GeoPool, Materials, Pool } from './kit.js';
import { HEX_HEIGHT, axialToWorld } from './world.js';

export class PlayerController {
  constructor(scene, camera, controls, avatarManager, audioSynth, quizEngine, worldManager = null) {
    this.scene = scene;
    this.camera = camera;
    this.controls = controls;
    this.avatarManager = avatarManager;
    this.audioSynth = audioSynth;
    this.quizEngine = quizEngine;
    this.worldManager = worldManager;

    this.isControlling = false; // 是否處於第三人稱主角操控模式
    this.playerMesh = avatarManager.playerMesh;

    // 移動與跳躍狀態
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false
    };

    this.baseMoveSpeed = 12.0;
    this.sprintMoveSpeed = 17.5;
    this.moveSpeed = this.baseMoveSpeed;
    this.isSprinting = false;
    this.virtualInput = { x: 0, z: 0 }; // 行動端虛擬搖桿輸入向量
    this.currentVelocity = new THREE.Vector3(0, 0, 0); // 物理速度慣性向量
    this.targetMovePoint = null; // 點擊地面移動目標

    // 零 GC 預分配 Scratch 向量 (徹底杜絕每幀 new 物件與記憶體回收卡頓)
    this._vMoveDir = new THREE.Vector3();
    this._vDesiredVel = new THREE.Vector3();
    this._vCamForward = new THREE.Vector3();
    this._vCamRight = new THREE.Vector3();
    this._vMoveVec = new THREE.Vector3();
    this._vDiff = new THREE.Vector3();
    this._vTargetLookAt = new THREE.Vector3();
    this._vPrevTarget = new THREE.Vector3();
    this._vTargetDelta = new THREE.Vector3();
    this._vCamOffset = new THREE.Vector3(0, 30, 36);

    // 實例化寶石更新矩陣池
    this._gemM = new THREE.Matrix4();
    this._gemQ = new THREE.Quaternion();
    this._gemPos = new THREE.Vector3();
    this._gemS = new THREE.Vector3(1, 1, 1);
    this._gemZero = new THREE.Vector3(0, 0, 0);

    // 垂直跳躍物理
    this.isJumping = false;
    this.jumpVelocity = 0;
    this.gravity = -36.0;

    // 肢體步態動畫週期
    this.walkCycle = 0;

    // 特殊狀態 (加速 Buff / 跳舞中)
    this.speedBuffTimer = 0;
    this.dancingTimer = 0;

    // Obby 跑酷模式旗標與實例引用
    this.isObbyMode = false;
    this.obbyCourse = null;

    // 1. 大地星光拾取物 (Collectibles)
    this.collectiblesGroup = new THREE.Group();
    this.scene.add(this.collectiblesGroup);
    this.collectibles = [];
    this.initCollectibles();

    // 2. 幸運神秘盲盒 (Mystery Chests)
    this.chestsGroup = new THREE.Group();
    this.scene.add(this.chestsGroup);
    this.chests = [];
    this.initLuckyChests();

    // 3. 地面點擊導航光環 (Target Marker)
    this.initTargetMarker();

    // 4. 島嶼邊界與橋樑通行約束 (防止學童角色跌落虛空/海洋)
    this.walkableCells = [];
    this.walkableBridges = [];
    if (this.worldManager) {
      this.initWalkableBounds(this.worldManager);
    }

    this.setupInputListeners();
  }

  // 初始化可行走區域邊界拓撲
  initWalkableBounds(worldManager) {
    this.walkableCells = [];
    this.walkableBridges = [];
    if (!worldManager || !worldManager.curriculum || !worldManager.curriculum.islands) return;

    // 1. 蒐集所有六角地塊中心
    worldManager.curriculum.islands.forEach(island => {
      island.cells.forEach(([q, r]) => {
        const { x, z } = axialToWorld(q, r);
        this.walkableCells.push({ x, z });
      });
    });

    // 2. 蒐集跨海橋樑端點線段
    const centerPos = worldManager.islandCenters.get('center') || { x: 0, z: 0 };
    worldManager.curriculum.islands.forEach(island => {
      if (island.id === 'center') return;
      const targetPos = worldManager.islandCenters.get(island.id);
      if (targetPos) {
        this.walkableBridges.push({
          ax: centerPos.x,
          az: centerPos.z,
          bx: targetPos.x,
          bz: targetPos.z
        });
      }
    });
  }

  // 計算點到線段之垂直距離
  distToSegment(px, pz, ax, az, bx, bz) {
    const dx = bx - ax;
    const dz = bz - az;
    const l2 = dx * dx + dz * dz;
    if (l2 === 0) return Math.hypot(px - ax, pz - az);
    let t = ((px - ax) * dx + (pz - az) * dz) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (ax + t * dx), pz - (az + t * dz));
  }

  // 判斷是否處於安全陸地或橋樑路網範圍內
  isWalkable(x, z) {
    if (!this.walkableCells || this.walkableCells.length === 0) return true;

    // 檢查六角格 (外接半徑 22，相鄰六角格交界距離 19.05，設半徑 21.5 完整無死角覆蓋)
    for (let i = 0; i < this.walkableCells.length; i++) {
      const c = this.walkableCells[i];
      const dx = x - c.x;
      const dz = z - c.z;
      if (dx * dx + dz * dz <= 462.25) { // 21.5 * 21.5 = 462.25
        return true;
      }
    }

    // 檢查跨海橋樑 (寬度 5，走廊有效通暢半徑 3.5)
    for (let i = 0; i < this.walkableBridges.length; i++) {
      const b = this.walkableBridges[i];
      if (this.distToSegment(x, z, b.ax, b.az, b.bx, b.bz) <= 3.5) {
        return true;
      }
    }

    return false;
  }

  // 建立地面點擊導航光環 (Target Marker)
  initTargetMarker() {
    this.targetMarker = new THREE.Group();

    // 金色旋轉光環
    const ringGeo = new THREE.RingGeometry(0.8, 1.25, 32);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    });
    this.markerRing = new THREE.Mesh(ringGeo, ringMat);
    this.targetMarker.add(this.markerRing);

    // 白色中心圓點
    const dotGeo = new THREE.CircleGeometry(0.35, 16);
    dotGeo.rotateX(-Math.PI / 2);
    const dotMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide
    });
    this.targetMarker.add(new THREE.Mesh(dotGeo, dotMat));

    this.targetMarker.position.set(0, -100, 0);
    this.targetMarker.visible = false;
    this.scene.add(this.targetMarker);
  }

  // 散落發光旋轉八面體星石 (Gems: 實例化網格，全圖僅 1 Draw Call)
  initCollectibles() {
    const gemGeo = new THREE.OctahedronGeometry(1.2, 0);
    const gemMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      roughness: 0.2,
      metalness: 0.8
    });

    const spots = [
      { x: 0, z: 8 },      // 中央舞台前
      { x: -14, z: 12 },   // 舞台兩側
      { x: 14, z: 12 },
      { x: -30, z: -10 },  // 往數學島大橋
      { x: -60, z: -15 },
      { x: 10, z: -35 },   // 往英語島大橋
      { x: 20, z: -60 },
      { x: 35, z: -25 },   // 往自然島大橋
      { x: 65, z: -40 },
      { x: 25, z: 25 },    // 往社會島大橋
      { x: 50, z: 45 },
      { x: -25, z: 30 },   // 往國語島大橋
      { x: -55, z: 60 },
      { x: 0, z: -20 },
      { x: -40, z: 10 }
    ];

    this.instancedGems = new THREE.InstancedMesh(gemGeo, gemMat, spots.length);
    this.instancedGems.castShadow = true;
    this.collectiblesGroup.add(this.instancedGems);

    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3(1, 1, 1);

    spots.forEach((spot, idx) => {
      m.compose(new THREE.Vector3(spot.x, HEX_HEIGHT + 1.8, spot.z), q, s);
      this.instancedGems.setMatrixAt(idx, m);
      this.collectibles.push({
        idx,
        x: spot.x,
        z: spot.z,
        baseY: HEX_HEIGHT + 1.8,
        active: true,
        rotSpeed: 2.0 + (idx % 3) * 0.5,
        rotY: 0
      });
    });
    this.instancedGems.instanceMatrix.needsUpdate = true;
  }

  // 各島放置神秘幸運盲盒 (Mystery Lucky Boxes: 1 個合併箱體 + 1 個實例化星標，共 2 個 Draw Calls)
  initLuckyChests() {
    const boxMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      emissive: 0xbe185d,
      roughness: 0.3,
      metalness: 0.7
    });
    const starMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xeab308,
      roughness: 0.1,
      metalness: 0.9
    });

    const chestSpots = [
      { x: -75, z: -25, island: '數學島' },
      { x: 30, z: -75, island: '英語島' },
      { x: 75, z: -45, island: '自然島' },
      { x: 55, z: 60, island: '社會島' },
      { x: -65, z: 70, island: '國語島' }
    ];

    const boxGeo = new THREE.BoxGeometry(2.4, 2.0, 2.4);
    const starGeo = new THREE.OctahedronGeometry(0.8, 0);
    const boxGeos = [];
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();

    chestSpots.forEach(spot => {
      m.compose(new THREE.Vector3(spot.x, HEX_HEIGHT + 1.0, spot.z), q, new THREE.Vector3(1, 1, 1));
      boxGeos.push(boxGeo.clone().applyMatrix4(m));
    });

    const mergedBoxes = BufferGeometryUtils.mergeGeometries(boxGeos);
    const boxesMesh = new THREE.Mesh(mergedBoxes, boxMat);
    boxesMesh.castShadow = true;
    this.chestsGroup.add(boxesMesh);

    this.instancedStars = new THREE.InstancedMesh(starGeo, starMat, chestSpots.length);
    this.chestsGroup.add(this.instancedStars);

    chestSpots.forEach((spot, idx) => {
      this.chests.push({
        idx,
        x: spot.x,
        z: spot.z,
        active: true,
        island: spot.island,
        rotSpeed: 2.2 + idx * 0.3,
        rotY: 0
      });
    });
  }

  // 輸入監聽 (鍵盤 WASD + 空白鍵跳躍 + B 打歌 + E 互動)
  setupInputListeners() {
    window.addEventListener('keydown', (e) => {
      if (['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) return;
      this.handleKey(e.code, true);

      if (e.code === 'Space') {
        e.preventDefault();
        this.jump();
      }
      if (e.code === 'KeyB') {
        this.dance();
      }
      if (e.code === 'KeyE') {
        this.triggerNearbyBuilding();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.handleKey(e.code, false);
    });

    window.addEventListener('blur', () => {
      this.keys.forward = false;
      this.keys.backward = false;
      this.keys.left = false;
      this.keys.right = false;
      this.isSprinting = false;
    });
  }

  handleKey(code, isDown) {
    let triggered = false;
    switch (code) {
      case 'KeyW':
      case 'ArrowUp':
        this.keys.forward = isDown;
        triggered = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.keys.backward = isDown;
        triggered = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.keys.left = isDown;
        triggered = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.keys.right = isDown;
        triggered = true;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.isSprinting = isDown;
        break;
    }

    // 若玩家按下移動鍵，自動切換至主角操控模式
    if (triggered && isDown && !this.isControlling) {
      this.togglePlayerControl(true);
    }
  }

  // 設定行動端虛擬搖桿輸入 (x: -1~1 左右, z: -1~1 前後)
  setVirtualInput(x, z) {
    if (!this.virtualInput) this.virtualInput = { x: 0, z: 0 };
    this.virtualInput.x = x;
    this.virtualInput.z = z;
    if ((x !== 0 || z !== 0) && !this.isControlling) {
      this.togglePlayerControl(true);
    }
  }

  // 跳躍機制
  jump() {
    if (this.isJumping || !this.playerMesh) return;
    this.isJumping = true;
    this.jumpVelocity = 13.5;
    this.audioSynth.playJump();
    this.togglePlayerControl(true);
  }

  // K-POP 舞台舞步互動 (原地 Wave 旋轉)
  dance() {
    if (!this.playerMesh || this.dancingTimer > 0) return;
    this.dancingTimer = 1.2;
    this.audioSynth.playCombo();
    this.showFloatingScore('🎵 練習生打歌熱舞！✨');
    if (window.reviewApp && window.reviewApp.people) {
      window.reviewApp.people.cheerAll();
    }
  }

  // 切換模式 (全景觀察 vs 玩家實體操縱)
  togglePlayerControl(enable) {
    const wasControlling = this.isControlling;
    this.isControlling = enable !== undefined ? enable : !this.isControlling;
    const btn = document.getElementById('btn-toggle-ctrl');
    const toast = document.getElementById('ctrl-help-toast');

    if (this.isControlling) {
      if (btn) btn.classList.add('active');
      if (toast) {
        toast.style.display = 'block';
        toast.style.opacity = '1';
        setTimeout(() => { if (toast) toast.style.opacity = '0'; }, 4000);
      }
      // 切換為操縱模式時，平滑運鏡至舒適高角度等距追隨視角
      if (this.playerMesh && window.reviewApp) {
        const pPos = this.playerMesh.position;
        const targetCamPos = new THREE.Vector3(pPos.x, pPos.y + 30, pPos.z + 36);
        const targetLookAt = new THREE.Vector3(pPos.x, pPos.y + 1.8, pPos.z);
        window.reviewApp.flyCameraTo(targetCamPos, targetLookAt, 0.55);
      }
    } else {
      if (btn) btn.classList.remove('active');
      if (toast) toast.style.display = 'none';
      this.targetMovePoint = null;
      if (this.targetMarker) this.targetMarker.visible = false;
    }
  }

  // 設定 Obby 模式啟用狀態
  setObbyMode(active, obbyCourse = null) {
    this.isObbyMode = active;
    this.obbyCourse = obbyCourse;
    if (active) {
      this.isControlling = true;
      if (this.controls) this.controls.enabled = true;
      if (this.playerMesh) {
        this.playerMesh.position.set(0, 2.8, 0);
        this.currentVelocity.set(0, 0, 0);
        this.jumpVelocity = 0;
        this.isJumping = false;
      }
      // 將相機移至 Obby 起點後方追隨
      if (this.camera && this.controls) {
        this.camera.position.set(0, 20, -18);
        this.controls.target.set(0, 3, 0);
      }
    } else {
      if (this.playerMesh) {
        this.playerMesh.position.set(0, HEX_HEIGHT + 0.2, 0);
        this.currentVelocity.set(0, 0, 0);
        this.jumpVelocity = 0;
        this.isJumping = false;
      }
      if (this.camera && this.controls) {
        this.camera.position.set(0, HEX_HEIGHT + 30, HEX_HEIGHT + 36);
        this.controls.target.set(0, HEX_HEIGHT + 1.8, 0);
      }
    }
  }

  // 點擊地面移動主角
  setMoveTarget(worldPos) {
    if (this.walkableCells && this.walkableCells.length > 0 && !this.isWalkable(worldPos.x, worldPos.z)) {
      return;
    }
    if (!this.targetMovePoint) {
      this.targetMovePoint = new THREE.Vector3();
    }
    this.targetMovePoint.set(worldPos.x, HEX_HEIGHT + 0.2, worldPos.z);
    if (this.targetMarker) {
      this.targetMarker.position.set(worldPos.x, HEX_HEIGHT + 0.22, worldPos.z);
      this.targetMarker.visible = true;
    }
    if (!this.isControlling) {
      this.togglePlayerControl(true);
    }
  }

  // 觸發靠近的建築
  triggerNearbyBuilding() {
    if (!this.nearbyBuilding) return;
    this.audioSynth.playClick();
    if (window.reviewApp) {
      window.reviewApp.showBuildingModal(this.nearbyBuilding);
    }
  }

  // 每幀更新：移動、跳躍物理、碰撞檢測與鏡頭平滑跟隨
  update(delta, time) {
    if (!this.playerMesh) {
      if (this.avatarManager && this.avatarManager.playerMesh) {
        this.playerMesh = this.avatarManager.playerMesh;
      } else {
        return;
      }
    }

    // 0. 特殊 Buff 與舞步計時器
    if (this.speedBuffTimer > 0) {
      this.speedBuffTimer -= delta;
      this.moveSpeed = 26.0;
    } else {
      this.moveSpeed = this.isSprinting ? 24.0 : this.baseMoveSpeed;
    }

    if (this.dancingTimer > 0) {
      this.dancingTimer -= delta;
      this.playerMesh.rotation.y += delta * 12.0; // 快速自轉舞步
    }

    // 1. 旋轉與浮動八面體寶石 + 拾取檢測 (實例化網格零 GC 更新，僅 1 Draw Call)
    if (this.instancedGems) {
      let needsGemUpdate = false;
      const pPos = this.playerMesh.position;

      for (let i = 0; i < this.collectibles.length; i++) {
        const item = this.collectibles[i];
        if (!item.active) continue;
        item.rotY += item.rotSpeed * delta;
        const curY = item.baseY + Math.sin(time * 3 + item.rotSpeed) * 0.3;
        this._gemPos.set(item.x, curY, item.z);
        this._gemQ.setFromAxisAngle(new THREE.Vector3(0, 1, 0), item.rotY);
        this._gemM.compose(this._gemPos, this._gemQ, this._gemS);
        this.instancedGems.setMatrixAt(i, this._gemM);
        needsGemUpdate = true;

        const dist = Math.hypot(pPos.x - item.x, pPos.z - item.z);
        if (dist < 2.6) {
          item.active = false;
          this._gemM.compose(new THREE.Vector3(0, -999, 0), this._gemQ, this._gemZero);
          this.instancedGems.setMatrixAt(i, this._gemM);
          this.collectGem(item);
        }
      }
      if (needsGemUpdate) {
        this.instancedGems.instanceMatrix.needsUpdate = true;
      }
    }

    // 2. 旋轉幸運盲盒頂部星標 + 碰撞開啟檢測 (實例化零 GC)
    if (this.instancedStars) {
      const pPos = this.playerMesh.position;
      let needsStarUpdate = false;
      for (let i = 0; i < this.chests.length; i++) {
        const chest = this.chests[i];
        if (!chest.active) continue;
        chest.rotY += chest.rotSpeed * delta;
        const curY = HEX_HEIGHT + 2.8 + Math.sin(time * 4) * 0.25;
        this._gemPos.set(chest.x, curY, chest.z);
        this._gemQ.setFromAxisAngle(new THREE.Vector3(0, 1, 0), chest.rotY);
        this._gemM.compose(this._gemPos, this._gemQ, this._gemS);
        this.instancedStars.setMatrixAt(i, this._gemM);
        needsStarUpdate = true;

        const dist = Math.hypot(pPos.x - chest.x, pPos.z - chest.z);
        if (dist < 3.2) {
          chest.active = false;
          this._gemM.compose(new THREE.Vector3(0, -999, 0), this._gemQ, this._gemZero);
          this.instancedStars.setMatrixAt(i, this._gemM);
          this.openChest(chest);
        }
      }
      if (needsStarUpdate) {
        this.instancedStars.instanceMatrix.needsUpdate = true;
      }
    }

    // 動態導航光環動畫 (旋轉與呼吸微擴散)
    if (this.targetMarker && this.targetMarker.visible) {
      this.markerRing.rotation.z += delta * 3.5;
      const pulse = 1.0 + Math.sin(time * 8) * 0.12;
      this.targetMarker.scale.set(pulse, pulse, pulse);
    }

    // 3. 移動邏輯 (WASD / 虛擬搖桿 / 點擊尋路) — 物理慣性加減速 (零 GC)
    const moveDir = this._vMoveDir.set(0, 0, 0);
    if (this.keys.forward) moveDir.z -= 1;
    if (this.keys.backward) moveDir.z += 1;
    if (this.keys.left) moveDir.x -= 1;
    if (this.keys.right) moveDir.x += 1;

    // 整合平板虛擬搖桿輸入
    if (this.virtualInput && (this.virtualInput.x !== 0 || this.virtualInput.z !== 0)) {
      moveDir.x += this.virtualInput.x;
      moveDir.z += this.virtualInput.z;
    }

    const desiredVelocity = this._vDesiredVel.set(0, 0, 0);

    if (moveDir.lengthSq() > 0) {
      this.targetMovePoint = null;
      if (this.targetMarker) this.targetMarker.visible = false;
      if (moveDir.lengthSq() > 1.0) {
        moveDir.normalize();
      }

      // 依相機水平朝向計算前進方向 (按 W 永遠是朝畫面正前方前進)
      const camForward = this._vCamForward;
      this.camera.getWorldDirection(camForward);
      camForward.y = 0;
      camForward.normalize();

      const camRight = this._vCamRight.set(-camForward.z, 0, camForward.x);
      const moveVec = this._vMoveVec.set(0, 0, 0)
        .addScaledVector(camForward, -moveDir.z)
        .addScaledVector(camRight, moveDir.x)
        .normalize();

      desiredVelocity.copy(moveVec).multiplyScalar(this.moveSpeed);
    } else if (this.targetMovePoint) {
      const diff = this._vDiff.subVectors(this.targetMovePoint, this.playerMesh.position);
      diff.y = 0;
      const dist = diff.length();

      if (dist > 0.4) {
        // 靠近目標時平滑減速，避免撞牆般驟停
        const arrivalSpeed = dist < 2.5 ? Math.max(3.5, this.moveSpeed * (dist / 2.5)) : this.moveSpeed;
        desiredVelocity.copy(diff.normalize()).multiplyScalar(arrivalSpeed);
      } else {
        this.targetMovePoint = null;
        if (this.targetMarker) this.targetMarker.visible = false;
      }
    }

    // 物理慣性與阻尼平滑插值 (加速起步平順、釋放按鍵自然滑行)
    const accelFactor = desiredVelocity.lengthSq() > 0.01
      ? (1 - Math.exp(-15 * delta))
      : (1 - Math.exp(-12 * delta));
    this.currentVelocity.lerp(desiredVelocity, accelFactor);

    // 邊界約束與滑牆物理
    const stepX = this.currentVelocity.x * delta;
    const stepZ = this.currentVelocity.z * delta;
    const currentX = this.playerMesh.position.x;
    const currentZ = this.playerMesh.position.z;

    if (this.isObbyMode) {
      // Obby 模式：直接依速度更新座標 (無邊界拘束，允許在浮空跳台間跑酷與踩空掉落)
      this.playerMesh.position.x += stepX;
      this.playerMesh.position.z += stepZ;
    } else if (this.walkableCells && this.walkableCells.length > 0) {
      const nextX = currentX + stepX;
      const nextZ = currentZ + stepZ;
      if (this.isWalkable(nextX, nextZ)) {
        this.playerMesh.position.x = nextX;
        this.playerMesh.position.z = nextZ;
      } else if (this.isWalkable(nextX, currentZ)) {
        this.playerMesh.position.x = nextX;
        this.currentVelocity.z = 0;
      } else if (this.isWalkable(currentX, nextZ)) {
        this.playerMesh.position.z = nextZ;
        this.currentVelocity.x = 0;
      } else {
        this.currentVelocity.set(0, 0, 0);
      }
    } else {
      this.playerMesh.position.addScaledVector(this.currentVelocity, delta);
    }

    // 墜海防護重置 (島嶼模式專用)
    if (!this.isObbyMode) {
      if (this.playerMesh.position.y < HEX_HEIGHT - 3 || (!this.isWalkable(this.playerMesh.position.x, this.playerMesh.position.z) && Math.hypot(this.playerMesh.position.x, this.playerMesh.position.z) > 160)) {
        this.playerMesh.position.set(0, HEX_HEIGHT + 0.2, 0);
        this.currentVelocity.set(0, 0, 0);
        this.targetMovePoint = null;
        if (this.targetMarker) this.targetMarker.visible = false;
      }
    }

    const groundSpeed = Math.hypot(this.currentVelocity.x, this.currentVelocity.z);
    const isMoving = groundSpeed > 0.35;

    // 4. 最短弧平滑轉向 (根據實際運動速度向量方向平滑轉向)
    if (isMoving && this.dancingTimer <= 0) {
      const targetAngle = Math.atan2(this.currentVelocity.x, this.currentVelocity.z);
      let diffAngle = (targetAngle - this.playerMesh.rotation.y) % (Math.PI * 2);
      if (diffAngle < -Math.PI) diffAngle += Math.PI * 2;
      if (diffAngle > Math.PI) diffAngle -= Math.PI * 2;
      const turnFactor = 1 - Math.exp(-18 * delta);
      this.playerMesh.rotation.y += diffAngle * turnFactor;
    }

    // 5. 肢體步態動畫 (可愛生動 Q 版小碎步與應援揮舞)
    if (this.playerMesh.userData && this.playerMesh.userData.legL) {
      const { legL, legR, armL, armR, body } = this.playerMesh.userData;
      if (isMoving && !this.isJumping) {
        // 輕快生動的 Q 版小跑步頻率
        this.walkCycle += delta * groundSpeed * 1.35;
        const legAngle = Math.sin(this.walkCycle) * 0.38;
        legL.rotation.x = legAngle;
        legR.rotation.x = -legAngle;
        if (armL) armL.rotation.x = -legAngle * 0.85; // 左臂自然對稱擺動
        if (armR) armR.rotation.x = -0.15 + Math.sin(this.walkCycle) * 0.12; // 右臂揮舞應援棒
        if (body) {
          body.rotation.x = 0.08; // 自然跑步微前傾
          body.rotation.z = Math.sin(this.walkCycle) * 0.03; // 重心左右微晃動
        }
      } else {
        // 站立平滑復位
        const damp = 1 - Math.exp(-12 * delta);
        legL.rotation.x = THREE.MathUtils.lerp(legL.rotation.x, 0, damp);
        legR.rotation.x = THREE.MathUtils.lerp(legR.rotation.x, 0, damp);
        if (armL) armL.rotation.x = THREE.MathUtils.lerp(armL.rotation.x, 0, damp);
        if (armR) armR.rotation.x = THREE.MathUtils.lerp(armR.rotation.x, 0, damp);
        if (body) {
          body.rotation.x = THREE.MathUtils.lerp(body.rotation.x, 0, damp);
          body.rotation.z = THREE.MathUtils.lerp(body.rotation.z, 0, damp);
        }
      }
    }

    // 6. 垂直跳躍物理與踏地步態起伏
    if (this.isObbyMode) {
      // Obby 模式動態跳台高度與下墜物理
      const pY = this.playerMesh.position.y;
      const groundY = this.obbyCourse ? this.obbyCourse.getGroundHeightAt(this.playerMesh.position.x, this.playerMesh.position.z, pY) : -999;

      if (this.isJumping || pY > groundY + 0.05) {
        this.jumpVelocity += this.gravity * delta;
        this.playerMesh.position.y += this.jumpVelocity * delta;

        // 若下墜過程中穿越了腳下的跳台表面
        if (this.jumpVelocity <= 0 && this.playerMesh.position.y <= groundY && groundY > -900) {
          this.playerMesh.position.y = groundY;
          this.isJumping = false;
          this.jumpVelocity = 0;
        }
      } else {
        if (groundY > -900) {
          this.playerMesh.position.y = groundY;
          this.jumpVelocity = 0;
          this.isJumping = false;
        } else {
          // 腳底踏空！直接觸發下墜
          this.isJumping = true;
          this.jumpVelocity = 0;
        }
      }

      // 呼叫 Obby 障礙物碰撞與墜海重生
      if (this.obbyCourse) {
        this.obbyCourse.update(delta, time, this);
      }
    } else {
      // 普通島嶼模式
      const groundY = HEX_HEIGHT + 0.2;
      if (this.isJumping) {
        this.jumpVelocity += this.gravity * delta;
        this.playerMesh.position.y += this.jumpVelocity * delta;

        if (this.playerMesh.position.y <= groundY) {
          this.playerMesh.position.y = groundY;
          this.isJumping = false;
          this.jumpVelocity = 0;
        }
      } else {
        if (isMoving) {
          const strideBounce = Math.abs(Math.sin(this.walkCycle)) * 0.06;
          this.playerMesh.position.y = groundY + strideBounce;
        } else if (this.dancingTimer <= 0) {
          this.playerMesh.position.y = groundY;
        }
      }
    }

    // 7. 靠近建築物偵測 (島嶼模式專用)
    if (!this.isObbyMode) {
      this.checkNearbyBuildings();
    }

    // 8. 第三人稱相機平滑無縫追隨 (與 OrbitControls 完美相容，零 GC)
    if (this.isControlling) {
      const pPos = this.playerMesh.position;
      const targetLookAt = this._vTargetLookAt.set(pPos.x, pPos.y + 1.8, pPos.z);

      if (!window.reviewApp || !window.reviewApp.cameraLerp) {
        const prevTarget = this._vPrevTarget.copy(this.controls.target);
        this.controls.target.lerp(targetLookAt, 1 - Math.exp(-12 * delta));
        const targetDelta = this._vTargetDelta.subVectors(this.controls.target, prevTarget);
        this.camera.position.add(targetDelta);

        const camDist = this.camera.position.distanceTo(targetLookAt);
        if (camDist > 75) {
          const resetCamPos = this._vCamOffset.set(targetLookAt.x, targetLookAt.y + 30, targetLookAt.z + 36);
          this.camera.position.lerp(resetCamPos, 0.05);
        }
      } else if (window.reviewApp && window.reviewApp.cameraLerp) {
        // 運鏡中即時同步追隨主角移動，杜絕落後瞬移
        window.reviewApp.cameraLerp.endLookAt.copy(targetLookAt);
        window.reviewApp.cameraLerp.endPos.set(pPos.x, pPos.y + 30, pPos.z + 36);
      }
    }
  }

  // 拾取寶石
  collectGem(item) {
    item.active = false;
    this.audioSynth.playCorrect();
    this.quizEngine.playerState.coins += 10;
    this.quizEngine.saveState();
    this.showFloatingScore('+10 🪙 星光石！');
  }

  // 開啟幸運盲盒 (開箱驚喜隨機事件)
  openChest(chest) {
    chest.active = false;
    this.audioSynth.playChestOpen();

    // 隨機驚喜事件 (3 種事件)
    const rand = Math.random();
    if (rand < 0.4) {
      // 獎勵 1：超級金幣禮包
      this.quizEngine.playerState.coins += 50;
      this.quizEngine.saveState();
      this.showFloatingScore('🎁 盲盒大獎！+50 🪙 星幣！');
    } else if (rand < 0.7) {
      // 獎勵 2：疾風加速鞋 (10 秒)
      this.speedBuffTimer = 10.0;
      this.audioSynth.playPowerUp();
      this.showFloatingScore('⚡ 疾風暴走鞋！速度狂飆 10 秒！');
    } else {
      // 獎勵 3：全島熱舞狂歡
      this.showFloatingScore('🪩 全島練習生打歌狂歡派對！🎉');
      if (window.reviewApp && window.reviewApp.people) {
        window.reviewApp.people.cheerAll();
      }
    }
  }

  showFloatingScore(text) {
    const el = document.createElement('div');
    el.className = 'floating-score-pill';
    el.textContent = text;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1600);
  }

  // 偵測是否走到建築門口
  checkNearbyBuildings() {
    if (!window.reviewApp || !window.reviewApp.world) return;
    const buildings = window.reviewApp.world.buildingMeshes;
    let found = null;
    let minDist = 12.0;

    buildings.forEach((mesh, id) => {
      const d = this.playerMesh.position.distanceTo(mesh.position);
      if (d < minDist) {
        minDist = d;
        found = mesh.userData;
      }
    });

    const banner = document.getElementById('nearby-prompt-banner');
    if (found) {
      this.nearbyBuilding = found;
      if (banner) {
        banner.style.display = 'flex';
        const nameElem = document.getElementById('nearby-b-name');
        if (nameElem) nameElem.textContent = found.name;
      }
    } else {
      this.nearbyBuilding = null;
      if (banner) banner.style.display = 'none';
    }
  }
}
