// quiz-engine.js: 三階引導鷹架測驗狀態機、計分系統與本機進度保存

export class QuizEngine {
  constructor(quizzesData, audioSynth, onStateChange) {
    this.allQuestions = quizzesData.questions;
    this.audioSynth = audioSynth;
    this.onStateChange = onStateChange;

    // 建立 buildingId -> questions 索引
    this.buildingQuestionMap = new Map();
    this.allQuestions.forEach(q => {
      if (!this.buildingQuestionMap.has(q.buildingId)) {
        this.buildingQuestionMap.set(q.buildingId, []);
      }
      this.buildingQuestionMap.get(q.buildingId).push(q);
    });

    // 載入持久化玩家進度
    this.playerState = this.loadState();

    // 當前測驗會話
    this.currentSession = null;
  }

  loadState() {
    const defaultState = {
      coins: 100, // 初始星光幣
      stars: 0,
      clearedBuildings: [],
      wrongQuestionIds: [],
      avatarOutfit: 'school_uniform',
      lightstick: 'basic_pink',
      schemaVersion: 2
    };

    try {
      const saved = localStorage.getItem('grade5_exam_review_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Object.assign(defaultState, parsed);
      }
    } catch (e) {
      console.warn('無法讀取 localStorage 進度', e);
    }

    return defaultState;
  }

  saveState() {
    try {
      localStorage.setItem('grade5_exam_review_state', JSON.stringify(this.playerState));
      if (this.onStateChange) this.onStateChange(this.playerState);
    } catch (e) {
      console.warn('無法保存 localStorage 進度', e);
    }
  }

  // 開始單元建築測驗
  startBuildingQuiz(buildingId) {
    // 1. 若為中央出道舞台，直接開啟大會考模式 (15 題跨科組卷)
    if (buildingId === 'center-stage' || buildingId === 'center-wardrobe' || buildingId.startsWith('center')) {
      return this.startGrandExam();
    }

    let list = this.buildingQuestionMap.get(buildingId) || [];

    // 2. 防呆機制：若該建築暫無題目，自動抽取該學科的所有題庫
    if (list.length === 0) {
      const subjectPrefix = buildingId.split('-')[0];
      const subjectKeyMap = {
        'math': 'math',
        'eng': 'english',
        'sci': 'science',
        'soc': 'social',
        'chi': 'chinese'
      };
      const targetSub = subjectKeyMap[subjectPrefix] || subjectPrefix;
      list = this.allQuestions.filter(q => q.subject === targetSub);
      console.log(`[QuizEngine] 建築 ${buildingId} 無專用題，自動抽取 ${targetSub} 學科題庫 (${list.length} 題)`);
    }

    // 3. 終極防呆：若仍無題目，隨機自全題庫抽取
    if (list.length === 0) {
      list = this.allQuestions;
    }

    // 隨機抽選最多 5 題
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(5, shuffled.length));

    this.currentSession = {
      mode: 'building',
      buildingId,
      questions: selected,
      currentIndex: 0,
      score: 0,
      combo: 0,
      attempts: 0, // 當前題目的嘗試次數
      eliminatedIndices: new Set(), // 50/50 排除的選項索引
      tierLevel: 0 // 0: 初始, 1: Tier1提示, 2: Tier2微卡片
    };

    return this.getCurrentQuestionView();
  }

  // 開始期中總大會考 (各科嚴格平均抽 3 題，跨科 15 題組卷)
  startGrandExam() {
    const subjects = ['math', 'english', 'science', 'social', 'chinese'];
    const selected = [];

    // 每科嚴格抽取 3 題 (5 科 × 3 = 15 題均衡抽配)
    subjects.forEach(sub => {
      const subQuestions = this.allQuestions.filter(q => q.subject === sub);
      const shuffled = [...subQuestions].sort(() => 0.5 - Math.random());
      selected.push(...shuffled.slice(0, 3));
    });

    // 跨科題目打散隨機交錯
    selected.sort(() => 0.5 - Math.random());

    const breakdown = {
      math: { total: 0, correct: 0 },
      english: { total: 0, correct: 0 },
      science: { total: 0, correct: 0 },
      social: { total: 0, correct: 0 },
      chinese: { total: 0, correct: 0 }
    };
    selected.forEach(q => {
      if (breakdown[q.subject]) breakdown[q.subject].total++;
    });

    this.currentSession = {
      mode: 'grand_exam',
      buildingId: 'center-stage',
      questions: selected,
      currentIndex: 0,
      score: 0,
      combo: 0,
      attempts: 0,
      eliminatedIndices: new Set(),
      solvedQuestionIds: new Set(),
      tierLevel: 0,
      subjectBreakdown: breakdown
    };

    return this.getCurrentQuestionView();
  }

  getCurrentQuestionView() {
    if (!this.currentSession) return null;
    const session = this.currentSession;
    if (session.currentIndex >= session.questions.length) {
      return this.finishSession();
    }

    const q = session.questions[session.currentIndex];
    return {
      isFinished: false,
      mode: session.mode,
      totalCount: session.questions.length,
      currentNumber: session.currentIndex + 1,
      combo: session.combo,
      score: session.score,
      question: q,
      tierLevel: session.tierLevel,
      attempts: session.attempts,
      eliminatedIndices: Array.from(session.eliminatedIndices),
      hintText: this.getHintText(q, session.tierLevel)
    };
  }

  getHintText(q, tierLevel) {
    if (tierLevel === 1) {
      return q.guidedHints?.tier1Keyword || '💡 仔細閱讀題目關鍵字再想一想！';
    } else if (tierLevel >= 2) {
      return q.guidedHints?.tier2MicroConcept || q.explanation;
    }
    return '';
  }

  // 提交作答
  submitAnswer(chosenOptionIndex) {
    if (!this.currentSession) return null;
    const session = this.currentSession;
    const q = session.questions[session.currentIndex];
    session.attempts++;

    // 答對
    if (chosenOptionIndex === q.answer) {
      let earnedCoins = 0;
      let earnedStars = 1;

      if (session.attempts === 1) {
        // 首試即對
        earnedCoins = 20;
        session.score += 20;
        session.combo++;
        this.audioSynth.playCorrect();
        if (session.combo >= 3) {
          this.audioSynth.playCombo();
        }
      } else {
        // 引導後答對 (鼓勵不放棄)
        earnedCoins = 10;
        session.score += 10;
        this.audioSynth.playCorrect();
      }

      this.playerState.coins += earnedCoins;
      this.playerState.stars += earnedStars;
      this.saveState();

      // 大會考成績統計 (防重複計數：每題只在首次解答成功時計入 correct)
      if (session.mode === 'grand_exam' && session.subjectBreakdown && session.subjectBreakdown[q.subject]) {
        if (!session.solvedQuestionIds.has(q.id)) {
          session.solvedQuestionIds.add(q.id);
          session.subjectBreakdown[q.subject].correct++;
        }
      }

      const result = {
        correct: true,
        combo: session.combo,
        earnedCoins,
        explanation: q.explanation,
        isLast: session.currentIndex + 1 >= session.questions.length
      };

      return result;
    }

    // 答錯 -> 觸發鷹架引導狀態機
    session.combo = 0; // 中斷連擊
    this.audioSynth.playWrong();

    if (!this.playerState.wrongQuestionIds.includes(q.id)) {
      this.playerState.wrongQuestionIds.push(q.id);
      this.saveState();
    }

    if (session.attempts === 1) {
      // 第一次答錯：進入 Tier 1 (題眼提示 + 50/50 排除 2 個干擾項)
      session.tierLevel = 1;
      this.eliminateDistractor(q);
      return {
        correct: false,
        tierLevel: 1,
        hint: q.guidedHints?.tier1Keyword,
        eliminatedIndices: Array.from(session.eliminatedIndices),
        canRetry: true
      };
    } else {
      // 第二次答錯：進入 Tier 2 (概念微卡片 + 傳送門)
      session.tierLevel = 2;
      return {
        correct: false,
        tierLevel: 2,
        hint: q.guidedHints?.tier2MicroConcept,
        explanation: q.explanation,
        portalBuildingId: q.guidedHints?.portalBuildingId || q.buildingId,
        canRetry: true
      };
    }
  }

  // 50/50 排除干擾項 (4選1排除2個錯誤項，留下1正1誤)
  eliminateDistractor(q) {
    const wrongOptions = [];
    q.options.forEach((opt, idx) => {
      if (idx !== q.answer && !this.currentSession.eliminatedIndices.has(idx)) {
        wrongOptions.push(idx);
      }
    });

    const shuffledWrongs = wrongOptions.sort(() => 0.5 - Math.random());
    const countToEliminate = Math.min(2, shuffledWrongs.length);
    for (let i = 0; i < countToEliminate; i++) {
      this.currentSession.eliminatedIndices.add(shuffledWrongs[i]);
    }
  }

  // 進入下一題
  nextQuestion() {
    if (!this.currentSession) return null;
    const session = this.currentSession;
    session.currentIndex++;
    session.attempts = 0;
    session.eliminatedIndices.clear();
    session.tierLevel = 0;

    return this.getCurrentQuestionView();
  }

  // 結束會話與結算
  finishSession() {
    const session = this.currentSession;
    this.audioSynth.playVictory();

    // 標記建築通關
    if (session.mode === 'building' && session.buildingId) {
      if (!this.playerState.clearedBuildings.includes(session.buildingId)) {
        this.playerState.clearedBuildings.push(session.buildingId);
        this.saveState();
      }
    }

    const summary = {
      isFinished: true,
      mode: session.mode,
      score: session.score,
      totalCount: session.questions.length,
      playerTotalStars: this.playerState.stars,
      playerTotalCoins: this.playerState.coins,
      buildingId: session.buildingId,
      subjectBreakdown: session.subjectBreakdown || null
    };

    this.currentSession = null;
    return summary;
  }
}
