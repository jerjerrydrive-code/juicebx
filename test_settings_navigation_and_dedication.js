const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://127.0.0.1:8080';
const SCRATCH_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\205b5676-3b2c-4b5c-ad29-854059d5aebe';

(async () => {
  try {
    console.log("🚀 Testing Settings Stability & Final 999 Dedication Sanctuary...");
    const browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 2 });
    await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.JuiceEngine, { timeout: 8000 });

    // 1. Navigate to Settings (Panel 4)
    await page.click('button[data-target="view-settings"]');
    await new Promise(r => setTimeout(r, 600));

    let currentPanel = await page.evaluate(() => {
      const c = document.getElementById('app-container');
      return Math.round(c.scrollLeft / c.clientWidth);
    });
    console.log("Current panel index after clicking settings:", currentPanel);
    if (currentPanel !== 4) {
      throw new Error(`Expected panel 4 (Settings), got ${currentPanel}`);
    }

    // 2. Click play/pause on the mini-player while in Settings
    const hasMiniPlay = await page.evaluate(() => !!document.getElementById('mini-play-btn'));
    if (hasMiniPlay) {
      await page.click('#mini-play-btn');
      await new Promise(r => setTimeout(r, 500));

      currentPanel = await page.evaluate(() => {
        const c = document.getElementById('app-container');
        return Math.round(c.scrollLeft / c.clientWidth);
      });
      console.log("Current panel index after clicking mini play button:", currentPanel);
      if (currentPanel !== 4) {
        throw new Error(`Auto-scroll bug detected! User was pulled from Settings (4) to panel ${currentPanel}`);
      }
      console.log("✅ PASS: Mini play button did NOT yank user out of Settings!");
    }

    // 3. Capture screenshot of Settings View
    const shotSettings = path.join(SCRATCH_DIR, 'frame_settings_stable.png');
    await page.screenshot({ path: shotSettings });
    console.log("📸 Saved Settings screenshot:", shotSettings);

    // 4. Open 999 Dedication Sanctuary Modal
    await page.click('#settings-tribute-link');
    await new Promise(r => setTimeout(r, 600));

    const shotSanctuary = path.join(SCRATCH_DIR, 'frame_dedication_final_rose_heart.png');
    await page.screenshot({ path: shotSanctuary });
    console.log("📸 Saved Final Dedication Sanctuary screenshot:", shotSanctuary);

    // Verify emblem src in modal
    const emblemSrc = await page.evaluate(() => {
      const modal = document.getElementById('modal-999-tribute');
      const img = modal ? modal.querySelector('img') : null;
      return img ? img.getAttribute('src') : null;
    });
    console.log("Dedication Emblem src:", emblemSrc);
    if (emblemSrc !== '999_rose_heart_logo.png' && emblemSrc !== '999_rose_heart_logo.jpg') {
      throw new Error(`Expected 999_rose_heart_logo, got ${emblemSrc}`);
    }

    await browser.close();
    console.log("🎉 Settings stability and final dedication sanctuary verified successfully!");
  } catch(err) {
    console.error("Test error:", err);
    process.exit(1);
  }
})();
