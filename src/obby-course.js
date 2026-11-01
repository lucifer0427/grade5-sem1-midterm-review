// src/obby-course.js: 3D Roblox 風格闖關跑酷系統 (Trivia Obby)
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

export class ObbyCourse {
  constructor(scene, audioSynth, quizEngine) {
    this.scene = scene;
    this.audioSynth = audioSynth;
    this.quizEngine = quizEngine;

    this.group = new THREE.Group();
    this.group.name = 'obbyCourse';
    this.group.visible = false;
    this.scene.add(this.group);

    // 關卡進度與狀態
    this.isActive = false;
    this.currentCheckpointIndex = 0;
    this.startTime = 0;
    this.elapsedTime = 0;
    this.fallCount = 0;
    this.isCompleted = false;

    // 動態幾何體與障礙物管理
    this.staticColliders = [];      // 靜態跳台 AABB { minX, maxX, minY, maxY, minZ, maxZ, yTop }
    this.bouncePads = [];            // 彈跳蹦床 { x, y, z, radius, power }
    this.movingPlatforms = [];       // 移動平台 { mesh, minX, maxX, speed, dir, currentX, yTop, width, depth }
    this.spinningBeams = [];         // 旋轉雷射/圓木 { mesh, speed, radius, y, z }
    this.blinkingBlocks = [];        // 閃爍方塊 { mesh, mat, cycleTime, solidDuration, isSolid, collider }
    this.triviaGates = [];           // 知識通關門 { doors: [{ mesh, collider, isCorrect, textMesh }], currentQuestion: null }
    this.checkpoints = [];           // 存檔點 { index, pos: THREE.Vector3, mesh, lightMesh }

    // 零 GC 預配置向量
    this._vTmp = new THREE.Vector3();
    this._vDelta = new THREE.Vector3();

    // 建立 5 大關卡跑酷地圖
    this.buildCourse();
  }

  // 建構 5 大關卡跑酷地形與障礙物
  buildCourse() {
    const staticGeos = [];
    const staticMats = [];

    // 材質快取
    const colors = [
      0xec4899, // 粉紅
      0x8b5cf6, // 紫色
      0x3b82f6, // 湛藍
      0x10b981, // 翠綠
      0xf59e0b, // 金黃
      0xef4444  // 鮮紅
    ];

    // ----------------------------------------------------
    // Stage 1: 起點平台與彩虹六角跳板 + 彈跳蹦床
    // ----------------------------------------------------
    // 起點圓形/六角大停機坪
    this.createStaticHexPlatform(0, 2, 0, 7, 0x6366f1);
    this.addCheckpoint(0, new THREE.Vector3(0, 2.8, 0), "起點大廳");

    // 6 階高低起伏的彩虹跳階
    const stage1Steps = [
      { x: 0, y: 2.8, z: 8, r: 2.2, color: colors[0] },
      { x: 3, y: 3.8, z: 12, r: 2.0, color: colors[1] },
      { x: -2.5, y: 5.0, z: 16.5, r: 1.9, color: colors[2] },
      { x: 3.2, y: 6.2, z: 21, r: 1.8, color: colors[3] },
      { x: 0, y: 7.2, z: 25.5, r: 2.0, color: colors[4] },
      { x: 0, y: 8.0, z: 30, r: 2.2, color: colors[5] }
    ];

    stage1Steps.forEach(s => {
      this.createStaticHexPlatform(s.x, s.y, s.z, s.r, s.color);
    });

    // 超級彈跳蹦床 (Super Bounce Pad: z=35, y=8.0)
    this.createBouncePad(0, 8.2, 35, 2.5, 22.0);

    // ----------------------------------------------------
    // Stage 2: 旋轉雷射圓木與閃爍消失方塊
    // ----------------------------------------------------
    // 接落平台 (由蹦床高高躍入)
    this.createStaticBoxPlatform(0, 14, 48, 8, 1, 8, 0x4f46e5);
    this.addCheckpoint(1, new THREE.Vector3(0, 15.0, 48), "Stage 2: 旋轉雷射站");

    // 2 根旋轉橫木
    this.createSpinningBeam(0, 15.8, 56, 10, 0.7, 1.8, 0xf43f5e);
    this.createStaticBoxPlatform(0, 14, 63, 6, 1, 6, 0x3b82f6);
    this.createSpinningBeam(0, 15.8, 70, 11, 0.7, -2.2, 0xf43f5e);
    this.createStaticBoxPlatform(0, 14, 77, 6, 1, 6, 0x10b981);

    // 4 個週期閃爍方塊 (Blinking Blocks: 踩在消失狀態會跌落)
    const blinkZ = [83, 88, 93, 98];
    blinkZ.forEach((bz, idx) => {
      this.createBlinkingBlock((idx % 2 === 0 ? 1.5 : -1.5), 14, bz, 3.2, 0.8, 3.2, idx * 0.6);
    });

    // ----------------------------------------------------
    // Stage 3: 知識通關門 (Trivia Gates)
    // ----------------------------------------------------
    // 答題準備前哨站
    this.createStaticBoxPlatform(0, 14, 106, 10, 1, 8, 0x8b5cf6);
    this.addCheckpoint(2, new THREE.Vector3(0, 15.0, 106), "Stage 3: 知識大通關");

    // 建立 Trivia Gate 實體
    this.buildTriviaGates(116);

    // 答對通過後之緩衝平台
    this.createStaticBoxPlatform(0, 14, 126, 10, 1, 8, 0x10b981);

    // ----------------------------------------------------
    // Stage 4: 巡航移動平台與高空窄獨木
    // ----------------------------------------------------
    // Checkpoint 3 平台
    this.createStaticBoxPlatform(0, 14, 134, 7, 1, 7, 0xf59e0b);
    this.addCheckpoint(3, new THREE.Vector3(0, 15.0, 134), "Stage 4: 巡航獨木站");

    // 2 座沿 X 軸左右往返平移的巡航平台 (Moving Platforms)
    this.createMovingPlatform(0, 14.5, 142, 4.5, 0.8, 4.5, -6, 6, 3.5, 0x06b6d4);
    this.createStaticBoxPlatform(0, 15, 150, 4, 1, 4, 0x64748b);
    this.createMovingPlatform(0, 15.5, 158, 4.5, 0.8, 4.5, -7, 7, 4.2, 0x06b6d4);
    this.createStaticBoxPlatform(0, 16, 166, 5, 1, 5, 0x64748b);

    // 18m 高空極窄獨木橋 (寬度僅 1.2m)
    this.createStaticBoxPlatform(0, 16.5, 178, 1.4, 0.8, 18, 0xe11d48);

    // ----------------------------------------------------
    // Stage 5: 出道巨塔星光螺旋階與終點大獎台
    // ----------------------------------------------------
    // 螺旋塔起跳平台
    this.createStaticBoxPlatform(0, 17, 192, 8, 1, 8, 0xec4899);
    this.addCheckpoint(4, new THREE.Vector3(0, 18.0, 192), "Stage 5: 巨塔衝刺登頂");

    // 8 階環繞巨塔向上攀升的星光浮空石階
    const towerSteps = 8;
    for (let i = 0; i < towerSteps; i++) {
      const angle = (i / towerSteps) * Math.PI * 2;
      const radius = 6.5;
      const stepX = Math.cos(angle) * radius;
      const stepZ = 202 + Math.sin(angle) * radius;
      const stepY = 17.5 + (i * 1.5); // 逐步爬升至 29.5
      this.createStaticHexPlatform(stepX, stepY, stepZ, 1.8, colors[i % colors.length]);
    }

    // 頂部終點 K-POP 出道大獎台 (Winner Podium: y=31, z=202)
    this.createWinnerPodium(0, 30.5, 202);
  }

  // 建立靜態六角形跳板
  createStaticHexPlatform(x, y, z, radius, colorHex) {
    const geo = new THREE.CylinderGeometry(radius, radius, 1.2, 6);
    const mat = new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.35,
      metalness: 0.25
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.group.add(mesh);

    // 註冊靜態 AABB 碰撞體
    const halfWidth = radius * 0.95;
    this.staticColliders.push({
      minX: x - halfWidth,
      maxX: x + halfWidth,
      minZ: z - halfWidth,
      maxZ: z + halfWidth,
      minY: y - 0.6,
      maxY: y + 0.8,
      yTop: y + 0.6
    });

    return mesh;
  }

  // 建立靜態長方體跳台
  createStaticBoxPlatform(x, y, z, width, height, depth, colorHex) {
    const geo = new THREE.BoxGeometry(width, height, depth);
    const mat = new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.35,
      metalness: 0.2
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.group.add(mesh);

    this.staticColliders.push({
      minX: x - width / 2,
      maxX: x + width / 2,
      minZ: z - depth / 2,
      maxZ: z + depth / 2,
      minY: y - height / 2,
      maxY: y + height / 2 + 0.2,
      yTop: y + height / 2
    });

    return mesh;
  }

  // 建立超級彈跳蹦床 (Super Bounce Pad)
  createBouncePad(x, y, z, radius, power) {
    const padGroup = new THREE.Group();
    padGroup.position.set(x, y, z);

    // 底座
    const baseGeo = new THREE.CylinderGeometry(radius + 0.3, radius + 0.4, 0.6, 24);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    padGroup.add(baseMesh);

    // 霓虹發光跳躍彈簧面
    const padGeo = new THREE.CylinderGeometry(radius, radius, 0.4, 24);
    const padMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0xea580c,
      emissiveIntensity: 0.7,
      roughness: 0.2
    });
    const padMesh = new THREE.Mesh(padGeo, padMat);
    padMesh.position.y = 0.3;
    padGroup.add(padMesh);

    this.group.add(padGroup);

    // 註冊蹦床數據
    this.bouncePads.push({
      x,
      y: y + 0.5,
      z,
      radius,
      power,
      mesh: padMesh
    });

    // 蹦床本體也具備普通立足點
    this.staticColliders.push({
      minX: x - radius,
      maxX: x + radius,
      minZ: z - radius,
      maxZ: z + radius,
      minY: y - 0.3,
      maxY: y + 0.6,
      yTop: y + 0.5
    });
  }

  // 建立旋轉橫木障礙 (Spinning Laser Beams)
  createSpinningBeam(x, y, z, length, radius, rotSpeed, colorHex) {
    const geo = new THREE.CylinderGeometry(radius, radius, length, 16);
    geo.rotateZ(Math.PI / 2); // 橫躺
    const mat = new THREE.MeshStandardMaterial({
      color: colorHex,
      emissive: colorHex,
      emissiveIntensity: 0.6,
      roughness: 0.2
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    this.group.add(mesh);

    this.spinningBeams.push({
      mesh,
      speed: rotSpeed,
      length,
      radius,
      y,
      z,
      x
    });
  }

  // 建立閃爍消失方塊 (Blinking Blocks)
  createBlinkingBlock(x, y, z, width, height, depth, offsetPhase) {
    const geo = new THREE.BoxGeometry(width, height, depth);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.95,
      roughness: 0.3
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    this.group.add(mesh);

    this.blinkingBlocks.push({
      mesh,
      mat,
      x,
      y,
      z,
      width,
      height,
      depth,
      phase: offsetPhase,
      isSolid: true,
      cycle: 2.8,        // 2.8 秒一循環
      solidDuration: 1.8  // 前 1.8 秒實體，後 1.0 秒透明虛無
    });
  }

  // 建立沿 X 軸往返巡航的移動平台 (Moving Cruise Platform)
  createMovingPlatform(x, y, z, width, height, depth, minX, maxX, speed, colorHex) {
    const geo = new THREE.BoxGeometry(width, height, depth);
    const mat = new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.3,
      metalness: 0.3
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.group.add(mesh);

    this.movingPlatforms.push({
      mesh,
      minX,
      maxX,
      speed,
      dir: 1,
      x,
      y,
      z,
      width,
      height,
      depth,
      yTop: y + height / 2,
      lastDeltaX: 0
    });
  }

  // 建立知識通關門 (Trivia Gate: 3 扇門，只有 1 扇具實體，錯的穿透墜海)
  buildTriviaGates(zPos) {
    const gateGroup = new THREE.Group();
    gateGroup.position.set(0, 14, zPos);

    const doorSpacing = 4.2;
    const doorWidth = 3.2;
    const doorHeight = 4.8;
    const bridgeLength = 10.0;

    // 建立 3 扇門對應之跳板
    const doors = [];
    const doorIndices = [-1, 0, 1]; // 左門、中門、右門

    doorIndices.forEach((offset, idx) => {
      const doorX = offset * doorSpacing;

      // 橋面踏板
      const bridgeGeo = new THREE.BoxGeometry(doorWidth, 0.8, bridgeLength);
      const bridgeMat = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        roughness: 0.4
      });
      const bridgeMesh = new THREE.Mesh(bridgeGeo, bridgeMat);
      bridgeMesh.position.set(doorX, 0, bridgeLength / 2);
      bridgeMesh.castShadow = true;
      bridgeMesh.receiveShadow = true;
      gateGroup.add(bridgeMesh);

      // 門框拱門
      const frameGeo = new THREE.BoxGeometry(doorWidth + 0.4, doorHeight, 0.6);
      const frameMat = new THREE.MeshStandardMaterial({
        color: 0x6366f1,
        metalness: 0.5
      });
      const frameMesh = new THREE.Mesh(frameGeo, frameMat);
      frameMesh.position.set(doorX, doorHeight / 2, 0.3);
      gateGroup.add(frameMesh);

      doors.push({
        index: idx,
        x: doorX,
        zWorld: zPos + bridgeLength / 2,
        bridgeMesh,
        isCorrect: false, // 每次出題動態指定
        width: doorWidth,
        length: bridgeLength,
        yTop: 14 + 0.4
      });
    });

    this.group.add(gateGroup);
    this.triviaGateData = {
      group: gateGroup,
      doors,
      zStart: zPos,
      zEnd: zPos + bridgeLength,
      currentQuestion: null
    };

    // 初始化題目
    this.refreshTriviaQuestion();
  }

  // 動態刷新知識通關門的考題
  refreshTriviaQuestion() {
    if (!this.triviaGateData || !this.quizEngine || !this.quizEngine.allQuestions) return;

    const questions = this.quizEngine.allQuestions;
    const q = questions[Math.floor(Math.random() * questions.length)];
    this.triviaGateData.currentQuestion = q;

    // 隨機選一個門為正確解答門
    const correctDoorIndex = Math.floor(Math.random() * 3);
    this.triviaGateData.doors.forEach((door, idx) => {
      door.isCorrect = (idx === correctDoorIndex);
      // 正確與錯誤門的外觀微調 (正確門實心藍，其餘外觀一致，但未踏上不可見破綻)
      door.bridgeMesh.material.opacity = 1.0;
      door.bridgeMesh.material.transparent = false;
    });

    // 更新 HUD 題目指示牌
    const obbyTriviaText = document.getElementById('obby-trivia-text');
    if (obbyTriviaText) {
      obbyTriviaText.innerHTML = `<strong>【通關知識門考驗】</strong>${q.question}<br><span style="color:#fde047;">提示：走過正確答案對應的門號才能安穩通過！</span>`;
    }
  }

  // 建立 Checkpoint 存檔點光柱
  addCheckpoint(index, pos, label) {
    const cpGroup = new THREE.Group();
    cpGroup.position.copy(pos);

    // 金色基座光盤
    const baseGeo = new THREE.CylinderGeometry(1.5, 1.8, 0.3, 16);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.4
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    cpGroup.add(baseMesh);

    // 沖天光柱 (未激活時微藍，激活後金光璀璨)
    const beamGeo = new THREE.CylinderGeometry(1.2, 1.2, 8.0, 16);
    beamGeo.translate(0, 4.0, 0);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide
    });
    const beamMesh = new THREE.Mesh(beamGeo, beamMat);
    cpGroup.add(beamMesh);

    this.group.add(cpGroup);

    this.checkpoints.push({
      index,
      pos: pos.clone(),
      label,
      group: cpGroup,
      beamMesh,
      beamMat,
      activated: false
    });
  }

  // 建立頂部 K-POP 出道大獎台 (Winner Podium)
  createWinnerPodium(x, y, z) {
    const podiumGroup = new THREE.Group();
    podiumGroup.position.set(x, y, z);

    // 宏偉三層階梯大金台
    const p1Geo = new THREE.CylinderGeometry(6, 6.5, 1.2, 24);
    const p1Mat = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.3 });
    const p1 = new THREE.Mesh(p1Geo, p1Mat);
    p1.position.y = 0.6;
    podiumGroup.add(p1);

    const p2Geo = new THREE.CylinderGeometry(4.5, 5.0, 1.0, 24);
    const p2Mat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.3 });
    const p2 = new THREE.Mesh(p2Geo, p2Mat);
    p2.position.y = 1.6;
    podiumGroup.add(p2);

    const p3Geo = new THREE.CylinderGeometry(3.0, 3.5, 0.8, 24);
    const p3Mat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.6, roughness: 0.2 });
    const p3 = new THREE.Mesh(p3Geo, p3Mat);
    p3.position.y = 2.4;
    podiumGroup.add(p3);

    // 旋轉巨大金話筒地標
    const micGeo = new THREE.SphereGeometry(1.2, 16, 16);
    const micMat = new THREE.MeshStandardMaterial({ color: 0xfde047, emissive: 0xd97706, emissiveIntensity: 0.5, metalness: 0.8 });
    this.winnerMic = new THREE.Mesh(micGeo, micMat);
    this.winnerMic.position.y = 5.2;
    podiumGroup.add(this.winnerMic);

    this.group.add(podiumGroup);

    this.winnerPodium = {
      x,
      y: y + 2.8,
      z,
      radius: 3.2
    };

    this.staticColliders.push({
      minX: x - 3.2,
      maxX: x + 3.2,
      minZ: z - 3.2,
      maxZ: z + 3.2,
      minY: y,
      maxY: y + 3.2,
      yTop: y + 2.8
    });
  }

  // 啟動 Obby 闖關模式
  start() {
    this.isActive = true;
    this.isCompleted = false;
    this.group.visible = true;
    this.currentCheckpointIndex = 0;
    this.fallCount = 0;
    this.startTime = performance.now();
    this.elapsedTime = 0;

    // 啟動 HUD 計時器介面
    const hud = document.getElementById('obby-hud');
    if (hud) hud.classList.remove('hidden');

    const exitBtn = document.getElementById('btn-exit-obby');
    if (exitBtn && !exitBtn._bound) {
      exitBtn._bound = true;
      exitBtn.addEventListener('click', () => {
        if (window.reviewApp) window.reviewApp.toggleObbyMode();
      });
    }

    // 重新隨機題目
    this.refreshTriviaQuestion();
  }

  // 結束/退出 Obby 模式
  stop() {
    this.isActive = false;
    this.group.visible = false;
    const hud = document.getElementById('obby-hud');
    if (hud) hud.classList.add('hidden');
    const triviaBanner = document.getElementById('obby-trivia-banner');
    if (triviaBanner) triviaBanner.style.display = 'none';
  }

  // 重生到最近之 Checkpoint
  respawn(playerController) {
    this.fallCount++;
    this.audioSynth.playRespawn();

    const cp = this.checkpoints[this.currentCheckpointIndex] || this.checkpoints[0];
    playerController.playerMesh.position.set(cp.pos.x, cp.pos.y + 0.3, cp.pos.z);
    playerController.currentVelocity.set(0, 0, 0);
    playerController.jumpVelocity = 0;
    playerController.isJumping = false;

    // 更新 HUD 掉落次數
    const fallDisplay = document.getElementById('obby-fall-count');
    if (fallDisplay) fallDisplay.textContent = this.fallCount;
  }

  // 每一幀障礙物動畫與碰撞檢測 (Zero-GC)
  update(delta, time, playerController) {
    if (!this.isActive || !playerController || !playerController.playerMesh) return;

    const pPos = playerController.playerMesh.position;

    // 0. 計時器更新
    if (!this.isCompleted) {
      this.elapsedTime = (performance.now() - this.startTime) / 1000;
      const timerDisplay = document.getElementById('obby-timer-text');
      if (timerDisplay) {
        const mins = Math.floor(this.elapsedTime / 60);
        const secs = (this.elapsedTime % 60).toFixed(1);
        timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.padStart(4, '0')}`;
      }
    }

    // 0.1 接近 Stage 3 知識通關門時動態顯示考題指示條
    const triviaBanner = document.getElementById('obby-trivia-banner');
    if (triviaBanner) {
      if (pPos.z >= 96 && pPos.z <= 128) {
        triviaBanner.style.display = 'block';
      } else {
        triviaBanner.style.display = 'none';
      }
    }

    // 1. 旋轉雷射橫木 (Spinning Beams) 動畫與打擊判定
    for (let i = 0; i < this.spinningBeams.length; i++) {
      const beam = this.spinningBeams[i];
      beam.mesh.rotation.y += beam.speed * delta;

      // 檢查是否碰撞到橫木
      const dx = pPos.x - beam.x;
      const dz = pPos.z - beam.z;
      const dy = pPos.y - beam.y;
      if (Math.abs(dy) < 1.4 && (dx * dx + dz * dz) < (beam.length / 2) * (beam.length / 2)) {
        // 計算旋轉角並檢測橫木圓柱線段距離
        const curAngle = beam.mesh.rotation.y;
        const normDist = Math.abs(dx * Math.sin(curAngle) - dz * Math.cos(curAngle));
        if (normDist < 1.1) {
          // 遭到橫木橫掃！給予擊退衝量與音效
          this.audioSynth.playClick();
          playerController.currentVelocity.x += (dx > 0 ? 12 : -12);
          playerController.currentVelocity.z += (dz > 0 ? 12 : -12);
        }
      }
    }

    // 2. 閃爍方塊 (Blinking Blocks) 週期透明切換
    for (let i = 0; i < this.blinkingBlocks.length; i++) {
      const blk = this.blinkingBlocks[i];
      const cyclePos = (time + blk.phase) % blk.cycle;
      if (cyclePos < blk.solidDuration) {
        // 實體發光狀態
        blk.isSolid = true;
        blk.mat.opacity = 0.95;
        blk.mat.color.setHex(0x10b981); // 亮綠安全
      } else {
        // 虛無警告狀態
        blk.isSolid = false;
        blk.mat.opacity = 0.22;
        blk.mat.color.setHex(0xef4444); // 暗紅危險
      }
    }

    // 3. 移動平台平移與載客物理 (Moving Platforms)
    let playerOnMovingPlatform = false;
    let platformDeltaX = 0;

    for (let i = 0; i < this.movingPlatforms.length; i++) {
      const mp = this.movingPlatforms[i];
      const oldX = mp.mesh.position.x;
      mp.mesh.position.x += mp.speed * mp.dir * delta;

      if (mp.mesh.position.x > mp.maxX) {
        mp.mesh.position.x = mp.maxX;
        mp.dir = -1;
      } else if (mp.mesh.position.x < mp.minX) {
        mp.mesh.position.x = mp.minX;
        mp.dir = 1;
      }

      const curDeltaX = mp.mesh.position.x - oldX;
      mp.lastDeltaX = curDeltaX;

      // 檢查玩家是否站在該移動平台上
      if (
        pPos.x >= mp.mesh.position.x - mp.width / 2 &&
        pPos.x <= mp.mesh.position.x + mp.width / 2 &&
        pPos.z >= mp.z - mp.depth / 2 &&
        pPos.z <= mp.z + mp.depth / 2 &&
        Math.abs(pPos.y - mp.yTop) < 0.6
      ) {
        playerOnMovingPlatform = true;
        platformDeltaX = curDeltaX;
        // 同步載客平移
        playerController.playerMesh.position.x += platformDeltaX;
      }
    }

    // 4. 超級彈跳蹦床 (Bounce Pad) 判定
    for (let i = 0; i < this.bouncePads.length; i++) {
      const pad = this.bouncePads[i];
      const dist = Math.hypot(pPos.x - pad.x, pPos.z - pad.z);
      if (dist < pad.radius && Math.abs(pPos.y - pad.y) < 1.0) {
        // 觸發高空超級彈射！
        playerController.jumpVelocity = pad.power;
        playerController.isJumping = true;
        this.audioSynth.playBounce();
        // 蹦床微彈跳下陷回彈動畫
        pad.mesh.scale.set(1.2, 0.4, 1.2);
        setTimeout(() => pad.mesh.scale.set(1, 1, 1), 150);
      }
    }

    // 5. Checkpoint 抵達檢測
    for (let i = 0; i < this.checkpoints.length; i++) {
      const cp = this.checkpoints[i];
      const dist = pPos.distanceTo(cp.pos);
      if (dist < 3.0 && this.currentCheckpointIndex < i) {
        this.currentCheckpointIndex = i;
        cp.activated = true;
        cp.beamMat.color.setHex(0xf59e0b); // 金光點亮
        cp.beamMat.opacity = 0.75;
        this.audioSynth.playCheckpoint();

        // 更新 HUD Checkpoint 進度
        const stageDisplay = document.getElementById('obby-stage-text');
        if (stageDisplay) stageDisplay.textContent = `Stage ${i + 1} / 5`;
        const cpDisplay = document.getElementById('obby-checkpoint-text');
        if (cpDisplay) cpDisplay.textContent = cp.label;
      }
    }

    // 6. 終點通關獎台判定 (Winner Podium)
    if (this.winnerPodium && !this.isCompleted) {
      if (this.winnerMic) this.winnerMic.rotation.y += delta * 2.5;

      const dist = Math.hypot(pPos.x - this.winnerPodium.x, pPos.z - this.winnerPodium.z);
      if (dist < this.winnerPodium.radius && Math.abs(pPos.y - this.winnerPodium.y) < 1.2) {
        this.completeCourse();
      }
    }

    // 7. 墜海判定 (落入虛空/海面以下 Y < -6)
    if (pPos.y < -6.0) {
      this.respawn(playerController);
    }
  }

  // 取得玩家當前腳底下的最高地面高度 (跳台碰撞查詢)
  getGroundHeightAt(x, z, curY) {
    let highestY = -999;

    // 1. 靜態跳台檢驗
    for (let i = 0; i < this.staticColliders.length; i++) {
      const c = this.staticColliders[i];
      if (x >= c.minX && x <= c.maxX && z >= c.minZ && z <= c.maxZ) {
        if (c.yTop <= curY + 1.2 && c.yTop > highestY) {
          highestY = c.yTop;
        }
      }
    }

    // 2. 移動平台檢驗
    for (let i = 0; i < this.movingPlatforms.length; i++) {
      const mp = this.movingPlatforms[i];
      const minX = mp.mesh.position.x - mp.width / 2;
      const maxX = mp.mesh.position.x + mp.width / 2;
      const minZ = mp.z - mp.depth / 2;
      const maxZ = mp.z + mp.depth / 2;
      if (x >= minX && x <= maxX && z >= minZ && z <= maxZ) {
        if (mp.yTop <= curY + 1.2 && mp.yTop > highestY) {
          highestY = mp.yTop;
        }
      }
    }

    // 3. 閃爍方塊檢驗 (僅在實體狀態時才有立足碰撞)
    for (let i = 0; i < this.blinkingBlocks.length; i++) {
      const blk = this.blinkingBlocks[i];
      if (blk.isSolid) {
        const minX = blk.x - blk.width / 2;
        const maxX = blk.x + blk.width / 2;
        const minZ = blk.z - blk.depth / 2;
        const maxZ = blk.z + blk.depth / 2;
        const yTop = blk.y + blk.height / 2;
        if (x >= minX && x <= maxX && z >= minZ && z <= maxZ) {
          if (yTop <= curY + 1.2 && yTop > highestY) {
            highestY = yTop;
          }
        }
      }
    }

    // 4. Trivia Gate 知識通關門踏板檢驗 (只有正確答案門有實體)
    if (this.triviaGateData) {
      for (let i = 0; i < this.triviaGateData.doors.length; i++) {
        const door = this.triviaGateData.doors[i];
        if (door.isCorrect) {
          const minX = door.x - door.width / 2;
          const maxX = door.x + door.width / 2;
          const minZ = this.triviaGateData.zStart;
          const maxZ = this.triviaGateData.zEnd;
          if (x >= minX && x <= maxX && z >= minZ && z <= maxZ) {
            if (door.yTop <= curY + 1.2 && door.yTop > highestY) {
              highestY = door.yTop;
            }
          }
        }
      }
    }

    return highestY;
  }

  // 完成通關結算
  completeCourse() {
    this.isCompleted = true;
    this.audioSynth.playVictory();

    // 觸發 Canvas Confetti 煙火彩帶
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 }
      });
    }

    // 獎勵結算
    const bonusCoins = 50;
    this.quizEngine.playerState.coins += bonusCoins;
    if (!this.quizEngine.playerState.unlockedBadges.includes('obby-master')) {
      this.quizEngine.playerState.unlockedBadges.push('obby-master');
    }
    this.quizEngine.saveState();

    const mins = Math.floor(this.elapsedTime / 60);
    const secs = (this.elapsedTime % 60).toFixed(1);
    const timeStr = `${mins} 分 ${secs} 秒`;

    // 彈出結算對話框
    setTimeout(() => {
      alert(`🎉 恭喜完成 Roblox 3D 跑酷闖關！\n⏱️ 通關總耗時: ${timeStr}\n💦 墜落重生次數: ${this.fallCount} 次\n⭐ 獲得獎勵: 星光幣 +${bonusCoins}，解鎖【跑酷出道王者】徽章！`);
    }, 400);
  }
}
