// certificate.js: HTML Canvas 動態合成「K-POP 出道榮譽證書」、五角能力雷達圖與心願兌換券

export class CertificateGenerator {
  static generateCertificate(canvas, summary, avatarConfig = {}) {
    const ctx = canvas.getContext('2d');
    const width = 800;
    const height = 620;
    canvas.width = width;
    canvas.height = height;

    // 1. 夢幻漸層打歌背景 (深藍夜空 + 粉紫霓虹)
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(0.5, '#1e1b4b');
    bgGrad.addColorStop(1, '#3b0764');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 金色外框與雙重鑲邊
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 6;
    ctx.strokeRect(16, 16, width - 32, height - 32);

    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 2;
    ctx.strokeRect(24, 24, width - 48, height - 48);

    // 2. 標題與裝飾星光
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 28px "Nunito", "Microsoft JhengHei", sans-serif';
    ctx.fillText('👑 108 課綱五上期中大會考 👑', width / 2, 65);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 36px "Nunito", "Microsoft JhengHei", sans-serif';
    ctx.fillText('K-POP 練習生出道評鑑成績單', width / 2, 115);

    // 出道等級計算
    const score = summary.score || 0;
    let title = '【 練舞室潛力新星 (Rising Star) 】';
    let titleColor = '#38bdf8';
    if (score >= 260) {
      title = '🏆【 頂級天團 C 位出道 (Center Ace) 】';
      titleColor = '#facc15';
    } else if (score >= 200) {
      title = '🌟【 全能領軍 ACE (All-Rounder) 】';
      titleColor = '#ec4899';
    } else if (score >= 140) {
      title = '🎤【 人氣實力主唱 (Main Vocal) 】';
      titleColor = '#a855f7';
    }

    ctx.fillStyle = titleColor;
    ctx.font = 'bold 22px "Nunito", "Microsoft JhengHei", sans-serif';
    ctx.fillText(title, width / 2, 155);

    // 3. 繪製左側五角學科能力雷達圖
    const breakdown = summary.subjectBreakdown || {
      math: { total: 3, correct: 3 },
      english: { total: 3, correct: 3 },
      science: { total: 3, correct: 3 },
      social: { total: 3, correct: 3 },
      chinese: { total: 3, correct: 3 }
    };

    const radarCenter = { x: 230, y: 320 };
    const radarRadius = 110;
    this.drawRadarChart(ctx, radarCenter, radarRadius, breakdown);

    // 4. 右側戰績摘要與獎勵說明
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px "Nunito", "Microsoft JhengHei", sans-serif';
    ctx.fillText('📊 期中考核總評：', 430, 220);

    ctx.font = '16px "Nunito", "Microsoft JhengHei", sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(`• 大會考獲得星幣: +${score} 🪙`, 440, 260);
    ctx.fillText(`• 已點亮地標建築: ${summary.playerTotalStars || 5} 棟 ⭐`, 440, 295);
    ctx.fillText(`• 題眼引導突破率: 100% (探究實踐)`, 440, 330);
    ctx.fillText(`• 學習狀態評定: 具備扎實五上高階素養`, 440, 365);

    // 5. 底部「親子心願兌換券 (Reward Coupon)」
    const couponY = 445;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.strokeStyle = '#f43f5e';
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(40, couponY, width - 80, 135);
    ctx.fillRect(40, couponY, width - 80, 135);
    ctx.setLineDash([]); // 恢復實線

    ctx.fillStyle = '#fb7185';
    ctx.font = 'bold 18px "Nunito", "Microsoft JhengHei", sans-serif';
    ctx.fillText('🎟️ 家長應援心願兌換券（可憑券向家長老師兌換一次獎勵）：', 60, couponY + 35);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '16px "Nunito", "Microsoft JhengHei", sans-serif';
    ctx.fillText('「憑本券可兌換：看卡通 20 分鐘 / 享用冰淇淋一份 / 週末公園野餐半日遊！」', 60, couponY + 70);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px "Nunito", "Microsoft JhengHei", sans-serif';
    ctx.fillText('審查認證：國小五年級 3D 知識島教研小組 簽署發行', 60, couponY + 105);
    ctx.fillText(`發行日期：${new Date().toLocaleDateString('zh-TW')}`, 560, couponY + 105);
  }

  // 繪製五角雷達圖
  static drawRadarChart(ctx, center, radius, breakdown) {
    const subjects = [
      { key: 'math', label: '數學' },
      { key: 'english', label: '英語' },
      { key: 'science', label: '自然' },
      { key: 'social', label: '社會' },
      { key: 'chinese', label: '國語' }
    ];
    const numAxes = subjects.length;
    const angleStep = (Math.PI * 2) / numAxes;

    // 繪製背景多邊形網格 (3 層)
    for (let level = 1; level <= 3; level++) {
      const r = (radius / 3) * level;
      ctx.beginPath();
      for (let i = 0; i < numAxes; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = center.x + Math.cos(angle) * r;
        const y = center.y + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // 繪製軸線與學科標籤
    ctx.font = 'bold 15px "Nunito", "Microsoft JhengHei", sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < numAxes; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = center.x + Math.cos(angle) * radius;
      const y = center.y + Math.sin(angle) * radius;

      // 軸線
      ctx.beginPath();
      ctx.moveTo(center.x, center.y);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.stroke();

      // 標籤文字 (稍微向外推)
      const lx = center.x + Math.cos(angle) * (radius + 24);
      const ly = center.y + Math.sin(angle) * (radius + 16);
      ctx.fillText(subjects[i].label, lx, ly);
    }

    // 繪製能力多邊形
    ctx.beginPath();
    subjects.forEach((subj, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const stat = breakdown[subj.key] || { total: 1, correct: 1 };
      const ratio = stat.total > 0 ? Math.max(0.4, stat.correct / stat.total) : 0.8;
      const r = radius * ratio;
      const x = center.x + Math.cos(angle) * r;
      const y = center.y + Math.sin(angle) * r;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();

    ctx.fillStyle = 'rgba(236, 72, 153, 0.45)';
    ctx.fill();
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 3;
    ctx.stroke();
  }
}
