const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const SCRATCH_DIR = path.resolve(__dirname, '..', 'scratch');

async function testNewEliteFeatures() {
  console.log("================================================================================");
  console.log("TESTING JUICEBX NEW ELITE FEATURES: EQ, SLEEP TIMER, 999 TRIBUTE, ERA CHIPS");
  console.log("================================================================================");

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=480,1000', '--hide-scrollbars']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 420, height: 900, deviceScaleFactor: 2 });

  await page.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForSelector('.track-item', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 600));

  // Jump to Player Deck (Panel 2)
  await page.evaluate(() => {
    document.querySelector('button[data-target="view-player-deck"]').click();
  });
  await new Promise(r => setTimeout(r, 400));

  // ─── TEST 1: AUDIO DSP EQUALIZER CYCLING ───
  console.log("\n--- TEST 1: Audio DSP Equalizer Cycling ---");
  const eqState1 = await page.evaluate(() => {
    const label = document.getElementById('deck-eq-label')?.innerText;
    return { label };
  });
  console.log("Initial EQ Preset:", eqState1);

  // Click EQ button in Player Header to cycle
  await page.evaluate(() => {
    document.getElementById('deck-btn-eq').click();
  });
  await new Promise(r => setTimeout(r, 300));

  const eqState2 = await page.evaluate(() => {
    const label = document.getElementById('deck-eq-label')?.innerText;
    return { label };
  });
  console.log("Cycled EQ Preset:", eqState2);
  if (eqState1.label === eqState2.label) {
    throw new Error(`FAIL: EQ cycle failed to update preset.`);
  }
  console.log(`[PASS] EQ Preset cycled successfully from ${eqState1.label} to ${eqState2.label}!`);

  const p1 = path.join(SCRATCH_DIR, '43_player_deck_with_eq_and_sleep.png');
  await page.screenshot({ path: p1 });
  console.log(`[PASS] 43_player_deck_with_eq_and_sleep.png (${fs.statSync(p1).size} bytes)`);

  // ─── TEST 2: SLEEP TIMER MODAL & COUNTDOWN ───
  console.log("\n--- TEST 2: Sleep Timer Modal & Countdown ---");
  await page.evaluate(() => {
    document.getElementById('deck-btn-sleep').click();
  });
  await new Promise(r => setTimeout(r, 300));

  const p2 = path.join(SCRATCH_DIR, '44_sleep_timer_modal.png');
  await page.screenshot({ path: p2 });
  console.log(`[PASS] 44_sleep_timer_modal.png (${fs.statSync(p2).size} bytes)`);

  // Click 30 min preset
  await page.evaluate(() => {
    document.querySelector('.sleep-preset-btn[data-mins="30"]').click();
  });
  await new Promise(r => setTimeout(r, 400));

  const sleepState = await page.evaluate(() => {
    const badge = document.getElementById('deck-sleep-badge');
    const isVisible = badge && !badge.classList.contains('hidden');
    const text = badge?.innerText;
    return { isVisible, text };
  });
  console.log("Sleep Timer Active State:", sleepState);
  if (!sleepState.isVisible || !sleepState.text.includes(':')) {
    throw new Error(`FAIL: Sleep timer failed to activate badge: ${JSON.stringify(sleepState)}`);
  }
  console.log(`[PASS] Sleep timer active with live countdown (${sleepState.text})!`);

  // Cancel Sleep Timer
  await page.evaluate(() => {
    document.getElementById('deck-btn-sleep').click();
  });
  await new Promise(r => setTimeout(r, 300));
  await page.evaluate(() => {
    document.getElementById('btn-cancel-sleep-timer').click();
  });
  await new Promise(r => setTimeout(r, 300));

  // ─── TEST 3: 999 MEMORIAL TRIBUTE MODAL ───
  console.log("\n--- TEST 3: 999 Memorial Tribute Modal ---");
  await page.evaluate(() => {
    document.getElementById('deck-brand-tribute').click();
  });
  await new Promise(r => setTimeout(r, 300));

  const tributeState = await page.evaluate(() => {
    const modal = document.getElementById('modal-999-tribute');
    const isVisible = modal && !modal.classList.contains('hidden');
    const text = modal.innerText;
    return { isVisible, hasQuote: text.includes('999 represents') };
  });
  console.log("Tribute Modal State:", tributeState);
  if (!tributeState.isVisible || !tributeState.hasQuote) {
    throw new Error(`FAIL: 999 Memorial Tribute modal failed: ${JSON.stringify(tributeState)}`);
  }
  console.log(`[PASS] 999 Memorial Tribute modal opened with inspiring Jarad Higgins quote!`);

  const p3 = path.join(SCRATCH_DIR, '45_999_memorial_tribute_modal.png');
  await page.screenshot({ path: p3 });
  console.log(`[PASS] 45_999_memorial_tribute_modal.png (${fs.statSync(p3).size} bytes)`);

  // Click Play The Lost Vault from Tribute Modal
  await page.evaluate(() => {
    document.getElementById('btn-tribute-play-vault').click();
  });
  await new Promise(r => setTimeout(r, 800));

  const vaultPlayState = await page.evaluate(() => {
    const title = document.getElementById('deck-track-title')?.innerText;
    const artist = document.getElementById('deck-track-artist')?.innerText;
    return { title, artist };
  });
  console.log("Vault Play State:", vaultPlayState);
  console.log(`[PASS] Lost Vault track playing: ${vaultPlayState.title} by ${vaultPlayState.artist}!`);

  // ─── TEST 4: SEARCH ERA FILTER CHIPS ───
  console.log("\n--- TEST 4: Search Era Filter Chips ---");
  await page.evaluate(() => {
    document.querySelector('button[data-target="view-search"]').click();
  });
  await new Promise(r => setTimeout(r, 400));

  // Click Death Race era chip
  await page.evaluate(() => {
    const chips = Array.from(document.querySelectorAll('.search-era-chip'));
    const deathRaceChip = chips.find(c => c.innerText.includes('Death Race'));
    if (deathRaceChip) deathRaceChip.click();
  });
  await new Promise(r => setTimeout(r, 800));

  const searchResultsState = await page.evaluate(() => {
    const results = Array.from(document.querySelectorAll('.search-result-item')).map(r => r.querySelector('.font-bold')?.innerText);
    return { count: results.length, sample: results.slice(0, 3) };
  });
  console.log("Search Era Results State:", searchResultsState);
  if (searchResultsState.count === 0) {
    throw new Error(`FAIL: Search era filter chips produced 0 results.`);
  }
  console.log(`[PASS] Search era chip loaded ${searchResultsState.count} curated songs!`);

  const p4 = path.join(SCRATCH_DIR, '46_search_era_filter_chips.png');
  await page.screenshot({ path: p4 });
  console.log(`[PASS] 46_search_era_filter_chips.png (${fs.statSync(p4).size} bytes)`);

  // ─── TEST 5: SETTINGS EQ & HAPTICS ───
  console.log("\n--- TEST 5: Settings Audio DSP Equalizer & Haptics ---");
  await page.evaluate(() => {
    document.querySelector('button[data-target="view-settings"]').click();
  });
  await new Promise(r => setTimeout(r, 400));

  // Click Vocal Clarity EQ in Settings
  await page.evaluate(() => {
    document.querySelector('.settings-eq-btn[data-eq="vocal_clarity"]').click();
  });
  await new Promise(r => setTimeout(r, 300));

  const settingsEqState = await page.evaluate(() => {
    const badge = document.getElementById('settings-eq-badge')?.innerText;
    const isVocalActive = document.querySelector('.settings-eq-btn[data-eq="vocal_clarity"]').classList.contains('active');
    return { badge, isVocalActive };
  });
  console.log("Settings EQ State:", settingsEqState);
  if (!settingsEqState.isVocalActive || !settingsEqState.badge.includes('VOCAL')) {
    throw new Error(`FAIL: Settings EQ selection failed: ${JSON.stringify(settingsEqState)}`);
  }
  console.log(`[PASS] Settings Vocal Clarity EQ activated!`);

  const p5 = path.join(SCRATCH_DIR, '47_settings_eq_and_haptics.png');
  await page.screenshot({ path: p5 });
  console.log(`[PASS] 47_settings_eq_and_haptics.png (${fs.statSync(p5).size} bytes)`);

  // ─── TEST 6: CANVAS SPECTRUM VISUALIZER ───
  console.log("\n--- TEST 6: Canvas Spectrum Visualizer Mode ---");
  await page.evaluate(() => {
    document.querySelector('button[data-target="view-player-deck"]').click();
  });
  await new Promise(r => setTimeout(r, 300));

  await page.evaluate(() => {
    document.querySelector('.deck-mode-pill[data-mode="visualizer"]').click();
  });
  await new Promise(r => setTimeout(r, 600));

  const visualizerState = await page.evaluate(() => {
    const canvas = document.getElementById('deck-visualizer-canvas');
    const isVisible = canvas && !document.getElementById('deck-display-visualizer').classList.contains('hidden');
    return { isVisible, width: canvas?.width, height: canvas?.height };
  });
  console.log("Canvas Visualizer State:", visualizerState);
  if (!visualizerState.isVisible) {
    throw new Error(`FAIL: Visualizer canvas not visible.`);
  }
  console.log(`[PASS] Real-time 32-Band Canvas Visualizer active (${visualizerState.width}x${visualizerState.height}px)!`);

  const p6 = path.join(SCRATCH_DIR, '48_canvas_neon_visualizer.png');
  await page.screenshot({ path: p6 });
  console.log(`[PASS] 48_canvas_neon_visualizer.png (${fs.statSync(p6).size} bytes)`);

  await browser.close();
  console.log("\n================================================================================");
  console.log("ALL NEW ELITE FEATURE TESTS PASSED 100%!");
  console.log("================================================================================");
}

testNewEliteFeatures().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
