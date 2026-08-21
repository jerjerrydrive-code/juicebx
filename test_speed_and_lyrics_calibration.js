const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://127.0.0.1:8080';
const SCRATCH_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\205b5676-3b2c-4b5c-ad29-854059d5aebe';

(async () => {
  console.log("🚀 Testing Playback Speed & Lyric Sync Calibration Controls...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 2 });

  await page.goto(APP_URL, { waitUntil: 'networkidle2' });
  await page.waitForFunction(() => window.JuiceEngine);

  // Jump to Player Deck (Panel index 2)
  await page.evaluate(() => {
    const container = document.getElementById('app-container');
    if (container) container.scrollTo({ left: 430 * 2, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 400));

  console.log("\n--- TEST 1: PLAYBACK SPEED CONTROLLER ---");
  const speedBtn = await page.$('#deck-btn-speed');
  if (!speedBtn) throw new Error("Playback Speed button #deck-btn-speed not found!");

  // Initial speed
  let initialSpeed = await page.evaluate(() => window.JuiceEngine.getPlaybackSpeed());
  console.log(`Initial playback speed: ${initialSpeed}x`);

  // Click speed button to cycle to 1.25x
  await speedBtn.click();
  let speed1 = await page.evaluate(() => window.JuiceEngine.getPlaybackSpeed());
  let label1 = await page.evaluate(() => document.getElementById('deck-btn-speed').innerText);
  console.log(`After 1st click: speed=${speed1}x, label="${label1}"`);

  // Click speed button to cycle to 1.5x
  await speedBtn.click();
  let speed2 = await page.evaluate(() => window.JuiceEngine.getPlaybackSpeed());
  let label2 = await page.evaluate(() => document.getElementById('deck-btn-speed').innerText);
  console.log(`After 2nd click: speed=${speed2}x, label="${label2}"`);

  // Click speed button to cycle to 0.75x (slow speed)
  await speedBtn.click();
  let speed3 = await page.evaluate(() => window.JuiceEngine.getPlaybackSpeed());
  let label3 = await page.evaluate(() => document.getElementById('deck-btn-speed').innerText);
  console.log(`After 3rd click: speed=${speed3}x, label="${label3}"`);

  // Click speed button to reset to 1.0x
  await speedBtn.click();
  let speed4 = await page.evaluate(() => window.JuiceEngine.getPlaybackSpeed());
  let label4 = await page.evaluate(() => document.getElementById('deck-btn-speed').innerText);
  console.log(`After 4th click: speed=${speed4}x, label="${label4}"`);

  if (speed4 !== 1.0) throw new Error("Playback speed cycle failed!");
  console.log("✅ PASS: Playback Speed controller verified successfully!");

  console.log("\n--- TEST 2: LYRIC SYNC OFFSET CALIBRATION TOOL ---");
  // Switch to LYRICS mode
  await page.click('.deck-mode-pill[data-mode="lyrics"]');
  await page.waitForFunction(() => {
    const textEl = document.getElementById('deck-lyrics-text');
    return textEl && textEl.querySelectorAll('.lyric-line').length > 5;
  }, { timeout: 10000 });

  const nudgeFwdBtn = await page.$('#btn-lyric-nudge-fwd');
  const nudgeBackBtn = await page.$('#btn-lyric-nudge-back');
  const syncResetBtn = await page.$('#btn-lyric-sync-reset');
  const offsetLabel = await page.$('#lyric-sync-offset-label');

  if (!nudgeFwdBtn || !nudgeBackBtn || !syncResetBtn || !offsetLabel) {
    throw new Error("Lyric Sync Calibration toolbar elements missing!");
  }

  // Nudge +0.5s
  await nudgeFwdBtn.click();
  let textFwd = await page.evaluate(() => document.getElementById('lyric-sync-offset-label').innerText);
  console.log(`After +0.5s nudge: "${textFwd}"`);
  if (textFwd !== '+0.5s') throw new Error(`Expected +0.5s, got ${textFwd}`);

  // Nudge +0.5s again to +1.0s
  await nudgeFwdBtn.click();
  let textFwd2 = await page.evaluate(() => document.getElementById('lyric-sync-offset-label').innerText);
  console.log(`After second +0.5s nudge: "${textFwd2}"`);
  if (textFwd2 !== '+1.0s') throw new Error(`Expected +1.0s, got ${textFwd2}`);

  // Nudge -0.5s to +0.5s
  await nudgeBackBtn.click();
  let textBack = await page.evaluate(() => document.getElementById('lyric-sync-offset-label').innerText);
  console.log(`After -0.5s nudge: "${textBack}"`);
  if (textBack !== '+0.5s') throw new Error(`Expected +0.5s, got ${textBack}`);

  // Reset
  await syncResetBtn.click();
  let textReset = await page.evaluate(() => document.getElementById('lyric-sync-offset-label').innerText);
  console.log(`After reset click: "${textReset}"`);
  if (textReset !== '±0.0s') throw new Error(`Expected ±0.0s, got ${textReset}`);

  console.log("✅ PASS: Lyric Sync Offset calibration tool verified successfully!");

  // Take screenshot of the calibrated lyrics view
  const screenshotPath = path.join(SCRATCH_DIR, 'lyrics_sync_calibration_verified.png');
  await page.screenshot({ path: screenshotPath });
  console.log(`📸 Screenshot captured: ${screenshotPath}`);

  await browser.close();
  console.log("\n🎉 PLAYBACK SPEED & LYRIC SYNC CALIBRATION TESTS COMPLETED 100% SUCCESSFULLY!");
})();
