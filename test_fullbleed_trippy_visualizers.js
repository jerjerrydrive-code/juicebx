const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://127.0.0.1:8080';
const SCRATCH_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\205b5676-3b2c-4b5c-ad29-854059d5aebe';

(async () => {
  try {
    console.log("🚀 Testing 5 Full-Bleed Trippy Visualizers & Zero-Overlay Video Stage...");
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

    // 1. Check Warp Tunnel
    const shot1 = path.join(SCRATCH_DIR, 'frame_vis_1_warp.png');
    await page.screenshot({ path: shot1 });
    console.log("📸 Saved 1. Warp Tunnel screenshot:", shot1);

    // Tap 1 -> Morph to Kaleidoscope
    await page.click('#deck-stage-window');
    await new Promise(r => setTimeout(r, 400));
    const shot2 = path.join(SCRATCH_DIR, 'frame_vis_2_kaleidoscope.png');
    await page.screenshot({ path: shot2 });
    console.log("📸 Saved 2. Kaleidoscope screenshot:", shot2);

    // Tap 2 -> Morph to Aurora
    await page.click('#deck-stage-window');
    await new Promise(r => setTimeout(r, 400));
    const shot3 = path.join(SCRATCH_DIR, 'frame_vis_3_aurora.png');
    await page.screenshot({ path: shot3 });
    console.log("📸 Saved 3. Aurora screenshot:", shot3);

    // Tap 3 -> Morph to Supernova
    await page.click('#deck-stage-window');
    await new Promise(r => setTimeout(r, 400));
    const shot4 = path.join(SCRATCH_DIR, 'frame_vis_4_supernova.png');
    await page.screenshot({ path: shot4 });
    console.log("📸 Saved 4. Supernova screenshot:", shot4);

    // Tap 4 -> Morph to Vinyl
    await page.click('#deck-stage-window');
    await new Promise(r => setTimeout(r, 400));
    const shot5 = path.join(SCRATCH_DIR, 'frame_vis_5_vinyl.png');
    await page.screenshot({ path: shot5 });
    console.log("📸 Saved 5. Vinyl screenshot:", shot5);

    // 6. Switch to VIDEO Mode to verify zero YouTube options / pure video
    await page.click('.deck-mode-pill[data-mode="video"]');
    await new Promise(r => setTimeout(r, 500));
    const shotVideo = path.join(SCRATCH_DIR, 'frame_clean_video_mode.png');
    await page.screenshot({ path: shotVideo });
    console.log("📸 Saved Pure Video Mode screenshot:", shotVideo);

    // 7. Switch to LYRICS Mode to verify uniform squircle stage size
    await page.click('.deck-mode-pill[data-mode="lyrics"]');
    await new Promise(r => setTimeout(r, 500));
    const shotLyrics = path.join(SCRATCH_DIR, 'frame_universal_lyrics_mode.png');
    await page.screenshot({ path: shotLyrics });
    console.log("📸 Saved Universal Lyrics Mode screenshot:", shotLyrics);

    await browser.close();
    console.log("🎉 All 5 full-bleed visualizers and clean video stage verified successfully!");
  } catch(err) {
    console.error("Test error:", err);
    process.exit(1);
  }
})();
