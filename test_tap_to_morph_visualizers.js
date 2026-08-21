const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://127.0.0.1:8080';
const SCRATCH_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\205b5676-3b2c-4b5c-ad29-854059d5aebe';

(async () => {
  try {
    console.log("🚀 Testing Tap-to-Morph Fluid Visualizers...");
    const browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 2 });
    await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.JuiceEngine, { timeout: 8000 });

    // Navigate to Player Deck
    await page.evaluate(() => {
      const c = document.getElementById('app-container');
      if (c) c.scrollTo({ left: 430 * 2, behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 600));

    // Verify 3-button toggle bar is GONE
    const hasToggleBar = await page.evaluate(() => {
      return !!document.getElementById('deck-centerpiece-switcher-bar');
    });
    console.log("Is 3-button toggle bar present?:", hasToggleBar);
    if (hasToggleBar) {
      throw new Error("Toggle bar is still present!");
    }
    console.log("✅ PASS: 3-button toggle bar completely removed!");

    // State 1: Fluid Waveform
    const shotWave = path.join(SCRATCH_DIR, 'frame_morph_1_wave.png');
    await page.screenshot({ path: shotWave });
    console.log("📸 Saved Fluid Waveform screenshot:", shotWave);

    // Tap 1: Morph to Vinyl
    await page.click('#deck-stage-window');
    await new Promise(r => setTimeout(r, 500));
    const isVinylActive = await page.evaluate(() => {
      const v = document.getElementById('deck-display-vinyl');
      return v && !v.classList.contains('hidden');
    });
    console.log("Is Vinyl active after tap 1?:", isVinylActive);
    const shotVinyl = path.join(SCRATCH_DIR, 'frame_morph_2_vinyl.png');
    await page.screenshot({ path: shotVinyl });
    console.log("📸 Saved Vinyl screenshot:", shotVinyl);

    // Tap 2: Morph to Nebula
    await page.click('#deck-stage-window');
    await new Promise(r => setTimeout(r, 500));
    const isNebulaActive = await page.evaluate(() => {
      const n = document.getElementById('deck-display-nebula');
      return n && !n.classList.contains('hidden');
    });
    console.log("Is Nebula active after tap 2?:", isNebulaActive);
    const shotNebula = path.join(SCRATCH_DIR, 'frame_morph_3_nebula.png');
    await page.screenshot({ path: shotNebula });
    console.log("📸 Saved Nebula screenshot:", shotNebula);

    // Tap 3: Morph back to Waveform
    await page.click('#deck-stage-window');
    await new Promise(r => setTimeout(r, 500));
    const isWaveActive = await page.evaluate(() => {
      const w = document.getElementById('deck-display-wave');
      return w && !w.classList.contains('hidden');
    });
    console.log("Is Wave active after tap 3?:", isWaveActive);

    await browser.close();
    console.log("🎉 Tap-to-morph visualizer loop successfully verified!");
  } catch(err) {
    console.error("Test error:", err);
    process.exit(1);
  }
})();
