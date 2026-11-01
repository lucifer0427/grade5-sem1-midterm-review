# -*- coding: utf-8 -*-
"""
合併 5 大學科共 250 題題庫並更新 data/quizzes.json 與 data/curriculum.json 的 quizCount。
"""
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

from quizzes_chinese import chinese_questions as CHINESE_QUIZZES
from quizzes_math import math_questions as MATH_QUIZZES
from quizzes_science import SCIENCE_QUIZZES
from quizzes_social import SOCIAL_QUIZZES
from quizzes_english import ENGLISH_QUIZZES

ALL_QUIZZES = CHINESE_QUIZZES + MATH_QUIZZES + SCIENCE_QUIZZES + SOCIAL_QUIZZES + ENGLISH_QUIZZES

print(f"總題目數量: {len(ALL_QUIZZES)}")
print(f"國語: {len(CHINESE_QUIZZES)} | 數學: {len(MATH_QUIZZES)} | 自然: {len(SCIENCE_QUIZZES)} | 社會: {len(SOCIAL_QUIZZES)} | 英語: {len(ENGLISH_QUIZZES)}")

# 載入 curriculum.json
curr_path = os.path.join(os.path.dirname(__file__), "..", "data", "curriculum.json")
with open(curr_path, "r", encoding="utf-8") as f:
    curriculum = json.load(f)

# 取得 curriculum 中所有建築 ID
valid_bld_ids = set()
for isl in curriculum.get("islands", []):
    for bld in isl.get("buildings", []):
        valid_bld_ids.add(bld["id"])

print(f"curriculum 中有效建築總數: {len(valid_bld_ids)}")

# 題目統計與防呆驗證
bld_counts = {}
seen_ids = set()
for idx, q in enumerate(ALL_QUIZZES):
    qid = q.get("id")
    assert qid, f"第 {idx} 題缺少 id"
    assert qid not in seen_ids, f"重複題目 id: {qid}"
    seen_ids.add(qid)
    
    bld_id = q.get("buildingId")
    assert bld_id in valid_bld_ids, f"題目 {qid} 的建築 ID '{bld_id}' 不在 curriculum.json 中！"
    bld_counts[bld_id] = bld_counts.get(bld_id, 0) + 1
    
    assert len(q.get("options", [])) == 4, f"題目 {qid} 選項數不為 4"
    ans = q.get("answer")
    assert isinstance(ans, int) and 0 <= ans < 4, f"題目 {qid} answer 索引不合法: {ans}"
    
    hints = q.get("guidedHints", {})
    assert "tier1Keyword" in hints and hints["tier1Keyword"], f"題目 {qid} 缺少 tier1Keyword"
    assert "tier2MicroConcept" in hints and hints["tier2MicroConcept"], f"題目 {qid} 缺少 tier2MicroConcept"

print(f"建築題數分佈: {bld_counts}")

# 寫入 data/quizzes.json
quizzes_path = os.path.join(os.path.dirname(__file__), "..", "data", "quizzes.json")
quizzes_data = {
    "version": "2.0.0",
    "updatedAt": "2026-11-01",
    "totalCount": len(ALL_QUIZZES),
    "subjects": {
        "chinese": len(CHINESE_QUIZZES),
        "math": len(MATH_QUIZZES),
        "science": len(SCIENCE_QUIZZES),
        "social": len(SOCIAL_QUIZZES),
        "english": len(ENGLISH_QUIZZES)
    },
    "questions": ALL_QUIZZES,
    "quizzes": ALL_QUIZZES
}

with open(quizzes_path, "w", encoding="utf-8") as f:
    json.dump(quizzes_data, f, ensure_ascii=False, indent=2)
print(f"成功寫入 {quizzes_path} (總題數: {len(ALL_QUIZZES)})")

# 更新 curriculum.json 中的 quizCount
for isl in curriculum.get("islands", []):
    for bld in isl.get("buildings", []):
        bid = bld["id"]
        if bid in bld_counts:
            bld["quizCount"] = bld_counts[bid]
        elif bid == "center-stage":
            bld["quizCount"] = 25  # 大會考每次隨機抽 25 題 (每科 5 題)
        else:
            bld["quizCount"] = 0

with open(curr_path, "w", encoding="utf-8") as f:
    json.dump(curriculum, f, ensure_ascii=False, indent=2)
print(f"成功更新 {curr_path} 中的 quizCount！")
