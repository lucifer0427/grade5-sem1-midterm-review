// environment.js: 日夜光影、太陽/月亮、霧氣與海洋水面
import * as THREE from 'three';
import { GeoPool, Materials } from './kit.js';

export class EnvironmentManager {
  constructor(scene) {
    this.scene = scene;
    this.initLights();
    this.initOcean();
    this.initFog();
  }

  initLights() {
    // 環境光
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(this.ambientLight);

    // 主太陽平行光
    this.sunLight = new THREE.DirectionalLight(0xfffaed, 1.2);
    this.sunLight.position.set(60, 100, 40);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 1024;
    this.sunLight.shadow.mapSize.height = 1024;
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 300;
    const d = 120;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.scene.add(this.sunLight);

    // 舞台專用動態彩色聚光燈
    this.spotLight1 = new THREE.SpotLight(0xff007f, 3, 100, Math.PI / 6, 0.5);
    this.spotLight1.position.set(0, 35, 0);
    this.spotLight1.target.position.set(0, 0, 0);
    this.scene.add(this.spotLight1);
    this.scene.add(this.spotLight1.target);

    this.spotLight2 = new THREE.SpotLight(0x00e5ff, 3, 100, Math.PI / 6, 0.5);
    this.spotLight2.position.set(0, 35, 0);
    this.spotLight2.target.position.set(0, 0, 0);
    this.scene.add(this.spotLight2);
    this.scene.add(this.spotLight2.target);
  }

  initOcean() {
    // 海洋平面 (半徑 400 的圓盤或大面)
    const oceanGeo = new THREE.CircleGeometry(350, 48);
    this.oceanMesh = new THREE.Mesh(oceanGeo, Materials.sea);
    this.oceanMesh.rotation.x = -Math.PI / 2;
    this.oceanMesh.position.y = 1.0; // 稍微低於六角地塊
    this.oceanMesh.receiveShadow = true;
    this.scene.add(this.oceanMesh);
  }

  initFog() {
    this.scene.background = new THREE.Color(0xdbeafe);
    this.scene.fog = new THREE.FogExp2(0xdbeafe, 0.003);
  }

  // 設定日夜時鐘 (0 ~ 24)
  setTimeOfDay(hour) {
    const angle = (hour / 24) * Math.PI * 2 - Math.PI / 2;
    const sunDistance = 120;
    const sunX = Math.cos(angle) * sunDistance;
    const sunY = Math.sin(angle) * sunDistance;

    this.sunLight.position.set(sunX, Math.max(10, sunY), 50);

    // 白天 (6 ~ 17)
    if (hour >= 6 && hour < 16) {
      this.ambientLight.intensity = 0.8;
      this.ambientLight.color.setHex(0xffffff);
      this.sunLight.intensity = 1.2;
      this.sunLight.color.setHex(0xfffaed);
      this.scene.background.setHex(0xdbeafe);
      this.scene.fog.color.setHex(0xdbeafe);
    }
    // 黃昏 (16 ~ 19)
    else if (hour >= 16 && hour < 19) {
      this.ambientLight.intensity = 0.6;
      this.ambientLight.color.setHex(0xfed7aa);
      this.sunLight.intensity = 0.9;
      this.sunLight.color.setHex(0xf97316);
      this.scene.background.setHex(0xfb923c);
      this.scene.fog.color.setHex(0xfb923c);
    }
    // 夜晚 (19 ~ 6)
    else {
      this.ambientLight.intensity = 0.35;
      this.ambientLight.color.setHex(0x312e81);
      this.sunLight.intensity = 0.3;
      this.sunLight.color.setHex(0x93c5fd);
      this.scene.background.setHex(0x0f172a);
      this.scene.fog.color.setHex(0x0f172a);
    }
  }

  update(time) {
    // 舞台聚光燈旋轉動態
    if (this.spotLight1 && this.spotLight2) {
      const r = 12;
      this.spotLight1.target.position.x = Math.cos(time * 2) * r;
      this.spotLight1.target.position.z = Math.sin(time * 2) * r;

      this.spotLight2.target.position.x = Math.cos(time * 2 + Math.PI) * r;
      this.spotLight2.target.position.z = Math.sin(time * 2 + Math.PI) * r;
    }
  }
}
