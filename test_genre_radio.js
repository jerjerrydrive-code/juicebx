const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const SCRATCH_DIR = path.resolve(__dirname, '..', 'scratch');

async function testGenreRadio() {
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

  // 1. Switch to Genres Tab in Library
  console.log("Switching to Genres Tab in Library...");
  await page.evaluate(() => {
    document.querySelector('button[data-tab="genres"]').click();
  });
  await new Promise(r => setTimeout(r, 800));

  const p1 = path.join(SCRATCH_DIR, '15_library_genres_radio_grid.png');
  await page.screenshot({ path: p1 });
  console.log(`[PASS] 15_library_genres_radio_grid.png (${fs.statSync(p1).size} bytes)`);

  // 2. Launch Synthwave Radio — Run 1
  console.log("Launching Synthwave Radio (Run 1)...");
  const run1Queue = await page.evaluate(async () => {
    const q = await window.launchGenreRadio('Synthwave');
    return {
      count: q.length,
      first3: q.slice(0, 3).map(t => t.title),
      isPlaying: window.JuiceEngine.getState().isPlaying
    };
  });
  console.log("Run 1 Result:", JSON.stringify(run1Queue, null, 2));

  await new Promise(r => setTimeout(r, 1500));
  const p2 = path.join(SCRATCH_DIR, '16_genre_radio_playing_deck.png');
  await page.screenshot({ path: p2 });
  console.log(`[PASS] 16_genre_radio_playing_deck.png (${fs.statSync(p2).size} bytes)`);

  // 3. Launch Synthwave Radio — Run 2 (verifying different shuffle order)
  console.log("Launching Synthwave Radio (Run 2 — verifying different shuffle order)...");
  const run2Queue = await page.evaluate(async () => {
    const q = await window.launchGenreRadio('Synthwave');
    return {
      count: q.length,
      first3: q.slice(0, 3).map(t => t.title)
    };
  });
  console.log("Run 2 Result:", JSON.stringify(run2Queue, null, 2));

  const isDifferent = JSON.stringify(run1Queue.first3) !== JSON.stringify(run2Queue.first3);
  console.log(`[VERIFIED] Run 1 and Run 2 have distinct shuffled order: ${isDifferent}`);

  if (!isDifferent) {
    console.error("Shuffle verification failed: order was identical.");
    process.exit(1);
  }

  await browser.close();
  console.log("ALL GENRE RADIO AND DYNAMIC SHUFFLE TESTS COMPLETED SUCCESSFULLY!");
}

testGenreRadio().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
