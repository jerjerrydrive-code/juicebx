const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://127.0.0.1:8080';
const SCRATCH_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\205b5676-3b2c-4b5c-ad29-854059d5aebe';

(async () => {
  try {
    console.log("🔍 Starting Pixel-by-Pixel Visual Audit across all 5 Panels & Modals...");
    const browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 2 });
    await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.JuiceEngine, { timeout: 8000 });

    const scrollContainer = async (panelIndex) => {
      await page.evaluate((idx) => {
        const c = document.getElementById('app-container');
        if (c) c.scrollTo({ left: idx * c.clientWidth, behavior: 'instant' });
      }, panelIndex);
      await new Promise(r => setTimeout(r, 400));
    };

    // 1. Panel 0: Home / Top 100 Shuffles
    await scrollContainer(0);
    const shot0 = path.join(SCRATCH_DIR, 'audit_panel_0_home.png');
    await page.screenshot({ path: shot0 });
    console.log("📸 1/8 Panel 0: Home captured");

    // 2. Panel 1: Search
    await scrollContainer(1);
    const shot1 = path.join(SCRATCH_DIR, 'audit_panel_1_search.png');
    await page.screenshot({ path: shot1 });
    console.log("📸 2/8 Panel 1: Search captured");

    // 3. Panel 2: Player Deck (Song Mode)
    await scrollContainer(2);
    const shot2 = path.join(SCRATCH_DIR, 'audit_panel_2_player.png');
    await page.screenshot({ path: shot2 });
    console.log("📸 3/8 Panel 2: Player Deck captured");

    // 4. Panel 2: Video Mode
    await page.click('.deck-mode-pill[data-mode="video"]');
    await new Promise(r => setTimeout(r, 300));
    const shot2Vid = path.join(SCRATCH_DIR, 'audit_panel_2_video.png');
    await page.screenshot({ path: shot2Vid });
    console.log("📸 4/8 Panel 2: Video Mode captured");

    // 5. Panel 2: Lyrics Mode
    await page.click('.deck-mode-pill[data-mode="lyrics"]');
    await new Promise(r => setTimeout(r, 300));
    const shot2Lyr = path.join(SCRATCH_DIR, 'audit_panel_2_lyrics.png');
    await page.screenshot({ path: shot2Lyr });
    console.log("📸 5/8 Panel 2: Lyrics Mode captured");

    // Return to Song mode
    await page.click('.deck-mode-pill[data-mode="vinyl"]');
    await new Promise(r => setTimeout(r, 200));

    // 6. Panel 3: Library
    await scrollContainer(3);
    const shot3 = path.join(SCRATCH_DIR, 'audit_panel_3_library.png');
    await page.screenshot({ path: shot3 });
    console.log("📸 6/8 Panel 3: Library captured");

    // 7. Panel 4: Settings
    await scrollContainer(4);
    const shot4 = path.join(SCRATCH_DIR, 'audit_panel_4_settings.png');
    await page.screenshot({ path: shot4 });
    console.log("📸 7/8 Panel 4: Settings captured");

    // 8. 999 Memorial Tribute Sacred Sanctuary Modal
    await page.evaluate(() => {
      const modal = document.getElementById('modal-999-tribute');
      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.remove('opacity-0');
      }
    });
    await new Promise(r => setTimeout(r, 400));
    const shotSanctuary = path.join(SCRATCH_DIR, 'audit_modal_sanctuary.png');
    await page.screenshot({ path: shotSanctuary });
    console.log("📸 8/8 Modal: 999 Sanctuary captured");

    await browser.close();
    console.log("🎉 Complete pixel-audit screenshots captured successfully!");
  } catch(err) {
    console.error("Audit error:", err);
    process.exit(1);
  }
})();
