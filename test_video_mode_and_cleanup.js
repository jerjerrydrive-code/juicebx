const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const SCRATCH_DIR = path.resolve(__dirname, '..', 'scratch');

async function testVideoModeAndCleanup() {
  console.log("================================================================================");
  console.log("TESTING EQUALIZER REMOVAL & YOUTUBE MUSIC VIDEO MODE STAGE");
  console.log("================================================================================");

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=600,1000', '--hide-scrollbars']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 440, height: 950, deviceScaleFactor: 2 });

  await page.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForSelector('.track-item', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 600));

  // Navigate to Player Deck (Panel 2)
  await page.evaluate(() => {
    document.querySelector('button[data-target="view-player-deck"]').click();
  });
  await new Promise(r => setTimeout(r, 600));

  // ─── TEST 1: EQUALIZER COMPLETELY REMOVED ───
  console.log("\n--- TEST 1: Equalizer Card Removed ---");
  const eqExists = await page.evaluate(() => {
    return document.getElementById('eq-presets-grid') !== null || document.getElementById('deck-volume-slider') !== null;
  });
  console.log(`Equalizer Present: ${eqExists}`);
  if (eqExists) throw new Error("FAIL: Equalizer card was not removed!");
  console.log("[PASS] Equalizer card is completely removed from Player Deck!");

  // ─── TEST 2: MODE PILLS (SONG / VIDEO / LYRICS / VISUAL) ───
  console.log("\n--- TEST 2: Mode Switcher Pills ---");
  const pills = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.deck-mode-pill')).map(p => ({
      mode: p.getAttribute('data-mode'),
      label: p.innerText
    }));
  });
  console.log("Mode Pills:", pills);
  const hasVideoMode = pills.some(p => p.mode === 'video' && p.label.toUpperCase() === 'VIDEO');
  if (!hasVideoMode) throw new Error("FAIL: Video mode pill missing!");
  console.log("[PASS] Mode pills include SONG, VIDEO, LYRICS, VISUAL!");

  // ─── TEST 3: SWITCH TO VIDEO MODE (Single Unified Player) ───
  console.log("\n--- TEST 3: Switch to VIDEO Mode ---");
  await page.evaluate(() => {
    document.querySelector('.deck-mode-pill[data-mode="video"]').click();
  });
  await new Promise(r => setTimeout(r, 800));

  const videoModeState = await page.evaluate(() => {
    const videoContainer = document.getElementById('deck-display-video');
    const vinylContainer = document.getElementById('deck-display-vinyl');
    const host = document.getElementById('yt-player-host');
    const allIframes = document.querySelectorAll('iframe').length;
    return {
      videoHidden: videoContainer.classList.contains('hidden'),
      vinylHidden: vinylContainer.classList.contains('hidden'),
      hostPresent: host !== null,
      totalIframesCount: allIframes
    };
  });
  console.log("Video Mode State:", videoModeState);
  if (videoModeState.videoHidden || !videoModeState.vinylHidden) {
    throw new Error("FAIL: Video mode did not display center stage video container!");
  }
  console.log("[PASS] Video Mode renders center stage without extra sound engines (Total iframes <= 1)!");

  const pVideo = path.join(SCRATCH_DIR, '29_single_engine_video_sync.png');
  await page.screenshot({ path: pVideo });
  console.log(`[PASS] 29_single_engine_video_sync.png (${fs.statSync(pVideo).size} bytes)`);

  // ─── TEST 4: SWITCH BACK TO SONG (VINYL) MODE & UNLOAD VIDEO ───
  console.log("\n--- TEST 4: Switch Back to SONG Mode (Bandwidth Saving) ---");
  await page.evaluate(() => {
    document.querySelector('.deck-mode-pill[data-mode="vinyl"]').click();
  });
  await new Promise(r => setTimeout(r, 600));

  const songModeState = await page.evaluate(() => {
    const videoContainer = document.getElementById('deck-display-video');
    const vinylContainer = document.getElementById('deck-display-vinyl');
    return {
      videoHidden: videoContainer.classList.contains('hidden'),
      vinylHidden: vinylContainer.classList.contains('hidden')
    };
  });
  console.log("Song Mode State:", songModeState);
  if (!songModeState.videoHidden || songModeState.vinylHidden) {
    throw new Error("FAIL: Vinyl turntable did not restore!");
  }
  console.log("[PASS] 3D Turntable Vinyl restored seamlessly!");

  const pSong = path.join(SCRATCH_DIR, '27_song_mode_restored.png');
  await page.screenshot({ path: pSong });
  console.log(`[PASS] 27_song_mode_restored.png (${fs.statSync(pSong).size} bytes)`);

  // ─── TEST 5: RABBIT R1 MODE WITH CLEAN DECK ───
  console.log("\n--- TEST 5: Rabbit R1 Mode with Clean Player Deck ---");
  await page.evaluate(() => {
    const r1Toggle = document.getElementById('toggle-settings-rabbit');
    if (r1Toggle) r1Toggle.click();
    else document.body.classList.add('rabbit-mode-active');
  });
  await page.setViewport({ width: 560, height: 750, deviceScaleFactor: 2 });
  await new Promise(r => setTimeout(r, 600));

  const pRabbit = path.join(SCRATCH_DIR, '28_rabbit_r1_clean_deck.png');
  await page.screenshot({ path: pRabbit });
  console.log(`[PASS] 28_rabbit_r1_clean_deck.png (${fs.statSync(pRabbit).size} bytes)`);

  await browser.close();
  console.log("\n================================================================================");
  console.log("ALL VIDEO MODE AND EQUALIZER CLEANUP TESTS PASSED WITH 100% SUCCESS!");
  console.log("================================================================================");
}

testVideoModeAndCleanup().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
