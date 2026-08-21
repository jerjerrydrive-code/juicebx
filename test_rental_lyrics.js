const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://127.0.0.1:8080';
const SCRATCH_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\205b5676-3b2c-4b5c-ad29-854059d5aebe';

(async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 2 });
    await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.JuiceEngine, { timeout: 8000 });

    // Queue Rental and jump to Player Deck
    await page.evaluate(() => {
      window.JuiceEngine.setQueue([{ id: 'UlRQOU0qjOY', title: 'Rental', artist: 'Juice WRLD', duration: '4:13' }], true);
      const c = document.getElementById('app-container');
      if (c) c.scrollTo({ left: 430 * 2, behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 600));

    // Switch to lyrics mode
    await page.click('.deck-mode-pill[data-mode="lyrics"]');

    // Wait for lyrics lines to load from juicewrldapi.com
    await page.waitForFunction(() => {
      const lines = document.querySelectorAll('#deck-lyrics-text .lyric-line');
      return lines.length > 5;
    }, { timeout: 8000 });

    console.log("✅ Successfully loaded Rental synced lyrics from juicewrldapi.com!");

    // Seek to 10 seconds
    await page.evaluate(() => window.JuiceEngine.seek(10));
    await new Promise(r => setTimeout(r, 600));

    const shotRental = path.join(SCRATCH_DIR, 'frame_rental_synced_lyrics.png');
    await page.screenshot({ path: shotRental });
    console.log("📸 Saved Rental lyrics screenshot:", shotRental);

    await browser.close();
  } catch (e) {
    console.error("Test error:", e);
    process.exit(1);
  }
})();
