# -*- coding: utf-8 -*-
"""
康軒版國小五年級上學期 社會科 期中考 50 題標準題庫
涵蓋單元：
1. 第一單元：臺灣我的家（經緯度、時區、臺灣絕對位置、四面環海、離島地理）—— soc-taiwan-geo (13題)
2. 第二單元第1課：地形如何影響生活（五大地形判準、等高線地形圖疏密、主要地形分布）—— soc-terrains (13題)
3. 第二單元第2課：氣候如何影響生活（東北季風與西南季風、雨量時空分布、局部風候九降風/落山風/菜宅）—— soc-monsoon (12題)
4. 第二單元第2課：水資源與河川（河川短小流急、荒溪型河川、水庫與水資源保育）—— soc-water (12題)
所有題目均具備三階鷹架導引提示 (guidedHints)。
"""

SOCIAL_QUIZZES = [
    # ==================== 第一單元：臺灣經緯沙盤 (soc-taiwan-geo: 13題) ====================
    {
        "id": "soc-001",
        "subject": "social",
        "buildingId": "soc-taiwan-geo",
        "question": "地球儀表面連接南北兩極的半圓形弧線稱為「經線」。下列關於經線特徵的敘述何者正確？",
        "options": [
            "經線各線互相平行且長度皆不相同",
            "本初子午線（0°經線）通過英國格林威治天文台，全球經度共分為東經與西經各 180°",
            "經線是用來劃分熱帶、溫帶與寒帶氣候區的基準",
            "緯度越高經線長度越短"
        ],
        "answer": 1,
        "explanation": "經線是連接南北極的半圓弧線，長度均等，以通過格林威治天文台為 0°（本初子午線），向東向西各分 180°，主要用來計算時差。",
        "guidedHints": {
            "tier1Keyword": "本初子午線、格林威治、東西各180°",
            "tier2MicroConcept": "經線本質：連接南北兩極、長度相等；0° 為本初子午線；每相隔 15° 經度時間相差 1 小時。"
        },
        "conceptRef": "經線定義與本初子午線",
        "level": 1
    },
    {
        "id": "soc-002",
        "subject": "social",
        "buildingId": "soc-taiwan-geo",
        "question": "臺灣本島在地球上的「絕對位置」大致位於下列哪一個經緯度範圍區間？",
        "options": [
            "北緯 22°~25°，東經 120°~122°",
            "南緯 22°~25°，西經 120°~122°",
            "北緯 10°~15°，東經 100°~105°",
            "北緯 35°~40°，東經 135°~140°"
        ],
        "answer": 0,
        "explanation": "臺灣本島位於北半球與東半球，緯度介於北緯 22 度至 25 度之間，經度介於東經 120 度至 122 度之間，北回歸線（23.5°N）貫穿中南部。",
        "guidedHints": {
            "tier1Keyword": "北緯22~25度、東經120~122度",
            "tier2MicroConcept": "臺灣位置數據：北半球（22°N~25°N），東半球（120°E~122°E），北回歸線（23.5°N）橫跨嘉義、花蓮。"
        },
        "conceptRef": "臺灣經緯度絕對位置",
        "level": 1
    },
    {
        "id": "soc-003",
        "subject": "social",
        "buildingId": "soc-taiwan-geo",
        "question": "北回歸線（23.5°N）通過臺灣中南部，它是哪兩種氣候帶的重要地理分界線？",
        "options": [
            "寒帶與溫帶",
            "熱帶（以南）與副熱帶（以北）",
            "沙漠氣候與雨林氣候",
            "高山氣候與極地氣候"
        ],
        "answer": 1,
        "explanation": "北回歸線是太陽直射的最北界限。在臺灣，北回歸線以南屬於熱帶氣候（長夏無冬），以北屬於副熱帶季風氣候（四季分明）。",
        "guidedHints": {
            "tier1Keyword": "💡 題眼鎖定：北回歸線以南為熱帶、以北為副熱帶",
            "tier2MicroConcept": "北回歸線氣候分界：以南為熱帶季風氣候；以北為副熱帶季風氣候；通過嘉義水上、花蓮瑞穗與豐濱。"
        },
        "conceptRef": "北回歸線氣候分界",
        "level": 1
    },
    {
        "id": "soc-004",
        "subject": "social",
        "buildingId": "soc-taiwan-geo",
        "question": "地球每 24 小時自轉一週（360°），因此經度每相隔多少度，地方時就會相差 1 小時？",
        "options": ["10°", "15°", "20°", "30°"],
        "answer": 1,
        "explanation": "360° ÷ 24 小時 = 15°/小時。地球自西向東自轉，東邊地方比西邊先迎接日出，故經度每相隔 15°，時差為 1 小時（東加西減）。",
        "guidedHints": {
            "tier1Keyword": "360除以24等於15度",
            "tier2MicroConcept": "時差計算公式：經度差 ÷ 15° = 時差小時數。越偏東方時間越早（東邊時間快）。"
        },
        "conceptRef": "經度與時差換算原理",
        "level": 2
    },
    {
        "id": "soc-005",
        "subject": "social",
        "buildingId": "soc-taiwan-geo",
        "question": "臺灣本島四面環海，下列關於臺灣四周海洋相對位置的敘述何者完全正確？",
        "options": [
            "東臨太平洋、西隔臺灣海峽與歐亞大陸相望、南瀕巴士海峽、北接東海",
            "東臨臺灣海峽、西接太平洋、北瀕巴士海峽、南接東海",
            "東臨印度洋、西臨大西洋、北臨北極海、南臨地中海",
            "東臨日本海、西臨南海、南臨黑海、北臨黃海"
        ],
        "answer": 0,
        "explanation": "臺灣本島東方為浩瀚的太平洋，西方隔著臺灣海峽與中國大陸相望，南方隔巴士海峽與菲律賓群島相鄰，北方則連接東海。",
        "guidedHints": {
            "tier1Keyword": "東太平洋、西臺海、南巴士、北東海",
            "tier2MicroConcept": "臺灣四鄰海洋：東=太平洋（深海海溝）；西=臺灣海峽（大陸棚淺海）；南=巴士海峽；北=東海。"
        },
        "conceptRef": "臺灣周邊海洋相對位置",
        "level": 1
    },
    {
        "id": "soc-006",
        "subject": "social",
        "buildingId": "soc-taiwan-geo",
        "question": "臺灣東側緊鄰全世界最大的海洋，而西側緊鄰全世界最大的陸地，這兩大板塊分別是？",
        "options": [
            "太平洋與歐亞大陸",
            "大西洋與非洲大陸",
            "北極海與美洲大陸",
            "印度洋與澳洲大陸"
        ],
        "answer": 0,
        "explanation": "臺灣位於歐亞大陸與太平洋板塊交界之處，兼具大陸與海洋雙重樞紐優勢，亦是東亞島弧的核心節點。",
        "guidedHints": {
            "tier1Keyword": "💡 題眼鎖定：世界最大陸地歐亞大陸與最大海洋太平洋",
            "tier2MicroConcept": "臺灣海陸位置：位於世界最大陸地（歐亞大陸）東南緣與最大海洋（太平洋）西側，屬東亞島弧關鍵樞紐。"
        },
        "conceptRef": "臺灣海陸地理樞紐位置",
        "level": 1
    },
    {
        "id": "soc-007",
        "subject": "social",
        "buildingId": "soc-taiwan-geo",
        "question": "臺灣本島各縣市中，下列哪一條北回歸線標誌碑的所在地「不」在臺灣境內？",
        "options": [
            "嘉義縣水上鄉",
            "花蓮縣瑞穗鄉",
            "花蓮縣豐濱鄉",
            "宜蘭縣頭城鎮"
        ],
        "answer": 3,
        "explanation": "臺灣的北回歸線標誌分別設立於嘉義水上、花蓮瑞穗（縱谷）與花蓮豐濱（海岸）。宜蘭縣位於北緯 24.5° 左右，北回歸線並未穿過。",
        "guidedHints": {
            "tier1Keyword": "水上、瑞穗、豐濱有標誌，宜蘭太北邊",
            "tier2MicroConcept": "北回歸線地標：嘉義水上（最早設立）、花蓮瑞穗（花東縱谷）、花蓮豐濱（太平洋海岸）。"
        },
        "conceptRef": "北回歸線臺灣地標位置",
        "level": 2
    },
    {
        "id": "soc-008",
        "subject": "social",
        "buildingId": "soc-taiwan-geo",
        "question": "位在臺灣海峽中、由 90 座大小島嶼組成，以壯麗柱狀玄武岩地景與傳統石滬著名的離島縣份是？",
        "options": ["金門縣", "連江縣（馬祖）", "澎湖縣", "蘭嶼（台東縣）"],
        "answer": 2,
        "explanation": "澎湖群島位於臺灣海峽，由多期火山熔岩噴發形成，地質以柱狀玄武岩、方山地貌及雙心石滬人文漁業景觀聞名。",
        "guidedHints": {
            "tier1Keyword": "柱狀玄武岩、石滬、臺灣海峽",
            "tier2MicroConcept": "澎湖地理特徵：多島嶼（群島）、火山玄武岩方山台地、雨量稀少蒸發量大、石滬捕魚傳統。"
        },
        "conceptRef": "澎湖群島地質與地理特色",
        "level": 1
    },
    {
        "id": "soc-009",
        "subject": "social",
        "buildingId": "soc-taiwan-geo",
        "question": "下列哪一座離島是達悟族（雅美族）的傳統居住家園，島上具有傳統地下屋建築與飛魚祭文化？",
        "options": ["綠島", "蘭嶼", "小琉球", "龜山島"],
        "answer": 1,
        "explanation": "蘭嶼（舊名紅頭嶼）位於臺東東南方太平洋上，為達悟族世代居住之地，發展出適應海風的半地下屋、拼板舟雕刻與飛魚文化。",
        "guidedHints": {
            "tier1Keyword": "達悟族、地下屋、飛魚祭、拼板舟",
            "tier2MicroConcept": "蘭嶼文化地理：黑潮暖流經過、達悟族海洋文化、地下屋防颱防風、拼板舟造舟工藝。"
        },
        "conceptRef": "蘭嶼人文與海洋地理",
        "level": 1
    },
    {
        "id": "soc-010",
        "subject": "social",
        "buildingId": "soc-taiwan-geo",
        "question": "臺灣唯一的「珊瑚礁島嶼」鄉鎮，位於屏東縣西南方外海，以綠蠵龜保育與浮潛聞名的離島是？",
        "options": ["金門島", "小琉球（琉球嶼）", "彭佳嶼", "七美嶼"],
        "answer": 1,
        "explanation": "小琉球是臺灣唯一的珊瑚礁離島，全島由珊瑚礁石灰岩構成，受黑潮支流影響冬季海水溫暖，是綠蠵龜重要的棲息覓食地。",
        "guidedHints": {
            "tier1Keyword": "唯一珊瑚礁島、屏東外海、綠蠵龜",
            "tier2MicroConcept": "小琉球地理特徵：隆起珊瑚礁島、石灰岩地形（花瓶岩）、冬季不冷、綠蠵龜生態樂園。"
        },
        "conceptRef": "小琉球珊瑚礁島嶼地理",
        "level": 2
    },
    {
        "id": "soc-011",
        "subject": "social",
        "buildingId": "soc-taiwan-geo",
        "question": "金門與馬祖在行政區域與地理區位上，具有下列哪一項共同特徵？",
        "options": [
            "緊鄰中國大陸東南沿海，曾為重要軍事防禦前線，留有大量戰地史蹟與坑道文化",
            "都是位於太平洋深海海溝中的火山島",
            "島上居民全數屬於臺灣原住民族群",
            "全島覆蓋熱帶雨林且終年積雪"
        ],
        "answer": 0,
        "explanation": "金門與連江（馬祖）鄰近中國大陸福建沿海，地理位置特殊，長年扮演戰略前線角色，擁有坑道、防空堡壘與閩南花崗岩聚落特色。",
        "guidedHints": {
            "tier1Keyword": "緊鄰福建大陸、軍事要塞坑道、戰地史蹟",
            "tier2MicroConcept": "金馬前線地理：花崗岩地質、近大陸沿岸、冷戰戰地歷史、翟山坑道與八八坑道。"
        },
        "conceptRef": "金門馬祖之地理與戰地文化",
        "level": 2
    },
    {
        "id": "soc-012",
        "subject": "social",
        "buildingId": "soc-taiwan-geo",
        "question": "如果現在臺灣時間（東經 120°）是上午 10:00，那麼位在東經 135° 的日本東京，此時的當地時間是幾點？",
        "options": ["上午 9:00", "上午 10:00", "上午 11:00", "中午 12:00"],
        "answer": 2,
        "explanation": "經度差 = 135° - 120° = 15°。15° 相當於 1 小時時差。東京位於臺灣東方，時間較早，故為 10:00 + 1 小時 = 上午 11:00。",
        "guidedHints": {
            "tier1Keyword": "相差15度差1小時、東加西減",
            "tier2MicroConcept": "時差計算實例：東京（135°E）比臺灣（120°E）偏東 15°，故東京比臺灣快 1 小時。"
        },
        "conceptRef": "時區時差實際換算",
        "level": 2
    },
    {
        "id": "soc-013",
        "subject": "social",
        "buildingId": "soc-taiwan-geo",
        "question": "臺灣擁有優越的「地理位置」，在國際海空交通與貿易上具有何種不可取代的戰略地位？",
        "options": [
            "位居東亞島弧的核心交會樞紐，扼守西太平洋航運要道",
            "地處內陸深處不受任何海上風暴威脅",
            "與鄰近所有國家陸地直接接壤，高鐵可直接通往歐洲",
            "四周完全沒有任何國際港口航線經過"
        ],
        "answer": 0,
        "explanation": "臺灣雄踞西太平洋樞紐，北接日本、韓國，南鄰東南亞與大洋洲，是東北亞往來東南亞及歐美的國際航運、空運必經之咽喉地帶。",
        "guidedHints": {
            "tier1Keyword": "東亞島弧樞紐、西太平洋航運咽喉",
            "tier2MicroConcept": "臺灣海運樞紐優勢：位處亞太交通十字路口，控制臺灣海峽與巴士海峽兩大國際航道。"
        },
        "conceptRef": "臺灣在東亞島弧的戰略價值",
        "level": 2
    },

    # ==================== 第二單元第1課：五大地形階梯 (soc-terrains: 13題) ====================
    {
        "id": "soc-014",
        "subject": "social",
        "buildingId": "soc-terrains",
        "question": "地形學中定義「海拔高度在 1000 公尺以上，地勢高聳崎嶇、坡度陡峭」的地形類型稱為什麼？",
        "options": ["平原", "台地", "山地", "盆地"],
        "answer": 2,
        "explanation": "山地的定義為海拔通常超過 1000 公尺，地勢起伏劇烈、山峰林立、坡度陡峭。臺灣山地面積占全島三分之一以上。",
        "guidedHints": {
            "tier1Keyword": "海拔大於1000公尺、地勢高聳陡峭",
            "tier2MicroConcept": "五大地形標準：山地（>1000m 陡峭）、丘陵（100~1000m 緩坡）、台地（>100m 頂部平平周緣陡）、平原（<100m 平坦）、盆地（四周高中間低）。"
        },
        "conceptRef": "山地地形之定義與特徵",
        "level": 1
    },
    {
        "id": "soc-015",
        "subject": "social",
        "buildingId": "soc-terrains",
        "question": "海拔在 100 公尺至 1000 公尺之間，地勢起伏較為緩和、山頂多呈圓弧狀的地形稱為什麼？",
        "options": ["平原", "丘陵", "高原", "海溝"],
        "answer": 1,
        "explanation": "丘陵海拔通常在 100 至 1000 公尺之間，高低起伏平緩，適合種植茶樹、果樹等經濟作物（如竹苗丘陵）。",
        "guidedHints": {
            "tier1Keyword": "100~1000公尺、坡度起伏緩和",
            "tier2MicroConcept": "丘陵地形特徵：介於平原與山地之間，坡緩圓潤，臺灣西部丘陵如苗栗、新竹以茶園與果園聞名。"
        },
        "conceptRef": "丘陵地形之定義與農業利用",
        "level": 1
    },
    {
        "id": "soc-016",
        "subject": "social",
        "buildingId": "soc-terrains",
        "question": "林口台地與大肚台地「頂部地勢開闊平坦，但邊緣為急轉陡降的坡地」，這種地形屬於？",
        "options": ["盆地", "平原", "台地", "山地"],
        "answer": 2,
        "explanation": "台地是由平原或盆地受地殼抬升或河流下切侵蝕而成，特徵是「頂部平坦如桌面，但邊緣為陡坡」，海拔通常高於 100 公尺。",
        "guidedHints": {
            "tier1Keyword": "頂部平坦、邊緣陡峭=台地",
            "tier2MicroConcept": "台地特點：桌狀地形，如林口台地、桃園台地、大肚台地、八卦台地。"
        },
        "conceptRef": "台地地形特徵與代表",
        "level": 1
    },
    {
        "id": "soc-017",
        "subject": "social",
        "buildingId": "soc-terrains",
        "question": "「四周被山嶺或丘陵環繞包圍，中間部分地勢低陷平坦」，這種形狀如臉盆的地形稱為什麼？",
        "options": ["盆地", "台地", "平原", "岬角"],
        "answer": 0,
        "explanation": "盆地地貌特徵為周高中低，臺灣著名的盆地包括臺北盆地（最大聚落人口）、臺中盆地、埔里盆地等。",
        "guidedHints": {
            "tier1Keyword": "四周高中間低平如臉盆",
            "tier2MicroConcept": "盆地特點：四周群山環伺，中央沉降平坦。易聚熱、散熱不易，空氣對流受阻（如臺北盆地夏季悶熱）。"
        },
        "conceptRef": "盆地地形特徵與代表",
        "level": 1
    },
    {
        "id": "soc-018",
        "subject": "social",
        "buildingId": "soc-terrains",
        "question": "海拔多在 100 公尺以下，地勢寬闊平坦、土壤肥沃，是人口最密集與農耕最重要的地形是？",
        "options": ["山地", "丘陵", "平原", "火山"],
        "answer": 2,
        "explanation": "平原地勢平緩低平（海拔 <100m），交通便利水源充沛，是農業耕作與都市建設最密集之所在，如嘉南平原、屏東平原。",
        "guidedHints": {
            "tier1Keyword": "海拔100公尺以下、寬廣平坦",
            "tier2MicroConcept": "平原地形價值：臺灣最大平原為嘉南平原（穀倉），其次為屏東平原、蘭陽平原。"
        },
        "conceptRef": "平原地形特徵與農業價值",
        "level": 1
    },
    {
        "id": "soc-019",
        "subject": "social",
        "buildingId": "soc-terrains",
        "question": "臺灣面積最遼闊、由濁水溪等河流長期沖積而成，號稱「臺灣最大穀倉」的平原是？",
        "options": ["蘭陽平原", "花東縱谷平原", "嘉南平原", "屏東平原"],
        "answer": 2,
        "explanation": "嘉南平原跨越雲林、嘉義、臺南，由多條大河沖積而成，平坦廣大，配合嘉南大圳灌溉，是臺灣最重要的糧食產地。",
        "guidedHints": {
            "tier1Keyword": "面積最大平原、臺灣穀倉、嘉南大圳",
            "tier2MicroConcept": "嘉南平原重要性：全臺最大平原，八田與一興建烏山頭水庫與嘉南大圳使其成肥沃良田。"
        },
        "conceptRef": "嘉南平原地景與水利意義",
        "level": 1
    },
    {
        "id": "soc-020",
        "subject": "social",
        "buildingId": "soc-terrains",
        "question": "閱讀等高線地形圖時，如果發現圖上相鄰等高線之間的「距離非常緊密密集」，代表當地的地勢具備何種特徵？",
        "options": [
            "地勢非常平坦開闊",
            "坡度非常陡峭危險",
            "當地必定是一大片平原草原",
            "該地區地下充滿海水"
        ],
        "answer": 1,
        "explanation": "等高線密集代表在很短的水平距離內高度落差劇烈，即坡度陡峭；反之，等高線稀疏代表高度變化緩慢，坡度平緩。",
        "guidedHints": {
            "tier1Keyword": "等高線密=陡坡，等高線疏=緩坡",
            "tier2MicroConcept": "等高線判讀秘訣：密集 ➔ 垂直落差大 ➔ 坡陡；稀疏 ➔ 垂直落差小 ➔ 坡緩；同心圓數值內高外低 ➔ 山頂。"
        },
        "conceptRef": "等高線疏密與坡度判讀",
        "level": 2
    },
    {
        "id": "soc-021",
        "subject": "social",
        "buildingId": "soc-terrains",
        "question": "臺灣本島的地形分布呈現「山多平原少」的特點，其中五大山脈縱貫南北。縱貫中央、被譽為「臺灣屋脊」的是哪一座山脈？",
        "options": ["海岸山脈", "中央山脈", "雪山山脈", "阿里山山脈"],
        "answer": 1,
        "explanation": "中央山脈南北綿延 300 多公里，北起蘇澳、南抵鵝鑾鼻，地勢最高聳連綿，是臺灣島的主要分水嶺，有「臺灣屋脊」之美稱。",
        "guidedHints": {
            "tier1Keyword": "臺灣屋脊、主要分水嶺、中央山脈",
            "tier2MicroConcept": "五大山脈分布：中央山脈（屋脊/分水嶺）、玉山山脈（最高峰）、雪山山脈（北側）、阿里山山脈（西側）、海岸山脈（最東側）。"
        },
        "conceptRef": "中央山脈地位與特徵",
        "level": 1
    },
    {
        "id": "soc-022",
        "subject": "social",
        "buildingId": "soc-terrains",
        "question": "臺灣最高峰「玉山主峰」（海拔 3952 公尺），座落於五大山脈中的哪一座山脈？",
        "options": ["中央山脈", "雪山山脈", "玉山山脈", "海岸山脈"],
        "answer": 2,
        "explanation": "玉山山脈的主峰海拔 3952 公尺，不僅是臺灣第一高峰，亦是東北亞地區的最高峰。",
        "guidedHints": {
            "tier1Keyword": "玉山主峰 3952m、玉山山脈、東北亞最高",
            "tier2MicroConcept": "最高峰名錄：玉山山脈玉山主峰（3952m 第一高）；雪山山脈雪山主峰（3886m 第二高）。"
        },
        "conceptRef": "玉山山脈與玉山主峰",
        "level": 1
    },
    {
        "id": "soc-023",
        "subject": "social",
        "buildingId": "soc-terrains",
        "question": "位於臺北市北方的「大屯火山群」與「陽明山」，其地質景觀中常見噴氣孔與溫泉，屬於哪一種成因的地形？",
        "options": ["河流長期泥沙沖積地形", "板塊擠壓後的火山噴發地形", "風力吹拂形成的沙丘地形", "珊瑚礁鈣化抬升地形"],
        "answer": 1,
        "explanation": "大屯火山群是由早期板塊隱沒帶引發的火山噴發岩漿冷卻堆積而成，雖已休眠，但仍保有地熱噴氣孔、硫磺結晶與溫泉等火山後續活動。",
        "guidedHints": {
            "tier1Keyword": "火山噴發堆積、地熱硫磺噴氣孔",
            "tier2MicroConcept": "火山地形代表：大屯火山群、基隆火山群、澎湖玄武岩群、龜山島、綠島、蘭嶼。"
        },
        "conceptRef": "大屯火山地形地質成因",
        "level": 2
    },
    {
        "id": "soc-024",
        "subject": "social",
        "buildingId": "soc-terrains",
        "question": "臺灣東部海岸（如清水斷崖）地勢險峻陡峭，直落太平洋深海；而臺灣西部海岸則多沙灘、潟湖與潮間帶泥灘。造成此巨大差異的主因為？",
        "options": [
            "東部緊鄰板塊交界斷層深海，西部則為緩坡沉積的大陸棚淺海",
            "東部每天都被人工推土機挖掘",
            "西部完全沒有河流帶來泥沙沉積",
            "東部沒有任何海浪拍打"
        ],
        "answer": 0,
        "explanation": "臺灣東側處於歐亞大陸板塊與菲律賓海板塊激烈縫合帶，斷層隆起且海槽深達數千公尺，形成斷崖海岸；西部因河流沖積廣大沙泥於淺水大陸棚，形成沙岸。",
        "guidedHints": {
            "tier1Keyword": "東部斷層陡峭海深，西部泥沙沖積淺灘",
            "tier2MicroConcept": "海岸地形對比：東部（斷層岩岸、陡峭水深）；西部（沙岸、泥灘潟湖、平緩水淺）；北部（岬角海灣岬角交錯）；南部（珊瑚礁裙礁）。"
        },
        "conceptRef": "臺灣東西部海岸地形差異",
        "level": 2
    },
    {
        "id": "soc-025",
        "subject": "social",
        "buildingId": "soc-terrains",
        "question": "在等高線地形圖中，如果發現一組「封閉同心圓等高線，且數值從外圍往中心『越來越低』」，這最可能是何種地形？",
        "options": ["獨立山峰頂點", "窪地或盆地中央", "險峻的山脊線", "平坦的大台地"],
        "answer": 1,
        "explanation": "若封閉等高線數值由外向內遞減，代表中心高度比四周低，為「窪地」或「盆地」；若數值由外向內遞增，則為山峰頂點。",
        "guidedHints": {
            "tier1Keyword": "中心數值低=窪地盆地",
            "tier2MicroConcept": "等高線數值走向：外低內高（山頂/山峰）；外高內低（窪地/盆地）。"
        },
        "conceptRef": "等高線圖窪地與山頭判斷",
        "level": 3
    },
    {
        "id": "soc-026",
        "subject": "social",
        "buildingId": "soc-terrains",
        "question": "臺灣之所以地震頻繁、高山聳立且地質脆弱易崩塌，主要歸因於哪兩個板塊的持續推擠運動？",
        "options": [
            "歐亞板塊與菲律賓海板塊",
            "美洲板塊與太平洋板塊",
            "印澳板塊與非洲板塊",
            "南極洲板塊與印歐板塊"
        ],
        "answer": 0,
        "explanation": "臺灣本島正處於歐亞板塊與菲律賓海板塊的聚合邊界，板塊擠壓使造山運動活躍，地層隆起造就高山，亦伴隨頻繁地震與斷層錯動。",
        "guidedHints": {
            "tier1Keyword": "歐亞板塊推擠菲律賓海板塊",
            "tier2MicroConcept": "造山運動成因：菲律賓海板塊向西北推擠歐亞板塊，年推擠數公分，使中央山脈持續隆起並引發地震。"
        },
        "conceptRef": "臺灣板塊構造與造山運動",
        "level": 2
    },

    # ==================== 第二單元第2課：季風與風候氣象站 (soc-monsoon: 12題) ====================
    {
        "id": "soc-027",
        "subject": "social",
        "buildingId": "soc-monsoon",
        "question": "臺灣冬季時主要受到來自亞洲大陸冷高壓吹拂的哪一種季風影響？",
        "options": ["東北季風", "西南季風", "東南信風", "西北季風"],
        "answer": 0,
        "explanation": "冬季西伯利亞與蒙古大陸冷高壓順時針旋轉出發，流經東海海面吸收水氣吹向臺灣，形成寒冷潮濕的「東北季風」。",
        "guidedHints": {
            "tier1Keyword": "冬季吹東北季風、冷高壓南下",
            "tier2MicroConcept": "季風季節規律：冬季（吹東北季風，北涼濕、南晴乾）；夏季（吹西南季風，全臺溫熱多雨）。"
        },
        "conceptRef": "冬季東北季風成因",
        "level": 1
    },
    {
        "id": "soc-028",
        "subject": "social",
        "buildingId": "soc-monsoon",
        "question": "為什麼基隆在冬季時經常陰雨綿綿，贏得「雨港」之名，而高雄在冬季卻大多晴空萬里乾旱少雨？",
        "options": [
            "基隆位在東北季風迎風面水氣抬升凝結成雨，高雄位於中央山脈背風面乾燥晴朗",
            "高雄距離太陽比基隆近一萬公里",
            "基隆市民特別喜歡人工造雨",
            "中央山脈阻擋了來自赤道的乾燥空氣"
        ],
        "answer": 0,
        "explanation": "冬季東北季風攜帶水氣抵達臺灣北部，基隆、宜蘭首當其衝為「迎風面」，地形抬升形成地形雨；中南部隔著高聳中央山脈為「背風面」，氣流下沉乾燥。",
        "guidedHints": {
            "tier1Keyword": "基隆迎風面多雨，高雄背風面乾燥",
            "tier2MicroConcept": "地形雨與迎風背風原理：迎風面（氣流爬升冷凝致雨）；背風面（水氣被擋降雨少、下沉乾燥）。"
        },
        "conceptRef": "基隆雨港與冬季迎風背風差異",
        "level": 1
    },
    {
        "id": "soc-029",
        "subject": "social",
        "buildingId": "soc-monsoon",
        "question": "夏季時吹拂臺灣的「西南季風」，通常會帶來何種天氣特徵？",
        "options": [
            "全臺氣溫酷寒並降下大雪",
            "帶來南太平洋與南海充沛暖濕水氣，迎風面南部山區常降豪大雨",
            "使全臺所有河流完全乾涸見底",
            "吹起大量沙塵暴使得能見度為零"
        ],
        "answer": 1,
        "explanation": "夏季印度洋與南海的暖濕氣流形成西南季風，全臺氣溫普遍偏高，迎風面的中南部山區水氣旺盛，常伴隨對流雷陣雨與颱風雨。",
        "guidedHints": {
            "tier1Keyword": "西南季風暖濕、南部迎風降雨",
            "tier2MicroConcept": "夏季氣候特色：西南季風盛行、午後熱對流雷陣雨（西北雨）、颱風侵襲高風險期。"
        },
        "conceptRef": "夏季西南季風與降雨特徵",
        "level": 1
    },
    {
        "id": "soc-030",
        "subject": "social",
        "buildingId": "soc-monsoon",
        "question": "新竹地區在秋末冬初時，東北季風翻越雪山山脈後下沉轉為強勁乾燥的氣流，當地人稱之為什麼？",
        "options": ["落山風", "九降風", "焚風", "颱風"],
        "answer": 1,
        "explanation": "農曆九月重陽節前後，強烈東北季風受地形隘口效應加速，並在背風下沉脫水，形成新竹特有的乾燥強風「九降風」，造就柿餅與米粉產業。",
        "guidedHints": {
            "tier1Keyword": "新竹農曆九月、乾燥強風=九降風",
            "tier2MicroConcept": "地方特有風候：新竹九降風（吹乾柿餅、米粉）；恆春落山風（吹甜洋蔥）；臺東焚風（過山沉降高溫乾熱）。"
        },
        "conceptRef": "新竹九降風與地方產業",
        "level": 2
    },
    {
        "id": "soc-031",
        "subject": "social",
        "buildingId": "soc-monsoon",
        "question": "恆春半島冬季時，東北季風翻越中央山脈南端尾閭向下吹襲的「落山風」，促進了當地哪一種知名農作物的結實與甜度？",
        "options": ["西瓜", "洋蔥", "水蜜桃", "高山茶葉"],
        "answer": 1,
        "explanation": "恆春冬季強烈的「落山風」使洋蔥地上莖葉枯折，養分全數回流灌注至地下鱗莖，使恆春洋蔥球體碩大、甜度極高且耐貯藏。",
        "guidedHints": {
            "tier1Keyword": "恆春落山風、孕育洋蔥",
            "tier2MicroConcept": "落山風影響：風勢強烈折倒洋蔥葉，促使球莖膨大緊實，成為車城、恆春特產。"
        },
        "conceptRef": "恆春落山風與洋蔥產業",
        "level": 2
    },
    {
        "id": "soc-032",
        "subject": "social",
        "buildingId": "soc-monsoon",
        "question": "澎湖居民就地取材，利用玄武岩或珊瑚礁（咾咕石）在農田四周築起石牆以阻擋冬季強風，這種特殊農田地景稱為什麼？",
        "options": ["石梯田", "菜宅（宅內田）", "石滬", "地下屋"],
        "answer": 1,
        "explanation": "澎湖冬季東北季風極強且夾帶高鹽分海水「鹹雨」，居民利用咾咕石或玄武岩砌築高牆擋風遮鹽，保護蔬菜農作，稱為「菜宅」。",
        "guidedHints": {
            "tier1Keyword": "澎湖、防鹹風、咾咕石砌牆=菜宅",
            "tier2MicroConcept": "澎湖菜宅文化：四合院式防風矮石牆，內部種植高麗菜、瓜類，是先民適應島嶼狂風的智慧。"
        },
        "conceptRef": "澎湖菜宅與先民氣候適應",
        "level": 2
    },
    {
        "id": "soc-033",
        "subject": "social",
        "buildingId": "soc-monsoon",
        "question": "在對流層中，海拔高度每上升 1000 公尺，氣溫大約會下降多少攝氏度？",
        "options": ["約 1°C", "約 6°C", "約 15°C", "約 25°C"],
        "answer": 1,
        "explanation": "大氣垂直遞減率規律：海拔每上升 1000 公尺，氣溫約下降 6°C（每上升 100 公尺下降 0.6°C）。因此夏天高山常成為避暑勝地。",
        "guidedHints": {
            "tier1Keyword": "每升高1000公尺氣溫降約6度",
            "tier2MicroConcept": "垂直遞減率：平地 30°C 時，海拔 2000 公尺高山（如阿里山）約只有 30 - (2×6) = 18°C。"
        },
        "conceptRef": "氣溫垂直遞減率規律",
        "level": 2
    },
    {
        "id": "soc-034",
        "subject": "social",
        "buildingId": "soc-monsoon",
        "question": "盛夏午後常常烏雲密佈、雷聲大作並伴隨傾盆大雨，這種俗稱「西北雨」的降雨類型屬於？",
        "options": ["鋒面雨", "對流雨", "地形雨", "颱風雨"],
        "answer": 1,
        "explanation": "夏季強烈日照使地面快速吸熱，地表熱空氣受熱膨脹強烈上升，高空遇冷凝結成積雨雲，引發短暫強降雨，稱為「對流雨」。",
        "guidedHints": {
            "tier1Keyword": "午後日照強、熱空氣劇烈上升=對流雨",
            "tier2MicroConcept": "降雨四類型：對流雨（夏日午後西北雨）、地形雨（迎風面）、鋒面雨（梅雨/冷氣團）、颱風雨。"
        },
        "conceptRef": "夏日對流雨（西北雨）成因",
        "level": 1
    },
    {
        "id": "soc-035",
        "subject": "social",
        "buildingId": "soc-monsoon",
        "question": "每年五、六月春夏交替之際，冷暖氣團在臺灣上空相持不下形成滯留鋒面，造成連續數週陰雨綿綿的天氣，稱為什麼季節？",
        "options": ["颱風季", "梅雨季", "乾旱季", "沙塵暴季"],
        "answer": 1,
        "explanation": "五、六月北方殘存冷氣團與南方暖濕氣團勢力相當，滯留鋒面徘徊，此時正值江南梅子成熟之期，故稱「梅雨季」，是臺灣重要水資源來源。",
        "guidedHints": {
            "tier1Keyword": "五六月、滯留鋒面、連續陰雨=梅雨",
            "tier2MicroConcept": "梅雨季特性：提供全臺豐沛雨量注滿水庫，但連續潮濕易生黴菌，豪雨時可能引發土石流災害。"
        },
        "conceptRef": "梅雨成因與水資源關聯",
        "level": 1
    },
    {
        "id": "soc-036",
        "subject": "social",
        "buildingId": "soc-monsoon",
        "question": "當颱風翻越中央山脈後，在臺東或花蓮背風側有時會出現「空氣極度乾燥、氣溫突然飆高至 38°C 以上」的熱風現象，稱為什麼？",
        "options": ["龍捲風", "焚風", "暴風雪", "落山風"],
        "answer": 1,
        "explanation": "當濕潤氣流越過高山時在迎風面降雨釋放水氣，過山後在背風側快速下沉，下沉空氣絕熱壓縮增溫減濕，形成乾熱的「焚風」（俗稱火燒風）。",
        "guidedHints": {
            "tier1Keyword": "過山下沉、乾熱高溫=焚風（火燒風）",
            "tier2MicroConcept": "焚風成因與危害：背風坡空氣下沉每 1000m 增溫 10°C，易使農作物（如釋迦、茶葉）葉片枯焦落果。"
        },
        "conceptRef": "焚風（火燒風）成因與危害",
        "level": 2
    },
    {
        "id": "soc-037",
        "subject": "social",
        "buildingId": "soc-monsoon",
        "question": "臺灣全島年平均降雨量高達約 2500 毫米，是世界平均值（約 970 毫米）的 2.6 倍，但臺灣卻經常名列「缺水缺水國家」名單中，主要氣候原因為何？",
        "options": [
            "降雨在時間與空間上分布極度不均勻，且夏秋多暴雨難以儲存，蒸發量大",
            "臺灣人民每人每天喝水量超過 500 公升",
            "臺灣沒有任何雨量記錄儀器",
            "所有降雨皆為有毒強酸無法利用"
        ],
        "answer": 0,
        "explanation": "臺灣降雨集中在 5-10 月（占 80%），冬春枯水期長；且南北降雨差距大，加上地形陡急，水流迅速入海，水資源蓄存困難。",
        "guidedHints": {
            "tier1Keyword": "時空分布不均、枯水期長、蓄水困難",
            "tier2MicroConcept": "水資源矛盾：總雨量大但人均雨量低（人口稠密）、集中夏季豪雨、河短流急存水不易。"
        },
        "conceptRef": "臺灣豐水缺水之氣候原因",
        "level": 2
    },
    {
        "id": "soc-038",
        "subject": "social",
        "buildingId": "soc-monsoon",
        "question": "面對夏秋季節頻繁侵襲的「颱風」，下列哪一項是科學正確且負責任的防颱準備工作？",
        "options": [
            "颱風天到海邊或海堤上觀看巨大長浪與抓魚",
            "清理住家屋頂排水溝、加固招牌門窗、備齊手電筒乾電池與儲備乾糧飲用水",
            "將所有門窗完全敞開以保持室內強烈空氣流通",
            "在狂風暴雨中開車前往山區露營遊玩"
        ],
        "answer": 1,
        "explanation": "防颱重點為防風、防淹水與防停水電。疏通水溝排水孔、固定易落招牌、儲備數日飲水乾糧並避免外出，是基本安全防災素養。",
        "guidedHints": {
            "tier1Keyword": "疏通水溝、固定門窗招牌、儲糧勿觀浪",
            "tier2MicroConcept": "防災自保守則：遠離海邊土石流警戒山區，檢視防颱物資，留意氣象警報動態。"
        },
        "conceptRef": "颱風災害防範與生活準備",
        "level": 1
    },

    # ==================== 第二單元第2課：水資源與河川樞紐 (soc-water: 12題) ====================
    {
        "id": "soc-039",
        "subject": "social",
        "buildingId": "soc-water",
        "question": "受到中央山脈偏向島嶼東側、全島地形狹長起伏劇烈的影響，臺灣多數河川呈現何種共同地理水文特徵？",
        "options": [
            "河面寬廣水流平緩，適合長途大噸位輪船日夜航運",
            "河川短小、坡陡流急、含沙量高，東西分流入海",
            "河川長達數千公里且常年結冰冰凍",
            "河川流量四季恆定均勻，絕無洪枯水期之分"
        ],
        "answer": 1,
        "explanation": "臺灣本島狹長且山脈高聳，河流自山脊向東西兩側奔流入海，具有「源短流急、坡度陡峭、落差極大、水流湍急」特徵，航運價值極低。",
        "guidedHints": {
            "tier1Keyword": "短小、坡陡流急、落差大、航運差",
            "tier2MicroConcept": "臺灣河川四大特性：短小、流急、落差大、東西分流；不利航運但水力發電潛能大。"
        },
        "conceptRef": "臺灣河川水文特徵",
        "level": 1
    },
    {
        "id": "soc-040",
        "subject": "social",
        "buildingId": "soc-water",
        "question": "臺灣河川在夏季暴雨時洪水滾滾氾濫成災，冬季乾季時卻水流枯竭露出滿河床石礫。這種極端的河川類型稱為什麼？",
        "options": ["地下暗河", "荒溪型河川", "冰川運河", "外流人工渠"],
        "answer": 1,
        "explanation": "因為降雨季節極度集中夏秋，冬季乾旱少雨，造成河川枯水期與豐水期流量相差懸殊，河床動輒乾涸露出卵石，稱為「荒溪型河川」。",
        "guidedHints": {
            "tier1Keyword": "枯水期豐水期落差大、石礫裸露=荒溪型",
            "tier2MicroConcept": "荒溪型河川特徵：豐枯懸殊，水資源留存極難，枯水期常面臨揚塵沙塵暴問題（如濁水溪）。"
        },
        "conceptRef": "荒溪型河川成因與特色",
        "level": 2
    },
    {
        "id": "soc-041",
        "subject": "social",
        "buildingId": "soc-water",
        "question": "全長約 186 公里，發源於合歡山，橫跨南投、彰化、雲林等縣市入海，是臺灣「全長最長」的河川是？",
        "options": ["淡水河", "濁水溪", "高屏溪", "曾文溪"],
        "answer": 1,
        "explanation": "濁水溪是臺灣最長的河川，全長約 186 公里；其含沙量極高，下游沖積形成富饒的彰化與雲林平原。",
        "guidedHints": {
            "tier1Keyword": "全長最長、發源合歡山=濁水溪",
            "tier2MicroConcept": "名河之最：濁水溪（最長 186km）；高屏溪（流域面積最廣 3256 平方公里）；淡水河（早期航運價值最高）。"
        },
        "conceptRef": "臺灣最長河川濁水溪",
        "level": 1
    },
    {
        "id": "soc-042",
        "subject": "social",
        "buildingId": "soc-water",
        "question": "流經高雄市與屏東縣，流域面積廣達 3256 平方公里，是臺灣「流域面積最廣」的大河是？",
        "options": ["大甲溪", "高屏溪", "基隆河", "花蓮溪"],
        "answer": 1,
        "explanation": "高屏溪（舊稱下淡水溪）流域涵蓋高雄與屏東廣大地區，集水區廣闊，是臺灣全島「流域面積最廣」與「平均年逕流量最大」的河川。",
        "guidedHints": {
            "tier1Keyword": "流域面積最廣、高雄屏東=高屏溪",
            "tier2MicroConcept": "高屏溪特色：全臺集水面積第一大，上游有旗山溪、荖濃溪匯流，為南臺灣最重要民生與灌溉水源。"
        },
        "conceptRef": "臺灣流域最廣河川高屏溪",
        "level": 1
    },
    {
        "id": "soc-043",
        "subject": "social",
        "buildingId": "soc-water",
        "question": "清代時期因河面寬闊平穩、吃水較深，船舶可由大稻埕直溯大溪，成為臺灣早期航運貿易價值最高的大河是？",
        "options": ["淡水河", "濁水溪", "蘭陽溪", "秀姑巒溪"],
        "answer": 0,
        "explanation": "淡水河流經臺北盆地，由大漢溪、新店溪、基隆河匯集而成，早期泥沙淤積前水量穩定，曾是全臺唯一具有實質內河舟楫之利的河川。",
        "guidedHints": {
            "tier1Keyword": "大稻埕航運、大溪、臺北盆地=淡水河",
            "tier2MicroConcept": "淡水河歷史價值：孕育艋舺、大稻埕繁榮，造就茶葉與樟腦外銷，後因泥沙淤積航運沒落。"
        },
        "conceptRef": "淡水河水系與歷史航運價值",
        "level": 2
    },
    {
        "id": "soc-044",
        "subject": "social",
        "buildingId": "soc-water",
        "question": "由於臺灣河川短急、雨水流入大海速度極快，為了解決乾季缺水與民生、工業灌溉需求，政府主要採取何種水利工程手段？",
        "options": [
            "在河川上游合適谷地興建水庫與攔河堰蓄水",
            "將所有海水抽乾改種稻米",
            "向國外每天空運淡水冰塊",
            "把所有山頭剷平成為沙灘"
        ],
        "answer": 0,
        "explanation": "興建水庫（如石門水庫、翡翠水庫、曾文水庫）可在雨季攔截暴雨蓄存洪水，並在乾季調節放水供應民生、農業灌溉與工業用水。",
        "guidedHints": {
            "tier1Keyword": "興建水庫與攔河堰調節水資源",
            "tier2MicroConcept": "水庫功能：防洪、蓄水供水、水力發電、觀光遊憩；但面臨泥沙淤積壽命減短挑戰。"
        },
        "conceptRef": "水庫水利工程之功能",
        "level": 1
    },
    {
        "id": "soc-045",
        "subject": "social",
        "buildingId": "soc-water",
        "question": "供應大臺北地區（雙北）數百萬居民日常生活自來水，水質優良且集水區水土保持嚴格管制的水庫是？",
        "options": ["石門水庫", "翡翠水庫", "日月潭水庫", "曾文水庫"],
        "answer": 1,
        "explanation": "翡翠水庫座落於新北市新店溪支流北勢溪上，為專用民生供水水庫，集水區設有嚴格水源特定區保護規範，水質長年名列前茅。",
        "guidedHints": {
            "tier1Keyword": "大臺北民生水源、北勢溪、翡翠水庫",
            "tier2MicroConcept": "重要水庫地理：翡翠水庫（大臺北）、石門水庫（桃園新北）、寶山第二水庫（新竹科學園區）、曾文水庫（全臺蓄水量最大）。"
        },
        "conceptRef": "翡翠水庫集水區與水質管理",
        "level": 2
    },
    {
        "id": "soc-046",
        "subject": "social",
        "buildingId": "soc-water",
        "question": "集水區過度砍伐森林、濫墾果園茶園或違法開闢露營區，暴雨來臨時會造成水庫面臨何種最嚴重的危機？",
        "options": [
            "水庫水質太清澈魚類餓死",
            "大量泥沙土石隨雨水沖入水庫造成嚴重泥沙淤積，大幅縮減水庫蓄水容量與使用壽命",
            "水庫水溫急遽沸騰",
            "水庫大壩突然長滿大樹"
        ],
        "answer": 1,
        "explanation": "集水區缺乏植被森林涵養保護時，表土流失嚴重，暴雨引發土石崩塌使大量泥沙淤入庫底，侵占蓄水空間，甚至造成取水口堵塞混濁。",
        "guidedHints": {
            "tier1Keyword": "土石流失、泥沙淤積、蓄水量銳減",
            "tier2MicroConcept": "集水區保育核心：森林為「綠色水庫」（涵養水源、固土防衝）；破壞植被 ➔ 水庫淤積短命。"
        },
        "conceptRef": "水庫泥沙淤積與水土保持",
        "level": 2
    },
    {
        "id": "soc-047",
        "subject": "social",
        "buildingId": "soc-water",
        "question": "森林之所以被生態學家譽為大自然中天然的「綠色水庫」，主要原因為何？",
        "options": [
            "森林外觀看起來綠油油非常美麗",
            "樹冠能減緩雨滴直接撞擊土壤，綿密樹根能緊抓土壤並形成海綿狀腐植層蓄存大量地下水",
            "樹木每天會主動由樹枝製造全新水分子",
            "森林能將海水全部變成純金"
        ],
        "answer": 1,
        "explanation": "森林如同大吸水海綿，茂密樹葉減緩雨勢沖刷，森林腐植土孔隙多能滲透儲存雨水轉化為清澈地下水源，再緩緩釋放至下游小溪。",
        "guidedHints": {
            "tier1Keyword": "水土涵養、海綿吸水緩慢釋放",
            "tier2MicroConcept": "森林生態價值：涵養水源、固土保水、調節區域微氣候、維持生物多樣性。"
        },
        "conceptRef": "森林作為綠色水庫的生態機制",
        "level": 2
    },
    {
        "id": "soc-048",
        "subject": "social",
        "buildingId": "soc-water",
        "question": "臺灣沿海地區（如雲林、嘉義、屏東）早期因大量違法超抽地下水發展養殖漁業，引發了何種無法挽回的重大環境災難？",
        "options": [
            "地層嚴重下陷、海水倒灌且每逢大雨積水不退",
            "陸地突然升高數千公尺變成喜馬拉雅山",
            "地下水變成溫泉湧出",
            "海水鹽分完全消失變成蒸餾水"
        ],
        "answer": 0,
        "explanation": "超抽地下水超過自然補注速率，地底黏土層孔隙壓縮失去支撐，造成嚴重的永久性「地層下陷」，引發海水倒灌、土壤鹽化與排水不良災情。",
        "guidedHints": {
            "tier1Keyword": "超抽地下水、地層下陷、海水倒灌",
            "tier2MicroConcept": "地層下陷危害：地盤沉降低於海平面、潮汐倒灌淹沒農田民宅、堤防基底破壞。"
        },
        "conceptRef": "超抽地下水與地層下陷危害",
        "level": 2
    },
    {
        "id": "soc-049",
        "subject": "social",
        "buildingId": "soc-water",
        "question": "為了珍惜有限水資源，下列哪一項是學童在校園與家庭日常生活中最具體的「節水好習慣」？",
        "options": [
            "洗手時水龍頭開最大讓水一直流",
            "洗澡採用淋浴代替泡澡，並將洗菜淘米水回收用來澆花洗地板",
            "口渴時倒整大杯水喝一口全部倒掉",
            "用大量自來水沖洗室外大馬路當作遊戲"
        ],
        "answer": 1,
        "explanation": "生活節水應從微小習慣落實：淋浴替代盆浴、使用省水標章器材、洗米洗菜水二次利用澆花沖廁，皆是有效的護水實踐。",
        "guidedHints": {
            "tier1Keyword": "淋浴省水、一水多用、洗米水澆花",
            "tier2MicroConcept": "日常節水生活實踐：隨手關緊龍頭、裝設省水節水起泡器、廢水二次再利用。"
        },
        "conceptRef": "日常生活節約用水實踐",
        "level": 1
    },
    {
        "id": "soc-050",
        "subject": "social",
        "buildingId": "soc-water",
        "question": "下列哪一種現代水資源開發技術，利用先進逆滲透膜將浩瀚的海水去除鹽分轉化為純淨飲用水，已在澎湖等離島廣泛應用？",
        "options": ["海水淡化技術", "火箭人造降雨", "挖深千米地下礦坑", "核子高溫蒸餾融冰"],
        "answer": 0,
        "explanation": "海水淡化（RO 逆滲透膜法）能擺脫天然降雨不均的限制，將海水過濾淡化為符合標準的民生自來水，是離島與沿海工業區的重要替代水源。",
        "guidedHints": {
            "tier1Keyword": "海水去除鹽分、逆滲透=海水淡化",
            "tier2MicroConcept": "新興水資源科技：海水淡化廠（澎湖馬公、臺南新竹）、再生水回收再利用。"
        },
        "conceptRef": "海水淡化新興水資源科技",
        "level": 3
    }
]

if __name__ == "__main__":
    import sys
    sys.stdout.reconfigure(encoding='utf-8')
    print(f"社會科題庫數量: {len(SOCIAL_QUIZZES)}")
    buildings = set(q['buildingId'] for q in SOCIAL_QUIZZES)
    print(f"涵蓋建築: {buildings}")
    for i, q in enumerate(SOCIAL_QUIZZES):
        assert len(q['options']) == 4, f"第 {i+1} 題選項數不為 4"
        assert 0 <= q['answer'] < 4, f"第 {i+1} 題 answer 越界"
        assert 'guidedHints' in q and 'tier1Keyword' in q['guidedHints'] and 'tier2MicroConcept' in q['guidedHints'], f"第 {i+1} 題缺少鷹架提示"
    print("社會科 50 題校驗全部通過！")
