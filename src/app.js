// app.js: 主程式控制器、渲染迴圈、Raycast 拾取與 UI 事件整合
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Pool } from './kit.js';
import { WorldManager } from './world.js';
import { ModelBuilder } from './scene-models.js';
import { EnvironmentManager } from './environment.js';
import { ResolutionController } from './resolution.js';
import { AudioSynth } from './audio-synth.js';
import { QuizEngine } from './quiz-engine.js';
import { DecorManager } from './decor.js';
import { PeopleManager } from './people.js';
import { AvatarManager } from './avatar.js';
import { PlayerController } from './player-controller.js';
import { CertificateGenerator } from './certificate.js';

export class App {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.clock = new THREE.Clock();
    this.currentHour = 12;
    
    this.initThree();
    this.audioSynth = new AudioSynth();
    this.loadDataAndInitWorld();
    this.setupEvents();
  }

  initThree() {
    this.container = document.getElementById('canvas-container') || document.body;
    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera.position.set(0, 110, 150);

    // 2. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // 3. OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2.1; // 防止鑽入海面
    this.controls.minDistance = 20;
    this.controls.maxDistance = 350;
    this.controls.target.set(0, 0, 0);

    // 4. Managers
    this.resolutionCtrl = new ResolutionController(this.renderer);
    this.environment = new EnvironmentManager(this.scene);

    // 鏡頭運鏡補間狀態
    this.cameraLerp = null;
  }

  async loadDataAndInitWorld() {
    try {
      console.log('[INIT] 1. 開始 fetch json...');
      const [curriculumRes, quizzesRes] = await Promise.all([
        fetch('data/curriculum.json'),
        fetch('data/quizzes.json')
      ]);

      this.curriculum = await curriculumRes.json();
      this.quizzes = await quizzesRes.json();
      console.log('[INIT] 2. JSON 載入成功，開始建立世界...');

      // 建立世界與建築
      this.world = new WorldManager(this.scene, this.curriculum);
      this.world.buildWorld();

      this.modelBuilder = new ModelBuilder(this.world);
      this.modelBuilder.buildAllBuildings();
      console.log('[INIT] 3. 建築模型建立完成，建立植被生態...');

      // Heart Island 動態微縮沙盒生態：植被流光與漫遊小人
      this.decor = new DecorManager(this.scene, this.world);
      this.decor.buildAllDecor();

      this.people = new PeopleManager(this.scene, this.world);
      console.log('[INIT] 4. 小人建立完成，建立測驗引擎...');

      // 初始化測驗引擎
      this.quizEngine = new QuizEngine(this.quizzes, this.audioSynth, (state) => {
        this.updatePlayerHUD(state);
      });

      // 3D 練習生換裝系統與主角實體化
      console.log('[INIT] 5. 建立 AvatarManager...');
      this.avatar = new AvatarManager(this.scene, this.quizEngine);

      // 玩家角色即時操縱控制器 (跑島/收集星石/近身互動)
      console.log('[INIT] 6. 建立 PlayerController...');
      this.playerController = new PlayerController(
        this.scene,
        this.camera,
        this.controls,
        this.avatar,
        this.audioSynth,
        this.quizEngine
      );

      console.log('[INIT] 7. 全部初始化完成，呼叫 hideLoading...');
      this.updatePlayerHUD(this.quizEngine.playerState);
      this.hideLoading();

      // 啟動渲染迴圈
      this.animate();
    } catch (err) {
      console.error('資料載入失敗', err);
      const loading = document.getElementById('loading-overlay');
      if (loading) {
        loading.innerHTML = `<div style="color:red;padding:20px;">載入失敗，請確認檔案路徑：${err.message}</div>`;
      }
    }
  }

  hideLoading() {
    const loading = document.getElementById('loading-overlay');
    if (loading) {
      loading.style.opacity = '0';
      setTimeout(() => loading.remove(), 400);
    }
    window.dispatchEvent(new CustomEvent('exam-ready'));
    console.log('✅ 3D 知識島與題庫引擎已完全載入就緒！');
  }

  setupEvents() {
    // 視窗縮放
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // 首次點擊解鎖音效與 Raycast 拾取
    this.renderer.domElement.addEventListener('pointerdown', (e) => {
      this.audioSynth.unlock();
      this.pointerDownPos = { x: e.clientX, y: e.clientY };
    });

    this.renderer.domElement.addEventListener('pointerup', (e) => {
      if (!this.pointerDownPos) return;
      const dx = Math.abs(e.clientX - this.pointerDownPos.x);
      const dy = Math.abs(e.clientY - this.pointerDownPos.y);
      // 容許 15px 內的正常點擊與平板觸控，避免誤判為拖曳旋轉
      if (dx < 16 && dy < 16) {
        this.handlePointerClick(e);
      }
    });

    // 滑鼠懸浮指標切換 (Hover Feedback)
    this.renderer.domElement.addEventListener('pointermove', (e) => {
      if (!this.world) return;
      const rect = this.renderer.domElement.getBoundingClientRect();
      Pool.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      Pool.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      Pool.raycaster.setFromCamera(Pool.mouse, this.camera);
      const hits = Pool.raycaster.intersectObjects(this.world.interactiveObjects, true);
      document.body.style.cursor = hits.length > 0 ? 'pointer' : 'default';
    });

    // UI 控制項綁定
    const daySlider = document.getElementById('time-slider');
    if (daySlider) {
      daySlider.addEventListener('input', (e) => {
        const hour = parseFloat(e.target.value);
        this.currentHour = hour;
        this.environment.setTimeOfDay(hour);
      });
    }

    const topViewBtn = document.getElementById('btn-top-view');
    if (topViewBtn) {
      topViewBtn.addEventListener('click', () => {
        this.audioSynth.playClick();
        if (this.playerController && this.playerController.isControlling) {
          this.playerController.togglePlayerControl(false);
        }
        this.flyCameraTo(new THREE.Vector3(0, 240, 0), new THREE.Vector3(0, 0, 0));
      });
    }

    const grandExamBtn = document.getElementById('btn-grand-exam');
    if (grandExamBtn) {
      grandExamBtn.addEventListener('click', () => {
        this.audioSynth.playClick();
        this.openGrandExam();
      });
    }

    // 自由跑島模式切換按鈕
    const ctrlToggleBtn = document.getElementById('btn-toggle-ctrl');
    if (ctrlToggleBtn) {
      ctrlToggleBtn.addEventListener('click', () => {
        this.audioSynth.playClick();
        if (this.playerController) {
          this.playerController.togglePlayerControl();
        }
      });
    }

    // 靠近建築按鈕進入
    const nearbyEnterBtn = document.getElementById('nearby-enter-btn');
    if (nearbyEnterBtn) {
      nearbyEnterBtn.addEventListener('click', () => {
        if (this.playerController) {
          this.playerController.triggerNearbyBuilding();
        }
      });
    }

    // 練習生換裝衣帽間
    const wardrobeBtn = document.getElementById('btn-open-wardrobe');
    if (wardrobeBtn) {
      wardrobeBtn.addEventListener('click', () => {
        this.audioSynth.playClick();
        const modal = document.getElementById('wardrobe-modal');
        if (modal) modal.classList.remove('hidden');
      });
    }

    // K-POP 打歌舞步按鈕
    const danceBtn = document.getElementById('btn-dance');
    if (danceBtn) {
      danceBtn.addEventListener('click', () => {
        if (this.playerController) {
          this.playerController.dance();
        }
      });
    }

    document.querySelectorAll('.hair-opt-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.audioSynth.playClick();
        const hair = parseInt(e.currentTarget.dataset.hair);
        if (this.avatar) this.avatar.changeHair(hair);
      });
    });
    document.querySelectorAll('.outfit-opt-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.audioSynth.playClick();
        const outfit = parseInt(e.currentTarget.dataset.outfit);
        if (this.avatar) this.avatar.changeOutfit(outfit);
      });
    });
    document.querySelectorAll('.stick-opt-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.audioSynth.playClick();
        const stick = parseInt(e.currentTarget.dataset.stick);
        if (this.avatar) this.avatar.changeLightstick(stick);
      });
    });

    // 學科快速切換按鈕
    document.querySelectorAll('.filter-btn').forEach(btn => {
      if (btn.classList.contains('hair-opt-btn') || btn.classList.contains('outfit-opt-btn') || btn.classList.contains('stick-opt-btn')) return;
      btn.addEventListener('click', (e) => {
        const targetIsland = e.currentTarget.dataset.island;
        if (!targetIsland) return;
        this.audioSynth.playClick();
        this.focusIsland(targetIsland);
      });
    });
  }

  handlePointerClick(e) {
    if (!this.world) return;

    const rect = this.renderer.domElement.getBoundingClientRect();
    Pool.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    Pool.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    Pool.raycaster.setFromCamera(Pool.mouse, this.camera);
    const intersects = Pool.raycaster.intersectObjects(this.world.interactiveObjects, true);

    if (intersects.length > 0) {
      let targetObj = null;
      let hitPoint = intersects[0].point;

      for (const hit of intersects) {
        let obj = hit.object;
        while (obj && (!obj.userData || (obj.userData.type !== 'building' && obj.userData.type !== 'hex_cell'))) {
          obj = obj.parent;
        }
        if (obj && obj.userData && (obj.userData.type === 'building' || obj.userData.type === 'hex_cell')) {
          targetObj = obj;
          hitPoint = hit.point;
          break;
        }
      }

      if (targetObj) {
        if (targetObj.userData.type === 'building') {
          this.audioSynth.playClick();
          this.showBuildingModal(targetObj.userData);
        } else if (targetObj.userData.type === 'hex_cell') {
          // 點擊地面或橋樑：立即指揮主角前往該點並平滑切換追隨視角
          if (this.playerController) {
            this.playerController.setMoveTarget(hitPoint);
          }
        }
      }
    }
  }

  // 聚焦點位飛躍運鏡
  flyCameraTo(targetPos, targetLookAt, duration = 1.0) {
    this.cameraLerp = {
      startPos: this.camera.position.clone(),
      endPos: targetPos.clone(),
      startLookAt: this.controls.target.clone(),
      endLookAt: targetLookAt.clone(),
      duration,
      elapsed: 0
    };
  }

  focusIsland(islandId) {
    if (!this.world) return;
    if (this.playerController && this.playerController.isControlling) {
      this.playerController.togglePlayerControl(false);
    }
    const banner = document.getElementById('quick-quiz-banner');
    const bannerTitle = document.getElementById('quick-quiz-title');
    const bannerBtn = document.getElementById('quick-quiz-start-btn');

    if (islandId === 'all') {
      this.flyCameraTo(new THREE.Vector3(0, 110, 150), new THREE.Vector3(0, 0, 0));
      if (banner) banner.style.display = 'none';
      return;
    }

    const pos = this.world.islandCenters.get(islandId);
    if (pos) {
      const camPos = new THREE.Vector3(pos.x, 60, pos.z + 70);
      const lookAt = new THREE.Vector3(pos.x, 8, pos.z);
      this.flyCameraTo(camPos, lookAt);

      if (banner && bannerTitle && bannerBtn) {
        const island = this.curriculum.islands.find(isl => isl.id === islandId);
        if (island) {
          banner.style.display = 'flex';
          bannerTitle.textContent = `${island.name}`;
          if (islandId === 'center') {
            bannerBtn.textContent = '🎤 進入總大會考 (15題)';
            bannerBtn.onclick = () => {
              this.audioSynth.playClick();
              this.openGrandExam();
            };
          } else {
            bannerBtn.textContent = '🎯 挑戰本科題目';
            bannerBtn.onclick = () => {
              this.audioSynth.playClick();
              const firstBuilding = island.buildings[0];
              this.startQuizSession(firstBuilding ? firstBuilding.id : islandId);
            };
          }
        }
      }
    }
  }

  // 顯示地標資訊彈窗
  showBuildingModal(data) {
    const modal = document.getElementById('building-modal');
    if (!modal) return;

    document.getElementById('modal-title').textContent = data.name;
    document.getElementById('modal-unit').textContent = data.unit || '期中核心複習單元';
    document.getElementById('modal-summary').textContent = data.conceptSummary;

    const listContainer = document.getElementById('modal-details');
    listContainer.innerHTML = '';
    (data.details || []).forEach(detail => {
      const li = document.createElement('li');
      li.textContent = detail;
      listContainer.appendChild(li);
    });

    const quizBtn = document.getElementById('modal-quiz-btn');
    quizBtn.style.display = 'block';
    if (data.buildingId === 'center-stage' || data.buildingId.startsWith('center')) {
      quizBtn.textContent = '🎤 進入期中出道總大會考 (15題)';
    } else {
      quizBtn.textContent = '🚀 進入單元解題挑戰';
    }

    quizBtn.onclick = () => {
      this.audioSynth.playClick();
      modal.classList.add('hidden');
      if (data.buildingId === 'center-stage' || data.buildingId.startsWith('center')) {
        this.openGrandExam();
      } else {
        this.startQuizSession(data.buildingId);
      }
    };

    modal.classList.remove('hidden');
  }

  // 開始單元測驗
  startQuizSession(buildingId) {
    if (!this.quizEngine) {
      console.warn('題庫載入中，請稍候...');
      return;
    }
    const view = this.quizEngine.startBuildingQuiz(buildingId);
    if (view) {
      this.renderQuizModal(view);
    } else {
      this.openGrandExam();
    }
  }

  // 開始期中總大會考
  openGrandExam() {
    if (!this.quizEngine) {
      console.warn('題庫載入中，請稍候...');
      return;
    }
    // 平滑運鏡至中央舞台
    this.focusIsland('center');
    const view = this.quizEngine.startGrandExam();
    if (view) {
      this.renderQuizModal(view);
    }
  }

  // 渲染測驗問答 UI
  renderQuizModal(view) {
    const quizModal = document.getElementById('quiz-modal');
    if (!quizModal) return;

    if (view.isFinished) {
      this.showQuizResult(view);
      return;
    }

    quizModal.classList.remove('hidden');
    document.getElementById('quiz-progress').textContent = `第 ${view.currentNumber} / ${view.totalCount} 題`;
    document.getElementById('quiz-score').textContent = `⭐ 星幣得分: ${view.score}`;
    
    const comboElem = document.getElementById('quiz-combo');
    if (view.combo >= 2) {
      comboElem.textContent = `🔥 ${view.combo} COMBO!`;
      comboElem.style.display = 'inline-block';
    } else {
      comboElem.style.display = 'none';
    }

    // 題目與選項
    document.getElementById('quiz-question').textContent = view.question.question;

    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';

    view.question.options.forEach((optText, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt-btn';
      btn.textContent = `${String.fromCharCode(65 + idx)}. ${optText}`;

      // 50/50 排除項目置灰禁用
      if (view.eliminatedIndices.includes(idx)) {
        btn.classList.add('eliminated');
        btn.disabled = true;
      }

      btn.onclick = () => {
        this.handleQuizSubmit(idx, btn);
      };

      optionsContainer.appendChild(btn);
    });

    // 鷹架引導提示區
    const hintBox = document.getElementById('quiz-hint-box');
    if (view.tierLevel > 0 && view.hintText) {
      hintBox.style.display = 'block';
      hintBox.innerHTML = `<strong>${view.tierLevel === 1 ? '【Tier 1 題眼聚焦】' : '【Tier 2 核心微卡片】'}</strong><br>${view.hintText}`;
    } else {
      hintBox.style.display = 'none';
    }

    // 隱藏下一題按鈕
    document.getElementById('quiz-next-btn').style.display = 'none';
  }

  handleQuizSubmit(chosenIdx, btnElem) {
    const res = this.quizEngine.submitAnswer(chosenIdx);
    if (!res) return;

    const optButtons = document.querySelectorAll('.quiz-opt-btn');

    if (res.correct) {
      btnElem.classList.add('correct');
      optButtons.forEach(b => b.disabled = true);

      // 觸發全島練習生小人跳躍歡呼
      if (this.people) {
        this.people.cheerAll();
      }

      const hintBox = document.getElementById('quiz-hint-box');
      hintBox.style.display = 'block';
      hintBox.innerHTML = `<span style="color:#10b981;font-weight:bold;">🎉 答對了！+${res.earnedCoins} 星光幣</span><br>${res.explanation}`;

      const nextBtn = document.getElementById('quiz-next-btn');
      nextBtn.style.display = 'block';
      nextBtn.textContent = res.isLast ? '查看結算結果 🏆' : '下一題 ➔';
      nextBtn.onclick = () => {
        this.audioSynth.playClick();
        const nextView = this.quizEngine.nextQuestion();
        this.renderQuizModal(nextView);
      };
    } else {
      btnElem.classList.add('wrong');
      btnElem.disabled = true;

      const hintBox = document.getElementById('quiz-hint-box');
      hintBox.style.display = 'block';

      if (res.tierLevel === 1) {
        hintBox.innerHTML = `<span style="color:#ef4444;font-weight:bold;">再試一次！</span><br>${res.hint}`;
        // 排除一個選項
        if (res.eliminatedIndices) {
          res.eliminatedIndices.forEach(idx => {
            if (optButtons[idx]) {
              optButtons[idx].classList.add('eliminated');
              optButtons[idx].disabled = true;
            }
          });
        }
      } else {
        hintBox.innerHTML = `<span style="color:#ef4444;font-weight:bold;">觀念解鎖微卡片：</span><br>${res.hint}<br><br><span style="color:#64748b;">${res.explanation}</span>`;
        // 提供傳送門運鏡
        if (res.portalBuildingId && this.world) {
          const portalBtn = document.createElement('button');
          portalBtn.className = 'portal-btn';
          portalBtn.textContent = '🚀 前往對應地標複習觀念';
          portalBtn.onclick = () => {
            this.audioSynth.playPortal();
            document.getElementById('quiz-modal').classList.add('hidden');
            const mesh = this.world.buildingMeshes.get(res.portalBuildingId);
            if (mesh) {
              const pos = mesh.position;
              this.flyCameraTo(new THREE.Vector3(pos.x, pos.y + 25, pos.z + 35), pos);
            }
          };
          hintBox.appendChild(portalBtn);
        }

        const nextBtn = document.getElementById('quiz-next-btn');
        nextBtn.style.display = 'block';
        nextBtn.textContent = '看懂了，繼續挑戰 ➔';
        nextBtn.onclick = () => {
          this.audioSynth.playClick();
          const nextView = this.quizEngine.nextQuestion();
          this.renderQuizModal(nextView);
        };
      }
    }
  }

  showQuizResult(summary) {
    const modal = document.getElementById('result-modal');
    if (!modal) return;

    modal.classList.remove('hidden');
    document.getElementById('result-score').textContent = `${summary.score} 分`;
    document.getElementById('result-stars').textContent = `已收集星星: ${summary.playerTotalStars} ⭐`;

    // 點亮建築光柱
    if (summary.buildingId && this.world) {
      this.world.lightUpBeacon(summary.buildingId);
    }

    // 若為大會考結算，動態合成 K-POP 出道榮譽證書與雷達圖
    const certBox = document.getElementById('cert-canvas-container');
    const certCanvas = document.getElementById('cert-canvas');
    const downloadBtn = document.getElementById('btn-download-cert');

    if (summary.mode === 'grand_exam' && certCanvas && certBox) {
      certBox.style.display = 'block';
      CertificateGenerator.generateCertificate(
        certCanvas,
        summary,
        this.avatar ? this.avatar.config : {}
      );

      if (downloadBtn) {
        downloadBtn.onclick = () => {
          this.audioSynth.playClick();
          const link = document.createElement('a');
          link.download = `KPOP_期中出道榮譽證書_${Date.now()}.png`;
          link.href = certCanvas.toDataURL('image/png');
          link.click();
        };
      }
    } else if (certBox) {
      certBox.style.display = 'none';
    }

    document.getElementById('result-close-btn').onclick = () => {
      this.audioSynth.playClick();
      modal.classList.add('hidden');
    };
  }

  updatePlayerHUD(state) {
    const starsElem = document.getElementById('hud-stars');
    const coinsElem = document.getElementById('hud-coins');
    if (starsElem) starsElem.textContent = state.stars;
    if (coinsElem) coinsElem.textContent = state.coins;
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // 鏡頭運鏡插值
    if (this.cameraLerp) {
      const lerp = this.cameraLerp;
      lerp.elapsed += delta;
      const t = Math.min(1, lerp.elapsed / lerp.duration);
      // 平滑緩動
      const ease = t * t * (3 - 2 * t);

      this.camera.position.lerpVectors(lerp.startPos, lerp.endPos, ease);
      this.controls.target.lerpVectors(lerp.startLookAt, lerp.endLookAt, ease);

      if (t >= 1) {
        this.cameraLerp = null;
      }
    }

    // 玩家角色物理移動與追隨相機更新 (需在 controls.update 之前計算增量)
    if (this.playerController) this.playerController.update(delta, elapsedTime);

    this.controls.update();
    this.environment.update(elapsedTime, delta);
    this.resolutionCtrl.update(delta);

    // Heart Island 沙盒生態每幀更新
    if (this.world) this.world.update(delta, elapsedTime);
    const isNight = this.currentHour >= 19 || this.currentHour < 6;
    if (this.decor) this.decor.update(elapsedTime, isNight);
    if (this.people) this.people.update(delta, elapsedTime);
    if (this.avatar) this.avatar.update(elapsedTime);

    this.renderer.render(this.scene, this.camera);
  }
}

// 啟動應用 (防呆保證：不論 DOMContentLoaded 是否已觸發皆安全啟動)
function initApp() {
  if (!window.reviewApp) {
    window.reviewApp = new App();
  }
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
