const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const SCRATCH_DIR = path.resolve(__dirname, '..', 'scratch');

async function runExhaustiveTest() {
  console.log("================================================================================");
  console.log("STARTING MASTER EXHAUSTIVE TEST SUITE ON JUICEBX");
  console.log("================================================================================");

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=500,1000', '--hide-scrollbars']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 440, height: 950, deviceScaleFactor: 2 });

  const testResults = [];

  function record(name, pass, details = {}) {
    testResults.push({ name, pass, details });
    const status = pass ? "[PASS]" : "[FAIL]";
    console.log(`${status} ${name}`, details);
    if (!pass) {
      console.error(`FATAL: Test ${name} failed!`);
    }
  }

  // ─── TEST 1: APP INITIALIZATION & COLD BOOT ───
  console.log("\n--- TEST 1: Cold Boot & Initial State ---");
  await page.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForSelector('.track-item', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 1000));

  const bootState = await page.evaluate(() => {
    const s = window.JuiceEngine.getState();
    return {
      queueLength: s.queue.length,
      currentTrack: s.queue[s.currentIndex]?.title,
      currentArtist: s.queue[s.currentIndex]?.artist,
      domTrackCount: document.querySelectorAll('.track-item').length
    };
  });
  record("Cold Boot State Valid", bootState.queueLength > 0 && bootState.domTrackCount > 0, bootState);

  // ─── TEST 2: SEARCH ENGINE & STRICT DURATION FILTERS ───
  console.log("\n--- TEST 2: Real Search Execution & Duration Filtering ---");
  const testQueries = ['Juice WRLD Lucid Dreams', 'The Weeknd', 'Kavinsky Nightcall', 'Synthwave retro'];

  for (const q of testQueries) {
    const searchRes = await page.evaluate(async (query) => {
      const results = await window.JuiceEngine.search(query);
      const invalid = results.filter(t => t.seconds > 600 || t.seconds < 30);
      return {
        query,
        count: results.length,
        invalidCount: invalid.length,
        durations: results.slice(0, 3).map(r => `${r.title} (${r.duration}, ${r.seconds}s)`)
      };
    }, q);
    record(`Search Query: "${q}"`, searchRes.count > 0 && searchRes.invalidCount === 0, searchRes);
  }

  // ─── TEST 3: SWIPE-TO-REMOVE GESTURE ON TRACK ROW ───
  console.log("\n--- TEST 3: Physical Swipe-to-Remove Gesture ---");
  const swipeResult = await page.evaluate(async () => {
    const queueBefore = window.JuiceEngine.getState().queue.length;
    const firstTitle = window.JuiceEngine.getState().queue[0].title;
    const firstItem = document.querySelector('.track-item[data-idx="0"]');

    if (!firstItem) return { error: "No track item found" };

    const rect = firstItem.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    // Simulate physical touch swipe left
    const touchStart = new Touch({
      identifier: Date.now(),
      target: firstItem,
      clientX: startX,
      clientY: startY
    });
    const touchMove = new Touch({
      identifier: Date.now(),
      target: firstItem,
      clientX: startX - 120, // Swiped 120px left
      clientY: startY
    });
    const touchEnd = new Touch({
      identifier: Date.now(),
      target: firstItem,
      clientX: startX - 120,
      clientY: startY
    });

    firstItem.dispatchEvent(new TouchEvent('touchstart', { touches: [touchStart], cancelable: true, bubbles: true }));
    firstItem.dispatchEvent(new TouchEvent('touchmove', { touches: [touchMove], cancelable: true, bubbles: true }));
    firstItem.dispatchEvent(new TouchEvent('touchend', { changedTouches: [touchEnd], cancelable: true, bubbles: true }));

    // Wait for 250ms slide animation
    await new Promise(r => setTimeout(r, 300));

    const queueAfter = window.JuiceEngine.getState().queue.length;
    const newFirstTitle = window.JuiceEngine.getState().queue[0]?.title;

    return {
      queueBefore,
      queueAfter,
      firstTitle,
      newFirstTitle,
      success: (queueAfter === queueBefore - 1 && firstTitle !== newFirstTitle)
    };
  });
  record("Swipe-to-Remove Gesture", swipeResult.success, swipeResult);

  // ─── TEST 4: ONE-TAP REMOVE BUTTON ───
  console.log("\n--- TEST 4: One-Tap Remove Button (×) ---");
  const tapRemoveResult = await page.evaluate(async () => {
    const queueBefore = window.JuiceEngine.getState().queue.length;
    const titleBefore = window.JuiceEngine.getState().queue[0].title;

    const btn = document.querySelector('.btn-remove-queue[data-idx="0"]');
    if (btn) btn.click();

    await new Promise(r => setTimeout(r, 250));

    const queueAfter = window.JuiceEngine.getState().queue.length;
    const titleAfter = window.JuiceEngine.getState().queue[0]?.title;

    return {
      queueBefore,
      queueAfter,
      titleBefore,
      titleAfter,
      success: (queueAfter === queueBefore - 1)
    };
  });
  record("One-Tap Remove Button", tapRemoveResult.success, tapRemoveResult);

  // ─── TEST 5: PLAYER DECK TRANSPORT & CONTROLS ───
  console.log("\n--- TEST 5: Player Deck Master Transport & Controls ---");
  // Navigate to Player Deck
  await page.evaluate(() => {
    document.querySelector('button[data-target="view-player-deck"]').click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Toggle Play
  const playToggleResult = await page.evaluate(() => {
    const playBtn = document.getElementById('deck-btn-play');
    playBtn.click();
    return { isPlaying: window.JuiceEngine.getState().isPlaying };
  });
  record("Transport Play/Pause Click", typeof playToggleResult.isPlaying === 'boolean', playToggleResult);

  // Next Track
  const nextTrackResult = await page.evaluate(() => {
    const initialIndex = window.JuiceEngine.getState().currentIndex;
    document.getElementById('deck-btn-next').click();
    return {
      initialIndex,
      newIndex: window.JuiceEngine.getState().currentIndex
    };
  });
  record("Next Track Button", nextTrackResult.newIndex === nextTrackResult.initialIndex + 1, nextTrackResult);

  // Prev Track
  const prevTrackResult = await page.evaluate(() => {
    window.JuiceEngine.seek(0);
    const initialIndex = window.JuiceEngine.getState().currentIndex;
    document.getElementById('deck-btn-prev').click();
    return {
      initialIndex,
      newIndex: window.JuiceEngine.getState().currentIndex
    };
  });
  record("Prev Track Button", prevTrackResult.newIndex === prevTrackResult.initialIndex - 1, prevTrackResult);

  // Shuffle & Repeat Toggles
  const shuffleRepeatResult = await page.evaluate(() => {
    document.getElementById('deck-btn-shuffle').click();
    const shuffleVal = window.JuiceEngine.getState().shuffle;
    document.getElementById('deck-btn-repeat').click();
    const repeatVal = window.JuiceEngine.getState().repeat;
    return { shuffle: shuffleVal, repeat: repeatVal };
  });
  record("Shuffle & Repeat Toggles", shuffleRepeatResult.shuffle && shuffleRepeatResult.repeat, shuffleRepeatResult);

  // Engine Volume Control
  const volumeResult = await page.evaluate(() => {
    window.JuiceEngine.setVolume(45);
    return {
      volume: window.JuiceEngine.getState().volume
    };
  });
  record("Volume Level Control", volumeResult.volume === 45, volumeResult);

  // ─── TEST 6: CENTER STAGE MODE SWITCHER (Vinyl / Lyrics / Visualizer) ───
  console.log("\n--- TEST 6: Center Stage Inline Mode Switcher ---");
  const vinylMode = await page.evaluate(() => {
    document.querySelector('button[data-mode="vinyl"]').click();
    return {
      vinylHidden: document.getElementById('deck-display-vinyl').classList.contains('hidden'),
      lyricsHidden: document.getElementById('deck-display-lyrics').classList.contains('hidden')
    };
  });
  record("Vinyl Mode Active", !vinylMode.vinylHidden && vinylMode.lyricsHidden, vinylMode);

  const lyricsMode = await page.evaluate(() => {
    document.querySelector('button[data-mode="lyrics"]').click();
    return {
      vinylHidden: document.getElementById('deck-display-vinyl').classList.contains('hidden'),
      lyricsHidden: document.getElementById('deck-display-lyrics').classList.contains('hidden')
    };
  });
  record("Lyrics Mode Active", lyricsMode.vinylHidden && !lyricsMode.lyricsHidden, lyricsMode);

  const visualMode = await page.evaluate(() => {
    document.querySelector('button[data-mode="visualizer"]').click();
    return {
      vinylHidden: document.getElementById('deck-display-vinyl').classList.contains('hidden'),
      visualHidden: document.getElementById('deck-display-visualizer').classList.contains('hidden')
    };
  });
  record("Visualizer Mode Active", visualMode.vinylHidden && !visualMode.visualHidden, visualMode);

  // ─── TEST 7: 100-TRACK GENRE RADIO SHUFFLE ───
  console.log("\n--- TEST 7: 100-Track Genre Radio Dynamic Shuffling ---");
  const radioShuffleTest = await page.evaluate(async () => {
    const radio1 = await window.launchGenreRadio("Synthwave");
    const firstTitles1 = radio1.slice(0, 5).map(t => t.title);

    const radio2 = await window.launchGenreRadio("Synthwave");
    const firstTitles2 = radio2.slice(0, 5).map(t => t.title);

    const areDifferent = JSON.stringify(firstTitles1) !== JSON.stringify(firstTitles2);
    const allValidLengths = radio1.every(t => t.seconds <= 600 && t.seconds >= 30);

    return {
      trackCount: radio1.length,
      sampleOrder1: firstTitles1,
      sampleOrder2: firstTitles2,
      isDistinctOrder: areDifferent,
      allValidLengths
    };
  });
  record("Dynamic Genre Radio (Distinct Shuffle & Valid Durations)", radioShuffleTest.isDistinctOrder && radioShuffleTest.allValidLengths, radioShuffleTest);

  // ─── TEST 8: OFFLINE DOWNLOAD SYSTEM ───
  console.log("\n--- TEST 8: Direct Download & Offline Filter ---");
  const downloadTest = await page.evaluate(async () => {
    // Navigate to library
    document.querySelector('button[data-target="view-library"]').click();
    await new Promise(r => setTimeout(r, 400));

    // Click download on 1st track
    const firstDlBtn = document.querySelector('.btn-direct-download');
    if (firstDlBtn) firstDlBtn.click();

    await new Promise(r => setTimeout(r, 300));
    const downloads = window.JuiceEngine.getDownloads();

    // Toggle offline pill
    document.getElementById('toggle-offline-pill').click();
    await new Promise(r => setTimeout(r, 300));
    const offlineTitle = document.getElementById('library-title').innerText;

    // Toggle back
    document.getElementById('toggle-offline-pill').click();

    return {
      downloadsCount: downloads.length,
      downloadedTitle: downloads[0]?.title,
      offlineViewTitle: offlineTitle
    };
  });
  record("Download & Offline Storage Mode", downloadTest.downloadsCount > 0 && downloadTest.offlineViewTitle === "Offline Library", downloadTest);

  // ─── TEST 9: SETTINGS & THEME TOGGLE ───
  console.log("\n--- TEST 9: Settings View & Theme Contrast ---");
  const themeTest = await page.evaluate(async () => {
    document.querySelector('button[data-target="view-settings"]').click();
    await new Promise(r => setTimeout(r, 400));

    const toggle = document.getElementById('toggle-light-mode');
    toggle.click();
    const isLight = document.documentElement.classList.contains('light');

    toggle.click();
    const isDarkAgain = document.documentElement.classList.contains('dark');

    return {
      lightModeApplied: isLight,
      darkModeRestored: isDarkAgain
    };
  });
  record("Theme Switching (Light/Dark)", themeTest.lightModeApplied && themeTest.darkModeRestored, themeTest);

  // ─── CAPTURE COMPREHENSIVE SCREENSHOT PROOF ───
  console.log("\n--- Capturing Final Visual Proof ---");
  await page.evaluate(() => document.querySelector('button[data-target="view-library"]').click());
  await new Promise(r => setTimeout(r, 600));

  const pFinal = path.join(SCRATCH_DIR, '22_exhaustive_test_complete.png');
  await page.screenshot({ path: pFinal });
  console.log(`[PASS] 22_exhaustive_test_complete.png (${fs.statSync(pFinal).size} bytes)`);

  await browser.close();

  console.log("\n================================================================================");
  console.log(`EXHAUSTIVE TEST COMPLETE: ${testResults.filter(t => t.pass).length}/${testResults.length} PASSED`);
  console.log("================================================================================");

  const allPassed = testResults.every(t => t.pass);
  if (!allPassed) {
    throw new Error("One or more exhaustive tests failed!");
  }
}

runExhaustiveTest().catch(err => {
  console.error("Exhaustive test suite failed:", err);
  process.exit(1);
});
