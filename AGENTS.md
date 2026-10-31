# AGENTS.md — 國小五年級期中考複習 3D 知識島專案 (Agent 團隊職責規範)

本文件定義由 AI 代理人（Agents）或開發協作小組在建構、維護與擴充「小五期中考 3D 複習島 (Exam Review Island)」專案時的角色分工、輸入/輸出規範、作業準則與協同流程。

---

## 1. 代理人團隊矩陣 (Agent Matrix)

| Agent 角色 | 主要代號 | 核心職責 | 輸入來源 | 產出成果 |
|---|---|---|---|---|
| **課綱知識擷取代理人** | `curriculum-extractor` | 解析「考試範圍」Markdown，抽取單元觀念、考點、測驗題並標準化為 JSON | `考試範圍/*.md` | `data/curriculum.json`, `data/quizzes.json` |
| **3D 世界與拓撲架構師** | `world-architect` | 設計五大學科六角島嶼座標、板塊連結、橋樑拓撲與地標建築 Procedural 生成 | `data/curriculum.json` | `src/world.js`, `src/scene-models.js`, `src/kit.js` |
| **動態互動與測驗機制工程師** | `gameplay-engineer` | 實作 Raycast 拾取、測驗問答彈窗、計分答題狀態機、過關解鎖與音效 | `src/app.js`, `data/quizzes.json` | `src/quiz-engine.js`, `src/state-store.js` |
| **學童 UI/UX 與視覺美化師** | `ui-stylist` | 打造適合國小五年級學童的可愛清新色調、大按鈕、注音/字體支援與行動端觸控適配 | 規範、CSS、SVG | `index.html`, `css/ui.css`, `src/decor.js` |
| **品質審查與驗收測試員** | `qa-auditor` | 執行「開發➔審查➔測試」閘門驗收，檢查 Schema、效能指標與學童體驗，不合格一律退回重修 | 各代理人產出 | `test/audit-report.md`, 自動化驗證腳本 |
| **效能節流與 GitHub Pages 發布員** | `devops-deployer` | 負責無建置依賴打包、靜態資源管理、動態 DPR 控制、跨裝置測試與 Pages 部署 | 全專案程式碼與靜態資源 | GitHub Actions / Pages 部署分支 |

---

## 2. 代理人詳細作業規格 (Operational Specifications)

### 2.1 課綱知識擷取代理人 (`curriculum-extractor`)
- **任務目標**：精準解析 5 大學科（國語-康軒、數學-翰林、英語-翰林、自然-翰林、社會-康軒），建立結構化 JSON。
- **資料 Schema 準則**：
  - 每個科目對應一個主島（`Island`），每個單元對應一個建築（`Building`），每個考點對應一張知識卡（`Card`）。
  - 題目需標註題型（單選 `mcq`、是非 `tf`、填空 `blank`）、難易度（`level`: 1~3）、詳解（`explanation`）與關聯知識點（`conceptRef`）。
  - **三階引導鷹架必填 (`guidedHints`)**：每題必須包含 `tier1Keyword`（題眼聚焦提示）與 `tier2MicroConcept`（迷思核心微卡片），嚴禁直接洩漏答案。
- **嚴格禁忌**：
  - 禁止遺漏任何公式、實驗結論、易錯字音字形。
  - 題目中包含數學算式時必須採用 Unicode 或格式化純文字（避免學童行動裝置無法渲染 LaTeX）。

### 2.2 3D 世界與拓撲架構師 (`world-architect`)
- **任務目標**：沿用 `HEART_ISLAND` 的零模型下載架構（Zero External 3D Assets），純代碼程序化生成。
- **設計準則**：
  - 採用六角軸向座標系 `(q, r)`。中央為「期中考總挑戰島」，周圍環繞 5 個學科島嶼（國/數/英/自/社）。
  - 依據學科特徵設計程序化建築幾何：
    - 國語島：書卷閣樓、筆墨石柱、字詞牌坊。
    - 數學島：幾何多面體塔、對稱天秤、七巧板基座。
    - 自然島：太陽觀測儀、巨大植物溫室、稜鏡聚光燈塔。
    - 社會島：臺灣地形沙盤、等高線梯田、氣象觀測站。
    - 英語島：大笨鐘風格時鐘塔、字母橋、情境對話亭。
  - 必須透過 `mergeGeometries` 合併靜態網格，控制 WebGL Draw Calls 小於 50。

### 2.3 動態互動與測驗機制工程師 (`gameplay-engineer`)
- **任務目標**：實現沉浸式「探索 ➔ 複習 ➔ 答題 ➔ 升級」的遊戲化學習循環。
- **功能規範**：
  - **狀態管理**：使用 `localStorage` 保存學童答題紀錄、各科星星數、解鎖徽章與自訂 Avatar。
  - **三階引導式答題狀態機**：
    - 第一次答錯：觸發 Tier 1 題眼高亮與 50/50 干擾項消除，給予學童第二次思考嘗試機會。
    - 第二次答錯：彈出 Tier 2 概念微卡片圖解，並開啟「Tier 3 概念傳送門」平滑運鏡至對應島嶼建築。
    - 變形平行題檢核：提供數值/主詞微調之平行題，答對依然發放星光獎勵，建立自信心。
  - **即時回饋**：答對播放躍動動畫與鼓勵音效（Web Audio API 程序化合成，不需載入 MP3）。
  - **三級獎勵與激勵機制**：
    - 即時回饋：星光幣發放、COMBO 連擊音畫（Canvas Confetti 彩帶）。
    - 關卡成就：通關點亮建築頂部 3D 永恆光柱，派發「應援盲盒」解鎖 Avatar 裝扮。
    - 結算榮譽：大會考結束利用 HTML Canvas 動態合成「K-POP 練習生出道獎狀」與雷達圖，支援下載存圖。
  - **大會考挑戰模式**：具備倒數計時、隨機抽題（各科各抽 2~4 題）與成績單結算生成功能。

### 2.4 學童 UI/UX 與視覺美化師 (`ui-stylist`)
- **設計原則**：
  - **學童友善 (Child-Centric)**：字體清晰（支援系統級圓體/黑體），按鈕點擊熱區至少 48px $\times$ 48px。
  - **配色明亮活潑**：國語（活力珊瑚橘）、數學（智慧湛藍）、自然（森林翠綠）、社會（大地暖棕）、英語（陽光明黃）。
  - **介面語言**：標準繁體中文（可切換注音提示模式或純繁體中文）。
  - **HUD 控制**：保留日夜滑桿、鳥瞰視角、學科篩選按鈕與測驗成果徽章庫。

### 2.5 品質審查與驗收測試員 (`qa-auditor`)
- **任務目標**：扮演專案品質守門人，負責把關「審查 (Review)」與「測試 (Test)」兩大關卡，未達標者執行**「無情退回 (Reject & Return)」**。
- **審查標準 (Review Checklist)**：
  1. 靜態碼檢：無未宣告變數、無在 rAF 迴圈內 `new` 建立物件、無外部未授權依賴。
  2. 資料 Schema 稽核：`curriculum.json` 與 `quizzes.json` 欄位完整，且每題均具備三階鷹架提示。
  3. 檔案大小與網路預算：無肥大資產（圖片/模型），全站核心資源小於 1MB。
- **測試標準 (Test Checklist)**：
  1. 自動化測試：執行 `python test/validate_all.py`，0 警告 0 錯誤。
  2. 互動鏈路：點擊建築 ➔ 彈出複習卡 ➔ 進入測驗 ➔ 答題（對/錯）➔ 觸發音效與動畫 ➔ 結算，無任何 console error。
  3. 跨裝置響應：模擬 iPad (810x1080) 與常見手機 (390x844)，不可出現非預期的水平滾動條或遮擋點擊熱區。

### 2.6 效能節流與 GitHub Pages 發布員 (`devops-deployer`)
- **部署規範**：
  - 架構必須是 100% 靜態純原生（Vanilla JS + Import Maps），推送到 `main` 分支即可由 GitHub Pages 直接 Host，無需 Node.js/Webpack 打包。
  - 保持動態 DPR 自適應（`resolution.js`）：iPad / 低階手機掉幀時自動降級陰影與解析度，確保 60 FPS。
  - 必須確認 `qa-auditor` 的審查與測試驗收報告為 **PASS**，否則嚴禁發布。

---

## 3. 「開發 ➔ 審查 ➔ 測試 ➔ 驗收/退回」品質閉環 (Quality Gate Loop)

```
        ┌──────────────────────────────────────────────────┐
        │  1. 開發階段 (Development)                       │
        │  負責 Agent 依規格產出代碼/資料/樣式             │
        └────────────────────────┬─────────────────────────┘
                                 │ 提交產出 (Submit)
                                 ▼
        ┌──────────────────────────────────────────────────┐
        │  2. 審查階段 (Code & Content Review)            │
        │  • qa-auditor 審查規範、架構與三階鷹架完整性     │
        └───────┬──────────────────────────────────┬───────┘
                │ [審查不合規]                      │ [審查通過 (Pass)]
                ▼                                  ▼
        ┌──────────────┐         ┌──────────────────────────────────────────────────┐
        │ ❌ 退回重修  │         │  3. 測試階段 (Testing & E2E Verification)        │
        │ 發出缺陷清單 │         │  • 自動化腳本驗證 (Schema / Link / Boundary)     │
        │ (Defect Log) │         │  • 瀏覽器與行動裝置模擬 (Console / Touch / FPS)  │
        └───────▲──────┘         └───────┬──────────────────────────────────┬───────┘
                │                        │ [測試失敗/異常]                  │ [全部測試通過]
                └────────────────────────┘                                  ▼
                                                           ┌──────────────────────────────────┐
                                                           │  4. 驗收發布 (Deploy & Release)  │
                                                           │  • devops-deployer 合併並發布    │
                                                           │  • GitHub Pages 部署上線         │
                                                           └──────────────────────────────────┘
```

---

## 4. 嚴格退回標準清單 (Rejection Criteria)

凡觸發下列任一情事，審查/測試代理人必須**立即退回**，不得通融：

| 領域 | 觸發退回之違規項目 (Rejection Trigger) | 負責修正之 Agent |
|---|---|---|
| **題庫與資料** | 1. 選項少於 4 個（或是非題少於 2 個）<br>2. 正確答案索引超界（如 `answer: 4` 但只有 4 個選項）<br>3. 遺漏 `guidedHints`（缺少題眼提示或微卡片）<br>4. 建築關聯 ID 在 `curriculum.json` 查無此建築 | `curriculum-extractor` |
| **3D 與渲染** | 1. 在 `animate` 或 `requestAnimationFrame` 迴圈中 `new THREE.*`<br>2. 未合併靜態幾何體，導致場景 Draw Calls 超過 50<br>3. 鏡頭 OrbitControls 出現穿模或翻轉無約束 | `world-architect` |
| **遊戲互動** | 1. 未實作 Web Audio 使用者手勢解鎖，造成首次答題靜音<br>2. 答題後卡死，未正常觸發回饋動畫或下一題按鈕<br>3. `localStorage` 寫入失敗造成進度遺失或跳出報錯 | `gameplay-engineer` |
| **介面與無障礙** | 1. 關鍵按鈕點擊範圍小於 $48\text{px} \times 48\text{px}$<br>2. 在 iPad 或手機寬度下出現非預期的水平捲軸<br>3. 文字與背景對比度不足（WCAG AA 標準以下） | `ui-stylist` |
| **主控整合** | 1. 瀏覽器 Console 出現任何紅字 Uncaught TypeError / Error<br>2. 首屏加載資源大於 1.5MB（違背輕量化原則） | 全體協同修正 |

---

## 5. 程式碼品質與防呆要求
1. **無外部相依性**：Three.js 統一由 Import Maps（如 CDN 或 vendor 目錄）載入，絕不使用本地 npm 構建包。
2. **錯誤邊界 (Error Resilience)**：若個別島嶼模型生成異常，必須有 fallback 的基礎六角柱頂替，絕不中斷整體場景渲染。
3. **離線/弱網能力**：`localStorage` 本地儲存答題進度，離開瀏覽器再進入依然保留進度。
