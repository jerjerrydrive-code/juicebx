const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const SCRATCH_DIR = path.resolve(__dirname, '..', 'scratch');

async function testExpandedDeck() {
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

  // Search Kavinsky Nightcall & Play
  console.log("Playing Kavinsky Nightcall...");
  await page.evaluate(async () => {
    const results = await window.JuiceEngine.search('Kavinsky Nightcall');
    if (results && results.length > 0) {
      window.JuiceEngine.setQueue(results, true);
    }
    // Navigate to Player Deck (Panel 1)
    document.querySelector('button[data-target="view-player-deck"]').click();
  });
  await new Promise(r => setTimeout(r, 1500));

  // 1. Subpage 0: Pure Hero Vinyl
  console.log("Capturing Subpage 0: Pure Hero Vinyl...");
  const p1 = path.join(SCRATCH_DIR, '12_deck_subpage_vinyl.png');
  await page.screenshot({ path: p1 });
  console.log(`[PASS] 12_deck_subpage_vinyl.png (${fs.statSync(p1).size} bytes)`);

  // 2. Subpage 1: Studio Controls
  console.log("Clicking CONTROLS tab (Subpage 1)...");
  await page.evaluate(() => {
    document.querySelector('button[data-deck-page="1"]').click();
  });
  await new Promise(r => setTimeout(r, 1000));

  const p2 = path.join(SCRATCH_DIR, '13_deck_subpage_controls.png');
  await page.screenshot({ path: p2 });
  console.log(`[PASS] 13_deck_subpage_controls.png (${fs.statSync(p2).size} bytes)`);

  // 3. Subpage 2: Synced Lyrics
  console.log("Clicking LYRICS tab (Subpage 2)...");
  await page.evaluate(() => {
    document.querySelector('button[data-deck-page="2"]').click();
  });
  await page.waitForSelector('#deck-lyrics-text .lyric-line', { timeout: 12000 });
  await new Promise(r => setTimeout(r, 500));

  const p3 = path.join(SCRATCH_DIR, '14_deck_subpage_lyrics.png');
  await page.screenshot({ path: p3 });
  console.log(`[PASS] 14_deck_subpage_lyrics.png (${fs.statSync(p3).size} bytes)`);

  await browser.close();
  console.log("ALL EXPANDED DECK SUBPAGE TESTS COMPLETED SUCCESSFULLY!");
}

testExpandedDeck().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
