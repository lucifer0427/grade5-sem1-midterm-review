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

    // 在中央出道大舞台 T 型走道前建立專屬主角 Avatar (腳踏實地，無懸空)
    this.playerMesh = this.buildPlayerAvatar();
    this.playerMesh.position.set(0, HEX_HEIGHT + 0.2, 14);
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

    // 1. 頭部與可愛面部五官 (明確朝向與生動眼神)
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 16), Materials.whiteWall);
    head.position.y = 2.1;
    root.add(head);

    // 靈動大眼睛 (深色反光)
    const eyeGeo = new THREE.SphereGeometry(0.075, 8, 8);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.18, 2.15, 0.52);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(0.18, 2.15, 0.52);
    root.add(eyeL, eyeR);

    // 元氣粉嫩腮紅
    const blushGeo = new THREE.SphereGeometry(0.09, 8, 8);
    blushGeo.scale(1.3, 0.6, 0.4);
    const blushMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
    const blushL = new THREE.Mesh(blushGeo, blushMat);
    blushL.position.set(-0.28, 1.98, 0.46);
    const blushR = new THREE.Mesh(blushGeo, blushMat);
    blushR.position.set(0.28, 1.98, 0.46);
    root.add(blushL, blushR);

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
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.56, 1.1, 8), bodyMat);
    body.position.y = 1.35;
    root.add(body);

    // 3. 雙腿與前向球鞋 (以髖部頂端為樞軸，球鞋實踏地面)
    const legGeo = new THREE.BoxGeometry(0.22, 0.65, 0.22);
    const shoeGeo = new THREE.BoxGeometry(0.26, 0.16, 0.38);

    const legGroupL = new THREE.Group();
    legGroupL.position.set(-0.24, 0.72, 0);
    const legL = new THREE.Mesh(legGeo, Materials.whiteWall);
    legL.position.y = -0.32;
    legL.castShadow = true;
    legGroupL.add(legL);

    const shoeL = new THREE.Mesh(shoeGeo, Materials.chineseAccent);
    shoeL.position.set(0, -0.64, 0.08); // 鞋頭向前微凸
    shoeL.castShadow = true;
    legGroupL.add(shoeL);

    const legGroupR = new THREE.Group();
    legGroupR.position.set(0.24, 0.72, 0);
    const legR = new THREE.Mesh(legGeo, Materials.whiteWall);
    legR.position.y = -0.32;
    legR.castShadow = true;
    legGroupR.add(legR);

    const shoeR = new THREE.Mesh(shoeGeo, Materials.chineseAccent);
    shoeR.position.set(0, -0.64, 0.08);
    shoeR.castShadow = true;
    legGroupR.add(shoeR);

    root.add(legGroupL, legGroupR);

    // 4. 左臂 (自然前後擺動)
    const armGeo = new THREE.BoxGeometry(0.18, 0.65, 0.18);
    const armGroupL = new THREE.Group();
    armGroupL.position.set(-0.62, 1.65, 0);
    const armL = new THREE.Mesh(armGeo, bodyMat);
    armL.position.y = -0.32;
    armGroupL.add(armL);
    root.add(armGroupL);

    // 5. 右臂 (元氣手持專屬應援手燈朝上揮舞)
    const stickMat = this.getLightstickMaterial();
    const armGroupR = new THREE.Group();
    armGroupR.position.set(0.62, 1.65, 0);
    const armR = new THREE.Mesh(armGeo, bodyMat);
    armR.position.y = -0.25;
    armR.rotation.x = -Math.PI / 4; // 右臂自然向前舉起
    armGroupR.add(armR);

    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.9, 8), stickMat);
    stick.position.set(0, -0.42, 0.25);
    stick.rotation.x = -Math.PI / 6; // 手燈朝上高舉
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
    this.playerMesh.position.set(0, HEX_HEIGHT + 0.2, 14);
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

  // 主角待機更新 (高度與轉向由 PlayerController 集中掌管，此處避免多頭覆寫)
  update(time) {
    // 保留介面，不作衝突覆寫
  }
}
