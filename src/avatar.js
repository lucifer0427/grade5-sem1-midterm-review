// avatar.js: 3D 練習生換裝捏人更衣室與專屬主角精緻實體化系統
import * as THREE from 'three';
import { Materials } from './kit.js';
import { HEX_HEIGHT } from './world.js';

// 精緻角色專用材質庫 (細膩動漫質感)
const CharMaterials = {
  skin: new THREE.MeshLambertMaterial({ color: 0xffedd5 }), // 溫潤動漫膚色
  eyePupil: new THREE.MeshBasicMaterial({ color: 0x0f172a }), // 深邃曜黑瞳孔
  eyeSparkle: new THREE.MeshBasicMaterial({ color: 0xffffff }), // 靈動高光星芒
  eyebrow: new THREE.MeshBasicMaterial({ color: 0x451a03 }), // 柔和深棕細眉
  mouth: new THREE.MeshBasicMaterial({ color: 0xe11d48 }), // 元氣甜笑
  blush: new THREE.MeshBasicMaterial({ color: 0xfb7185, transparent: true, opacity: 0.85 }), // 蜜桃粉腮紅
  whiteTrim: new THREE.MeshLambertMaterial({ color: 0xffffff }), // 潔白襯衫/衣領/鞋底/蕾絲
  darkSocks: new THREE.MeshLambertMaterial({ color: 0x1e293b }), // 曜黑過膝長襪
  hairBase: new THREE.MeshLambertMaterial({ color: 0x451a03 }), // 栗子棕髮色
  goldAccent: new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.8, roughness: 0.2 }), // 金屬排扣/配飾
  silverHandle: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.85, roughness: 0.25 }), // 銀色手柄
  groundShadow: new THREE.MeshBasicMaterial({ color: 0x0f172a, transparent: true, opacity: 0.25, depthWrite: false }) // 角色腳底接觸柔和陰影
};

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

  // 程序化組裝超精緻主角 Avatar
  buildPlayerAvatar() {
    const root = new THREE.Group();
    const bodyMat = this.getOutfitMaterial();

    // 0. 腳底接觸柔和陰影 (Ground Ambient Occlusion Shadow)
    const shadowGeo = new THREE.CircleGeometry(0.72, 24);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMesh = new THREE.Mesh(shadowGeo, CharMaterials.groundShadow);
    shadowMesh.position.y = 0.01;
    root.add(shadowMesh);

    // 1. 頭部與動漫級精緻五官 (溫潤膚色 + 反光大眼 + 腮紅 + 甜笑)
    const headGroup = new THREE.Group();
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.54, 16, 16), CharMaterials.skin);
    head.position.y = 2.08;
    headGroup.add(head);

    // 左耳與右耳
    const earGeo = new THREE.SphereGeometry(0.12, 8, 8);
    earGeo.scale(0.5, 1.0, 0.8);
    const earL = new THREE.Mesh(earGeo, CharMaterials.skin);
    earL.position.set(-0.52, 2.08, 0.05);
    const earR = new THREE.Mesh(earGeo, CharMaterials.skin);
    earR.position.set(0.52, 2.08, 0.05);
    headGroup.add(earL, earR);

    // 靈動大眼神采 (深色瞳孔 + 雙重星芒高光)
    const eyeGeo = new THREE.SphereGeometry(0.08, 12, 12);
    eyeGeo.scale(1.0, 1.25, 0.35);

    const eyeL = new THREE.Mesh(eyeGeo, CharMaterials.eyePupil);
    eyeL.position.set(-0.17, 2.12, 0.51);
    const eyeR = new THREE.Mesh(eyeGeo, CharMaterials.eyePupil);
    eyeR.position.set(0.17, 2.12, 0.51);
    headGroup.add(eyeL, eyeR);

    // 主星芒高光 (白色反光)
    const sparkleGeo = new THREE.SphereGeometry(0.028, 8, 8);
    const sparkleL = new THREE.Mesh(sparkleGeo, CharMaterials.eyeSparkle);
    sparkleL.position.set(-0.145, 2.16, 0.54);
    const sparkleR = new THREE.Mesh(sparkleGeo, CharMaterials.eyeSparkle);
    sparkleR.position.set(0.145, 2.16, 0.54);
    headGroup.add(sparkleL, sparkleR);

    // 副星芒小高光 (增添動漫通透水潤感)
    const subSparkleGeo = new THREE.SphereGeometry(0.015, 6, 6);
    const subSparkleL = new THREE.Mesh(subSparkleGeo, CharMaterials.eyeSparkle);
    subSparkleL.position.set(-0.185, 2.07, 0.535);
    const subSparkleR = new THREE.Mesh(subSparkleGeo, CharMaterials.eyeSparkle);
    subSparkleR.position.set(0.185, 2.07, 0.535);
    headGroup.add(subSparkleL, subSparkleR);

    // 柔和深棕微彎眉毛
    const browGeo = new THREE.BoxGeometry(0.14, 0.025, 0.03);
    const browL = new THREE.Mesh(browGeo, CharMaterials.eyebrow);
    browL.position.set(-0.17, 2.25, 0.49);
    browL.rotation.z = 0.08;
    const browR = new THREE.Mesh(browGeo, CharMaterials.eyebrow);
    browR.position.set(0.17, 2.25, 0.49);
    browR.rotation.z = -0.08;
    headGroup.add(browL, browR);

    // 元氣蜜桃粉腮紅
    const blushGeo = new THREE.SphereGeometry(0.085, 8, 8);
    blushGeo.scale(1.3, 0.6, 0.35);
    const blushL = new THREE.Mesh(blushGeo, CharMaterials.blush);
    blushL.position.set(-0.28, 1.98, 0.46);
    const blushR = new THREE.Mesh(blushGeo, CharMaterials.blush);
    blushR.position.set(0.28, 1.98, 0.46);
    headGroup.add(blushL, blushR);

    // 甜美微揚微笑小嘴
    const mouthGeo = new THREE.BoxGeometry(0.08, 0.025, 0.03);
    const mouth = new THREE.Mesh(mouthGeo, CharMaterials.mouth);
    mouth.position.set(0, 1.94, 0.52);
    headGroup.add(mouth);

    // 2. 多層次立體髮型系統 (空氣瀏海 + 側鬢角髮束 + 主造型)
    const hairGroup = new THREE.Group();
    const hairMat = CharMaterials.hairBase;

    // 前額立體空氣瀏海 (3束髮絲微傾自然修飾臉型)
    const bangGeo = new THREE.ConeGeometry(0.16, 0.38, 6);
    bangGeo.rotateX(Math.PI);
    const bangC = new THREE.Mesh(bangGeo, hairMat);
    bangC.position.set(0, 2.38, 0.45);
    bangC.rotation.z = 0.05;
    const bangL = new THREE.Mesh(bangGeo, hairMat);
    bangL.position.set(-0.22, 2.34, 0.41);
    bangL.rotation.z = 0.22;
    const bangR = new THREE.Mesh(bangGeo, hairMat);
    bangR.position.set(0.22, 2.34, 0.41);
    bangR.rotation.z = -0.22;
    hairGroup.add(bangC, bangL, bangR);

    // 臉頰兩側側鬢角髮束
    const lockGeo = new THREE.CylinderGeometry(0.06, 0.02, 0.48, 6);
    const lockL = new THREE.Mesh(lockGeo, hairMat);
    lockL.position.set(-0.48, 1.92, 0.22);
    lockL.rotation.z = -0.15;
    const lockR = new THREE.Mesh(lockGeo, hairMat);
    lockR.position.set(0.48, 1.92, 0.22);
    lockR.rotation.z = 0.15;
    hairGroup.add(lockL, lockR);

    // 主體髮型款式切換
    if (this.config.hairStyle === 0) {
      // 款式 0: 韓風俐落層次短髮 + 金色側邊髮夾
      const hairBack = new THREE.Mesh(new THREE.SphereGeometry(0.58, 12, 12), hairMat);
      hairBack.position.set(0, 2.18, -0.06);
      hairGroup.add(hairBack);

      const hairTop = new THREE.Mesh(new THREE.ConeGeometry(0.62, 0.42, 8), hairMat);
      hairTop.position.set(0, 2.48, 0);
      hairGroup.add(hairTop);

      // 金色造型髮夾
      const clip = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.04), CharMaterials.goldAccent);
      clip.position.set(0.35, 2.38, 0.38);
      clip.rotation.z = -0.3;
      hairGroup.add(clip);
    } else if (this.config.hairStyle === 1) {
      // 款式 1: 藝術法式貝雷帽 + 蓬鬆捲髮
      const curls = new THREE.Mesh(new THREE.SphereGeometry(0.60, 10, 10), hairMat);
      curls.position.set(0, 2.16, -0.08);
      hairGroup.add(curls);

      // 優雅微斜貝雷帽 (經典立體帽頂與小頂柄)
      const beretMat = Materials.roofBlue;
      const beretBase = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.52, 0.24, 12), beretMat);
      beretBase.position.set(0.08, 2.50, 0.04);
      beretBase.rotation.z = -0.22;
      beretBase.rotation.x = -0.1;
      hairGroup.add(beretBase);

      const beretStem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.12, 6), CharMaterials.goldAccent);
      beretStem.position.set(0.12, 2.68, 0.04);
      beretStem.rotation.z = -0.22;
      hairGroup.add(beretStem);
    } else if (this.config.hairStyle === 2) {
      // 款式 2: 雙馬尾 + 少女立體雙蝴蝶結髮飾
      const hairBase = new THREE.Mesh(new THREE.SphereGeometry(0.58, 12, 12), hairMat);
      hairBase.position.set(0, 2.18, -0.06);
      hairGroup.add(hairBase);

      const tailGeo = new THREE.CylinderGeometry(0.14, 0.22, 0.85, 8);
      const tailL = new THREE.Mesh(tailGeo, hairMat);
      tailL.position.set(-0.62, 2.15, -0.05);
      tailL.rotation.z = Math.PI / 4.2;
      const tailR = new THREE.Mesh(tailGeo, hairMat);
      tailR.position.set(0.62, 2.15, -0.05);
      tailR.rotation.z = -Math.PI / 4.2;
      hairGroup.add(tailL, tailR);

      // 雙側立體緞帶蝴蝶結
      const ribbonMat = Materials.flowerPink;
      const ribbonGeo = new THREE.BoxGeometry(0.18, 0.09, 0.09);
      const ribL = new THREE.Mesh(ribbonGeo, ribbonMat);
      ribL.position.set(-0.52, 2.38, 0.08);
      ribL.rotation.z = 0.35;
      const ribR = new THREE.Mesh(ribbonGeo, ribbonMat);
      ribR.position.set(0.52, 2.38, 0.08);
      ribR.rotation.z = -0.35;
      hairGroup.add(ribL, ribR);
    } else {
      // 款式 3: 貓耳電競發光耳機 (立體耳罩頭帶 + 雙色發光貓耳)
      const hairBack = new THREE.Mesh(new THREE.SphereGeometry(0.58, 12, 12), hairMat);
      hairBack.position.set(0, 2.18, -0.06);
      hairGroup.add(hairBack);

      // 頭戴耳機拱橋與耳罩
      const band = new THREE.Mesh(new THREE.TorusGeometry(0.54, 0.05, 8, 16, Math.PI), CharMaterials.darkSocks);
      band.position.set(0, 2.12, 0);
      band.rotation.x = Math.PI / 2;
      hairGroup.add(band);

      const earPhoneGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.14, 12);
      earPhoneGeo.rotateZ(Math.PI / 2);
      const phL = new THREE.Mesh(earPhoneGeo, CharMaterials.darkSocks);
      phL.position.set(-0.54, 2.08, 0);
      const phR = new THREE.Mesh(earPhoneGeo, CharMaterials.darkSocks);
      phR.position.set(0.54, 2.08, 0);
      hairGroup.add(phL, phR);

      // 貓耳本體 + 霓虹內耳
      const earL = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.42, 4), CharMaterials.darkSocks);
      earL.position.set(-0.35, 2.72, 0);
      const earInnerL = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.28, 4), Materials.neonCyan);
      earInnerL.position.set(-0.35, 2.70, 0.05);

      const earR = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.42, 4), CharMaterials.darkSocks);
      earR.position.set(0.35, 2.72, 0);
      const earInnerR = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.28, 4), Materials.neonCyan);
      earInnerR.position.set(0.35, 2.70, 0.05);

      hairGroup.add(earL, earInnerL, earR, earInnerR);
    }
    headGroup.add(hairGroup);
    root.add(headGroup);

    // 3. 軀幹打歌服多層次剪裁 (立體襯衫衣領 + 緞帶領結 + 外套馬甲 + 金色排扣 + 百褶短裙)
    const bodyGroup = new THREE.Group();

    // 白色襯衫高領
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.28, 0.26, 12), CharMaterials.whiteTrim);
    collar.position.y = 1.74;
    bodyGroup.add(collar);

    // 胸前紅色緞帶蝴蝶結 + 璀璨金寶石胸針
    const bowMat = Materials.centerAccent;
    const bowL = new THREE.Mesh(new THREE.ConeGeometry(0.10, 0.18, 5), bowMat);
    bowL.position.set(-0.08, 1.62, 0.46);
    bowL.rotation.z = Math.PI / 2;
    const bowR = new THREE.Mesh(new THREE.ConeGeometry(0.10, 0.18, 5), bowMat);
    bowR.position.set(0.08, 1.62, 0.46);
    bowR.rotation.z = -Math.PI / 2;
    const bowPin = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), CharMaterials.goldAccent);
    bowPin.position.set(0, 1.62, 0.50);
    bodyGroup.add(bowL, bowR, bowPin);

    // 剪裁外套馬甲 (兩側貼身流線)
    const vest = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.54, 0.82, 10), bodyMat);
    vest.position.y = 1.25;
    bodyGroup.add(vest);

    // 正面 3 顆精緻立體金色圓鈕扣
    const buttonGeo = new THREE.SphereGeometry(0.038, 8, 8);
    for (let i = 0; i < 3; i++) {
      const btnMesh = new THREE.Mesh(buttonGeo, CharMaterials.goldAccent);
      btnMesh.position.set(0, 1.45 - i * 0.15, 0.52);
      bodyGroup.add(btnMesh);
    }

    // 黑色皮革腰帶與金色方形扣環
    const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.53, 0.54, 0.12, 12), CharMaterials.darkSocks);
    belt.position.y = 0.94;
    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.14, 0.08), CharMaterials.goldAccent);
    buckle.position.set(0, 0.94, 0.52);
    bodyGroup.add(belt, buckle);

    // 傘狀百褶短裙 (立體外翻荷葉邊)
    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.72, 0.36, 12), bodyMat);
    skirt.position.y = 0.76;
    bodyGroup.add(skirt);

    root.add(bodyGroup);

    // 4. 雙腿、過膝長襪與厚底潮流球鞋 (以髖部頂端 y=0.72 為樞軸)
    const legGroupL = new THREE.Group();
    legGroupL.position.set(-0.24, 0.72, 0);

    // 大腿膚色肌膚
    const thighL = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.28, 0.20), CharMaterials.skin);
    thighL.position.y = -0.14;
    legGroupL.add(thighL);

    // 過膝長襪白色蕾絲圈
    const sockTopL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.06, 0.22), CharMaterials.whiteTrim);
    sockTopL.position.y = -0.29;
    legGroupL.add(sockTopL);

    // 曜黑過膝長襪
    const sockL = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.32, 0.21), CharMaterials.darkSocks);
    sockL.position.y = -0.47;
    legGroupL.add(sockL);

    // 厚底球鞋 (白色厚底 + 彩色鞋身 + 白色前頭膠蓋 + 立體鞋帶)
    const soleGeo = new THREE.BoxGeometry(0.28, 0.09, 0.44);
    const soleL = new THREE.Mesh(soleGeo, CharMaterials.whiteTrim);
    soleL.position.set(0, -0.68, 0.08);
    soleL.castShadow = true;
    legGroupL.add(soleL);

    const upperGeo = new THREE.BoxGeometry(0.26, 0.16, 0.34);
    const upperL = new THREE.Mesh(upperGeo, Materials.chineseAccent);
    upperL.position.set(0, -0.57, 0.04);
    legGroupL.add(upperL);

    const toeCapGeo = new THREE.BoxGeometry(0.26, 0.11, 0.14);
    const toeCapL = new THREE.Mesh(toeCapGeo, CharMaterials.whiteTrim);
    toeCapL.position.set(0, -0.61, 0.22);
    legGroupL.add(toeCapL);

    // 右腿對稱組裝
    const legGroupR = new THREE.Group();
    legGroupR.position.set(0.24, 0.72, 0);

    const thighR = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.28, 0.20), CharMaterials.skin);
    thighR.position.y = -0.14;
    legGroupR.add(thighR);

    const sockTopR = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.06, 0.22), CharMaterials.whiteTrim);
    sockTopR.position.y = -0.29;
    legGroupR.add(sockTopR);

    const sockR = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.32, 0.21), CharMaterials.darkSocks);
    sockR.position.y = -0.47;
    legGroupR.add(sockR);

    const soleR = new THREE.Mesh(soleGeo, CharMaterials.whiteTrim);
    soleR.position.set(0, -0.68, 0.08);
    soleR.castShadow = true;
    legGroupR.add(soleR);

    const upperR = new THREE.Mesh(upperGeo, Materials.chineseAccent);
    upperR.position.set(0, -0.57, 0.04);
    legGroupR.add(upperR);

    const toeCapR = new THREE.Mesh(toeCapGeo, CharMaterials.whiteTrim);
    toeCapR.position.set(0, -0.61, 0.22);
    legGroupR.add(toeCapR);

    root.add(legGroupL, legGroupR);

    // 5. 左臂 (打歌外套袖 + 白色袖口 + 膚色小手)
    const armGroupL = new THREE.Group();
    armGroupL.position.set(-0.62, 1.62, 0);

    const armSleeveL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.38, 0.18), bodyMat);
    armSleeveL.position.y = -0.19;
    armGroupL.add(armSleeveL);

    const armCuffL = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.07, 0.20), CharMaterials.whiteTrim);
    armCuffL.position.y = -0.38;
    armGroupL.add(armCuffL);

    const handL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.16, 0.15), CharMaterials.skin);
    handL.position.y = -0.48;
    armGroupL.add(handL);
    root.add(armGroupL);

    // 6. 右臂手持超精緻偶像舞台手燈 (銀色金屬握柄 + 金色指環 + 懸浮發光星芒皇冠)
    const stickMat = this.getLightstickMaterial();
    const armGroupR = new THREE.Group();
    armGroupR.position.set(0.62, 1.62, 0);

    const armSleeveR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.38, 0.18), bodyMat);
    armSleeveR.position.y = -0.19;
    armGroupR.add(armSleeveR);

    const armCuffR = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.07, 0.20), CharMaterials.whiteTrim);
    armCuffR.position.y = -0.38;
    armGroupR.add(armCuffR);

    const handR = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.16, 0.15), CharMaterials.skin);
    handR.position.y = -0.48;
    armGroupR.add(handR);

    // 升級版高質感偶像應援棒
    const stickGroup = new THREE.Group();
    stickGroup.position.set(0, -0.44, 0.22);
    stickGroup.rotation.x = -Math.PI / 5;

    // 銀色流線手柄
    const wandHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.065, 0.72, 8), CharMaterials.silverHandle);
    stickGroup.add(wandHandle);

    // 金屬防滑金環
    const wandRing = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.02, 6, 12), CharMaterials.goldAccent);
    wandRing.rotation.x = Math.PI / 2;
    wandRing.position.y = 0.05;
    stickGroup.add(wandRing);

    // 頂部璀璨八面星晶發光星體
    const starCrown = new THREE.Mesh(new THREE.OctahedronGeometry(0.18, 0), stickMat);
    starCrown.position.y = 0.42;
    stickGroup.add(starCrown);

    // 外圈雙層發光天使光環
    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.03, 6, 16), stickMat);
    halo.position.y = 0.42;
    halo.rotation.x = Math.PI / 4;
    stickGroup.add(halo);

    armGroupR.add(stickGroup);
    root.add(armGroupR);

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
