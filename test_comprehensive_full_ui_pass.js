const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://127.0.0.1:8080';
const SCRATCH_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\205b5676-3b2c-4b5c-ad29-854059d5aebe';

(async () => {
  console.log("🚀 Starting Comprehensive Full UI & Version Audit Pass...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 2 });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  console.log("Navigating to app...");
  await page.goto(APP_URL, { waitUntil: 'networkidle2' });
  await page.waitForFunction(() => window.JuiceEngine);

  // 1. Version & System Status Audit
  console.log("\n--- AUDIT 1: VERSION & SYSTEM STATUS ---");
  const versionAudit = await page.evaluate(() => {
    const homeEl = document.getElementById('view-home');
    const settingsEl = document.getElementById('view-settings');
    const homeBadge = homeEl ? homeEl.innerText.includes('v2.4.0') : false;
    const settingsBadge = settingsEl ? settingsEl.innerText.includes('v2.4.0') : false;
    return { homeBadge, settingsBadge };
  });
  console.log("Version Audit:", versionAudit);

  // 2. Equalizer & Visualizer Removal Audit
  console.log("\n--- AUDIT 2: ZERO FAKE CONTROLS & CLEAN MODES ---");
  const eqAudit = await page.evaluate(() => {
    return {
      visualizerPill: !!document.querySelector('button[data-mode="visualizer"]'),
      deckBtnEq: !!document.getElementById('deck-btn-eq'),
      deckVisualizer: !!document.getElementById('deck-display-visualizer'),
      settingsEq: !!document.getElementById('settings-eq-grid'),
      deckModePills: Array.from(document.querySelectorAll('.deck-mode-pill')).map(p => p.innerText.trim())
    };
  });
  console.log("Equalizer Audit:", eqAudit);

  // 3. Home View & Top Shuffles
  console.log("\n--- AUDIT 3: HOME VIEW & SHUFFLES ---");
  const homeCardsCount = await page.evaluate(() => document.querySelectorAll('.genre-card').length);
  console.log(`Verified ${homeCardsCount} Genre Shuffle cards on Home Screen.`);

  // 4. Search View Interactions
  console.log("\n--- AUDIT 4: DEDICATED SEARCH & CLEAR ---");
  await page.evaluate(() => {
    const container = document.getElementById('app-container');
    if (container) container.scrollTo({ left: 430 * 1, behavior: 'instant' });
    const btn = document.querySelector('.nav-btn[data-target="view-search"]');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // Type search and press Enter
  await page.type('#main-search-input', 'Robbery');
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => {
    return document.querySelectorAll('.search-result-item').length > 0;
  }, { timeout: 8000 });

  const searchResultsCount = await page.evaluate(() => document.querySelectorAll('.search-result-item').length);
  console.log(`Search for "Robbery" returned ${searchResultsCount} standalone songs.`);

  // Test clear search button
  const clearVisible = await page.evaluate(() => !document.getElementById('btn-clear-search').classList.contains('hidden'));
  console.log(`Clear button visible when text present: ${clearVisible}`);
  await page.click('#btn-clear-search');
  await new Promise(r => setTimeout(r, 200));
  const inputEmpty = await page.evaluate(() => document.getElementById('main-search-input').value === '');
  console.log(`Input empty after clear click: ${inputEmpty}`);

  // 5. Player Deck Modes (Song / Video / Lyrics)
  console.log("\n--- AUDIT 5: PLAYER DECK MODES ---");
  await page.evaluate(() => {
    const container = document.getElementById('app-container');
    if (container) container.scrollTo({ left: 430 * 2, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 400));

  // Test Vinyl Mode
  await page.click('.deck-mode-pill[data-mode="vinyl"]');
  const vinylVisible = await page.evaluate(() => !document.getElementById('deck-display-vinyl').classList.contains('hidden'));
  console.log(`SONG (Vinyl) display active: ${vinylVisible}`);

  // Test Video Mode
  await page.click('.deck-mode-pill[data-mode="video"]');
  const videoVisible = await page.evaluate(() => !document.getElementById('deck-display-video').classList.contains('hidden'));
  console.log(`VIDEO display active: ${videoVisible}`);

  // Test Lyrics Mode
  await page.click('.deck-mode-pill[data-mode="lyrics"]');
  await page.waitForFunction(() => {
    const textEl = document.getElementById('deck-lyrics-text');
    return textEl && textEl.querySelectorAll('.lyric-line').length > 5;
  }, { timeout: 10000 });
  const lyricsLineCount = await page.evaluate(() => document.querySelectorAll('#deck-lyrics-text .lyric-line').length);
  console.log(`LYRICS synced lines loaded: ${lyricsLineCount}`);

  // Test Shuffle & Repeat button active states
  console.log("\n--- AUDIT 6: TRANSPORT & TOGGLE STATES ---");
  await page.click('#deck-btn-shuffle');
  const shuffleActive = await page.evaluate(() => window.JuiceEngine.getState().shuffle);
  console.log(`Shuffle toggled active: ${shuffleActive}`);

  await page.click('#deck-btn-repeat');
  const repeatActive = await page.evaluate(() => window.JuiceEngine.getState().repeat);
  console.log(`Repeat toggled active: ${repeatActive}`);

  // 7. Library & Subtabs
  console.log("\n--- AUDIT 7: LIBRARY SUBTABS & QUEUE ---");
  await page.evaluate(() => {
    const container = document.getElementById('app-container');
    if (container) container.scrollTo({ left: 430 * 3, behavior: 'instant' });
    const btn = document.querySelector('.nav-btn[data-target="view-library"]');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // Subtabs: Queue
  await page.click('.lib-tab[data-tab="queue"]');
  await new Promise(r => setTimeout(r, 300));
  const queueCount = await page.evaluate(() => document.querySelectorAll('#library-track-list .track-item').length);
  console.log(`Library Queue rendered with ${queueCount} tracks.`);

  // Subtabs: Artists
  await page.click('.lib-tab[data-tab="artists"]');
  await new Promise(r => setTimeout(r, 300));
  const artistsCount = await page.evaluate(() => document.querySelectorAll('.artist-card').length);
  console.log(`Library Artists rendered with ${artistsCount} artist cards.`);

  // Subtabs: Albums
  await page.click('.lib-tab[data-tab="albums"]');
  await new Promise(r => setTimeout(r, 300));
  const albumsCount = await page.evaluate(() => document.querySelectorAll('.album-card').length);
  console.log(`Library Albums rendered with ${albumsCount} album cards.`);

  // Subtabs: Downloads
  await page.click('.lib-tab[data-tab="downloads"]');
  await new Promise(r => setTimeout(r, 300));
  const downloadsVisible = await page.evaluate(() => !document.getElementById('library-downloads-view').classList.contains('hidden'));
  console.log(`Downloads subview active: ${downloadsVisible}`);

  // 8. Settings & Modals
  console.log("\n--- AUDIT 8: SETTINGS & HARDWARE MODES ---");
  await page.evaluate(() => {
    const container = document.getElementById('app-container');
    if (container) container.scrollTo({ left: 430 * 4, behavior: 'instant' });
    const btn = document.querySelector('.nav-btn[data-target="view-settings"]');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // Test Rabbit R1 mode toggle
  await page.click('#toggle-settings-rabbit');
  const rabbitActive = await page.evaluate(() => document.body.classList.contains('rabbit-mode-active'));
  console.log(`Rabbit R1 Hardware Mode active: ${rabbitActive}`);

  // Test Light mode toggle
  await page.click('#toggle-light-mode');
  const isLight = await page.evaluate(() => document.documentElement.classList.contains('light'));
  console.log(`Light Mode active: ${isLight}`);

  // Revert to dark for default
  await page.click('#toggle-light-mode');
  await page.click('#toggle-settings-rabbit');

  // Test Sleep Timer Modal
  await page.click('#settings-btn-sleep');
  await new Promise(r => setTimeout(r, 300));
  const sleepModalOpen = await page.evaluate(() => !document.getElementById('modal-sleep-timer').classList.contains('hidden'));
  console.log(`Sleep Timer Modal open: ${sleepModalOpen}`);
  await page.click('#btn-close-sleep-modal');
  await new Promise(r => setTimeout(r, 300));

  // Test 999 Memorial Modal
  await page.evaluate(() => {
    const tributeLink = document.getElementById('settings-tribute-link');
    if (tributeLink) {
      tributeLink.scrollIntoView();
      tributeLink.click();
    }
  });
  await new Promise(r => setTimeout(r, 400));
  const tributeModalOpen = await page.evaluate(() => !document.getElementById('modal-999-tribute').classList.contains('hidden'));
  console.log(`999 Memorial Tribute Modal open: ${tributeModalOpen}`);
  await page.evaluate(() => {
    const btn = document.getElementById('btn-close-tribute-modal');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 300));

  console.log("\n--- AUDIT 9: BROWSER ERROR SCAN ---");
  console.log(`Total console errors encountered: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.warn("Console errors:", consoleErrors);
  }

  await browser.close();
  console.log("\n🎉 Full Comprehensive UI Pass & Version Audit Completed Successfully!");
})();
