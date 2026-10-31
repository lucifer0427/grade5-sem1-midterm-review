// player-controller.js: 玩家 3D 角色即時操縱、跳躍、加速、拾取星石與幸運盲盒系統
import * as THREE from 'three';
import { GeoPool, Materials, Pool } from './kit.js';
import { HEX_HEIGHT } from './world.js';

export class PlayerController {
  constructor(scene, camera, controls, avatarManager, audioSynth, quizEngine) {
    this.scene = scene;
    this.camera = camera;
    this.controls = controls;
    this.avatarManager = avatarManager;
    this.audioSynth = audioSynth;
    this.quizEngine = quizEngine;

    this.isControlling = false; // 是否處於第三人稱主角操控模式
    this.playerMesh = avatarManager.playerMesh;

    // 移動與跳躍狀態
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false
    };

    this.baseMoveSpeed = 16.0;
    this.moveSpeed = this.baseMoveSpeed;
    this.isSprinting = false;
    this.targetMovePoint = null; // 點擊地面移動目標

    // 垂直跳躍物理
    this.isJumping = false;
    this.jumpVelocity = 0;
    this.gravity = -36.0;

    // 特殊狀態 (加速 Buff / 跳舞中)
    this.speedBuffTimer = 0;
    this.dancingTimer = 0;

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

    this.setupInputListeners();
  }

  // 散落發光旋轉八面體星石 (Gems)
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

    spots.forEach((spot, idx) => {
      const gem = new THREE.Mesh(gemGeo, gemMat);
      gem.position.set(spot.x, HEX_HEIGHT + 1.8, spot.z);
      gem.castShadow = true;
      this.collectiblesGroup.add(gem);

      this.collectibles.push({
        mesh: gem,
        baseY: HEX_HEIGHT + 1.8,
        active: true,
        rotSpeed: 2.0 + (idx % 3) * 0.5
      });
    });
  }

  // 各島放置神秘幸運盲盒 (Mystery Lucky Boxes)
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

    chestSpots.forEach((spot, idx) => {
      const chestObj = new THREE.Group();

      // 底座箱體
      const boxGeo = new THREE.BoxGeometry(2.4, 2.0, 2.4);
      const boxMesh = new THREE.Mesh(boxGeo, boxMat);
      boxMesh.position.y = 1.0;
      boxMesh.castShadow = true;
      chestObj.add(boxMesh);

      // 上蓋飾條金邊
      const rimGeo = new THREE.BoxGeometry(2.6, 0.4, 2.6);
      const rimMesh = new THREE.Mesh(rimGeo, starMat);
      rimMesh.position.y = 2.1;
      chestObj.add(rimMesh);

      // 頂部旋轉發光星標
      const starGeo = new THREE.OctahedronGeometry(0.8, 0);
      const starMesh = new THREE.Mesh(starGeo, starMat);
      starMesh.position.y = 3.6;
      chestObj.add(starMesh);

      chestObj.position.set(spot.x, HEX_HEIGHT, spot.z);
      this.chestsGroup.add(chestObj);

      this.chests.push({
        group: chestObj,
        starMesh: starMesh,
        active: true,
        island: spot.island,
        rotSpeed: 2.2 + idx * 0.3
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
    this.isControlling = enable !== undefined ? enable : !this.isControlling;
    const btn = document.getElementById('btn-toggle-ctrl');
    const toast = document.getElementById('ctrl-help-toast');

    if (this.isControlling) {
      if (btn) btn.classList.add('active');
      if (toast) {
        toast.style.display = 'block';
        toast.style.opacity = '1';
        setTimeout(() => { if (toast) toast.style.opacity = '0'; }, 5000);
      }
    } else {
      if (btn) btn.classList.remove('active');
      if (toast) toast.style.display = 'none';
      this.targetMovePoint = null;
    }
  }

  // 點擊地面移動主角
  setMoveTarget(worldPos) {
    this.targetMovePoint = new THREE.Vector3(worldPos.x, HEX_HEIGHT + 1.2, worldPos.z);
    this.togglePlayerControl(true);
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
    if (!this.playerMesh) return;

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

    // 1. 旋轉與浮動八面體寶石 + 拾取檢測
    this.collectibles.forEach(item => {
      if (!item.active) return;
      item.mesh.rotation.y += item.rotSpeed * delta;
      item.mesh.position.y = item.baseY + Math.sin(time * 3 + item.rotSpeed) * 0.3;

      const dist = this.playerMesh.position.distanceTo(item.mesh.position);
      if (dist < 2.6) {
        this.collectGem(item);
      }
    });

    // 2. 旋轉幸運盲盒頂部星標 + 碰撞開啟檢測
    this.chests.forEach(chest => {
      if (!chest.active) return;
      chest.starMesh.rotation.y += chest.rotSpeed * delta;
      chest.starMesh.position.y = 3.6 + Math.sin(time * 4) * 0.25;

      const dist = this.playerMesh.position.distanceTo(chest.group.position);
      if (dist < 3.2) {
        this.openChest(chest);
      }
    });

    // 3. 移動邏輯 (WASD / 點擊尋路)
    let moving = false;
    let moveDir = new THREE.Vector3();

    if (this.keys.forward) moveDir.z -= 1;
    if (this.keys.backward) moveDir.z += 1;
    if (this.keys.left) moveDir.x -= 1;
    if (this.keys.right) moveDir.x += 1;

    if (moveDir.lengthSq() > 0) {
      this.targetMovePoint = null;
      moveDir.normalize();
      moving = true;

      // 依相機水平朝向計算前進方向
      const camForward = new THREE.Vector3();
      this.camera.getWorldDirection(camForward);
      camForward.y = 0;
      camForward.normalize();

      const camRight = new THREE.Vector3(-camForward.z, 0, camForward.x);
      const moveVec = new THREE.Vector3()
        .addScaledVector(camForward, -moveDir.z)
        .addScaledVector(camRight, moveDir.x)
        .normalize();

      this.playerMesh.position.addScaledVector(moveVec, this.moveSpeed * delta);

      if (this.dancingTimer <= 0) {
        const targetAngle = Math.atan2(moveVec.x, moveVec.z);
        this.playerMesh.rotation.y = THREE.MathUtils.lerp(this.playerMesh.rotation.y, targetAngle, 0.2);
      }
    } else if (this.targetMovePoint) {
      const diff = new THREE.Vector3().subVectors(this.targetMovePoint, this.playerMesh.position);
      diff.y = 0;
      const dist = diff.length();

      if (dist > 0.8) {
        diff.normalize();
        this.playerMesh.position.addScaledVector(diff, this.moveSpeed * delta);
        if (this.dancingTimer <= 0) {
          const targetAngle = Math.atan2(diff.x, diff.z);
          this.playerMesh.rotation.y = THREE.MathUtils.lerp(this.playerMesh.rotation.y, targetAngle, 0.2);
        }
        moving = true;
      } else {
        this.targetMovePoint = null;
      }
    }

    // 4. 垂直跳躍物理
    const groundY = HEX_HEIGHT + 1.2;
    if (this.isJumping) {
      this.jumpVelocity += this.gravity * delta;
      this.playerMesh.position.y += this.jumpVelocity * delta;

      if (this.playerMesh.position.y <= groundY) {
        this.playerMesh.position.y = groundY;
        this.isJumping = false;
        this.jumpVelocity = 0;
      }
    } else {
      // 地面行走擺動
      if (moving) {
        this.playerMesh.position.y = groundY + Math.abs(Math.sin(time * (this.moveSpeed > 20 ? 18 : 12))) * 0.35;
      } else if (this.dancingTimer <= 0) {
        this.playerMesh.position.y = groundY + Math.abs(Math.sin(time * 3)) * 0.15;
      }
    }

    // 5. 靠近建築物偵測
    this.checkNearbyBuildings();

    // 6. 第三人稱視角追隨 (Follow Cam)
    if (this.isControlling) {
      const pPos = this.playerMesh.position;
      const idealCamPos = new THREE.Vector3(
        pPos.x - Math.sin(this.playerMesh.rotation.y) * 26,
        pPos.y + 18,
        pPos.z - Math.cos(this.playerMesh.rotation.y) * 26
      );

      this.camera.position.lerp(idealCamPos, 0.08);
      this.controls.target.lerp(new THREE.Vector3(pPos.x, pPos.y + 3, pPos.z), 0.1);
    }
  }

  // 拾取寶石
  collectGem(item) {
    item.active = false;
    this.audioSynth.playCorrect();
    this.quizEngine.playerState.coins += 10;
    this.quizEngine.saveState();

    // 消失動畫
    let t = 0;
    const animInterval = setInterval(() => {
      t += 0.1;
      item.mesh.position.y += 0.4;
      item.mesh.scale.multiplyScalar(0.85);
      if (t >= 0.6) {
        clearInterval(animInterval);
        this.collectiblesGroup.remove(item.mesh);
      }
    }, 30);

    this.showFloatingScore('+10 🪙 星光石！');
  }

  // 開啟幸運盲盒 (開箱驚喜隨機事件)
  openChest(chest) {
    chest.active = false;
    this.audioSynth.playChestOpen();

    // 盲盒開蓋爆開動畫
    let t = 0;
    const animInterval = setInterval(() => {
      t += 0.1;
      chest.group.position.y += 0.5;
      chest.group.scale.multiplyScalar(0.88);
      if (t >= 0.7) {
        clearInterval(animInterval);
        this.chestsGroup.remove(chest.group);
      }
    }, 30);

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
