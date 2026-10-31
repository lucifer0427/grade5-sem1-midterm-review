import http.server
import socketserver
import threading
import time
import subprocess
import re
import os
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass

class S(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True

srv = S(('127.0.0.1', 0), H)
port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()

with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

inject = '''<script>
let measured = false;
function doMeasure() {
    if (measured) return;
    if (window.reviewApp && window.reviewApp.renderer) {
        measured = true;
        setTimeout(() => {
            window.reviewApp.renderer.render(window.reviewApp.scene, window.reviewApp.camera);
            const d = document.createElement('div');
            d.id = 'draw-calls-res';
            d.dataset.calls = window.reviewApp.renderer.info.render.calls;
            d.dataset.triangles = window.reviewApp.renderer.info.render.triangles;
            document.body.appendChild(d);
        }, 800);
    } else {
        setTimeout(doMeasure, 100);
    }
}
window.addEventListener('exam-ready', doMeasure);
setTimeout(doMeasure, 300);
</script>'''

test_file = 'test_calls.html'
with open(test_file, 'w', encoding='utf-8') as f:
    f.write(c.replace('</body>', inject + '</body>'))

cmd = [
    r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
    '--headless=new',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    '--dump-dom',
    '--virtual-time-budget=10000',
    f'http://localhost:{port}/{test_file}'
]
res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
html = res.stdout.decode('utf-8', errors='ignore')

if os.path.exists(test_file):
    os.remove(test_file)
srv.shutdown()

m = re.search(r'id="draw-calls-res" data-calls="(\d+)" data-triangles="(\d+)"', html)
if m:
    print(f"📊 實際 Draw calls: {m.group(1)}, 繪製三角形數: {m.group(2)}")
else:
    print("未抓取到 draw calls")
    if 'debug-error-box' in html:
        idx = html.find('debug-error-box')
        print("瀏覽器報錯:", html[idx:idx+400])
    else:
        print("DOM 末端摘要:", html[-500:])
