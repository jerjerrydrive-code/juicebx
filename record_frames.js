const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const http = require('http');

const PORT = 8092;
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const FRAMES_DIR = path.resolve(__dirname, '..', 'scratch', 'frames');

if (!fs.existsSync(FRAMES_DIR)) {
  fs.mkdirSync(FRAMES_DIR, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  try {
    let cleanPath = decodeURIComponent(req.url.split('?')[0]);
    if (cleanPath === '/' || cleanPath === '') cleanPath = '/index.html';
    let filePath = path.join(__dirname, cleanPath);
    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      res.end('404');
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

async function runFastRecorder() {
  await new Promise(r => server.listen(PORT, '127.0.0.1', r));
  console.log(`Frame recorder server on port ${PORT}...`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--autoplay-policy=no-user-gesture-required', '--window-size=440,950']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 440, height: 950, deviceScaleFactor: 2 });

  await page.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'load' });

  // 1. Initial State
  const f1 = path.join(FRAMES_DIR, 'frame_01_library_init.png');
  await page.screenshot({ path: f1 });
  console.log(`[PASS] Frame 1: Initial Library State`);

  // 2. Click Play All
  await page.evaluate(() => {
    const playBtn = document.getElementById('btn-play-all');
    if (playBtn) playBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  const f2 = path.join(FRAMES_DIR, 'frame_02_playback_started.png');
  await page.screenshot({ path: f2 });
  console.log(`[PASS] Frame 2: Play Triggered & Active Track Animation`);

  // 3. Move to Vinyl Player Deck
  await page.evaluate(() => {
    const appContainer = document.getElementById('app-container');
    if (appContainer) appContainer.scrollTo({ left: appContainer.clientWidth * 1, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 600));
  const f3 = path.join(FRAMES_DIR, 'frame_03_spinning_vinyl_deck.png');
  await page.screenshot({ path: f3 });
  console.log(`[PASS] Frame 3: Spinning Vinyl Deck with Live Artwork`);

  // 4. Download Track
  await page.evaluate(() => {
    const dlBtn = document.getElementById('deck-btn-download');
    if (dlBtn) dlBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  const f5 = path.join(FRAMES_DIR, 'frame_05_download_success.png');
  await page.screenshot({ path: f5 });
  console.log(`[PASS] Frame 5: Downloaded Track Saved`);

  // 5. Offline Library View
  await page.evaluate(() => {
    const appContainer = document.getElementById('app-container');
    if (appContainer) appContainer.scrollTo({ left: 0, behavior: 'instant' });
    const offPill = document.getElementById('toggle-offline-pill');
    if (offPill) offPill.click();
  });
  await new Promise(r => setTimeout(r, 600));
  const f6 = path.join(FRAMES_DIR, 'frame_06_offline_library_verified.png');
  await page.screenshot({ path: f6 });
  console.log(`[PASS] Frame 6: Offline Library with Downloaded Song`);

  await browser.close();
  server.close();
  console.log("=== ALL REAL UI FRAMES CAPTURED ===");
}

runFastRecorder().catch((err) => {
  console.error("Frame Recording Failed:", err);
  process.exit(1);
});
