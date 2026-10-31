// avatar.js: 3D 練習生換裝捏人更衣室與專屬主角實體化系統
import * as THREE from 'three';
import { Materials } from './kit.js';
import { HEX_HEIGHT } from './world.js';

export class AvatarManager {
  constructor(scene, quizEngine) {
    this.scene = scene;
    this.quizEngine = quizEngine;
    this.avatarGroup = new THREE.Group();
    this.scene.add(this.avatarGroup);

    // 載入或初始化自訂裝扮
    this.config = this.loadConfig();

    // 在中央出道大舞台 T 型走道前建立專屬主角 Avatar
    this.playerMesh = this.buildPlayerAvatar();
    this.playerMesh.position.set(0, HEX_HEIGHT + 1.2, 14);
    this.playerMesh.scale.set(1.8, 1.8, 1.8);
    this.avatarGroup.add(this.playerMesh);

    this.setupUIEvents();
  }

  loadConfig() {
    const saved = this.quizEngine.playerState;
    return {
      hairStyle: saved.hairStyle || 0, // 0: 短髮, 1: 韓系微捲, 2: 雙馬尾, 3: 貓耳造型
      outfitStyle: saved.outfitStyle || 0, // 0: 粉色打歌服, 1: 智慧藍校服, 2: 傳奇金亮片, 3: 街舞紫衛衣
      lightstickStyle: saved.lightstickStyle || 0 // 0: 霓虹粉, 1: 天際藍, 2: 璀璨金
    };
  }

  saveConfig() {
    this.quizEngine.playerState.hairStyle = this.config.hairStyle;
    this.quizEngine.playerState.outfitStyle = this.config.outfitStyle;
    this.quizEngine.playerState.lightstickStyle = this.config.lightstickStyle;
    this.quizEngine.saveState();
  }

  // 取得對應材質
  getOutfitMaterial() {
    switch (this.config.outfitStyle) {
      case 1: return Materials.mathAccent;
      case 2: return Materials.gold;
      case 3: return Materials.chineseAccent;
      default: return Materials.centerAccent;
    }
  }

  getLightstickMaterial() {
    switch (this.config.lightstickStyle) {
      case 1: return Materials.neonCyan;
      case 2: return Materials.gold;
      default: return Materials.neonPink;
    }
  }

  // 程序化組裝主角 Avatar
  buildPlayerAvatar() {
    const root = new THREE.Group();

    // 1. 頭部
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.55, 12, 12), Materials.whiteWall);
    head.position.y = 2.1;
    root.add(head);

    // 髮型
    const hairGroup = new THREE.Group();
    if (this.config.hairStyle === 0) {
      // 俐落短髮
      const hair = new THREE.Mesh(new THREE.ConeGeometry(0.65, 0.45, 8), Materials.wood);
      hair.position.y = 2.45;
      hairGroup.add(hair);
    } else if (this.config.hairStyle === 1) {
      // 韓系微捲髮
      const hair = new THREE.Mesh(new THREE.SphereGeometry(0.65, 8, 8), Materials.wood);
      hair.position.y = 2.35;
      hairGroup.add(hair);
    } else if (this.config.hairStyle === 2) {
      // 雙馬尾
      const hairBase = new THREE.Mesh(new THREE.SphereGeometry(0.6, 8, 8), Materials.wood);
      hairBase.position.y = 2.35;
      hairGroup.add(hairBase);
      const tailL = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, 0.8, 6), Materials.wood);
      tailL.position.set(-0.6, 2.2, 0);
      tailL.rotation.z = Math.PI / 4;
      const tailR = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, 0.8, 6), Materials.wood);
      tailR.position.set(0.6, 2.2, 0);
      tailR.rotation.z = -Math.PI / 4;
      hairGroup.add(tailL, tailR);
    } else {
      // 貓耳造型
      const earL = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.4, 4), Materials.center);
      earL.position.set(-0.35, 2.7, 0);
      const earR = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.4, 4), Materials.center);
      earR.position.set(0.35, 2.7, 0);
      hairGroup.add(earL, earR);
    }
    root.add(hairGroup);

    // 2. 軀幹打歌服
    const bodyMat = this.getOutfitMaterial();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.58, 1.15, 8), bodyMat);
    body.position.y = 1.35;
    root.add(body);

    // 3. 雙腿 (以髖部頂端為樞軸，支援自然奔跑交替擺動)
    const legGeo = new THREE.BoxGeometry(0.22, 0.8, 0.22);

    const legGroupL = new THREE.Group();
    legGroupL.position.set(-0.24, 0.8, 0);
    const legL = new THREE.Mesh(legGeo, Materials.whiteWall);
    legL.position.y = -0.4;
    legL.castShadow = true;
    legGroupL.add(legL);

    const legGroupR = new THREE.Group();
    legGroupR.position.set(0.24, 0.8, 0);
    const legR = new THREE.Mesh(legGeo, Materials.whiteWall);
    legR.position.y = -0.4;
    legR.castShadow = true;
    legGroupR.add(legR);

    root.add(legGroupL, legGroupR);

    // 4. 左臂 (自然前後擺動)
    const armGeo = new THREE.BoxGeometry(0.18, 0.7, 0.18);
    const armGroupL = new THREE.Group();
    armGroupL.position.set(-0.62, 1.75, 0);
    const armL = new THREE.Mesh(armGeo, bodyMat);
    armL.position.y = -0.35;
    armGroupL.add(armL);
    root.add(armGroupL);

    // 5. 右臂手持專屬應援棒
    const stickMat = this.getLightstickMaterial();
    const armGroupR = new THREE.Group();
    armGroupR.position.set(0.62, 1.75, 0);
    const armR = new THREE.Mesh(armGeo, bodyMat);
    armR.position.y = -0.35;
    armGroupR.add(armR);

    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 1.2, 8), stickMat);
    stick.position.set(0, -0.65, 0.35);
    stick.rotation.x = Math.PI / 4;
    armGroupR.add(stick);
    root.add(armGroupR);

    root.userData = {
      legL: legGroupL,
      legR: legGroupR,
      armL: armGroupL,
      armR: armGroupR,
      body: body
    };

    return root;
  }

  // 刷新外觀
  refreshAvatar() {
    this.avatarGroup.remove(this.playerMesh);
    this.playerMesh = this.buildPlayerAvatar();
    this.playerMesh.position.set(0, HEX_HEIGHT + 1.2, 14);
    this.playerMesh.scale.set(1.8, 1.8, 1.8);
    this.avatarGroup.add(this.playerMesh);
    if (window.reviewApp && window.reviewApp.playerController) {
      window.reviewApp.playerController.playerMesh = this.playerMesh;
    }
    this.saveConfig();
  }

  setupUIEvents() {
    // 換裝彈窗按鈕綁定
    const wardrobeModal = document.getElementById('wardrobe-modal');
    const openWardrobeBtn = document.getElementById('btn-open-wardrobe');

    if (openWardrobeBtn && wardrobeModal) {
      openWardrobeBtn.addEventListener('click', () => {
        wardrobeModal.classList.remove('hidden');
      });
    }

    // 髮型切換
    document.querySelectorAll('.hair-opt-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.config.hairStyle = parseInt(e.currentTarget.dataset.hair);
        this.refreshAvatar();
      });
    });

    // 服裝切換
    document.querySelectorAll('.outfit-opt-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.config.outfitStyle = parseInt(e.currentTarget.dataset.outfit);
        this.refreshAvatar();
      });
    });

    // 手燈切換
    document.querySelectorAll('.stick-opt-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.config.lightstickStyle = parseInt(e.currentTarget.dataset.stick);
        this.refreshAvatar();
      });
    });
  }

  // 主角待機呼吸 (僅在未移動時微幅呼吸，絕不覆蓋世界旋轉角)
  update(time) {
    if (this.playerMesh && (!window.reviewApp || !window.reviewApp.playerController || !window.reviewApp.playerController.isControlling)) {
      this.playerMesh.position.y = HEX_HEIGHT + 1.2 + Math.abs(Math.sin(time * 3)) * 0.12;
    }
  }
}
