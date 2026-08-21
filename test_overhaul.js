const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const SCRATCH_DIR = path.resolve(__dirname, '..', 'scratch');

async function testOverhaul() {
  console.log(`Connecting to live JuiceBx server on http://127.0.0.1:${PORT}...`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=500,1000', '--hide-scrollbars']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 440, height: 950, deviceScaleFactor: 2 });

  await page.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForSelector('.track-item', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 1000));

  // 1. Capture Library with Default Tracks
  console.log("Capturing 17_overhaul_library.png...");
  const p1 = path.join(SCRATCH_DIR, '17_overhaul_library.png');
  await page.screenshot({ path: p1 });
  console.log(`[PASS] 17_overhaul_library.png (${fs.statSync(p1).size} bytes)`);

  // 2. Navigate to Unified Player Deck in Dark Mode
  console.log("Navigating to Player Deck (Dark Mode)...");
  await page.evaluate(() => {
    document.querySelector('button[data-target="view-player-deck"]').click();
  });
  await new Promise(r => setTimeout(r, 1000));

  const p2 = path.join(SCRATCH_DIR, '18_overhaul_player_deck_dark.png');
  await page.screenshot({ path: p2 });
  console.log(`[PASS] 18_overhaul_player_deck_dark.png (${fs.statSync(p2).size} bytes)`);

  // 3. Switch to Light Mode and capture Player Deck
  console.log("Switching to Light Mode...");
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  });
  await new Promise(r => setTimeout(r, 800));

  const p3 = path.join(SCRATCH_DIR, '19_overhaul_player_deck_light.png');
  await page.screenshot({ path: p3 });
  console.log(`[PASS] 19_overhaul_player_deck_light.png (${fs.statSync(p3).size} bytes)`);

  // 4. Test Inline Lyrics Mode
  console.log("Switching to Lyrics Pill...");
  await page.evaluate(() => {
    document.querySelector('button[data-mode="lyrics"]').click();
  });
  await new Promise(r => setTimeout(r, 1500));

  const p4 = path.join(SCRATCH_DIR, '20_overhaul_lyrics_mode.png');
  await page.screenshot({ path: p4 });
  console.log(`[PASS] 20_overhaul_lyrics_mode.png (${fs.statSync(p4).size} bytes)`);

  await browser.close();
  console.log("ALL OVERHAUL VERIFICATION TESTS COMPLETED SUCCESSFULLY!");
}

testOverhaul().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
