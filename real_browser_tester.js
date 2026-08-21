const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const SCRATCH_DIR = path.resolve(__dirname, '..', 'scratch');

if (!fs.existsSync(SCRATCH_DIR)) {
  fs.mkdirSync(SCRATCH_DIR, { recursive: true });
}

async function runRealTest() {
  console.log(`Connecting to live JuiceBx server on http://127.0.0.1:${PORT}...`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=500,1000', '--hide-scrollbars']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 440, height: 950, deviceScaleFactor: 2 });

  console.log("Navigating to live app in Chrome...");
  await page.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  
  // Wait for initial tracks to populate
  await page.waitForSelector('.track-item', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 1000));

  // 1. Library Songs
  const p1 = path.join(SCRATCH_DIR, '01_library_songs_dark.png');
  await page.screenshot({ path: p1 });
  console.log(`[PASS] 01_library_songs_dark.png (${fs.statSync(p1).size} bytes)`);

  // 2. Search for Kavinsky Nightcall and play it
  console.log("Searching for Kavinsky Nightcall...");
  await page.evaluate(async () => {
    const results = await window.JuiceEngine.search('Kavinsky Nightcall');
    if (results && results.length > 0) {
      window.JuiceEngine.setQueue(results, true);
    }
  });
  await new Promise(r => setTimeout(r, 1500));

  // Slide to Deck Player
  await page.evaluate(() => {
    document.querySelector('button[data-target="view-player-deck"]').click();
  });
  await new Promise(r => setTimeout(r, 1500));

  const p3 = path.join(SCRATCH_DIR, '03_vinyl_deck_player.png');
  await page.screenshot({ path: p3 });
  console.log(`[PASS] 03_vinyl_deck_player.png (${fs.statSync(p3).size} bytes)`);

  // 3. Open Synced Lyrics for Kavinsky Nightcall
  console.log("Opening synced lyrics...");
  await page.evaluate(() => {
    document.getElementById('deck-btn-lyrics').click();
  });
  await new Promise(r => setTimeout(r, 3500));
  const p4 = path.join(SCRATCH_DIR, '04_lyrics_overlay.png');
  await page.screenshot({ path: p4 });
  console.log(`[PASS] 04_lyrics_overlay.png (${fs.statSync(p4).size} bytes)`);

  // 4. Dismiss lyrics and toggle Aurora Waveform Visualizer
  console.log("Switching to Aurora Waveform visualizer...");
  await page.evaluate(() => {
    document.getElementById('lyrics-close-btn').click();
    document.getElementById('btn-toggle-visualizer-mode').click();
  });
  await new Promise(r => setTimeout(r, 800));
  const p5 = path.join(SCRATCH_DIR, '05_aurora_waveform_visualizer.png');
  await page.screenshot({ path: p5 });
  console.log(`[PASS] 05_aurora_waveform_visualizer.png (${fs.statSync(p5).size} bytes)`);

  // 5. Explore Panel
  console.log("Navigating to Explore...");
  await page.evaluate(() => {
    document.getElementById('btn-toggle-visualizer-mode').click(); // revert visualizer
    document.querySelector('button[data-target="view-explore"]').click();
  });
  await new Promise(r => setTimeout(r, 1000));
  const p6 = path.join(SCRATCH_DIR, '06_explore_genres.png');
  await page.screenshot({ path: p6 });
  console.log(`[PASS] 06_explore_genres.png (${fs.statSync(p6).size} bytes)`);

  // 6. Settings Panel
  console.log("Navigating to Settings...");
  await page.evaluate(() => {
    document.querySelector('button[data-target="view-settings"]').click();
  });
  await new Promise(r => setTimeout(r, 1000));
  const p7 = path.join(SCRATCH_DIR, '07_settings_panel.png');
  await page.screenshot({ path: p7 });
  console.log(`[PASS] 07_settings_panel.png (${fs.statSync(p7).size} bytes)`);

  await browser.close();
  console.log("ALL REAL BROWSER TESTS COMPLETED SUCCESSFULLY!");
}

runRealTest().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
