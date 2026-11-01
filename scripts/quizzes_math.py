# -*- coding: utf-8 -*-
# quizzes_math.py: 翰林數學五上單元1~5 (共 50 題)

math_questions = [
  # ==========================================
  # math-linegraph: 折線圖觀測台 (單元一) - 10 題
  # ==========================================
  {
    "id": "math-linegraph-001",
    "subject": "math",
    "buildingId": "math-linegraph",
    "type": "mcq",
    "question": "製作折線圖時，若資料數值集中在 150 到 165 公分之間，為什麼要在縱軸 0 到 150 之間使用「鋸齒狀省略符號（≈）」？",
    "options": [
      "為了讓圖表看起來更美觀",
      "截斷無資料的空白區間，放大單位刻度以凸顯微小數據起伏趨勢",
      "因為小數點無法繪製，所以必須省略",
      "為了節省紙張印刷成本"
    ],
    "answer": 1,
    "level": 1,
    "guidedHints": {
      "tier1Keyword": "💡 題眼鎖定：如果從 0 開始每一格畫 10 公分，150 到 165 之間只差 1.5 格，折線看起來會怎樣？",
      "tier2MicroConcept": "📐 折線圖核心：折線圖旨在展現連續資料的『變化趨勢』。省略符號能截去無效的過大空白，讓縱軸每小格代表更小單位，使起伏清晰可見。",
      "portalBuildingId": "math-linegraph"
    },
    "explanation": "當數據起算點遠大於零且變動集中在特定區間時，使用省略符號可截斷多餘空白，放大縱軸單位刻度，使折線起伏趨勢更為明顯易讀。"
  },
  {
    "id": "math-linegraph-002",
    "subject": "math",
    "buildingId": "math-linegraph",
    "type": "mcq",
    "question": "觀察某病人一天內的體溫折線圖，哪一種線段特徵代表病人的體溫正在「急遽上升」？",
    "options": [
      "水平平緩的橫直線",
      "由左下往右上陡峭傾斜的折線",
      "由左上往右下傾斜的折線",
      "完全垂直落下的虛線"
    ],
    "answer": 1,
    "level": 1,
    "guidedHints": {
      "tier1Keyword": "💡 題眼提示：時間由左向右推進，體溫若從 37 度飆升到 39 度，折線會往哪個方向劇烈傾斜？",
      "tier2MicroConcept": "📐 折線圖走勢判讀：\n• 向上傾斜且越陡：數值急遽增加\n• 水平橫線：數值保持不變\n• 向下傾斜：數值正在減少",
      "portalBuildingId": "math-linegraph"
    },
    "explanation": "在以時間為橫軸的折線圖中，由左下向右上快速攀升且坡度陡峭的折線，代表數值在短時間內急遽增加。"
  },
  {
    "id": "math-linegraph-003",
    "subject": "math",
    "buildingId": "math-linegraph",
    "type": "mcq",
    "question": "下列哪一種生活情境「最適合」使用折線圖來呈現？",
    "options": [
      "五年級各班學生最喜歡吃的水果種類人數統計",
      "全班同學的身高在一年四季內每個月的連續成長變化紀錄",
      "文具店內鉛筆、橡皮擦、尺的庫存數量比對",
      "停車場內不同顏色汽車的總數量"
    ],
    "answer": 1,
    "level": 2,
    "guidedHints": {
      "tier1Keyword": "💡 題眼鎖定：折線圖專門用來呈現具有『時間前後連續性』的數據趨勢；不具連續性的獨立類別比較通常使用長條圖。",
      "tier2MicroConcept": "📐 圖表選擇原則：\n• 長條圖：比較各獨立類別數量多寡（如水果喜好、車輛顏色）\n• 折線圖：觀察同一對象隨時間推進的連續起伏走勢（如氣溫、身高、體重）",
      "portalBuildingId": "math-linegraph"
    },
    "explanation": "每個月的身高成長屬於隨時間演進的連續性變化數據，使用折線圖最能清楚看出長高的速率與起伏趨勢。"
  },
  {
    "id": "math-linegraph-004",
    "subject": "math",
    "buildingId": "math-linegraph",
    "type": "mcq",
    "question": "在「複式折線圖」中，通常如何區分兩筆不同的資料項目（例如臺北市與高雄市的一週氣溫）？",
    "options": [
      "一律使用完全相同的黑實線繪製，由讀者自行猜測",
      "以不同顏色、不同線型（實線與虛線）或不同標記點符號搭配圖例標示",
      "把其中一筆資料倒過來畫在背面",
      "兩條折線絕對不能畫在同一張圖表上"
    ],
    "answer": 1,
    "level": 1,
    "guidedHints": {
      "tier1Keyword": "💡 題眼提示：在一張圖上看兩座城市的氣溫比對，要怎麼一眼認出哪條線是臺北、哪條是高雄？",
      "tier2MicroConcept": "📐 複式折線圖關鍵元件：『圖例（Legend）』與『相異視覺樣式（顏色/虛實線/圓點與三角形）』，確保比對時一目了然。",
      "portalBuildingId": "math-linegraph"
    },
    "explanation": "複式折線圖利用不同色彩、線條樣式（如實線與虛線）及圖例標籤，讓讀者能快速對照兩組數據的差異與交叉點。"
  },
  {
    "id": "math-linegraph-005",
    "subject": "math",
    "buildingId": "math-linegraph",
    "type": "mcq",
    "question": "某月某地一週氣溫折線圖中，星期一為 22℃，星期二為 25℃，星期三為 21℃，星期四為 28℃。請問哪兩天之間的「溫差變化最大」？",
    "options": [
      "星期一到星期二（變化 3℃）",
      "星期二到星期三（變化 4℃）",
      "星期三到星期四（變化 7℃）",
      "每天變化都完全一樣"
    ],
    "answer": 2,
    "level": 2,
    "guidedHints": {
      "tier1Keyword": "💡 題眼提示：計算相鄰兩天的溫度差距絕對值：|25-22|=3，|21-25|=4，|28-21|=7，哪一個數字最大？",
      "tier2MicroConcept": "📐 折線坡度計算：兩相鄰點之間的垂直高低落差即為變化量，落差越大在圖上坡度越陡峭，|28 - 21| = 7℃ 差距最懸殊。",
      "portalBuildingId": "math-linegraph"
    },
    "explanation": "星期三（21℃）至星期四（28℃）的溫差高達 7℃，是這一週內數值起伏最大、折線最為陡峭的區間。"
  },
  {
    "id": "math-linegraph-006",
    "subject": "math",
    "buildingId": "math-linegraph",
    "type": "mcq",
    "question": "在繪製折線圖時，若縱軸每一個小格代表 2 公斤，那麼從刻度 40 公斤到刻度 54 公斤之間，一共佔了多少個小格？",
    "options": ["5 個小格", "7 個小格", "14 個小格", "28 個小格"],
    "answer": 1,
    "level": 2,
    "guidedHints": {
      "tier1Keyword": "💡 題眼提示：總共跨越了 54 - 40 = 14 公斤，每一小格是 2 公斤，需要幾格？14 ÷ 2 = ？",
      "tier2MicroConcept": "📐 座標刻度換算公式：【總差距】÷【每小格代表單位】＝【小格數】。 (54 - 40) ÷ 2 = 7 格。",
      "portalBuildingId": "math-linegraph"
    },
    "explanation": "54 公斤減去 40 公斤等於 14 公斤；每格代表 2 公斤，14 ÷ 2 = 7，因此縱軸上剛好佔了 7 個完整小格。"
  },
  {
    "id": "math-linegraph-007",
    "subject": "math",
    "buildingId": "math-linegraph",
    "type": "mcq",
    "question": "在複式折線圖中，如果甲乙兩條折線在星期四剛好「交叉重疊在同一個點上」，這代表什麼數學意義？",
    "options": [
      "圖表繪製錯誤，兩條線絕不可以相交",
      "在星期四這一天，甲和乙兩項資料的數值剛好完全相等",
      "星期四這一天儀器故障停止測量",
      "甲的數值必定永遠大於乙"
    ],
    "answer": 1,
    "level": 1,
    "guidedHints": {
      "tier1Keyword": "💡 題眼鎖定：兩條線在同一時間點落在同一高度刻度上，代表它們此時此刻的數值大小關係為何？",
      "tier2MicroConcept": "📐 交叉點幾何意義：在同一橫軸對應位置，兩條折線交匯代表縱軸數值完全一致，此點前後通常為大小關係互換的轉折點。",
      "portalBuildingId": "math-linegraph"
    },
    "explanation": "兩條折線在同一時間點相交，表示該時刻兩組數據的量值完全相同（例如兩地氣溫相同）。"
  },
  {
    "id": "math-linegraph-008",
    "subject": "math",
    "buildingId": "math-linegraph",
    "type": "mcq",
    "question": "繪製折線圖時，漏掉了下列哪一項重要資訊，讀者就無法得知折線代表的實際數字單位與大小？",
    "options": ["圖表標題與縱軸刻度單位", "圖表背面的裝飾花紋", "用來畫圖的彩色鉛筆品牌", "畫圖同學的學號"],
    "answer": 0,
    "level": 1,
    "guidedHints": {
      "tier1Keyword": "💡 題眼鎖定：如果縱軸只有 1, 2, 3 但沒寫是「公分」、「公斤」還是「萬元」，能知道數據的真實意義嗎？",
      "tier2MicroConcept": "📐 統計圖表必備四要素：圖表名稱（標題）、橫軸名稱與單位、縱軸名稱與單位、資料標記點與連線。",
      "portalBuildingId": "math-linegraph"
    },
    "explanation": "圖表標題與軸線單位（如 cm、kg、℃）是統計圖表的靈魂，缺少單位便無法解讀折線代表的真實物理量。"
  },
  {
    "id": "math-linegraph-009",
    "subject": "math",
    "buildingId": "math-linegraph",
    "type": "mcq",
    "question": "若小明想比較「自己與小華五年來每學期視力度數」的增減演變情況，他最應該繪製下列哪一種圖表？",
    "options": ["單式長條圖", "複式折線圖", "圓形百分圖", "象形統計圖"],
    "answer": 1,
    "level": 2,
    "guidedHints": {
      "tier1Keyword": "💡 題眼鎖定：兩個人（複式）、長達五年多個學期連續變化（折線圖）。",
      "tier2MicroConcept": "📐 統計圖選擇：涉及『兩組以上對象』且具『長時間連續趨勢比對』的需求，標準首選即為『複式折線圖』。",
      "portalBuildingId": "math-linegraph"
    },
    "explanation": "比較兩個人隨多個學期推進的連續視力變化趨勢，必須採用複式折線圖才能清楚進行對照分析。"
  },
  {
    "id": "math-linegraph-010",
    "subject": "math",
    "buildingId": "math-linegraph",
    "type": "mcq",
    "question": "如果某工廠每個月用電量折線圖從一月到十二月都是一條「完美的水平直線」，這代表什麼現象？",
    "options": [
      "工廠每個月用電量都劇烈飆升",
      "工廠每個月的用電量完全相同，沒有任何增減變化",
      "工廠已經倒閉停止供電",
      "該圖表一定是假造的"
    ],
    "answer": 1,
    "level": 1,
    "guidedHints": {
      "tier1Keyword": "💡 題眼鎖定：折線既不往上爬，也不往下掉，高度始終維持在同一個刻度上。",
      "tier2MicroConcept": "📐 斜率與變化關係：折線水平（落差為 0）代表數值持平、穩定不變。上升代表增加，下降代表減少。",
      "portalBuildingId": "math-linegraph"
    },
    "explanation": "折線圖呈現水平線段時，表示相鄰時段內的數據完全相等，既無成長亦無減少。"
  },

  # ==========================================
  # math-factors: 因數與倍數彩虹橋 (單元二) - 10 題
  # ==========================================
  {
    "id": "math-factors-001",
    "subject": "math",
    "buildingId": "math-factors",
    "type": "mcq",
    "question": "若整數 48 能被整數甲整除（餘數為 0），則整數甲是 48 的什麼數？",
    "options": ["倍數", "因數", "質數", "合數"],
    "answer": 1,
    "level": 1,
    "guidedHints": {
      "tier1Keyword": "💡 題眼提示：A ÷ B ＝ 整數且餘數為 0 時，除數 B 和商數都是被除數 A 的什麼數？",
      "tier2MicroConcept": "📐 因數與倍數定義：若 A ÷ B ＝ C（無餘數），則 B 和 C 都是 A 的『因數』，A 是 B 和 C 的『倍數』。",
      "portalBuildingId": "math-factors"
    },
    "explanation": "當一個整數能整除另一個整數且餘數為 0 時，該除數就是被除數的「因數」。"
  },
  {
    "id": "math-factors-002",
    "subject": "math",
    "buildingId": "math-factors",
    "type": "mcq",
    "question": "整數 36 的所有因數共有幾個？",
    "options": ["8 個", "9 個", "10 個", "12 個"],
    "answer": 1,
    "level": 2,
    "guidedHints": {
      "tier1Keyword": "💡 題眼鎖定：使用彩虹配對法：1×36, 2×18, 3×12, 4×9, 6×6。注意 6×6 只能算一次！",
      "tier2MicroConcept": "📐 36 的因數清單：1, 2, 3, 4, 6, 9, 12, 18, 36。仔細數數看共有 9 個（6 為完全平方重複，僅計一次）。",
      "portalBuildingId": "math-factors"
    },
    "explanation": "36 的因數有 1, 2, 3, 4, 6, 9, 12, 18, 36，共 9 個（因為 6×6=36，6 不重複計算，故為奇數個因數）。"
  },
  {
    "id": "math-factors-003",
    "subject": "math",
    "buildingId": "math-factors",
    "type": "mcq",
    "question": "一個大於 0 的整數，如果「只有 1 和自己本身兩個因數」，這個數稱為什麼？",
    "options": ["偶數", "合數", "質數", "公因數"],
    "answer": 2,
    "level": 1,
    "guidedHints": {
      "tier1Keyword": "💡 題眼提示：像 2, 3, 5, 7, 11 這些只能分解成 1 乘上自己的數字，在數學上稱為什麼？",
      "tier2MicroConcept": "📐 質數與合數：\n• 質數：大於 1，且只有 1 與自己 2 個因數（如 2, 3, 5, 7）\n• 合數：因數超過 2 個（如 4, 6, 8, 9）\n• 1 既非質數亦非合數！",
      "portalBuildingId": "math-factors"
    },
    "explanation": "大於 1 且因數僅有 1 和本身（恰好兩個因數）的整數稱為質數。"
  },
  {
    "id": "math-factors-004",
    "subject": "math",
    "buildingId": "math-factors",
    "type": "mcq",
    "question": "下列關於「質數」的敘述，哪一個選項是「完全正確」的？",
    "options": [
      "所有的質數都必定是奇數",
      "數字 1 是最小的質數",
      "數字 2 是唯一的偶數質數，也是最小的質數",
      "所有的奇數都是質數"
    ],
    "answer": 2,
    "level": 2,
    "guidedHints": {
      "tier1Keyword": "💡 題眼鎖定：小心陷阱！9 是奇數但有因數 3 不是質數；數字 1 只有一個因數不是質數；數字 2 是偶數但因數只有 1 和 2！",
      "tier2MicroConcept": "📐 質數核心特例：數字 2 是數學界『唯一的偶數質數』，同時也是『最小的質數』。1 既不是質數也不是合數。",
      "portalBuildingId": "math-factors"
    },
    "explanation": "2 的因數只有 1 和 2，因此是質數，且是質數中唯一的偶數。1 既非質數非合數，9, 15, 21 為奇數但皆為合數。"
  },
  {
    "id": "math-factors-005",
    "subject": "math",
    "buildingId": "math-factors",
    "type": "mcq",
    "question": "要判斷一個四位數「573□」是否為 3 的倍數，關鍵判斷法則是什麼？",
    "options": [
      "只要看個位數 □ 是不是 3",
      "將所有位數的數字相加（5 + 7 + 3 + □），如果總和是 3 的倍數，該數就是 3 的倍數",
      "只要看百位數是不是 7",
      "把最後兩個位數拿去除以 3"
    ],
    "answer": 1,
    "level": 2,
    "guidedHints": {
      "tier1Keyword": "💡 題眼鎖定：2 和 5 看個位數；那 3 和 9 的倍數判定法則要看所有數字的什麼？",
      "tier2MicroConcept": "📐 倍數判別法規律：\n• 2 的倍數：個位數為 0, 2, 4, 6, 8\n• 5 的倍數：個位數為 0, 5\n• 3 的倍數：各個位數的『數字總和』是 3 的倍數\n• 10 的倍數：個位數為 0",
      "portalBuildingId": "math-factors"
    },
    "explanation": "3 的倍數判別法是檢驗「各數位數字之和」是否為 3 的倍數（例如 5+7+3=15，□ 可填 0, 3, 6, 9）。"
  },
  {
    "id": "math-factors-006",
    "subject": "math",
    "buildingId": "math-factors",
    "type": "mcq",
    "question": "下列哪一個數「同時是 2 的倍數，也是 5 的倍數」？",
    "options": ["125", "234", "380", "475"],
    "answer": 2,
    "level": 1,
    "guidedHints": {
      "tier1Keyword": "💡 題眼提示：2 的倍數個位數必須是偶數（0,2,4,6,8）；5 的倍數個位數必須是 0 或 5。兩者交集的個位數只能是什麼？",
      "tier2MicroConcept": "📐 同時為 2 與 5 的倍數：表示該數為 10 的倍數，因此其『個位數字必定為 0』。380 個位數為 0，完全吻合。",
      "portalBuildingId": "math-factors"
    },
    "explanation": "同時是 2 和 5 的倍數即為 10 的倍數，個位數字必須為 0。選項中僅有 380 符合條件。"
  },
  {
    "id": "math-factors-007",
    "subject": "math",
    "buildingId": "math-factors",
    "type": "mcq",
    "question": "在 20 到 40 之間的整數中，共有幾個質數？",
    "options": ["3 個", "4 個", "5 個", "6 個"],
    "answer": 1,
    "level": 2,
    "guidedHints": {
      "tier1Keyword": "💡 題眼鎖定：逐一檢視 20~40 間的奇數：21(合), 23(?), 25(合), 27(合), 29(?), 31(?), 33(合), 35(合), 37(?), 39(合)。",
      "tier2MicroConcept": "📐 20~40 間的質數：只有 23、29、31、37 四個質數。其他如 21=3×7, 27=3×9, 39=3×13 都是合數。",
      "portalBuildingId": "math-factors"
    },
    "explanation": "20 到 40 之間的質數包含：23、29、31、37，共計 4 個。"
  },
  {
    "id": "math-factors-008",
    "subject": "math",
    "buildingId": "math-factors",
    "type": "mcq",
    "question": "任何大於 1 的整數，它最小的因數和最大的因數分別固定是什麼？",
    "options": [
      "最小的是 0，最大的是無限大",
      "最小的是 1，最大的是它自己本身",
      "最小的是 2，最大的是它的平方",
      "最小的是 1，最大的是 100"
    ],
    "answer": 1,
    "level": 1,
    "guidedHints": {
      "tier1Keyword": "💡 題眼鎖定：想想彩虹配對的最外圈兩端：1 × 該整數 ＝ 該整數。",
      "tier2MicroConcept": "📐 因數恆等定理：任何正整數 n 的最小因數固定為 1，最大因數固定為 n 本身。",
      "portalBuildingId": "math-factors"
    },
    "explanation": "任何自然數的最小正因數必為 1，而最大的因數就是該數本身。"
  },
  {
    "id": "math-factors-009",
    "subject": "math",
    "buildingId": "math-factors",
    "type": "mcq",
    "question": "老師把 45 顆糖果平分給若干名學童，每個人分到的糖果一樣多，且剛好分完沒有剩餘。請問學童人數「不可能」是下列哪一個數字？",
    "options": ["3 人", "5 人", "8 人", "9 人"],
    "answer": 2,
    "level": 2,
    "guidedHints": {
      "tier1Keyword": "💡 題眼提示：能剛好平分代表學童人數必須是 45 的『因數』。哪一個選項不是 45 的因數？45 ÷ 8 能整除嗎？",
      "tier2MicroConcept": "📐 45 的因數清單：1, 3, 5, 9, 15, 45。因為 45 ÷ 8 ＝ 5 餘 5（無法整除），所以人數絕對不可能是 8 人。",
      "portalBuildingId": "math-factors"
    },
    "explanation": "平分無剩餘代表分給的人數必須是 45 的因數。8 不是 45 的因數（45 ÷ 8 = 5...5），故不可能為 8 人。"
  },
  {
    "id": "math-factors-010",
    "subject": "math",
    "buildingId": "math-factors",
    "type": "mcq",
    "question": "若一個整數是 12 的倍數，那麼這個數「一定也是」下列哪一個數的倍數？",
    "options": ["5", "6", "8", "9"],
    "answer": 1,
    "level": 2,
    "guidedHints": {
      "tier1Keyword": "💡 題眼提示：12 的因數有哪些？1, 2, 3, 4, 6, 12。只要是 12 的倍數，就必定包含 12 的所有因數！",
      "tier2MicroConcept": "📐 倍數因數傳遞性：因為 6 是 12 的因數，所以任何 12 的倍數（如 12, 24, 36...）必定也能被 6 整除，即一定也是 6 的倍數。",
      "portalBuildingId": "math-factors"
    },
    "explanation": "6 是 12 的因數，因此任何 12 的倍數都必定是 6 的倍數。"
  },

  # ==========================================
  # math-geometry: 平面幾何探索殿 (單元三) - 10 題
  # ==========================================
  {
    "id": "math-geometry-001",
    "subject": "math",
    "buildingId": "math-geometry",
    "type": "mcq",
    "question": "下列哪一組長度的三根吸管，「可以」成功圍成一個三角形？",
    "options": [
      "3 公分、4 公分、8 公分",
      "5 公分、5 公分、10 公分",
      "4 公分、6 公分、9 公分",
      "2 公分、7 公分、10 公分"
    ],
    "answer": 2,
    "level": 2,
    "guidedHints": {
      "tier1Keyword": "💡 題眼鎖定：三角形邊長定理——『任兩邊之和大於第三邊』，也就是『較短的兩邊相加必須嚴格大於最長邊』！",
      "tier2MicroConcept": "📐 三角形邊長關係檢驗：\n• A: 3+4=7 < 8 ❌\n• B: 5+5=10 ＝ 10 ❌（剛好重合無法成三角形）\n• C: 4+6=10 > 9 ✅（可圍成三角形）\n• D: 2+7=9 < 10 ❌",
      "portalBuildingId": "math-geometry"
    },
    "explanation": "三角形任意兩邊之和必須大於第三邊。選項C中 4 + 6 = 10 > 9，兩短邊之和大於最長邊，能順利圍成三角形。"
  },
  {
    "id": "math-geometry-002",
    "subject": "math",
    "buildingId": "math-geometry",
    "type": "mcq",
    "question": "任意一個三角形的三個內角角度加起來，總和必定是多少度？",
    "options": ["90 度", "180 度", "270 度", "360 度"],
    "answer": 1,
    "level": 1,
    "guidedHints": {
      "tier1Keyword": "💡 題眼鎖定：把三角形的三個角撕下來拼在一起，剛好可以拼成一條平角（平角的度數是多少？）",
      "tier2MicroConcept": "📐 平面幾何基本定理：任何三角形（不論銳角、直角或鈍角三角形）的三個內角和恆等於 180 度。",
      "portalBuildingId": "math-geometry"
    },
    "explanation": "平面幾何中，任何三角形的三內角和恆等於 180°。"
  },
  {
    "id": "math-geometry-003",
    "subject": "math",
    "buildingId": "math-geometry",
    "type": "mcq",
    "question": "已知一個「等腰三角形」的頂角是 80 度，請問它的其中一個底角是多少度？",
    "options": ["40 度", "50 度", "80 度", "100 度"],
    "answer": 1,
    "level": 2,
    "guidedHints": {
      "tier1Keyword": "💡 題眼提示：等腰三角形兩個底角相等！三角形內角和 180° 減去頂角 80° 剩多少？再平分給兩個底角！",
      "tier2MicroConcept": "📐 等腰三角形角度計算：(180° - 頂角) ÷ 2 ＝ 底角。\n(180° - 80°) = 100°，100° ÷ 2 = 50°。",
      "portalBuildingId": "math-geometry"
    },
    "explanation": "等腰三角形兩底角相等。三個內角和 180° 扣除頂角 80° 剩下 100°，平分給兩底角：100° ÷ 2 = 50°。"
  },
  {
    "id": "math-geometry-004",
    "subject": "math",
    "buildingId": "math-geometry",
    "type": "mcq",
    "question": "一個三角形如果有兩個內角分別是 35 度和 55 度，請問這個三角形按角分類屬於哪一種三角形？",
    "options": ["銳角三角形", "直角三角形", "鈍角三角形", "等邊三角形"],
    "answer": 1,
    "level": 2,
    "guidedHints": {
      "tier1Keyword": "💡 題眼提示：算出第三個角是幾度：180° - 35° - 55° = ？如果有個角剛好是 90°，它叫什麼三角形？",
      "tier2MicroConcept": "📐 三角形分類標準：\n第三角 ＝ 180° - (35° + 55°) ＝ 180° - 90° ＝ 90°。\n含有一個 90° 直角的三角形即為『直角三角形』。",
      "portalBuildingId": "math-geometry"
    },
    "explanation": "第三角為 180° - 35° - 55° = 90°。凡是有一個內角為 90° 的三角形即為直角三角形。"
  },
  {
    "id": "math-geometry-005",
    "subject": "math",
    "buildingId": "math-geometry",
    "type": "mcq",
    "question": "下列關於「四邊形性質」的描述，哪一個選項是「錯誤」的？",
    "options": [
      "平行四邊形的兩組對邊互相平行且等長",
      "長方形的四個角都是 90 度直角",
      "菱形的四個邊都等長，且對角線互相垂直平分",
      "梯形有兩組對邊互相平行"
    ],
    "answer": 3,
    "level": 2,
    "guidedHints": {
      "tier1Keyword": "💡 題眼鎖定：小心梯形的定義！梯形只有『幾組』對邊互相平行？如果兩組都平行那就變成平行四邊形了！",
      "tier2MicroConcept": "📐 四邊形定義辨正：梯形是『只有一組對邊平行』的四邊形。若兩組對邊皆平行，則為平行四邊形。",
      "portalBuildingId": "math-geometry"
    },
    "explanation": "梯形的定義是「只有一組對邊互相平行」的四邊形。若兩組對邊皆平行則屬於平行四邊形，因此選項D敘述錯誤。"
  },
  {
    "id": "math-geometry-006",
    "subject": "math",
    "buildingId": "math-geometry",
    "type": "mcq",
    "question": "任意凸四邊形的四個內角角度加起來，總和必定是多少度？",
    "options": ["180 度", "270 度", "360 度", "540 度"],
    "answer": 2,
    "level": 1,
    "guidedHints": {
      "tier1Keyword": "💡 題眼提示：從四邊形的一個頂點畫對角線，可以切成 2 個三角形。每個三角形內角和 180°，那兩個合起來是多少？",
      "tier2MicroConcept": "📐 多邊形內角和公式：(n - 2) × 180°。\n四邊形分成 2 個三角形，內角和 ＝ 2 × 180° ＝ 360°。",
      "portalBuildingId": "math-geometry"
    },
    "explanation": "四邊形可由對角線分割為 2 個三角形，內角和總計為 180° × 2 = 360°。"
  },
  {
    "id": "math-geometry-007",
    "subject": "math",
    "buildingId": "math-geometry",
    "type": "mcq",
    "question": "一個「正三角形（等邊三角形）」的三個內角角度分別是多少度？",
    "options": ["45 度、45 度、90 度", "60 度、60 度、60 度", "50 度、60 度、70 度", "30 度、60 度、90 度"],
    "answer": 1,
    "level": 1,
    "guidedHints": {
      "tier1Keyword": "💡 題眼提示：正三角形三條邊等長，三個角也完全相等！180° ÷ 3 = ？",
      "tier2MicroConcept": "📐 正三角形性質：三邊等長，三內角等大，每個內角均為 180° ÷ 3 = 60°。",
      "portalBuildingId": "math-geometry"
    },
    "explanation": "正三角形的三個內角完全相等，每個內角均為 180° ÷ 3 = 60°。"
  },
  {
    "id": "math-geometry-008",
    "subject": "math",
    "buildingId": "math-geometry",
    "type": "mcq",
    "question": "在平行四邊形 ABCD 中，若角 A 是 110 度，則與它相對的「對角（角 C）」是多少度？",
    "options": ["70 度", "90 度", "110 度", "180 度"],
    "answer": 2,
    "level": 2,
    "guidedHints": {
      "tier1Keyword": "💡 題眼鎖定：平行四邊形的重要幾何性質——『對角相等，鄰角互補（相加 180°）』。題目問的是『對角』！",
      "tier2MicroConcept": "📐 平行四邊形角位性質：\n• 對角相等：∠A ＝ ∠C ＝ 110°\n• 鄰角互補：∠B ＝ ∠D ＝ 180° - 110° ＝ 70°",
      "portalBuildingId": "math-geometry"
    },
    "explanation": "平行四邊形的對角必相等，因此角 A 的對角（角 C）同樣是 110°（而鄰角角 B 則為 180° - 110° = 70°）。"
  },
  {
    "id": "math-geometry-009",
    "subject": "math",
    "buildingId": "math-geometry",
    "type": "mcq",
    "question": "「四條邊等長，且四個角都是 90 度直角」的完美四邊形稱為什麼？",
    "options": ["長方形", "菱形", "正方形", "平行四邊形"],
    "answer": 2,
    "level": 1,
    "guidedHints": {
      "tier1Keyword": "💡 題眼鎖定：長方形角是直角但邊不一定等長；菱形邊等長但角不一定是直角。兩者兼備的是哪一個？",
      "tier2MicroConcept": "📐 正方形雙重條件：同時具備『菱形（四邊等長）』與『長方形（四角皆直角）』特性的幾何圖形就是正方形。",
      "portalBuildingId": "math-geometry"
    },
    "explanation": "同時滿足「四邊皆等長」與「四角皆為直角」的四邊形就是正方形。"
  },
  {
    "id": "math-geometry-010",
    "subject": "math",
    "buildingId": "math-geometry",
    "type": "mcq",
    "question": "已知三角形有兩條邊長分別為 6 公分和 10 公分，請問第三條邊長「不可能」是下列哪一個長度？",
    "options": ["5 公分", "8 公分", "15 公分", "17 公分"],
    "answer": 3,
    "level": 3,
    "guidedHints": {
      "tier1Keyword": "💡 題眼提示：第三邊長必須大於兩邊之差（10 - 6 = 4），且小於兩邊之和（10 + 6 = 16）！哪一個超出範圍？",
      "tier2MicroConcept": "📐 三角形第三邊範圍公式：【兩邊之差】<【第三邊】<【兩邊之和】。\n10 - 6 < 第三邊 < 10 + 6 ➔ 4 < 第三邊 < 16。17 公分大於 16，絕對圍不成！",
      "portalBuildingId": "math-geometry"
    },
    "explanation": "第三邊必須小於其餘兩邊之和（6 + 10 = 16 公分）。17 公分大於 16 公分（6 + 10 = 16 < 17），無法圍成三角形。"
  },

  # ==========================================
  # math-gcdlcm: 公因數與公倍數工廠 (單元四) - 10 題
  # ==========================================
  {
    "id": "math-gcdlcm-001",
    "subject": "math",
    "buildingId": "math-gcdlcm",
    "type": "mcq",
    "question": "數字 18 和 24 的「最大公因數（GCD）」是多少？",
    "options": ["2", "3", "6", "12"],
    "answer": 2,
    "level": 1,
    "guidedHints": {
      "tier1Keyword": "💡 題眼提示：18 的因數有 1, 2, 3, 6, 9, 18；24 的因數有 1, 2, 3, 4, 6, 8, 12, 24。共有的最大因數是誰？",
      "tier2MicroConcept": "📐 最大公因數（短除法）：\n用共同質因數 2 除 ➔ 得 9, 12；再用 3 除 ➔ 得 3, 4。\n最大公因數 ＝ 2 × 3 ＝ 6。",
      "portalBuildingId": "math-gcdlcm"
    },
    "explanation": "18 與 24 的公因數有 1, 2, 3, 6，其中最大的公因數是 6。"
  },
  {
    "id": "math-gcdlcm-002",
    "subject": "math",
    "buildingId": "math-gcdlcm",
    "type": "mcq",
    "question": "當兩個正整數的「最大公因數剛好是 1」時，我們稱這兩個數的關係是什麼？",
    "options": ["互補", "互質", "同餘", "倒數"],
    "answer": 1,
    "level": 1,
    "guidedHints": {
      "tier1Keyword": "💡 題眼鎖定：例如 8 和 9，雖然兩個都是合數，但它們除了 1 之外沒有其他公因數，這叫什麼關係？",
      "tier2MicroConcept": "📐 互質的定義：若兩整數 a 和 b 的最大公因數為 1（gcd(a, b) = 1），則稱 a 和 b『互質』。",
      "portalBuildingId": "math-gcdlcm"
    },
    "explanation": "兩整數除 1 以外沒有其他公因數（最大公因數為 1）時，在數學上定義為「互質」。"
  },
  {
    "id": "math-gcdlcm-003",
    "subject": "math",
    "buildingId": "math-gcdlcm",
    "type": "mcq",
    "question": "數字 6 和 8 的「最小公倍數（LCM）」是多少？",
    "options": ["12", "24", "48", "14"],
    "answer": 1,
    "level": 1,
    "guidedHints": {
      "tier1Keyword": "💡 題眼提示：6 的倍數：6, 12, 18, 24, 30...；8 的倍數：8, 16, 24, 32...。第一個共同出現的最小倍數是誰？",
      "tier2MicroConcept": "📐 最小公倍數（短除法）：\n6 和 8 用 2 短除 ➔ 商為 3 和 4。\n最小公倍數 ＝ 2 × 3 × 4 ＝ 24。",
      "portalBuildingId": "math-gcdlcm"
    },
    "explanation": "6 和 8 的共同公倍數有 24, 48, 72...，其中最小的公倍數是 24。"
  },
  {
    "id": "math-gcdlcm-004",
    "subject": "math",
    "buildingId": "math-gcdlcm",
    "type": "mcq",
    "question": "下列哪一組數字的關係是「互質」？",
    "options": ["9 和 12", "14 和 21", "8 和 15", "10 和 25"],
    "answer": 2,
    "level": 2,
    "guidedHints": {
      "tier1Keyword": "💡 題眼提示：9和12公因數有3；14和21公因數有7；10和25公因數有5；8(因數1,2,4,8)和15(因數1,3,5,15)公因數只有誰？",
      "tier2MicroConcept": "📐 檢驗公因數：\n• 8 的因數：1, 2, 4, 8\n• 15 的因數：1, 3, 5, 15\n兩者唯一的公因數是 1，因此 8 與 15 互質！",
      "portalBuildingId": "math-gcdlcm"
    },
    "explanation": "8 與 15 的公因數只有 1，因此 8 與 15 互質。其餘各組公因數均大於 1（如 3, 7, 5）。"
  },
  {
    "id": "math-gcdlcm-005",
    "subject": "math",
    "buildingId": "math-gcdlcm",
    "type": "mcq",
    "question": "媽媽買了 36 顆蘋果和 48 顆橘子，想把它們平分裝在禮盒裡，每盒的蘋果要一樣多，橘子也要一樣多，且全部分完沒有剩下。請問「最多」可以裝成幾盒？",
    "options": ["6 盒", "12 盒", "18 盒", "24 盒"],
    "answer": 1,
    "level": 2,
    "guidedHints": {
      "tier1Keyword": "💡 題眼鎖定：『平分分裝、全部分完、求最多幾盒』，這是標準求兩數的「最大公因數（GCD）」應用題！",
      "tier2MicroConcept": "📐 應用題題型識別：求 36 與 48 的最大公因數。\n36 ＝ 12 × 3，48 ＝ 12 × 4。最大公因數為 12，故最多可分裝 12 盒（每盒 3 顆蘋果、4 顆橘子）。",
      "portalBuildingId": "math-gcdlcm"
    },
    "explanation": "求最多可分裝的盒數即求 36 與 48 的最大公因數。gcd(36, 48) = 12，故最多可分裝為 12 盒。"
  },
  {
    "id": "math-gcdlcm-006",
    "subject": "math",
    "buildingId": "math-gcdlcm",
    "type": "mcq",
    "question": "公車站的紅線公車每 15 分鐘發一班車，藍線公車每 20 分鐘發一班車。若早上 8:00 兩路公車同時發車，請問下一次「同時發車」是在什麼時候？",
    "options": ["8:35", "8:45", "9:00", "9:20"],
    "answer": 2,
    "level": 2,
    "guidedHints": {
      "tier1Keyword": "💡 題眼鎖定：『週期性同時發生、求下一次時間』，這是標準求兩數「最小公倍數（LCM）」應用題！",
      "tier2MicroConcept": "📐 時間週期計算：求 15 與 20 的最小公倍數。\nlcm(15, 20) ＝ 60（分鐘）。\n從 8:00 經過 60 分鐘（1 小時）即為 9:00。",
      "portalBuildingId": "math-gcdlcm"
    },
    "explanation": "15 與 20 的最小公倍數為 60 分鐘（1 小時）。從 8:00 再過 60 分鐘，兩車將在 9:00 再次同時發車。"
  },
  {
    "id": "math-gcdlcm-007",
    "subject": "math",
    "buildingId": "math-gcdlcm",
    "type": "mcq",
    "question": "用長 8 公分、寬 6 公分的長方形彩色磁磚，如果要緊密拼成一個「邊長最小的正方形」，這個正方形的邊長是多少公分？",
    "options": ["14 公分", "24 公分", "48 公分", "12 公分"],
    "answer": 1,
    "level": 2,
    "guidedHints": {
      "tier1Keyword": "💡 題眼提示：正方形四邊等長，邊長必須同時是 8 的倍數也是 6 的倍數，求最小邊長即求 8 和 6 的最小公倍數！",
      "tier2MicroConcept": "📐 拼接最小正方形公式：正方形邊長 ＝ lcm(長, 寬)。\nlcm(8, 6) ＝ 24 公分（此時長邊需 3 塊，寬邊需 4 塊，共 12 塊磁磚）。",
      "portalBuildingId": "math-gcdlcm"
    },
    "explanation": "拼成正方形的邊長必須同時能被 8 和 6 整除，最小邊長為 lcm(8, 6) = 24 公分。"
  },
  {
    "id": "math-gcdlcm-008",
    "subject": "math",
    "buildingId": "math-gcdlcm",
    "type": "mcq",
    "question": "若甲、乙兩個質數相乘的結果是 77，請問這兩個質數分別是多少？",
    "options": ["1 和 77", "3 和 25", "7 和 11", "2 和 38.5"],
    "answer": 2,
    "level": 2,
    "guidedHints": {
      "tier1Keyword": "💡 題眼鎖定：題目規定甲和乙必須都是『質數』！1 不是質數；7 和 11 都是質數且 7 × 11 = 77！",
      "tier2MicroConcept": "📐 質因數分解：77 分解為質數乘積只有一種組合：7 × 11 ＝ 77。7 和 11 都是質數。",
      "portalBuildingId": "math-gcdlcm"
    },
    "explanation": "77 的質因數分解為 7 × 11，且 7 與 11 皆為質數，完全符合題意。"
  },
  {
    "id": "math-gcdlcm-009",
    "subject": "math",
    "buildingId": "math-gcdlcm",
    "type": "mcq",
    "question": "一塊長 60 公分、寬 48 公分的長方形木板，木工想將它裁切成大小完全相同且「邊長最大」的正方形小木塊，沒有任何木料剩餘。請問這個小正方形的邊長是多少公分？",
    "options": ["6 公分", "12 公分", "15 公分", "24 公分"],
    "answer": 1,
    "level": 2,
    "guidedHints": {
      "tier1Keyword": "💡 題眼鎖定：把大長方形裁切成整數邊長正方形且無剩餘，求邊長最大，是求 60 和 48 的「最大公因數（GCD）」！",
      "tier2MicroConcept": "📐 裁切問題公式：正方形邊長 ＝ gcd(長, 寬)。\ngcd(60, 48) ＝ 12 公分（長可切 5 塊，寬可切 4 塊，共裁出 20 塊）。",
      "portalBuildingId": "math-gcdlcm"
    },
    "explanation": "裁切最大且無剩餘的正方形邊長即為長與寬的最大公因數：gcd(60, 48) = 12 公分。"
  },
  {
    "id": "math-gcdlcm-010",
    "subject": "math",
    "buildingId": "math-gcdlcm",
    "type": "mcq",
    "question": "若整數 A 是整數 B 的倍數（例如 A = 24, B = 6），那麼 A 和 B 的「最大公因數」和「最小公倍數」分別是多少？",
    "options": [
      "最大公因數是 B，最小公倍數是 A",
      "最大公因數是 A，最小公倍數是 B",
      "最大公因數是 1，最小公倍數是 A×B",
      "最大公因數和最小公倍數都是 A"
    ],
    "answer": 0,
    "level": 2,
    "guidedHints": {
      "tier1Keyword": "💡 題眼提示：拿具體數字 24 和 6 來看：6 是 24 的因數，公因數最大就是 6（B）；公倍數最小就是 24（A）。",
      "tier2MicroConcept": "📐 倍數關係定理：當 A 是 B 的倍數時：\n• 最大公因數 gcd(A, B) ＝ 較小數 B\n• 最小公倍數 lcm(A, B) ＝ 較大數 A",
      "portalBuildingId": "math-gcdlcm"
    },
    "explanation": "當兩數存在倍數關係時，較小者即為兩數之最大公因數，較大者即為兩數之最小公倍數。"
  },

  # ==========================================
  # math-solids: 立體形體展覽館 (單元五) - 10 題
  # ==========================================
  {
    "id": "math-solids-001",
    "subject": "math",
    "buildingId": "math-solids",
    "type": "mcq",
    "question": "一個「五角柱（直五角柱）」一共有幾個面、幾個頂點和幾條邊？",
    "options": [
      "5 個面、10 個頂點、15 條邊",
      "7 個面、10 個頂點、15 條邊",
      "7 個面、15 個頂點、10 條邊",
      "6 個面、10 個頂點、12 條邊"
    ],
    "answer": 1,
    "level": 2,
    "guidedHints": {
      "tier1Keyword": "💡 題眼鎖定：n 角柱代數公式：面數 ＝ n + 2，頂點數 ＝ 2n，邊數 ＝ 3n。代入 n = 5 計算！",
      "tier2MicroConcept": "📐 n 角柱計算公式（n = 5）：\n• 面數 ＝ 5 + 2 ＝ 7（2個五邊形底面 + 5個長方形側面）\n• 頂點數 ＝ 2 × 5 ＝ 10\n• 邊數 ＝ 3 × 5 ＝ 15",
      "portalBuildingId": "math-solids"
    },
    "explanation": "五角柱具有 2 個底面加 5 個側面共 7 個面；上下底面各 5 個頂點共 10 個頂點；上下各 5 條邊加 5 條側邊共 15 條邊。"
  },
  {
    "id": "math-solids-002",
    "subject": "math",
    "buildingId": "math-solids",
    "type": "mcq",
    "question": "一個「六角錐」一共有幾個頂點、幾個面和幾條邊？",
    "options": [
      "7 個頂點、7 個面、12 條邊",
      "6 個頂點、6 個面、12 條邊",
      "8 個頂點、7 個面、14 條邊",
      "7 個頂點、8 個面、18 條邊"
    ],
    "answer": 0,
    "level": 2,
    "guidedHints": {
      "tier1Keyword": "💡 題眼鎖定：n 角錐代數公式：頂點數 ＝ n + 1，面數 ＝ n + 1，邊數 ＝ 2n。代入 n = 6 計算！",
      "tier2MicroConcept": "📐 n 角錐計算公式（n = 6）：\n• 頂點數 ＝ 6 + 1 ＝ 7（底面6個 + 尖端1個）\n• 面數 ＝ 6 + 1 ＝ 7（底面1個 + 側面6個三角形）\n• 邊數 ＝ 2 × 6 ＝ 12（底面6條 + 側邊6條）",
      "portalBuildingId": "math-solids"
    },
    "explanation": "六角錐由 1 個六邊形底面與 6 個三角形側面構成（共 7 面）；底面 6 頂點加上頂部尖端共 7 頂點；邊數為 2 × 6 = 12 條邊。"
  },
  {
    "id": "math-solids-003",
    "subject": "math",
    "buildingId": "math-solids",
    "type": "mcq",
    "question": "下列關於「直角柱」側面形狀的敘述，哪一個選項是正確的？",
    "options": [
      "所有角柱的側面都必定是三角形",
      "直角柱的所有側面都是長方形（或正方形）",
      "直角柱的側面是圓形",
      "直角柱沒有側面"
    ],
    "answer": 1,
    "level": 1,
    "guidedHints": {
      "tier1Keyword": "💡 題眼提示：角柱的兩個底面互相平行，沿著側邊直直向上延伸，側面展開會是什麼形狀？",
      "tier2MicroConcept": "📐 角柱與角錐側面特徵：\n• 直角柱側面：全為長方形（特殊情況為正方形）\n• 角錐側面：全為三角形",
      "portalBuildingId": "math-solids"
    },
    "explanation": "直角柱的側面與底面互相垂直，其所有側面幾何形狀均為長方形（特殊邊長相等時為正方形）。"
  },
  {
    "id": "math-solids-004",
    "subject": "math",
    "buildingId": "math-solids",
    "type": "mcq",
    "question": "一個角柱如果總共有「18 條邊」，請問這個角柱是什麼角柱？",
    "options": ["四角柱", "五角柱", "六角柱", "九角柱"],
    "answer": 2,
    "level": 2,
    "guidedHints": {
      "tier1Keyword": "💡 題眼鎖定：n 角柱的邊數公式是 3n。如果 3n ＝ 18，那麼 n 是多少？18 ÷ 3 = ？",
      "tier2MicroConcept": "📐 代數逆運算：角柱邊數 ＝ 3 × n。\n18 ＝ 3 × n ➔ n ＝ 18 ÷ 3 ＝ 6。因此底面為六邊形，該立體為『六角柱』。",
      "portalBuildingId": "math-solids"
    },
    "explanation": "n 角柱的邊數為 3n。已知邊數為 18，則 n = 18 ÷ 3 = 6，故此立體形體為六角柱。"
  },
  {
    "id": "math-solids-005",
    "subject": "math",
    "buildingId": "math-solids",
    "type": "mcq",
    "question": "在長方體或正方體中，任選一個面，與這個面「互相垂直」的面一共有幾個？",
    "options": ["1 個", "2 個", "4 個", "5 個"],
    "answer": 2,
    "level": 2,
    "guidedHints": {
      "tier1Keyword": "💡 題眼鎖定：拿一個粉筆盒或骰子看看：頂面的對面（底面）互相平行；那圍繞在四周的四個側面跟頂面是什麼關係？",
      "tier2MicroConcept": "📐 立體空間垂直與平行：長方體共 6 個面。任選 1 個面：\n• 互相平行的面只有 1 個（正對面的底面）\n• 互相垂直的面共有 4 個（環繞四周的鄰面）",
      "portalBuildingId": "math-solids"
    },
    "explanation": "在六面體的長方體中，任何一個面都有 1 個相對平行的面，以及 4 個相鄰且互相垂直的面。"
  },
  {
    "id": "math-solids-006",
    "subject": "math",
    "buildingId": "math-solids",
    "type": "mcq",
    "question": "將一個「圓柱體」的側面沿著高剪開攤平，展開圖的形狀是什麼？",
    "options": ["三角形", "圓形", "長方形", "梯形"],
    "answer": 2,
    "level": 1,
    "guidedHints": {
      "tier1Keyword": "💡 題眼提示：拿一張長方形紙張捲起來，就可以做成圓柱的身體；反過來剪開攤平是什麼形狀？",
      "tier2MicroConcept": "📐 圓柱展開圖：圓柱側面展開為『長方形』。長方形的長等於底面圓周長，長方形的寬等於圓柱的高。",
      "portalBuildingId": "math-solids"
    },
    "explanation": "圓柱側面展開後為標準長方形，其長度恰好等於底面圓形之圓周長，寬度等於圓柱之柱高。"
  },
  {
    "id": "math-solids-007",
    "subject": "math",
    "buildingId": "math-solids",
    "type": "mcq",
    "question": "正方體一共有 6 個完全相同的正方形面。下列哪一種正方體展開圖的骨架形式是「絕對不可能折成」正方體的？",
    "options": [
      "一-四-一 型（中間四連方，上下各一個）",
      "二-三-一 型",
      "出現「田」字形或「凹」字形四連方塊結構",
      "二-二-二 階梯型"
    ],
    "answer": 2,
    "level": 2,
    "guidedHints": {
      "tier1Keyword": "💡 題眼提示：正方體展開圖有 11 種，其中鐵律：只要出現四個正方形拼成『田』字形，折合時必定重疊缺面！",
      "tier2MicroConcept": "📐 正方體展開圖口訣：『一四一、二三一，二二二成階梯，三三成一線』；若出現『田字無頭尾、凹字不可留』必定無法折合！",
      "portalBuildingId": "math-solids"
    },
    "explanation": "展開圖中若出現「田」字形（2×2）或「凹」字形結構，折起時相鄰面會互相重疊覆蓋，導致立體缺面，無法組裝成正方體。"
  },
  {
    "id": "math-solids-008",
    "subject": "math",
    "buildingId": "math-solids",
    "type": "mcq",
    "question": "一個角錐如果總共有 10 個面，請問這個角錐的底面是什麼形狀？",
    "options": ["八邊形", "九邊形", "十邊形", "十一邊形"],
    "answer": 1,
    "level": 2,
    "guidedHints": {
      "tier1Keyword": "💡 題眼提示：n 角錐的面數公式是 n + 1（1 個底面 + n 個側面）。若 n + 1 ＝ 10，n 是多少？",
      "tier2MicroConcept": "📐 角錐面數公式：面數 ＝ n + 1。\n10 ＝ n + 1 ➔ n ＝ 9。因此底面形狀為『九邊形』，此立體為九角錐。",
      "portalBuildingId": "math-solids"
    },
    "explanation": "角錐面數等於底面邊數加 1（底面 1 個 + 側面 n 個）。10 - 1 = 9，故其底面為九邊形。"
  },
  {
    "id": "math-solids-009",
    "subject": "math",
    "buildingId": "math-solids",
    "type": "mcq",
    "question": "下列哪一種立體形體只有「一個頂點、一個底面」，且側面展開是一個扇形？",
    "options": ["圓柱體", "圓錐體", "三角錐", "長方體"],
    "answer": 1,
    "level": 1,
    "guidedHints": {
      "tier1Keyword": "💡 題眼鎖定：像冰淇淋甜筒或生日派對帽子一樣，底部是圓形，上方尖尖匯聚成一個頂點的立體是什麼？",
      "tier2MicroConcept": "📐 圓錐特徵：1 個圓形底面、1 個頂點、1 個曲面側面；側面剪開展開為『扇形』。",
      "portalBuildingId": "math-solids"
    },
    "explanation": "圓錐體具備單一圓形底面與單一頂部頂點，其彎曲側面展開後為幾何扇形。"
  },
  {
    "id": "math-solids-010",
    "subject": "math",
    "buildingId": "math-solids",
    "type": "mcq",
    "question": "比較「八角柱」與「八角錐」的邊數，八角柱比八角錐多了幾條邊？",
    "options": ["2 條", "6 條", "8 條", "16 條"],
    "answer": 2,
    "level": 2,
    "guidedHints": {
      "tier1Keyword": "💡 題眼提示：八角柱邊數 ＝ 3 × 8 ＝ 24 條；八角錐邊數 ＝ 2 × 8 ＝ 16 條。24 - 16 = ？",
      "tier2MicroConcept": "📐 邊數代數對比：\n• 八角柱邊數 ＝ 3n ＝ 3 × 8 ＝ 24 條\n• 八角錐邊數 ＝ 2n ＝ 2 × 8 ＝ 16 條\n差距 ＝ 24 - 16 ＝ 8 條（剛好差了一組底面的 8 條邊）。",
      "portalBuildingId": "math-solids"
    },
    "explanation": "八角柱邊數為 3 × 8 = 24 條；八角錐邊數為 2 × 8 = 16 條；兩者相差 24 - 16 = 8 條邊。"
  }
]
