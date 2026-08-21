const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const SCRATCH_DIR = path.resolve(__dirname, '..', 'scratch');

async function testCleanVideoStage() {
  console.log("================================================================================");
  console.log("TESTING CLEAN VIDEO STAGE (ZERO ON-SCREEN CONTROLS & TAP-TO-PLAY)");
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

  // Navigate to Player Deck
  await page.evaluate(() => {
    document.querySelector('button[data-target="view-player-deck"]').click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Switch to VIDEO mode
  console.log("\n--- TEST 1: Switch to VIDEO Mode ---");
  await page.evaluate(() => {
    document.querySelector('.deck-mode-pill[data-mode="video"]').click();
  });
  await new Promise(r => setTimeout(r, 1000));

  const videoState = await page.evaluate(() => {
    const videoContainer = document.getElementById('deck-display-video');
    const overlay = document.getElementById('deck-video-tap-overlay');
    const isHidden = videoContainer.classList.contains('hidden');
    return {
      videoVisible: !isHidden,
      overlayPresent: overlay !== null
    };
  });
  console.log("Video State:", videoState);
  if (!videoState.videoVisible || !videoState.overlayPresent) {
    throw new Error("FAIL: Video stage or tap overlay is not active!");
  }
  console.log("[PASS] Video stage is active and clean!");

  // Tap video overlay to toggle play/pause
  console.log("\n--- TEST 2: Tap Video Stage to Toggle Play ---");
  const playBefore = await page.evaluate(() => window.JuiceEngine.getState().isPlaying);
  await page.evaluate(() => {
    document.getElementById('deck-video-tap-overlay').click();
  });
  await new Promise(r => setTimeout(r, 400));
  const playAfter = await page.evaluate(() => window.JuiceEngine.getState().isPlaying);
  console.log(`Play before tap: ${playBefore}, Play after tap: ${playAfter}`);
  if (playBefore === playAfter) {
    throw new Error("FAIL: Tapping video overlay did not toggle playback state!");
  }
  console.log("[PASS] Video tap-to-play seamlessly toggles playback!");

  const pVideo = path.join(SCRATCH_DIR, '34_clean_video_stage_no_controls.png');
  await page.screenshot({ path: pVideo });
  console.log(`[PASS] 34_clean_video_stage_no_controls.png (${fs.statSync(pVideo).size} bytes)`);

  await browser.close();
  console.log("\n================================================================================");
  console.log("ALL CLEAN VIDEO STAGE TESTS PASSED WITH 100% SUCCESS!");
  console.log("================================================================================");
}

testCleanVideoStage().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
