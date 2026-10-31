// scene-models.js: 五大學科地標建築 Procedural 程序化建模管線
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { GeoPool, Materials, Pool } from './kit.js';
import { axialToWorld, HEX_HEIGHT } from './world.js';

export class ModelBuilder {
  constructor(worldManager) {
    this.worldManager = worldManager;
  }

  createBuildingById(id, islandId) {
    switch (id) {
      // --- 中央島 ---
      case 'center-stage': return this.createCenterStage();
      case 'center-wardrobe': return this.createWardrobe();

      // --- 數學島 ---
      case 'math-linegraph': return this.createLineGraphTower();
      case 'math-factors': return this.createRainbowArch();
      case 'math-geometry': return this.createGeometryTemple();
      case 'math-gcdlcm': return this.createLFactory();
      case 'math-solids': return this.createPolyhedronPavilion();

      // --- 英語島 ---
      case 'eng-phonics': return this.createClockTower();
      case 'eng-days': return this.createCalendarStation();
      case 'eng-subjects': return this.createSubjectWorkshop();
      case 'eng-review': return this.createReviewGazebo();

      // --- 自然島 ---
      case 'sci-sun-tracker': return this.createSunTracker();
      case 'sci-plant-energy': return this.createPlantSphere();
      case 'sci-plant-reproduce': return this.createGreenhouse();
      case 'sci-dichotomy': return this.createDichotomyPavilion();

      // --- 社會島 ---
      case 'soc-taiwan-geo': return this.createTaiwanSandTable();
      case 'soc-terrains': return this.createTerrainSteps();
      case 'soc-monsoon': return this.createWeatherStation();
      case 'soc-water': return this.createReservoirDam();

      // --- 國語島 ---
      case 'chi-dream': return this.createDreamPavilion();
      case 'chi-art': return this.createArtGallery();
      case 'chi-strategy': return this.createStrategyPaifang();
      case 'chi-rhetoric': return this.createInkstonePavilion();

      default: return this.createDefaultBuilding(islandId);
    }
  }

  buildAllBuildings() {
    const islands = this.worldManager.curriculum.islands;
    const geosByMat = new Map();
    const addGeom = (mat, geo, matrix) => {
      if (!geosByMat.has(mat)) geosByMat.set(mat, []);
      geosByMat.get(mat).push(geo.clone().applyMatrix4(matrix));
    };

    islands.forEach(island => {
      const cells = island.cells;
      const buildings = island.buildings;

      buildings.forEach((b, idx) => {
        const cellIdx = Math.min(idx, cells.length - 1);
        const [q, r] = cells[cellIdx];
        const { x, z } = axialToWorld(q, r);

        const buildingGroup = this.createBuildingById(b.id, island.id);
        buildingGroup.position.set(x, HEX_HEIGHT, z);
        buildingGroup.updateMatrixWorld(true);

        buildingGroup.traverse(child => {
          if (child.isMesh && child.geometry && child.material) {
            addGeom(child.material, child.geometry, child.matrixWorld);
          }
        });

        this.worldManager.registerBuildingHitbox(b, island, x, z);
      });
    });

    // 依材質合併為全島靜態建築群 (極致降低 Draw Calls 至 ~8 個)
    geosByMat.forEach((geos, mat) => {
      if (geos.length > 0) {
        const mergedGeo = BufferGeometryUtils.mergeGeometries(geos);
        const mesh = new THREE.Mesh(mergedGeo, mat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.worldManager.buildingsGroup.add(mesh);
      }
    });
  }

  // =====================
  // 中央 K-POP 出道大舞台
  // =====================
  createCenterStage() {
    const group = new THREE.Group();
    // 圓形主打歌台 (雙層粉色帶金邊)
    const baseStage = new THREE.Mesh(GeoPool.cylinder, Materials.darkRock);
    baseStage.scale.set(13.5, 1.2, 13.5);
    baseStage.position.y = 0.6;
    group.add(baseStage);

    const stage = new THREE.Mesh(GeoPool.cylinder, Materials.centerAccent);
    stage.scale.set(12, 2.2, 12);
    stage.position.y = 1.8;
    group.add(stage);

    // T 型延伸跑道
    const runway = new THREE.Mesh(GeoPool.box, Materials.whiteWall);
    runway.scale.set(6, 2.4, 14);
    runway.position.set(0, 1.2, 10);
    group.add(runway);

    // 走道前端台階
    const steps = new THREE.Mesh(GeoPool.box, Materials.centerAccent);
    steps.scale.set(8, 0.8, 2.5);
    steps.position.set(0, 0.4, 17.5);
    group.add(steps);

    // 霓虹應援發光環
    const neonRing = new THREE.Mesh(GeoPool.torus, Materials.neonPink);
    neonRing.scale.set(12.5, 12.5, 0.5);
    neonRing.rotation.x = Math.PI / 2;
    neonRing.position.y = 3.0;
    group.add(neonRing);

    // 背景巨型 K-POP 弧形 LED 霓虹主螢幕
    const screenWall = new THREE.Mesh(new THREE.CylinderGeometry(11, 11, 8, 16, 1, true, Math.PI * 0.75, Math.PI * 0.5), Materials.neonCyan);
    screenWall.position.set(0, 7, -2);
    group.add(screenWall);

    // 舞台兩側大型立體重低音音箱
    [-8, 8].forEach(xOff => {
      const spkBox = new THREE.Mesh(GeoPool.box, Materials.darkRock);
      spkBox.scale.set(2.4, 4.5, 2.4);
      spkBox.position.set(xOff, 2.25, 4);
      group.add(spkBox);

      const spkCone = new THREE.Mesh(GeoPool.cylinder, Materials.whiteWall);
      spkCone.scale.set(0.9, 0.1, 0.9);
      spkCone.position.set(xOff, 2.5, 5.25);
      spkCone.rotation.x = Math.PI / 2;
      group.add(spkCone);
    });

    // 4 座舞台聚光燈柱
    const angles = [0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2];
    angles.forEach(ang => {
      const pole = new THREE.Mesh(GeoPool.cylinder, Materials.whiteWall);
      pole.scale.set(0.6, 12, 0.6);
      pole.position.set(Math.cos(ang) * 11, 6, Math.sin(ang) * 11);
      group.add(pole);

      const lamp = new THREE.Mesh(GeoPool.cone, Materials.gold);
      lamp.scale.set(1.5, 2, 1.5);
      lamp.position.set(Math.cos(ang) * 11, 12, Math.sin(ang) * 11);
      lamp.rotation.z = Math.PI;
      group.add(lamp);
    });

    return group;
  }

  createWardrobe() {
    const group = new THREE.Group();
    const house = new THREE.Mesh(GeoPool.box, Materials.whiteWall);
    house.scale.set(8, 6, 8);
    house.position.y = 3;
    group.add(house);

    const roof = new THREE.Mesh(GeoPool.cone, Materials.center);
    roof.scale.set(6.5, 4, 6.5);
    roof.position.y = 8;
    roof.rotation.y = Math.PI / 4;
    group.add(roof);
    return group;
  }

  // =====================
  // 數學島地標
  // =====================
  createLineGraphTower() {
    const group = new THREE.Group();
    // 觀測塔底座
    const base = new THREE.Mesh(GeoPool.cylinder, Materials.math);
    base.scale.set(6, 8, 6);
    base.position.y = 4;
    group.add(base);

    // 鋸齒狀折線標誌 (Box 組成)
    const pts = [[-3, 9], [-1, 13], [1, 10], [3, 15]];
    for (let i = 0; i < pts.length - 1; i++) {
      const seg = new THREE.Mesh(GeoPool.box, Materials.gold);
      const dx = pts[i + 1][0] - pts[i][0];
      const dy = pts[i + 1][1] - pts[i][1];
      const len = Math.sqrt(dx * dx + dy * dy);
      seg.scale.set(len, 0.6, 0.6);
      seg.position.set((pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2, 0);
      seg.rotation.z = Math.atan2(dy, dx);
      group.add(seg);
    }
    return group;
  }

  createRainbowArch() {
    const group = new THREE.Group();
    const arch = new THREE.Mesh(GeoPool.torus, Materials.mathAccent);
    arch.scale.set(7, 7, 1);
    arch.position.y = 6;
    arch.rotation.y = Math.PI / 4;
    group.add(arch);

    const pillar1 = new THREE.Mesh(GeoPool.cylinder, Materials.whiteWall);
    pillar1.scale.set(1.2, 7, 1.2);
    pillar1.position.set(-4, 3.5, 0);
    group.add(pillar1);

    const pillar2 = new THREE.Mesh(GeoPool.cylinder, Materials.whiteWall);
    pillar2.scale.set(1.2, 7, 1.2);
    pillar2.position.set(4, 3.5, 0);
    group.add(pillar2);
    return group;
  }

  createGeometryTemple() {
    const group = new THREE.Group();
    // 三角三稜柱殿堂
    const temple = new THREE.Mesh(GeoPool.cone, Materials.math);
    temple.scale.set(7, 9, 7);
    temple.position.y = 4.5;
    group.add(temple);

    // 量角器金環
    const ring = new THREE.Mesh(GeoPool.torus, Materials.gold);
    ring.scale.set(5, 5, 0.4);
    ring.position.y = 9.5;
    ring.rotation.x = Math.PI / 2;
    group.add(ring);
    return group;
  }

  createLFactory() {
    const group = new THREE.Group();
    const mainBox = new THREE.Mesh(GeoPool.box, Materials.whiteWall);
    mainBox.scale.set(8, 7, 8);
    mainBox.position.y = 3.5;
    group.add(mainBox);

    // 短除法 L 型黃金輸送管道
    const lPipeV = new THREE.Mesh(GeoPool.cylinder, Materials.gold);
    lPipeV.scale.set(0.8, 8, 0.8);
    lPipeV.position.set(-3.5, 5, 0);
    group.add(lPipeV);

    const lPipeH = new THREE.Mesh(GeoPool.cylinder, Materials.gold);
    lPipeH.scale.set(0.8, 6, 0.8);
    lPipeH.position.set(-1, 1, 0);
    lPipeH.rotation.z = Math.PI / 2;
    group.add(lPipeH);
    return group;
  }

  createPolyhedronPavilion() {
    const group = new THREE.Group();
    const base = new THREE.Mesh(GeoPool.hexCylinder, Materials.math);
    base.scale.set(6, 6, 6);
    base.position.y = 3;
    group.add(base);

    // 頂部多面體幾何結晶
    const crystal = new THREE.Mesh(GeoPool.cone, Materials.glass);
    crystal.scale.set(5, 6, 5);
    crystal.position.y = 9;
    crystal.rotation.x = Math.PI;
    group.add(crystal);
    return group;
  }

  // =====================
  // 英語島地標
  // =====================
  createClockTower() {
    const group = new THREE.Group();
    // 塔基
    const base = new THREE.Mesh(GeoPool.box, Materials.darkRock);
    base.scale.set(6, 2, 6);
    base.position.y = 1;
    group.add(base);

    const tower = new THREE.Mesh(GeoPool.box, Materials.whiteWall);
    tower.scale.set(5, 14, 5);
    tower.position.y = 8;
    group.add(tower);

    const roof = new THREE.Mesh(GeoPool.cone, Materials.english);
    roof.scale.set(4.2, 5, 4.2);
    roof.position.y = 17.5;
    roof.rotation.y = Math.PI / 4;
    group.add(roof);

    // 避雷金針塔尖
    const spire = new THREE.Mesh(GeoPool.cylinder, Materials.gold);
    spire.scale.set(0.18, 4, 0.18);
    spire.position.y = 21;
    group.add(spire);

    // 四面鐘錶 (前後左右四面皆有發光金盤)
    [
      { x: 0, z: 2.55, rotY: 0 },
      { x: 0, z: -2.55, rotY: Math.PI },
      { x: 2.55, z: 0, rotY: Math.PI / 2 },
      { x: -2.55, z: 0, rotY: -Math.PI / 2 }
    ].forEach(face => {
      const clock = new THREE.Mesh(GeoPool.cylinder, Materials.windowGlow);
      clock.scale.set(1.6, 0.2, 1.6);
      clock.position.set(face.x, 12.5, face.z);
      clock.rotation.x = Math.PI / 2;
      clock.rotation.z = face.rotY;
      group.add(clock);
    });
    return group;
  }

  createCalendarStation() {
    const group = new THREE.Group();
    const station = new THREE.Mesh(GeoPool.box, Materials.english);
    station.scale.set(9, 5, 6);
    station.position.y = 2.5;
    group.add(station);

    // 7 根星期立柱
    for (let i = -3; i <= 3; i++) {
      const col = new THREE.Mesh(GeoPool.cylinder, Materials.whiteWall);
      col.scale.set(0.4, 5, 0.4);
      col.position.set(i * 1.3, 5, 3.2);
      group.add(col);
    }
    return group;
  }

  createSubjectWorkshop() {
    const group = new THREE.Group();
    const workshop = new THREE.Mesh(GeoPool.box, Materials.whiteWall);
    workshop.scale.set(8, 6, 8);
    workshop.position.y = 3;
    group.add(workshop);

    const roof = new THREE.Mesh(GeoPool.cone, Materials.roofRed);
    roof.scale.set(6.5, 4, 6.5);
    roof.position.y = 8;
    roof.rotation.y = Math.PI / 4;
    group.add(roof);
    return group;
  }

  createReviewGazebo() {
    const group = new THREE.Group();
    const base = new THREE.Mesh(GeoPool.cylinder, Materials.english);
    base.scale.set(5, 1, 5);
    base.position.y = 0.5;
    group.add(base);

    const pillars = [0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2];
    pillars.forEach(ang => {
      const p = new THREE.Mesh(GeoPool.cylinder, Materials.whiteWall);
      p.scale.set(0.4, 6, 0.4);
      p.position.set(Math.cos(ang) * 3.5, 3.5, Math.sin(ang) * 3.5);
      group.add(p);
    });

    const dome = new THREE.Mesh(GeoPool.sphere, Materials.gold);
    dome.scale.set(4, 2.5, 4);
    dome.position.y = 7;
    group.add(dome);
    return group;
  }

  // =====================
  // 自然島地標
  // =====================
  createSunTracker() {
    const group = new THREE.Group();
    // 地平座標圓盤
    const dial = new THREE.Mesh(GeoPool.cylinder, Materials.whiteWall);
    dial.scale.set(7, 1, 7);
    dial.position.y = 0.5;
    group.add(dial);

    // 垂直竿影立竿
    const gnomon = new THREE.Mesh(GeoPool.cylinder, Materials.gold);
    gnomon.scale.set(0.4, 9, 0.4);
    gnomon.position.y = 5;
    group.add(gnomon);

    // 半球形天球觀測罩
    const hemisphere = new THREE.Mesh(GeoPool.sphere, Materials.glass);
    hemisphere.scale.set(6, 6, 6);
    hemisphere.position.y = 3;
    group.add(hemisphere);
    return group;
  }

  createPlantSphere() {
    const group = new THREE.Group();
    // 巨大生態玻璃球
    const sphere = new THREE.Mesh(GeoPool.sphere, Materials.glass);
    sphere.scale.set(6.5, 6.5, 6.5);
    sphere.position.y = 7;
    group.add(sphere);

    // 內部大樹樹幹與枝葉
    const trunk = new THREE.Mesh(GeoPool.cylinder, Materials.wood);
    trunk.scale.set(1.2, 7, 1.2);
    trunk.position.y = 4.5;
    group.add(trunk);

    const foliage = new THREE.Mesh(GeoPool.sphere, Materials.science);
    foliage.scale.set(4.5, 4.5, 4.5);
    foliage.position.y = 8;
    group.add(foliage);
    return group;
  }

  createGreenhouse() {
    const group = new THREE.Group();
    // 溫室白色鋼構基座
    const base = new THREE.Mesh(GeoPool.box, Materials.whiteWall);
    base.scale.set(8.4, 1.2, 8.4);
    base.position.y = 0.6;
    group.add(base);

    // 半透明透光玻璃花房
    const greenhouse = new THREE.Mesh(GeoPool.box, Materials.glass);
    greenhouse.scale.set(8, 5.5, 8);
    greenhouse.position.y = 3.8;
    group.add(greenhouse);

    // 人字型人造屋頂鋼樑
    const roof = new THREE.Mesh(GeoPool.cone, Materials.glass);
    roof.scale.set(6, 3, 6);
    roof.position.y = 7.8;
    roof.rotation.y = Math.PI / 4;
    group.add(roof);

    // 內部培育奇蹟發光植栽
    const plant = new THREE.Mesh(GeoPool.lowSphere, Materials.scienceAccent);
    plant.scale.set(2.8, 3.2, 2.8);
    plant.position.y = 3.6;
    group.add(plant);

    // 頂部風力傳播旋翼模型
    const propeller = new THREE.Mesh(GeoPool.box, Materials.gold);
    propeller.scale.set(8.5, 0.25, 0.8);
    propeller.position.y = 9.5;
    group.add(propeller);
    return group;
  }

  createDichotomyPavilion() {
    const group = new THREE.Group();
    const trunk = new THREE.Mesh(GeoPool.cylinder, Materials.wood);
    trunk.scale.set(1.5, 6, 1.5);
    trunk.position.y = 3;
    group.add(trunk);

    // 分叉支架
    const branchL = new THREE.Mesh(GeoPool.cylinder, Materials.wood);
    branchL.scale.set(0.8, 5, 0.8);
    branchL.position.set(-2, 7, 0);
    branchL.rotation.z = -Math.PI / 6;
    group.add(branchL);

    const branchR = new THREE.Mesh(GeoPool.cylinder, Materials.wood);
    branchR.scale.set(0.8, 5, 0.8);
    branchR.position.set(2, 7, 0);
    branchR.rotation.z = Math.PI / 6;
    group.add(branchR);
    return group;
  }

  // =====================
  // 社會島地標
  // =====================
  createTaiwanSandTable() {
    const group = new THREE.Group();
    // 圓形經緯沙盤基座
    const base = new THREE.Mesh(GeoPool.cylinder, Materials.social);
    base.scale.set(8, 2, 8);
    base.position.y = 1;
    group.add(base);

    // 象徵臺灣本島番薯造型多面體
    const islandPoly = new THREE.Mesh(GeoPool.cone, Materials.social);
    islandPoly.scale.set(3, 7, 5);
    islandPoly.position.set(0, 4.5, 0);
    islandPoly.rotation.x = Math.PI / 8;
    group.add(islandPoly);

    // 北回歸線金屬環
    const tropicLine = new THREE.Mesh(GeoPool.torus, Materials.gold);
    tropicLine.scale.set(6, 6, 0.25);
    tropicLine.position.y = 4;
    tropicLine.rotation.x = Math.PI / 2;
    group.add(tropicLine);
    return group;
  }

  createTerrainSteps() {
    const group = new THREE.Group();
    // 5 階地形階梯 (平原、台地、丘陵、盆地、山地)
    const heights = [1.5, 3.0, 4.5, 6.0, 8.0];
    const scales = [8, 6.5, 5.0, 3.5, 2.0];
    heights.forEach((h, i) => {
      const step = new THREE.Mesh(GeoPool.box, Materials.social);
      step.scale.set(scales[i], 1.2, scales[i]);
      step.position.y = h;
      group.add(step);
    });
    return group;
  }

  createWeatherStation() {
    const group = new THREE.Group();
    const tower = new THREE.Mesh(GeoPool.cylinder, Materials.whiteWall);
    tower.scale.set(2, 12, 2);
    tower.position.y = 6;
    group.add(tower);

    // 風向儀箭頭
    const arrow = new THREE.Mesh(GeoPool.cone, Materials.roofRed);
    arrow.scale.set(1.2, 3, 1.2);
    arrow.position.set(0, 13, 0);
    arrow.rotation.z = -Math.PI / 2;
    group.add(arrow);
    return group;
  }

  createReservoirDam() {
    const group = new THREE.Group();
    // 水庫大壩弧形牆
    const damWall = new THREE.Mesh(GeoPool.box, Materials.darkRock);
    damWall.scale.set(10, 7, 4);
    damWall.position.y = 3.5;
    group.add(damWall);

    // 蓄水面
    const reservoir = new THREE.Mesh(GeoPool.box, Materials.neonCyan);
    reservoir.scale.set(8, 5, 4);
    reservoir.position.set(0, 3, -3);
    group.add(reservoir);
    return group;
  }

  // =====================
  // 國語島地標
  // =====================
  createDreamPavilion() {
    const group = new THREE.Group();
    const pavilion = new THREE.Mesh(GeoPool.hexCylinder, Materials.chinese);
    pavilion.scale.set(6, 7, 6);
    pavilion.position.y = 3.5;
    group.add(pavilion);

    // 傳統飛簷屋頂
    const roof = new THREE.Mesh(GeoPool.cone, Materials.roofRed);
    roof.scale.set(7.5, 4, 7.5);
    roof.position.y = 9;
    roof.rotation.y = Math.PI / 6;
    group.add(roof);
    return group;
  }

  createArtGallery() {
    const group = new THREE.Group();
    const gallery = new THREE.Mesh(GeoPool.box, Materials.whiteWall);
    gallery.scale.set(9, 6, 7);
    gallery.position.y = 3;
    group.add(gallery);

    // 羅馬式三角門楣
    const pediment = new THREE.Mesh(GeoPool.cone, Materials.chinese);
    pediment.scale.set(6, 3, 6);
    pediment.position.y = 7.5;
    pediment.rotation.y = Math.PI / 4;
    group.add(pediment);
    return group;
  }

  createStrategyPaifang() {
    const group = new THREE.Group();
    // 兩側紅色大柱
    const colL = new THREE.Mesh(GeoPool.cylinder, Materials.roofRed);
    colL.scale.set(0.8, 9, 0.8);
    colL.position.set(-3.5, 4.5, 0);
    group.add(colL);

    const colR = new THREE.Mesh(GeoPool.cylinder, Materials.roofRed);
    colR.scale.set(0.8, 9, 0.8);
    colR.position.set(3.5, 4.5, 0);
    group.add(colR);

    // 牌坊橫匾
    const beam = new THREE.Mesh(GeoPool.box, Materials.gold);
    beam.scale.set(9, 1.6, 1.2);
    beam.position.set(0, 8, 0);
    group.add(beam);
    return group;
  }

  createInkstonePavilion() {
    const group = new THREE.Group();
    // 硯台形底座
    const inkstone = new THREE.Mesh(GeoPool.cylinder, Materials.dirt);
    inkstone.scale.set(6, 2, 6);
    inkstone.position.y = 1;
    group.add(inkstone);

    // 巨大毛筆石柱
    const brush = new THREE.Mesh(GeoPool.cylinder, Materials.wood);
    brush.scale.set(0.7, 10, 0.7);
    brush.position.set(0, 6, 0);
    group.add(brush);

    const brushTip = new THREE.Mesh(GeoPool.cone, Materials.whiteWall);
    brushTip.scale.set(1.2, 3, 1.2);
    brushTip.position.set(0, 12, 0);
    group.add(brushTip);
    return group;
  }

  createDefaultBuilding(islandId) {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(GeoPool.box, Materials[islandId] || Materials.whiteWall);
    mesh.scale.set(6, 6, 6);
    mesh.position.y = 3;
    group.add(mesh);
    return group;
  }
}
