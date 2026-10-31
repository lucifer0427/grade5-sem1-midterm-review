// avatar.js: 3D 練習生換裝捏人更衣室與專屬主角精緻實體化系統
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { Materials } from './kit.js';
import { HEX_HEIGHT } from './world.js';

// 子幾何體安全合併輔助函式 (全數轉換為 toNonIndexed，徹底杜絕屬性不相容或 null 崩潰)
function mergeNonIndexed(geometries) {
  if (!geometries || geometries.length === 0) return null;
  const nonIndexed = geometries.map(g => g.toNonIndexed());
  return BufferGeometryUtils.mergeGeometries(nonIndexed);
}

// 動態繪製精緻動漫大眼、蜜桃腮紅與元氣笑容的 2D Canvas 貼圖
function createFaceTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 512, 512);

  // 1. 動漫靈動大眼
  const drawEye = (cx, cy, isLeft) => {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy, 54, 76, isLeft ? -0.05 : 0.05, 0, Math.PI * 2);
    ctx.clip();

    // 眼白底色
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // 瞳孔層次漸層 (深邃曜黑 -> 沉穩深藍 -> 澄澈天藍)
    const irisGrad = ctx.createLinearGradient(cx, cy - 60, cx, cy + 60);
    irisGrad.addColorStop(0, '#0f172a');
    irisGrad.addColorStop(0.35, '#1e1b4b');
    irisGrad.addColorStop(0.7, '#2563eb');
    irisGrad.addColorStop(1, '#38bdf8');

    ctx.beginPath();
    ctx.ellipse(cx, cy + 6, 46, 68, 0, 0, Math.PI * 2);
    ctx.fillStyle = irisGrad;
    ctx.fill();

    // 瞳孔內圈水漾光環
    ctx.beginPath();
    ctx.ellipse(cx, cy + 18, 32, 38, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
    ctx.fill();

    // 主高光星芒
    ctx.beginPath();
    ctx.arc(isLeft ? cx - 14 : cx - 10, cy - 22, 16, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // 副高光通透微光
    ctx.beginPath();
    ctx.arc(isLeft ? cx + 18 : cx + 14, cy + 24, 9, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fill();

    ctx.restore();

    // 上眼瞼俐落濃密睫毛
    ctx.beginPath();
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0f172a';
    ctx.ellipse(cx, cy - 2, 56, 78, isLeft ? -0.05 : 0.05, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();

    // 眼尾微翹眼線
    ctx.beginPath();
    ctx.lineWidth = 6;
    if (isLeft) {
      ctx.moveTo(cx - 52, cy - 12);
      ctx.quadraticCurveTo(cx - 68, cy - 22, cx - 74, cy - 30);
    } else {
      ctx.moveTo(cx + 52, cy - 12);
      ctx.quadraticCurveTo(cx + 68, cy - 22, cx + 74, cy - 30);
    }
    ctx.stroke();
  };

  drawEye(170, 225, true);
  drawEye(342, 225, false);

  // 2. 柔和深棕自然微彎眉毛
  ctx.strokeStyle = '#451a03';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(115, 125);
  ctx.quadraticCurveTo(170, 105, 225, 128);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(287, 128);
  ctx.quadraticCurveTo(342, 105, 397, 125);
  ctx.stroke();

  // 3. 蜜桃粉柔和腮紅
  const drawBlush = (bx, by) => {
    const blushGrad = ctx.createRadialGradient(bx, by, 0, bx, by, 48);
    blushGrad.addColorStop(0, 'rgba(251, 113, 133, 0.7)');
    blushGrad.addColorStop(0.6, 'rgba(251, 113, 133, 0.35)');
    blushGrad.addColorStop(1, 'rgba(251, 113, 133, 0)');
    ctx.fillStyle = blushGrad;
    ctx.beginPath();
    ctx.ellipse(bx, by, 52, 28, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(bx - 12, by - 8);
    ctx.lineTo(bx - 4, by + 8);
    ctx.moveTo(bx + 2, by - 8);
    ctx.lineTo(bx + 10, by + 8);
    ctx.stroke();
  };
  drawBlush(120, 315);
  drawBlush(392, 315);

  // 4. 元氣微開甜笑小嘴
  ctx.beginPath();
  ctx.moveTo(226, 360);
  ctx.quadraticCurveTo(256, 405, 286, 360);
  ctx.closePath();
  ctx.fillStyle = '#e11d48';
  ctx.fill();
  ctx.strokeStyle = '#be123c';
  ctx.lineWidth = 4;
  ctx.stroke();

  // 上排白皙微光
  ctx.beginPath();
  ctx.moveTo(234, 362);
  ctx.quadraticCurveTo(256, 372, 278, 362);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4.5;
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 精緻角色專用材質庫
const CharMaterials = {
  skin: new THREE.MeshLambertMaterial({ color: 0xffedd5 }),
  whiteTrim: new THREE.MeshLambertMaterial({ color: 0xffffff }),
  darkSocks: new THREE.MeshLambertMaterial({ color: 0x1e293b }),
  hairBase: new THREE.MeshLambertMaterial({ color: 0x451a03 }),
  goldAccent: new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.8, roughness: 0.2 }),
  silverHandle: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.85, roughness: 0.25 }),
  groundShadow: new THREE.MeshBasicMaterial({ color: 0x0f172a, transparent: true, opacity: 0.25, depthWrite: false })
};

export class AvatarManager {
  constructor(scene, quizEngine) {
    this.scene = scene;
    this.quizEngine = quizEngine;
    this.avatarGroup = new THREE.Group();
    this.avatarGroup.name = 'playerAvatarGroup';
    this.scene.add(this.avatarGroup);

    // 共享五官貼圖快取
    this.faceTexture = createFaceTexture();

    // 載入自訂裝扮
    this.config = this.loadConfig();

    // 建立專屬主角 Avatar
    this.playerMesh = this.buildPlayerAvatar();
    this.playerMesh.position.set(0, HEX_HEIGHT + 0.2, 14);
    this.playerMesh.scale.set(1.8, 1.8, 1.8);
    this.avatarGroup.add(this.playerMesh);

    this.setupUIEvents();
  }

  loadConfig() {
    const saved = this.quizEngine.playerState;
    return {
      hairStyle: saved.hairStyle || 0,
      outfitStyle: saved.outfitStyle || 0,
      lightstickStyle: saved.lightstickStyle || 0
    };
  }

  saveConfig() {
    this.quizEngine.playerState.hairStyle = this.config.hairStyle;
    this.quizEngine.playerState.outfitStyle = this.config.outfitStyle;
    this.quizEngine.playerState.lightstickStyle = this.config.lightstickStyle;
    this.quizEngine.saveState();
  }

  getOutfitMaterial() {
    switch (this.config.outfitStyle) {
      case 1: return Materials.math;
      case 2: return Materials.gold;
      case 3: return Materials.chinese;
      default: return Materials.center;
    }
  }

  getLightstickMaterial() {
    switch (this.config.lightstickStyle) {
      case 1: return Materials.neonCyan;
      case 2: return Materials.gold;
      default: return Materials.neonPink;
    }
  }

  // 程序化組裝主角 Avatar (兼顧極致外觀與極低 Draw Calls)
  buildPlayerAvatar() {
    const root = new THREE.Group();
    const bodyMat = this.getOutfitMaterial();
    const stickMat = this.getLightstickMaterial();

    // 0. 腳底柔和接觸陰影
    const shadowGeo = new THREE.CircleGeometry(0.72, 16);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMesh = new THREE.Mesh(shadowGeo, CharMaterials.groundShadow);
    shadowMesh.position.y = 0.01;
    root.add(shadowMesh);

    // 1. 頭部與動漫貼圖五官 (以弧面貼合頭球表面，極致 2 個網格)
    const headGroup = new THREE.Group();

    // 頭部與耳朵合體網格 (均為 skin 材質)
    const headGeos = [
      new THREE.SphereGeometry(0.54, 16, 14).translate(0, 2.08, 0),
      new THREE.SphereGeometry(0.12, 8, 8).scale(0.5, 1.0, 0.8).translate(-0.52, 2.08, 0.05),
      new THREE.SphereGeometry(0.12, 8, 8).scale(0.5, 1.0, 0.8).translate(0.52, 2.08, 0.05)
    ];
    const headMesh = new THREE.Mesh(mergeNonIndexed(headGeos), CharMaterials.skin);
    headGroup.add(headMesh);

    // 弧面動漫五官貼花 (完美曲面貼合)
    const faceGeo = new THREE.CylinderGeometry(0.545, 0.545, 0.52, 16, 1, true, -Math.PI * 0.3, Math.PI * 0.6);
    const faceMat = new THREE.MeshBasicMaterial({
      map: this.faceTexture,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const faceMesh = new THREE.Mesh(faceGeo, faceMat);
    faceMesh.position.set(0, 2.08, 0);
    headGroup.add(faceMesh);

    // 2. 髮型系統 (依材質整併為 1~2 個網格)
    const hairGeos = [];

    // 空氣瀏海與側鬢角
    hairGeos.push(
      new THREE.ConeGeometry(0.16, 0.38, 6).rotateX(Math.PI).rotateZ(0.05).translate(0, 2.38, 0.45),
      new THREE.ConeGeometry(0.16, 0.38, 6).rotateX(Math.PI).rotateZ(0.22).translate(-0.22, 2.34, 0.41),
      new THREE.ConeGeometry(0.16, 0.38, 6).rotateX(Math.PI).rotateZ(-0.22).translate(0.22, 2.34, 0.41),
      new THREE.CylinderGeometry(0.06, 0.02, 0.48, 6).rotateZ(-0.15).translate(-0.48, 1.92, 0.22),
      new THREE.CylinderGeometry(0.06, 0.02, 0.48, 6).rotateZ(0.15).translate(0.48, 1.92, 0.22)
    );

    let hairAccentMesh = null;

    if (this.config.hairStyle === 0) {
      // 短髮主體
      hairGeos.push(
        new THREE.SphereGeometry(0.58, 12, 12).translate(0, 2.18, -0.06),
        new THREE.ConeGeometry(0.62, 0.42, 8).translate(0, 2.48, 0)
      );
    } else if (this.config.hairStyle === 1) {
      // 貝雷帽 + 捲髮
      hairGeos.push(new THREE.SphereGeometry(0.60, 10, 10).translate(0, 2.16, -0.08));
      const beretGeos = [
        new THREE.CylinderGeometry(0.62, 0.52, 0.24, 12).rotateZ(-0.22).rotateX(-0.1).translate(0.08, 2.50, 0.04),
        new THREE.CylinderGeometry(0.03, 0.03, 0.12, 6).rotateZ(-0.22).translate(0.12, 2.68, 0.04)
      ];
      hairAccentMesh = new THREE.Mesh(mergeNonIndexed(beretGeos), Materials.math);
    } else if (this.config.hairStyle === 2) {
      // 雙馬尾
      hairGeos.push(
        new THREE.SphereGeometry(0.58, 12, 12).translate(0, 2.18, -0.06),
        new THREE.CylinderGeometry(0.14, 0.22, 0.85, 8).rotateZ(Math.PI / 4.2).translate(-0.62, 2.15, -0.05),
        new THREE.CylinderGeometry(0.14, 0.22, 0.85, 8).rotateZ(-Math.PI / 4.2).translate(0.62, 2.15, -0.05)
      );
      const ribGeos = [
        new THREE.BoxGeometry(0.18, 0.09, 0.09).rotateZ(0.35).translate(-0.52, 2.38, 0.08),
        new THREE.BoxGeometry(0.18, 0.09, 0.09).rotateZ(-0.35).translate(0.52, 2.38, 0.08)
      ];
      hairAccentMesh = new THREE.Mesh(mergeNonIndexed(ribGeos), Materials.centerAccent);
    } else {
      // 貓耳發光耳機
      hairGeos.push(new THREE.SphereGeometry(0.58, 12, 12).translate(0, 2.18, -0.06));
      const earphoneGeos = [
        new THREE.TorusGeometry(0.54, 0.05, 8, 16, Math.PI).rotateX(Math.PI / 2).translate(0, 2.12, 0),
        new THREE.CylinderGeometry(0.16, 0.16, 0.14, 10).rotateZ(Math.PI / 2).translate(-0.54, 2.08, 0),
        new THREE.CylinderGeometry(0.16, 0.16, 0.14, 10).rotateZ(Math.PI / 2).translate(0.54, 2.08, 0),
        new THREE.ConeGeometry(0.22, 0.42, 4).translate(-0.35, 2.72, 0),
        new THREE.ConeGeometry(0.22, 0.42, 4).translate(0.35, 2.72, 0)
      ];
      hairAccentMesh = new THREE.Mesh(mergeNonIndexed(earphoneGeos), CharMaterials.darkSocks);
    }

    const hairMesh = new THREE.Mesh(mergeNonIndexed(hairGeos), CharMaterials.hairBase);
    headGroup.add(hairMesh);
    if (hairAccentMesh) headGroup.add(hairAccentMesh);
    root.add(headGroup);

    // 3. 軀幹打歌服 (外套馬甲與百褶短裙合併為 1 個，衣領與配飾合併為 2 個)
    const bodyGroup = new THREE.Group();

    // 外套馬甲 + 傘狀百褶短裙 (bodyMat)
    const outfitGeos = [
      new THREE.CylinderGeometry(0.46, 0.54, 0.82, 12).translate(0, 1.25, 0),
      new THREE.CylinderGeometry(0.52, 0.72, 0.36, 12).translate(0, 0.76, 0)
    ];
    const outfitMesh = new THREE.Mesh(mergeNonIndexed(outfitGeos), bodyMat);
    bodyGroup.add(outfitMesh);

    // 白色襯衫高領 (whiteTrim)
    const collarMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.26, 0.28, 0.26, 10).translate(0, 1.74, 0),
      CharMaterials.whiteTrim
    );
    bodyGroup.add(collarMesh);

    // 皮革腰帶與金屬扣環排扣 (合併為 goldAccent 配飾網格)
    const accentGeos = [
      new THREE.CylinderGeometry(0.53, 0.54, 0.12, 12).translate(0, 0.94, 0),
      new THREE.BoxGeometry(0.16, 0.14, 0.08).translate(0, 0.94, 0.52),
      new THREE.SphereGeometry(0.05, 8, 8).translate(0, 1.62, 0.50),
      new THREE.ConeGeometry(0.10, 0.18, 5).rotateZ(Math.PI / 2).translate(-0.08, 1.62, 0.46),
      new THREE.ConeGeometry(0.10, 0.18, 5).rotateZ(-Math.PI / 2).translate(0.08, 1.62, 0.46)
    ];
    for (let i = 0; i < 3; i++) {
      accentGeos.push(new THREE.SphereGeometry(0.038, 8, 8).translate(0, 1.45 - i * 0.15, 0.52));
    }
    const accentMesh = new THREE.Mesh(mergeNonIndexed(accentGeos), CharMaterials.goldAccent);
    bodyGroup.add(accentMesh);
    root.add(bodyGroup);

    // 4. 雙腿與舞台潮流長靴 (左腿 1 個，右腿 1 個，兼具動感舞蹈與極致效能)
    const legGeos = [
      new THREE.BoxGeometry(0.21, 0.65, 0.21).translate(0, -0.32, 0),
      new THREE.BoxGeometry(0.28, 0.14, 0.44).translate(0, -0.66, 0.08),
      new THREE.BoxGeometry(0.26, 0.11, 0.14).translate(0, -0.61, 0.22)
    ];
    const legMergedGeo = mergeNonIndexed(legGeos);

    const legGroupL = new THREE.Group();
    legGroupL.position.set(-0.24, 0.72, 0);
    const legMeshL = new THREE.Mesh(legMergedGeo, CharMaterials.darkSocks);
    legGroupL.add(legMeshL);

    const legGroupR = new THREE.Group();
    legGroupR.position.set(0.24, 0.72, 0);
    const legMeshR = new THREE.Mesh(legMergedGeo, CharMaterials.darkSocks);
    legGroupR.add(legMeshR);

    root.add(legGroupL, legGroupR);

    // 5. 左臂 (俐落長袖與自然擺動手部)
    const armGroupL = new THREE.Group();
    armGroupL.position.set(-0.62, 1.62, 0);

    const sleeveL = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.46, 0.18).translate(0, -0.23, 0),
      bodyMat
    );
    armGroupL.add(sleeveL);
    root.add(armGroupL);

    // 6. 右臂手持偶像舞台應援發光手燈
    const armGroupR = new THREE.Group();
    armGroupR.position.set(0.62, 1.62, 0);

    const sleeveR = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.38, 0.18).translate(0, -0.19, 0),
      bodyMat
    );
    armGroupR.add(sleeveR);

    const handR = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.16, 0.15).translate(0, -0.44, 0),
      CharMaterials.skin
    );
    armGroupR.add(handR);

    // 舞台應援手燈 (合併握柄與發光星芒皇冠為一體式發光體)
    const stickGroup = new THREE.Group();
    stickGroup.position.set(0, -0.44, 0.22);
    stickGroup.rotation.x = -Math.PI / 5;

    const stickGeos = [
      new THREE.CylinderGeometry(0.045, 0.065, 0.72, 8).translate(0, 0, 0),
      new THREE.TorusGeometry(0.065, 0.02, 6, 12).rotateX(Math.PI / 2).translate(0, 0.05, 0),
      new THREE.OctahedronGeometry(0.18, 0).translate(0, 0.42, 0),
      new THREE.TorusGeometry(0.24, 0.03, 6, 16).rotateX(Math.PI / 4).translate(0, 0.42, 0)
    ];
    const wandMesh = new THREE.Mesh(mergeNonIndexed(stickGeos), stickMat);
    stickGroup.add(wandMesh);
    armGroupR.add(stickGroup);

    root.add(armGroupR);

    // 綁定骨骼動畫控制器樞軸
    root.userData = {
      legL: legGroupL,
      legR: legGroupR,
      armL: armGroupL,
      armR: armGroupR,
      body: bodyGroup
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
    const wardrobeModal = document.getElementById('wardrobe-modal');
    const openWardrobeBtn = document.getElementById('btn-open-wardrobe');

    if (openWardrobeBtn && wardrobeModal) {
      openWardrobeBtn.addEventListener('click', () => {
        wardrobeModal.classList.remove('hidden');
      });
    }

    document.querySelectorAll('.hair-opt-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.config.hairStyle = parseInt(e.currentTarget.dataset.hair);
        this.refreshAvatar();
      });
    });

    document.querySelectorAll('.outfit-opt-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.config.outfitStyle = parseInt(e.currentTarget.dataset.outfit);
        this.refreshAvatar();
      });
    });

    document.querySelectorAll('.stick-opt-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.config.lightstickStyle = parseInt(e.currentTarget.dataset.stick);
        this.refreshAvatar();
      });
    });
  }

  update(time) {
    // 保留介面
  }
}
