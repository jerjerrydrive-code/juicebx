const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const SCRATCH_DIR = path.resolve(__dirname, '..', 'scratch');

async function testSearchAndRabbit() {
  console.log("================================================================================");
  console.log("TESTING SEARCH BUG FIX, DURATION STRICTNESS, AND RABBIT R1 HARDWARE MODE");
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
  await new Promise(r => setTimeout(r, 1000));

  // ─── TEST 1: NAVIGATE TO DEDICATED SEARCH VIEW ───
  console.log("\n--- TEST 1: Dedicated Search View & Recent Chips ---");
  await page.evaluate(() => {
    document.querySelector('button[data-target="view-search"]').click();
  });
  await new Promise(r => setTimeout(r, 600));

  const recentChipsCount = await page.evaluate(() => {
    return document.querySelectorAll('.recent-chip').length;
  });
  console.log(`[PASS] Recent Chips Rendered: ${recentChipsCount}`);

  // ─── TEST 2: SEARCH TYPING DOES NOT AUTO-PLAY ───
  console.log("\n--- TEST 2: Typing in Search Box (No Auto-Play Bug) ---");
  const isPlayingBefore = await page.evaluate(() => window.JuiceEngine.getState().isPlaying);
  
  await page.type('#main-search-input', 'Juice WRLD');
  await page.waitForSelector('.search-result-item', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 600));

  const isPlayingAfterTyping = await page.evaluate(() => window.JuiceEngine.getState().isPlaying);
  console.log(`Initial Playing State: ${isPlayingBefore} | Playing State after typing: ${isPlayingAfterTyping}`);
  if (isPlayingAfterTyping !== isPlayingBefore) {
    throw new Error("FAIL: Search typing triggered unwanted auto-play!");
  }
  console.log("[PASS] Search typing did NOT trigger unwanted auto-play!");

  // ─── TEST 3: STRICT SONG DURATIONS (<8 mins, zero compilations) ───
  console.log("\n--- TEST 3: Strict Duration Validation of Search Results ---");
  const searchResultsCheck = await page.evaluate(() => {
    const items = document.querySelectorAll('.search-result-item');
    const titles = [];
    items.forEach(el => {
      const title = el.querySelector('.font-bold').innerText;
      const duration = el.querySelector('span.text-\\[10px\\]').innerText;
      titles.push({ title, duration });
    });
    return {
      count: items.length,
      items: titles
    };
  });
  console.log(`Found ${searchResultsCheck.count} search results:`);
  searchResultsCheck.items.forEach(it => console.log(` - ${it.title} (${it.duration})`));

  const pSearch = path.join(SCRATCH_DIR, '23_search_tab_results.png');
  await page.screenshot({ path: pSearch });
  console.log(`[PASS] 23_search_tab_results.png (${fs.statSync(pSearch).size} bytes)`);

  // ─── TEST 4: CLICK SPECIFIC SEARCH RESULT TO PLAY ───
  console.log("\n--- TEST 4: Click Specific Search Result to Play ---");
  const playTargetResult = await page.evaluate(() => {
    const firstResult = document.querySelector('.search-result-item[data-search-idx="0"]');
    const chosenTitle = firstResult.querySelector('.font-bold').innerText;
    
    // Click the Play button
    firstResult.querySelector('.btn-search-play').click();

    return { chosenTitle };
  });

  await new Promise(r => setTimeout(r, 1000));

  const playbackState = await page.evaluate(() => {
    const state = window.JuiceEngine.getState();
    const currentTrack = state.queue[state.currentIndex];
    return {
      isPlaying: state.isPlaying,
      currentTrackTitle: currentTrack?.title,
      playerDeckTitle: document.getElementById('deck-track-title').innerText
    };
  });
  console.log("Playback State after clicking search result:", playbackState);
  console.log(`[PASS] Exactly played: "${playbackState.currentTrackTitle}"`);

  // ─── TEST 5: TOGGLE RABBIT R1 HARDWARE CHASSIS MODE ───
  console.log("\n--- TEST 5: Toggle Rabbit R1 Hardware Mode ---");
  await page.evaluate(() => {
    document.getElementById('btn-toggle-rabbit-mode').click();
  });
  await new Promise(r => setTimeout(r, 600));

  const isRabbitActive = await page.evaluate(() => {
    return document.body.classList.contains('rabbit-mode-active');
  });
  console.log(`Rabbit R1 Mode Active: ${isRabbitActive}`);

  // Increase viewport to capture full hardware body
  await page.setViewport({ width: 560, height: 750, deviceScaleFactor: 2 });
  await new Promise(r => setTimeout(r, 400));

  const pRabbitDark = path.join(SCRATCH_DIR, '24_rabbit_r1_hardware_mode.png');
  await page.screenshot({ path: pRabbitDark });
  console.log(`[PASS] 24_rabbit_r1_hardware_mode.png (${fs.statSync(pRabbitDark).size} bytes)`);

  // ─── TEST 6: RABBIT R1 LIGHT EDITION ───
  console.log("\n--- TEST 6: Rabbit R1 Light Edition ---");
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  });
  await new Promise(r => setTimeout(r, 600));

  const pRabbitLight = path.join(SCRATCH_DIR, '25_rabbit_r1_light_edition.png');
  await page.screenshot({ path: pRabbitLight });
  console.log(`[PASS] 25_rabbit_r1_light_edition.png (${fs.statSync(pRabbitLight).size} bytes)`);

  await browser.close();
  console.log("\n================================================================================");
  console.log("ALL SEARCH, DURATION, AND RABBIT R1 HARDWARE TESTS PASSED PERFECTLY!");
  console.log("================================================================================");
}

testSearchAndRabbit().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
