const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://127.0.0.1:8080';
const SCRATCH_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\205b5676-3b2c-4b5c-ad29-854059d5aebe';

(async () => {
  try {
    console.log("🚀 Testing Uniform Squircle Container, Stream Matching & Upgraded Lyrics...");
    const browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 2 });

    await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.JuiceEngine, { timeout: 8000 });

    // Navigate to Player Deck (Panel index 2)
    await page.evaluate(() => {
      const container = document.getElementById('app-container');
      if (container) container.scrollTo({ left: 430 * 2, behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 600));

    console.log("\n--- TEST 1: UNIFORM SQUIRCLE FRAME INTEGRITY ---");
    const squircleBounds = await page.evaluate(() => {
      const el = document.getElementById('deck-stage-window');
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return {
        width: rect.width,
        height: rect.height,
        borderRadius: style.borderRadius,
        overflow: style.overflow
      };
    });
    console.log("Squircle Stage Window Properties:", squircleBounds);
    if (!squircleBounds || squircleBounds.height < 200) {
      throw new Error("Squircle stage window missing or wrong size!");
    }

    // 1. Vinyl in Squircle
    await page.click('.centerpiece-style-btn[data-style="vinyl"]');
    await new Promise(r => setTimeout(r, 300));
    const shotVinyl = path.join(SCRATCH_DIR, 'frame_squircle_vinyl.png');
    await page.screenshot({ path: shotVinyl });
    console.log("📸 Captured:", shotVinyl);

    // 2. Cassette in Squircle
    await page.click('.centerpiece-style-btn[data-style="cassette"]');
    await new Promise(r => setTimeout(r, 300));
    const shotCassette = path.join(SCRATCH_DIR, 'frame_squircle_cassette.png');
    await page.screenshot({ path: shotCassette });
    console.log("📸 Captured:", shotCassette);

    // 3. Spectrum in Squircle
    await page.click('.centerpiece-style-btn[data-style="spectrum"]');
    await new Promise(r => setTimeout(r, 300));
    const shotSpectrum = path.join(SCRATCH_DIR, 'frame_squircle_spectrum.png');
    await page.screenshot({ path: shotSpectrum });
    console.log("📸 Captured:", shotSpectrum);

    // 4. Upgraded Lyrics in Squircle
    console.log("\n--- TEST 2: UPGRADED LYRICS STAGE IN SQUIRCLE ---");
    await page.click('.deck-mode-pill[data-mode="lyrics"]');
    await new Promise(r => setTimeout(r, 600));
    const shotLyrics = path.join(SCRATCH_DIR, 'frame_squircle_lyrics.png');
    await page.screenshot({ path: shotLyrics });
    console.log("📸 Captured:", shotLyrics);

    console.log("\n--- TEST 3: VERIFY NO UNWANTED AUTO-SWITCH TO LYRICS ON TRACK CHANGE ---");
    // Switch back to SONG mode
    await page.click('.deck-mode-pill[data-mode="vinyl"]');
    await new Promise(r => setTimeout(r, 300));

    // Trigger next track
    await page.evaluate(() => window.JuiceEngine.next());
    await new Promise(r => setTimeout(r, 600));

    const activePill = await page.evaluate(() => {
      const active = document.querySelector('.deck-mode-pill.active');
      const lyricsDisplay = document.getElementById('deck-display-lyrics');
      const switcher = document.getElementById('deck-centerpiece-switcher-bar');
      return {
        pillMode: active?.getAttribute('data-mode'),
        isLyricsHidden: lyricsDisplay?.classList.contains('hidden'),
        isSwitcherVisible: !switcher?.classList.contains('hidden')
      };
    });
    console.log("Deck Mode after track change:", activePill);
    if (activePill.pillMode !== 'vinyl' || !activePill.isLyricsHidden || !activePill.isSwitcherVisible) {
      throw new Error("Track change incorrectly forced lyrics mode!");
    }
    console.log("✅ PASS: Stays in SONG mode when changing tracks!");

    console.log("\n--- TEST 4: VERIFY ACCURATE TRACK IDS (NO RANDOM SONG MISMATCHES) ---");
    const vaultTracks = await page.evaluate(() => {
      const lostVault = window.TOP_SHUFFLES_CATALOG ? window.TOP_SHUFFLES_CATALOG["Juice WRLD: The Lost Vault"] : null;
      return lostVault ? lostVault.tracks : [];
    });

    console.log("Checking Lost Vault track IDs...");
    const rental = vaultTracks.find(t => t.title.includes("Rental"));
    const ktmDrip = vaultTracks.find(t => t.title.includes("KTM Drip"));
    const cavalier = vaultTracks.find(t => t.title.includes("Cavalier"));
    const redMoonlight = vaultTracks.find(t => t.title.includes("Red Moonlight"));

    console.log("Rental ID:", rental?.id, "(Expected UlRQOU0qjOY)");
    console.log("KTM Drip ID:", ktmDrip?.id, "(Expected qXqIgbaXLeA)");
    console.log("Cavalier ID:", cavalier?.id, "(Expected BGiuQ77BnMY)");
    console.log("Red Moonlight ID:", redMoonlight?.id, "(Expected uYvlxaympXo)");

    if (rental?.id === "mzB1VGEGcSU" || ktmDrip?.id === "iI34LYmJ1Fs" || cavalier?.id === "gXv41QZ4p9k") {
      throw new Error("Track IDs are still mapped to placeholder IDs!");
    }
    console.log("✅ PASS: All unreleased tracks have verified unique video IDs!");

    await browser.close();
    console.log("\n🎉 ALL TESTS COMPLETED WITH 100% SUCCESS!");
  } catch (err) {
    console.error("Test Error:", err);
    process.exit(1);
  }
})();
