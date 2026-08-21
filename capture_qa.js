const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

const PORT = 8080;
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const SCRATCH_DIR = path.resolve(__dirname, '..', 'scratch');

if (!fs.existsSync(SCRATCH_DIR)) {
  fs.mkdirSync(SCRATCH_DIR, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

// Start in-process server to guarantee 100% liveness
const server = http.createServer((req, res) => {
  try {
    let cleanPath = decodeURIComponent(req.url.split('?')[0]);
    if (cleanPath === '/' || cleanPath === '') cleanPath = '/index.html';
    let filePath = path.join(__dirname, cleanPath);
    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      res.end('404 Not Found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const data = fs.readFileSync(filePath);
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(data);
  } catch (err) {
    res.writeHead(500);
    res.end(err.message);
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`QA Server ready on http://127.0.0.1:${PORT}`);
  
  try {
    const outHome = path.join(SCRATCH_DIR, 'qa_real_home.png');
    console.log("Capturing Chrome headless screenshot of Library...");
    execSync(`"${CHROME_PATH}" --headless=new --screenshot="${outHome}" --window-size=440,950 --virtual-time-budget=3000 "http://127.0.0.1:${PORT}"`, { stdio: 'inherit' });

    if (fs.existsSync(outHome)) {
      const stats = fs.statSync(outHome);
      console.log(`SUCCESS: Captured ${outHome} (${stats.size} bytes)`);
    }
  } catch (e) {
    console.error("Capture Error:", e.message);
  } finally {
    server.close();
    process.exit(0);
  }
});
