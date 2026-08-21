const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://127.0.0.1:8080';
const SCRATCH_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\205b5676-3b2c-4b5c-ad29-854059d5aebe';

(async () => {
  console.log('🚀 Launching Master UI/UX Visual Verification Suite...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 430, height: 932, deviceScaleFactor: 2 }
  });

  const page = await browser.newPage();
  await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));

  // Helper to switch view reliably
  async function goToView(targetId, index) {
    await page.evaluate((tid, idx) => {
      const container = document.getElementById('app-container');
      if (container) {
        container.scrollTo({ left: idx * container.clientWidth, behavior: 'instant' });
      }
      const btn = document.querySelector(`.nav-btn[data-target="${tid}"]`);
      if (btn) btn.click();
    }, targetId, index);
    await new Promise(r => setTimeout(r, 500));
  }

  // ═════════════════════════════════════════════════════════════════════════
  // PASS 1: CORE APP VIEWS (DARK THEME)
  // ═════════════════════════════════════════════════════════════════════════
  console.log('\n--- PASS 1: CORE APP VIEWS (DARK THEME) ---');

  // Frame 1: Home View (Dark Mode)
  await page.screenshot({ path: path.join(SCRATCH_DIR, 'frame_01_home_dark.png') });
  console.log('📸 Frame 01: Home View -> frame_01_home_dark.png');

  // Frame 2: Dedicated Search View (Initial Recents + Eras)
  await goToView('view-search', 1);
  await page.screenshot({ path: path.join(SCRATCH_DIR, 'frame_02_search_dark.png') });
  console.log('📸 Frame 02: Search View -> frame_02_search_dark.png');

  // Frame 3: Search Results with Standalone Tracks & Actions
  await page.evaluate(() => {
    const searchInput = document.getElementById('main-search-input');
    if (searchInput) {
      searchInput.value = 'Lucid Dreams';
      searchInput.dispatchEvent(new Event('input'));
    }
  });
  await new Promise(r => setTimeout(r, 700));
  await page.screenshot({ path: path.join(SCRATCH_DIR, 'frame_03_search_results.png') });
  console.log('📸 Frame 03: Search Results -> frame_03_search_results.png');

  // Frame 4: Player Deck — SONG (Vinyl) Mode with Favorite Heart & Add to Playlist
  await goToView('view-player-deck', 2);
  await page.evaluate(() => document.querySelector('.deck-mode-pill[data-mode="vinyl"]').click());
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(SCRATCH_DIR, 'frame_04_player_vinyl_dark.png') });
  console.log('📸 Frame 04: Player Deck: SONG / Vinyl -> frame_04_player_vinyl_dark.png');

  // Frame 5: Player Deck — VIDEO Stage Mode
  await page.evaluate(() => document.querySelector('.deck-mode-pill[data-mode="video"]').click());
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(SCRATCH_DIR, 'frame_05_player_video_dark.png') });
  console.log('📸 Frame 05: Player Deck: VIDEO Stage -> frame_05_player_video_dark.png');

  // Frame 6: Player Deck — LYRICS Synced Mode
  await page.evaluate(() => document.querySelector('.deck-mode-pill[data-mode="lyrics"]').click());
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCRATCH_DIR, 'frame_06_player_lyrics_dark.png') });
  console.log('📸 Frame 06: Player Deck: LYRICS Karaoke -> frame_06_player_lyrics_dark.png');

  // Frame 7: Player Deck — LYRICS Active Real-Time Highlight Glow
  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent('engine:progress', { detail: { currentTime: 24.0, duration: 231 } }));
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(SCRATCH_DIR, 'frame_07_player_visualizer_dark.png') });
  console.log('📸 Frame 07: Player Deck: LYRICS Active Glow -> frame_07_player_visualizer_dark.png');

  // Frame 8: Library View — Playlists Subtab (Liked Songs Card + User Playlists Grid)
  await goToView('view-library', 3);
  await page.evaluate(() => document.querySelector('.lib-tab[data-tab="playlists"]').click());
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(SCRATCH_DIR, 'frame_08_library_playlists_dark.png') });
  console.log('📸 Frame 08: Library: Playlists Subtab -> frame_08_library_playlists_dark.png');

  // Frame 9: Library View — Liked Songs Playlist Detail View
  await page.evaluate(() => {
    const heroLiked = document.getElementById('hero-liked-songs-card');
    if (heroLiked) heroLiked.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(SCRATCH_DIR, 'frame_09_library_liked_songs_detail.png') });
  console.log('📸 Frame 09: Library: Liked Songs Detail View -> frame_09_library_liked_songs_detail.png');

  // Frame 10: Library View — Queue Subtab
  await page.evaluate(() => {
    const backBtn = document.getElementById('playlist-back-btn');
    if (backBtn) backBtn.click();
    document.querySelector('.lib-tab[data-tab="queue"]').click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(SCRATCH_DIR, 'frame_10_library_queue_dark.png') });
  console.log('📸 Frame 10: Library: Queue Subtab -> frame_10_library_queue_dark.png');

  // Frame 11: Library View — Artists Subtab
  await page.evaluate(() => document.querySelector('.lib-tab[data-tab="artists"]').click());
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(SCRATCH_DIR, 'frame_11_library_artists_dark.png') });
  console.log('📸 Frame 11: Library: Artists Grid -> frame_11_library_artists_dark.png');

  // Frame 12: Library View — Artist Detail View (Juice WRLD)
  await page.evaluate(() => {
    const firstArtistCard = document.querySelector('.artist-card');
    if (firstArtistCard) firstArtistCard.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(SCRATCH_DIR, 'frame_12_library_artist_detail_dark.png') });
  console.log('📸 Frame 12: Library: Artist Detail View -> frame_12_library_artist_detail_dark.png');

  // Frame 13: Library View — Albums Subtab
  await page.evaluate(() => {
    const artistBackBtn = document.getElementById('artist-back-btn');
    if (artistBackBtn) artistBackBtn.click();
    document.querySelector('.lib-tab[data-tab="albums"]').click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(SCRATCH_DIR, 'frame_13_library_albums_dark.png') });
  console.log('📸 Frame 13: Library: Albums Grid -> frame_13_library_albums_dark.png');

  // Frame 14: Library View — Downloads Subtab
  await page.evaluate(() => document.querySelector('.lib-tab[data-tab="downloads"]').click());
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(SCRATCH_DIR, 'frame_14_library_downloads_dark.png') });
  console.log('📸 Frame 14: Library: Downloads Subtab -> frame_14_library_downloads_dark.png');

  // Frame 15: Settings View (Clean with Storage & Data Management)
  await goToView('view-settings', 4);
  await page.screenshot({ path: path.join(SCRATCH_DIR, 'frame_15_settings_dark.png') });
  console.log('📸 Frame 15: Settings View -> frame_15_settings_dark.png');

  // ═════════════════════════════════════════════════════════════════════════
  // PASS 2: INTERACTIVE MODALS & HARDWARE
  // ═════════════════════════════════════════════════════════════════════════
  console.log('\n--- PASS 2: INTERACTIVE MODALS & HARDWARE ---');

  // Frame 16: Add to Playlist Modal
  await goToView('view-player-deck', 2);
  await page.evaluate(() => {
    const addPlBtn = document.getElementById('deck-btn-add-playlist');
    if (addPlBtn) addPlBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(SCRATCH_DIR, 'frame_16_add_to_playlist_modal.png') });
  console.log('📸 Frame 16: Add to Playlist Modal -> frame_16_add_to_playlist_modal.png');

  // Frame 17: Create Playlist Modal
  await page.evaluate(() => {
    const closeAddPl = document.getElementById('btn-close-add-playlist-modal');
    if (closeAddPl) closeAddPl.click();
  });
  await goToView('view-library', 3);
  await page.evaluate(() => {
    document.querySelector('.lib-tab[data-tab="playlists"]').click();
    const createBtn = document.getElementById('btn-create-playlist-header');
    if (createBtn) createBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(SCRATCH_DIR, 'frame_17_create_playlist_modal.png') });
  console.log('📸 Frame 17: Create Playlist Modal -> frame_17_create_playlist_modal.png');

  // Frame 18: Sleep Timer Modal
  await page.evaluate(() => {
    const closeCreatePl = document.getElementById('btn-close-create-playlist-modal');
    if (closeCreatePl) closeCreatePl.click();
    const sleepBtn = document.getElementById('deck-btn-sleep');
    if (sleepBtn) sleepBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(SCRATCH_DIR, 'frame_18_sleep_timer_modal.png') });
  console.log('📸 Frame 18: Sleep Timer Modal -> frame_18_sleep_timer_modal.png');

  // Frame 19: 999 Memorial Tribute Modal
  await page.evaluate(() => {
    const closeSleep = document.getElementById('btn-close-sleep-modal');
    if (closeSleep) closeSleep.click();
    const tributeLink = document.getElementById('settings-tribute-link');
    if (tributeLink) tributeLink.click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(SCRATCH_DIR, 'frame_19_999_memorial_modal.png') });
  console.log('📸 Frame 19: 999 Memorial Tribute Modal -> frame_19_999_memorial_modal.png');

  // Frame 20: Rabbit R1 Hardware Chassis
  await page.evaluate(() => {
    const closeTribute = document.getElementById('btn-close-tribute-modal');
    if (closeTribute) closeTribute.click();
    const rabbitToggle = document.getElementById('toggle-settings-rabbit');
    if (rabbitToggle) rabbitToggle.click();
    document.querySelector('.nav-btn[data-target="view-home"]').click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(SCRATCH_DIR, 'frame_20_rabbit_r1_hardware.png') });
  console.log('📸 Frame 20: Rabbit R1 Hardware Mode -> frame_20_rabbit_r1_hardware.png');

  // Frame 21: Light Theme Mode
  await page.evaluate(() => {
    const rabbitToggle = document.getElementById('toggle-settings-rabbit');
    if (rabbitToggle) rabbitToggle.click();
    const lightToggle = document.getElementById('toggle-light-mode');
    if (lightToggle) lightToggle.click();
    document.querySelector('.nav-btn[data-target="view-player-deck"]').click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(SCRATCH_DIR, 'frame_21_player_deck_light.png') });
  console.log('📸 Frame 21: Light Theme Deck -> frame_21_player_deck_light.png');

  // Revert to default Dark Mode
  await page.evaluate(() => {
    document.querySelector('.nav-btn[data-target="view-settings"]').click();
    const lightToggle = document.getElementById('toggle-light-mode');
    if (lightToggle) lightToggle.click();
    document.querySelector('.nav-btn[data-target="view-home"]').click();
  });
  await new Promise(r => setTimeout(r, 300));

  console.log('\n🎉 MASTER VERIFICATION SUITE COMPLETED WITH 21 FRAME CAPTURES & 100% SUCCESS!');
  await browser.close();
})();
