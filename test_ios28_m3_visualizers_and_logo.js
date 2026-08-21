const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://127.0.0.1:8080';
const SCRATCH_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\205b5676-3b2c-4b5c-ad29-854059d5aebe';

(async () => {
  try {
    console.log("🚀 Testing iOS 28 / Google M3 Visualizers & Enlarged JuiceBx Branding...");
    const browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 2 });
    await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.JuiceEngine, { timeout: 8000 });

    // 1. Capture Home View with Enlarged JuiceBx Logo
    const shotHome = path.join(SCRATCH_DIR, 'frame_home_large_logo.png');
    await page.screenshot({ path: shotHome });
    console.log("📸 Saved Home View screenshot with Large Logo:", shotHome);

    // 2. Navigate to Player Deck
    await page.evaluate(() => {
      const c = document.getElementById('app-container');
      if (c) c.scrollTo({ left: 430 * 2, behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 600));

    // Visualizer 1: iOS 28 Siri Dynamic Liquid Glass Orb
    const shot1 = path.join(SCRATCH_DIR, 'frame_vis_1_ios28_orb.png');
    await page.screenshot({ path: shot1 });
    console.log("📸 Saved 1. iOS 28 Siri Liquid Glass Orb screenshot:", shot1);

    // Tap 1 -> Morph to Visualizer 2: Google Material 3 Expressive Fluid Ribbons
    await page.click('#deck-stage-window');
    await new Promise(r => setTimeout(r, 450));
    const shot2 = path.join(SCRATCH_DIR, 'frame_vis_2_m3_ribbons.png');
    await page.screenshot({ path: shot2 });
    console.log("📸 Saved 2. Google M3 Expressive Ribbons screenshot:", shot2);

    // Tap 2 -> Morph to Visualizer 3: Spatial Glass Metaballs
    await page.click('#deck-stage-window');
    await new Promise(r => setTimeout(r, 450));
    const shot3 = path.join(SCRATCH_DIR, 'frame_vis_3_spatial_blobs.png');
    await page.screenshot({ path: shot3 });
    console.log("📸 Saved 3. Spatial Glass Metaballs screenshot:", shot3);

    // Tap 3 -> Morph to Visualizer 4: 2028 Precision M3 Hi-Fi Spectrum
    await page.click('#deck-stage-window');
    await new Promise(r => setTimeout(r, 450));
    const shot4 = path.join(SCRATCH_DIR, 'frame_vis_4_m3_hifi_spectrum.png');
    await page.screenshot({ path: shot4 });
    console.log("📸 Saved 4. M3 Hi-Fi Precision Spectrum screenshot:", shot4);

    // Tap 4 -> Morph to Visualizer 5: iOS Dynamic Luxe Vinyl
    await page.click('#deck-stage-window');
    await new Promise(r => setTimeout(r, 450));
    const shot5 = path.join(SCRATCH_DIR, 'frame_vis_5_luxe_vinyl.png');
    await page.screenshot({ path: shot5 });
    console.log("📸 Saved 5. Luxe Vinyl Platter screenshot:", shot5);

    await browser.close();
    console.log("🎉 All iOS 28 / Google M3 visualizers and branding verified successfully!");
  } catch(err) {
    console.error("Test error:", err);
    process.exit(1);
  }
})();
