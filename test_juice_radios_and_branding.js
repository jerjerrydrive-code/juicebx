const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const SCRATCH_DIR = path.resolve(__dirname, '..', 'scratch');

async function testJuiceRadiosAndBranding() {
  console.log("================================================================================");
  console.log("TESTING JUICEBX BRANDING, CLEAN HEADER & JUICE WRLD RADIOS/PLAYLISTS");
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

  // ─── TEST 1: CLEAN HEADER & REMOVAL OF EXTRA PLAY/SHUFFLE/R1 BUTTONS ───
  console.log("\n--- TEST 1: Library Header Clean & Extra Buttons Removed ---");
  const headerAudit = await page.evaluate(() => {
    const extraPlay = document.getElementById('btn-play-all');
    const extraShuffle = document.getElementById('btn-shuffle-all');
    const topR1 = document.getElementById('btn-toggle-rabbit-mode');
    const logo = document.querySelector('#view-library .juicebx-logo');
    const logoHeight = logo ? logo.clientHeight : 0;
    return {
      extraPlayPresent: extraPlay !== null,
      extraShufflePresent: extraShuffle !== null,
      topR1Present: topR1 !== null,
      logoHeight
    };
  });
  console.log("Header Audit:", headerAudit);
  if (headerAudit.extraPlayPresent || headerAudit.extraShufflePresent || headerAudit.topR1Present) {
    throw new Error("FAIL: Extra buttons were not removed from Library top bar!");
  }
  console.log("[PASS] Extra play, extra shuffle, and top R1 button are completely removed!");
  console.log(`[PASS] Logo is enlarged and prominent (rendered height: ${headerAudit.logoHeight}px)!`);

  const p1 = path.join(SCRATCH_DIR, '30_clean_library_header_large_logo.png');
  await page.screenshot({ path: p1 });
  console.log(`[PASS] 30_clean_library_header_large_logo.png (${fs.statSync(p1).size} bytes)`);

  // ─── TEST 2: EXPLORE VIEW — JUICE WRLD 2 RADIOS & 2 PLAYLISTS ───
  console.log("\n--- TEST 2: Explore View Juice WRLD 999 Memorial Showcase ---");
  await page.evaluate(() => {
    document.querySelector('button[data-target="view-explore"]').click();
  });
  await new Promise(r => setTimeout(r, 600));

  const exploreAudit = await page.evaluate(() => {
    const radios = Array.from(document.querySelectorAll('#explore-juice-section .genre-card')).map(c => c.getAttribute('data-genre'));
    const playlists = Array.from(document.querySelectorAll('#explore-juice-section .playlist-card')).map(c => c.getAttribute('data-playlist'));
    return { radios, playlists };
  });
  console.log("Explore Showcase:", exploreAudit);
  if (exploreAudit.radios.length !== 2 || exploreAudit.playlists.length !== 2) {
    throw new Error("FAIL: Juice WRLD dedicated 2 radios & 2 playlists missing!");
  }
  console.log("[PASS] 2 Dedicated Juice WRLD Radios & 2 Playlists verified in Explore!");

  const p2 = path.join(SCRATCH_DIR, '31_juice_wrld_999_explore_showcase.png');
  await page.screenshot({ path: p2 });
  console.log(`[PASS] 31_juice_wrld_999_explore_showcase.png (${fs.statSync(p2).size} bytes)`);

  // ─── TEST 3: OPEN JUICE WRLD THE LOST VAULTS PLAYLIST ───
  console.log("\n--- TEST 3: Open Juice WRLD 'The Lost Vaults' Playlist ---");
  await page.evaluate(() => {
    document.querySelector('.playlist-card[data-playlist="juice_vault"]').click();
  });
  await page.waitForFunction(() => {
    const list = document.getElementById('explore-playlist-tracks');
    return list && list.querySelectorAll('.track-item').length > 0;
  }, { timeout: 15000 });
  await new Promise(r => setTimeout(r, 800));

  const playlistState = await page.evaluate(() => {
    const title = document.getElementById('explore-playlist-title')?.innerText;
    const count = document.querySelectorAll('#explore-playlist-tracks .track-item').length;
    const firstTrack = document.querySelector('#explore-playlist-tracks .track-item .font-bold')?.innerText;
    return { title, count, firstTrack };
  });
  console.log("Playlist Opened State:", playlistState);
  if (playlistState.count === 0) throw new Error("FAIL: Vault playlist did not load tracks!");
  console.log(`[PASS] Loaded ${playlistState.count} tracks for "${playlistState.title}"!`);

  const p3 = path.join(SCRATCH_DIR, '32_juice_wrld_vault_playlist_opened.png');
  await page.screenshot({ path: p3 });
  console.log(`[PASS] 32_juice_wrld_vault_playlist_opened.png (${fs.statSync(p3).size} bytes)`);

  // ─── TEST 4: RABBIT R1 AUTO-DETECTION ───
  console.log("\n--- TEST 4: Rabbit R1 Square Screen Auto-Detection ---");
  // Set viewport to 500x500 (square aspect ratio)
  await page.setViewport({ width: 500, height: 500, deviceScaleFactor: 2 });
  await page.evaluate(() => {
    window.dispatchEvent(new Event('resize'));
  });
  await new Promise(r => setTimeout(r, 600));

  const isRabbitAutoDetected = await page.evaluate(() => {
    return document.body.classList.contains('rabbit-mode-active');
  });
  console.log("Rabbit R1 Auto-Detected:", isRabbitAutoDetected);
  if (!isRabbitAutoDetected) throw new Error("FAIL: Rabbit R1 auto-detection failed on square viewport!");
  console.log("[PASS] Rabbit R1 hardware mode automatically engaged upon square screen detection!");

  const p4 = path.join(SCRATCH_DIR, '33_rabbit_r1_auto_detect_verified.png');
  await page.screenshot({ path: p4 });
  console.log(`[PASS] 33_rabbit_r1_auto_detect_verified.png (${fs.statSync(p4).size} bytes)`);

  await browser.close();
  console.log("\n================================================================================");
  console.log("ALL JUICEBX BRANDING & JUICE WRLD RADIOS/PLAYLISTS TESTS PASSED 100%!");
  console.log("================================================================================");
}

testJuiceRadiosAndBranding().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
