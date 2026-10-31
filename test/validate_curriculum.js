import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const curriculumPath = path.join(rootDir, 'data', 'curriculum.json');
const quizzesPath = path.join(rootDir, 'data', 'quizzes.json');

console.log('🔍 [QA Auditor] 開始驗證課程與題庫資料格式 (Schema Validation)...');

if (!fs.existsSync(curriculumPath)) {
  console.error('❌ curriculum.json 不存在！');
  process.exit(1);
}
if (!fs.existsSync(quizzesPath)) {
  console.error('❌ quizzes.json 不存在！');
  process.exit(1);
}

const curriculum = JSON.parse(fs.readFileSync(curriculumPath, 'utf8'));
const quizzes = JSON.parse(fs.readFileSync(quizzesPath, 'utf8'));

// 1. 建立合法建築 ID 集合
const buildingIds = new Set();
curriculum.islands.forEach(island => {
  island.buildings.forEach(b => {
    buildingIds.add(b.id);
  });
});

console.log(`✅ 已註冊 ${curriculum.islands.length} 座島嶼，共 ${buildingIds.size} 棟地標建築。`);

// 2. 驗證題目
let errorCount = 0;
const subjects = new Set();

quizzes.questions.forEach((q, idx) => {
  subjects.add(q.subject);
  
  if (!q.id) {
    console.error(`❌ [題號 ${idx}] 缺少 id`);
    errorCount++;
  }
  if (!buildingIds.has(q.buildingId)) {
    console.error(`❌ [題號 ${q.id}] buildingId "${q.buildingId}" 不存在於 curriculum.json！`);
    errorCount++;
  }
  if (!Array.isArray(q.options) || q.options.length < 2) {
    console.error(`❌ [題號 ${q.id}] 選項 options 陣列長度不合法`);
    errorCount++;
  }
  if (typeof q.answer !== 'number' || q.answer < 0 || q.answer >= q.options.length) {
    console.error(`❌ [題號 ${q.id}] 正確解答索引 answer 超界 (${q.answer})`);
    errorCount++;
  }
  if (!q.guidedHints || !q.guidedHints.tier1Keyword || !q.guidedHints.tier2MicroConcept) {
    console.error(`❌ [題號 ${q.id}] 缺少三階鷹架提示 (tier1Keyword 或 tier2MicroConcept)`);
    errorCount++;
  }
  if (!q.explanation || q.explanation.length < 5) {
    console.error(`❌ [題號 ${q.id}] 詳解 explanation 過短或缺失`);
    errorCount++;
  }
});

console.log(`✅ 驗證完成：題庫共有 ${quizzes.questions.length} 題，涵蓋學科: ${Array.from(subjects).join(', ')}`);

if (errorCount > 0) {
  console.error(`💥 驗證失敗，發現 ${errorCount} 個違規項目！`);
  process.exit(1);
} else {
  console.log('🎉 [PASS] 資料 Schema 與三階鷹架全部合規！');
}
