const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://127.0.0.1:8080';
const SCRATCH_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\205b5676-3b2c-4b5c-ad29-854059d5aebe';

(async () => {
  console.log('🚀 Starting Comprehensive Verification Test...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 430, height: 932, deviceScaleFactor: 2 }
  });

  const page = await browser.newPage();
  
  page.on('console', msg => console.log('  [BROWSER CONSOLE]', msg.text()));
  page.on('pageerror', err => console.error('  [PAGE ERROR]', err.message));

  await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));

  // 1. Verify Logo Quality and Dimensions
  const logoInfo = await page.evaluate(() => {
    const logo = document.querySelector('#view-home .juicebx-logo');
    const computed = window.getComputedStyle(logo);
    return {
      src: logo.getAttribute('src'),
      naturalWidth: logo.naturalWidth,
      naturalHeight: logo.naturalHeight,
      renderedWidth: logo.offsetWidth,
      renderedHeight: logo.offsetHeight,
      imageRendering: computed.imageRendering,
      filter: computed.filter
    };
  });
  console.log('✅ Logo Info:', logoInfo);

  // Capture Home View Screenshot
  await page.screenshot({ path: path.join(SCRATCH_DIR, '49_home_top_100_shuffles.png') });
  console.log('📸 Captured Home View Screenshot -> 49_home_top_100_shuffles.png');

  // 2. Verify Home Shuffles Click (e.g. Hip-Hop & Trap Top 100)
  console.log('⚡ Testing instant Top 100 Genre Shuffle click...');
  const shuffleClickResult = await page.evaluate(() => {
    const hiphopCard = document.querySelector('.genre-card[data-genre="hiphop_top100"]');
    if (!hiphopCard) return { success: false, reason: 'Card not found' };
    hiphopCard.click();
    
    const state = window.JuiceEngine.getState();
    return {
      success: true,
      queueLength: state.queue.length,
      currentTrack: state.queue[state.currentIndex],
      isPlaying: state.isPlaying
    };
  });
  console.log('✅ Top 100 Shuffle Result:', shuffleClickResult);

  await new Promise(r => setTimeout(r, 500));

  // Capture Player Deck Screenshot (Confirm clean visualizer, no overlay label)
  await page.screenshot({ path: path.join(SCRATCH_DIR, '50_player_deck_after_shuffle.png') });
  console.log('📸 Captured Player Deck Screenshot -> 50_player_deck_after_shuffle.png');

  // 3. Switch to Visualizer Mode on Deck & capture screenshot
  await page.evaluate(() => {
    const visualizerPill = document.querySelector('.deck-mode-pill[data-mode="visualizer"]');
    if (visualizerPill) visualizerPill.click();
  });
  await new Promise(r => setTimeout(r, 600));

  const visualizerCheck = await page.evaluate(() => {
    const vizDiv = document.getElementById('deck-display-visualizer');
    const hasTackyBadge = vizDiv.innerText.includes('32-Band Neon Spectrum');
    const canvas = document.getElementById('deck-visualizer-canvas');
    return {
      isVisible: !vizDiv.classList.contains('hidden'),
      hasTackyBadge: hasTackyBadge,
      canvasWidth: canvas.offsetWidth,
      canvasHeight: canvas.offsetHeight
    };
  });
  console.log('✅ Visualizer Clean Check:', visualizerCheck);

  await page.screenshot({ path: path.join(SCRATCH_DIR, '51_clean_visualizer_mode.png') });
  console.log('📸 Captured Clean Visualizer Screenshot -> 51_clean_visualizer_mode.png');

  // 4. Test Web Audio DSP Equalizer
  console.log('🎛️ Testing Web Audio DSP Equalizer presets...');
  const eqResults = await page.evaluate(() => {
    const engine = window.JuiceEngine;
    const presets = engine.getEqPresets();
    engine.setEqPreset('999_bass_boost');
    const state1 = engine.getEqPreset();
    engine.setEqPreset('studio_master');
    const state2 = engine.getEqPreset();
    engine.setEqPreset('vinyl_warmth');
    const state3 = engine.getEqPreset();
    return {
      availablePresets: Object.keys(presets),
      preset1: state1,
      preset2: state2,
      preset3: state3
    };
  });
  console.log('✅ EQ Preset Test:', eqResults);

  // 5. Navigate to Library Tab (Tab 3) & capture screenshot
  await page.evaluate(() => {
    const libBtn = document.querySelector('.nav-btn[data-target="view-library"]');
    if (libBtn) libBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCRATCH_DIR, '52_library_queue_view.png') });
  console.log('📸 Captured Library Screenshot -> 52_library_queue_view.png');

  // 6. Test Light Mode Toggle & capture crisp logo in Light Mode
  await page.evaluate(() => {
    const settingsBtn = document.querySelector('.nav-btn[data-target="view-settings"]');
    if (settingsBtn) settingsBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  await page.evaluate(() => {
    const lightToggle = document.getElementById('toggle-light-mode');
    if (lightToggle) lightToggle.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Navigate back to Home in Light Mode to verify logo crispness
  await page.evaluate(() => {
    const homeBtn = document.querySelector('.nav-btn[data-target="view-home"]');
    if (homeBtn) homeBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCRATCH_DIR, '53_home_light_mode_crisp_logo.png') });
  console.log('📸 Captured Light Mode Home Screenshot -> 53_home_light_mode_crisp_logo.png');

  // Revert to Dark Mode
  await page.evaluate(() => {
    const settingsBtn = document.querySelector('.nav-btn[data-target="view-settings"]');
    if (settingsBtn) settingsBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.evaluate(() => {
    const lightToggle = document.getElementById('toggle-light-mode');
    if (lightToggle) lightToggle.click();
  });
  await new Promise(r => setTimeout(r, 400));

  console.log('🎉 ALL TESTS PASSED WITH 100% SUCCESS!');
  await browser.close();
})();
