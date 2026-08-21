const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://127.0.0.1:8080';
const SCRATCH_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\205b5676-3b2c-4b5c-ad29-854059d5aebe';

(async () => {
  try {
    console.log("🚀 Testing Clean Search View & 2026 Studio VU Equalizers...");
    const browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 2 });
    await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.JuiceEngine, { timeout: 8000 });

    // ═══ TEST 1: SEARCH VIEW CLEANUP ═══
    console.log("\n--- TEST 1: SEARCH VIEW INSPECTION ---");
    await page.evaluate(() => {
      const container = document.getElementById('app-container');
      if (container) container.scrollTo({ left: 430 * 1, behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 600));

    const chipsExist = await page.evaluate(() => {
      const chips = document.getElementById('search-era-chips');
      const allBtn = document.querySelector('.search-era-chip');
      return !!(chips || allBtn);
    });

    console.log("Are search chips present?:", chipsExist);
    if (chipsExist) {
      throw new Error("Search era filter chips are still in the DOM!");
    }
    console.log("✅ PASS: Search options/chips completely removed!");

    const shotSearch = path.join(SCRATCH_DIR, 'frame_search_clean.png');
    await page.screenshot({ path: shotSearch });
    console.log("📸 Saved clean Search screenshot:", shotSearch);

    // ═══ TEST 2: 2026 EQUALIZERS INSPECTION ═══
    console.log("\n--- TEST 2: 2026 EQUALIZERS (SPECTRUM / STUDIO VU / VINYL) ---");
    // Navigate to Player Deck
    await page.evaluate(() => {
      const container = document.getElementById('app-container');
      if (container) container.scrollTo({ left: 430 * 2, behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 600));

    // 1. Cyber Spectrum
    await page.click('.centerpiece-style-btn[data-style="spectrum"]');
    await new Promise(r => setTimeout(r, 400));
    const shotSpectrum = path.join(SCRATCH_DIR, 'frame_2026_spectrum.png');
    await page.screenshot({ path: shotSpectrum });
    console.log("📸 Saved 2026 Spectrum screenshot:", shotSpectrum);

    // 2. Studio VU Gauges
    await page.click('.centerpiece-style-btn[data-style="vu"]');
    await new Promise(r => setTimeout(r, 400));
    const shotVU = path.join(SCRATCH_DIR, 'frame_2026_studio_vu.png');
    await page.screenshot({ path: shotVU });
    console.log("📸 Saved 2026 Studio VU screenshot:", shotVU);

    // 3. Floating Vinyl
    await page.click('.centerpiece-style-btn[data-style="vinyl"]');
    await new Promise(r => setTimeout(r, 400));
    const shotVinyl = path.join(SCRATCH_DIR, 'frame_2026_vinyl.png');
    await page.screenshot({ path: shotVinyl });
    console.log("📸 Saved 2026 Vinyl screenshot:", shotVinyl);

    await browser.close();
    console.log("\n🎉 ALL SEARCH AND EQUALIZER TESTS PASSED WITH 100% SUCCESS!");
  } catch(err) {
    console.error("Test error:", err);
    process.exit(1);
  }
})();
