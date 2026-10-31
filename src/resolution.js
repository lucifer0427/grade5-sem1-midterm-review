// resolution.js: 自適應動態解析度與效能監控控制器 (確保 60 FPS)

export class ResolutionController {
  constructor(renderer, options = {}) {
    this.renderer = renderer;
    this.targetFps = options.targetFps || 58;
    this.lowFpsThreshold = options.lowFpsThreshold || 45;
    this.maxDpr = Math.min(window.devicePixelRatio || 1, 2);
    this.minDpr = 1.0;
    this.currentDpr = this.maxDpr;
    
    this.fpsHistory = [];
    this.historyLength = 30; // 追蹤 30 幀平滑平均
    this.lowFpsDuration = 0;
    this.shadowsEnabled = true;

    this.renderer.setPixelRatio(this.currentDpr);
  }

  update(delta) {
    if (delta <= 0) return;
    const currentFps = 1 / delta;
    this.fpsHistory.push(currentFps);
    if (this.fpsHistory.length > this.historyLength) {
      this.fpsHistory.shift();
    }

    const avgFps = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;

    // 掉幀降級處理
    if (avgFps < this.lowFpsThreshold) {
      this.lowFpsDuration += delta;
      if (this.lowFpsDuration > 2.0 && this.currentDpr > this.minDpr) {
        // 降低 DPR
        this.currentDpr = Math.max(this.minDpr, this.currentDpr - 0.25);
        this.renderer.setPixelRatio(this.currentDpr);
        this.lowFpsDuration = 0;
        console.warn(`[Resolution] 偵測到幀率不足 (${avgFps.toFixed(1)} FPS)，DPR 降至 ${this.currentDpr}`);

        // 若仍低於 40 FPS，關閉陰影
        if (avgFps < 38 && this.shadowsEnabled) {
          this.shadowsEnabled = false;
          this.renderer.shadowMap.enabled = false;
          console.warn('[Resolution] 自動關閉動態陰影以確保操作流暢度');
        }
      }
    } else {
      this.lowFpsDuration = Math.max(0, this.lowFpsDuration - delta);
    }
  }

  getCurrentDpr() {
    return this.currentDpr;
  }
}
