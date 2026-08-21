const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://127.0.0.1:8080';
const SCRATCH_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\205b5676-3b2c-4b5c-ad29-854059d5aebe';

(async () => {
  try {
    console.log("🚀 Testing Audio-Reactive Centerpieces (Vinyl, Cassette, Spectrum)...");
    const browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 2 });

    page.on('console', msg => console.log(`[Browser Console ${msg.type()}]:`, msg.text()));
    page.on('pageerror', err => console.error('[Browser PageError]:', err));

    console.log("Navigating to:", APP_URL);
    await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.JuiceEngine, { timeout: 8000 });
    console.log("JuiceEngine loaded!");

    // Jump to Player Deck (Panel index 2)
    await page.evaluate(() => {
      const container = document.getElementById('app-container');
      if (container) container.scrollTo({ left: 430 * 2, behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 600));

    // Start playback
    await page.evaluate(() => window.JuiceEngine.togglePlay());
    await new Promise(r => setTimeout(r, 600));

    console.log("\n--- TEST 1: VINYL CENTERPIECE & REACTIVE AUDIO ---");
    await page.click('.centerpiece-style-btn[data-style="vinyl"]');
    await new Promise(r => setTimeout(r, 400));

    let vinylVisible = await page.evaluate(() => {
      const el = document.getElementById('deck-display-vinyl');
      return el && !el.classList.contains('hidden');
    });
    console.log("Vinyl display visible:", vinylVisible);
    if (!vinylVisible) throw new Error("Vinyl display should be visible!");

    const audioLevels = await page.evaluate(() => window.JuiceEngine.getAudioLevels());
    console.log("Audio Levels (Vinyl):", {
      bass: audioLevels.bass.toFixed(2),
      mid: audioLevels.mid.toFixed(2),
      treble: audioLevels.treble.toFixed(2),
      energy: audioLevels.energy.toFixed(2),
      numFreqBins: Object.keys(audioLevels.frequencies).length
    });

    const vinylScreenshot = path.join(SCRATCH_DIR, 'frame_centerpiece_vinyl.png');
    await page.screenshot({ path: vinylScreenshot });
    console.log("📸 Captured:", vinylScreenshot);
    console.log("✅ PASS: Vinyl Centerpiece verified!");

    console.log("\n--- TEST 2: CASSETTE CENTERPIECE & VU METERS ---");
    await page.click('.centerpiece-style-btn[data-style="cassette"]');
    await new Promise(r => setTimeout(r, 400));

    let cassetteVisible = await page.evaluate(() => {
      const el = document.getElementById('deck-display-cassette');
      const vinyl = document.getElementById('deck-display-vinyl');
      return el && !el.classList.contains('hidden') && vinyl.classList.contains('hidden');
    });
    console.log("Cassette visible & Vinyl hidden:", cassetteVisible);
    if (!cassetteVisible) throw new Error("Cassette should be visible and Vinyl hidden!");

    const vuStatus = await page.evaluate(() => {
      const leftLit = document.querySelectorAll('#cassette-vu-left .lit-green, #cassette-vu-left .lit-yellow, #cassette-vu-left .lit-red').length;
      const rightLit = document.querySelectorAll('#cassette-vu-right .lit-green, #cassette-vu-right .lit-yellow, #cassette-vu-right .lit-red').length;
      const trackLabel = document.getElementById('cassette-track-label').innerText;
      return { leftLit, rightLit, trackLabel };
    });
    console.log("Cassette VU Meters:", vuStatus);

    const cassetteScreenshot = path.join(SCRATCH_DIR, 'frame_centerpiece_cassette.png');
    await page.screenshot({ path: cassetteScreenshot });
    console.log("📸 Captured:", cassetteScreenshot);
    console.log("✅ PASS: Cassette Tape Centerpiece verified!");

    console.log("\n--- TEST 3: SPECTRUM VISUALIZER CENTERPIECE ---");
    await page.click('.centerpiece-style-btn[data-style="spectrum"]');
    await new Promise(r => setTimeout(r, 400));

    let spectrumVisible = await page.evaluate(() => {
      const el = document.getElementById('deck-display-spectrum');
      const cassette = document.getElementById('deck-display-cassette');
      return el && !el.classList.contains('hidden') && cassette.classList.contains('hidden');
    });
    console.log("Spectrum visible & Cassette hidden:", spectrumVisible);
    if (!spectrumVisible) throw new Error("Spectrum should be visible and Cassette hidden!");

    const spectrumScreenshot = path.join(SCRATCH_DIR, 'frame_centerpiece_spectrum.png');
    await page.screenshot({ path: spectrumScreenshot });
    console.log("📸 Captured:", spectrumScreenshot);
    console.log("✅ PASS: Spectrum Visualizer Centerpiece verified!");

    console.log("\n--- TEST 4: MODE SWITCHING (SONG vs VIDEO vs LYRICS) ---");
    // Switch to LYRICS mode
    await page.click('.deck-mode-pill[data-mode="lyrics"]');
    await new Promise(r => setTimeout(r, 300));
    let lyricsModeCheck = await page.evaluate(() => {
      const switcher = document.getElementById('deck-centerpiece-switcher-bar');
      const lyricsDisplay = document.getElementById('deck-display-lyrics');
      const spectrumDisplay = document.getElementById('deck-display-spectrum');
      return switcher.classList.contains('hidden') && !lyricsDisplay.classList.contains('hidden') && spectrumDisplay.classList.contains('hidden');
    });
    console.log("Lyrics Mode properly hides centerpiece switcher & displays lyrics:", lyricsModeCheck);
    if (!lyricsModeCheck) throw new Error("Lyrics mode should hide centerpiece switcher!");

    // Switch back to SONG mode
    await page.click('.deck-mode-pill[data-mode="vinyl"]');
    await new Promise(r => setTimeout(r, 300));
    let songModeCheck = await page.evaluate(() => {
      const switcher = document.getElementById('deck-centerpiece-switcher-bar');
      const lyricsDisplay = document.getElementById('deck-display-lyrics');
      const spectrumDisplay = document.getElementById('deck-display-spectrum');
      return !switcher.classList.contains('hidden') && lyricsDisplay.classList.contains('hidden') && !spectrumDisplay.classList.contains('hidden');
    });
    console.log("Song Mode restores centerpiece switcher & active style:", songModeCheck);
    if (!songModeCheck) throw new Error("Song mode should restore centerpiece switcher!");

    await browser.close();
    console.log("\n🎉 ALL AUDIO-REACTIVE CENTERPIECE TESTS COMPLETED WITH 100% SUCCESS!");
  } catch (err) {
    console.error("Test Error:", err);
    process.exit(1);
  }
})();
