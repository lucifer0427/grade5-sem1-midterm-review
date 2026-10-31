import sys
import os
import http.server
import socketserver
import threading
import time
import subprocess
import re

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT_DIR)

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

httpd = socketserver.TCPServer(('127.0.0.1', 0), QuietHandler)
PORT = httpd.server_address[1]
t = threading.Thread(target=httpd.serve_forever)
t.daemon = True
t.start()

time.sleep(1)

# 測試用 HTML: 監聽 exam-ready 後觸發大會考
test_html_path = os.path.join(ROOT_DIR, 'test_runner.html')
with open(os.path.join(ROOT_DIR, 'index.html'), 'r', encoding='utf-8') as f:
    content = f.read()

inject_script = """
<script>
  let executed = false;
  function triggerExamTest() {
    if (executed) return;
    if (window.reviewApp && window.reviewApp.quizEngine) {
      executed = true;
      console.log('正在觸發大會考按鈕點擊...');
      const btn = document.getElementById('btn-grand-exam');
      if (btn) btn.click();
      setTimeout(() => {
        const qBox = document.getElementById('quiz-question');
        const opts = document.querySelectorAll('.quiz-opt-btn');
        const modal = document.getElementById('quiz-modal');
        const testRes = document.createElement('div');
        testRes.id = 'e2e-result';
        testRes.dataset.modalHidden = modal ? modal.classList.contains('hidden') : true;
        testRes.dataset.questionText = qBox ? qBox.textContent.trim() : '';
        testRes.dataset.optionsCount = opts ? opts.length : 0;
        document.body.appendChild(testRes);
      }, 500);
    } else {
      setTimeout(triggerExamTest, 150);
    }
  }
  window.addEventListener('exam-ready', triggerExamTest);
  setTimeout(triggerExamTest, 300);
</script>
"""
modified_html = content.replace('</body>', inject_script + '</body>')
with open(test_html_path, 'w', encoding='utf-8') as f:
    f.write(modified_html)

cmd = [
    r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
    '--headless',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    '--dump-dom',
    '--virtual-time-budget=10000',
    f'http://localhost:{PORT}/test_runner.html'
]

res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
html = res.stdout.decode('utf-8', errors='ignore')

if os.path.exists(test_html_path):
    os.remove(test_html_path)

if '<div id="e2e-result"' in html:
    idx = html.find('<div id="e2e-result"')
    tag_str = html[idx:idx+300]
    m_hidden = re.search(r'data-modal-hidden="([^"]*)"', tag_str)
    m_q = re.search(r'data-question-text="([^"]*)"', tag_str)
    m_opt = re.search(r'data-options-count="([^"]*)"', tag_str)
    if m_hidden and m_q and m_opt:
        print(f"✅ 題目彈窗是否隱藏: {m_hidden.group(1)} (false 表示彈窗已成功彈出)")
        print(f"✅ 成功渲染題目內容: {m_q.group(1)[:40]}...")
        print(f"✅ 成功渲染選項數量: {m_opt.group(1)} 個選項")
    else:
        print("❌ 部分屬性未能提取")
else:
    print("❌ 未抓取到 <div id=\"e2e-result\">")

httpd.shutdown()
