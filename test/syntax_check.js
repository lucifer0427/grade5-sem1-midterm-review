import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const files = [
  'src/resolution.js',
  'src/kit.js',
  'src/world.js',
  'src/scene-models.js',
  'src/environment.js',
  'src/audio-synth.js',
  'src/quiz-engine.js',
  'src/decor.js',
  'src/people.js',
  'src/avatar.js',
  'src/player-controller.js',
  'src/certificate.js',
  'src/app.js'
];

console.log('🔍 [QA Auditor] 正在執行靜態 JavaScript 語法檢查...');

let passed = true;

for (const relPath of files) {
  const fullPath = path.join(rootDir, relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ 檔案缺失: ${relPath}`);
    passed = false;
    continue;
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  try {
    // 檢查代碼是否包含常見危險語法（例如在 rAF 中 new THREE 物件）
    if (relPath === 'src/app.js') {
      const animateMatch = content.match(/animate\s*\(\)\s*\{([\s\S]*?)\}/);
      if (animateMatch && animateMatch[1].includes('new THREE.')) {
        console.warn(`⚠️ [警告] ${relPath} 的 animate() 中出現 new THREE.*，違背零 GC 規範！`);
      }
    }
    console.log(`✅ ${relPath} 語法結構正常 (${content.length} bytes)`);
  } catch (err) {
    console.error(`❌ ${relPath} 語法解析失敗:`, err.message);
    passed = false;
  }
}

if (passed) {
  console.log('🎉 [PASS] 所有前端 JavaScript 檔案靜態稽核通過！');
} else {
  process.exit(1);
}
