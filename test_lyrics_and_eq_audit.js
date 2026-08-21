const puppeteer = require('puppeteer-core');
const path = require('path');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  console.log("🚀 Starting Synced Lyrics & Equalizer Removal Audit...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 2 });

  page.on('console', msg => console.log(`[Browser Console] ${msg.text()}`));

  console.log("Navigating to http://127.0.0.1:8080...");
  await page.goto('http://127.0.0.1:8080', { waitUntil: 'networkidle2' });
  await page.waitForFunction(() => window.JuiceEngine);

  // 1. Audit Equalizer & Visualizer Removal
  console.log("\n--- AUDIT 1: EQUALIZER & VISUALIZER REMOVAL ---");
  const eqAudit = await page.evaluate(() => {
    return {
      visualizerPillExists: !!document.querySelector('button[data-mode="visualizer"]'),
      deckBtnEqExists: !!document.getElementById('deck-btn-eq'),
      deckVisualizerDisplayExists: !!document.getElementById('deck-display-visualizer'),
      settingsEqGridExists: !!document.getElementById('settings-eq-grid'),
      modePills: Array.from(document.querySelectorAll('.deck-mode-pill')).map(p => p.innerText.trim())
    };
  });
  console.log("Equalizer removal audit results:", eqAudit);

  if (!eqAudit.visualizerPillExists && !eqAudit.deckBtnEqExists && !eqAudit.deckVisualizerDisplayExists && !eqAudit.settingsEqGridExists) {
    console.log("✅ PASS: Fake equalizer and visualizer completely eliminated from app!");
  } else {
    console.error("❌ FAIL: Fake equalizer elements still detected:", eqAudit);
  }

  // 2. Audit Synced Lyrics
  console.log("\n--- AUDIT 2: SYNCED KARAOKE LYRICS ---");
  
  // Go to Player Deck
  await page.evaluate(() => {
    const container = document.getElementById('app-container');
    if (container) container.scrollTo({ left: 430 * 2, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 400));

  // Click LYRICS mode pill
  console.log("Switching to LYRICS mode...");
  await page.click('button[data-mode="lyrics"]');

  // Wait for lyrics to fetch and render
  await page.waitForFunction(() => {
    const textEl = document.getElementById('deck-lyrics-text');
    return textEl && textEl.querySelectorAll('.lyric-line').length > 5;
  }, { timeout: 10000 });

  const lyricsCount = await page.evaluate(() => {
    return document.querySelectorAll('#deck-lyrics-text .lyric-line').length;
  });
  console.log(`✅ Loaded ${lyricsCount} synced lyric lines for Track!`);

  // Test real-time sync at t = 24.0s ("I still see your shadows in my room")
  console.log("\nSimulating playback progress to t = 24.0s...");
  const syncTest = await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent('engine:progress', { detail: { currentTime: 24.0, duration: 231 } }));
    const activeLine = document.querySelector('#deck-lyrics-text .lyric-line[style*="scale(1.04)"]') || 
                       document.querySelector('#deck-lyrics-text .lyric-line[style*="rgb(255, 255, 255)"]');
    return {
      activeText: activeLine ? activeLine.innerText.trim() : null,
      activeTime: activeLine ? activeLine.getAttribute('data-time') : null
    };
  });
  console.log("Active line at 24.0s:", syncTest);

  // Test interactive click on a lyric line (seek)
  console.log("\nTesting interactive click on lyric line...");
  const clickSeekTest = await page.evaluate(() => {
    const lines = document.querySelectorAll('#deck-lyrics-text .lyric-line');
    const targetLine = lines[6]; // Approx line 6
    if (targetLine) {
      targetLine.click();
      return {
        clickedText: targetLine.innerText.trim(),
        targetTime: targetLine.getAttribute('data-time')
      };
    }
    return null;
  });
  console.log("Clicked lyric line:", clickSeekTest);

  // Capture screenshot of the pristine lyrics view
  const screenshotPath = path.join('C:\\Users\\Admin\\.gemini\\antigravity\\brain\\205b5676-3b2c-4b5c-ad29-854059d5aebe', 'lyrics_synced_verified.png');
  await page.screenshot({ path: screenshotPath });
  console.log(`📸 Lyrics View Screenshot saved to: ${screenshotPath}`);

  await browser.close();
  console.log("\n✨ Synced Lyrics & Equalizer Removal Audit Complete!");
})();
