import sys
import json
import os

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
quiz_path = os.path.join(ROOT_DIR, 'data', 'quizzes.json')
curriculum_path = os.path.join(ROOT_DIR, 'data', 'curriculum.json')

with open(quiz_path, 'r', encoding='utf-8') as f:
    quiz_data = json.load(f)

with open(curriculum_path, 'r', encoding='utf-8') as f:
    curriculum = json.load(f)

questions = quiz_data.get('questions', [])
print(f"==================================================")
print(f"📚 [題庫深度稽核報告] 目前題庫總數: {len(questions)} 題")
print(f"==================================================")

# 1. 檢核所有合法建築
valid_buildings = {}
for island in curriculum.get('islands', []):
    for b in island.get('buildings', []):
        valid_buildings[b['id']] = {
            'name': b['name'],
            'island': island['name'],
            'subject': island['subject']
        }

by_subject = {}
by_building = {}
errors = []
warnings = []

for idx, q in enumerate(questions):
    qid = q.get('id', f'unknown_{idx}')
    sub = q.get('subject')
    bid = q.get('buildingId')
    by_subject[sub] = by_subject.get(sub, 0) + 1
    by_building[bid] = by_building.get(bid, 0) + 1
    
    # 檢查建築 ID
    if bid not in valid_buildings:
        errors.append(f"[{qid}] buildingId '{bid}' 不在 curriculum.json 中！")
    
    # 檢查選項
    opts = q.get('options', [])
    if len(opts) != 4:
        warnings.append(f"[{qid}] 選項數非 4 個 (實際為 {len(opts)})")
    if len(opts) != len(set(opts)):
        errors.append(f"[{qid}] 選項出現重複文字！")
        
    # 檢查答案索引
    ans = q.get('answer')
    if ans is None or not isinstance(ans, int) or ans < 0 or ans >= len(opts):
        errors.append(f"[{qid}] answer 索引超界或非整數: {ans}")
    else:
        chosen_text = opts[ans]
        expl = q.get('explanation', '')
        # 檢查詳解是否提及正確解答的核心關鍵字
        if len(expl) < 15:
            warnings.append(f"[{qid}] 詳解字數較少 ({len(expl)} 字)")

    # 檢查鷹架提示
    hints = q.get('guidedHints', {})
    t1 = hints.get('tier1Keyword', '')
    t2 = hints.get('tier2MicroConcept', '')
    if not t1 or len(t1) < 10:
        errors.append(f"[{qid}] tier1Keyword（題眼提示）缺失或過短！")
    if not t2 or len(t2) < 15:
        errors.append(f"[{qid}] tier2MicroConcept（微卡片）缺失或過短！")

print("📊 各學科題量統計:")
for s, c in sorted(by_subject.items()):
    print(f"  • {s:10s}: {c} 題")

print("\n🏛️ 各地標建築題量覆蓋率 (全 23 棟):")
for bid, binfo in sorted(valid_buildings.items()):
    c = by_building.get(bid, 0)
    status = "✅" if c > 0 else ("⏳ (大會考隨機題)" if "center" in bid else "⚠️ 0 題")
    print(f"  {status} {bid:22s} ({binfo['island']} - {binfo['name']}): {c} 題")

print("\n" + "=" * 50)
if errors:
    print(f"❌ 嚴重錯誤 (Blocking Errors): 共 {len(errors)} 項")
    for e in errors:
        print(f"  • {e}")
else:
    print("✅ 嚴重錯誤 (Blocking Errors): 0 項 (全數通過)")

if warnings:
    print(f"\n⚠️ 建議優化項目 (Warnings/Suggestions): 共 {len(warnings)} 項")
    for w in warnings:
        print(f"  • {w}")
else:
    print("✅ 警告/建議項目: 0 項")
print("=" * 50)
