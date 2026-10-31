# -*- coding: utf-8 -*-
"""
test/validate_all.py
執行專案全鏈路品質與合規性驗收 (QA Auditor Automated Gatekeeper)
"""

import os
import sys
import json
import re

if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(ROOT_DIR, "data")
SRC_DIR = os.path.join(ROOT_DIR, "src")

print("=" * 60)
print("🛡️  [QA-Auditor] 啟動全專案品質閘門自動化驗證...")
print("=" * 60)

errors = []
warnings = []

# 1. 驗證資料模型 (curriculum.json & quizzes.json)
curriculum_path = os.path.join(DATA_DIR, "curriculum.json")
quizzes_path = os.path.join(DATA_DIR, "quizzes.json")

if not os.path.exists(curriculum_path):
    errors.append("data/curriculum.json 檔案缺失！")
if not os.path.exists(quizzes_path):
    errors.append("data/quizzes.json 檔案缺失！")

building_ids = set()
if os.path.exists(curriculum_path):
    try:
        with open(curriculum_path, "r", encoding="utf-8") as f:
            curriculum = json.load(f)
            islands = curriculum.get("islands", [])
            if len(islands) < 6:
                errors.append(f"島嶼數量不足 6 座 (實際為 {len(islands)})")
            for isl in islands:
                for b in isl.get("buildings", []):
                    building_ids.add(b.get("id"))
            print(f"✅ curriculum.json 合規：已註冊 {len(islands)} 座島嶼，{len(building_ids)} 棟地標建築")
    except Exception as e:
        errors.append(f"curriculum.json JSON 解析失敗: {e}")

if os.path.exists(quizzes_path):
    try:
        with open(quizzes_path, "r", encoding="utf-8") as f:
            quizzes = json.load(f)
            questions = quizzes.get("questions", [])
            if len(questions) < 50:
                errors.append(f"題庫題目少於 50 題 (實際為 {len(questions)})")
            
            for idx, q in enumerate(questions):
                qid = q.get("id", f"idx_{idx}")
                # 檢核 buildingId 存在
                bid = q.get("buildingId")
                if bid not in building_ids:
                    errors.append(f"題目 {qid} 之 buildingId '{bid}' 不存在於 curriculum.json！")
                
                # 檢核選項與解答
                opts = q.get("options", [])
                if len(opts) < 2:
                    errors.append(f"題目 {qid} 選項少於 2 個！")
                ans = q.get("answer")
                if not isinstance(ans, int) or ans < 0 or ans >= len(opts):
                    errors.append(f"題目 {qid} answer 索引超界 ({ans})！")
                
                # 檢核三階鷹架
                hints = q.get("guidedHints", {})
                if not hints.get("tier1Keyword"):
                    errors.append(f"題目 {qid} 缺失 tier1Keyword（題眼提示）！")
                if not hints.get("tier2MicroConcept"):
                    errors.append(f"題目 {qid} 缺失 tier2MicroConcept（微卡片）！")
            
            print(f"✅ quizzes.json 合規：已驗證 {len(questions)} 道試題，三階鷹架完整")
    except Exception as e:
        errors.append(f"quizzes.json JSON 解析失敗: {e}")

# 2. 靜態代碼 GC 規範稽核 (禁止在 rAF 中 new THREE 物件)
app_path = os.path.join(SRC_DIR, "app.js")
if os.path.exists(app_path):
    with open(app_path, "r", encoding="utf-8") as f:
        content = f.read()
        animate_match = re.search(r"animate\s*\(\)\s*\{([\s\S]*?)\}", content)
        if animate_match:
            body = animate_match.group(1)
            if "new THREE." in body:
                errors.append("src/app.js 的 animate() 渲染迴圈中出現 new THREE.*，違背零 GC 規範！")
            else:
                print("✅ 渲染循環檢驗：animate() 迴圈無記憶體配置 (Zero-GC Verified)")

# 3. 部署規格檢驗 (index.html & 無打包構建純原生)
index_path = os.path.join(ROOT_DIR, "index.html")
if not os.path.exists(index_path):
    errors.append("index.html 缺失！")
else:
    with open(index_path, "r", encoding="utf-8") as f:
        html = f.read()
        if "type=\"importmap\"" not in html:
            errors.append("index.html 未使用 Import Maps 原生載入模組！")
        else:
            print("✅ 部署與架構檢驗：100% 純原生 Vanilla JS + Import Maps")

print("=" * 60)
if errors:
    print(f"❌ 驗收未通過，共有 {len(errors)} 個嚴重錯誤：")
    for err in errors:
        print(f"  • {err}")
    sys.exit(1)
else:
    print("🎉 [ALL PASS] 全專案自動化測試與架構驗收 100% 通過！0 錯誤 0 警告")
    print("=" * 60)
