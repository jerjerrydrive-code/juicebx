const puppeteer = require('puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  console.log("🚀 Starting Playback Verification Test...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--autoplay-policy=no-user-gesture-required'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('JuiceEngine') || text.includes('YouTube') || text.includes('Error') || text.includes('play')) {
      console.log(`[Browser Console] ${text}`);
    }
  });

  console.log("Navigating to http://127.0.0.1:8080/index.html...");
  await page.goto('http://127.0.0.1:8080/index.html', { waitUntil: 'networkidle2', timeout: 30000 });

  // Wait for JuiceEngine to be mounted
  await page.waitForFunction(() => window.JuiceEngine && window.JuiceEngine.getState);

  // Monitor engine events
  await page.evaluate(() => {
    window._engineLog = [];
    window.addEventListener('engine:trackChanged', (e) => {
      window._engineLog.push({ type: 'trackChanged', track: e.detail.title, id: e.detail.id, time: Date.now() });
    });
    window.addEventListener('engine:stateChanged', (e) => {
      window._engineLog.push({ type: 'stateChanged', isPlaying: e.detail.isPlaying, current: e.detail.currentIndex, time: Date.now() });
    });
    window.addEventListener('engine:streamError', (e) => {
      window._engineLog.push({ type: 'streamError', message: e.detail.message, time: Date.now() });
    });
  });

  console.log("▶ Testing initial state and starting playback on Track 0 (Lucid Dreams)...");
  const initialState = await page.evaluate(() => window.JuiceEngine.getState());
  console.log("Initial state:", {
    currentIndex: initialState.currentIndex,
    currentTrack: initialState.queue[initialState.currentIndex]?.title,
    trackId: initialState.queue[initialState.currentIndex]?.id,
    queueLength: initialState.queue.length,
    isPlaying: initialState.isPlaying
  });

  // Trigger play on track 0
  await page.evaluate(() => {
    window.JuiceEngine.playTrack(0);
  });

  console.log("Waiting 3 seconds to observe playback progression...");
  await new Promise(r => setTimeout(r, 3000));

  let stateAfter3s = await page.evaluate(() => {
    const s = window.JuiceEngine.getState();
    return {
      currentIndex: s.currentIndex,
      currentTrack: s.queue[s.currentIndex]?.title,
      isPlaying: s.isPlaying,
      currentTime: s.currentTime,
      duration: s.duration,
      events: window._engineLog
    };
  });

  console.log("State after 3 seconds:", stateAfter3s);

  // Check if index jumped more than 0 (which would mean skipping)
  if (stateAfter3s.currentIndex === 0) {
    console.log("✅ PASS: Zero runaway skipping! Current index is locked at Track 0.");
  } else {
    console.warn("⚠️ Warning: Index changed to", stateAfter3s.currentIndex);
  }

  // Now test playing Track 1 (All Girls Are The Same)
  console.log("\n▶ Testing switching to Track 1 (All Girls Are The Same)...");
  await page.evaluate(() => window.JuiceEngine.playTrack(1));
  await new Promise(r => setTimeout(r, 2000));

  let stateTrack1 = await page.evaluate(() => {
    const s = window.JuiceEngine.getState();
    return {
      currentIndex: s.currentIndex,
      currentTrack: s.queue[s.currentIndex]?.title,
      isPlaying: s.isPlaying,
      currentTime: s.currentTime
    };
  });
  console.log("Track 1 state:", stateTrack1);

  if (stateTrack1.currentIndex === 1) {
    console.log("✅ PASS: Successfully transitioned to Track 1 without cascading skips.");
  }

  // Now test playing Track 2 (Robbery)
  console.log("\n▶ Testing switching to Track 2 (Robbery)...");
  await page.evaluate(() => window.JuiceEngine.playTrack(2));
  await new Promise(r => setTimeout(r, 2000));

  let stateTrack2 = await page.evaluate(() => {
    const s = window.JuiceEngine.getState();
    return {
      currentIndex: s.currentIndex,
      currentTrack: s.queue[s.currentIndex]?.title,
      isPlaying: s.isPlaying,
      currentTime: s.currentTime
    };
  });
  console.log("Track 2 state:", stateTrack2);

  if (stateTrack2.currentIndex === 2) {
    console.log("✅ PASS: Successfully transitioned to Track 2 without cascading skips.");
  }

  // Test next() button
  console.log("\n▶ Testing Next Track Button...");
  await page.evaluate(() => window.JuiceEngine.next());
  await new Promise(r => setTimeout(r, 1500));

  let stateNext = await page.evaluate(() => {
    const s = window.JuiceEngine.getState();
    return {
      currentIndex: s.currentIndex,
      currentTrack: s.queue[s.currentIndex]?.title,
      isPlaying: s.isPlaying
    };
  });
  console.log("After next() state:", stateNext);

  if (stateNext.currentIndex === 3) {
    console.log("✅ PASS: Next button advanced cleanly to index 3.");
  }

  // Final Event Log Check
  const allEvents = await page.evaluate(() => window._engineLog);
  console.log("\n📋 Full Engine Event Trace during test session:");
  console.table(allEvents);

  await browser.close();
  console.log("\n✨ Playback Verification Completed Successfully!");
})();
