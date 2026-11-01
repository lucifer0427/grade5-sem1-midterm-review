# -*- coding: utf-8 -*-
"""
翰林版國小五年級上學期 英語科 (Here We Go! 5) 期中考 50 題標準題庫
涵蓋單元：
1. Starter & Phonics：長母音 /eɪ/ (a_e, ai, ay) 與 /i/ (e_e, ee, ea) 之自然發音與拼讀辨音 —— eng-phonics (13題)
2. Unit 1: What Day Is Today?：一週七天星期單字、大小寫規範、句型問答與介系詞 on —— eng-days (13題)
3. Unit 2: Do You Have PE Class on Monday?：八大學科字彙、助動詞 Do/Does 疑問句與簡答 —— eng-subjects (12題)
4. Review 1：課表閱讀理解、情境會話語塊、跨單元生活推論題 —— eng-review (12題)
所有題目均具備三階鷹架導引提示 (guidedHints)。
"""

ENGLISH_QUIZZES = [
    # ==================== Starter & Phonics：Phonics 發音鐘樓 (eng-phonics: 13題) ====================
    {
        "id": "eng-001",
        "subject": "english",
        "buildingId": "eng-phonics",
        "question": "單字 \"lake\"（湖泊）與 \"cake\"（蛋糕）中的字母組合 \"a_e\" 發出下列哪一個母音？",
        "options": ["短母音 /æ/", "長母音 /eɪ/", "長母音 /i/", "短母音 /e/"],
        "answer": 1,
        "explanation": "在英語自然發音中，「母音 + 子音 + 不發音的 e」（Magic e）結構會讓前方的 a 發出長母音 /eɪ/，發音如同字母 A 本身的名稱。",
        "guidedHints": {
            "tier1Keyword": "Magic e 規則、a_e 發長母音 /eɪ/",
            "tier2MicroConcept": "Magic e 原則：字尾有不發音的 e 時，中間母音 a 發字母本音 /eɪ/（如 bake, lake, name, tape）。"
        },
        "conceptRef": "Magic e 長母音 a_e 規則",
        "level": 1
    },
    {
        "id": "eng-002",
        "subject": "english",
        "buildingId": "eng-phonics",
        "question": "單字 \"rain\"（下雨）與 \"train\"（火車）中的字母組合 \"ai\" 通常發出什麼聲音？",
        "options": ["長母音 /eɪ/", "短母音 /aɪ/", "短母音 /ɪ/", "長母音 /u/"],
        "answer": 0,
        "explanation": "字母組合 \"ai\" 在單字中間（如 rain, train, wait, tail）通常發出長母音 /eɪ/。",
        "guidedHints": {
            "tier1Keyword": "ai 組合發長母音 /eɪ/",
            "tier2MicroConcept": "長母音 /eɪ/ 常見拼字：a_e (cake), ai (rain, pain), ay (day, play)。"
        },
        "conceptRef": "字母組合 ai 之長母音發音",
        "level": 1
    },
    {
        "id": "eng-003",
        "subject": "english",
        "buildingId": "eng-phonics",
        "question": "單字 \"day\"（日子）與 \"play\"（玩耍）中的字母組合 \"ay\" 通常發出什麼聲音？",
        "options": ["短母音 /æ/", "長母音 /eɪ/", "長母音 /i/", "短母音 /ɒ/"],
        "answer": 1,
        "explanation": "字母組合 \"ay\" 常出現在單字結尾（如 day, May, say, play, gray），發出長母音 /eɪ/。",
        "guidedHints": {
            "tier1Keyword": "字尾 ay 發長母音 /eɪ/",
            "tier2MicroConcept": "ay 在字尾發音規律：發 /eɪ/，與 ai 發音相同，但 ay 多用於字尾（pay, say, stay）。"
        },
        "conceptRef": "字尾字母組合 ay 之發音",
        "level": 1
    },
    {
        "id": "eng-004",
        "subject": "english",
        "buildingId": "eng-phonics",
        "question": "下列哪一組單字中的劃底線母音部分，「全數」發出長母音 /eɪ/ 的聲音？",
        "options": [
            "c<u>a</u>p, m<u>a</u>p, b<u>a</u>g",
            "b<u>a</u>k<u>e</u>, r<u>ai</u>n, d<u>ay</u>",
            "p<u>e</u>t, r<u>e</u>d, b<u>e</u>d",
            "s<u>ee</u>, t<u>ea</u>, b<u>ee</u>"
        ],
        "answer": 1,
        "explanation": "bake (/beɪk/)、rain (/reɪn/)、day (/deɪ/) 皆發長母音 /eɪ/。選項 A 為短母音 /æ/；選項 C 為短母音 /e/；選項 D 為長母音 /i/。",
        "guidedHints": {
            "tier1Keyword": "bake, rain, day 全是 /eɪ/",
            "tier2MicroConcept": "發音辨析：/eɪ/ 代表字包含 a_e (bake), ai (rain), ay (day)；對比短母音 /æ/ (cap, cat)。"
        },
        "conceptRef": "長母音 /eɪ/ 拼讀組群辨析",
        "level": 2
    },
    {
        "id": "eng-005",
        "subject": "english",
        "buildingId": "eng-phonics",
        "question": "單字 \"bee\"（蜜蜂）與 \"tree\"（樹木）中的雙母音字母組合 \"ee\" 發出下列哪一個音？",
        "options": ["長母音 /i/", "短母音 /ɪ/", "長母音 /eɪ/", "短母音 /e/"],
        "answer": 0,
        "explanation": "雙字母 \"ee\" 在單字中（如 see, bee, tree, green）通常發出清脆的長母音 /i/（如同字母 E 的名稱音）。",
        "guidedHints": {
            "tier1Keyword": "ee 發長母音 /i/",
            "tier2MicroConcept": "長母音 /i/ 拼字型態：ee (bee, see, tree), ea (tea, sea, read), e_e (Pete, these)。"
        },
        "conceptRef": "雙字母 ee 之長母音 /i/ 發音",
        "level": 1
    },
    {
        "id": "eng-006",
        "subject": "english",
        "buildingId": "eng-phonics",
        "question": "單字 \"tea\"（茶）與 \"sea\"（海洋）中的字母組合 \"ea\" 通常發出什麼聲音？",
        "options": ["長母音 /i/", "長母音 /eɪ/", "短母音 /æ/", "長母音 /aɪ/"],
        "answer": 0,
        "explanation": "字母組合 \"ea\" 在多數常用單字中（如 tea, sea, peach, meat, eat）發出長母音 /i/。",
        "guidedHints": {
            "tier1Keyword": "ea 發長母音 /i/",
            "tier2MicroConcept": "ea 發音規則：大部分常見字發 /i/（tea, eat, clean, read）；少數例外如 bread, head 發短母音 /e/。"
        },
        "conceptRef": "字母組合 ea 之長母音 /i/ 發音",
        "level": 1
    },
    {
        "id": "eng-007",
        "subject": "english",
        "buildingId": "eng-phonics",
        "question": "下列哪一個單字的劃底線發音與其他三者「不同」？",
        "options": [
            "t<u>ea</u>",
            "s<u>ee</u>",
            "l<u>a</u>k<u>e</u>",
            "m<u>ea</u>t"
        ],
        "answer": 2,
        "explanation": "tea (/ti/)、see (/si/)、meat (/mit/) 皆發長母音 /i/；唯有 lake (/leɪk/) 發長母音 /eɪ/，發音不同。",
        "guidedHints": {
            "tier1Keyword": "lake 發 /eɪ/，其餘三者發 /i/",
            "tier2MicroConcept": "母音辨音對比：長母音 /i/ (tea, see, meat) 與長母音 /eɪ/ (lake, cake, bake)。"
        },
        "conceptRef": "長母音 /i/ 與 /eɪ/ 辨音對比",
        "level": 2
    },
    {
        "id": "eng-008",
        "subject": "english",
        "buildingId": "eng-phonics",
        "question": "短母音 \"cap\"（棒球帽）加上字尾不發音的 e 變成 \"cape\"（披風），其母音 a 的發音產生何種變化？",
        "options": [
            "由長母音 /eɪ/ 變成短母音 /æ/",
            "由短母音 /æ/ 變成發字母名稱音的長母音 /eɪ/",
            "完全沒有任何變化",
            "母音 a 變成不發音"
        ],
        "answer": 1,
        "explanation": "cap 的 a 發短母音 /kæp/；加入字尾 e 形成 Magic e 結構後，cape 發長母音 /keɪp/。",
        "guidedHints": {
            "tier1Keyword": "cap /æ/ ➔ cape /eɪ/",
            "tier2MicroConcept": "Magic e 轉換公式：cap (/æ/) ➔ cape (/eɪ/)；tap (/æ/) ➔ tape (/eɪ/)；hat (/æ/) ➔ hate (/eɪ/)。"
        },
        "conceptRef": "短母音與長母音 Magic e 轉換",
        "level": 2
    },
    {
        "id": "eng-009",
        "subject": "english",
        "buildingId": "eng-phonics",
        "question": "單字 \"Pete\"（男生名字）與 \"these\"（這些）中的字母組合 \"e_e\" 發出什麼聲音？",
        "options": ["短母音 /e/", "長母音 /i/", "長母音 /eɪ/", "短母音 /ɪ/"],
        "answer": 1,
        "explanation": "「e + 子音 + e」的 Magic e 結構會使第一個 e 發出長母音 /i/，如 Pete (/pit/)、these (/ðiz/)。",
        "guidedHints": {
            "tier1Keyword": "e_e 發長母音 /i/",
            "tier2MicroConcept": "e_e 發音規則：字尾 e 不發音，前面的 e 發長母音 /i/（Pete, Steve, these）。"
        },
        "conceptRef": "Magic e 結構 e_e 發長母音 /i/",
        "level": 2
    },
    {
        "id": "eng-010",
        "subject": "english",
        "buildingId": "eng-phonics",
        "question": "聽老師唸出單字 \"tail\"（尾巴）與 \"tell\"（告訴），請問這兩個字的母音主要差異為何？",
        "options": [
            "tail 發長母音 /eɪ/，tell 發短母音 /e/",
            "兩者發音完全一模一樣",
            "tail 發長母音 /i/，tell 發短母音 /æ/",
            "tail 發長母音 /u/，tell 發短母音 /ɒ/"
        ],
        "answer": 0,
        "explanation": "tail 中的 ai 發長母音 /teɪl/；tell 中的 e 發短母音 /tɛl/，嘴型與長度截然不同。",
        "guidedHints": {
            "tier1Keyword": "tail 是長母音 /eɪ/，tell 是短母音 /e/",
            "tier2MicroConcept": "最小對比對 (Minimal Pairs)：tail (/teɪl/) vs tell (/tɛl/)；sale (/seɪl/) vs sell (/sɛl/)。"
        },
        "conceptRef": "長母音 /eɪ/ 與短母音 /e/ 對比辨音",
        "level": 3
    },
    {
        "id": "eng-011",
        "subject": "english",
        "buildingId": "eng-phonics",
        "question": "下列哪一個單字的發音「不是」長母音 /i/ 的發音？",
        "options": ["b<u>ee</u>", "t<u>ea</u>", "r<u>e</u>d", "m<u>ea</u>t"],
        "answer": 2,
        "explanation": "red 發短母音 /rɛd/；而 bee、tea、meat 皆發長母音 /i/。",
        "guidedHints": {
            "tier1Keyword": "red 是短母音 /e/",
            "tier2MicroConcept": "短母音 /e/ 代表字：red, bed, pen, pet, ten；對比長母音 /i/：bee, tree, tea。"
        },
        "conceptRef": "短母音 /e/ 與長母音 /i/ 排除題",
        "level": 2
    },
    {
        "id": "eng-012",
        "subject": "english",
        "buildingId": "eng-phonics",
        "question": "請選出正確的發音拼讀：單字 \"main\"（主要的）發音與下列哪一個字押相同的母音韻腳？",
        "options": ["man", "men", "pain", "pen"],
        "answer": 2,
        "explanation": "main (/meɪn/) 與 pain (/peɪn/) 都含有字母組合 ai，發出長母音 /eɪ/ 且押相同的 \"-ain\" 韻腳。",
        "guidedHints": {
            "tier1Keyword": "main 與 pain 押 /eɪn/ 韻腳",
            "tier2MicroConcept": "韻腳拼讀法 (-ain family)：main, pain, rain, train, chain 皆發 /eɪn/。"
        },
        "conceptRef": "拼讀韻腳 (Rhyming Words) 判斷",
        "level": 2
    },
    {
        "id": "eng-013",
        "subject": "english",
        "buildingId": "eng-phonics",
        "question": "下列關於自然發音 (Phonics) 的規則，哪一項敘述是正確的？",
        "options": [
            "英文所有單字中的每個字母都一定要大聲唸出來",
            "在 \"cake\" 中，字尾的 \"e\" 是不發音的 (Silent e)，它的作用是讓前面的 a 發長母音",
            "字母組合 \"ee\" 永遠發出短母音 /ɪ/",
            "只要單字有四個字母，全部都是長母音"
        ],
        "answer": 1,
        "explanation": "Magic e（又稱 Silent e）本身不發音，主要功能是催化前方的母音字母由短母音轉變為其字母本身名稱的長母音。",
        "guidedHints": {
            "tier1Keyword": "Silent e 本身不發音，讓前母音變長",
            "tier2MicroConcept": "Silent e 功能：字尾 e 不發音，使中間單元母音 (a, e, i, o, u) 發長母音。"
        },
        "conceptRef": "Silent e 運作機制與定義",
        "level": 2
    },

    # ==================== Unit 1: 星期日程車站 (eng-days: 13題) ====================
    {
        "id": "eng-014",
        "subject": "english",
        "buildingId": "eng-days",
        "question": "一週的第一天（日曆上通常排在最左邊第一欄）是哪一天？",
        "options": ["Monday", "Sunday", "Friday", "Saturday"],
        "answer": 1,
        "explanation": "在傳統英美曆法與多數通用日曆上，一週的第一天為星期日 (Sunday)，工作日則始於星期一 (Monday)。",
        "guidedHints": {
            "tier1Keyword": "日曆一週的第一天是 Sunday",
            "tier2MicroConcept": "一週七天順序：Sunday ➔ Monday ➔ Tuesday ➔ Wednesday ➔ Thursday ➔ Friday ➔ Saturday。"
        },
        "conceptRef": "一週順序與首日 Sunday",
        "level": 1
    },
    {
        "id": "eng-015",
        "subject": "english",
        "buildingId": "eng-days",
        "question": "下列哪一個「星期單字」的英文拼字完全正確？",
        "options": ["Wednsday", "Wednesday", "Wensday", "Wednesdai"],
        "answer": 1,
        "explanation": "星期三的正確拼法是 \"Wednesday\"（注意 d 不發音，發音為 /ˈwɛnzdeɪ/）。",
        "guidedHints": {
            "tier1Keyword": "Wed-nes-day (中間有 nes)",
            "tier2MicroConcept": "易錯拼字：Wednesday（常漏掉 d 或 e，口訣：Wed-nes-day 三節記法）。"
        },
        "conceptRef": "星期三 Wednesday 正確拼寫",
        "level": 1
    },
    {
        "id": "eng-016",
        "subject": "english",
        "buildingId": "eng-days",
        "question": "在英文句子中，星期名稱（如 Monday, Friday）的書寫格式有何絕對規範？",
        "options": [
            "全部必須使用小寫字母",
            "字首字母「永遠必須大寫」，不論位於句首或句中",
            "只有在星期天時第一個字母才需要大寫",
            "在句尾時必須改成全部大寫"
        ],
        "answer": 1,
        "explanation": "星期名稱在英語中屬於專有名詞 (Proper Noun)，無論位於句子的開頭、中間或句尾，首字母永遠必須大寫（如 Monday, Tuesday）。",
        "guidedHints": {
            "tier1Keyword": "專有名詞、字首永遠大寫",
            "tier2MicroConcept": "大寫規則：星期（Sunday~Saturday）、月份、人名、語言首字母均恆為大寫。"
        },
        "conceptRef": "星期專有名詞字首大寫規範",
        "level": 1
    },
    {
        "id": "eng-017",
        "subject": "english",
        "buildingId": "eng-days",
        "question": "想詢問對方「今天星期幾？」，最道地標準的英文句型是下列何者？",
        "options": [
            "What time is it today?",
            "What day is today?",
            "How is the day today?",
            "Where is today?"
        ],
        "answer": 1,
        "explanation": "詢問星期幾使用「What day is today?」或「What day is it today?」；若問時間幾點幾分則用「What time is it?」。",
        "guidedHints": {
            "tier1Keyword": "詢問星期用 What day is today?",
            "tier2MicroConcept": "疑問詞辨析：What day（問星期幾）；What time（問幾點鐘）；What date（問幾月幾號）。"
        },
        "conceptRef": "詢問星期句型 What day is today",
        "level": 1
    },
    {
        "id": "eng-018",
        "subject": "english",
        "buildingId": "eng-days",
        "question": "當有人問你：\"What day is today?\"，下列哪一個回答是文法正確且自然的標準答句？",
        "options": [
            "Today is ten o'clock.",
            "It's Friday today.",
            "I am Friday.",
            "Yes, it is."
        ],
        "answer": 1,
        "explanation": "回答星期幾時，英語習慣使用虛主詞代名詞 \"It\" 開頭，回答 \"It's Friday today.\" 或簡答 \"It's Friday.\"。",
        "guidedHints": {
            "tier1Keyword": "以 It's [星期] 回答",
            "tier2MicroConcept": "星期答句規範：It's + [星期單字] + (today)。不宜說 I am Friday 或 Yes/No。"
        },
        "conceptRef": "回答星期標準句型",
        "level": 1
    },
    {
        "id": "eng-019",
        "subject": "english",
        "buildingId": "eng-days",
        "question": "在英文中，若要表達在「某個特定星期幾」（例如：在星期一），前方必須搭配哪一個專屬介系詞？",
        "options": ["in", "at", "on", "to"],
        "answer": 2,
        "explanation": "特定日期與星期前專門搭配介系詞 \"on\"，例如 on Monday, on Friday, on Sunday afternoon；月份與年份用 in，特定時刻點用 at。",
        "guidedHints": {
            "tier1Keyword": "星期特定日子搭配 on",
            "tier2MicroConcept": "時間介系詞黃金口訣：at 加時刻點 (at 8:00)，on 加特定日/星期 (on Friday)，in 加年月季節 (in May)。"
        },
        "conceptRef": "星期搭配介系詞 on 規範",
        "level": 1
    },
    {
        "id": "eng-020",
        "subject": "english",
        "buildingId": "eng-days",
        "question": "如果昨天是 Tuesday（星期二），那麼「後天」將會是星期幾？",
        "options": ["Wednesday", "Thursday", "Friday", "Saturday"],
        "answer": 2,
        "explanation": "昨天是 Tuesday ➔ 今天是 Wednesday ➔ 明天是 Thursday ➔ 後天（the day after tomorrow）是 Friday（星期五）。",
        "guidedHints": {
            "tier1Keyword": "昨天二 ➔ 今天三 ➔ 明天四 ➔ 後天五",
            "tier2MicroConcept": "時間推論邏輯：yesterday (Tuesday) ➔ today (Wednesday) ➔ tomorrow (Thursday) ➔ day after tomorrow (Friday)。"
        },
        "conceptRef": "一週日程推論計算",
        "level": 2
    },
    {
        "id": "eng-021",
        "subject": "english",
        "buildingId": "eng-days",
        "question": "\"Tuesday\" 與 \"Thursday\" 常有同學混淆，下列辨別這兩個單字的技巧何者正確？",
        "options": [
            "Tuesday 是星期二，Thursday 是星期四",
            "Tuesday 是星期四，Thursday 是星期二",
            "兩個字都是星期天",
            "Tuesday 是星期五，Thursday 是星期三"
        ],
        "answer": 0,
        "explanation": "Tuesday 是星期二；Thursday 以 th 開頭咬舌音，是星期四（介於 Wednesday 與 Friday 之間）。",
        "guidedHints": {
            "tier1Keyword": "Tuesday 星期二、Thursday 星期四",
            "tier2MicroConcept": "辨析小技巧：Tue=二 (Tuesday 星期二)；Thur=四 (Thursday 星期四)。"
        },
        "conceptRef": "Tuesday 與 Thursday 易混淆單字辨析",
        "level": 1
    },
    {
        "id": "eng-022",
        "subject": "english",
        "buildingId": "eng-days",
        "question": "我們常說的「週末」(weekend)，通常是指哪兩天？",
        "options": [
            "Monday and Tuesday",
            "Thursday and Friday",
            "Saturday and Sunday",
            "Sunday and Monday"
        ],
        "answer": 2,
        "explanation": "The weekend（週末）是指週六 (Saturday) 與週日 (Sunday)；而 Monday 至 Friday 則稱為工作日/上學日 (weekdays)。",
        "guidedHints": {
            "tier1Keyword": "weekend = Saturday + Sunday",
            "tier2MicroConcept": "日程詞彙：weekdays (工作日：週一至週五) vs weekend (週末：週六與週日)。"
        },
        "conceptRef": "週末 weekend 與平日 weekday 定義",
        "level": 1
    },
    {
        "id": "eng-023",
        "subject": "english",
        "buildingId": "eng-days",
        "question": "選出句子填空最適當的字：\"We go to the park ______ Sunday morning.\"",
        "options": ["in", "at", "on", "under"],
        "answer": 2,
        "explanation": "雖然單獨 morning 用 in the morning，但若有具體星期名飾修（Sunday morning），則專有日子的優先級最高，必須使用 \"on\"。",
        "guidedHints": {
            "tier1Keyword": "Sunday morning 具體特定日，用 on",
            "tier2MicroConcept": "介系詞特例：只要時間前面帶有具體星期或日期，一律用 on（on Sunday morning, on Friday night）。"
        },
        "conceptRef": "特定星期時段之介系詞 on",
        "level": 2
    },
    {
        "id": "eng-024",
        "subject": "english",
        "buildingId": "eng-days",
        "question": "單字 \"Saturday\" 在日曆上的常見英文縮寫為下列何者？",
        "options": ["Sun.", "Sat.", "Std.", "St."],
        "answer": 1,
        "explanation": "星期縮寫取前三個字母加縮寫點：Saturday 縮寫為 \"Sat.\"；Sunday 為 \"Sun.\"；Monday 為 \"Mon.\"。",
        "guidedHints": {
            "tier1Keyword": "Saturday 縮寫為 Sat.",
            "tier2MicroConcept": "一週縮寫表：Sun. / Mon. / Tue. / Wed. / Thu. / Fri. / Sat.。"
        },
        "conceptRef": "星期單字之標準三字母縮寫",
        "level": 1
    },
    {
        "id": "eng-025",
        "subject": "english",
        "buildingId": "eng-days",
        "question": "句型除錯題：下列四個句子中，哪一句在大小寫與文法上「完全沒有任何錯誤」？",
        "options": [
            "It's monday Today.",
            "what day is today?",
            "It's Thursday today.",
            "It is friday Today."
        ],
        "answer": 2,
        "explanation": "選項 A 中 monday 未大寫且 Today 誤大寫；選項 B 句首 what 未大寫；選項 D 中 friday 未大寫；選項 C 句首 It's、專有名詞 Thursday、句末 today 均完全合規。",
        "guidedHints": {
            "tier1Keyword": "It's Thursday today. 句首大寫、星期大寫",
            "tier2MicroConcept": "句子書寫檢查清單：1. 句首字母大寫；2. 星期字首大寫；3. 一般副詞 today 小寫；4. 句末標點符號。"
        },
        "conceptRef": "星期書寫文法除錯與規範",
        "level": 2
    },
    {
        "id": "eng-026",
        "subject": "english",
        "buildingId": "eng-days",
        "question": "對話情境：\nA: \"Let's go swimming!\"\nB: \"Sorry, I can't. I have violin class ______ Tuesday.\"\n空格處應填入哪一個介系詞？",
        "options": ["on", "in", "at", "for"],
        "answer": 0,
        "explanation": "修飾特定星期（Tuesday）的表時間副詞片語，介系詞使用 \"on\"。",
        "guidedHints": {
            "tier1Keyword": "on Tuesday",
            "tier2MicroConcept": "固定片語：on + 星期（on Monday, on Tuesday, on Wednesday...）。"
        },
        "conceptRef": "對話情境中星期介系詞填空",
        "level": 1
    },

    # ==================== Unit 2: 學校課表工坊 (eng-subjects: 12題) ====================
    {
        "id": "eng-027",
        "subject": "english",
        "buildingId": "eng-subjects",
        "question": "體育課的英文簡稱為 \"PE\"，請問 \"PE\" 是哪兩個單字的縮寫？",
        "options": [
            "Physical Education",
            "Public English",
            "Power Exercise",
            "Play Everyday"
        ],
        "answer": 0,
        "explanation": "PE 是 Physical Education（身體的教育／體育）的縮寫，習慣兩個字母均大寫。",
        "guidedHints": {
            "tier1Keyword": "Physical Education = PE",
            "tier2MicroConcept": "學科縮寫常識：PE (Physical Education 體育課)；兩字母均須大寫並常連用。"
        },
        "conceptRef": "體育課 PE 全名與縮寫",
        "level": 1
    },
    {
        "id": "eng-028",
        "subject": "english",
        "buildingId": "eng-subjects",
        "question": "下列哪一個學科名詞在英文中屬於「專有名詞」，字首「必須大寫」？",
        "options": ["art", "music", "English", "science"],
        "answer": 2,
        "explanation": "語言名詞（如 English, Chinese）源自國家或民族名稱，屬於專有名詞，字首必須大寫；一般學科如 art, math, music, science 則小寫。",
        "guidedHints": {
            "tier1Keyword": "English 與 Chinese 語言必須大寫",
            "tier2MicroConcept": "學科大小寫規範：語言類（English, Chinese）恆大寫；非語言學科（math, art, music, science, social studies）通常小寫。"
        },
        "conceptRef": "學科名稱大小寫規範",
        "level": 2
    },
    {
        "id": "eng-029",
        "subject": "english",
        "buildingId": "eng-subjects",
        "question": "想詢問對方「你星期一有美勞課嗎？」，下列哪一個英文問句的文法與結構完全正確？",
        "options": [
            "Are you have art class on Monday?",
            "Do you have art class on Monday?",
            "Does you have art class on Monday?",
            "Have you art class on Monday?"
        ],
        "answer": 1,
        "explanation": "主詞為第二人稱 you，一般動詞 have 的現在簡單式疑問句需借助助動詞 \"Do\"，句型為 \"Do you have + 學科 + on + 星期?\"。",
        "guidedHints": {
            "tier1Keyword": "Do you have...",
            "tier2MicroConcept": "助動詞疑問句公式：Do + (I/you/we/they) + have + 課名 + on 星期?；Does + (he/she/it) + have...?"
        },
        "conceptRef": "現在簡單式 Do you have 疑問句",
        "level": 1
    },
    {
        "id": "eng-030",
        "subject": "english",
        "buildingId": "eng-subjects",
        "question": "面對問句：\"Do you have music class today?\"，若答案是「肯定的（有）」，應如何簡答？",
        "options": [
            "Yes, I am.",
            "Yes, I do.",
            "Yes, I have.",
            "Yes, I does."
        ],
        "answer": 1,
        "explanation": "用助動詞 \"Do\" 發問的問句，肯定簡答需用相同的助動詞回應：\"Yes, I do.\"；否定簡答為 \"No, I don't.\"。",
        "guidedHints": {
            "tier1Keyword": "Do 問 Do 答 ➔ Yes, I do.",
            "tier2MicroConcept": "簡答前後呼應原則：Do you...? ➔ Yes, I do. / No, I don't.（不可用 am 回答）。"
        },
        "conceptRef": "Do 疑問句之肯定簡答",
        "level": 1
    },
    {
        "id": "eng-031",
        "subject": "english",
        "buildingId": "eng-subjects",
        "question": "若主詞換成第三人稱單數「她」(she)，詢問「她星期二有數學課嗎？」，問句中的助動詞應選用何者？",
        "options": ["Do", "Does", "Is", "Are"],
        "answer": 1,
        "explanation": "主詞為第三人稱單數（he, she, it, Amy 等），現在簡單式的一般動詞疑問句必須使用助動詞 \"Does\"，後方動詞 have 回復原形。",
        "guidedHints": {
            "tier1Keyword": "三單 she 用助動詞 Does",
            "tier2MicroConcept": "三單助動詞：Does she have...?（助動詞 Does 出現後，後面的 has 必須變回原形動詞 have）。"
        },
        "conceptRef": "第三人稱單數助動詞 Does",
        "level": 2
    },
    {
        "id": "eng-032",
        "subject": "english",
        "buildingId": "eng-subjects",
        "question": "問句：\"Does Ken have science class on Wednesday?\"\n若答案為「否定（沒有）」，正確的簡答是？",
        "options": [
            "No, he isn't.",
            "No, he doesn't.",
            "No, he don't.",
            "No, he didn't."
        ],
        "answer": 1,
        "explanation": "問句主詞 Ken 為男生（代名詞 he），助動詞為 Does，否定簡答為 \"No, he doesn't.\"（= does not）。",
        "guidedHints": {
            "tier1Keyword": "Does 問 ➔ No, he doesn't.",
            "tier2MicroConcept": "三單否定簡答：No, he/she + doesn't.（don't 用於第一/二人稱及複數）。"
        },
        "conceptRef": "Does 疑問句之否定簡答",
        "level": 2
    },
    {
        "id": "eng-033",
        "subject": "english",
        "buildingId": "eng-subjects",
        "question": "下列哪一個學科的英文單字代表「社會領域（包含地理、歷史、公民）」？",
        "options": [
            "science",
            "social studies",
            "math",
            "art"
        ],
        "answer": 1,
        "explanation": "「社會科」的標準英文名稱為 \"social studies\"（通常 studies 帶有 s 複數型態）；science 為自然科學，math 為數學。",
        "guidedHints": {
            "tier1Keyword": "social studies = 社會科",
            "tier2MicroConcept": "五大學科單字：social studies (社會), science (自然), math (數學), Chinese (國語), English (英語)。"
        },
        "conceptRef": "學科字彙 social studies",
        "level": 1
    },
    {
        "id": "eng-034",
        "subject": "english",
        "buildingId": "eng-subjects",
        "question": "動詞填空題：\"Tom and Jerry ______ English class on Thursday.\"",
        "options": ["has", "have", "is", "having"],
        "answer": 1,
        "explanation": "主詞是 \"Tom and Jerry\"（兩個人，為複數主詞 they），現在簡單式動詞應使用原形 \"have\"，不可用單數的 has。",
        "guidedHints": {
            "tier1Keyword": "兩個人複數主詞用 have",
            "tier2MicroConcept": "主詞動詞一致性 (Subject-Verb Agreement)：單數第三人稱 (He/She) ➔ has；複數主詞 (They/Tom and Jerry) ➔ have。"
        },
        "conceptRef": "主詞動詞一致性 have 與 has",
        "level": 2
    },
    {
        "id": "eng-035",
        "subject": "english",
        "buildingId": "eng-subjects",
        "question": "下列句子中何者文法錯誤？",
        "options": [
            "I have music class on Friday.",
            "She has art class today.",
            "Does he has math class on Monday?",
            "Do they have PE class on Tuesday?"
        ],
        "answer": 2,
        "explanation": "助動詞 Does 已經表示了第三人稱單數形態，後面的主要動詞必須「回復為原形動詞 have」，不能寫成 \"Does he has\"，應改為 \"Does he have\"。",
        "guidedHints": {
            "tier1Keyword": "助動詞後面的動詞打回原形 have",
            "tier2MicroConcept": "助動詞照妖鏡法則：Do/Does/Don't/Doesn't 後面接的動詞必須是「原形動詞」(Base form)。"
        },
        "conceptRef": "助動詞後接原形動詞文法規則",
        "level": 3
    },
    {
        "id": "eng-036",
        "subject": "english",
        "buildingId": "eng-subjects",
        "question": "在課堂情境中，老師對全班說：\"Take out your ______ books, let's sing a song together!\" 空格中最適合填入哪一個學科？",
        "options": ["science", "music", "math", "PE"],
        "answer": 1,
        "explanation": "情境關鍵字 \"sing a song\"（唱一首歌）與音樂課最為契合，故拿出的是音樂課本 (music books)。",
        "guidedHints": {
            "tier1Keyword": "sing a song 唱歌 ➔ music",
            "tier2MicroConcept": "情境關鍵字關聯：sing a song ➔ music；run and jump ➔ PE；draw and paint ➔ art；numbers ➔ math。"
        },
        "conceptRef": "學科活動情境單字對應",
        "level": 1
    },
    {
        "id": "eng-037",
        "subject": "english",
        "buildingId": "eng-subjects",
        "question": "文法填空題：\nA: \"______ you have science class on Wednesday?\"\nB: \"No, I don't. I have science class on Thursday.\"",
        "options": ["Are", "Do", "Does", "Is"],
        "answer": 1,
        "explanation": "主詞為 you，B 的回答是 \"No, I don't\"，因此問句必定是以助動詞 \"Do\" 開頭提問。",
        "guidedHints": {
            "tier1Keyword": "回答 No, I don't. ➔ 問句用 Do",
            "tier2MicroConcept": "前後呼應法則：看到答句用 don't，問句肯定用 Do 開頭。"
        },
        "conceptRef": "助動詞疑問句首詞填空",
        "level": 1
    },
    {
        "id": "eng-038",
        "subject": "english",
        "buildingId": "eng-subjects",
        "question": "「算術、形狀與幾何、邏輯思考」是在哪一門學科課程中學習的內容？",
        "options": ["math", "art", "Chinese", "PE"],
        "answer": 0,
        "explanation": "數字算術、幾何圖形對應的是數學科 \"math\"（Mathematics 的簡稱）。",
        "guidedHints": {
            "tier1Keyword": "數字幾何 = math (數學)",
            "tier2MicroConcept": "單字釋義：math (數學), art (美術), Chinese (國語), PE (體育)。"
        },
        "conceptRef": "學科詞彙意義認知",
        "level": 1
    },

    # ==================== Review 1: 跨單元挑戰亭 (eng-review: 12題) ====================
    {
        "id": "eng-039",
        "subject": "english",
        "buildingId": "eng-review",
        "question": "閱讀這段課表對話：\nDavid: \"What day is today?\"\nLisa: \"It's Thursday. We have PE class and English class today!\"\n請問今天 David 和 Lisa 上什麼課？",
        "options": [
            "星期二上體育課與數學課",
            "星期四上體育課與英語課",
            "星期五上美勞課與自然課",
            "星期三上音樂課與社會課"
        ],
        "answer": 1,
        "explanation": "Thursday 代表星期四；PE class 代表體育課；English class 代表英語課。因此是星期四上體育與英語。",
        "guidedHints": {
            "tier1Keyword": "Thursday = 星期四，PE + English",
            "tier2MicroConcept": "閱讀理解關鍵字抓取：Thursday (週四) + PE (體育) + English (英語)。"
        },
        "conceptRef": "課表對話情境閱讀理解",
        "level": 1
    },
    {
        "id": "eng-040",
        "subject": "english",
        "buildingId": "eng-review",
        "question": "日常社交會話中，當朋友即將去遊樂園玩或出發度假時，我們常對他說哪一句祝福的話？",
        "options": [
            "Good job!",
            "Have a good time!",
            "See you tomorrow.",
            "You're welcome."
        ],
        "answer": 1,
        "explanation": "\"Have a good time!\" 意思是「祝你玩得開心／享受美好時光！」，是美語常用的道別祝福用語。",
        "guidedHints": {
            "tier1Keyword": "祝對方玩得開心 = Have a good time!",
            "tier2MicroConcept": "常用交際用語：Have a good time!（玩得開心）；Good job!（做得好）；See you later!（回頭見）。"
        },
        "conceptRef": "日常生活慣用語塊 Have a good time",
        "level": 1
    },
    {
        "id": "eng-041",
        "subject": "english",
        "buildingId": "eng-review",
        "question": "放學時同學跟你說：\"See you tomorrow!\"（明天見！），此時今天是 Friday，這句話在邏輯上有何小小矛盾？",
        "options": [
            "因為明天是 Saturday（週末放假不用上學），所以通常要說 \"See you on Monday!\"",
            "因為放學只能說 Good morning",
            "完全沒有任何問題，每天都要去學校",
            "明天一定是 Sunday"
        ],
        "answer": 0,
        "explanation": "週五放學後緊接著是週六 (Saturday) 週末假期，學生週六不上學，因此週五放學道別通常會說 \"Have a nice weekend!\" 或 \"See you on Monday!\"。",
        "guidedHints": {
            "tier1Keyword": "週五放學明天是 Saturday 放假",
            "tier2MicroConcept": "文化交際邏輯：Friday 放學常說 Have a good weekend! 或 See you next week!。"
        },
        "conceptRef": "週末放學生活社交文化情境",
        "level": 2
    },
    {
        "id": "eng-042",
        "subject": "english",
        "buildingId": "eng-review",
        "question": "閱讀小短文：\n\"Today is Monday. I have math and Chinese in the morning. In the afternoon, I have art class. I like art!\"\n請問作者在「下午」(afternoon) 上什麼課？",
        "options": ["math class", "Chinese class", "art class", "music class"],
        "answer": 2,
        "explanation": "文中清楚提到：\"In the afternoon, I have art class.\"，故下午上的是美勞／藝術課 (art)。",
        "guidedHints": {
            "tier1Keyword": "In the afternoon ➔ art class",
            "tier2MicroConcept": "閱讀細節定位：morning (math & Chinese) vs afternoon (art)。"
        },
        "conceptRef": "記敘短文細節定位閱讀",
        "level": 1
    },
    {
        "id": "eng-043",
        "subject": "english",
        "buildingId": "eng-review",
        "question": "對話配對題：\nSam: \"Look at the rain! I don't have an umbrella.\"\nAmy: \"______ You can share my umbrella.\"\nAmy 最可能說哪句話來安慰 Sam？",
        "options": [
            "Good idea!",
            "Don't worry.",
            "Hurry up!",
            "Thank you."
        ],
        "answer": 1,
        "explanation": "\"Don't worry.\"（別擔心），接著提供解決方法 \"You can share my umbrella\"（你可以跟我共用傘），符合安慰互助情境。",
        "guidedHints": {
            "tier1Keyword": "別擔心 = Don't worry",
            "tier2MicroConcept": "生活交際會話：Don't worry.（別擔心/不用愁）；share（分享/共用）。"
        },
        "conceptRef": "情境交際會話 Don't worry",
        "level": 2
    },
    {
        "id": "eng-044",
        "subject": "english",
        "buildingId": "eng-review",
        "question": "綜合填空：\"Today is Friday. Tomorrow is ______.\"",
        "options": ["Sunday", "Saturday", "Thursday", "Monday"],
        "answer": 1,
        "explanation": "今天是 Friday（星期五），Tomorrow（明天）就是 Saturday（星期六）。",
        "guidedHints": {
            "tier1Keyword": "Friday 之後是 Saturday",
            "tier2MicroConcept": "相鄰星期推理：Thursday ➔ Friday ➔ Saturday。"
        },
        "conceptRef": "一週相鄰天數推理",
        "level": 1
    },
    {
        "id": "eng-045",
        "subject": "english",
        "buildingId": "eng-review",
        "question": "單字分類題：下列哪一個單字與其他三個「不屬於同一類別」？",
        "options": ["Tuesday", "science", "math", "music"],
        "answer": 0,
        "explanation": "Tuesday（星期二）屬於一週的「星期名稱」；而 science, math, music 皆屬於學校「學科領域名稱」。",
        "guidedHints": {
            "tier1Keyword": "Tuesday 是星期，其他是學科",
            "tier2MicroConcept": "字彙語意歸類：Day of the week (Tuesday) vs School subjects (science, math, music)。"
        },
        "conceptRef": "字彙語意歸類辨析",
        "level": 1
    },
    {
        "id": "eng-046",
        "subject": "english",
        "buildingId": "eng-review",
        "question": "課表閱讀題：\nTim's Timetable:\n- Mon: PE, English\n- Tue: Math, Art\n- Wed: Chinese, Science\n- Thu: Music, Social Studies\n- Fri: PE, Math\n請問 Tim 在「哪兩天」都有體育課 (PE)？",
        "options": [
            "Monday and Friday",
            "Tuesday and Wednesday",
            "Monday and Thursday",
            "Wednesday and Friday"
        ],
        "answer": 0,
        "explanation": "對照課表，Mon (Monday) 有 PE，Fri (Friday) 也有 PE，因此是 Monday and Friday。",
        "guidedHints": {
            "tier1Keyword": "Mon 有 PE，Fri 有 PE",
            "tier2MicroConcept": "課表查閱比對：比對縮寫 Mon. (Monday) 與 Fri. (Friday) 之課程內容。"
        },
        "conceptRef": "非連續性文本課表閱讀理解",
        "level": 2
    },
    {
        "id": "eng-047",
        "subject": "english",
        "buildingId": "eng-review",
        "question": "重組句子題：請將下列單字重組為文法正確的句子：\n[on / do / have / you / ? / art class / Friday]",
        "options": [
            "Do you have art class on Friday?",
            "You do have art class on Friday?",
            "Have you art class on Friday do?",
            "Do have you on Friday art class?"
        ],
        "answer": 0,
        "explanation": "標準現在簡單式疑問句結構為：助動詞 Do + 主詞 you + 動詞 have + 受詞 art class + 時間片語 on Friday + 問號。",
        "guidedHints": {
            "tier1Keyword": "Do you have art class on Friday?",
            "tier2MicroConcept": "疑問句語序公式：Do + Subject + Verb + Object + Time prepositional phrase?"
        },
        "conceptRef": "疑問句標準句型重組",
        "level": 2
    },
    {
        "id": "eng-048",
        "subject": "english",
        "buildingId": "eng-review",
        "question": "生活會話題：\nTeacher: \"Class, please open your books and turn to page 20.\"\n這句話的意思是？",
        "options": [
            "同學們，請闔上課本並站起來",
            "全班同學，請打開課本翻到第 20 頁",
            "請大家拿出鉛筆畫圖",
            "下課了大家可以出去玩"
        ],
        "answer": 1,
        "explanation": "\"open your books\"（打開課本），\"turn to page 20\"（翻到第 20 頁），是標準課堂英語指令 (Classroom English)。",
        "guidedHints": {
            "tier1Keyword": "open books 打開書，page 20 第20頁",
            "tier2MicroConcept": "課堂常用指令：turn to page...（翻到第幾頁）；listen carefully（仔細聽）；repeat after me（跟我唸）。"
        },
        "conceptRef": "課堂指令 Classroom English 理解",
        "level": 1
    },
    {
        "id": "eng-049",
        "subject": "english",
        "buildingId": "eng-review",
        "question": "文法填空題：\nA: \"______ your brother have Chinese class today?\"\nB: \"Yes, he does.\"",
        "options": ["Do", "Does", "Is", "Are"],
        "answer": 1,
        "explanation": "主詞是 \"your brother\"（你的哥哥／弟弟，相當於第三人稱單數 he），且答句使用 \"Yes, he does\"，故問句助動詞用 \"Does\"。",
        "guidedHints": {
            "tier1Keyword": "your brother 是第三人稱單數 he ➔ 用 Does",
            "tier2MicroConcept": "主詞判斷：your brother 是一個人（三單 he），不是 you！因此要用 Does。"
        },
        "conceptRef": "第三人稱單數混淆題 your brother",
        "level": 3
    },
    {
        "id": "eng-050",
        "subject": "english",
        "buildingId": "eng-review",
        "question": "綜合發音與字彙題：下列哪一個單字同時符合「含有長母音 /eɪ/」且「代表一週中上學的第一天」？",
        "options": ["Monday", "Sunday", "May", "rain"],
        "answer": 0,
        "explanation": "Monday 字尾的 \"-day\" 發長母音 /deɪ/，且為週一（學生一週中上學的第一天）；Sunday 雖然有 /deɪ/ 但放假；May 與 rain 不是星期名。",
        "guidedHints": {
            "tier1Keyword": "上學第一天 = Monday",
            "tier2MicroConcept": "綜合統整：Monday（上學第一天，含 -day /deɪ/ 長母音韻尾）。"
        },
        "conceptRef": "發音與生活語意跨維度統整",
        "level": 3
    }
]

if __name__ == "__main__":
    import sys
    sys.stdout.reconfigure(encoding='utf-8')
    print(f"英語科題庫數量: {len(ENGLISH_QUIZZES)}")
    buildings = set(q['buildingId'] for q in ENGLISH_QUIZZES)
    print(f"涵蓋建築: {buildings}")
    for i, q in enumerate(ENGLISH_QUIZZES):
        assert len(q['options']) == 4, f"第 {i+1} 題選項數不為 4"
        assert 0 <= q['answer'] < 4, f"第 {i+1} 題 answer 越界"
        assert 'guidedHints' in q and 'tier1Keyword' in q['guidedHints'] and 'tier2MicroConcept' in q['guidedHints'], f"第 {i+1} 題缺少鷹架提示"
    print("英語科 50 題校驗全部通過！")
