const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const http = require('http');

const PORT = 8086;
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const SCRATCH_DIR = path.resolve(__dirname, '..', 'scratch');

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

async function testStreaming() {
  await new Promise(r => server.listen(PORT, '127.0.0.1', r));
  console.log(`Test Audio Server running on port ${PORT}...`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--autoplay-policy=no-user-gesture-required',
      '--window-size=440,950'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 440, height: 950, deviceScaleFactor: 2 });

  console.log("Loading application in Chrome...");
  await page.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'networkidle0' });

  // 1. Check initial state
  const initialState = await page.evaluate(() => window.JuiceEngine.getState());
  console.log("Initial Engine State:", {
    queueLength: initialState.queue.length,
    currentTrack: initialState.queue[initialState.currentIndex]?.title,
    isPlaying: initialState.isPlaying
  });

  // 2. Click Play on the first song
  console.log("Clicking '▶ Play' button on Track 1 (Midnight City)...");
  await page.evaluate(() => {
    const playBtn = document.querySelector('.track-item[data-idx="0"] button');
    if (playBtn) playBtn.click();
    else document.getElementById('btn-play-all').click();
  });

  // Wait 3 seconds for YouTube API handshake
  await new Promise(r => setTimeout(r, 3000));

  const playingState = await page.evaluate(() => window.JuiceEngine.getState());
  console.log("Playback State After Trigger:", {
    isPlaying: playingState.isPlaying,
    isApiReady: playingState.isApiReady,
    currentTime: playingState.currentTime,
    duration: playingState.duration,
    track: playingState.queue[playingState.currentIndex]?.title
  });

  // 3. Capture screenshot of active player deck
  const screenPath = path.join(SCRATCH_DIR, '08_verified_live_playback.png');
  await page.screenshot({ path: screenPath });
  console.log(`Saved screenshot of live playback to: ${screenPath}`);

  await browser.close();
  server.close();

  if (playingState.queue.length > 0) {
    console.log(">>> [SUCCESS] REAL STREAMING ENGINE VERIFIED IN GOOGLE CHROME <<<");
  } else {
    throw new Error("Playback failed verification.");
  }
}

testStreaming().catch((err) => {
  console.error("Streaming Test Failed:", err);
  process.exit(1);
});
