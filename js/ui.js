document.addEventListener('DOMContentLoaded', () => {
  const engine = window.JuiceEngine; window.engine = engine;
  if (!engine) { console.error("JuiceEngine not found."); return; }

  // iOS Safari Audio Context Unlocker
  const unlocker = () => {
    if (engine.unlockAudio) engine.unlockAudio();
    document.body.removeEventListener('click', unlocker);
    document.body.removeEventListener('touchstart', unlocker);
  };
  document.body.addEventListener('click', unlocker);
  document.body.addEventListener('touchstart', unlocker);

  // ═══ CLIENT-SIDE SEARCH CACHE ═══
  const clientSearchCache = new Map();

  // ═══ DOM CACHE ═══
  const appContainer = document.getElementById('app-container');
  const navBtns = document.querySelectorAll('.nav-btn');
  const miniPlayer = document.getElementById('mini-player');

  const els = {
    // Top Player Deck Header & Mode Switcher
    deckModePills: document.querySelectorAll('.deck-mode-pill'),
    deckDisplayVinyl: document.getElementById('deck-display-vinyl'),
    deckDisplayVideo: document.getElementById('deck-display-video'),
    deckVideoIframe: document.getElementById('deck-video-iframe'),
    deckDisplayLyrics: document.getElementById('deck-display-lyrics'),
    deckLyricsText: document.getElementById('deck-lyrics-text'),
    deckBtnFullscreen: document.getElementById('deck-btn-fullscreen'),
    deckFullscreenIcon: document.getElementById('deck-fullscreen-icon'),
    deckBtnFavorite: document.getElementById('deck-btn-favorite'),
    deckHeartIcon: document.getElementById('deck-heart-icon'),
    deckBtnAddPlaylist: document.getElementById('deck-btn-add-playlist'),

    // Vinyl & Track Info
    deckVinyl: document.getElementById('deck-vinyl-platter'),
    deckVinylArt: document.getElementById('deck-vinyl-art'),
    deckTrackTitle: document.getElementById('deck-track-title'),
    deckTrackArtist: document.getElementById('deck-track-artist'),

    // Scrubber
    deckScrubberTrack: document.getElementById('deck-scrubber-track'),
    deckScrubberFill: document.getElementById('deck-scrubber-fill'),
    deckScrubberThumb: document.getElementById('deck-scrubber-thumb'),
    deckTimeCurrent: document.getElementById('deck-time-current'),
    deckTimeTotal: document.getElementById('deck-time-total'),

    // Transport Controls
    deckBtnPlay: document.getElementById('deck-btn-play'),
    deckPlayIcon: document.getElementById('deck-play-icon'),
    deckBtnNext: document.getElementById('deck-btn-next'),
    deckBtnPrev: document.getElementById('deck-btn-prev'),
    deckBtnShuffle: document.getElementById('deck-btn-shuffle'),
    deckBtnRepeat: document.getElementById('deck-btn-repeat'),

    // Mini Player
    miniPlayBtn: document.getElementById('mini-play-btn'),
    miniIcon: document.querySelector('#mini-play-btn i'),
    miniTitle: document.getElementById('mini-title'),
    miniArtist: document.getElementById('mini-artist'),
    miniArt: document.querySelector('#mini-art img'),

    // Library Views & Tabs
    libraryList: document.getElementById('library-track-list'),
    libraryPlaylistsView: document.getElementById('library-playlists-view'),
    userPlaylistsGrid: document.getElementById('user-playlists-grid'),
    heroLikedSongsCard: document.getElementById('hero-liked-songs-card'),
    likedSongsCountBadge: document.getElementById('liked-songs-count-badge'),
    btnPlayLikedSongs: document.getElementById('btn-play-liked-songs'),
    btnShuffleLikedSongs: document.getElementById('btn-shuffle-liked-songs'),
    btnCreatePlaylistHeader: document.getElementById('btn-create-playlist-header'),
    btnCreatePlaylistInline: document.getElementById('btn-create-playlist-inline'),
    libraryPlaylistDetailView: document.getElementById('library-playlist-detail-view'),
    playlistBackBtn: document.getElementById('playlist-back-btn'),
    playlistDetailTitle: document.getElementById('playlist-detail-title'),
    playlistDetailMeta: document.getElementById('playlist-detail-meta'),
    playlistBtnPlayAll: document.getElementById('playlist-btn-play-all'),
    playlistBtnShuffle: document.getElementById('playlist-btn-shuffle'),
    playlistBtnDelete: document.getElementById('playlist-btn-delete'),
    playlistDetailTracksList: document.getElementById('playlist-detail-tracks-list'),
    libraryArtistsGrid: document.getElementById('library-artists-grid'),
    artistsGridInner: document.getElementById('artists-grid-inner'),
    libraryAlbumsGrid: document.getElementById('library-albums-grid'),
    albumsGridInner: document.getElementById('albums-grid-inner'),
    libraryDownloadsView: document.getElementById('library-downloads-view'),
    libraryDownloadsList: document.getElementById('library-downloads-list'),
    downloadsTotalCount: document.getElementById('downloads-total-count'),
    libraryArtistView: document.getElementById('library-artist-view'),
    artistBackBtn: document.getElementById('artist-back-btn'),
    artistViewAvatar: document.getElementById('artist-view-avatar'),
    artistViewName: document.getElementById('artist-view-name'),
    artistViewMeta: document.getElementById('artist-view-meta'),
    artistBtnPlayAll: document.getElementById('artist-btn-play-all'),
    artistBtnShuffle: document.getElementById('artist-btn-shuffle'),
    artistViewTracks: document.getElementById('artist-view-tracks'),
    libraryTitle: document.getElementById('library-title'),
    librarySubtitle: document.getElementById('library-subtitle'),

    // Dedicated Search View
    mainSearchInput: document.getElementById('main-search-input'),
    btnClearSearch: document.getElementById('btn-clear-search'),
    btnClearRecentSearches: document.getElementById('btn-clear-recent-searches'),
    searchRecentSection: document.getElementById('search-recent-section'),
    searchRecentChips: document.getElementById('search-recent-chips'),
    searchResultsSection: document.getElementById('search-results-section'),
    searchResultsList: document.getElementById('search-results-list'),
    searchResultsCount: document.getElementById('search-results-count'),
    searchEraChips: document.getElementById('search-era-chips'),

    toggleSettingsHaptics: document.getElementById('toggle-settings-haptics'),

    // Music & Storage in Settings
    btnImportFolderSettings: document.getElementById('btn-import-folder-settings'),
    localFolderInputSettings: document.getElementById('local-folder-input-settings'),
    btnClearSearchesSettings: document.getElementById('btn-clear-searches-settings'),
    btnClearDownloads: document.getElementById('btn-clear-downloads'),
    btnResetPlaylistsSettings: document.getElementById('btn-reset-playlists-settings'),

    // Quick Actions & Ambient Aura
    deckBtnEq: document.getElementById('deck-btn-eq'),
    deckEqLabel: document.getElementById('deck-eq-label'),
    deckBtnSleep: document.getElementById('deck-btn-sleep'),
    deckSleepBadge: document.getElementById('deck-sleep-badge'),
    deckSleepIcon: document.getElementById('deck-sleep-icon'),
    ambientAuraGlow: document.getElementById('ambient-aura-glow'),
    deckSpindleTribute: document.getElementById('deck-spindle-tribute'),
    homeBrandTribute: document.getElementById('home-brand-tribute'),
    deckBrandTribute: document.getElementById('deck-brand-tribute'),
    deckVisualizerCanvas: document.getElementById('deck-visualizer-canvas'),

    // Modals & Settings Extra
    modalAddToPlaylist: document.getElementById('modal-add-to-playlist'),
    btnCloseAddPlaylistModal: document.getElementById('btn-close-add-playlist-modal'),
    addPlaylistTrackSub: document.getElementById('add-playlist-track-sub'),
    btnQuickToggleLike: document.getElementById('btn-quick-toggle-like'),
    quickLikeCheckIcon: document.getElementById('quick-like-check-icon'),
    addPlaylistItemsList: document.getElementById('add-playlist-items-list'),
    inputNewPlaylistQuick: document.getElementById('input-new-playlist-quick'),
    btnCreatePlaylistQuick: document.getElementById('btn-create-playlist-quick'),

    modalCreatePlaylist: document.getElementById('modal-create-playlist'),
    btnCloseCreatePlaylistModal: document.getElementById('btn-close-create-playlist-modal'),
    inputCreatePlaylistName: document.getElementById('input-create-playlist-name'),
    inputCreatePlaylistDesc: document.getElementById('input-create-playlist-desc'),
    btnCancelCreatePlaylist: document.getElementById('btn-cancel-create-playlist'),
    btnSubmitCreatePlaylist: document.getElementById('btn-submit-create-playlist'),

    modalSleepTimer: document.getElementById('modal-sleep-timer'),
    btnCloseSleepModal: document.getElementById('btn-close-sleep-modal'),
    btnCancelSleepTimer: document.getElementById('btn-cancel-sleep-timer'),
    sleepModalCountdown: document.getElementById('sleep-modal-countdown'),
    modal999Tribute: document.getElementById('modal-999-tribute'),
    btnCloseTributeModal: document.getElementById('btn-close-tribute-modal'),
    btnTributePlayVault: document.getElementById('btn-tribute-play-vault'),
    settingsBtnSleep: document.getElementById('settings-btn-sleep'),
    settingsTributeLink: document.getElementById('settings-tribute-link'),
    settingsEqBadge: document.getElementById('settings-eq-badge'),
    settingsEqGrid: document.getElementById('settings-eq-grid'),

    // Settings & Theme
    toggleLightMode: document.getElementById('toggle-light-mode'),
    toggleFullscreen: document.getElementById('toggle-fullscreen')
  };

  let isDragging = false;
  let currentDeckMode = 'vinyl'; // 'vinyl' | 'video' | 'lyrics' | 'visualizer'
  let parsedLyrics = [];
  let lyricsHighlightInterval = null;
  let isOfflineMode = false;
  let currentPanelIndex = 0;

  // ═══ DEDICATED JUICE WRLD & GENRE RADIO STATIONS CATALOG ═══
  const GENRE_STATIONS = [
    { 
      name: "Juice WRLD: Official Discography", 
      title: "Juice WRLD: Official Discography", 
      thumb: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80", 
      count: "80+ Tracks", 
      tag: "OFFICIAL", 
      gradient: "from-purple-700 to-indigo-950" 
    },
    { 
      name: "Juice WRLD: The Lost Vault", 
      title: "Juice WRLD: The Lost Vault", 
      thumb: "https://images.unsplash.com/photo-1614113489855-66422ad300a4?w=500&q=80", 
      count: "80+ Grails", 
      tag: "THE VAULT", 
      gradient: "from-amber-700 to-red-950" 
    },
    { name: "Synthwave", title: "Synthwave & Retro", thumb: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80", count: "100 Tracks", tag: "RADIO", gradient: "from-pink-600 to-purple-900" },
    { name: "Ambient Chill", title: "Ambient & Space", thumb: "https://images.unsplash.com/photo-1614113489855-66422ad300a4?w=500&q=80", count: "100 Tracks", tag: "RADIO", gradient: "from-indigo-600 to-blue-900" },
    { name: "Lo-Fi Hip Hop", title: "Lo-Fi Study Beats", thumb: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80", count: "100 Tracks", tag: "RADIO", gradient: "from-amber-600 to-orange-900" },
    { name: "Indie Rock", title: "Indie & Alternative", thumb: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&q=80", count: "100 Tracks", tag: "RADIO", gradient: "from-emerald-600 to-teal-900" },
    { name: "Jazz Classics", title: "Late Night Jazz", thumb: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=500&q=80", count: "100 Tracks", tag: "RADIO", gradient: "from-yellow-600 to-amber-950" },
    { name: "R&B Soul", title: "R&B & Neo-Soul", thumb: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=500&q=80", count: "100 Tracks", tag: "RADIO", gradient: "from-rose-600 to-purple-950" },
    { name: "Electronic EDM", title: "Festival Dance EDM", thumb: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80", count: "100 Tracks", tag: "RADIO", gradient: "from-cyan-600 to-indigo-950" },
    { name: "Pop Hits 2025", title: "Global Top Hits", thumb: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&q=80", count: "100 Tracks", tag: "RADIO", gradient: "from-violet-600 to-fuchsia-950" }
  ];

  // ═══ 5-PANEL MAIN CAROUSEL ═══
  function updateActiveNavTab(index) {
    currentPanelIndex = index;
    navBtns.forEach((btn, i) => {
      const dot = btn.querySelector('.rounded-full');
      if (i === index) {
        btn.style.color = 'var(--text-primary)';
        if (dot) dot.style.background = 'var(--text-primary)';
      } else {
        btn.style.color = 'var(--text-tertiary)';
        if (dot) dot.style.background = 'transparent';
      }
    });

    if (miniPlayer) {
      const state = engine.getState();
      if (index === 2 || state.queue.length === 0) {
        miniPlayer.classList.add('hidden');
      } else {
        miniPlayer.classList.remove('hidden');
      }
    }
  }

  function scrollToPanel(index) {
    if (!appContainer) return;
    const boundedIndex = Math.max(0, Math.min(4, index));
    currentPanelIndex = boundedIndex;
    appContainer.scrollTo({ left: boundedIndex * appContainer.clientWidth, behavior: 'smooth' });
    updateActiveNavTab(boundedIndex);
  }

  navBtns.forEach((btn, index) => btn.addEventListener('click', () => {
    engine.playHaptic(500, 0.015);
    scrollToPanel(index);
  }));

  if (appContainer) {
    let scrollTimeout = null;
    appContainer.addEventListener('scroll', () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const pw = appContainer.clientWidth;
        if (pw > 0) {
          const idx = Math.round(appContainer.scrollLeft / pw);
          currentPanelIndex = idx;
          updateActiveNavTab(idx);
        }
      }, 40);
    }, { passive: true });

    // ═══ ACTIVE TOUCH SWIPE GESTURE CONTROLLER (Rabbit R1 & Mobile) ═══
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let isHorizontalGesture = false;

    appContainer.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
        isHorizontalGesture = false;
      }
    }, { passive: true });

    appContainer.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        const dx = e.touches[0].clientX - touchStartX;
        const dy = e.touches[0].clientY - touchStartY;
        if (!isHorizontalGesture && Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.2) {
          isHorizontalGesture = true;
        }
      }
    }, { passive: true });

    appContainer.addEventListener('touchend', (e) => {
      if (e.changedTouches.length === 1) {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        const dt = Date.now() - touchStartTime;

        // Snappy swipe detection
        const isQuickFlick = dt < 320 && Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy);
        const isSolidSwipe = Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.1;

        if (isQuickFlick || isSolidSwipe) {
          if (dx < 0 && currentPanelIndex < 4) {
            // Swipe Left -> Move Next
            scrollToPanel(currentPanelIndex + 1);
            engine.playHaptic(450, 0.015);
          } else if (dx > 0 && currentPanelIndex > 0) {
            // Swipe Right -> Move Prev
            scrollToPanel(currentPanelIndex - 1);
            engine.playHaptic(450, 0.015);
          }
        }
      }
    }, { passive: true });
  }

  // ═══ RABBIT R1 & MOBILE PHYSICAL HARDWARE INPUT BINDINGS ═══
  window.addEventListener('wheel', (e) => {
    // In Player Deck view (activeNavIndex === 2), wheel adjusts volume smoothly
    if (activeNavIndex === 2) {
      e.preventDefault();
      const state = engine.getState();
      const newVol = Math.max(0, Math.min(100, state.volume + (e.deltaY < 0 ? 5 : -5)));
      engine.setVolume(newVol);
      if (els.deckVolSlider) els.deckVolSlider.value = newVol;
      engine.playHaptic(450, 0.015);
    }
  }, { passive: false });

  // Rabbit R1 side buttons & Keyboard Controls (Space = Play/Pause, Arrows = Skip/Prev)
  window.addEventListener('keydown', (e) => {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    if (e.key === ' ' || e.key === 'MediaPlayPause') {
      e.preventDefault();
      engine.togglePlay();
      engine.playHaptic(600, 0.02);
    } else if (e.key === 'ArrowRight' || e.key === 'MediaTrackNext') {
      e.preventDefault();
      engine.next();
      engine.playHaptic(500, 0.02);
    } else if (e.key === 'ArrowLeft' || e.key === 'MediaTrackPrevious') {
      e.preventDefault();
      engine.previous();
      engine.playHaptic(500, 0.02);
    }
  });

  // ═══ AUDIO-REACTIVE CENTERPIECE CONTROLLER (5 iOS 28 & GOOGLE M3 EXPRESSIVE VISUALIZERS) ═══
  
  // ═══ CENTERPIECE VISUALIZER ENGINE (VINYL • CASSETTE • NEON) ═══
  const VISUALIZER_STYLES = ['vinyl', 'cassette', 'neon'];
  let currentCenterpieceStyle = localStorage.getItem('juicebx_center_style') || 'vinyl';
  if (!VISUALIZER_STYLES.includes(currentCenterpieceStyle)) currentCenterpieceStyle = 'vinyl';

  const deckDisplayVinyl = document.getElementById('deck-display-vinyl');
  const deckDisplayCassette = document.getElementById('deck-display-cassette');
  const deckDisplayNeon = document.getElementById('deck-display-neon');
  const deckStageWindow = document.getElementById('deck-stage-window');

  function setCenterpieceStyle(style) {
    if (!VISUALIZER_STYLES.includes(style)) style = 'vinyl';
    currentCenterpieceStyle = style;
    try { localStorage.setItem('juicebx_center_style', style); } catch(e) {}
    if (deckStageWindow) deckStageWindow.setAttribute('data-visualizer-style', style);

    if (currentDeckMode === 'vinyl') {
      if (deckDisplayVinyl) deckDisplayVinyl.classList.toggle('hidden', style !== 'vinyl');
      if (deckDisplayCassette) deckDisplayCassette.classList.toggle('hidden', style !== 'cassette');
      if (deckDisplayNeon) deckDisplayNeon.classList.toggle('hidden', style !== 'neon');
    }
  }

  function morphToNextVisualizer() {
    if (currentDeckMode !== 'vinyl') return;
    const currentIdx = VISUALIZER_STYLES.indexOf(currentCenterpieceStyle);
    const nextIdx = (currentIdx + 1) % VISUALIZER_STYLES.length;
    const nextStyle = VISUALIZER_STYLES[nextIdx];

    engine.playHaptic(650, 0.02);
    setCenterpieceStyle(nextStyle);
  }

  if (deckStageWindow) {
    deckStageWindow.addEventListener('click', (e) => {
      // Don't cycle if clicking on video or lyrics controls
      if (e.target.closest('#btn-lyric-nudge-back') || e.target.closest('#btn-lyric-nudge-fwd') || e.target.closest('#btn-lyric-sync-reset')) return;
      if (currentDeckMode === 'vinyl') {
        morphToNextVisualizer();
      }
    });
  }

  // ═══ UNIFIED PLAYER DECK MODE SWITCHER (SONG / VIDEO / LYRICS) ═══
  function setDeckMode(mode) {
    currentDeckMode = mode;
    els.deckModePills.forEach(pill => {
      if (pill.getAttribute('data-mode') === mode) {
        pill.className = 'deck-mode-pill active px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase transition-all shadow-sm';
        pill.style.background = 'var(--btn-active-bg)';
        pill.style.color = 'var(--btn-active-text)';
      } else {
        pill.className = 'deck-mode-pill px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase transition-all';
        pill.style.background = '';
        pill.style.color = 'var(--text-tertiary)';
      }
    });

    const state = engine.getState();
    const track = state.queue[state.currentIndex];

    if (mode === 'vinyl') {
      // 1. SONG MODE (Vinyl / Cassette / Neon)
      if (deckStageWindow) {
        deckStageWindow.style.width = 'min(280px, 74vw, 34vh)';
        deckStageWindow.style.height = 'min(280px, 74vw, 34vh)';
      }
      setCenterpieceStyle(currentCenterpieceStyle);
      if (els.deckDisplayVideo) {
        els.deckDisplayVideo.classList.add('hidden');
        els.deckDisplayVideo.style.opacity = '0';
        els.deckDisplayVideo.style.pointerEvents = 'none';
        els.deckDisplayVideo.style.position = 'absolute';
      }
      if (els.deckDisplayLyrics) els.deckDisplayLyrics.classList.add('hidden');
    } else if (mode === 'video') {
      // 2. VIDEO MODE (16:9 Cinema YouTube Window)
      if (deckDisplayVinyl) deckDisplayVinyl.classList.add('hidden');
      if (deckDisplayCassette) deckDisplayCassette.classList.add('hidden');
      if (deckDisplayNeon) deckDisplayNeon.classList.add('hidden');
      if (els.deckDisplayLyrics) els.deckDisplayLyrics.classList.add('hidden');
      if (deckStageWindow) {
        deckStageWindow.style.width = 'min(330px, 88vw, 42vh)';
        deckStageWindow.style.height = 'min(220px, 58vw, 28vh)';
      }
      if (els.deckDisplayVideo) {
        els.deckDisplayVideo.classList.remove('hidden');
        els.deckDisplayVideo.style.opacity = '1';
        els.deckDisplayVideo.style.pointerEvents = 'auto';
        els.deckDisplayVideo.style.position = 'relative';
        els.deckDisplayVideo.style.zIndex = '20';
      }
    } else if (mode === 'lyrics') {
      // 3. LYRICS MODE (Karaoke Canvas)
      if (deckDisplayVinyl) deckDisplayVinyl.classList.add('hidden');
      if (deckDisplayCassette) deckDisplayCassette.classList.add('hidden');
      if (deckDisplayNeon) deckDisplayNeon.classList.add('hidden');
      if (els.deckDisplayVideo) {
        els.deckDisplayVideo.classList.add('hidden');
        els.deckDisplayVideo.style.opacity = '0';
        els.deckDisplayVideo.style.pointerEvents = 'none';
        els.deckDisplayVideo.style.position = 'absolute';
      }
      if (deckStageWindow) {
        deckStageWindow.style.width = 'min(330px, 86vw, 42vh)';
        deckStageWindow.style.height = 'min(330px, 86vw, 42vh)';
      }
      if (els.deckDisplayLyrics) els.deckDisplayLyrics.classList.remove('hidden');
      if (track) loadTrackLyrics(track.title, track.artist);
    }
  }

  els.deckModePills.forEach(pill => {
    pill.addEventListener('click', () => {
      const mode = pill.getAttribute('data-mode') || 'vinyl';
      setDeckMode(mode);
    });
  });

  // ═══ 1. 🍏 iOS 28 SIRI DYNAMIC LIQUID GLASS ORB RENDERER ═══
  function drawFluidOrb(ctx, w, h, levels, isPlaying) {
    ctx.clearRect(0, 0, w, h);

    // Deep Apple spatial obsidian background
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 1.3);
    bgGrad.addColorStop(0, '#120d20');
    bgGrad.addColorStop(0.55, '#080511');
    bgGrad.addColorStop(1, '#020106');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    orbPhase += isPlaying ? 0.02 + levels.energy * 0.04 : 0.008;

    // Ambient Chromatic Aura behind Orb
    const auraR = isPlaying ? 85 + levels.bass * 65 : 75;
    const auraGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, auraR);
    auraGrad.addColorStop(0, `rgba(255, 79, 0, ${isPlaying ? 0.45 + levels.bass * 0.35 : 0.2})`);
    auraGrad.addColorStop(0.5, `rgba(168, 85, 247, ${isPlaying ? 0.35 + levels.mid * 0.25 : 0.15})`);
    auraGrad.addColorStop(0.85, `rgba(6, 182, 212, ${isPlaying ? 0.25 + levels.treble * 0.2 : 0.08})`);
    auraGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, auraR, 0, Math.PI * 2);
    ctx.fill();

    // Floating Glass Dispersion Particles
    orbDust.forEach(pt => {
      pt.angle += pt.speed * (isPlaying ? 1 + levels.energy * 1.5 : 0.8);
      const px = cx + Math.cos(pt.angle) * (pt.dist + (isPlaying ? levels.bass * 25 : 0));
      const py = cy + Math.sin(pt.angle) * (pt.dist * 0.7 + (isPlaying ? levels.mid * 20 : 0));
      
      ctx.beginPath();
      ctx.arc(px, py, pt.size * (isPlaying ? 1 + levels.treble * 0.8 : 1), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${pt.alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#06b6d4';
      ctx.fill();
    });

    // Dynamic Spline Harmonic Liquid Glass Orb
    const baseRadius = isPlaying ? 54 + levels.bass * 22 : 50;
    const vertices = 48;
    const points = [];

    for (let i = 0; i < vertices; i++) {
      const angle = (i / vertices) * Math.PI * 2;
      const wave1 = Math.sin(angle * 3 + orbPhase * 2) * (isPlaying ? 10 * levels.bass : 3);
      const wave2 = Math.cos(angle * 5 - orbPhase * 3) * (isPlaying ? 8 * levels.mid : 2);
      const wave3 = Math.sin(angle * 7 + orbPhase * 1.5) * (isPlaying ? 6 * levels.treble : 1.5);
      const r = baseRadius + wave1 + wave2 + wave3;
      points.push({
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r
      });
    }

    // Fill Liquid Glass Gradient Core
    ctx.save();
    ctx.beginPath();
    ctx.moveTo((points[0].x + points[vertices - 1].x) / 2, (points[0].y + points[vertices - 1].y) / 2);
    for (let i = 0; i < vertices; i++) {
      const next = points[(i + 1) % vertices];
      const midX = (points[i].x + next.x) / 2;
      const midY = (points[i].y + next.y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
    }
    ctx.closePath();

    const orbGrad = ctx.createLinearGradient(cx - baseRadius, cy - baseRadius, cx + baseRadius, cy + baseRadius);
    orbGrad.addColorStop(0, '#ff4f00');
    orbGrad.addColorStop(0.35, '#ec4899');
    orbGrad.addColorStop(0.7, '#8b5cf6');
    orbGrad.addColorStop(1, '#06b6d4');
    ctx.fillStyle = orbGrad;
    ctx.shadowBlur = isPlaying ? 35 : 18;
    ctx.shadowColor = '#ec4899';
    ctx.fill();

    // Specular Glass Caustic Edge Rim
    ctx.lineWidth = isPlaying ? 2.5 : 1.8;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#ffffff';
    ctx.stroke();
    ctx.restore();

    // Apple Specular Top Highlight Crescent
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy - baseRadius * 0.42, baseRadius * 0.55, baseRadius * 0.24, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.fill();
    ctx.restore();
  }

  // ═══ 2. 🎨 GOOGLE MATERIAL 3 EXPRESSIVE DYNAMIC FLUID RIBBONS ═══
  function drawM3Expressive(ctx, w, h, levels, isPlaying) {
    ctx.clearRect(0, 0, w, h);

    // M3 Expressive Deep Dark Background
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w / 1.2);
    bgGrad.addColorStop(0, '#150c18');
    bgGrad.addColorStop(0.6, '#0b050d');
    bgGrad.addColorStop(1, '#030104');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    m3Phase += isPlaying ? 0.025 + levels.energy * 0.045 : 0.01;

    // 4 Dynamic Interwoven M3 Tonal Ribbons
    const ribbons = [
      { color: 'rgba(255, 109, 0, 0.7)', yBase: h * 0.45, amp: 28, freq: 0.014, speed: 1.2, width: 6 },
      { color: 'rgba(245, 0, 87, 0.65)', yBase: h * 0.52, amp: 34, freq: 0.018, speed: -1.0, width: 8 },
      { color: 'rgba(124, 77, 255, 0.7)', yBase: h * 0.58, amp: 26, freq: 0.012, speed: 1.5, width: 7 },
      { color: 'rgba(0, 229, 255, 0.6)', yBase: h * 0.65, amp: 30, freq: 0.022, speed: -1.3, width: 5 }
    ];

    ribbons.forEach(rb => {
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = rb.width * (isPlaying ? 1 + levels.energy * 0.5 : 1);
      ctx.strokeStyle = rb.color;
      ctx.shadowBlur = isPlaying ? 24 : 10;
      ctx.shadowColor = rb.color;
      ctx.lineCap = 'round';

      const dynAmp = isPlaying ? rb.amp + levels.bass * 30 : 12;
      for (let x = 0; x <= w; x += 4) {
        const y = rb.yBase + Math.sin(x * rb.freq + m3Phase * rb.speed) * dynAmp * Math.cos(x * 0.005 + m3Phase * 0.4);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    });

    // M3 Expressive Floating Audio Pills at Bottom
    const numPills = 24;
    const pillSpacing = w / (numPills + 1);
    for (let i = 0; i < numPills; i++) {
      const px = (i + 1) * pillSpacing;
      const freqVal = (levels.frequencies && levels.frequencies[i * 2]) ? levels.frequencies[i * 2] / 255 : (Math.sin(i * 0.4 + m3Phase) * 0.5 + 0.5) * (isPlaying ? levels.energy : 0.2);
      const pillH = isPlaying ? 8 + freqVal * 55 : 6;
      const py = h * 0.88 - pillH / 2;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(px - 3, py, 6, pillH, 3);
      const pillGrad = ctx.createLinearGradient(px, py, px, py + pillH);
      pillGrad.addColorStop(0, '#ff4081');
      pillGrad.addColorStop(1, '#7c4dff');
      ctx.fillStyle = pillGrad;
      ctx.shadowBlur = isPlaying && freqVal > 0.4 ? 12 : 2;
      ctx.shadowColor = '#ff4081';
      ctx.fill();
      ctx.restore();
    }
  }

  // ═══ 3. 🫧 SPATIAL FLUID GLASS METABALLS & AUDIO PLASMA ═══
  function drawSpatialBlobs(ctx, w, h, levels, isPlaying) {
    ctx.clearRect(0, 0, w, h);

    // Deep spatial dark blue background
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w / 1.3);
    bgGrad.addColorStop(0, '#0a1020');
    bgGrad.addColorStop(0.6, '#040710');
    bgGrad.addColorStop(1, '#010206');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    blobPhase += isPlaying ? 0.02 + levels.energy * 0.035 : 0.008;

    spatialBlobs.forEach((b, idx) => {
      let bx, by, br;
      if (idx === 0) {
        // Central Sub-Bass Core Blob
        bx = cx + (isPlaying ? Math.sin(blobPhase * 1.5) * 8 * levels.energy : 0);
        by = cy + (isPlaying ? Math.cos(blobPhase * 1.2) * 6 * levels.energy : 0);
        br = isPlaying ? b.baseR + levels.bass * 26 : b.baseR;
      } else {
        // Orbiting Satellite Spatial Spheres
        const angle = blobPhase * b.speed * 80 + (idx * Math.PI * 0.5);
        const dist = b.orbitR + (isPlaying ? levels.mid * 20 : 0);
        bx = cx + Math.cos(angle) * dist;
        by = cy + Math.sin(angle) * dist * 0.7;
        br = isPlaying ? b.baseR + (idx % 2 === 0 ? levels.treble * 12 : levels.mid * 10) : b.baseR;
      }

      ctx.save();
      // Outer Glow Halo
      ctx.beginPath();
      ctx.arc(bx, by, br * 1.3, 0, Math.PI * 2);
      ctx.fillStyle = idx === 0 ? 'rgba(255, 79, 0, 0.15)' : 'rgba(6, 182, 212, 0.12)';
      ctx.fill();

      // Fluid Glass Body
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      const bGrad = ctx.createLinearGradient(bx - br, by - br, bx + br, by + br);
      bGrad.addColorStop(0, b.color1);
      bGrad.addColorStop(1, b.color2);
      ctx.fillStyle = bGrad;
      ctx.shadowBlur = isPlaying ? 24 : 8;
      ctx.shadowColor = b.color1;
      ctx.fill();

      // Specular Glass Top Ring
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Glass Crescent Glint
      ctx.beginPath();
      ctx.ellipse(bx, by - br * 0.4, br * 0.5, br * 0.22, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.fill();
      ctx.restore();
    });
  }

  // ═══ 4. ⚡ 2028 PRECISION M3 HI-FI FLUID SPECTRUM ═══
  function drawM3HiFiSpectrum(ctx, w, h, levels, isPlaying) {
    ctx.clearRect(0, 0, w, h);

    // Obsidian Hi-Fi Studio Background
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w / 1.3);
    bgGrad.addColorStop(0, '#100c14');
    bgGrad.addColorStop(0.6, '#060408');
    bgGrad.addColorStop(1, '#020104');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    const numBars = 36;
    const barWidth = 6;
    const gap = (w - (numBars * barWidth)) / (numBars + 1);
    const bottomY = h * 0.72;

    // Transient Particle Sparks on Bass Hits
    if (isPlaying && levels.bass > 0.65 && hifiSparks.length < 35) {
      for (let s = 0; s < 4; s++) {
        hifiSparks.push({
          x: w * 0.2 + Math.random() * (w * 0.6),
          y: bottomY - 40 - Math.random() * 60,
          vx: (Math.random() - 0.5) * 2,
          vy: -2 - Math.random() * 4,
          life: 1.0,
          color: Math.random() > 0.5 ? '#ff4f00' : '#ec4899'
        });
      }
    }

    // Render Sparks
    for (let s = hifiSparks.length - 1; s >= 0; s--) {
      const sp = hifiSparks[s];
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.life -= 0.035;
      if (sp.life <= 0) {
        hifiSparks.splice(s, 1);
        continue;
      }
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, 2 * sp.life, 0, Math.PI * 2);
      ctx.fillStyle = sp.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = sp.color;
      ctx.fill();
    }

    // 36 Google M3 Rounded Spectrum Bars & Gravity Deceleration Caps
    for (let i = 0; i < numBars; i++) {
      const x = gap + i * (barWidth + gap);
      const rawLevel = (levels.frequencies && levels.frequencies[i * 3]) ? levels.frequencies[i * 3] / 255 : (Math.sin(i * 0.3) * 0.5 + 0.5) * (isPlaying ? levels.energy : 0.15);
      const targetH = isPlaying ? Math.max(6, rawLevel * 125 * (1 + levels.bass * 0.3)) : 6;
      
      const peak = hifiPeaks[i];
      if (targetH > peak.y) {
        peak.y = targetH;
        peak.vel = 0;
      } else {
        peak.vel += 0.45; // Gravity
        peak.y = Math.max(0, peak.y - peak.vel);
      }

      const y = bottomY - targetH;

      // Bar Body (Google M3 Pill Shape)
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, targetH, 3);
      const barGrad = ctx.createLinearGradient(x, y, x, bottomY);
      barGrad.addColorStop(0, '#ff4f00');
      barGrad.addColorStop(0.5, '#ec4899');
      barGrad.addColorStop(1, '#8b5cf6');
      ctx.fillStyle = barGrad;
      ctx.shadowBlur = isPlaying && rawLevel > 0.4 ? 12 : 2;
      ctx.shadowColor = '#ff4f00';
      ctx.fill();
      ctx.restore();

      // Precision Floating Peak Cap
      const peakY = bottomY - peak.y - 4;
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, peakY, barWidth, 2.5, 1.2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#ffffff';
      ctx.fill();
      ctx.restore();
    }

    // Polished Glass Reflection Baseline
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, bottomY + 2);
    ctx.lineTo(w, bottomY + 2);
    ctx.stroke();
    ctx.restore();
  }

  // ═══ 60FPS AUDIO REACTIVITY RENDER LOOP ═══
  function updateAudioReactivity() {
    const state = engine.getState();
    const levels = engine.getAudioLevels ? engine.getAudioLevels() : { bass: 0, mid: 0, treble: 0, energy: 0, frequencies: [] };
    const isPlaying = state.isPlaying;

    if (currentDeckMode === 'vinyl') {
      // 1. 🍏 iOS 28 Siri Dynamic Liquid Glass Orb
      if (currentCenterpieceStyle === 'orb' && orbCtx && orbCanvas) {
        drawFluidOrb(orbCtx, orbCanvas.width, orbCanvas.height, levels, isPlaying);
      }

      // 2. 🎨 Google Material 3 Expressive Dynamic Fluid Ribbons
      if (currentCenterpieceStyle === 'm3' && m3Ctx && m3Canvas) {
        drawM3Expressive(m3Ctx, m3Canvas.width, m3Canvas.height, levels, isPlaying);
      }

      // 3. 🫧 Spatial Fluid Glass Metaballs & Audio Plasma
      if (currentCenterpieceStyle === 'blobs' && blobsCtx && blobsCanvas) {
        drawSpatialBlobs(blobsCtx, blobsCanvas.width, blobsCanvas.height, levels, isPlaying);
      }

      // 4. ⚡ 2028 Precision M3 Hi-Fi Fluid Spectrum
      if (currentCenterpieceStyle === 'hifi' && hifiCtx && hifiCanvas) {
        drawM3HiFiSpectrum(hifiCtx, hifiCanvas.width, hifiCanvas.height, levels, isPlaying);
      }

      // 1. 💽 iOS Dynamic Luxe Holographic Vinyl Platter
      if (currentCenterpieceStyle === 'vinyl' && els.deckVinyl) {
        const wrapper = document.getElementById('deck-vinyl-wrapper');
        if (isPlaying) {
          els.deckVinyl.classList.remove('paused');
          els.deckVinyl.style.animationPlayState = 'running';
          if (wrapper) {
            const scale = 1.0 + levels.bass * 0.05;
            wrapper.style.transform = `scale(${scale})`;
          }
        } else {
          els.deckVinyl.classList.add('paused');
          els.deckVinyl.style.animationPlayState = 'paused';
          if (wrapper) wrapper.style.transform = 'scale(0.96)';
        }
      }
    }

    requestAnimationFrame(updateAudioReactivity);
  }

  requestAnimationFrame(updateAudioReactivity);

  // ═══ VIDEO STAGE TAP-TO-PLAY/PAUSE ═══
  const videoTapOverlay = document.getElementById('deck-video-tap-overlay');
  const videoTapIndicator = document.getElementById('deck-video-tap-indicator');
  const videoTapIcon = document.getElementById('deck-video-tap-icon');

  if (videoTapOverlay) {
    videoTapOverlay.addEventListener('click', () => {
      engine.togglePlay();
      const state = engine.getState();
      if (videoTapIndicator && videoTapIcon) {
        videoTapIcon.className = state.isPlaying ? 'ph-fill ph-play' : 'ph-fill ph-pause';
        videoTapIndicator.style.opacity = '1';
        videoTapIndicator.style.transform = 'scale(1)';
        setTimeout(() => {
          videoTapIndicator.style.opacity = '0';
          videoTapIndicator.style.transform = 'scale(0.75)';
        }, 350);
      }
    });
  }

  // ═══ LOCAL FOLDER IMPORT & PICKER ═══
  if (els.btnImportFolder && els.localFolderInput) {
    els.btnImportFolder.addEventListener('click', () => {
      els.localFolderInput.click();
    });

    els.localFolderInput.addEventListener('change', async (e) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        if (els.librarySubtitle) els.librarySubtitle.innerText = `Importing ${files.length} audio files...`;
        const imported = await engine.importLocalAudioFiles(files);
        if (imported.length > 0) {
          if (els.librarySubtitle) els.librarySubtitle.innerText = `${imported.length} local tracks loaded`;
          refreshCurrentLibrary();
          scrollToPanel(2); // Jump to Vinyl Deck
        }
      }
    });
  }

  // ═══ PLAY ALL / SHUFFLE ALL ═══
  if (els.btnPlayAll) {
    els.btnPlayAll.addEventListener('click', () => {
      const state = engine.getState();
      if (state.queue.length > 0) {
        engine.playTrack(0);
        scrollToPanel(2);
      }
    });
  }

  if (els.btnShuffleAll) {
    els.btnShuffleAll.addEventListener('click', () => {
      const state = engine.getState();
      if (state.queue.length > 0) {
        engine.toggleShuffle();
        const randIdx = Math.floor(Math.random() * state.queue.length);
        engine.playTrack(randIdx);
        scrollToPanel(2);
      }
    });
  }

  // ═══ DEDICATED SEARCH CONTROLLER ═══
  const DEFAULT_RECENT_SEARCHES = ["Juice WRLD", "The Weeknd", "M83", "Harry Styles", "Joji", "Daft Punk", "Kavinsky"];

  function getRecentSearches() {
    try {
      const s = localStorage.getItem('juicebx_recent_searches');
      return s ? JSON.parse(s) : DEFAULT_RECENT_SEARCHES;
    } catch(e) {
      return DEFAULT_RECENT_SEARCHES;
    }
  }

  function saveRecentSearch(q) {
    if (!q || !q.trim()) return;
    let recent = getRecentSearches().filter(item => item.toLowerCase() !== q.trim().toLowerCase());
    recent.unshift(q.trim());
    if (recent.length > 8) recent = recent.slice(0, 8);
    localStorage.setItem('juicebx_recent_searches', JSON.stringify(recent));
    renderRecentSearchChips();
  }

  function renderRecentSearchChips() {
    if (!els.searchRecentChips) return;
    const list = getRecentSearches();
    if (list.length === 0) {
      els.searchRecentChips.innerHTML = '<span class="text-xs" style="color: var(--text-tertiary);">No recent searches</span>';
      return;
    }
    els.searchRecentChips.innerHTML = list.map(item => `
      <button class="recent-chip px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all glass-input" style="color: var(--text-primary);">
        <i class="ph-bold ph-magnifying-glass text-[11px]" style="color: var(--text-tertiary);"></i>
        <span>${item}</span>
      </button>
    `).join('');

    els.searchRecentChips.querySelectorAll('.recent-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.querySelector('span').innerText.trim();
        if (els.mainSearchInput) {
          els.mainSearchInput.value = query;
          executeLiveSearch(query);
        }
      });
    });
  }

  if (els.btnClearRecentSearches) {
    els.btnClearRecentSearches.addEventListener('click', () => {
      localStorage.setItem('juicebx_recent_searches', JSON.stringify([]));
      engine.playHaptic(400, 0.02);
      renderRecentSearchChips();
    });
  }

  renderRecentSearchChips();

  async function executeLiveSearch(query) {
    const searchResultsSec = document.getElementById('search-results-section');
    const searchRecentSec = document.getElementById('search-recent-section');

    if (!query || !query.trim()) {
      if (searchResultsSec) searchResultsSec.classList.add('hidden');
      if (searchRecentSec) searchRecentSec.classList.remove('hidden');
      if (els.searchResultsList) els.searchResultsList.innerHTML = '';
      if (els.searchResultsCount) els.searchResultsCount.innerText = '';
      if (els.btnClearSearch) els.btnClearSearch.classList.add('hidden');
      return;
    }

    if (searchResultsSec) searchResultsSec.classList.remove('hidden');
    if (searchRecentSec) searchRecentSec.classList.add('hidden');
    if (els.btnClearSearch) els.btnClearSearch.classList.remove('hidden');
    if (els.searchResultsList) {
      els.searchResultsList.innerHTML = '<div class="text-center py-8 text-xs font-bold" style="color: var(--text-tertiary);"><i class="ph-bold ph-spinner animate-spin text-lg block mb-2 mx-auto"></i>Searching YouTube for standalone songs...</div>';
    }

    const qKey = query.trim().toLowerCase();
    let results = [];
    if (clientSearchCache.has(qKey)) {
      results = clientSearchCache.get(qKey);
    } else {
      results = await engine.search(query);
      if (results && results.length > 0) {
        clientSearchCache.set(qKey, results);
      }
    }

    renderSearchResults(results, query);
  }

  function renderSearchResults(tracks, query) {
    if (!els.searchResultsList) return;

    if (!tracks || tracks.length === 0) {
      els.searchResultsList.innerHTML = `<div class="text-center py-8 text-xs font-bold" style="color: var(--text-tertiary);">No matching standalone songs found for "${query}".</div>`;
      if (els.searchResultsCount) els.searchResultsCount.innerText = '0 results';
      return;
    }

    if (els.searchResultsCount) els.searchResultsCount.innerText = `${tracks.length} songs`;
    const downloads = engine.getDownloads();

    els.searchResultsList.innerHTML = tracks.map((t, i) => {
      const isSaved = downloads.some(d => d.id === t.id);
      const isFav = engine.isFavorite(t.id);
      return `
        <div class="search-result-item flex items-center justify-between p-2.5 rounded-2xl mb-2 glass-card cursor-pointer active:scale-[0.99] transition-all" data-search-idx="${i}">
          <div class="flex items-center space-x-3 overflow-hidden flex-1 mr-2">
            <div class="w-[46px] h-[46px] rounded-[14px] overflow-hidden flex-shrink-0 relative shadow-sm" style="background: var(--bg-card-solid);">
              <img src="${t.thumb}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80'">
            </div>
            <div class="overflow-hidden flex-1">
              <div class="font-bold text-[14px] truncate" style="color: var(--text-primary);">${t.title}</div>
              <div class="flex items-center gap-1.5 mt-0.5">
                <span class="font-medium text-[11px] truncate" style="color: var(--text-secondary);">${t.artist}</span>
                <span class="text-[10px] font-bold px-1.5 py-0.2 rounded-full" style="background: var(--bg-input); color: var(--text-tertiary);">${t.duration || ''}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <button class="btn-search-like w-7 h-7 rounded-full flex items-center justify-center active:scale-75 transition-all" data-track-id="${t.id}" title="Favorite">
              <i class="${isFav ? 'ph-fill ph-heart text-pink-500' : 'ph-bold ph-heart'}" style="${isFav ? '' : 'color: var(--text-tertiary);'}"></i>
            </button>
            <button class="btn-search-add-pl w-7 h-7 rounded-full flex items-center justify-center active:scale-75 transition-all text-xs" data-track-id="${t.id}" title="Add to Playlist" style="color: var(--text-tertiary);">
              <i class="ph-bold ph-plus"></i>
            </button>
            <button class="btn-search-download w-7 h-7 rounded-full flex items-center justify-center active:scale-75 transition-all" data-track-id="${t.id}" title="Download song">
              <i class="${isSaved ? 'ph-fill ph-check-circle text-emerald-400' : 'ph-bold ph-download-simple'}" style="${isSaved ? '' : 'color: var(--text-tertiary);'}"></i>
            </button>
            <button class="btn-search-play px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1 active:scale-95 transition-transform shadow-md" style="background: var(--btn-active-bg); color: var(--btn-active-text);">
              <i class="ph-fill ph-play text-xs"></i> Play
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Event listeners on search result items
    els.searchResultsList.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.closest('.btn-search-download') || e.target.closest('.btn-search-like') || e.target.closest('.btn-search-add-pl')) return;
        const idx = parseInt(item.getAttribute('data-search-idx'));
        const chosenTrack = tracks[idx];
        if (chosenTrack) {
          saveRecentSearch(query);
          const state = engine.getState();
          const newQueue = [chosenTrack, ...state.queue.filter(t => t.id !== chosenTrack.id)];
          engine.setQueue(newQueue, true);
          scrollToPanel(2); // Jump straight to Player Deck
        }
      });
    });

    els.searchResultsList.querySelectorAll('.btn-search-like').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const tid = btn.getAttribute('data-track-id');
        const track = tracks.find(t => t.id === tid);
        if (track) {
          const isFav = engine.toggleFavorite(track);
          engine.playHaptic(600, 0.02);
          btn.innerHTML = `<i class="${isFav ? 'ph-fill ph-heart text-pink-500' : 'ph-bold ph-heart'}" style="${isFav ? '' : 'color: var(--text-tertiary);'}"></i>`;
        }
      });
    });

    els.searchResultsList.querySelectorAll('.btn-search-add-pl').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const tid = btn.getAttribute('data-track-id');
        const track = tracks.find(t => t.id === tid);
        if (track) openAddToPlaylistModal(track);
      });
    });

    els.searchResultsList.querySelectorAll('.btn-search-download').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const tid = btn.getAttribute('data-track-id');
        const track = tracks.find(t => t.id === tid);
        if (track) {
          engine.downloadTrack(track);
          btn.innerHTML = '<i class="ph-fill ph-check-circle text-emerald-400 text-base"></i>';
        }
      });
    });
  }

  if (els.mainSearchInput) {
    let searchDebounce = null;
    els.mainSearchInput.addEventListener('input', () => {
      clearTimeout(searchDebounce);
      const q = els.mainSearchInput.value.trim();
      searchDebounce = setTimeout(() => {
        if (q.length >= 2) {
          executeLiveSearch(q);
        } else if (q.length === 0) {
          executeLiveSearch('');
        }
      }, 200);
    });

    els.mainSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const q = els.mainSearchInput.value.trim();
        if (q) {
          saveRecentSearch(q);
          executeLiveSearch(q);
        }
      }
    });
  }

  if (els.btnClearSearch) {
    els.btnClearSearch.addEventListener('click', () => {
      if (els.mainSearchInput) {
        els.mainSearchInput.value = '';
        els.mainSearchInput.focus();
      }
      executeLiveSearch('');
    });
  }

  // ═══ GENRES RADIO GRID ═══
  function renderGenresGrid() {
    if (!els.genresGridInner) return;
    if (els.librarySubtitle) els.librarySubtitle.innerText = `${GENRE_STATIONS.length} Radio Stations`;
    els.genresGridInner.innerHTML = GENRE_STATIONS.map(g => `
      <div class="genre-station-card glass-card p-3 text-center cursor-pointer active:scale-95 transition-all relative overflow-hidden group" data-genre="${g.name}">
        <div class="relative w-full aspect-square rounded-[18px] overflow-hidden mb-2.5 shadow-inner bg-gradient-to-tr ${g.gradient}">
          <img src="${g.thumb}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.style.opacity='0'">
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-2">
            <span class="text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-500/80 text-white flex items-center gap-1">
              <i class="ph-fill ph-broadcast animate-pulse"></i> ${g.tag}
            </span>
          </div>
        </div>
        <div class="font-black text-sm truncate" style="color: var(--text-primary);">${g.title}</div>
        <div class="text-[11px] font-medium mt-0.5" style="color: var(--text-tertiary);">${g.count} • Dynamic Radio</div>
      </div>
    `).join('');

    els.genresGridInner.querySelectorAll('.genre-station-card').forEach(card => {
      card.addEventListener('click', () => {
        const genre = card.getAttribute('data-genre') || 'Popular';
        launchGenreRadio(genre);
      });
    });
  }

  // ═══ INSTANT TOP 100 GENRE SHUFFLES SYSTEM (ZERO LAG / ZERO BLOCKING TEXT) ═══
  window.launchGenreShuffle = function(genreKey) {
    engine.playHaptic(600, 0.03);

    let tracks = [];

    // 1. Check Pre-cached Top 100 Shuffles catalog
    if (typeof TOP_SHUFFLES_CATALOG !== 'undefined' && TOP_SHUFFLES_CATALOG[genreKey]) {
      tracks = TOP_SHUFFLES_CATALOG[genreKey].tracks || [];
    } else if (genreKey === "Juice WRLD: Official Discography" || genreKey === "official_discography") {
      tracks = (typeof TOP_SHUFFLES_CATALOG !== 'undefined' && TOP_SHUFFLES_CATALOG["Juice WRLD: Official Discography"]) 
        ? TOP_SHUFFLES_CATALOG["Juice WRLD: Official Discography"].tracks 
        : (typeof JUICE_OFFICIAL_CATALOG !== 'undefined' ? JUICE_OFFICIAL_CATALOG : []);
    } else if (genreKey === "Juice WRLD: The Lost Vault" || genreKey === "the_lost_vault") {
      tracks = (typeof TOP_SHUFFLES_CATALOG !== 'undefined' && TOP_SHUFFLES_CATALOG["Juice WRLD: The Lost Vault"])
        ? TOP_SHUFFLES_CATALOG["Juice WRLD: The Lost Vault"].tracks
        : (typeof JUICE_UNRELEASED_CATALOG !== 'undefined' ? JUICE_UNRELEASED_CATALOG : []);
    }

    // Fallback: If not found in catalog, fetch from LAN server or search
    if (!tracks || tracks.length === 0) {
      launchGenreRadio(genreKey);
      return;
    }

    // Instant Fisher-Yates Random Shuffle
    const shuffled = tracks.map(t => ({ ...t }));
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Immediately start playing song #1 and load full shuffled playlist (0ms latency)
    engine.setQueue(shuffled, true);
    scrollToPanel(2); // Jump straight to Hero Player Deck
    setDeckMode('vinyl');
  };
  const launchGenreShuffle = window.launchGenreShuffle;

  // ═══ LAUNCH GENRE RADIO (DYNAMIC FALLBACK) ═══
  window.launchGenreRadio = async function(genreName) {
    try {
      let tracks = [];

      // 1. DEDICATED THE LOST VAULT API INTEGRATION (2,500+ Unreleased Songs)
      if (genreName === "Juice WRLD: The Lost Vault" || genreName === "the_lost_vault") {
        try {
          const maxPage = 127; // Approx 2554 songs / 20
          const randomPage = Math.floor(Math.random() * maxPage) + 1;
          const res = await fetch(`https://juicewrldapi.com/juicewrld/songs/?page=${randomPage}`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.results && data.results.length > 0) {
              tracks = data.results.map(song => ({
                id: `jwapi-${song.id}`,
                title: song.name,
                artist: "Juice WRLD (Unreleased)",
                duration: song.length || "3:00",
                seconds: parseInt((song.length || "3:00").split(':')[0]) * 60 + parseInt((song.length || "3:00").split(':')[1] || 0),
                thumb: song.image_url ? `https://juicewrldapi.com${song.image_url}` : "https://images.unsplash.com/photo-1614113489855-66422ad300a4?w=500&q=80",
                audioUrl: song.path ? `https://juicewrldapi.com/juicewrld/files/download/?path=${encodeURIComponent(song.path)}` : null,
                isDirectAudio: !!song.path,
                hasLyrics: !!song.lyrics || !!song.synced_lyrics,
                rawLyrics: song.synced_lyrics || song.lyrics || null
              })).filter(t => t.audioUrl); // Only keep playable tracks
            }
          }
        } catch(e) {
          console.warn("Vault API Failed:", e);
        }
      }

      // 2. STANDARD RADIO FALLBACK
      if (!tracks || tracks.length === 0) {
        const res = await fetch(`/api/genre_radio?genre=${encodeURIComponent(genreName)}`);
        const data = res.ok ? await res.json() : null;
        tracks = (data?.tracks && data.tracks.length > 0) ? data.tracks : await engine.search(`${genreName} hits`);
      }

      if (tracks && tracks.length > 0) {
        // Guaranteed fresh Fisher-Yates random shuffle on every single radio launch
        const shuffled = tracks.map(t => ({ ...t }));
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        engine.setQueue(shuffled, true);
        scrollToPanel(2);
        setDeckMode('vinyl');
        return shuffled;
      }
    } catch(e) {
      console.warn("Could not launch genre radio:", e);
    }
    return [];
  };
  const launchGenreRadio = window.launchGenreRadio;

  // Wire up all Home Genre Shuffle Cards
  document.querySelectorAll('#view-home .genre-card').forEach(card => {
    card.addEventListener('click', () => {
      const genre = card.getAttribute('data-genre');
      if (genre) launchGenreShuffle(genre);
    });
  });

  // ═══ ARTIST DETAIL SUB-VIEW ═══
  async function openArtistDetail(artistName, artistAvatar = null) {
    if (!els.libraryArtistView) return;
    
    if (els.libraryList) els.libraryList.classList.add('hidden');
    if (els.libraryArtistsGrid) els.libraryArtistsGrid.classList.add('hidden');
    if (els.libraryAlbumsGrid) els.libraryAlbumsGrid.classList.add('hidden');
    if (els.libraryGenresGrid) els.libraryGenresGrid.classList.add('hidden');
    els.libraryArtistView.classList.remove('hidden');

    if (els.artistViewName) els.artistViewName.innerText = artistName;
    const initialsEl = document.getElementById('artist-view-avatar-initials');
    const avatarBox = document.getElementById('artist-view-avatar-box');
    const initials = artistName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    const grad = ARTIST_GRADIENTS[artistName] || 'from-purple-600 via-indigo-700 to-black';
    if (initialsEl) initialsEl.innerText = initials;
    if (avatarBox) avatarBox.className = `w-16 h-16 rounded-full overflow-hidden shadow-md border-2 flex items-center justify-center bg-gradient-to-tr ${grad} shrink-0`;

    if (els.artistViewTracks) els.artistViewTracks.innerHTML = '<div class="text-center py-8 text-xs font-bold" style="color: var(--text-tertiary);">Loading artist tracks...</div>';

    try {
      const res = await fetch(`/api/artist?name=${encodeURIComponent(artistName)}`);
      const data = res.ok ? await res.json() : null;
      const tracks = data?.tracks || await engine.search(`${artistName} songs`);

      if (tracks && tracks.length > 0) {
        if (els.artistViewMeta) els.artistViewMeta.innerText = `${tracks.length} popular tracks`;
        renderArtistTracks(tracks);

        if (els.artistBtnPlayAll) {
          els.artistBtnPlayAll.onclick = () => {
            engine.setQueue(tracks, true);
            scrollToPanel(2);
          };
        }
        if (els.artistBtnShuffle) {
          els.artistBtnShuffle.onclick = () => {
            engine.setQueue(tracks, false);
            engine.toggleShuffle();
            engine.playTrack(0);
            scrollToPanel(2);
          };
        }
      }
    } catch(e) {
      if (els.artistViewTracks) els.artistViewTracks.innerHTML = '<div class="text-center py-8 text-xs font-bold" style="color: var(--text-tertiary);">Could not load artist tracks.</div>';
    }
  }

  if (els.artistBackBtn) {
    els.artistBackBtn.addEventListener('click', () => {
      if (els.libraryArtistView) els.libraryArtistView.classList.add('hidden');
      if (els.libraryArtistsGrid) els.libraryArtistsGrid.classList.remove('hidden');
    });
  }

  function renderArtistTracks(tracks) {
    if (!els.artistViewTracks) return;
    const downloads = engine.getDownloads();
    els.artistViewTracks.innerHTML = tracks.map((t, i) => {
      const isSaved = downloads.some(d => d.id === t.id);
      return `
        <div class="track-item flex items-center cursor-pointer" data-art-idx="${i}">
          <span class="text-[11px] font-bold w-5 text-center mr-2" style="color: var(--text-tertiary);">${i + 1}</span>
          <div class="w-[44px] h-[44px] rounded-[13px] overflow-hidden flex-shrink-0 shadow-sm" style="background: var(--bg-card-solid);">
            <img src="${t.thumb}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80'">
          </div>
          <div class="flex-1 overflow-hidden ml-3 mr-2">
            <div class="font-bold truncate text-[14px] leading-tight" style="color: var(--text-primary);">${t.title}</div>
            <div class="flex items-center gap-1.5 mt-0.5">
              <span class="font-medium text-[11px] truncate" style="color: var(--text-secondary);">${t.artist}</span>
              ${isSaved ? '<span class="text-[9px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded-full">Saved</span>' : ''}
            </div>
          </div>
          <div class="flex items-center gap-1.5 shrink-0">
            <span class="text-[11px] font-medium" style="color: var(--text-tertiary);">${t.duration || ''}</span>
            <button class="btn-direct-download w-7 h-7 rounded-full flex items-center justify-center active:scale-75 transition-all" data-track-id="${t.id}" title="Download track">
              <i class="${isSaved ? 'ph-fill ph-check-circle text-emerald-400' : 'ph-bold ph-download-simple'}" style="${isSaved ? '' : 'color: var(--text-tertiary);'}"></i>
            </button>
            <i class="ph-fill ph-play text-sm ml-1" style="color: var(--text-secondary);"></i>
          </div>
        </div>
      `;
    }).join('');

    els.artistViewTracks.querySelectorAll('.track-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.closest('.btn-direct-download')) return;
        const idx = parseInt(item.getAttribute('data-art-idx'));
        engine.setQueue(tracks, false);
        engine.playTrack(idx);
        scrollToPanel(2);
      });
    });

    els.artistViewTracks.querySelectorAll('.btn-direct-download').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const tid = btn.getAttribute('data-track-id');
        const track = tracks.find(t => t.id === tid);
        if (track) {
          engine.downloadTrack(track);
          btn.innerHTML = '<i class="ph-fill ph-check-circle text-emerald-400 text-base"></i>';
        }
      });
    });
  }

  // ═══ ARTIST AVATARS & ALBUMS CATALOG ═══
  const ARTIST_GRADIENTS = {
    'Juice WRLD': 'from-purple-600 via-indigo-700 to-black',
    'Future': 'from-blue-600 to-indigo-950',
    'Lil Uzi Vert': 'from-pink-600 to-purple-950',
    'The Weeknd': 'from-red-600 to-stone-950',
    'Eminem': 'from-amber-600 to-zinc-950',
    'Polo G': 'from-cyan-600 to-blue-950',
    'Marshmello': 'from-emerald-600 to-teal-950',
    'Trippie Redd': 'from-rose-600 to-red-950',
    'Halsey': 'from-violet-600 to-indigo-950',
    'The Kid LAROI': 'from-orange-600 to-amber-950',
    'Cordae': 'from-lime-600 to-emerald-950',
    'benny blanco': 'from-fuchsia-600 to-pink-950'
  };

  const ALBUMS_CATALOG = [
    {
      title: "Goodbye & Good Riddance",
      artist: "Juice WRLD",
      year: "2018",
      tracksCount: "16 Tracks",
      gradient: "from-purple-700 via-indigo-900 to-black",
      icon: "ph-disc"
    },
    {
      title: "Death Race For Love",
      artist: "Juice WRLD",
      year: "2019",
      tracksCount: "22 Tracks",
      gradient: "from-blue-700 via-slate-900 to-black",
      icon: "ph-fire"
    },
    {
      title: "Legends Never Die",
      artist: "Juice WRLD",
      year: "2020",
      tracksCount: "22 Tracks",
      gradient: "from-amber-600 via-orange-900 to-black",
      icon: "ph-crown"
    },
    {
      title: "Fighting Demons",
      artist: "Juice WRLD",
      year: "2021",
      tracksCount: "18 Tracks",
      gradient: "from-red-700 via-rose-950 to-black",
      icon: "ph-sword"
    },
    {
      title: "Wrld On Drugs",
      artist: "Juice WRLD & Future",
      year: "2018",
      tracksCount: "16 Tracks",
      gradient: "from-emerald-700 via-teal-950 to-black",
      icon: "ph-globe-hemisphere-west"
    },
    {
      title: "The Lost Vault",
      artist: "Juice WRLD (Unreleased)",
      year: "Grails & Leaks",
      tracksCount: "90+ Grails",
      gradient: "from-fuchsia-700 via-purple-950 to-black",
      icon: "ph-vault"
    }
  ];

  // ═══ ARTISTS GRID ═══
  function renderArtistsGrid() {
    if (!els.artistsGridInner) return;
    const state = engine.getState();
    const artistCounts = {};
    state.queue.forEach(t => {
      let raw = (t.artist || 'Juice WRLD').split(',')[0].split('&')[0].split('feat.')[0].split('ft.')[0].trim();
      if (!raw) raw = 'Juice WRLD';
      artistCounts[raw] = (artistCounts[raw] || 0) + 1;
    });

    const knownArtists = ['Juice WRLD', 'Future', 'Lil Uzi Vert', 'The Weeknd', 'Eminem', 'Polo G', 'Marshmello', 'Trippie Redd', 'Halsey', 'The Kid LAROI', 'Cordae', 'benny blanco'];
    knownArtists.forEach(ka => {
      if (!artistCounts[ka]) artistCounts[ka] = ka === 'Juice WRLD' ? 85 : 4;
    });

    const sortedArtists = Object.keys(artistCounts).sort((a, b) => (artistCounts[b] || 0) - (artistCounts[a] || 0));
    if (!sortedArtists.includes('Juice WRLD')) sortedArtists.unshift('Juice WRLD');

    if (els.librarySubtitle) els.librarySubtitle.innerText = `${sortedArtists.length} Artists in Catalog`;

    els.artistsGridInner.innerHTML = sortedArtists.map(artist => {
      const grad = ARTIST_GRADIENTS[artist] || 'from-indigo-600 to-purple-950';
      const initials = artist.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
      const count = artistCounts[artist] || (artist === 'Juice WRLD' ? '85+' : '4');
      return `
        <div class="artist-card glass-card p-3 rounded-2xl flex flex-col items-center text-center cursor-pointer active:scale-95 transition-all hover:border-purple-500/40" data-artist="${artist}">
          <div class="relative w-20 h-20 mb-2 rounded-full overflow-hidden shadow-lg border-2 flex items-center justify-center bg-gradient-to-tr ${grad}" style="border-color: var(--border-card);">
            <span class="text-white font-black text-lg tracking-wider">${initials}</span>
          </div>
          <h4 class="font-black text-xs truncate max-w-full" style="color: var(--text-primary);">${artist}</h4>
          <span class="text-[10px] font-bold mt-0.5 px-2 py-0.5 rounded-full" style="background: var(--bg-input); color: var(--text-secondary);">${count} Tracks</span>
        </div>
      `;
    }).join('');

    els.artistsGridInner.querySelectorAll('.artist-card').forEach(card => {
      card.addEventListener('click', () => {
        const artist = card.getAttribute('data-artist') || 'Juice WRLD';
        openArtistDetail(artist);
      });
    });
  }

  // ═══ ALBUMS GRID ═══
  function renderAlbumsGrid() {
    if (!els.albumsGridInner) return;
    if (els.librarySubtitle) els.librarySubtitle.innerText = `${ALBUMS_CATALOG.length} Studio Projects & Vaults`;

    els.albumsGridInner.innerHTML = ALBUMS_CATALOG.map(album => `
      <div class="album-card glass-card p-3 rounded-2xl cursor-pointer active:scale-95 transition-all hover:border-purple-500/40 flex flex-col" data-title="${album.title}">
        <div class="relative w-full aspect-square mb-2.5 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br ${album.gradient} flex flex-col justify-between p-3 border border-white/10">
          <div class="flex items-center justify-between">
            <i class="ph-bold ${album.icon} text-xl text-white/80"></i>
            <span class="px-2 py-0.5 rounded-full text-[9px] font-black bg-black/60 backdrop-blur-md text-white border border-white/10">
              ${album.year}
            </span>
          </div>
          <div>
            <div class="text-[10px] font-black uppercase tracking-wider text-white/60">ALBUM</div>
            <div class="text-xs font-black text-white leading-tight line-clamp-2">${album.title}</div>
          </div>
        </div>
        <h4 class="font-black text-xs truncate" style="color: var(--text-primary);">${album.title}</h4>
        <p class="text-[10px] font-medium truncate mt-0.5" style="color: var(--text-secondary);">${album.artist}</p>
        <div class="flex items-center justify-between mt-2 pt-1 border-t" style="border-color: var(--border-card);">
          <span class="text-[9px] font-bold" style="color: var(--text-tertiary);">${album.tracksCount}</span>
          <i class="ph-fill ph-play-circle text-base text-purple-400"></i>
        </div>
      </div>
    `).join('');

    els.albumsGridInner.querySelectorAll('.album-card').forEach(card => {
      card.addEventListener('click', async () => {
        const title = card.getAttribute('data-title');
        const alb = ALBUMS_CATALOG.find(a => a.title === title);
        if (!alb) return;

        if (els.librarySubtitle) els.librarySubtitle.innerText = `Loading ${title}...`;
        try {
          let tracks = [];
          if (title.includes('Vault')) {
            const res = await fetch('/api/genre_radio?genre=Juice%20WRLD:%20The%20Lost%20Vault');
            const d = await res.json();
            tracks = d.tracks;
          } else {
            const res = await fetch(`/api/genre_radio?genre=${encodeURIComponent('Juice WRLD: Official Discography')}`);
            const d = await res.json();
            tracks = d.tracks;
          }
          if (tracks && tracks.length > 0) {
            engine.setQueue(tracks, 0);
            engine.playTrack(0);
            scrollToPanel(2);
          }
        } catch(e) {
          console.warn('Could not load album tracks:', e);
        }
      });
    });
  }

  // ═══ THEME TOGGLE (Light/Dark) ═══
  if (els.toggleLightMode) {
    const savedTheme = localStorage.getItem('juicebx_theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      els.toggleLightMode.classList.add('active');
    }
    els.toggleLightMode.addEventListener('click', () => {
      const isLight = els.toggleLightMode.classList.toggle('active');
      if (isLight) {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        localStorage.setItem('juicebx_theme', 'light');
      } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
        localStorage.setItem('juicebx_theme', 'dark');
      }
      refreshCurrentLibrary();
    });
  }

  // ═══ FULLSCREEN TOGGLE ═══
  function toggleFullscreenMode() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }

  if (els.toggleFullscreen) els.toggleFullscreen.addEventListener('click', toggleFullscreenMode);
  if (els.deckBtnFullscreen) els.deckBtnFullscreen.addEventListener('click', toggleFullscreenMode);

  // Listen for hardware esc or system-level fullscreen changes to sync UI
  document.addEventListener('fullscreenchange', () => {
    const isFull = !!document.fullscreenElement;
    if (els.toggleFullscreen) {
      if (isFull) els.toggleFullscreen.classList.add('active');
      else els.toggleFullscreen.classList.remove('active');
    }
    if (els.deckFullscreenIcon) {
      els.deckFullscreenIcon.className = isFull ? 'ph-bold ph-corners-in text-base' : 'ph-bold ph-corners-out text-base';
    }
  });

  // ═══ MINI PLAYER ═══
  const miniPlayerInfo = document.getElementById('mini-player-info');
  if (miniPlayerInfo) {
    miniPlayerInfo.addEventListener('click', (e) => {
      e.stopPropagation();
      scrollToPanel(2);
    });
  }

  // ═══ CONTROLS WIRING ═══
  if (els.deckBtnPlay) els.deckBtnPlay.addEventListener('click', () => engine.togglePlay());
  if (els.miniPlayBtn) {
    els.miniPlayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      engine.togglePlay();
    });
  }
  if (els.deckBtnNext) els.deckBtnNext.addEventListener('click', () => engine.next());
  if (els.deckBtnPrev) els.deckBtnPrev.addEventListener('click', () => engine.prev());
  if (els.deckBtnShuffle) els.deckBtnShuffle.addEventListener('click', () => engine.toggleShuffle());
  if (els.deckBtnRepeat) els.deckBtnRepeat.addEventListener('click', () => engine.toggleRepeat());
  if (els.deckVinyl) els.deckVinyl.addEventListener('click', () => engine.togglePlay());

  if (els.deckBtnDownloadHero) {
    els.deckBtnDownloadHero.addEventListener('click', () => {
      const state = engine.getState();
      const currentTrack = state.queue[state.currentIndex];
      if (currentTrack) {
        engine.downloadTrack(currentTrack);
        els.deckBtnDownloadHero.innerHTML = '<i class="ph-fill ph-check-circle text-base text-emerald-400"></i>';
        setTimeout(() => {
          if (els.deckBtnDownloadHero) els.deckBtnDownloadHero.innerHTML = '<i class="ph-bold ph-download-simple text-base"></i>';
        }, 2000);
      }
    });
  }

  // ═══ DECK FAVORITE, DOWNLOAD & ADD-TO-PLAYLIST CONTROLLERS ═══
  const deckBtnDownloadHero = document.getElementById('deck-btn-download-hero');
  const deckDownloadHeroIcon = document.getElementById('deck-download-hero-icon');

  function updateDeckFavoriteState() {
    const state = engine.getState();
    const track = state.queue[state.currentIndex];
    if (!track) return;
    if (els.deckHeartIcon) {
      const isFav = engine.isFavorite(track.id);
      els.deckHeartIcon.className = isFav ? 'ph-fill ph-heart text-pink-500 text-lg' : 'ph-bold ph-heart text-lg';
    }
    if (deckDownloadHeroIcon) {
      const downloads = engine.getDownloads();
      const isDownloaded = downloads.some(d => d.id === track.id || d.title === track.title);
      deckDownloadHeroIcon.className = isDownloaded ? 'ph-fill ph-check-circle text-emerald-400 text-base' : 'ph-bold ph-download-simple text-base';
    }
  }

  if (els.deckBtnFavorite) {
    els.deckBtnFavorite.addEventListener('click', () => {
      const state = engine.getState();
      const track = state.queue[state.currentIndex];
      if (track) {
        engine.toggleFavorite(track);
        engine.playHaptic(650, 0.03);
        updateDeckFavoriteState();
        if (els.deckBtnFavorite) {
          els.deckBtnFavorite.style.transform = 'scale(1.3)';
          setTimeout(() => {
            if (els.deckBtnFavorite) els.deckBtnFavorite.style.transform = 'scale(1)';
          }, 200);
        }
      }
    });
  }

  if (deckBtnDownloadHero) {
    deckBtnDownloadHero.addEventListener('click', () => {
      const state = engine.getState();
      const track = state.queue[state.currentIndex];
      if (track) {
        engine.downloadTrack(track);
        engine.playHaptic(700, 0.03);
        updateDeckFavoriteState();
        showToast(`Saved "${track.title}" for offline playback`);
      }
    });
  }

  if (els.deckBtnAddPlaylist) {
    els.deckBtnAddPlaylist.addEventListener('click', () => {
      const state = engine.getState();
      const track = state.queue[state.currentIndex];
      if (track) openAddToPlaylistModal(track);
    });
  }

  // ═══ ADD TO PLAYLIST MODAL ═══
  let activeTrackForPlaylist = null;

  function openAddToPlaylistModal(track) {
    if (!track || !els.modalAddToPlaylist) return;
    activeTrackForPlaylist = track;
    engine.playHaptic(500, 0.02);

    if (els.addPlaylistTrackSub) {
      els.addPlaylistTrackSub.innerText = `${track.title} • ${track.artist}`;
    }

    const isFav = engine.isFavorite(track.id);
    if (els.quickLikeCheckIcon) {
      els.quickLikeCheckIcon.className = isFav ? 'ph-fill ph-heart text-pink-500 text-lg' : 'ph-bold ph-heart text-gray-400 text-lg';
    }

    renderAddToPlaylistItems(track);

    els.modalAddToPlaylist.classList.remove('hidden');
    setTimeout(() => {
      if (els.modalAddToPlaylist) els.modalAddToPlaylist.classList.remove('opacity-0');
    }, 10);
  }

  function closeAddToPlaylistModal() {
    engine.playHaptic(400, 0.02);
    if (!els.modalAddToPlaylist) return;
    els.modalAddToPlaylist.classList.add('opacity-0');
    setTimeout(() => {
      if (els.modalAddToPlaylist) els.modalAddToPlaylist.classList.add('hidden');
      activeTrackForPlaylist = null;
    }, 200);
  }

  if (els.btnCloseAddPlaylistModal) els.btnCloseAddPlaylistModal.addEventListener('click', closeAddToPlaylistModal);
  if (els.modalAddToPlaylist) {
    els.modalAddToPlaylist.addEventListener('click', (e) => {
      if (e.target === els.modalAddToPlaylist) closeAddToPlaylistModal();
    });
  }

  if (els.btnQuickToggleLike) {
    els.btnQuickToggleLike.addEventListener('click', () => {
      if (!activeTrackForPlaylist) return;
      const isFav = engine.toggleFavorite(activeTrackForPlaylist);
      engine.playHaptic(600, 0.025);
      if (els.quickLikeCheckIcon) {
        els.quickLikeCheckIcon.className = isFav ? 'ph-fill ph-heart text-pink-500 text-lg' : 'ph-bold ph-heart text-gray-400 text-lg';
      }
    });
  }

  function renderAddToPlaylistItems(track) {
    if (!els.addPlaylistItemsList) return;
    const playlists = engine.getPlaylists();
    if (playlists.length === 0) {
      els.addPlaylistItemsList.innerHTML = `<p class="text-xs text-center py-4" style="color: var(--text-tertiary);">No custom playlists yet.<br>Create one below!</p>`;
      return;
    }

    els.addPlaylistItemsList.innerHTML = playlists.map(pl => {
      const inPlaylist = pl.tracks && pl.tracks.some(t => t.id === track.id || t.title === track.title);
      return `
        <div class="playlist-add-row flex items-center justify-between p-2.5 rounded-2xl glass-card cursor-pointer hover:border-indigo-500/40 transition-all active:scale-[0.98]" data-pl-id="${pl.id}">
          <div class="flex items-center gap-2.5 overflow-hidden flex-1 mr-2">
            <div class="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
              <i class="ph-bold ph-playlist"></i>
            </div>
            <div class="overflow-hidden">
              <div class="font-bold text-xs truncate" style="color: var(--text-primary);">${pl.name}</div>
              <div class="text-[10px]" style="color: var(--text-tertiary);">${pl.tracks ? pl.tracks.length : 0} tracks</div>
            </div>
          </div>
          <button class="px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 transition-all ${inPlaylist ? 'bg-emerald-500/20 text-emerald-400' : 'glass-input'}" style="${inPlaylist ? '' : 'color: var(--text-primary);'}">
            ${inPlaylist ? '<i class="ph-bold ph-check"></i> Added' : '<i class="ph-bold ph-plus"></i> Add'}
          </button>
        </div>
      `;
    }).join('');

    els.addPlaylistItemsList.querySelectorAll('.playlist-add-row').forEach(row => {
      row.addEventListener('click', () => {
        const plId = row.getAttribute('data-pl-id');
        const pl = engine.getPlaylist(plId);
        if (!pl || !activeTrackForPlaylist) return;
        const inPlaylist = pl.tracks && pl.tracks.some(t => t.id === activeTrackForPlaylist.id || t.title === activeTrackForPlaylist.title);
        if (inPlaylist) {
          engine.removeFromPlaylist(plId, activeTrackForPlaylist.id);
        } else {
          engine.addToPlaylist(plId, activeTrackForPlaylist);
        }
        engine.playHaptic(600, 0.025);
        renderAddToPlaylistItems(activeTrackForPlaylist);
      });
    });
  }

  if (els.btnCreatePlaylistQuick && els.inputNewPlaylistQuick) {
    els.btnCreatePlaylistQuick.addEventListener('click', () => {
      const name = els.inputNewPlaylistQuick.value.trim();
      if (!name) return;
      const newPl = engine.createPlaylist(name, "Custom Playlist");
      if (activeTrackForPlaylist) {
        engine.addToPlaylist(newPl.id, activeTrackForPlaylist);
      }
      els.inputNewPlaylistQuick.value = '';
      engine.playHaptic(650, 0.03);
      if (activeTrackForPlaylist) renderAddToPlaylistItems(activeTrackForPlaylist);
      refreshCurrentLibrary();
    });
  }

  // ═══ CREATE PLAYLIST MODAL ═══
  function openCreatePlaylistModal() {
    engine.playHaptic(500, 0.02);
    if (!els.modalCreatePlaylist) return;
    if (els.inputCreatePlaylistName) els.inputCreatePlaylistName.value = '';
    if (els.inputCreatePlaylistDesc) els.inputCreatePlaylistDesc.value = '';
    els.modalCreatePlaylist.classList.remove('hidden');
    setTimeout(() => {
      if (els.modalCreatePlaylist) {
        els.modalCreatePlaylist.classList.remove('opacity-0');
        if (els.inputCreatePlaylistName) els.inputCreatePlaylistName.focus();
      }
    }, 10);
  }

  function closeCreatePlaylistModal() {
    engine.playHaptic(400, 0.02);
    if (!els.modalCreatePlaylist) return;
    els.modalCreatePlaylist.classList.add('opacity-0');
    setTimeout(() => {
      if (els.modalCreatePlaylist) els.modalCreatePlaylist.classList.add('hidden');
    }, 200);
  }

  if (els.btnCreatePlaylistHeader) els.btnCreatePlaylistHeader.addEventListener('click', openCreatePlaylistModal);
  if (els.btnCreatePlaylistInline) els.btnCreatePlaylistInline.addEventListener('click', openCreatePlaylistModal);
  if (els.btnCloseCreatePlaylistModal) els.btnCloseCreatePlaylistModal.addEventListener('click', closeCreatePlaylistModal);
  if (els.btnCancelCreatePlaylist) els.btnCancelCreatePlaylist.addEventListener('click', closeCreatePlaylistModal);
  if (els.modalCreatePlaylist) {
    els.modalCreatePlaylist.addEventListener('click', (e) => {
      if (e.target === els.modalCreatePlaylist) closeCreatePlaylistModal();
    });
  }

  if (els.btnSubmitCreatePlaylist) {
    els.btnSubmitCreatePlaylist.addEventListener('click', () => {
      const name = els.inputCreatePlaylistName ? els.inputCreatePlaylistName.value.trim() : '';
      const desc = els.inputCreatePlaylistDesc ? els.inputCreatePlaylistDesc.value.trim() : '';
      if (!name) {
        if (els.inputCreatePlaylistName) els.inputCreatePlaylistName.focus();
        return;
      }
      engine.createPlaylist(name, desc);
      engine.playHaptic(700, 0.03);
      closeCreatePlaylistModal();
      refreshCurrentLibrary();
    });
  }

  // ═══ SETTINGS DATA MANAGEMENT ═══
  if (els.btnImportFolderSettings && els.localFolderInputSettings) {
    els.btnImportFolderSettings.addEventListener('click', () => {
      els.localFolderInputSettings.click();
    });

    els.localFolderInputSettings.addEventListener('change', async (e) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const imported = await engine.importLocalAudioFiles(files);
        if (imported.length > 0) {
          engine.playHaptic(700, 0.03);
          refreshCurrentLibrary();
          scrollToPanel(2); // Jump to Vinyl Deck
        }
      }
    });
  }

  if (els.btnClearSearchesSettings) {
    els.btnClearSearchesSettings.addEventListener('click', () => {
      localStorage.setItem('juicebx_recent_searches', JSON.stringify([]));
      engine.playHaptic(400, 0.02);
      renderRecentSearchChips();
      alert("Search history cleared.");
    });
  }

  if (els.btnClearDownloads) {
    els.btnClearDownloads.addEventListener('click', () => {
      engine.clearDownloads();
      engine.playHaptic(400, 0.02);
      refreshCurrentLibrary();
      alert("Offline cache cleared.");
    });
  }

  if (els.btnResetPlaylistsSettings) {
    els.btnResetPlaylistsSettings.addEventListener('click', () => {
      if (confirm("Reset playlists to default? This will clear custom playlists.")) {
        localStorage.removeItem('juicebx_playlists');
        engine.playHaptic(400, 0.02);
        refreshCurrentLibrary();
      }
    });
  }

  // ═══ MASTER TRACK & ARTWORK CONTROLLER ═══
  function updateArtwork(id, customUrl) {
    const thumbUrl = customUrl || (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80');
    if (els.deckVinylArt) els.deckVinylArt.style.backgroundImage = `url('${thumbUrl}')`;
    if (els.miniArt) els.miniArt.src = thumbUrl;
  }

  // ═══ MASTER ENGINE STATE LISTENERS ═══
  window.addEventListener('engine:stateChanged', (e) => {
    const state = e.detail;
    if (!state) return;
    const { isPlaying, shuffle, repeat } = state;

    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }

    const iconClass = isPlaying ? 'ph-fill ph-pause' : 'ph-fill ph-play';
    if (els.deckPlayIcon) els.deckPlayIcon.className = `${iconClass} text-3xl ${isPlaying ? '' : 'ml-0.5'}`;
    if (els.miniIcon) els.miniIcon.className = `${iconClass} text-base ${isPlaying ? '' : 'ml-0.5'}`;

    if (els.deckBtnShuffle) {
      els.deckBtnShuffle.style.color = shuffle ? '#ff4f00' : 'var(--text-tertiary)';
      els.deckBtnShuffle.style.filter = shuffle ? 'drop-shadow(0 0 8px rgba(255, 79, 0, 0.7))' : 'none';
    }
    if (els.deckBtnRepeat) {
      els.deckBtnRepeat.style.color = repeat ? '#ff4f00' : 'var(--text-tertiary)';
      els.deckBtnRepeat.style.filter = repeat ? 'drop-shadow(0 0 8px rgba(255, 79, 0, 0.7))' : 'none';
    }

    if (els.deckVinyl) {
      els.deckVinyl.style.animationPlayState = isPlaying ? 'running' : 'paused';
      isPlaying ? els.deckVinyl.classList.remove('paused') : els.deckVinyl.classList.add('paused');
    }

    if (miniPlayer) {
      if (currentPanelIndex !== 2 && state.queue.length > 0 && state.currentIndex >= 0) {
        miniPlayer.classList.remove('hidden');
      } else {
        miniPlayer.classList.add('hidden');
      }
    }
    updateDeckFavoriteState();
    refreshCurrentLibrary();
  });

  window.addEventListener('engine:queueUpdated', () => {
    // Small delay so remove-queue slide animation completes before DOM is replaced
    setTimeout(() => refreshCurrentLibrary(), 250);
  });

  window.addEventListener('engine:trackChanged', (e) => {
    const track = e.detail;
    if (!track) return;
    if (els.deckTrackTitle) els.deckTrackTitle.innerText = track.title;
    if (els.deckTrackArtist) els.deckTrackArtist.innerText = track.artist;
    if (els.miniTitle) els.miniTitle.innerText = track.title;
    if (els.miniArtist) els.miniArtist.innerText = track.artist;
    if (els.deckTimeCurrent) els.deckTimeCurrent.innerText = "0:00";
    if (els.deckTimeTotal) {
      if (track.duration) els.deckTimeTotal.innerText = track.duration;
      else if (track.seconds) els.deckTimeTotal.innerText = formatTime(track.seconds);
      else els.deckTimeTotal.innerText = "0:00";
    }
    if (els.deckScrubberFill) els.deckScrubberFill.style.transform = "scaleX(0)";
    if (els.deckScrubberThumb) els.deckScrubberThumb.style.left = "0%";
    updateArtwork(track.id, track.thumb);
    updateAmbientAura(track);
    updateDeckFavoriteState();
    if (currentDeckMode === 'lyrics') loadTrackLyrics(track.title, track.artist);
    refreshCurrentLibrary();
  });

  window.addEventListener('engine:favoritesUpdated', () => {
    updateDeckFavoriteState();
    if (els.likedSongsCountBadge) {
      els.likedSongsCountBadge.innerText = `${engine.getFavorites().length} Favorite Tracks`;
    }
    const activeTab = document.querySelector('.lib-tab.active')?.getAttribute('data-tab') || 'playlists';
    if (activeTab === 'playlists' && els.libraryPlaylistDetailView && !els.libraryPlaylistDetailView.classList.contains('hidden')) {
      const title = els.playlistDetailTitle ? els.playlistDetailTitle.innerText : '';
      if (title === 'Liked Songs') openPlaylistDetail('liked_songs');
    }
  });

  window.addEventListener('engine:playlistsUpdated', () => {
    renderUserPlaylistsGrid();
  });

  window.addEventListener('engine:progress', (e) => {
    if (isDragging) return;
    const { currentTime, duration } = e.detail || {};
    const cur = (typeof currentTime === 'number' && !isNaN(currentTime)) ? Math.max(0, currentTime) : 0;
    const dur = (typeof duration === 'number' && !isNaN(duration)) ? Math.max(0, duration) : 0;

    if (els.deckTimeCurrent) els.deckTimeCurrent.innerText = formatTime(cur);
    if (els.deckTimeTotal && dur > 0) els.deckTimeTotal.innerText = formatTime(dur);

    if (dur > 0) {
      const pct = Math.min(100, Math.max(0, (cur / dur) * 100));
      if (els.deckScrubberFill) els.deckScrubberFill.style.transform = `scaleX(${pct / 100})`;
      if (els.deckScrubberThumb) els.deckScrubberThumb.style.left = `${pct}%`;
    }
  });

  // ═══ HELPERS ═══
  function updateArtwork(videoId, explicitThumb) {
    let url = explicitThumb;
    if (!url && videoId && videoId.length === 11 && !videoId.includes('4819g')) {
      url = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    if (!url) {
      url = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80';
    }
    if (els.miniArt) els.miniArt.src = url;
    if (els.deckVinylArt) els.deckVinylArt.style.backgroundImage = `url('${url}')`;
  }

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  // ═══ OFFLINE & LIBRARY REFRESH ═══
  function getDownloads() {
    return engine.getDownloads();
  }

  function refreshCurrentLibrary() {
    const state = engine.getState();
    const activeTab = document.querySelector('.lib-tab.active')?.getAttribute('data-tab') || 'playlists';
    
    if (activeTab === 'playlists') {
      if (els.libraryPlaylistDetailView && !els.libraryPlaylistDetailView.classList.contains('hidden')) {
        return;
      }
      renderPlaylistsView();
      return;
    }
    if (activeTab === 'queue') {
      if (els.libraryTitle) els.libraryTitle.innerText = "Queue";
      if (els.librarySubtitle) els.librarySubtitle.innerText = `${state.queue.length} tracks in queue`;
      renderLibrary(state.queue, state.currentIndex, state.isPlaying);
      return;
    }
    if (activeTab === 'artists') {
      if (els.libraryArtistView && !els.libraryArtistView.classList.contains('hidden')) {
        return;
      }
      renderArtistsGrid();
      return;
    }
    if (activeTab === 'albums') {
      renderAlbumsGrid();
      return;
    }
    if (activeTab === 'downloads') {
      renderDownloadsList();
      return;
    }
  }

  function renderLibrary(list, currentIndex, isPlaying = false) {
    if (!els.libraryList) return;
    if (!list || list.length === 0) {
      els.libraryList.innerHTML = `<div class="text-center font-medium text-sm mt-12 py-8" style="color: var(--text-tertiary);">No tracks in queue.<br><span class="text-xs mt-1 block">Search for songs or play a playlist to start listening.</span></div>`;
      return;
    }
    const downloads = getDownloads();
    els.libraryList.innerHTML = list.map((track, i) => {
      const isActive = (i === currentIndex);
      const isCurrentlyPlaying = isActive && isPlaying;
      const isSaved = downloads.some(d => d.id === track.id || d.title === track.title);
      const isFav = engine.isFavorite(track.id);
      return `
        <div class="track-item flex items-center cursor-pointer ${isActive ? 'ring-2 ring-indigo-500/50' : ''}" data-idx="${i}">
          <span class="text-[11px] font-bold w-5 text-center mr-2" style="color: var(--text-tertiary);">${i + 1}</span>
          <div class="w-[44px] h-[44px] rounded-[13px] overflow-hidden flex-shrink-0 relative shadow-sm" style="background: var(--bg-card-solid);">
            <img src="${track.thumb}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80'">
            ${isCurrentlyPlaying ? '<div class="absolute inset-0 bg-black/50 flex items-center justify-center gap-[2px]"><div class="w-0.5 h-2.5 bg-white rounded-full animate-[bounce_1s_infinite]"></div><div class="w-0.5 h-3.5 bg-white rounded-full animate-[bounce_1s_infinite_0.2s]"></div><div class="w-0.5 h-2 bg-white rounded-full animate-[bounce_1s_infinite_0.4s]"></div></div>' : ''}
          </div>
          <div class="flex-1 overflow-hidden ml-3 mr-2">
            <div class="font-bold truncate text-[14px] leading-tight" style="color: var(--text-primary);">${track.title}</div>
            <div class="flex items-center gap-1.5 mt-0.5">
              <span class="font-medium text-[11px] truncate" style="color: var(--text-secondary);">${track.artist}</span>
              ${isSaved ? '<span class="text-[9px] bg-emerald-500/20 text-emerald-500 font-bold px-1.5 py-0.5 rounded-full">Saved</span>' : ''}
              ${track.isLocal ? '<span class="text-[9px] bg-indigo-500/20 text-indigo-400 font-bold px-1.5 py-0.5 rounded-full">Local</span>' : ''}
            </div>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <span class="text-[11px] font-medium mr-1" style="color: var(--text-tertiary);">${track.duration || ''}</span>
            <button class="btn-direct-like w-7 h-7 rounded-full flex items-center justify-center active:scale-75 transition-all" data-idx="${i}" title="Favorite">
              <i class="${isFav ? 'ph-fill ph-heart text-pink-500' : 'ph-bold ph-heart'}" style="${isFav ? '' : 'color: var(--text-tertiary);'}"></i>
            </button>
            <button class="btn-direct-add-pl w-7 h-7 rounded-full flex items-center justify-center active:scale-75 transition-all text-xs" data-idx="${i}" title="Add to Playlist" style="color: var(--text-tertiary);">
              <i class="ph-bold ph-plus"></i>
            </button>
            <button class="btn-direct-download w-7 h-7 rounded-full flex items-center justify-center active:scale-75 transition-all" data-track-id="${track.id}" title="Save track">
              <i class="${isSaved ? 'ph-fill ph-check-circle text-emerald-500' : 'ph-bold ph-download-simple'}" style="${isSaved ? '' : 'color: var(--text-tertiary);'}"></i>
            </button>
            <button class="btn-remove-queue w-7 h-7 rounded-full flex items-center justify-center active:scale-75 transition-all opacity-50 hover:opacity-100" data-idx="${i}" title="Remove from queue" style="color: var(--text-tertiary);">
              <i class="ph-bold ph-x text-xs hover:text-red-400"></i>
            </button>
          </div>
        </div>`;
    }).join('');

    els.libraryList.querySelectorAll('.track-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.closest('.btn-direct-download') || e.target.closest('.btn-remove-queue') || e.target.closest('.btn-direct-like') || e.target.closest('.btn-direct-add-pl')) return;
        const idx = parseInt(item.getAttribute('data-idx'));
        engine.playTrack(idx);
        scrollToPanel(2);
      });
    });

    els.libraryList.querySelectorAll('.btn-direct-like').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute('data-idx'));
        const track = list[idx];
        if (track) {
          const isFav = engine.toggleFavorite(track);
          engine.playHaptic(600, 0.02);
          btn.innerHTML = `<i class="${isFav ? 'ph-fill ph-heart text-pink-500' : 'ph-bold ph-heart'}" style="${isFav ? '' : 'color: var(--text-tertiary);'}"></i>`;
        }
      });
    });

    els.libraryList.querySelectorAll('.btn-direct-add-pl').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute('data-idx'));
        const track = list[idx];
        if (track) openAddToPlaylistModal(track);
      });
    });

    els.libraryList.querySelectorAll('.btn-remove-queue').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const item = btn.closest('.track-item');
        if (item) {
          // Capture idx BEFORE animation so DOM replacement doesn't lose it
          const idx = parseInt(item.getAttribute('data-idx'));
          if (isNaN(idx)) return;
          item.style.transition = 'opacity 0.18s ease-out, transform 0.18s ease-out';
          item.style.transform = 'translateX(-100%)';
          item.style.opacity = '0';
          setTimeout(() => {
            engine.removeFromQueue(idx);
          }, 200);
        }
      });
    });

    els.libraryList.querySelectorAll('.btn-direct-download').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const tid = btn.getAttribute('data-track-id');
        const track = list.find(t => t.id === tid);
        if (track) {
          engine.downloadTrack(track);
          btn.innerHTML = '<i class="ph-fill ph-check-circle text-emerald-500 text-base"></i>';
        }
      });
    });
  }

  // ═══ PLAYLISTS SUBTAB & DETAIL CONTROLLER ═══
  function renderPlaylistsView() {
    if (els.libraryTitle) els.libraryTitle.innerText = "Playlists";
    const favs = engine.getFavorites();
    const playlists = engine.getPlaylists();
    if (els.librarySubtitle) els.librarySubtitle.innerText = `${playlists.length + 1} Playlists Available`;
    if (els.likedSongsCountBadge) els.likedSongsCountBadge.innerText = `${favs.length} Favorite Tracks`;
    renderUserPlaylistsGrid();
  }

  function renderUserPlaylistsGrid() {
    if (!els.userPlaylistsGrid) return;
    const playlists = engine.getPlaylists();

    if (playlists.length === 0) {
      els.userPlaylistsGrid.innerHTML = `
        <div class="col-span-2 p-6 text-center glass-card rounded-2xl">
          <i class="ph-bold ph-playlist text-3xl mb-2 text-indigo-400"></i>
          <p class="font-bold text-sm" style="color: var(--text-primary);">No Custom Playlists</p>
          <p class="text-xs mt-1" style="color: var(--text-tertiary);">Tap + Create above to build your first mix.</p>
        </div>
      `;
      return;
    }

    const gradients = [
      'from-indigo-900/70 via-purple-950 to-black',
      'from-blue-900/70 via-cyan-950 to-black',
      'from-emerald-900/70 via-teal-950 to-black',
      'from-rose-900/70 via-amber-950 to-black'
    ];

    els.userPlaylistsGrid.innerHTML = playlists.map((pl, idx) => {
      const count = pl.tracks ? pl.tracks.length : 0;
      const grad = gradients[idx % gradients.length];
      return `
        <div class="user-playlist-card glass-card p-3.5 rounded-2xl relative overflow-hidden cursor-pointer active:scale-95 transition-all group flex flex-col justify-between h-36 bg-gradient-to-br ${grad} border" style="border-color: var(--border-card);" data-pl-id="${pl.id}">
          <div class="flex items-center justify-between">
            <div class="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white text-base">
              <i class="ph-fill ph-playlist"></i>
            </div>
            <div class="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <i class="ph-fill ph-play text-white text-xs"></i>
            </div>
          </div>
          <div>
            <h4 class="font-black text-sm text-white truncate">${pl.name}</h4>
            <p class="text-[11px] text-white/70 truncate mt-0.5">${pl.description || 'Custom Playlist'}</p>
            <span class="text-[10px] font-bold text-indigo-300 mt-1 block">${count} ${count === 1 ? 'Track' : 'Tracks'}</span>
          </div>
        </div>
      `;
    }).join('');

    els.userPlaylistsGrid.querySelectorAll('.user-playlist-card').forEach(card => {
      card.addEventListener('click', () => {
        const plId = card.getAttribute('data-pl-id');
        openPlaylistDetail(plId);
      });
    });
  }

  // Hero Liked Songs Card click handlers
  if (els.heroLikedSongsCard) {
    els.heroLikedSongsCard.addEventListener('click', (e) => {
      if (e.target.closest('#btn-play-liked-songs') || e.target.closest('#btn-shuffle-liked-songs')) return;
      openPlaylistDetail('liked_songs');
    });
  }

  if (els.btnPlayLikedSongs) {
    els.btnPlayLikedSongs.addEventListener('click', (e) => {
      e.stopPropagation();
      const favs = engine.getFavorites();
      if (favs.length > 0) {
        engine.setQueue(favs, false);
        engine.playTrack(0);
        scrollToPanel(2);
      } else {
        alert("You haven't liked any songs yet! Tap the heart icon on any song to add it.");
      }
    });
  }

  if (els.btnShuffleLikedSongs) {
    els.btnShuffleLikedSongs.addEventListener('click', (e) => {
      e.stopPropagation();
      const favs = engine.getFavorites();
      if (favs.length > 0) {
        const shuffled = [...favs];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        engine.setQueue(shuffled, false);
        engine.playTrack(0);
        scrollToPanel(2);
      } else {
        alert("You haven't liked any songs yet! Tap the heart icon on any song to add it.");
      }
    });
  }

  function openPlaylistDetail(playlistId) {
    if (!els.libraryPlaylistDetailView) return;
    if (els.libraryPlaylistsView) els.libraryPlaylistsView.classList.add('hidden');
    els.libraryPlaylistDetailView.classList.remove('hidden');

    let title = "";
    let desc = "";
    let tracks = [];
    const isLikedSongs = (playlistId === 'liked_songs');

    if (isLikedSongs) {
      tracks = engine.getFavorites();
      title = "Liked Songs";
      desc = "Your favorite saved tracks";
      if (els.playlistBtnDelete) els.playlistBtnDelete.classList.add('hidden');
    } else {
      const pl = engine.getPlaylist(playlistId);
      if (!pl) return;
      tracks = pl.tracks || [];
      title = pl.name;
      desc = pl.description || "Custom Playlist";
      if (els.playlistBtnDelete) {
        els.playlistBtnDelete.classList.remove('hidden');
        els.playlistBtnDelete.onclick = () => {
          if (confirm(`Delete playlist "${title}"?`)) {
            engine.deletePlaylist(playlistId);
            if (els.libraryPlaylistDetailView) els.libraryPlaylistDetailView.classList.add('hidden');
            if (els.libraryPlaylistsView) els.libraryPlaylistsView.classList.remove('hidden');
            renderPlaylistsView();
          }
        };
      }
    }

    if (els.playlistDetailTitle) els.playlistDetailTitle.innerText = title;
    if (els.playlistDetailMeta) els.playlistDetailMeta.innerText = `${tracks.length} Tracks • ${desc}`;

    if (els.playlistBtnPlayAll) {
      els.playlistBtnPlayAll.onclick = () => {
        if (tracks.length > 0) {
          engine.setQueue(tracks, false);
          engine.playTrack(0);
          scrollToPanel(2);
        }
      };
    }

    if (els.playlistBtnShuffle) {
      els.playlistBtnShuffle.onclick = () => {
        if (tracks.length > 0) {
          const shuffled = [...tracks];
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
          engine.setQueue(shuffled, false);
          engine.playTrack(0);
          scrollToPanel(2);
        }
      };
    }

    if (els.playlistDetailTracksList) {
      if (tracks.length === 0) {
        els.playlistDetailTracksList.innerHTML = `<div class="text-center py-10 font-bold text-xs" style="color: var(--text-tertiary);">No tracks in this playlist yet.<br>Tap + on any song to add it!</div>`;
        return;
      }

      els.playlistDetailTracksList.innerHTML = tracks.map((t, idx) => {
        const isFav = engine.isFavorite(t.id);
        return `
          <div class="track-item flex items-center cursor-pointer p-2.5 rounded-2xl mb-1.5 glass-card" data-pl-track-idx="${idx}">
            <span class="text-[11px] font-bold w-5 text-center mr-2" style="color: var(--text-tertiary);">${idx + 1}</span>
            <div class="w-[42px] h-[42px] rounded-[13px] overflow-hidden flex-shrink-0 relative shadow-sm" style="background: var(--bg-card-solid);">
              <img src="${t.thumb}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80'">
            </div>
            <div class="flex-1 overflow-hidden ml-3 mr-2">
              <div class="font-bold truncate text-[13px] leading-tight" style="color: var(--text-primary);">${t.title}</div>
              <span class="font-medium text-[11px]" style="color: var(--text-secondary);">${t.artist}</span>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              <span class="text-[11px] font-medium mr-1" style="color: var(--text-tertiary);">${t.duration || ''}</span>
              <button class="btn-item-like w-7 h-7 rounded-full flex items-center justify-center active:scale-75 transition-all" data-track-id="${t.id}" title="Toggle Like">
                <i class="${isFav ? 'ph-fill ph-heart text-pink-500' : 'ph-bold ph-heart'}" style="${isFav ? '' : 'color: var(--text-tertiary);'}"></i>
              </button>
              <button class="btn-item-remove-pl w-7 h-7 rounded-full flex items-center justify-center active:scale-75 transition-all text-xs opacity-60 hover:opacity-100 hover:text-red-400" data-track-id="${t.id}" title="Remove">
                <i class="ph-bold ph-x"></i>
              </button>
              <i class="ph-fill ph-play text-sm ml-0.5" style="color: var(--text-secondary);"></i>
            </div>
          </div>
        `;
      }).join('');

      els.playlistDetailTracksList.querySelectorAll('.track-item').forEach(item => {
        item.addEventListener('click', (e) => {
          if (e.target.closest('.btn-item-like') || e.target.closest('.btn-item-remove-pl')) return;
          const idx = parseInt(item.getAttribute('data-pl-track-idx'));
          engine.setQueue(tracks, false);
          engine.playTrack(idx);
          scrollToPanel(2);
        });
      });

      els.playlistDetailTracksList.querySelectorAll('.btn-item-like').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const tid = btn.getAttribute('data-track-id');
          const track = tracks.find(t => t.id === tid);
          if (track) {
            engine.toggleFavorite(track);
            engine.playHaptic(600, 0.02);
          }
        });
      });

      els.playlistDetailTracksList.querySelectorAll('.btn-item-remove-pl').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const tid = btn.getAttribute('data-track-id');
          if (isLikedSongs) {
            const track = tracks.find(t => t.id === tid);
            if (track) engine.toggleFavorite(track);
          } else {
            engine.removeFromPlaylist(playlistId, tid);
          }
          openPlaylistDetail(playlistId);
        });
      });
    }
  }

  if (els.playlistBackBtn) {
    els.playlistBackBtn.addEventListener('click', () => {
      if (els.libraryPlaylistDetailView) els.libraryPlaylistDetailView.classList.add('hidden');
      if (els.libraryPlaylistsView) els.libraryPlaylistsView.classList.remove('hidden');
      renderPlaylistsView();
    });
  }

  // ═══ DOWNLOADS SUBTAB CONTROLLER ═══
  function renderDownloadsList() {
    if (!els.libraryDownloadsList) return;
    if (els.libraryTitle) els.libraryTitle.innerText = "Downloads";
    const downloads = engine.getDownloads();
    if (els.librarySubtitle) els.librarySubtitle.innerText = `${downloads.length} offline tracks ready`;
    if (els.downloadsTotalCount) els.downloadsTotalCount.innerText = `${downloads.length} Offline Tracks`;

    if (downloads.length === 0) {
      els.libraryDownloadsList.innerHTML = `
        <div class="text-center py-10 glass-card rounded-2xl p-6">
          <i class="ph-bold ph-download-simple text-3xl mb-2 text-emerald-400"></i>
          <p class="font-bold text-sm" style="color: var(--text-primary);">No Downloaded Songs</p>
          <p class="text-xs mt-1" style="color: var(--text-tertiary);">Tap the download button on any song or import local files in Settings to listen offline!</p>
        </div>
      `;
      return;
    }

    els.libraryDownloadsList.innerHTML = downloads.map((t, idx) => `
      <div class="track-item flex items-center cursor-pointer p-2.5 rounded-2xl mb-1.5 glass-card" data-dl-idx="${idx}">
        <span class="text-[11px] font-bold w-5 text-center mr-2" style="color: var(--text-tertiary);">${idx + 1}</span>
        <div class="w-[42px] h-[42px] rounded-[13px] overflow-hidden flex-shrink-0 relative shadow-sm" style="background: var(--bg-card-solid);">
          <img src="${t.thumb}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80'">
        </div>
        <div class="flex-1 overflow-hidden ml-3 mr-2">
          <div class="font-bold truncate text-[13px] leading-tight" style="color: var(--text-primary);">${t.title}</div>
          <span class="font-medium text-[11px]" style="color: var(--text-secondary);">${t.artist}</span>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <span class="text-[9px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full">Offline</span>
          <i class="ph-fill ph-play text-sm" style="color: var(--text-secondary);"></i>
        </div>
      </div>
    `).join('');

    els.libraryDownloadsList.querySelectorAll('.track-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.getAttribute('data-dl-idx'));
        engine.setQueue(downloads, false);
        engine.playTrack(idx);
        scrollToPanel(2);
      });
    });
  }

  // ═══ LIBRARY SUBTABS (PLAYLISTS, QUEUE, ARTISTS, ALBUMS, DOWNLOADS) ═══
  const libTabs = document.querySelectorAll('.lib-tab');
  libTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      libTabs.forEach(t => {
        t.classList.remove('active');
        t.style.background = 'var(--bg-input)';
        t.style.color = 'var(--text-secondary)';
      });
      tab.classList.add('active');
      tab.style.background = 'var(--btn-active-bg)';
      tab.style.color = 'var(--btn-active-text)';

      const tabName = tab.getAttribute('data-tab');
      showLibrarySubView(tabName);
    });
  });

  function showLibrarySubView(tabName) {
    if (els.libraryPlaylistsView) els.libraryPlaylistsView.classList.add('hidden');
    if (els.libraryPlaylistDetailView) els.libraryPlaylistDetailView.classList.add('hidden');
    if (els.libraryList) els.libraryList.classList.add('hidden');
    if (els.libraryArtistsGrid) els.libraryArtistsGrid.classList.add('hidden');
    if (els.libraryAlbumsGrid) els.libraryAlbumsGrid.classList.add('hidden');
    if (els.libraryDownloadsView) els.libraryDownloadsView.classList.add('hidden');
    if (els.libraryArtistView) els.libraryArtistView.classList.add('hidden');

    if (tabName === 'playlists') {
      if (els.libraryPlaylistsView) els.libraryPlaylistsView.classList.remove('hidden');
      renderPlaylistsView();
    } else if (tabName === 'queue') {
      if (els.libraryList) els.libraryList.classList.remove('hidden');
      if (els.libraryTitle) els.libraryTitle.innerText = "Queue";
      if (els.librarySubtitle) els.librarySubtitle.innerText = `${engine.getState().queue.length} tracks in queue`;
      renderLibrary(engine.getState().queue, engine.getState().currentIndex, engine.getState().isPlaying);
    } else if (tabName === 'artists') {
      if (els.libraryArtistsGrid) els.libraryArtistsGrid.classList.remove('hidden');
      if (els.libraryTitle) els.libraryTitle.innerText = "Artists";
      renderArtistsGrid();
    } else if (tabName === 'albums') {
      if (els.libraryAlbumsGrid) els.libraryAlbumsGrid.classList.remove('hidden');
      if (els.libraryTitle) els.libraryTitle.innerText = "Albums";
      renderAlbumsGrid();
    } else if (tabName === 'downloads') {
      if (els.libraryDownloadsView) els.libraryDownloadsView.classList.remove('hidden');
      renderDownloadsList();
    }
  }

  function getAllCatalogTracks() {
    const queue = engine.getState().queue || [];
    const catalogTracks = [];
    if (typeof TOP_SHUFFLES_CATALOG !== 'undefined') {
      Object.values(TOP_SHUFFLES_CATALOG).forEach(cat => {
        if (cat.tracks) catalogTracks.push(...cat.tracks);
      });
    }
    const combined = [...queue, ...catalogTracks];
    const seen = new Set();
    return combined.filter(t => {
      if (!t || !t.title) return false;
      const key = `${t.title}-${t.artist}`.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function renderArtistsGrid() {
    if (!els.artistsGridInner) return;
    const allTracks = getAllCatalogTracks();
    const artistMap = {};
    allTracks.forEach(t => {
      const art = t.artist || 'Unknown';
      const mainArt = art.split(/,| feat\.| & | with /i)[0].trim();
      if (!artistMap[mainArt]) artistMap[mainArt] = [];
      artistMap[mainArt].push(t);
    });

    const artists = Object.keys(artistMap).sort((a, b) => artistMap[b].length - artistMap[a].length);
    if (els.librarySubtitle) els.librarySubtitle.innerText = `${artists.length} Artists in Catalog`;

    const colors = [
      'from-purple-600 via-indigo-700 to-black',
      'from-blue-600 via-cyan-700 to-black',
      'from-amber-600 via-rose-700 to-black',
      'from-emerald-600 via-teal-700 to-black',
      'from-pink-600 via-fuchsia-700 to-black',
      'from-indigo-600 via-purple-700 to-black'
    ];

    els.artistsGridInner.innerHTML = artists.map((art, idx) => {
      const count = artistMap[art].length;
      const initials = art.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
      const grad = colors[idx % colors.length];
      return `
        <div class="artist-card glass-card p-3.5 flex flex-col items-center justify-center text-center cursor-pointer active:scale-95 transition-all group" data-artist="${art}">
          <div class="w-16 h-16 rounded-full bg-gradient-to-tr ${grad} flex items-center justify-center text-white font-black text-base shadow-md group-hover:scale-105 transition-transform mb-2">
            ${initials}
          </div>
          <span class="font-bold text-xs truncate w-full" style="color: var(--text-primary);">${art}</span>
          <span class="text-[10px] font-medium mt-0.5" style="color: var(--text-secondary);">${count} ${count === 1 ? 'Track' : 'Tracks'}</span>
        </div>
      `;
    }).join('');

    els.artistsGridInner.querySelectorAll('.artist-card').forEach(card => {
      card.addEventListener('click', () => {
        const art = card.getAttribute('data-artist');
        openArtistDetail(art, artistMap[art]);
      });
    });
  }

  function openArtistDetail(artistName, artistTracks) {
    if (!els.libraryArtistView) return;
    if (els.libraryArtistsGrid) els.libraryArtistsGrid.classList.add('hidden');
    els.libraryArtistView.classList.remove('hidden');

    const tracks = artistTracks || getAllCatalogTracks().filter(t => {
      const art = (t.artist || '').toLowerCase();
      return art.includes(artistName.toLowerCase());
    });

    if (els.artistViewName) els.artistViewName.innerText = artistName;
    if (els.artistViewMeta) els.artistViewMeta.innerText = `${tracks.length} Studio & Vault Tracks`;
    
    const initialsBox = document.getElementById('artist-view-avatar-initials');
    if (initialsBox) {
      initialsBox.innerText = artistName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    }

    if (els.artistBtnPlayAll) {
      els.artistBtnPlayAll.onclick = () => {
        engine.setQueue(tracks, false);
        engine.playTrack(0);
        scrollToPanel(2);
      };
    }

    if (els.artistBtnShuffle) {
      els.artistBtnShuffle.onclick = () => {
        const shuffled = [...tracks];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        engine.setQueue(shuffled, false);
        engine.playTrack(0);
        scrollToPanel(2);
      };
    }

    if (els.artistViewTracks) {
      const downloads = getDownloads();
      els.artistViewTracks.innerHTML = tracks.map((t, idx) => {
        const isSaved = downloads.some(d => d.id === t.id);
        const isFav = engine.isFavorite(t.id);
        return `
          <div class="track-item flex items-center cursor-pointer" data-aidx="${idx}">
            <span class="text-[11px] font-bold w-5 text-center mr-2" style="color: var(--text-tertiary);">${idx + 1}</span>
            <div class="w-[44px] h-[44px] rounded-[13px] overflow-hidden flex-shrink-0 shadow-sm" style="background: var(--bg-card-solid);">
              <img src="${t.thumb}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80'">
            </div>
            <div class="flex-1 overflow-hidden ml-3 mr-2">
              <div class="font-bold truncate text-[14px] leading-tight" style="color: var(--text-primary);">${t.title}</div>
              <span class="font-medium text-[11px]" style="color: var(--text-secondary);">${t.artist}</span>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              <span class="text-[11px] font-medium" style="color: var(--text-tertiary);">${t.duration || ''}</span>
              <button class="btn-artist-like w-7 h-7 rounded-full flex items-center justify-center active:scale-75 transition-all" data-track-id="${t.id}" title="Favorite">
                <i class="${isFav ? 'ph-fill ph-heart text-pink-500' : 'ph-bold ph-heart'}" style="${isFav ? '' : 'color: var(--text-tertiary);'}"></i>
              </button>
              <button class="btn-artist-add-pl w-7 h-7 rounded-full flex items-center justify-center active:scale-75 transition-all text-xs" data-track-id="${t.id}" title="Add to Playlist" style="color: var(--text-tertiary);">
                <i class="ph-bold ph-plus"></i>
              </button>
              <button class="btn-direct-download w-7 h-7 rounded-full flex items-center justify-center active:scale-75 transition-all" data-track-id="${t.id}" title="Save track">
                <i class="${isSaved ? 'ph-fill ph-check-circle text-emerald-500' : 'ph-bold ph-download-simple'}" style="${isSaved ? '' : 'color: var(--text-tertiary);'}"></i>
              </button>
              <i class="ph-fill ph-play text-sm ml-0.5" style="color: var(--text-secondary);"></i>
            </div>
          </div>
        `;
      }).join('');

      els.artistViewTracks.querySelectorAll('.track-item').forEach(item => {
        item.addEventListener('click', (e) => {
          if (e.target.closest('.btn-direct-download') || e.target.closest('.btn-artist-like') || e.target.closest('.btn-artist-add-pl')) return;
          const idx = parseInt(item.getAttribute('data-aidx'));
          engine.setQueue(tracks, false);
          engine.playTrack(idx);
          scrollToPanel(2);
        });
      });

      els.artistViewTracks.querySelectorAll('.btn-artist-like').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const tid = btn.getAttribute('data-track-id');
          const track = tracks.find(t => t.id === tid);
          if (track) {
            const isFav = engine.toggleFavorite(track);
            engine.playHaptic(600, 0.02);
            btn.innerHTML = `<i class="${isFav ? 'ph-fill ph-heart text-pink-500' : 'ph-bold ph-heart'}" style="${isFav ? '' : 'color: var(--text-tertiary);'}"></i>`;
          }
        });
      });

      els.artistViewTracks.querySelectorAll('.btn-artist-add-pl').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const tid = btn.getAttribute('data-track-id');
          const track = tracks.find(t => t.id === tid);
          if (track) openAddToPlaylistModal(track);
        });
      });

      els.artistViewTracks.querySelectorAll('.btn-direct-download').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const tid = btn.getAttribute('data-track-id');
          const track = tracks.find(t => t.id === tid);
          if (track) {
            engine.downloadTrack(track);
            btn.innerHTML = '<i class="ph-fill ph-check-circle text-emerald-500 text-base"></i>';
          }
        });
      });
    }
  }

  if (els.artistBackBtn) {
    els.artistBackBtn.addEventListener('click', () => {
      if (els.libraryArtistView) els.libraryArtistView.classList.add('hidden');
      if (els.libraryArtistsGrid) els.libraryArtistsGrid.classList.remove('hidden');
    });
  }

  function renderAlbumsGrid() {
    if (!els.albumsGridInner) return;
    const albums = [
      { id: 'gbgr', title: 'Goodbye & Good Riddance', artist: 'Juice WRLD', year: '2018', count: 16, grad: 'from-blue-700 via-indigo-900 to-black', border: 'border-blue-500/40' },
      { id: 'drfl', title: 'Death Race For Love', artist: 'Juice WRLD', year: '2019', count: 22, grad: 'from-amber-600 via-orange-950 to-black', border: 'border-amber-500/40' },
      { id: 'lnd', title: 'Legends Never Die', artist: 'Juice WRLD', year: '2020', count: 21, grad: 'from-purple-700 via-fuchsia-950 to-black', border: 'border-purple-500/40' },
      { id: 'fd', title: 'Fighting Demons', artist: 'Juice WRLD', year: '2021', count: 18, grad: 'from-red-700 via-rose-950 to-black', border: 'border-red-500/40' },
      { id: 'wod', title: 'Wrld On Drugs', artist: 'Future & Juice WRLD', year: '2018', count: 16, grad: 'from-emerald-700 via-teal-950 to-black', border: 'border-emerald-500/40' },
      { id: 'vault', title: 'The Lost Vault (Grails)', artist: 'Juice WRLD', year: 'Unreleased', count: 90, grad: 'from-amber-500 via-rose-950 to-black', border: 'border-amber-400/50' }
    ];

    if (els.librarySubtitle) els.librarySubtitle.innerText = `${albums.length} Album Projects`;

    els.albumsGridInner.innerHTML = albums.map(alb => `
      <div class="album-card relative h-40 rounded-2xl overflow-hidden cursor-pointer active:scale-95 transition-all p-3.5 flex flex-col justify-between bg-gradient-to-br ${alb.grad} shadow-xl border ${alb.border} group" data-album="${alb.title}">
        <div class="flex items-center justify-between">
          <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-white/20 text-white shadow-sm">${alb.year}</span>
          <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <i class="ph-fill ph-play text-white text-sm"></i>
          </div>
        </div>
        <div>
          <span class="font-black text-white text-sm leading-tight block">${alb.title}</span>
          <span class="text-[11px] font-medium text-white/80 mt-0.5 block">${alb.artist}</span>
          <span class="text-[10px] font-bold text-amber-300 mt-1 block">${alb.count} Tracks</span>
        </div>
      </div>
    `).join('');

    els.albumsGridInner.querySelectorAll('.album-card').forEach(card => {
      card.addEventListener('click', () => {
        const albTitle = card.getAttribute('data-album');
        launchAlbumPlay(albTitle);
      });
    });
  }

  function launchAlbumPlay(albumTitle) {
    let tracks = getAllCatalogTracks().filter(t => {
      const title = (t.title || '').toLowerCase();
      if (albumTitle.includes('Goodbye')) return title.includes('lucid') || title.includes('all girls') || title.includes('lean wit') || title.includes('wasted') || title.includes('black & white') || title.includes('candles') || title.includes('hurt me') || title.includes('used to') || title.includes('im still');
      if (albumTitle.includes('Death Race')) return title.includes('robbery') || title.includes('hear me calling') || title.includes('fast') || title.includes('flaws') || title.includes('empty') || title.includes('maze') || title.includes('feeling') || title.includes('ring ring');
      if (albumTitle.includes('Legends Never')) return title.includes('righteous') || title.includes('wishing well') || title.includes('come & go') || title.includes('hate the other') || title.includes('conversations') || title.includes('life\'s a mess') || title.includes('blood on my');
      if (albumTitle.includes('Fighting')) return title.includes('burn') || title.includes('already dead') || title.includes('cigarettes') || title.includes('sometimes') || title.includes('wandered to la') || title.includes('rockstar in his');
      if (albumTitle.includes('Wrld On Drugs')) return title.includes('fine china') || title.includes('wrld on drugs') || title.includes('jet lag') || title.includes('astronauts') || title.includes('hard work pays');
      if (albumTitle.includes('Lost Vault')) return title.includes('rental') || title.includes('red moonlight') || title.includes('ktm') || title.includes('biscotti') || title.includes('cavalier') || title.includes('starfire') || title.includes('autograph') || title.includes('iron on me');
      return true;
    });

    if (tracks.length === 0) tracks = engine.getState().queue.slice(0, 20);
    engine.setQueue(tracks, false);
    engine.playTrack(0);
    scrollToPanel(2);
  }

  function renderGenresGrid() {
    if (!els.genresGridInner) return;
    if (els.librarySubtitle) els.librarySubtitle.innerText = "8 Top 100 Genre Shuffles";
    if (typeof TOP_SHUFFLES_CATALOG === 'undefined') return;

    els.genresGridInner.innerHTML = Object.values(TOP_SHUFFLES_CATALOG).map(cat => `
      <div class="genre-card relative h-28 rounded-2xl overflow-hidden cursor-pointer active:scale-95 transition-all p-3 flex flex-col justify-between bg-gradient-to-br ${cat.gradient} shadow-md border ${cat.border}" data-genre="${cat.id}">
        <div class="flex justify-between items-center">
          <span class="text-[9px] font-bold text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded-full">${cat.tag}</span>
          <i class="ph-fill ph-shuffle text-white/80 text-sm"></i>
        </div>
        <div>
          <span class="font-black text-white text-xs leading-tight block">${cat.name}</span>
          <span class="text-[10px] text-white/70 truncate block mt-0.5">${cat.subtitle}</span>
        </div>
      </div>
    `).join('');

    els.genresGridInner.querySelectorAll('.genre-card').forEach(card => {
      card.addEventListener('click', () => {
        const gid = card.getAttribute('data-genre');
        launchGenreShuffle(gid);
      });
    });
  }

  // ═══ SCRUBBER ═══
  if (els.deckScrubberTrack) {
    function scrub(e) {
      const rect = els.deckScrubberTrack.getBoundingClientRect();
      let x = e.clientX || (e.touches && e.touches[0].clientX);
      let pct = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
      if (els.deckScrubberFill) els.deckScrubberFill.style.transform = `scaleX(${pct})`;
      if (els.deckScrubberThumb) els.deckScrubberThumb.style.left = `${pct * 100}%`;
      return pct * 100;
    }
    els.deckScrubberTrack.addEventListener('mousedown', (e) => { isDragging = true; scrub(e); });
    window.addEventListener('mousemove', (e) => { if (isDragging) scrub(e); });
    window.addEventListener('mouseup', (e) => { if (isDragging) { engine.seek(scrub(e)); isDragging = false; } });
    els.deckScrubberTrack.addEventListener('touchstart', (e) => { isDragging = true; scrub(e); }, { passive: true });
    window.addEventListener('touchmove', (e) => { if (isDragging) scrub(e); }, { passive: true });
    window.addEventListener('touchend', (e) => {
      if (isDragging && e.changedTouches && e.changedTouches[0]) engine.seek(scrub(e.changedTouches[0]));
      isDragging = false;
    });
  }

  // ═══ MASTER REAL-TIME SYNCED KARAOKE LYRICS WITH CALIBRATION ═══
  let activeLyricIndex = -1;
  let lyricSyncOffset = 0.0; // In seconds: negative = earlier, positive = later

  const btnLyricNudgeBack = document.getElementById('btn-lyric-nudge-back');
  const btnLyricNudgeFwd = document.getElementById('btn-lyric-nudge-fwd');
  const btnLyricSyncReset = document.getElementById('btn-lyric-sync-reset');
  const lyricSyncOffsetLabel = document.getElementById('lyric-sync-offset-label');

  function updateLyricOffsetDisplay() {
    if (lyricSyncOffsetLabel) {
      const sign = lyricSyncOffset > 0 ? '+' : (lyricSyncOffset < 0 ? '' : '±');
      lyricSyncOffsetLabel.innerText = `${sign}${Math.abs(lyricSyncOffset).toFixed(1)}s`;
      if (lyricSyncOffset < 0) lyricSyncOffsetLabel.innerText = `-${Math.abs(lyricSyncOffset).toFixed(1)}s`;
      lyricSyncOffsetLabel.style.color = (lyricSyncOffset !== 0) ? '#ff4f00' : 'var(--text-primary)';
    }
    const state = engine.getState();
    updateLyricsHighlight(state.currentTime || 0, true);
  }

  if (btnLyricNudgeBack) {
    btnLyricNudgeBack.addEventListener('click', (e) => {
      e.stopPropagation();
      lyricSyncOffset = Math.max(-10.0, lyricSyncOffset - 0.5);
      engine.playHaptic(550, 0.02);
      updateLyricOffsetDisplay();
    });
  }

  if (btnLyricNudgeFwd) {
    btnLyricNudgeFwd.addEventListener('click', (e) => {
      e.stopPropagation();
      lyricSyncOffset = Math.min(10.0, lyricSyncOffset + 0.5);
      engine.playHaptic(650, 0.02);
      updateLyricOffsetDisplay();
    });
  }

  if (btnLyricSyncReset) {
    btnLyricSyncReset.addEventListener('click', (e) => {
      e.stopPropagation();
      lyricSyncOffset = 0.0;
      engine.playHaptic(500, 0.02);
      updateLyricOffsetDisplay();
    });
  }

  // ═══ PLAYBACK SPEED CONTROLLER (0.75x, 1.0x, 1.25x, 1.5x) ═══
  const deckBtnSpeed = document.getElementById('deck-btn-speed');
  const SPEED_PRESETS = [1.0, 1.25, 1.5, 0.75];
  let currentSpeedIdx = 0;

  if (deckBtnSpeed) {
    deckBtnSpeed.addEventListener('click', (e) => {
      e.stopPropagation();
      currentSpeedIdx = (currentSpeedIdx + 1) % SPEED_PRESETS.length;
      const speed = SPEED_PRESETS[currentSpeedIdx];
      engine.setPlaybackSpeed(speed);
      engine.playHaptic(600, 0.025);
      deckBtnSpeed.innerText = `${speed}x`;
      if (speed !== 1.0) {
        deckBtnSpeed.style.color = '#ff4f00';
        deckBtnSpeed.style.borderColor = 'rgba(255, 79, 0, 0.5)';
      } else {
        deckBtnSpeed.style.color = 'var(--text-secondary)';
        deckBtnSpeed.style.borderColor = '';
      }
    });
  }

  function renderSyncedLyrics(raw) {
    parsedLyrics = [];
    activeLyricIndex = -1;
    if (!els.deckLyricsText) return;
    els.deckLyricsText.innerHTML = '';

    const lines = (raw || '').split('\n');
    lines.forEach(line => {
      const match = line.match(/\[(\d{1,2}):(\d{2}(?:\.\d{1,3})?)\](.*)/);
      if (match) {
        const minutes = parseInt(match[1], 10);
        const seconds = parseFloat(match[2]);
        const time = minutes * 60 + seconds;
        const text = match[3].trim();
        if (text) {
          parsedLyrics.push({ time, text });
        }
      } else if (line.trim() && !line.startsWith('[ti:') && !line.startsWith('[ar:') && !line.startsWith('[al:')) {
        parsedLyrics.push({ time: -1, text: line.trim() });
      }
    });

    if (parsedLyrics.length === 0) {
      els.deckLyricsText.innerHTML = `<div class="text-center py-12 text-xs font-bold leading-relaxed px-4" style="color: var(--text-secondary);">${(raw || '').replace(/\n/g, '<br>')}</div>`;
      return;
    }

    els.deckLyricsText.innerHTML = parsedLyrics.map((p, idx) => `
      <p class="lyric-line transition-all duration-300 py-1.5 px-3 rounded-xl cursor-pointer select-none text-[13px] font-semibold leading-relaxed hover:opacity-90" 
         data-idx="${idx}" 
         data-time="${p.time}" 
         style="color: rgba(255,255,255,0.4); opacity: 0.4;">
        ${p.text}
      </p>
    `).join('');

    // Interactive Click to jump to timestamp
    els.deckLyricsText.querySelectorAll('.lyric-line').forEach(el => {
      el.addEventListener('click', () => {
        const t = parseFloat(el.getAttribute('data-time'));
        if (t >= 0) {
          engine.playHaptic(500, 0.02);
          engine.seek(t);
          updateLyricsHighlight(t, true);
        }
      });
    });

    // Initial highlight check
    updateLyricsHighlight(engine.getState().currentTime || 0, true);
  }

  function updateLyricsHighlight(cTime, forceScroll = false) {
    if (!els.deckLyricsText || parsedLyrics.length === 0) return;
    const effectiveTime = cTime + lyricSyncOffset;
    let newIdx = -1;
    for (let i = 0; i < parsedLyrics.length; i++) {
      if (parsedLyrics[i].time >= 0 && effectiveTime >= parsedLyrics[i].time - 0.15) {
        newIdx = i;
      }
    }

    if (newIdx !== activeLyricIndex || forceScroll) {
      activeLyricIndex = newIdx;
      const lineElements = els.deckLyricsText.querySelectorAll('.lyric-line');
      lineElements.forEach((lineEl, idx) => {
        if (idx === activeLyricIndex) {
          lineEl.style.color = '#ffffff';
          lineEl.style.fontSize = '1.05rem';
          lineEl.style.fontWeight = '900';
          lineEl.style.opacity = '1.0';
          lineEl.style.transform = 'scale(1.04)';
          lineEl.style.textShadow = '0 0 14px rgba(255, 120, 40, 0.7), 0 2px 6px rgba(0,0,0,0.8)';
          lineEl.style.background = 'transparent';
          lineEl.style.border = 'none';
          lineEl.style.boxShadow = 'none';
          lineEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          lineEl.style.color = 'rgba(255, 255, 255, 0.4)';
          lineEl.style.fontSize = '0.85rem';
          lineEl.style.fontWeight = '600';
          lineEl.style.opacity = '0.35';
          lineEl.style.transform = 'scale(0.96)';
          lineEl.style.textShadow = 'none';
          lineEl.style.background = 'transparent';
          lineEl.style.border = 'none';
          lineEl.style.boxShadow = 'none';
        }
      });
    }
  }

  // Periodic high-precision lyric tracker
  if (lyricsHighlightInterval) clearInterval(lyricsHighlightInterval);
  lyricsHighlightInterval = setInterval(() => {
    if (currentDeckMode === 'lyrics') {
      const state = engine.getState();
      if (state.isPlaying) {
        updateLyricsHighlight(state.currentTime);
      }
    }
  }, 120);

  // Real-time engine progress event listener
  window.addEventListener('engine:progress', (e) => {
    if (currentDeckMode === 'lyrics' && e.detail && e.detail.currentTime !== undefined) {
      updateLyricsHighlight(e.detail.currentTime);
    }
  });

  async function loadTrackLyrics(rawTitle, rawArtist) {
    if (!els.deckLyricsText) return;
    els.deckLyricsText.innerHTML = '<div class="text-center py-12 text-xs font-bold animate-pulse" style="color: var(--text-tertiary);">Loading synced lyrics...</div>';
    
    try {
      const lyrics = await engine.fetchLyrics(rawTitle, rawArtist);
      if (lyrics) {
        renderSyncedLyrics(lyrics);
      } else {
        els.deckLyricsText.innerHTML = `
          <div class="text-center py-12 text-xs font-bold space-y-2" style="color: var(--text-tertiary);">
            <i class="ph-bold ph-music-notes text-2xl text-purple-400"></i>
            <p>No synced lyrics found for "${rawTitle}".</p>
          </div>
        `;
      }
    } catch (e) {
      els.deckLyricsText.innerHTML = '<div class="text-center py-12 text-xs font-bold" style="color: var(--text-tertiary);">Could not load lyrics.</div>';
    }
  }

  // Genre cards wired at top

  // ═══ DYNAMIC AMBIENT AURA ═══
  const MOOD_GRADIENTS = {
    'purple': 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(99, 102, 241, 0.2) 50%, transparent 80%)',
    'blue': 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(30, 64, 175, 0.2) 50%, transparent 80%)',
    'amber': 'radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, rgba(234, 88, 12, 0.2) 50%, transparent 80%)',
    'red': 'radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, rgba(190, 18, 60, 0.2) 50%, transparent 80%)',
    'emerald': 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, rgba(5, 150, 105, 0.2) 50%, transparent 80%)',
    'pink': 'radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, rgba(168, 85, 247, 0.2) 50%, transparent 80%)'
  };

  function updateAmbientAura(track) {
    if (!els.ambientAuraGlow || !track) return;
    const title = (track.title || '').toLowerCase();
    let gradKey = 'purple';
    if (title.includes('death race') || title.includes('robbery') || title.includes('hear me calling')) gradKey = 'blue';
    else if (title.includes('legends') || title.includes('righteous') || title.includes('wishing well') || title.includes('smile')) gradKey = 'amber';
    else if (title.includes('fighting') || title.includes('burn') || title.includes('already dead') || title.includes('doom')) gradKey = 'red';
    else if (title.includes('wrld on drugs') || title.includes('fine china')) gradKey = 'emerald';
    else if (title.includes('vault') || title.includes('rental') || title.includes('red moonlight') || title.includes('biscotti')) gradKey = 'pink';

    els.ambientAuraGlow.style.background = MOOD_GRADIENTS[gradKey];
  }

  // ═══ EQUALIZER CONTROLLER ═══
  function updateEqUI(presetId) {
    const presets = engine.getEqPresets();
    const current = presets[presetId] || presets['999_bass_boost'];
    if (els.deckEqLabel) els.deckEqLabel.innerText = current.name.split(' ')[0].toUpperCase();
    if (els.deckBtnEq) els.deckBtnEq.style.color = current.color || '#a855f7';
    if (els.settingsEqBadge) {
      els.settingsEqBadge.innerText = current.name.toUpperCase();
      els.settingsEqBadge.style.color = current.color;
      els.settingsEqBadge.style.backgroundColor = `${current.color}25`;
    }

    if (els.settingsEqGrid) {
      els.settingsEqGrid.querySelectorAll('.settings-eq-btn').forEach(btn => {
        const id = btn.getAttribute('data-eq');
        const isMatch = (id === presetId);
        const iconCheck = btn.querySelector('.ph-check-circle');
        if (isMatch) {
          btn.classList.add('active');
          btn.style.borderColor = current.color;
          btn.style.background = `${current.color}15`;
          if (iconCheck) iconCheck.classList.remove('hidden');
        } else {
          btn.classList.remove('active');
          btn.style.borderColor = 'var(--border-card)';
          btn.style.background = 'var(--bg-card-solid)';
          if (iconCheck) iconCheck.classList.add('hidden');
        }
      });
    }
  }

  const EQ_PRESET_ORDER = ['999_bass_boost', 'studio_master', 'vinyl_warmth', 'vocal_clarity', 'emo_rock'];
  if (els.deckBtnEq) {
    els.deckBtnEq.addEventListener('click', () => {
      engine.playHaptic(700, 0.03);
      const currentId = engine.getEqPreset();
      const nextIdx = (EQ_PRESET_ORDER.indexOf(currentId) + 1) % EQ_PRESET_ORDER.length;
      const nextId = EQ_PRESET_ORDER[nextIdx];
      engine.setEqPreset(nextId);
    });
  }

  if (els.settingsEqGrid) {
    els.settingsEqGrid.querySelectorAll('.settings-eq-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        engine.playHaptic(650, 0.025);
        const eqId = btn.getAttribute('data-eq');
        engine.setEqPreset(eqId);
      });
    });
  }

  window.addEventListener('engine:eqChanged', (e) => {
    updateEqUI(e.detail.id);
  });

  // ═══ SLEEP TIMER CONTROLLER ═══
  function openSleepModal() {
    engine.playHaptic(500, 0.02);
    if (!els.modalSleepTimer) return;
    els.modalSleepTimer.classList.remove('hidden');
    setTimeout(() => {
      els.modalSleepTimer.classList.remove('opacity-0');
    }, 10);
  }

  function closeSleepModal() {
    engine.playHaptic(400, 0.02);
    if (!els.modalSleepTimer) return;
    els.modalSleepTimer.classList.add('opacity-0');
    setTimeout(() => {
      els.modalSleepTimer.classList.add('hidden');
    }, 200);
  }

  if (els.deckBtnSleep) els.deckBtnSleep.addEventListener('click', openSleepModal);
  if (els.settingsBtnSleep) els.settingsBtnSleep.addEventListener('click', openSleepModal);
  if (els.btnCloseSleepModal) els.btnCloseSleepModal.addEventListener('click', closeSleepModal);
  if (els.modalSleepTimer) {
    els.modalSleepTimer.addEventListener('click', (e) => {
      if (e.target === els.modalSleepTimer) closeSleepModal();
    });
  }

  const sleepPresetButtons = document.querySelectorAll('.sleep-preset-btn');
  sleepPresetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      engine.playHaptic(600, 0.03);
      const mins = parseInt(btn.getAttribute('data-mins'), 10) || 15;
      engine.setSleepTimer(mins);
      closeSleepModal();
    });
  });

  if (els.btnCancelSleepTimer) {
    els.btnCancelSleepTimer.addEventListener('click', () => {
      engine.playHaptic(400, 0.03);
      engine.cancelSleepTimer();
      closeSleepModal();
    });
  }

  window.addEventListener('engine:sleepTimerUpdated', (e) => {
    const { active, remaining } = e.detail;
    if (active && remaining > 0) {
      const m = Math.floor(remaining / 60);
      const s = remaining % 60;
      const formatted = `${m}:${s < 10 ? '0' : ''}${s}`;
      if (els.deckSleepBadge) {
        els.deckSleepBadge.innerText = formatted;
        els.deckSleepBadge.classList.remove('hidden');
      }
      if (els.deckSleepIcon) els.deckSleepIcon.classList.add('hidden');
      if (els.btnCancelSleepTimer) els.btnCancelSleepTimer.classList.remove('hidden');
      if (els.sleepModalCountdown) els.sleepModalCountdown.innerText = formatted;
    } else {
      if (els.deckSleepBadge) els.deckSleepBadge.classList.add('hidden');
      if (els.deckSleepIcon) els.deckSleepIcon.classList.remove('hidden');
      if (els.btnCancelSleepTimer) els.btnCancelSleepTimer.classList.add('hidden');
    }
  });

  // ═══ 999 MEMORIAL TRIBUTE CONTROLLER ═══
  function open999Tribute() {
    engine.playHaptic(750, 0.03);
    if (!els.modal999Tribute) return;
    els.modal999Tribute.classList.remove('hidden');
    setTimeout(() => {
      els.modal999Tribute.classList.remove('opacity-0');
    }, 10);
  }

  function close999Tribute() {
    engine.playHaptic(400, 0.02);
    if (!els.modal999Tribute) return;
    els.modal999Tribute.classList.add('opacity-0');
    setTimeout(() => {
      els.modal999Tribute.classList.add('hidden');
    }, 200);
  }

  if (els.homeBrandTribute) els.homeBrandTribute.addEventListener('click', open999Tribute);
  if (els.deckBrandTribute) els.deckBrandTribute.addEventListener('click', open999Tribute);
  if (els.deckSpindleTribute) els.deckSpindleTribute.addEventListener('click', open999Tribute);
  if (els.settingsTributeLink) els.settingsTributeLink.addEventListener('click', open999Tribute);
  if (els.btnCloseTributeModal) els.btnCloseTributeModal.addEventListener('click', close999Tribute);
  const btnTributePeacefulClose = document.getElementById('btn-tribute-peaceful-close');
  if (btnTributePeacefulClose) btnTributePeacefulClose.addEventListener('click', close999Tribute);
  if (els.modal999Tribute) {
    els.modal999Tribute.addEventListener('click', (e) => {
      if (e.target === els.modal999Tribute) close999Tribute();
    });
  }

  if (els.btnTributePlayVault) {
    els.btnTributePlayVault.addEventListener('click', async () => {
      engine.playHaptic(800, 0.04);
      close999Tribute();
      try {
        const res = await fetch('/api/genre_radio?genre=Juice%20WRLD:%20The%20Lost%20Vault');
        const d = await res.json();
        if (d.tracks && d.tracks.length > 0) {
          engine.setQueue(d.tracks, 0);
          engine.playTrack(0);
          scrollToPanel(2);
        }
      } catch(e) {}
    });
  }



  // ═══ HAPTIC AUDIO FEEDBACK FOR CONTROLS & WHEEL ═══
  if (els.toggleSettingsHaptics) {
    els.toggleSettingsHaptics.addEventListener('click', () => {
      const isEnabled = engine.toggleHaptics();
      if (isEnabled) els.toggleSettingsHaptics.classList.add('active');
      else els.toggleSettingsHaptics.classList.remove('active');
      engine.playHaptic(700, 0.03);
    });
  }



  navBtns.forEach(btn => {
    btn.addEventListener('click', () => engine.playHaptic(500, 0.02));
  });

  // ═══ SETTINGS TOGGLES ═══
  const settingsToggles = document.querySelectorAll('.toggle-switch:not(#toggle-light-mode):not(#toggle-settings-rabbit):not(#toggle-settings-haptics):not(#toggle-fullscreen)');
  settingsToggles.forEach(toggle => {
    const toggleId = toggle.id || `toggle-${Math.random().toString(36).slice(2, 8)}`;
    toggle.id = toggleId;
    const saved = localStorage.getItem(toggleId);
    if (saved === 'true') toggle.classList.add('active');
    else if (saved === 'false') toggle.classList.remove('active');
    toggle.addEventListener('click', () => {
      const isActive = toggle.classList.toggle('active');
      localStorage.setItem(toggleId, isActive ? 'true' : 'false');
    });
  });

  // ═══ LIGHT MODE CONTROLLER ═══
  const toggleLight = document.getElementById('toggle-light-mode');
  if (toggleLight) {
    const isLight = localStorage.getItem('juicebx_light_mode') === 'true';
    if (isLight) {
      document.body.classList.add('light-mode');
      toggleLight.classList.add('active');
    }
    toggleLight.addEventListener('click', () => {
      const active = document.body.classList.toggle('light-mode');
      toggleLight.classList.toggle('active', active);
      localStorage.setItem('juicebx_light_mode', active ? 'true' : 'false');
      if (window.ThemeManager) {
        window.ThemeManager.applyPalette(window.ThemeManager.currentQuad, window.ThemeManager.currentHex, true);
      }
      engine.playHaptic(600, 0.02);
      if (typeof showToast === 'function') {
        showToast(active ? "☀️ Light Mode Enabled" : "🌙 Dark Mode Enabled", "info");
      }
    });
  }

  // ═══ AUTO-ROTATE TOGGLE (Default Off) ═══
  const toggleAutoRotate = document.getElementById('toggle-auto-rotate');
  if (toggleAutoRotate) {
    const isAutoRotate = localStorage.getItem('juicebx_auto_rotate') === 'true';
    toggleAutoRotate.classList.toggle('active', isAutoRotate);
    toggleAutoRotate.addEventListener('click', () => {
      const active = toggleAutoRotate.classList.toggle('active');
      localStorage.setItem('juicebx_auto_rotate', active ? 'true' : 'false');
      engine.playHaptic(600, 0.02);
    });
  }

  // ═══ WAKELOCK CONTROLLER (Keep Screen Awake) ═══
  let wakeLockSentinel = null;
  async function syncWakeLock() {
    const isWakeLock = localStorage.getItem('juicebx_wakelock') === 'true';
    if (isWakeLock && 'wakeLock' in navigator && document.visibilityState === 'visible') {
      try {
        wakeLockSentinel = await navigator.wakeLock.request('screen');
      } catch(e) {}
    } else if (wakeLockSentinel) {
      try {
        await wakeLockSentinel.release();
        wakeLockSentinel = null;
      } catch(e) {}
    }
  }

  const toggleWakeLock = document.getElementById('toggle-wakelock');
  if (toggleWakeLock) {
    const isWakeLock = localStorage.getItem('juicebx_wakelock') === 'true';
    toggleWakeLock.classList.toggle('active', isWakeLock);
    if (isWakeLock) syncWakeLock();
    toggleWakeLock.addEventListener('click', () => {
      const active = toggleWakeLock.classList.toggle('active');
      localStorage.setItem('juicebx_wakelock', active ? 'true' : 'false');
      syncWakeLock();
      engine.playHaptic(600, 0.02);
    });
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') syncWakeLock();
  });

  // ═══ COLORHUNT 338-PALETTE THEME SYSTEM ═══
  const PACKED_THEMES = "F2F2F7FFFFFFE5E5EA007AFF51609174BEC1ADEBBEEEF3AD734444C37857EEEDBE99B27FF2FC9FEDBB91DA6969B059776342586D608760A0B09AD1AAF39DE59B77DA4E6B9F6FA5B17DD87D4C91735B446A906387E97A7A8B4F808B76A5B9C0D5B1E9A37AC38F88E0D0C7EEFF639CD95454C5342056220E248ECCCC50717B3A4042212121F1F4C6D6D0B8AAA6A4837D7DE1DFBA7F7E904D424D36292CF7C469C46352714433412525E6F18C72B37E437975555C788BE3E1D3F7AD95BB7697935CD68438F1B24B36846B4BB39A9AE17B6BBA6230747042476DFFFF8FEC9E69D560737A4579F96D6DB84D69A9D7F68FB1E9EBD9DDD8AED39182C4486989D5AB9CE6E6967BC0A354878F48829E51DACF9EF5CFE8FFB1686EE25C3E84F35C6EFFA87B8FC9AE548E87385B66BDDAA5E2EFF1B6D5E165799B5552731D1716402A23A55233F3BC773E3245524A7997D8EC74BBCAE04B5AE497565B305A9A4C68F7EC77DA5151ED9F668764642A221E46322BC73F65D580BC333A7B4B698270C6C7B4FFD8D789D79D65C95D54A42A3D66FA8572B249686C37796C5FA7E5F1E3A3CD9E52947135635B7FCBD7857EBBCA9DD7FACBD3FFE76AE0AB5B94784C6E4C41ABF2FBB589EFA964CDF1A3C54C5F7A393E6F3D2E4F321D2FF7FFBAF7E39CEBAF81DA8067EBBF587693533D655D33484DA45FBE382F604851884B81ABB3F7F67DD076F1F592F4CB813E65459973E282CEDAECFFB198D8FF796DCE694B7C402A3036413D4C657EF29696FFE2ADC1E8DAC968685E4949866770D15555EDA489E8FD96A1D76FDFFCAD6EC189595CAE424478314357456672E3B587C98C70364968FDDF97E096646C43434531B1A836ADF16896FFF0A4B2B7FFD5E8FFD9A2F1D86F9BEFD8F4D4ABDCEA5656F1E38AD19FEBFFFD9DF7D08CED8282FFEBBC5DA7AE543D46292830BDF9F793C4FFB67CCF765A60D4A2BE75597DB0B8B4F8E4DD8CDADB815E94F4F49EF1D089FFD7BE95977A3F4C48373640EF8F6BD36239E2DD66A8B94E49493C9FA180F2F77F6EBAA73D322C6545349C563DD9B26EDBEF98605CB860C2A49DF0AC3B503D4A746EF1EDB3C8CF94477D7F1F535764BD97C2FFBBEDF3B7E5C8909268A5644A7FD19178A1583ED4C07AF8F7A5A6F2DB7BCACE678EB44F4E799EFFA936485E33314629252C304D4E4B75518A9E52F0D699804D3B522E2475BEDA9AEDF42B2E4AE8454590374953354A764F517FC5CA9FE6DCCFFFFFBBE06C7CB855469B4C3C6E57F6AAD0E9767C8F5B4ADDD49F5F5DBD5E87B883CEE0A4FBE3EE7C4BC45D3EC6C5B3F5F0C47A81EB504AA72533615995977A9EAF655989DE88A5FFCEBB9A69E147429DF7B7F3E27393E6A157C9753D973A3A5B252D33425B5BAAEC526ED0484CB0884939967248CAA653E9E995EE837454567ADAB784F8F3B6EEFCA9B7E57683CC615A9E7C56BFB538817AF5F093FBD66F96C99C55829C4857913A316EFF94C7E760BF7E49AC343A69352D4D6D619269B0C192E0A9567582464D5CF7DDA4B89068FDA4CFF46D6DB3533DF0D4A26C95EC3D61AD81E1AF41A06FB0E6FF7687DB8F45A9582E48693F27E4C144DF7943C24B3922576341D8BF2F89B33B50B2F9ED69F08A5DB83B5E6A2C70C1F88055C59D4F5AA87481CFF75B5BC83B4C46265C794D9A1B4B4DF3F66FF1D15FE8984A6119198E2735DEAE4FFAF18935394126282B5F85DB90B8F826635212806153C0A2B5F7E665E8923994D6354ABF3D289B561F55DF3554902424541F1FFBF8CAA13F805E10433608274EC9DF63A1D03576A7344986FFEA54FFCB3CFEAA2BFF5757ECA106D34F1E91300A5F1B0049260A623B1CCAAD8CF6EDDD3F3F3F95956ED2D86EEFEFEFE7272DAE2A2FFEC24AF6E5E470560DC3A655EFD99BF8EDCDE5EDC4E1A6E1934662463832D7DF710E5F76083D56081E3F48466D3D84A846CDCFABEDD81A2634203E5FEEC550F9E3A3F0F5F9C9D6DF52616B1E2022F6538FB83F87F3E94CE8D124F5F0E8D3BD9AA28F70674F04AEE1FC60ABFB5170FD4636FC438A7052CEBA8AFFB4EAFF81FFF56CF1B1494366A9679CEBFADB3FECF7C551574827332DF7B449DDE9F88293E35847AD83CBFB377FD9EDF68DF1D8512C29554C5FB1F9F194CDD5823629994262C544AEC293EFED4B4C7AEB92FBC855BCA03271D6ECFA6F3826B84A39F15C5CEFBFC6C228288A0F0F3C03030E153A3D5AF122D1EEE2F3F5231A31E42F45B42B3F8AB2FFD2F079C8D35BAD8C45A2663EE4BA6FFAE88EEB5E60A52F57483243684184CB73BBF3C2CBF83E4BF7E185CB9BBA9D53C31D025101908174CC7ED2EBA7D93153EB5033FF9D00FFD82CD2E4F18FACC0818D97484D51303242394359F2BE8DBA6C650E2E3B1666787DB9B3D8D7C3492B7B301551ED8A0AF7D914E8E3C7D4CEB0B85B3FA65238EADADAD59DC5BF5CAA4D3A4D2F1B44892C41C89034FBFF5F343434055E6862A388B9D2D25639A620236DFA4848FFE087FF9234FFCD3CFAFCB4B0DB72E35454F6FA7BD2D868AC9742E0F6AA69AEFF9D4DFF6B32782F2342E42F45B42B3F7CA0E5FFEDC6FFC478FFF87D724330FFFBB7FFA84968848B4A2B131A2634203E5FFFCC00FEE5B1114B5F1A936F88D498F3E9D24AC6B74F5E7F965F8AFF70704A237761529FBA69DEF3E96D222831393E4600ADB5EEEEEE5DACBD24527AA7BCB9E0EBEBEB2A5DFF6F41FFB44BFFEB7D7400218D0033BD3246FDC8AA062C800E6AC74FB9FCF6F5DAE4E4E441B3D361D2DC444444BDD8F182A6CB3667A6214177A62671DB466BF96C48F5D773C2FFFF8BDEFFA888FF26466FFBA834FCE850387ADF50C4EDFEED30FF6868924992504077442B72993D9A8A6BF0FEDF9680FFDB55E0A35B70F34850B91F3A5241A1868CCA6ED3F689F5EB82DFB361D3775DA75377824C96433466FFAF4FED733FA8E0E15A96BB75448CC46CAAE9E6C9CA6144566683393E51FDFBDAD3D0A8819F7F2D4659D0F66A36C186158A8C1E5287F7EBC9F2CC96814906D35823FADB3FECF7C5EA565627332D055049FAF35E069A8EA1E3D8D1DBBD91AA9D3E606F193441957541BE9639FCCF5BDDE9EB5156612E9F8268C170D6EC8CC24242E08932E5C955F2F5B1FFC7C7DC7646A45C5C6C476ED8B5DEF9F1BFF3B75BCC7F2A4AC3BEA3DEC9E6EFBFFAAC647C6FFF5CA9FFFCFF90FFDE68335C49678C40BDBE36E5DD90EB586FD8E9F04AA0D5454553CCF62C98C74E60A261357A5B3B544183E85A2CB978107A8BF7FA8676E7C79E7EFF9C4B9E0D7685084D6869C181CCF186D5441C013C4D9DD5CBF3E5B13D5A599AEBDD367DB5313E86FDF3F3F8E7E7A070A172406047D0BDDAEC8BFFFDD6FF5DA2FFE390FF926BFF4A4AA83C54FF6D3FB14B4B59405736162EFF304F002651775ADA28C7FA776AE388E570FBFF67FFB44AF0DCA2E0B58CCD7856B5421E1B515E33827588B990ABCD9EFFEA66F59159C750806B206A2B39643482AA6DB3B5F9CC7B06CDFF8200FF470C8518134C5D697A383838F66B34F2D639F4E0225A37C318224BDE1B4AFFFBE3FFA9A96A425C26271AF1EFE9BECEB034857FB0A48AF1F5BCFECB92F99A9AD1F6A4F2F1A7EF5959B4314488A9F7D14848EC952EF0E449D6F7F88AACFF6151BBD7F09667BA6D272E6EFFFFC3FFC55CE95D3504879C0C3C78090030F30A49FF5335DFE0D43E92A33539400000330066CC0099FFEDEDED302A775457A6EEBB55F1E6D16B62CE372E962F99AD84EFE2FFE180EBA0598B3C7641245CF0F87F4BC87F29668B6EAFF785203BCB3B3BE0C45CFFF98C8E334CEC9454F1F08AC6CD7880EF914BA54DF3EF82F0C15AB7569A883C82E4F091F9CD7680E5E97D77F6793E71E471A79A60C1AC92FA96EBF048C3BED9DAD7C24D2C3E4A611A26393B939B2F818991F3FCC9FBFF620808A53F3FF4CE74FFE9C1FFB19BF660609A2C80551863F0E9FFCEA9FFB346FF5454540C22330654710A91ABFFC045F2EB80A2BF392685BF144673E0FFFB29CDB5008698F39C9CF7F4EA9CE3CF6A7FF5574B9BF7DEADCD443972B8966F77771C0C2A343B9961BDF69AFFDC563761A7425CF3825FFFE26FA099FF5A67A6FCB241D68D0896CD39F5FF65FFBA47FF5B44243D44167A8B2DEA8F24B273293462211A4CF33535A51C2D6A2E2ECD5A5AFFCF68EFF6A5C6F1A2A8D96643A367385380489CC174F6A743A680236969062925044A423A9188B8E1DDF46188491D7F642AB67779FFF7F5B2BAD4F95E89EF352771F6F6D947E4E05F81E4F67FF551AF5BB3E55EF7FFA3DDDB6AF8AA27FAC55BFFF8B620655F0D7E8313293DFFAF87EEF0F2FD5F0000204A005792D9FAFFF7626221658365C0BACFFDF8FF75173E39392C2727F6F4F4F9F8EDC4E3CB6A9C78FFF1BC480032DF0054FF8B6AFFD2BBFFA258FFF7C2A02A634B125C00354500454A3C6562ED636390AEFFCEFC8660EFB8F9F7F76900FF9951FFFFD700FAF7FF203541374955F62A66FFD933F4F9F4C4E3CB8AAE92616161333366FF5F5FF9E75EF0F0F0FBFFA874DAC620C1BD33354A092A35658525CFEE91F8EEB492E6E6FFF9AFD65D7A524C84BAD7DFFFE2E2F6F6F699DDCC283149404B6900818DBEDF33FFF9E0F1C550FF6600CE252532364360647093DEFFF7F7F75BA19BFCEAEAF5D9D9FBEAD1404B69283149F73859F3ECC8EEEEEEFF7100BE3030222222EAAFAFA2738C645C84427996E9FADDB8E4C93F546842291CA8E6CFFDFFABFFD3B6FFAAA5E7759AFFA35FBA78CD755DA3062743113A5DC4FFDDF9F9F9EF7B7BFCF3CAC4EADA919190FEFFDFDDE0AB97CBA9668BA4062743113A5DFF7A8AF9F9F9FCE8AA97DE9508C2995711790833580F4471FC3C3CF6F6F6FFD3ADFFA96A00558515005DF2F2F0FF5E3A2C365D272E4FFEEB974FB783409D9B034561F8B195F67280C06C84355C7D0900890060CA91CEFFFCDC74294A660B3846FFBBBBFCD2C2240041900048FF4057FF8260EFF0F474DBEF0074E4264E86F8D5F058D5D341A4C33F4B83FFF1BC7DC3836A9C78446E5C002BDC2F4BFF00A6E7FFE37F232931393E464ECCA3EEEEEEF6EC66FADC6DF97272F6545470228396207176B39DFDB44BFAFFB8C5F0A435B0AB226B80F8B595F67280C06C846C5B7C448EF675C2F665DAF7FFE981E4EDDB307672144D531A3C40FF4D4DFF8364FDB87DFFE8D5FAFAF600FFF000D1FF3D6CB91C1124684656DE774EB7E1B51C1124693E5274B49BA7D7C58EA6B4E7EFF3FF8F56984A5945EBA521ABA51D566E163A5F011F3F0960BD429FFDFEF2BFFF6107E9290FC40018292725F7F7F7FF570C60647032364384B9EFFBE4C9FF5D5D952E4B78FEE04BC2C53B9A9CFEF4A9ECF0F133CCCC2980B92C3E50FFB6B9FAE3D9BBDED661C0BFD9E4DDF4B886EE8572784B60B7D7CAA6D0C4A6C6BFA0B2AE7D6C82A58894C2A1A8DECBB8002B5B256D852B48658FE3CF2D2E3715181AFD5E531D70A2070D1120272C7D8B99BCCBD14B2E2D5A3A38714745B49B8DE6F7F6ADE0E08DBFBF4B7F7F031927044A720E94B5D7EDE6D73D3DF38080FACFCFFFFFFF2A2C384143546D6E77A9AAAE0C17293655736589A4B8D3DAE7F1FAC8E2F194B9D9577399F2F2F2D9D9D9BFBFBF8C8C8C203239495E657E959CBFC9CC0D1F2D1D3A4E2C5A6E4F8A9C1F2B3C35536A5F7B8E9EB2C4D9E4ECB7CAD48EA9B96A859611212D253D4F385B6E4C7A8F";

  const THEMES = [];
  for (let i = 0; i < PACKED_THEMES.length; i += 24) {
    const chunk = PACKED_THEMES.substring(i, i + 24);
    if (chunk.length === 24) {
      THEMES.push(['#' + chunk.slice(0, 6), '#' + chunk.slice(6, 12), '#' + chunk.slice(12, 18), '#' + chunk.slice(18, 24)]);
    }
  }

  const PRESET_NAMED_THEMES = {
    midnight: { name: "Midnight 999", quad: ["#A855F7", "#FF4F00", "#1F5C6B", "#080911"] },
    rabbit: { name: "Rabbit R1 Orange", quad: ["#FFFFFF", "#FFA000", "#D84315", "#FF4F00"] },
    ceramic: { name: "White Ceramic Pod", quad: ["#007AFF", "#64748B", "#E2E8F0", "#F8FAFC"] },
    charcoal: { name: "Matte Charcoal", quad: ["#38BDF8", "#818CF8", "#1E293B", "#0B0F19"] },
    aurora: { name: "Aurora Borealis", quad: ["#06B6D4", "#A855F7", "#1E1B4B", "#050714"] },
    sunset: { name: "Sunset Blaze", quad: ["#FF4F00", "#FBBF24", "#7C2D12", "#180804"] },
    cyberpunk: { name: "Cyberpunk 2077", quad: ["#EC4899", "#06B6D4", "#4C1D95", "#0C0214"] },
    emerald: { name: "Emerald Abyss", quad: ["#10B981", "#06B6D4", "#064E3B", "#02120A"] },
    oceanic: { name: "Oceanic Deep", quad: ["#3B82F6", "#60A5FA", "#1E3A8A", "#030A1A"] },
    bloodruby: { name: "Blood Ruby", quad: ["#EF4444", "#B91C1C", "#450A0A", "#140204"] }
  };

      class OSThemeManager {
    constructor() {
      this.rowEl = document.getElementById('theme-swatch-row');
      this.expandBtn = document.getElementById('btn-theme-expand');
      this.favorites = this.loadFavorites();
      
      const savedQuad = this.loadSavedQuad();
      this.currentQuad = [...savedQuad];
      this.currentHex = this.currentQuad[0].toUpperCase();

      this.applyPalette(this.currentQuad, true);
      this.render();
      this.initExpandToggle();
    }

    loadFavorites() {
      try {
        const saved = localStorage.getItem('juicebx_fav_palettes');
        return saved ? JSON.parse(saved) : [];
      } catch(e) { return []; }
    }

    saveFavorites() {
      try {
        localStorage.setItem('juicebx_fav_palettes', JSON.stringify(this.favorites));
      } catch(e) {}
    }

    loadSavedQuad() {
      try {
        const saved = localStorage.getItem('juicebx_quad');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length === 4) return parsed;
        }
      } catch(e) {}
      return ["#A855F7", "#FF4F00", "#1F5C6B", "#080911"];
    }

    initExpandToggle() {
      if (!this.expandBtn || !this.rowEl) return;
      this.expandBtn.addEventListener('click', () => {
        const isOpen = this.rowEl.classList.toggle('expanded');
        this.expandBtn.textContent = isOpen ? 'Show less' : `Browse all ${THEMES.length}`;
        engine.playHaptic(500, 0.02);
      });
    }

    render() {
      if (!this.rowEl) return;
      this.rowEl.innerHTML = '';

      // 1. User saved favorite palettes first
      if (this.favorites && this.favorites.length > 0) {
        this.favorites.forEach((fav) => {
          if (Array.isArray(fav) && fav.length === 4) {
            this.rowEl.appendChild(this.createThemeSwatch(fav, true));
          }
        });
      }

      // 2. All 338 curated ColorHunt palettes
      THEMES.forEach((quad) => {
        this.rowEl.appendChild(this.createThemeSwatch(quad, false));
      });

      this.syncActiveRings();
    }

    createThemeSwatch(quad, isFavorite = false) {
      const btn = document.createElement('button');
      btn.className = 'accent-swatch w-10 h-10 rounded-full flex flex-row p-0 overflow-hidden shrink-0 border-2 border-white/20 shadow-md transition-transform active:scale-90 cursor-pointer relative';
      btn._quad = [...quad];
      btn.setAttribute('title', `Palette: ${quad.join(', ')} (Tap to select, Tap again to cycle 4 colors, Hold to save)`);

      // 4 Vertical Color Slices
      quad.forEach(col => {
        const band = document.createElement('div');
        band.className = 'flex-1 h-full pointer-events-none transition-colors duration-200';
        band.style.background = col;
        btn.appendChild(band);
      });

      if (isFavorite) {
        const star = document.createElement('span');
        star.className = 'absolute top-0.5 right-0.5 text-[8px] text-amber-300 pointer-events-none drop-shadow';
        star.textContent = '★';
        btn.appendChild(star);
      }

      let pressTimer = null;
      let longPressed = false;

      const startPress = (e) => {
        longPressed = false;
        pressTimer = setTimeout(() => {
          longPressed = true;
          this.toggleFavorite(btn._quad);
          engine.playHaptic(800, 0.04);
          if (typeof showToast === 'function') showToast("Saved 4-color palette as favorite!", "success");
        }, 450);
      };
      const cancelPress = () => { if (pressTimer) clearTimeout(pressTimer); };

      btn.addEventListener('pointerdown', startPress);
      btn.addEventListener('pointerup', (e) => {
        cancelPress();
        if (longPressed) return;
        
        if (e.shiftKey) {
          this.toggleFavorite(btn._quad);
          if (typeof showToast === 'function') showToast("Saved 4-color palette as favorite!", "success");
          return;
        }

        // Tap action:
        const isCurrent = this.isCurrentQuad(btn._quad);
        if (isCurrent) {
          // Already active: rotate all 4 colors in this single palette!
          this.rotateCurrentPalette(btn);
        } else {
          // Select new palette
          this.currentQuad = [...btn._quad];
          this.applyPalette(this.currentQuad, true);
          this.syncActiveRings();
          engine.playHaptic(700, 0.02);
          this.showThemeToast(this.currentQuad);
        }
      });
      btn.addEventListener('pointerleave', cancelPress);

      return btn;
    }

    isCurrentQuad(quad) {
      if (!this.currentQuad || this.currentQuad.length !== 4 || !quad || quad.length !== 4) return false;
      const sortedA = [...this.currentQuad].map(c => c.toUpperCase()).sort();
      const sortedB = [...quad].map(c => c.toUpperCase()).sort();
      return sortedA.every((c, i) => c === sortedB[i]);
    }

    // ═══ PURE 4-COLOR ROTATION FOR A SINGLE PALETTE ═══
    rotateCurrentPalette(activeBtn) {
      if (!this.currentQuad || this.currentQuad.length !== 4) return;
      
      // Rotate all 4 colors: [C1, C2, C3, C4] -> [C2, C3, C4, C1]
      const [c1, c2, c3, c4] = this.currentQuad;
      this.currentQuad = [c2, c3, c4, c1];

      // Update the 4 vertical stripes inside the active button element
      if (activeBtn) {
        activeBtn._quad = [...this.currentQuad];
        const bands = activeBtn.querySelectorAll('div');
        if (bands.length === 4) {
          bands[0].style.background = this.currentQuad[0];
          bands[1].style.background = this.currentQuad[1];
          bands[2].style.background = this.currentQuad[2];
          bands[3].style.background = this.currentQuad[3];
        }
      }

      this.applyPalette(this.currentQuad, true);
      this.syncActiveRings();
      engine.playHaptic(350, 0.03);
      this.showThemeToast(this.currentQuad);
    }

    toggleFavorite(quad) {
      if (!Array.isArray(quad) || quad.length !== 4) return;
      const key = quad.map(c => c.toUpperCase()).join('-');
      const idx = this.favorites.findIndex(f => Array.isArray(f) && f.map(c => c.toUpperCase()).join('-') === key);
      if (idx !== -1) {
        this.favorites.splice(idx, 1);
      } else {
        this.favorites.unshift([...quad]);
      }
      this.saveFavorites();
      this.render();
    }

    // ═══ SYSTEM-WIDE 4-COLOR ATMOSPHERE APPLICATION ═══
    applyPalette(quad, persist = true) {
      if (!quad || quad.length !== 4) return;
      this.currentQuad = [...quad];
      this.currentHex = quad[0].toUpperCase();

      const [c1, c2, c3, c4] = quad;
      const root = document.documentElement.style;

      // Color 1: Primary Accent & Buttons
      root.setProperty('--pal-1', c1);
      root.setProperty('--accent', c1);
      root.setProperty('--accent-glow', `color-mix(in srgb, ${c1} 45%, transparent)`);
      
      // Color 2: Secondary Accent, Switches & Ring Highlights
      root.setProperty('--pal-2', c2);
      root.setProperty('--rabbit-orange', c2);

      // Color 3: Card Tint & Borders
      root.setProperty('--pal-3', c3);

      // Color 4: App Backdrop & Base Panels
      root.setProperty('--pal-4', c4);

      const isLight = document.body.classList.contains('light-mode');

      if (!isLight) {
        // Dark Mode: Translucent frosted glass themeing letting M3 shapes shine through
        root.setProperty('--bg-app', '#05060a');
        root.setProperty('--bg-panel', 'transparent');
        root.setProperty('--bg-card', `color-mix(in srgb, ${c3} 20%, rgba(18, 20, 30, 0.60))`);
        root.setProperty('--bg-card-solid', `color-mix(in srgb, ${c4} 35%, #0d0e16)`);
        root.setProperty('--bg-input', `color-mix(in srgb, ${c4} 25%, rgba(27, 28, 42, 0.55))`);
        root.setProperty('--bg-nav', `color-mix(in srgb, ${c4} 30%, rgba(10, 11, 18, 0.85))`);
        root.setProperty('--bg-mini', `color-mix(in srgb, ${c4} 30%, rgba(18, 19, 28, 0.85))`);
        root.setProperty('--text-primary', '#ffffff');
        root.setProperty('--text-secondary', '#94a3b8');
        root.setProperty('--text-tertiary', '#64748b');
        root.setProperty('--border-card', `color-mix(in srgb, ${c2} 28%, rgba(255, 255, 255, 0.10))`);
        root.setProperty('--border-input', `color-mix(in srgb, ${c2} 32%, rgba(255, 255, 255, 0.14))`);
        root.setProperty('--btn-active-bg', 'rgba(255, 255, 255, 0.95)');
        root.setProperty('--btn-active-text', '#000000');
        root.setProperty('--shadow-card', '0 24px 48px -12px rgba(0, 0, 0, 0.65)');
      } else {
        // Light Mode: Translucent frosted white ceramic glass themeing
        root.setProperty('--bg-app', '#f6f7fb');
        root.setProperty('--bg-panel', 'transparent');
        root.setProperty('--bg-card', `color-mix(in srgb, ${c3} 12%, rgba(255, 255, 255, 0.72))`);
        root.setProperty('--bg-card-solid', '#ffffff');
        root.setProperty('--bg-input', `color-mix(in srgb, ${c4} 6%, rgba(238, 240, 248, 0.85))`);
        root.setProperty('--bg-nav', 'rgba(255, 255, 255, 0.88)');
        root.setProperty('--bg-mini', 'rgba(255, 255, 255, 0.90)');
        root.setProperty('--text-primary', '#0f172a');
        root.setProperty('--text-secondary', '#334155');
        root.setProperty('--text-tertiary', '#64748b');
        root.setProperty('--border-card', `color-mix(in srgb, ${c2} 20%, rgba(0, 0, 0, 0.08))`);
        root.setProperty('--border-input', `color-mix(in srgb, ${c2} 24%, rgba(0, 0, 0, 0.12))`);
        root.setProperty('--btn-active-bg', '#0f172a');
        root.setProperty('--btn-active-text', '#ffffff');
        root.setProperty('--shadow-card', '0 16px 32px -8px rgba(0, 0, 0, 0.08)');
      }

      // Update ambient bloom aura
      const aura = document.getElementById('ambient-aura-glow');
      if (aura) {
        aura.style.background = `radial-gradient(circle, ${c1} 0%, ${c2} 50%, transparent 80%)`;
      }

      if (persist) {
        try {
          localStorage.setItem('juicebx_accent', this.currentHex);
          localStorage.setItem('juicebx_quad', JSON.stringify(this.currentQuad));
        } catch(e) {}
      }
    }

    syncActiveRings() {
      if (!this.rowEl) return;
      Array.from(this.rowEl.children).forEach(el => {
        if (!el._quad) return;
        const isActive = this.isCurrentQuad(el._quad);
        el.classList.toggle('active', isActive);
        if (isActive) {
          el.style.borderColor = 'var(--accent)';
          el.style.boxShadow = '0 0 16px var(--accent), 0 4px 12px rgba(0,0,0,0.5)';
        } else {
          el.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          el.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
        }
      });
    }

    showThemeToast(quad) {
      let toast = document.getElementById('theme-toast-pill');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'theme-toast-pill';
        toast.className = 'fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2 rounded-full glass-card border border-white/20 shadow-2xl transition-all duration-300 pointer-events-none opacity-0 scale-90';
        toast.style.background = 'rgba(10, 10, 15, 0.92)';
        toast.style.backdropFilter = 'blur(20px)';
        toast.style.webkitBackdropFilter = 'blur(20px)';
        document.body.appendChild(toast);
      }

      const matchPreset = Object.values(PRESET_NAMED_THEMES).find(p => p.quad[0] === quad[0] && p.quad[1] === quad[1]);
      const themeIdx = THEMES.findIndex(t => t[0] === quad[0] && t[1] === quad[1]);
      const themeName = matchPreset ? matchPreset.name : (themeIdx >= 0 ? `Palette #${themeIdx + 1}` : 'Custom Variant');

      toast.innerHTML = `
        <span class="text-xs font-black text-white flex items-center gap-1.5">
          <i class="ph-fill ph-sparkle text-amber-400"></i> ${themeName}
        </span>
        <div class="w-6 h-6 rounded-full overflow-hidden flex flex-row border border-white/40 shadow-sm shrink-0">
          <div class="flex-1 h-full" style="background:${quad[0]}"></div>
          <div class="flex-1 h-full" style="background:${quad[1]}"></div>
          <div class="flex-1 h-full" style="background:${quad[2]}"></div>
          <div class="flex-1 h-full" style="background:${quad[3]}"></div>
        </div>
      `;

      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) scale(1)';
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) scale(0.9)';
      }, 1600);
    }
  }

  window.ThemeManager = new OSThemeManager();
  
  // ═══ BOOT ═══

  // === TOAST NOTIFICATION SYSTEM ===
  function showToast(message, type, duration) {
    type = type || 'info'; duration = duration || 3000;
    var toast = document.getElementById('juicebx-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'juicebx-toast';
      toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%) translateY(-20px);z-index:9999;padding:10px 18px;border-radius:20px;font-size:13px;font-weight:600;letter-spacing:0.02em;pointer-events:none;transition:opacity 0.25s,transform 0.25s;opacity:0;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);white-space:nowrap;max-width:80vw;overflow:hidden;text-overflow:ellipsis;';
      document.body.appendChild(toast);
    }
    var colors = { info: 'rgba(10,10,20,0.92)', error: 'rgba(160,20,20,0.92)', success: 'rgba(10,110,55,0.92)' };
    toast.style.background = colors[type] || colors.info;
    toast.style.color = '#fff';
    toast.style.border = type === 'error' ? '1px solid rgba(255,80,80,0.3)' : '1px solid rgba(255,255,255,0.1)';
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    if (toast._timeout) clearTimeout(toast._timeout);
    toast._timeout = setTimeout(function() {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, duration);
  }

  // === STREAM ERROR LISTENER ===
  window.addEventListener('engine:streamError', function(ev) {
    var detail = (ev && ev.detail) || {};
    var name = (detail.track && detail.track.title) || 'this track';
    showToast('Stream unavailable for "' + name + '" — skipping...', 'error', 3500);
  });


  // ═══ REAL-TIME AUDIO REACTIVITY & MUSIC VIBES CONTROLLER ═══
  let audioReactivityRAF = null;
  function startAudioReactivity() {
    const vinylPlatter = document.getElementById('deck-vinyl-platter');
    const auraGlow = document.getElementById('ambient-aura-glow');
    const m3Shape1 = document.getElementById('m3-shape-1');
    const m3Shape2 = document.getElementById('m3-shape-2');
    const m3Shape3 = document.getElementById('m3-shape-3');
    const m3Shape4 = document.getElementById('m3-shape-4');
    const playBtn = document.getElementById('deck-btn-play');
    const miniWaveBars = document.querySelectorAll('.mini-wave-bar');

    function tick() {
      const state = engine.getState();
      if (state && state.isPlaying) {
        const levels = engine.getAudioLevels ? engine.getAudioLevels() : { bass: 0.5, energy: 0.5, mid: 0.5, treble: 0.5 };
        const bass = levels.bass || 0;
        const energy = levels.energy || 0;
        const mid = levels.mid || 0;
        const treble = levels.treble || 0;

        // 1. Reactive Vinyl bounce on bass kick
        if (vinylPlatter && !vinylPlatter.classList.contains('paused')) {
          const vScale = 1.0 + (bass * 0.045);
          vinylPlatter.style.transform = `translateZ(0) scale(${vScale.toFixed(3)})`;
        }

        // 2. Reactive Ambient Aura glow pulse
        if (auraGlow) {
          const auraScale = 1.0 + (energy * 0.35);
          const auraOpacity = 0.28 + (bass * 0.35);
          auraGlow.style.transform = `translateX(-50%) scale(${auraScale.toFixed(2)})`;
          auraGlow.style.opacity = auraOpacity.toFixed(2);
        }

        // 3. Reactive Material 3 Floating Shapes (Luminous & Alive)
        if (m3Shape1) {
          m3Shape1.style.opacity = (0.45 + bass * 0.35).toFixed(2);
          m3Shape1.style.transform = `scale(${(1.0 + bass * 0.15).toFixed(3)})`;
        }
        if (m3Shape2) {
          m3Shape2.style.opacity = (0.40 + energy * 0.32).toFixed(2);
          m3Shape2.style.transform = `scale(${(1.0 + energy * 0.14).toFixed(3)})`;
        }
        if (m3Shape3) {
          m3Shape3.style.opacity = (0.35 + mid * 0.30).toFixed(2);
          m3Shape3.style.transform = `scale(${(1.0 + mid * 0.12).toFixed(3)})`;
        }
        if (m3Shape4) {
          m3Shape4.style.opacity = (0.30 + treble * 0.25).toFixed(2);
        }

        // 4. Play Button energetic pulse
        if (playBtn) {
          playBtn.style.boxShadow = `0 0 ${(16 + bass * 28).toFixed(0)}px var(--accent-glow, rgba(255,120,40,0.6)), 0 12px 24px rgba(0,0,0,0.5)`;
        }

        // 5. Mini-player soundwave bars
        if (miniWaveBars && miniWaveBars.length > 0) {
          const freqs = [bass, mid, energy, treble];
          miniWaveBars.forEach((bar, i) => {
            const h = Math.max(3, Math.min(18, (freqs[i % freqs.length] || 0.3) * 20));
            bar.style.height = `${h.toFixed(1)}px`;
          });
        }
      } else {
        if (vinylPlatter && vinylPlatter.classList.contains('paused')) {
          vinylPlatter.style.transform = `translateZ(0) scale(0.96)`;
        }
        if (auraGlow) {
          auraGlow.style.transform = `translateX(-50%) scale(1.0)`;
          auraGlow.style.opacity = '0.25';
        }
        if (playBtn) {
          playBtn.style.boxShadow = '0 12px 24px rgba(0,0,0,0.4)';
        }
        if (miniWaveBars && miniWaveBars.length > 0) {
          miniWaveBars.forEach(bar => { bar.style.height = '3px'; });
        }
      }

      audioReactivityRAF = requestAnimationFrame(tick);
    }

    if (!audioReactivityRAF) {
      audioReactivityRAF = requestAnimationFrame(tick);
    }
  }

  startAudioReactivity();
  engine.init();
  refreshCurrentLibrary();
  setCenterpieceStyle(currentCenterpieceStyle);

  const initialState = engine.getState();
  if (initialState.queue && initialState.currentIndex >= 0 && initialState.queue[initialState.currentIndex]) {
    const t = initialState.queue[initialState.currentIndex];
    updateArtwork(t.id, t.thumb);
    updateAmbientAura(t);
    if (els.deckTrackTitle) els.deckTrackTitle.innerText = t.title;
    if (els.deckTrackArtist) els.deckTrackArtist.innerText = t.artist;
    if (els.miniTitle) els.miniTitle.innerText = t.title;
    if (els.miniArtist) els.miniArtist.innerText = t.artist;
    if (els.deckTimeTotal && t.duration) els.deckTimeTotal.innerText = t.duration;
  } else {
    // Clean first boot appearance
    if (els.deckTrackTitle) els.deckTrackTitle.innerText = "Juice WRLD 999";
    if (els.deckTrackArtist) els.deckTrackArtist.innerText = "Tap any shuffle to start";
    if (els.deckVinylArt) els.deckVinylArt.style.backgroundImage = "url('999_rose_heart_logo.png')";
  }

  // ═══ FAST SPLASH SCREEN DISMISS WITH SMOOTH REVEAL ═══
  const splash = document.getElementById('app-splash-screen');
  const splashContainer = document.getElementById('splash-logo-container');
  if (splash) {
    // If loading ever takes longer than 2s, update status gracefully
    const hangTimeout = setTimeout(() => {
      const statusEl = document.getElementById('splash-status-text');
      if (statusEl) statusEl.innerText = "Initializing Audio Engine...";
    }, 1800);

    setTimeout(() => {
      clearTimeout(hangTimeout);
      if (splashContainer) {
        splashContainer.style.transform = 'scale(1.06)';
        splashContainer.style.opacity = '0';
      }
      splash.style.opacity = '0';
      splash.style.pointerEvents = 'none';
      setTimeout(() => {
        try { splash.remove(); } catch(e) {}
      }, 700);
    }, 650);
  }

  // ═══ REMEMBER SESSION TOGGLE SETTINGS ═══
  const toggleRemember = document.getElementById('toggle-remember-session');
  if (toggleRemember) {
    const isRemember = localStorage.getItem('juicebx_remember_session') !== 'false';
    toggleRemember.classList.toggle('active', isRemember);
    toggleRemember.addEventListener('click', () => {
      const active = toggleRemember.classList.toggle('active');
      localStorage.setItem('juicebx_remember_session', active ? 'true' : 'false');
      if (!active) {
        localStorage.removeItem('juicebx_last_session');
      }
      if (typeof showToast === 'function') {
        showToast(active ? "Session will restore on launch" : "Fresh startup on restart", "info");
      }
    });
  }

  // ═══ ACCELEROMETER & ROTATION AUTO-VIDEO ENGINE (Default: Off) ═══
  let previousOrientationMode = 'portrait';
  let orientationDebounce = false;

  function handleOrientationTrigger(isLandscape) {
    // Only trigger if user explicitly enabled Auto-Rotate in Settings
    const isAutoRotateEnabled = localStorage.getItem('juicebx_auto_rotate') === 'true';
    if (!isAutoRotateEnabled) return;

    if (orientationDebounce) return;
    const newMode = isLandscape ? 'landscape' : 'portrait';
    if (newMode === previousOrientationMode) return;

    previousOrientationMode = newMode;
    orientationDebounce = true;
    setTimeout(() => orientationDebounce = false, 400);

    if (isLandscape) {
      // Rotated sideways / Landscape -> Auto-switch to Fullscreen Video Mode
      scrollToPanel(2); // Jump straight to Player Deck
      setDeckMode('video');
      engine.playHaptic(600, 0.02);
    } else {
      // Rotated back upright / Portrait -> Return to Vinyl / Centerpiece mode
      setDeckMode('vinyl');
      engine.playHaptic(500, 0.015);
    }
  }

  // 1. Standard Screen Orientation & Viewport API
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      const isLandscape = window.innerWidth > window.innerHeight;
      handleOrientationTrigger(isLandscape);
    }, 120);
  });

  if (window.screen && window.screen.orientation) {
    window.screen.orientation.addEventListener('change', () => {
      const type = window.screen.orientation.type || '';
      const isLandscape = type.includes('landscape') || (window.innerWidth > window.innerHeight);
      handleOrientationTrigger(isLandscape);
    });
  }

  const landscapeMedia = window.matchMedia('(orientation: landscape)');
  if (landscapeMedia.addEventListener) {
    landscapeMedia.addEventListener('change', (e) => handleOrientationTrigger(e.matches));
  }

  // 2. Hardware Accelerometer & Gyroscope Tilt (Physical Rabbit R1 rotation)
  window.addEventListener('deviceorientation', (e) => {
    if (e.gamma === null && e.beta === null) return;
    // When device is physically tilted sideways (> 48 deg left or right, and not completely flat)
    const isSidewaysTilt = Math.abs(e.gamma) > 48 && Math.abs(e.beta) < 80;
    if (isSidewaysTilt && previousOrientationMode !== 'landscape') {
      handleOrientationTrigger(true);
    } else if (!isSidewaysTilt && Math.abs(e.gamma) < 32 && previousOrientationMode === 'landscape') {
      handleOrientationTrigger(false);
    }
  }, { passive: true });
});
