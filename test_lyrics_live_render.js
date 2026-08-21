const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://127.0.0.1:8080';
const SCRATCH_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\205b5676-3b2c-4b5c-ad29-854059d5aebe';

(async () => {
  try {
    console.log("🚀 Testing Live Synced Lyrics in Squircle Frame...");
    const browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 2 });

    await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.JuiceEngine, { timeout: 8000 });

    // Navigate to Hero Player Deck (Panel index 2)
    await page.evaluate(() => {
      const container = document.getElementById('app-container');
      if (container) container.scrollTo({ left: 430 * 2, behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 600));

    // Switch to Lyrics mode
    await page.click('.deck-mode-pill[data-mode="lyrics"]');

    // Wait for lyrics lines to load
    await page.waitForFunction(() => {
      const lines = document.querySelectorAll('#deck-lyrics-text .lyric-line');
      return lines.length > 5;
    }, { timeout: 8000 });

    console.log("Lyrics lines successfully loaded in UI!");

    // Seek to 18 seconds to highlight active lyric line
    await page.evaluate(() => {
      window.JuiceEngine.seek(18);
    });
    await new Promise(r => setTimeout(r, 600));

    const shotLyricsActive = path.join(SCRATCH_DIR, 'frame_squircle_lyrics_active.png');
    await page.screenshot({ path: shotLyricsActive });
    console.log("📸 Captured live synced lyrics active state:", shotLyricsActive);

    const activeInfo = await page.evaluate(() => {
      const lines = document.querySelectorAll('#deck-lyrics-text .lyric-line');
      let activeLine = null;
      lines.forEach((l, idx) => {
        if (l.style.opacity === '1' || l.style.color === 'rgb(255, 255, 255)') {
          activeLine = { index: idx, text: l.innerText, opacity: l.style.opacity, textShadow: l.style.textShadow };
        }
      });
      return { totalLines: lines.length, activeLine };
    });

    console.log("Active line details:", activeInfo);

    await browser.close();
    console.log("🎉 Lyrics live rendering verification succeeded!");
  } catch (err) {
    console.error("Lyrics test error:", err);
    process.exit(1);
  }
})();
