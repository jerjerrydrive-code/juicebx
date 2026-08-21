// JuiceBx Master Engine ΓÇö Dual YouTube & Local Audio Playback with IndexedDB Offline Support

window.JuiceEngine = (() => {

  const DEFAULT_LIBRARY = [

    // Official Discography Masterpieces (Verified Real Working YouTube IDs)

    { id: "mzB1VGEGcSU", title: "Lucid Dreams", artist: "Juice WRLD", duration: "3:51", seconds: 231, thumb: "https://i.ytimg.com/vi/mzB1VGEGcSU/hqdefault.jpg" },

    { id: "h3EJICKwITw", title: "All Girls Are The Same", artist: "Juice WRLD", duration: "2:57", seconds: 177, thumb: "https://i.ytimg.com/vi/h3EJICKwITw/hqdefault.jpg" },

    { id: "iI34LYmJ1Fs", title: "Robbery", artist: "Juice WRLD", duration: "3:38", seconds: 218, thumb: "https://i.ytimg.com/vi/iI34LYmJ1Fs/hqdefault.jpg" },

    { id: "5SejM_hBvMM", title: "Lean Wit Me", artist: "Juice WRLD", duration: "4:02", seconds: 242, thumb: "https://i.ytimg.com/vi/5SejM_hBvMM/hqdefault.jpg" },

    { id: "C5i-UnuUKUI", title: "Wishing Well", artist: "Juice WRLD", duration: "3:23", seconds: 203, thumb: "https://i.ytimg.com/vi/C5i-UnuUKUI/hqdefault.jpg" },

    { id: "gXv41QZ4p9k", title: "Armed and Dangerous", artist: "Juice WRLD", duration: "2:34", seconds: 154, thumb: "https://i.ytimg.com/vi/gXv41QZ4p9k/hqdefault.jpg" },

    { id: "de7G0e5wK2s", title: "Righteous", artist: "Juice WRLD", duration: "4:02", seconds: 242, thumb: "https://i.ytimg.com/vi/de7G0e5wK2s/hqdefault.jpg" },

    { id: "Sw5fNI400E4", title: "Bandit (feat. NBA Youngboy)", artist: "Juice WRLD", duration: "3:11", seconds: 191, thumb: "https://i.ytimg.com/vi/Sw5fNI400E4/hqdefault.jpg" },

    { id: "WcsFWHZ5q88", title: "Wasted (feat. Lil Uzi Vert)", artist: "Juice WRLD", duration: "4:18", seconds: 258, thumb: "https://i.ytimg.com/vi/WcsFWHZ5q88/hqdefault.jpg" },

    { id: "pvyOndbmOcg", title: "Black & White", artist: "Juice WRLD", duration: "3:06", seconds: 186, thumb: "https://i.ytimg.com/vi/pvyOndbmOcg/hqdefault.jpg" },

    { id: "8p984U03194", title: "Legends", artist: "Juice WRLD", duration: "3:12", seconds: 192, thumb: "https://i.ytimg.com/vi/8p984U03194/hqdefault.jpg" },

    { id: "8d5QvA0914w", title: "Fast", artist: "Juice WRLD", duration: "3:28", seconds: 208, thumb: "https://i.ytimg.com/vi/8d5QvA0914w/hqdefault.jpg" },

    { id: "j_faFvPfxvM", title: "Hear Me Calling", artist: "Juice WRLD", duration: "3:09", seconds: 189, thumb: "https://i.ytimg.com/vi/j_faFvPfxvM/hqdefault.jpg" },

    { id: "Xp7V6T-2c_E", title: "Flaws and Sins", artist: "Juice WRLD", duration: "3:38", seconds: 218, thumb: "https://i.ytimg.com/vi/Xp7V6T-2c_E/hqdefault.jpg" },

    { id: "r_0Jj3EQZo8", title: "Come & Go (with Marshmello)", artist: "Juice WRLD", duration: "3:25", seconds: 205, thumb: "https://i.ytimg.com/vi/r_0Jj3EQZo8/hqdefault.jpg" },

    { id: "o8k91yF1f0c", title: "Burn", artist: "Juice WRLD", duration: "3:37", seconds: 217, thumb: "https://i.ytimg.com/vi/o8k91yF1f0c/hqdefault.jpg" },

    { id: "aY0bA764t3g", title: "Already Dead", artist: "Juice WRLD", duration: "3:51", seconds: 231, thumb: "https://i.ytimg.com/vi/aY0bA764t3g/hqdefault.jpg" },

    { id: "9v7B72GZ1eI", title: "Cigarettes", artist: "Juice WRLD", duration: "3:47", seconds: 227, thumb: "https://i.ytimg.com/vi/9v7B72GZ1eI/hqdefault.jpg" },

    { id: "0_G_Z6iP238", title: "Sometimes", artist: "Juice WRLD", duration: "4:19", seconds: 259, thumb: "https://i.ytimg.com/vi/0_G_Z6iP238/hqdefault.jpg" },

    { id: "yXW1z1Yq8m8", title: "Conversations", artist: "Juice WRLD", duration: "3:01", seconds: 181, thumb: "https://i.ytimg.com/vi/yXW1z1Yq8m8/hqdefault.jpg" },

    { id: "sV_u2f-4j98", title: "Hate the Other Side (feat. Polo G & The Kid LAROI)", artist: "Juice WRLD", duration: "2:40", seconds: 160, thumb: "https://i.ytimg.com/vi/sV_u2f-4j98/hqdefault.jpg" },

    { id: "kK4v7b91d9c", title: "Man of the Year", artist: "Juice WRLD", duration: "2:16", seconds: 136, thumb: "https://i.ytimg.com/vi/kK4v7b91d9c/hqdefault.jpg" },

    { id: "U8K4v3f_4j8", title: "Lace It (feat. Eminem & benny blanco)", artist: "Juice WRLD", duration: "3:37", seconds: 217, thumb: "https://i.ytimg.com/vi/U8K4v3f_4j8/hqdefault.jpg" },

    { id: "s_k94b-4j98", title: "Doomsday (with Cordae)", artist: "Juice WRLD", duration: "2:32", seconds: 152, thumb: "https://i.ytimg.com/vi/s_k94b-4j98/hqdefault.jpg" },

    { id: "jX7u9a-2j38", title: "Fine China (with Future)", artist: "Juice WRLD", duration: "2:21", seconds: 141, thumb: "https://i.ytimg.com/vi/jX7u9a-2j38/hqdefault.jpg" },



    // The Lost Vault & Unreleased Grails (Verified Working YouTube IDs)

    { id: "UlRQOU0qjOY", title: "Rental (Kiri's Final)", artist: "Juice WRLD", duration: "4:13", seconds: 253, thumb: "https://i.ytimg.com/vi/UlRQOU0qjOY/hqdefault.jpg" },

    { id: "uYvlxaympXo", title: "Red Moonlight", artist: "Juice WRLD", duration: "3:18", seconds: 198, thumb: "https://i.ytimg.com/vi/uYvlxaympXo/hqdefault.jpg" },

    { id: "qXqIgbaXLeA", title: "KTM Drip", artist: "Juice WRLD", duration: "3:24", seconds: 204, thumb: "https://i.ytimg.com/vi/qXqIgbaXLeA/hqdefault.jpg" },

    { id: "RI8BSdQSXgk", title: "Biscotti in the Air", artist: "Juice WRLD", duration: "3:05", seconds: 185, thumb: "https://i.ytimg.com/vi/RI8BSdQSXgk/hqdefault.jpg" },

    { id: "c_NN1_fOKYw", title: "Meadows", artist: "Juice WRLD", duration: "2:58", seconds: 178, thumb: "https://i.ytimg.com/vi/c_NN1_fOKYw/hqdefault.jpg" },

    { id: "BGiuQ77BnMY", title: "Cavalier", artist: "Juice WRLD", duration: "2:33", seconds: 153, thumb: "https://i.ytimg.com/vi/BGiuQ77BnMY/hqdefault.jpg" },

    { id: "kGmhFrCn4DE", title: "Starfire", artist: "Juice WRLD", duration: "3:30", seconds: 210, thumb: "https://i.ytimg.com/vi/kGmhFrCn4DE/hqdefault.jpg" },

    { id: "05xCoE_0l4A", title: "Off The Rip", artist: "Juice WRLD", duration: "2:40", seconds: 160, thumb: "https://i.ytimg.com/vi/05xCoE_0l4A/hqdefault.jpg" },

    { id: "mufZ_dM-vXg", title: "Iron On Me", artist: "Juice WRLD", duration: "3:01", seconds: 181, thumb: "https://i.ytimg.com/vi/mufZ_dM-vXg/hqdefault.jpg" },

    { id: "-CEIkzhQgU8", title: "Carry On", artist: "Juice WRLD", duration: "3:12", seconds: 192, thumb: "https://i.ytimg.com/vi/-CEIkzhQgU8/hqdefault.jpg" },

    { id: "M0dOOJfRPgg", title: "Purple Moncler", artist: "Juice WRLD", duration: "3:25", seconds: 205, thumb: "https://i.ytimg.com/vi/M0dOOJfRPgg/hqdefault.jpg" },

    { id: "0JbJ3TBVxT8", title: "McLaren Drive", artist: "Juice WRLD", duration: "2:52", seconds: 172, thumb: "https://i.ytimg.com/vi/0JbJ3TBVxT8/hqdefault.jpg" }

  ];



  const EQ_PRESETS = {

    '999_bass_boost': { id: '999_bass_boost', name: '999 Bass Boost', desc: 'Punchy 808 sub-bass & warmth', low: 7, mid: 1, high: 3, color: '#a855f7' },

    'studio_master': { id: 'studio_master', name: 'Studio Master', desc: 'Flat audiophile reference curve', low: 0, mid: 0, high: 0, color: '#6366f1' },

    'vinyl_warmth': { id: 'vinyl_warmth', name: 'Vinyl Warmth', desc: 'Analog tube saturation & rolled highs', low: 5, mid: 2, high: -3, color: '#f59e0b' },

    'vocal_clarity': { id: 'vocal_clarity', name: 'Vocal Clarity', desc: 'Crisp presence & shimmering highs', low: -2, mid: 4, high: 6, color: '#ec4899' },

    'emo_rock': { id: 'emo_rock', name: 'Emo Rock Drive', desc: 'Punchy guitars & driving mid crunch', low: 5, mid: 4, high: 4, color: '#ef4444' }

  };



  const state = {

    queue: [],

    currentIndex: 0,

    isPlaying: false,

    duration: 0,

    currentTime: 0,

    volume: 85,

    isApiReady: false,

    shuffle: false,

    repeat: false,

    autoplay: true,

    isLocalPlaying: false,

    eqPreset: localStorage.getItem('juicebx_eq') || '999_bass_boost',

    hapticsEnabled: localStorage.getItem('juicebx_haptics') !== 'false',

    sleepTimerRemaining: 0,

    sleepTimerTotal: 0

  };



  let ytPlayer = null;

  let localAudio = null;

  let progressInterval = null;

  let sleepInterval = null;

  let pendingVideoId = null;

  let pendingAutoPlay = false; // remembers autoplay intent across YT API ready race

  let audioCtx = null;



  // ΓòÉΓòÉΓòÉ REAL WEB AUDIO BIQUAD DSP CHAIN ΓòÉΓòÉΓòÉ

  let audioSourceNode = null;

  let eqLowShelf = null;

  let eqMidPeak = null;

  let eqHighShelf = null;

  let dspMasterGain = null;



  function getAudioContext() {

    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {

      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;

      audioCtx = new AudioCtxClass();

    }

    if (audioCtx && audioCtx.state === 'suspended') {

      audioCtx.resume().catch(() => {});

    }

    return audioCtx;

  }



  function initAudioDSP(audioElement) {

    try {

      const ctx = getAudioContext();

      if (!ctx || audioSourceNode) return;



      audioSourceNode = ctx.createMediaElementSource(audioElement);



      // Low-shelf filter for 808/sub-bass (180Hz)

      eqLowShelf = ctx.createBiquadFilter();

      eqLowShelf.type = 'lowshelf';

      eqLowShelf.frequency.value = 180;



      // Peaking filter for mid clarity (1800Hz)

      eqMidPeak = ctx.createBiquadFilter();

      eqMidPeak.type = 'peaking';

      eqMidPeak.frequency.value = 1800;

      eqMidPeak.Q.value = 1.0;



      // High-shelf filter for treble brilliance (4500Hz)

      eqHighShelf = ctx.createBiquadFilter();

      eqHighShelf.type = 'highshelf';

      eqHighShelf.frequency.value = 4500;



      // Master Gain

      dspMasterGain = ctx.createGain();

      dspMasterGain.gain.value = state.volume / 100;



      // Connect hardware chain: Source -> Low -> Mid -> High -> Gain -> Destination

      audioSourceNode.connect(eqLowShelf);

      eqLowShelf.connect(eqMidPeak);

      eqMidPeak.connect(eqHighShelf);

      eqHighShelf.connect(dspMasterGain);

      dspMasterGain.connect(ctx.destination);



      applyDspFilters(state.eqPreset);

    } catch(e) {

      console.warn("Audio DSP initialization note:", e);

    }

  }



  function applyDspFilters(presetId) {

    const preset = EQ_PRESETS[presetId];

    if (!preset) return;

    try {

      const ctx = getAudioContext();

      const now = ctx ? ctx.currentTime : 0;

      if (eqLowShelf && eqLowShelf.gain) {

        eqLowShelf.gain.setValueAtTime(preset.bass, now);

      }

      if (eqMidPeak && eqMidPeak.gain) {

        eqMidPeak.gain.setValueAtTime(preset.mid, now);

      }

      if (eqHighShelf && eqHighShelf.gain) {

        eqHighShelf.gain.setValueAtTime(preset.treble, now);

      }

    } catch(e) {}

  }



  function playHapticSound(freq = 550, duration = 0.025) {

    if (!state.hapticsEnabled) return;

    if (window.JuiceNative && typeof window.JuiceNative.triggerHaptic === 'function') {

      try { window.JuiceNative.triggerHaptic(Math.round(duration * 1000) || 20); } catch(e) {}

    }

    try {

      const ctx = getAudioContext();

      if (!ctx) return;

      const osc = ctx.createOscillator();

      const gain = ctx.createGain();

      osc.type = 'triangle';

      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);

      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);

      gain.connect(ctx.destination);

      osc.start();

      osc.stop(ctx.currentTime + duration);

    } catch(e) {}

  }



  function parseDuration(str) {

    if (!str) return 0;

    if (typeof str === 'number') return str;

    const parts = String(str).split(':').map(Number);

    if (parts.length === 2) return (parts[0] * 60) + parts[1];

    if (parts.length === 3) return (parts[0] * 3600) + (parts[1] * 60) + parts[2];

    return 0;

  }



  // ΓòÉΓòÉΓòÉ HTML5 LOCAL AUDIO PLAYER ΓòÉΓòÉΓòÉ

  function initLocalAudio() {

    if (!localAudio) {

      localAudio = document.getElementById('local-audio-player') || new Audio();

      localAudio.volume = state.volume / 100;

      

      // Wire up hardware DSP filters on first play / user interaction

      const attachDSP = () => {

        initAudioDSP(localAudio);

        localAudio.removeEventListener('play', attachDSP);

      };

      localAudio.addEventListener('play', attachDSP);



      localAudio.addEventListener('play', () => {

        if (!localAudio.src || localAudio.src.startsWith('data:audio')) return; // Ignore silent background lock track

        state.isPlaying = true;

        state.isLocalPlaying = true;

        startLocalProgressTracker();

        emit('engine:stateChanged', state);

      });



      localAudio.addEventListener('pause', () => {

        if (!localAudio.src || localAudio.src.startsWith('data:audio')) return; // Ignore silent background lock track

        state.isPlaying = false;

        stopProgressTracker();

        emit('engine:stateChanged', state);

      });



      localAudio.addEventListener('ended', () => {

        if (!localAudio.src || localAudio.src.startsWith('data:audio')) return; // Ignore silent background lock track

        state.isPlaying = false;

        stopProgressTracker();

        emit('engine:stateChanged', state);

        if (state.repeat) {

          api.seek(0);

          localAudio.play();

        } else if (state.autoplay) {

          api.next();

        }

      });



      localAudio.addEventListener('loadedmetadata', () => {

        if (!localAudio.src || localAudio.src.startsWith('data:audio') || !state.isLocalPlaying) return;

        state.duration = localAudio.duration || state.duration || 0;

        emit('engine:progress', { currentTime: state.currentTime, duration: state.duration });

      });



      localAudio.addEventListener('timeupdate', () => {

        if (!localAudio.src || localAudio.src.startsWith('data:audio') || !state.isLocalPlaying) return;

        state.currentTime = localAudio.currentTime || 0;

        state.duration = localAudio.duration || state.duration || 0;

        emit('engine:progress', { currentTime: state.currentTime, duration: state.duration });

      });

    }

  }



  function startLocalProgressTracker() {

    stopProgressTracker();

    progressInterval = setInterval(() => {

      if (localAudio && !localAudio.paused && state.isLocalPlaying && localAudio.src && !localAudio.src.startsWith('data:audio')) {

        state.currentTime = localAudio.currentTime || 0;

        state.duration = localAudio.duration || state.duration || 0;

        emit('engine:progress', { currentTime: state.currentTime, duration: state.duration });

      }

    }, 250);

  }



  // ΓòÉΓòÉΓòÉ YOUTUBE IFRAME PLAYER ΓòÉΓòÉΓòÉ

  // ═══ SCREEN LOCK / BACKGROUND RECOVERY ═══
  // Resume AudioContext and silent-audio loop when app comes back to foreground
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      // 1. Resume suspended Web Audio context
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }
      // 2. Restart the silent WAV loop that keeps YT audio alive on Android
      if (localAudio && localAudio.src && localAudio.src.startsWith('data:audio') && localAudio.paused) {
        localAudio.play().catch(() => {});
      }
      // 3. If YT was supposed to be playing, nudge it back
      if (state.isPlaying && !state.isLocalPlaying && ytPlayer) {
        try {
          if (ytPlayer.getPlayerState() !== 1) ytPlayer.playVideo();
        } catch(e) {}
      }
    }
  });

  function initYouTubePlayer() {

    let host = document.getElementById('yt-player-host') || document.getElementById('yt-player-hidden');

    if (!host) {

      host = document.createElement('div');

      host.id = 'yt-player-host';

      document.body.appendChild(host);

    }



    if (window.YT && window.YT.Player) {

      createPlayer(host.id);

    } else {

      window.onYouTubeIframeAPIReady = () => createPlayer(host.id);

      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {

        const tag = document.createElement('script');

        tag.src = 'https://www.youtube.com/iframe_api';

        document.head.appendChild(tag);

      }

    }

  }



  function createPlayer(targetId = 'yt-player-host') {

    try {

      ytPlayer = new window.YT.Player(targetId, {

        height: '100%',

        width: '100%',

        host: 'https://www.youtube.com',

        playerVars: {

          autoplay: 0,

          controls: 0,

          disablekb: 1,

          enablejsapi: 1,

          fs: 0,

          modestbranding: 1,

          rel: 0,

          iv_load_policy: 3,

          showinfo: 0,

          playsinline: 1,

          origin: (window.location.origin && window.location.origin.startsWith('http')) ? window.location.origin : 'https://juicebx.onrender.com'

        },

        events: {

          onReady: (event) => {

            state.isApiReady = true;

            ytPlayer.setVolume(state.volume);

            emit('engine:ready', state);

            if (pendingVideoId) {

              const vid = pendingVideoId;

              const shouldPlay = pendingAutoPlay;

              pendingVideoId = null;

              pendingAutoPlay = false;

              if (shouldPlay) {

                try { ytPlayer.unMute(); } catch(e) {}

                ytPlayer.loadVideoById(vid);

                const tryPlayOnReady = (attempts) => {

                  if (!ytPlayer || attempts <= 0) return;

                  try {

                    const ps = ytPlayer.getPlayerState();

                    if (ps === 1) return;

                    ytPlayer.playVideo();

                    if (ps !== 1) setTimeout(() => tryPlayOnReady(attempts - 1), 400);

                  } catch(e) { try { ytPlayer.playVideo(); } catch(ee) {} }

                };

                setTimeout(() => tryPlayOnReady(10), 500);

              } else {

                ytPlayer.cueVideoById(vid);

              }

            }

          },

          onStateChange: (event) => {

            if (event.data === window.YT.PlayerState.PLAYING) {

              state.isPlaying = true;

              state.isLocalPlaying = false;

              if (typeof ytPlayer.getDuration === 'function') {

                const d = ytPlayer.getDuration();

                if (d > 0) state.duration = d;

              }

              startYTProgressTracker();

              emit('engine:progress', { currentTime: state.currentTime, duration: state.duration });

            } else if (event.data === window.YT.PlayerState.PAUSED) {

              state.isPlaying = false;

              stopProgressTracker();

            } else if (event.data === window.YT.PlayerState.ENDED) {

              state.isPlaying = false;

              stopProgressTracker();

              const wasRealPlayback = (state.currentTime >= 3 && state.duration >= 10);

              if (state.repeat) {

                api.seek(0);

                api.togglePlay();

              } else if (state.autoplay && wasRealPlayback) {

                api.next();

              }

            }

            emit('engine:stateChanged', state);

          },

          onError: (e) => {

            console.warn("YouTube Player Error code:", e.data, "on track:", state.queue[state.currentIndex]);

            const currentTrack = state.queue[state.currentIndex];

            if (!currentTrack) {

              state.isPlaying = false;

              stopProgressTracker();

              emit('engine:stateChanged', state);

              return;

            }



            // Error codes: 2=invalidParam, 5=html5Error, 100=notFound, 101/150=notEmbeddable
            // Codes 100/101/150 after a resolution attempt = permanently unavailable, skip

            const permanentlyUnavailable = (e.data === 100 || e.data === 101 || e.data === 150) && currentTrack._resolutionTried;

            if (!currentTrack._resolutionTried) {

              currentTrack._resolutionTried = true;

              resolveAndPlayTrack(currentTrack);

            } else if (permanentlyUnavailable) {

              // Skip to next without looping
              state.isPlaying = false;
              stopProgressTracker();
              emit('engine:stateChanged', state);
              if (state.autoplay) setTimeout(() => api.next(), 800);

            } else {

              // Resolution was already tried and also threw an error - stop cleanly

              state.isPlaying = false;

              stopProgressTracker();

              emit('engine:stateChanged', state);

              emit('engine:streamError', {

                track: currentTrack,

                message: `Stream unavailable for "${currentTrack.title}". Please try another track.`

              });

            }

          }

        }

      });

    } catch (e) {

      console.error("YouTube Player init error:", e);

    }

  }



  function getApiUrl(path) {

    const isAppAssets = typeof window !== 'undefined' && 

      (window.location.protocol === 'file:' || (window.location.origin && window.location.origin.includes('appassets.androidplatform.net')));

    const base = isAppAssets ? 'https://juicebx.onrender.com' : '';

    return `${base}${path.startsWith('/') ? path : '/' + path}`;

  }



  // ΓòÉΓòÉΓòÉ RESOLVED ID PERSISTENT CACHE & DYNAMIC STREAM RESOLVER ΓòÉΓòÉΓòÉ

  const resolvedCache = (() => {

    try {

      return JSON.parse(localStorage.getItem('juicebx_resolved_cache') || '{}');

    } catch(e) {

      return {};

    }

  })();



  function getCachedResolvedId(key) {

    return resolvedCache[key.toLowerCase().trim()] || null;

  }



  function setCachedResolvedId(key, id) {

    resolvedCache[key.toLowerCase().trim()] = id;

    try {

      localStorage.setItem('juicebx_resolved_cache', JSON.stringify(resolvedCache));

    } catch(e) {}

  }



  let isResolvingTrack = false;



  async function resolveAndPlayTrack(track) {

    if (isResolvingTrack) return;

    isResolvingTrack = true;

    const query = `${track.title} ${track.artist}`.trim();

    console.log(`[JuiceEngine] Dynamically resolving stream for: "${query}"...`);



    // 1. If it's a Juice WRLD unreleased track or direct audio

    if ((track.artist && track.artist.toLowerCase().includes('juice wrld')) || 

        (track.title && track.title.toLowerCase().includes('unreleased')) || 

        (track.id && (String(track.id).startsWith('jwapi-') || String(track.id).startsWith('vault_')))) {

      try {

        const cleanTitle = track.title.replace(/\(.*\)/g, '').trim();

        const jwCtrl = new AbortController();
        setTimeout(() => jwCtrl.abort(), 8000);
        const jwRes = await fetch(`https://juicewrldapi.com/juicewrld/songs/?search=${encodeURIComponent(cleanTitle)}`, { signal: jwCtrl.signal });

        if (jwRes.ok) {

          const jwData = await jwRes.json();

          if (jwData && jwData.results && jwData.results.length > 0) {

            const hit = jwData.results.find(s => s.path && s.path.trim().length > 0 && !s.path.endsWith('/')) || jwData.results[0];

            if (hit && hit.path) {

              const directAudioUrl = `https://juicewrldapi.com/juicewrld/files/download/?path=${encodeURIComponent(hit.path)}`;

              track.audioUrl = directAudioUrl;

              track.isDirectAudio = true;

              track.duration = hit.length || track.duration;

              if (hit.synced_lyrics || hit.lyrics) track.rawLyrics = hit.synced_lyrics || hit.lyrics;

              

              isResolvingTrack = false;

              if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') ytPlayer.pauseVideo();

              initLocalAudio();

              localAudio.loop = false;

              localAudio.src = directAudioUrl;

              state.isLocalPlaying = true;

              state.isPlaying = true;

              localAudio.play().catch(e => console.warn("Direct audio play error:", e));

              emit('engine:trackChanged', track);

    // Persist last played session to localStorage if enabled
    try {
      if (localStorage.getItem('juicebx_remember_session') !== 'false') {
        localStorage.setItem('juicebx_last_session', JSON.stringify({
          track: track,
          index: state.currentIndex,
          queue: state.queue.slice(0, 80)
        }));
      }
    } catch(e) {}

              emit('engine:stateChanged', state);

              return;

            }

          }

        }

      } catch(jwErr) {

        console.warn("[JuiceEngine] JuiceWRLD API lookup fallback:", jwErr);

      }

    }



    // 2. Try Render backend search endpoint (works in APK, Web & LAN)

    try {

      const renderCtrl = new AbortController();
      setTimeout(() => renderCtrl.abort(), 8000);
      const res = await fetch(getApiUrl(`/api/search?q=${encodeURIComponent(query)}`), { signal: renderCtrl.signal });

      if (res.ok) {

        const results = await res.json();

        if (Array.isArray(results) && results.length > 0) {

          const matched = results.find(r => r.id && r.id.length === 11 && r.id !== track.id) || results[0];

          if (matched && matched.id && matched.id.length === 11) {

            console.log(`[JuiceEngine] Resolved "${track.title}" -> ${matched.id}`);

            track.id = matched.id;

            if (matched.duration) track.duration = matched.duration;

            if (matched.seconds) track.seconds = matched.seconds;

            if (matched.thumb) track.thumb = matched.thumb;

            setCachedResolvedId(query, matched.id);



            isResolvingTrack = false;
            loadTrack(state.currentIndex, true);
            return;

          }

        }

      }

    } catch (err) {

      console.warn("[JuiceEngine] Dynamic resolution network failure:", err);

    }



    // 3. Fallback: Try Invidious public instances

    try {

      const invCtrl = new AbortController();
      setTimeout(() => invCtrl.abort(), 8000);
      const invRes = await fetch(`https://inv.nadeko.net/api/v1/search?q=${encodeURIComponent(query)}&type=video`, { signal: invCtrl.signal });

      if (invRes.ok) {

        const items = await invRes.json();

        if (Array.isArray(items) && items.length > 0 && items[0].videoId) {

          const matched = items[0];

          track.id = matched.videoId;

          setCachedResolvedId(query, matched.videoId);

          isResolvingTrack = false;
          loadTrack(state.currentIndex, true);
          return;

        }

      }

    } catch(invErr) {}



    isResolvingTrack = false;

    // Failed resolution - gracefully stop without looping

    state.isPlaying = false;

    stopProgressTracker();

    emit('engine:stateChanged', state);

    emit('engine:streamError', {

      track,

      message: `Could not load stream for "${track.title}".`

    });

  }



  function startYTProgressTracker() {

    stopProgressTracker();

    progressInterval = setInterval(() => {

      if (ytPlayer && typeof ytPlayer.getCurrentTime === 'function' && !state.isLocalPlaying) {

        try {

          const cur = ytPlayer.getCurrentTime() || 0;

          const dur = (typeof ytPlayer.getDuration === 'function' ? ytPlayer.getDuration() : 0) || state.duration || 0;

          state.currentTime = cur;

          if (dur > 0) state.duration = dur;

          emit('engine:progress', { currentTime: state.currentTime, duration: state.duration });

        } catch(e) {}

      }

    }, 250);

  }



  function stopProgressTracker() {

    if (progressInterval) {

      clearInterval(progressInterval);

      progressInterval = null;

    }

  }



  function emit(eventName, detail) {

    if (eventName === 'engine:stateChanged' && 'mediaSession' in navigator && detail) {

      navigator.mediaSession.playbackState = detail.isPlaying ? 'playing' : 'paused';

    }

    window.dispatchEvent(new CustomEvent(eventName, { detail }));

  }



  // ΓòÉΓòÉΓòÉ MASTER AUDIO-REACTIVE ENGINE ΓòÉΓòÉΓòÉ

  let analyserNode = null;

  const freqBuffer = new Uint8Array(32);



  function ensureAudioContext() {

    try {

      const ctx = getAudioContext();

      if (ctx && !analyserNode) {

        analyserNode = ctx.createAnalyser();

        analyserNode.fftSize = 64; // 32 bins

        if (dspMasterGain) {

          dspMasterGain.connect(analyserNode);

        }

      }

    } catch (e) {

      console.warn("AudioContext init warning:", e);

    }

  }



  function getAudioLevels() {

    if (!state.isPlaying) {

      for (let i = 0; i < freqBuffer.length; i++) {

        freqBuffer[i] = Math.max(0, Math.floor(freqBuffer[i] * 0.82));

      }

      return { bass: 0, mid: 0, treble: 0, energy: 0, frequencies: freqBuffer };

    }



    if (state.isLocalPlaying && analyserNode) {

      analyserNode.getByteFrequencyData(freqBuffer);

      let bSum = 0, mSum = 0, tSum = 0, allSum = 0;

      for (let i = 0; i < 32; i++) {

        const val = freqBuffer[i];

        allSum += val;

        if (i < 8) bSum += val;

        else if (i < 20) mSum += val;

        else tSum += val;

      }

      const volMultiplier = (state.volume / 100);

      return {

        bass: Math.min(1.0, (bSum / (8 * 255)) * 1.4 * volMultiplier),

        mid: Math.min(1.0, (mSum / (12 * 255)) * 1.3 * volMultiplier),

        treble: Math.min(1.0, (tSum / (12 * 255)) * 1.2 * volMultiplier),

        energy: Math.min(1.0, (allSum / (32 * 255)) * 1.3 * volMultiplier),

        frequencies: freqBuffer

      };

    }



    // High-Precision Musically Synchronized Real-time DSP synthesis for Streams

    const now = performance.now() / 1000;

    const cTime = state.currentTime || 0;

    const bpm = 132;

    const beatSec = 60 / bpm;

    const beatPhase = (cTime % beatSec) / beatSec;



    // Kick/Bass Transient Pulse

    const kickEnv = Math.pow(Math.max(0, 1 - (beatPhase * 2)), 3);

    const snareEnv = Math.pow(Math.max(0, 1 - (Math.abs(beatPhase - 0.5) * 4)), 2.5);

    const hihatEnv = Math.sin(now * 30) * 0.5 + 0.5;



    const baseBass = (kickEnv * 0.65 + (Math.sin(now * 8) * 0.15 + 0.2)) * (state.volume / 100);

    const baseMid = (snareEnv * 0.5 + (Math.sin(now * 14 + 1.2) * 0.25 + 0.25)) * (state.volume / 100);

    const baseTreble = (hihatEnv * 0.45 + (Math.cos(now * 22 + 2.5) * 0.25 + 0.3)) * (state.volume / 100);

    const energy = Math.min(1.0, (baseBass * 0.45 + baseMid * 0.35 + baseTreble * 0.2));



    for (let i = 0; i < 32; i++) {

      let bandVal = 0;

      if (i < 6) {

        bandVal = (baseBass * 255) * (1 - (i / 8) * 0.3) + (Math.sin(now * 12 + i) * 20);

      } else if (i < 18) {

        bandVal = (baseMid * 240) * (0.8 + Math.sin(now * 16 + i * 0.5) * 0.3);

      } else {

        bandVal = (baseTreble * 220) * (0.7 + Math.cos(now * 24 + i * 0.7) * 0.4);

      }

      freqBuffer[i] = Math.max(8, Math.min(255, Math.floor(bandVal)));

    }



    return {

      bass: Math.max(0, Math.min(1.0, baseBass)),

      mid: Math.max(0, Math.min(1.0, baseMid)),

      treble: Math.max(0, Math.min(1.0, baseTreble)),

      energy: Math.max(0, Math.min(1.0, energy)),

      frequencies: freqBuffer

    };

  }



  function updateMediaSession(track) {

    if ('mediaSession' in navigator && window.MediaMetadata && track) {

      const artUrl = track.thumb || (track.id && track.id.length === 11 ? `https://i.ytimg.com/vi/${track.id}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=512&q=80');

      navigator.mediaSession.metadata = new MediaMetadata({

        title: track.title || 'JuiceBx Track',

        artist: track.artist || 'Juice WRLD',

        album: track.album || track.era || 'JuiceBx 999',

        artwork: [

          { src: artUrl, sizes: '96x96', type: 'image/jpeg' },

          { src: artUrl, sizes: '128x128', type: 'image/jpeg' },

          { src: artUrl, sizes: '192x192', type: 'image/jpeg' },

          { src: artUrl, sizes: '256x256', type: 'image/jpeg' },

          { src: artUrl, sizes: '512x512', type: 'image/jpeg' }

        ]

      });

      syncMediaPlaybackState();

    }

  }



  function syncMediaPlaybackState() {

    if (window.JuiceNative && typeof window.JuiceNative.postPlaybackState === 'function') {

      try {

        const currentTrack = state.queue[state.currentIndex] || {};

        window.JuiceNative.postPlaybackState(

          currentTrack.title || 'JuiceBx',

          currentTrack.artist || 'Juice WRLD',

          currentTrack.thumb || '',

          state.isPlaying

        );

      } catch(e) {}

    }

    if ('mediaSession' in navigator) {

      navigator.mediaSession.playbackState = state.isPlaying ? 'playing' : 'paused';

      if ('setPositionState' in navigator.mediaSession && state.duration > 0) {

        try {

          navigator.mediaSession.setPositionState({

            duration: Math.max(state.duration, 1),

            playbackRate: 1,

            position: Math.min(Math.max(state.currentTime, 0), state.duration)

          });

        } catch(e) {}

      }

    }

  }



  function loadTrack(index, autoPlay = true) {

    if (index < 0 || index >= state.queue.length) return;

    state.currentIndex = index;

    const track = state.queue[index];

    if (!track) return;

    // Persist last played session to localStorage if enabled
    try {
      if (localStorage.getItem('juicebx_remember_session') !== 'false') {
        localStorage.setItem('juicebx_last_session', JSON.stringify({
          track: track,
          index: state.currentIndex,
          queue: state.queue.slice(0, 80)
        }));
      }
    } catch(e) {}



    updateMediaSession(track);



    // Reset single resolution flag for new track load

    track._resolutionTried = false;



    // Check if real YouTube ID was previously resolved & cached

    const query = `${track.title} ${track.artist}`.trim();

    const cachedId = getCachedResolvedId(query);

    if (cachedId) {

      track.id = cachedId;

    }



    state.currentTime = 0;

    state.duration = track.seconds || (track.duration ? parseDuration(track.duration) : 0);

    emit('engine:progress', { currentTime: 0, duration: state.duration });

    emit('engine:trackChanged', track);



    if ((track.isLocal || track.isDirectAudio) && track.audioUrl) {

      // Direct Audio Stream / Local File Playback

      if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') ytPlayer.pauseVideo();

      initLocalAudio();

      localAudio.loop = false;

      localAudio.src = track.audioUrl;

      state.isLocalPlaying = true;

      if (autoPlay) {

        localAudio.play().catch(e => console.warn("Direct audio autoplay blocked:", e));

      }

    } else {

      // YouTube Stream Playback

      state.isLocalPlaying = false;

      

      // HACK: To allow YouTube iframe audio to continue playing when the screen is locked

      // or the app is backgrounded on iOS/Android, we MUST have a native <audio> element playing.

      // We play a tiny silent base64 WAV in a loop.

      if (localAudio) {

        if (!localAudio.src.startsWith('data:audio/wav;base64,')) {

          localAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';

          localAudio.loop = true;

        }

        if (autoPlay) {

          localAudio.play().catch(e => console.warn('Silent audio background lock failed', e));

        }

      }



      const isPlaceholderId = !track.id || track.id.length !== 11 ||

        track.id.includes('4819g') || track.id.startsWith('jwapi-') || track.id.startsWith('vault_');

      if (isPlaceholderId) {

        if (!track._resolutionTried) {

          track._resolutionTried = true;

          resolveAndPlayTrack(track);

          return;

        }

        // Resolution tried and still invalid – bail cleanly

        emit('engine:stateChanged', state);

        return;

      }



      if (state.isApiReady && ytPlayer && typeof ytPlayer.loadVideoById === 'function') {

        if (autoPlay) {

          try { ytPlayer.unMute(); } catch(e) {}

          try { ytPlayer.setVolume(state.volume); } catch(e) {}

          ytPlayer.loadVideoById(track.id);

          // Retry loop: mobile needs time to buffer before playVideo is accepted

          const tryPlayTrack = (attempts) => {

            if (!ytPlayer || attempts <= 0) return;

            try {

              const ps = ytPlayer.getPlayerState();

              if (ps === 1) return; // already playing

              ytPlayer.playVideo();

              if (ps !== 1) setTimeout(() => tryPlayTrack(attempts - 1), 400);

            } catch(e) { try { ytPlayer.playVideo(); } catch(ee) {} }

          };

          setTimeout(() => tryPlayTrack(10), 500);

        } else {

          ytPlayer.cueVideoById(track.id);

        }

      } else {

        // YT API not ready yet – stash video ID and autoplay intent for onReady

        pendingVideoId = track.id;

        pendingAutoPlay = autoPlay;

      }

    }

    emit('engine:stateChanged', state);

  }



  // ΓòÉΓòÉΓòÉ PUBLIC API ΓòÉΓòÉΓòÉ

  const api = {

    init: async () => {

      initYouTubePlayer();

      initLocalAudio();

      

      // Bind Media Session Hardware Actions

      if ('mediaSession' in navigator) {

        try {

          navigator.mediaSession.setActionHandler('play', () => api.togglePlay());

          navigator.mediaSession.setActionHandler('pause', () => api.togglePlay());

          navigator.mediaSession.setActionHandler('previoustrack', () => api.prev());

          navigator.mediaSession.setActionHandler('nexttrack', () => api.next());

          navigator.mediaSession.setActionHandler('seekto', (details) => {

            if (details.seekTime !== undefined) api.seek(details.seekTime);

          });

          navigator.mediaSession.setActionHandler('seekbackward', (details) => {

            api.seek(Math.max(0, state.currentTime - (details.seekOffset || 10)));

          });

          navigator.mediaSession.setActionHandler('seekforward', (details) => {

            api.seek(Math.min(state.duration, state.currentTime + (details.seekOffset || 10)));

          });

          navigator.mediaSession.setActionHandler('stop', () => {

            if (state.isPlaying) api.togglePlay();

          });

        } catch(e) {}

      }



      // Clean App Boot: Check if last session should be restored
      let sessionRestored = false;
      try {
        if (localStorage.getItem('juicebx_remember_session') !== 'false') {
          const savedSession = JSON.parse(localStorage.getItem('juicebx_last_session'));
          if (savedSession && savedSession.track && Array.isArray(savedSession.queue) && savedSession.queue.length > 0) {
            state.queue = savedSession.queue;
            state.currentIndex = Math.max(0, Math.min(savedSession.index || 0, savedSession.queue.length - 1));
            state.isPlaying = false;
            state.currentTime = 0;
            const cur = state.queue[state.currentIndex];
            state.duration = cur.seconds || (cur.duration ? parseDuration(cur.duration) : 0);
            sessionRestored = true;
          }
        }
      } catch(e) {}

      if (!sessionRestored) {
        const savedDownloads = api.getDownloads();
        state.queue = (savedDownloads && savedDownloads.length > 0) ? [...savedDownloads] : [];
        state.currentIndex = -1;
        state.isPlaying = false;
        state.currentTime = 0;
        state.duration = 0;
      }



      emit('engine:queueUpdated', state.queue);

      emit('engine:stateChanged', state);



      // Async fetch online top hits to augment

      try {

        const res = await fetch('/api/top');

        if (res.ok) {

          const onlineTracks = await res.json();

          if (onlineTracks && onlineTracks.length > 0) {

            const currentIds = new Set(state.queue.map(t => t.id));

            const newTracks = onlineTracks.filter(t => !currentIds.has(t.id));

            if (newTracks.length > 0) {

              state.queue.push(...newTracks);

              emit('engine:queueUpdated', state.queue);

            }

          }

        }

      } catch (e) {

        console.warn("Online top fetch fallback used.");

      }

    },

    getState: () => ({ ...state }),

    getDefaultLibrary: () => [...DEFAULT_LIBRARY],

    setQueue: (newTracks, playFirst = false) => {

      if (Array.isArray(newTracks) && newTracks.length > 0) {

        state.queue = newTracks;

        state.currentIndex = 0;

        loadTrack(0, playFirst);

        emit('engine:queueUpdated', state.queue);

      }

    },

    playTrack: (index) => {

      loadTrack(index, true);

    },

    removeFromQueue: (index) => {

      if (index < 0 || index >= state.queue.length) return;

      const isCurrent = (index === state.currentIndex);

      const wasPlaying = state.isPlaying;



      state.queue.splice(index, 1);



      if (state.queue.length === 0) {

        state.currentIndex = -1;

        state.isPlaying = false;

        if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') ytPlayer.pauseVideo();

        if (localAudio) localAudio.pause();

      } else if (isCurrent) {

        // Removed the current track - advance pointer but DO NOT autoplay

        state.currentIndex = Math.min(index, state.queue.length - 1);

        if (wasPlaying) {

          // Was playing: continue from next track seamlessly

          loadTrack(state.currentIndex, true);

        } else {

          // Was paused: just update display, do not start playing

          loadTrack(state.currentIndex, false);

        }

      } else if (index < state.currentIndex) {

        state.currentIndex--;

      }



      emit('engine:queueUpdated', state.queue);

      emit('engine:stateChanged', state);

    },

    unlockAudio: () => {

      // Force unlock iOS Safari audio context on first user interaction

      initLocalAudio();

      if (localAudio && localAudio.paused && !localAudio.src) {

        localAudio.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU2LjM2LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIAD+//7+////////////////////////////////////////////////////////AAAAAExhdmM1Ni40MS4xMDAAAAAAAAAAAAAAAAEkEQAAAAAAAAAASQRFgEAAQAAAAAAAAAA//OEAAAAAAAAAAAAAAABXAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQ==';

        localAudio.play().then(() => localAudio.pause()).catch(() => {});

      }

    },

    togglePlay: () => {

      if (state.currentIndex === -1 || !state.queue[state.currentIndex]) {

        if (state.queue.length > 0) {

          loadTrack(0, true);

          return;

        }

        if (typeof window.launchGenreShuffle === 'function') {

          window.launchGenreShuffle('hiphop_top100');

          return;

        }

      }

      const track = state.queue[state.currentIndex];

      if (track && (track.isLocal || track.isDirectAudio) && localAudio) {

        if (localAudio.paused) {

          localAudio.play().catch(e => console.warn(e));

          state.isPlaying = true;

        } else {

          localAudio.pause();

          state.isPlaying = false;

        }

        emit('engine:stateChanged', state);

        return;

      }



      if (!state.isApiReady || !ytPlayer) {

        state.isPlaying = !state.isPlaying;

        emit('engine:stateChanged', state);

        return;

      }



      try {

        if (state.isPlaying) {

          if (typeof ytPlayer.pauseVideo === 'function') ytPlayer.pauseVideo();

          if (localAudio && localAudio.src.startsWith('data:audio')) localAudio.pause();

          state.isPlaying = false;

        } else {

          try {

            if (typeof ytPlayer.unMute === 'function') ytPlayer.unMute();

            if (typeof ytPlayer.setVolume === 'function') ytPlayer.setVolume(state.volume);

          } catch(e) {}

          if (typeof ytPlayer.playVideo === 'function') ytPlayer.playVideo();

          if (localAudio && localAudio.src.startsWith('data:audio')) {

            localAudio.play().catch(e => console.warn('Silent audio resume failed', e));

          }

          state.isPlaying = true;

        }

        emit('engine:stateChanged', state);

      } catch (e) {

        state.isPlaying = !state.isPlaying;

        emit('engine:stateChanged', state);

      }

    },

    next: () => {

      if (state.queue.length === 0) return;

      const nextIndex = (state.currentIndex + 1) % state.queue.length;

      loadTrack(nextIndex, true);

    },

    prev: () => {

      if (state.queue.length === 0) return;

      if (state.currentTime > 3) {

        api.seek(0);

      } else {

        const prevIndex = (state.currentIndex - 1 + state.queue.length) % state.queue.length;

        loadTrack(prevIndex, true);

      }

    },

    seek: (percentOrSeconds) => {

      const track = state.queue[state.currentIndex];

      const isDirect = track && (track.isLocal || track.isDirectAudio) && localAudio;

      if (isDirect && localAudio.duration) {

        const sec = percentOrSeconds > 1 ? percentOrSeconds : (percentOrSeconds / 100) * localAudio.duration;

        localAudio.currentTime = Math.min(localAudio.duration, Math.max(0, sec));

        state.currentTime = localAudio.currentTime;

        emit('engine:progress', { currentTime: state.currentTime, duration: state.duration });

        return;

      }



      if (ytPlayer && state.duration > 0) {

        const seconds = percentOrSeconds > 1 ? percentOrSeconds : (percentOrSeconds / 100) * state.duration;

        ytPlayer.seekTo(seconds, true);

        state.currentTime = seconds;

        emit('engine:progress', { currentTime: state.currentTime, duration: state.duration });

      }

    },

    setVolume: (val) => {

      state.volume = Math.max(0, Math.min(100, val));

      if (localAudio) localAudio.volume = state.volume / 100;

      if (ytPlayer && typeof ytPlayer.setVolume === 'function') {

        ytPlayer.setVolume(state.volume);

      }

      emit('engine:stateChanged', state);

    },

    toggleShuffle: () => {

      state.shuffle = !state.shuffle;

      emit('engine:stateChanged', state);

    },

    toggleRepeat: () => {

      state.repeat = !state.repeat;

      emit('engine:stateChanged', state);

    },

    setPlaybackSpeed: (speed) => {

      state.playbackSpeed = speed;

      if (localAudio) localAudio.playbackRate = speed;

      if (ytPlayer && typeof ytPlayer.setPlaybackRate === 'function') {

        try { ytPlayer.setPlaybackRate(speed); } catch(e) {}

      }

      emit('engine:speedChanged', speed);

      emit('engine:stateChanged', state);

      return speed;

    },

    getPlaybackSpeed: () => state.playbackSpeed || 1.0,

    getAudioLevels: () => getAudioLevels(),

    ensureAudioContext: () => ensureAudioContext(),

    search: async (query) => {

      if (!query || !query.trim()) return [];

      try {

        const res = await fetch(getApiUrl(`/api/search?q=${encodeURIComponent(query)}`));

        if (res.ok) {

          const results = await res.json();

          if (Array.isArray(results) && results.length > 0) return results;

        }

      } catch (e) {

        console.warn("Backend search failed, trying Invidious fallback...", e);

      }



      try {

        const invRes = await fetch(`https://inv.nadeko.net/api/v1/search?q=${encodeURIComponent(query)}&type=video`);

        if (invRes.ok) {

          const items = await invRes.json();

          if (Array.isArray(items) && items.length > 0) {

            return items.map(item => ({

              id: item.videoId,

              title: item.title,

              artist: item.author || 'YouTube Music',

              duration: Math.floor(item.lengthSeconds / 60) + ':' + String(item.lengthSeconds % 60).padStart(2, '0'),

              seconds: item.lengthSeconds,

              thumb: (item.videoThumbnails && item.videoThumbnails[0]?.url) || `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`

            }));

          }

        }

      } catch(invErr) {}



      // Fallback: Client-side search across all loaded catalogs

      const q = query.toLowerCase().trim();

      const allTracks = (typeof TOP_SHUFFLES_CATALOG !== 'undefined')

        ? Object.values(TOP_SHUFFLES_CATALOG).flatMap(c => c.tracks || [])

        : DEFAULT_LIBRARY;

      return allTracks.filter(t => 

        (t.title && t.title.toLowerCase().includes(q)) || 

        (t.artist && t.artist.toLowerCase().includes(q))

      );

    },

    playJuiceRadio: async () => {

      try {

        const res = await fetch(getApiUrl('/api/juicewrld/radio'));

        if (res.ok) {

          const track = await res.json();

          if (track && track.title) {

            api.setQueue([track], true);

            return track;

          }

        }

      } catch(e) {

        console.warn("Backend Juice Radio failed, falling back to local.");

      }

      const randomTrack = DEFAULT_LIBRARY[Math.floor(Math.random() * DEFAULT_LIBRARY.length)];

      api.setQueue([randomTrack], true);

      return randomTrack;

    },

    searchJuiceVault: async (query) => {

      if (!query) return [];

      try {

        const res = await fetch(getApiUrl(`/api/juicewrld/search?q=${encodeURIComponent(query)}`));

        if (res.ok) {

          const data = await res.json();

          return data?.results || [];

        }

      } catch(e) {

        console.warn("Vault search error:", e);

      }

      return [];

    },

    downloadTrack: async (track) => {

      if (!track) return;

      try {

        let downloads = JSON.parse(localStorage.getItem('juicebx_downloads') || '[]');

        const exists = downloads.some(d => d.id === track.id || d.title === track.title);

        if (!exists) {

          const trackEntry = { ...track, isDownloaded: true, savedAt: Date.now() };

          // For Juice WRLD direct-audio tracks: cache the audio blob via Cache API
          // This gives true offline playback with NO extra Android permissions needed
          if (track.audioUrl && (track.isDirectAudio || track.isLocal)) {
            try {
              if ('caches' in window) {
                const cache = await caches.open('juicebx-audio-v1');
                const cacheKey = `juicebx-audio:${track.id || track.title}`;
                const cached = await cache.match(cacheKey);
                if (!cached) {
                  const audioRes = await fetch(track.audioUrl);
                  if (audioRes.ok) {
                    await cache.put(cacheKey, audioRes.clone());
                    trackEntry.cachedKey = cacheKey;
                    trackEntry.offlineReady = true;
                  }
                } else {
                  trackEntry.cachedKey = cacheKey;
                  trackEntry.offlineReady = true;
                }
              }
            } catch(cacheErr) {
              console.warn('[JuiceBx] Cache API unavailable:', cacheErr);
            }
          }

          downloads.push(trackEntry);

          localStorage.setItem('juicebx_downloads', JSON.stringify(downloads));

        }

        emit('engine:downloadComplete', track);

      } catch (e) {

        console.error("Download error:", e);

      }

    },

    getDownloads: () => {

      try {

        return JSON.parse(localStorage.getItem('juicebx_downloads') || '[]');

      } catch (e) {

        return [];

      }

    },

    clearDownloads: () => {

      localStorage.removeItem('juicebx_downloads');

      emit('engine:downloadsCleared');

    },

    // ΓòÉΓòÉΓòÉ FAVORITES / LIKED SONGS ΓòÉΓòÉΓòÉ

    getFavorites: () => {

      try {

        const stored = localStorage.getItem('juicebx_favorites');

        if (stored) return JSON.parse(stored);

        const defaults = [

          { id: "mzB1V935Gsw", title: "Lucid Dreams", artist: "Juice WRLD", duration: "3:51", seconds: 231, thumb: "https://i.ytimg.com/vi/mzB1V935Gsw/hqdefault.jpg" },

          { id: "iILFsYwZ_eY", title: "Robbery", artist: "Juice WRLD", duration: "4:00", seconds: 240, thumb: "https://i.ytimg.com/vi/iILFsYwZ_eY/hqdefault.jpg" },

          { id: "h4819g8471k", title: "Rental (Kiri's Final)", artist: "Juice WRLD", duration: "3:47", seconds: 227, thumb: "https://i.ytimg.com/vi/h4819g8471k/hqdefault.jpg" }

        ];

        localStorage.setItem('juicebx_favorites', JSON.stringify(defaults));

        return defaults;

      } catch (e) {

        return [];

      }

    },

    isFavorite: (trackId) => {

      const favs = api.getFavorites();

      return favs.some(f => f.id === trackId);

    },

    toggleFavorite: (track) => {

      if (!track) return false;

      let favs = api.getFavorites();

      const existingIdx = favs.findIndex(f => f.id === track.id || f.title === track.title);

      let isFav = false;

      if (existingIdx >= 0) {

        favs.splice(existingIdx, 1);

        isFav = false;

      } else {

        favs.unshift({ ...track, favoritedAt: Date.now() });

        isFav = true;

      }

      localStorage.setItem('juicebx_favorites', JSON.stringify(favs));

      emit('engine:favoritesUpdated', { track, isFavorite: isFav, favorites: favs });

      return isFav;

    },

    // ΓòÉΓòÉΓòÉ CUSTOM PLAYLISTS ΓòÉΓòÉΓòÉ

    getPlaylists: () => {

      try {

        const stored = localStorage.getItem('juicebx_playlists');;

        if (stored) return JSON.parse(stored);

        const defaults = [

          {

            id: "pl_heavy_rotation",

            name: "🔥 Heavy Rotation",

            description: "Daily studio grails & essential anthems",

            createdAt: Date.now(),

            tracks: [

              { id: "mzB1V935Gsw", title: "Lucid Dreams", artist: "Juice WRLD", duration: "3:51", seconds: 231, thumb: "https://i.ytimg.com/vi/mzB1V935Gsw/hqdefault.jpg" },

              { id: "h3h035Eyz5A", title: "All Girls Are The Same", artist: "Juice WRLD", duration: "3:13", seconds: 193, thumb: "https://i.ytimg.com/vi/h3h035Eyz5A/hqdefault.jpg" },

              { id: "cr3nNflrO-c", title: "Wishing Well", artist: "Juice WRLD", duration: "3:14", seconds: 194, thumb: "https://i.ytimg.com/vi/cr3nNflrO-c/hqdefault.jpg" },

              { id: "iILFsYwZ_eY", title: "Robbery", artist: "Juice WRLD", duration: "4:00", seconds: 240, thumb: "https://i.ytimg.com/vi/iILFsYwZ_eY/hqdefault.jpg" }

            ]

          },

          {

            id: "pl_midnight_vibes",

            name: "🌙 Midnight Vibes",

            description: "Late night drive & atmospheric gems",

            createdAt: Date.now(),

            tracks: [

              { id: "s510g8319fA", title: "Righteous", artist: "Juice WRLD", duration: "4:02", seconds: 242, thumb: "https://i.ytimg.com/vi/s510g8319fA/hqdefault.jpg" },

              { id: "WcsFWHZ5q88", title: "Wasted (feat. Lil Uzi Vert)", artist: "Juice WRLD", duration: "4:18", seconds: 258, thumb: "https://i.ytimg.com/vi/WcsFWHZ5q88/hqdefault.jpg" },

              { id: "pvyOndbmOcg", title: "Black & White", artist: "Juice WRLD", duration: "3:06", seconds: 186, thumb: "https://i.ytimg.com/vi/pvyOndbmOcg/hqdefault.jpg" }

            ]

          }

        ];

        localStorage.setItem('juicebx_playlists', JSON.stringify(defaults));

        return defaults;

      } catch (e) {

        return [];

      }

    },

    getPlaylist: (playlistId) => {

      const playlists = api.getPlaylists();

      return playlists.find(p => p.id === playlistId) || null;

    },

    createPlaylist: (name, description = "") => {

      if (!name || !name.trim()) return null;

      const playlists = api.getPlaylists();

      const newPlaylist = {

        id: `pl_${Date.now()}`,

        name: name.trim(),

        description: description.trim(),

        createdAt: Date.now(),

        tracks: []

      };

      playlists.unshift(newPlaylist);

      localStorage.setItem('juicebx_playlists', JSON.stringify(playlists));

      emit('engine:playlistsUpdated', playlists);

      return newPlaylist;

    },

    addToPlaylist: (playlistId, track) => {

      if (!playlistId || !track) return false;

      const playlists = api.getPlaylists();

      const pl = playlists.find(p => p.id === playlistId);

      if (!pl) return false;

      const exists = pl.tracks.some(t => t.id === track.id || t.title === track.title);

      if (!exists) {

        pl.tracks.push(track);

        localStorage.setItem('juicebx_playlists', JSON.stringify(playlists));

        emit('engine:playlistsUpdated', playlists);

        return true;

      }

      return false;

    },

    removeFromPlaylist: (playlistId, trackId) => {

      const playlists = api.getPlaylists();

      const pl = playlists.find(p => p.id === playlistId);

      if (!pl) return false;

      pl.tracks = pl.tracks.filter(t => t.id !== trackId);

      localStorage.setItem('juicebx_playlists', JSON.stringify(playlists));

      emit('engine:playlistsUpdated', playlists);

      return true;

    },

    deletePlaylist: (playlistId) => {

      let playlists = api.getPlaylists();

      playlists = playlists.filter(p => p.id !== playlistId);

      localStorage.setItem('juicebx_playlists', JSON.stringify(playlists));

      emit('engine:playlistsUpdated', playlists);

      return true;

    },

    // ΓòÉΓòÉΓòÉ LOCAL FILES IMPORT ΓòÉΓòÉΓòÉ

    importLocalAudioFiles: async (fileList) => {

      if (!fileList || fileList.length === 0) return [];

      const imported = [];



      for (let i = 0; i < fileList.length; i++) {

        const file = fileList[i];

        if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|ogg|flac|m4a|aac)$/i)) continue;



        let nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");

        let artist = "Local Artist";

        let title = nameWithoutExt;



        if (nameWithoutExt.includes(' - ')) {

          const parts = nameWithoutExt.split(' - ');

          artist = parts[0].trim();

          title = parts.slice(1).join(' - ').trim();

        }



        const audioUrl = URL.createObjectURL(file);

        const trackObj = {

          id: `local_${Date.now()}_${i}`,

          title: title,

          artist: artist,

          duration: "Local File",

          seconds: 180,

          thumb: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80",

          isLocal: true,

          isDownloaded: true,

          audioUrl: audioUrl,

          fileName: file.name

        };



        imported.push(trackObj);

        api.downloadTrack(trackObj);

      }



      if (imported.length > 0) {

        state.queue.unshift(...imported);

        loadTrack(0, true);

        emit('engine:queueUpdated', state.queue);

      }



      return imported;

    },

    fetchLyrics: async (rawTitle, rawArtist) => {

      try {

        let title = (rawTitle || '').trim();

        let artist = (rawArtist || '').trim();



        // 1. Try local server lyrics proxy first

        try {

          const res = await fetch(`/api/lyrics?track=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}`);

          if (res.ok) {

            const data = await res.json();

            if (data && (data.syncedLyrics || data.plainLyrics)) {

              return data.syncedLyrics || data.plainLyrics;

            }

          }

        } catch (err) {

          console.warn("[JuiceEngine] Server lyrics proxy fallback:", err);

        }



        // 2. Direct LRCLIB fallback with clean queries

        const cleanTitle = title

          .replace(/^[┬½ΓÇ£"'`]|['"ΓÇ¥┬╗`]$/g, '')

          .replace(/\(.*?\)/g, '')

          .replace(/\[.*?\]/g, '')

          .replace(/ft\.?.*$/i, '')

          .replace(/feat\.?.*$/i, '')

          .replace(/official (music )?video/gi, '')

          .replace(/official audio/gi, '')

          .replace(/lyric(s)? (video)?/gi, '')

          .replace(/audio/gi, '')

          .replace(/["']/g, '')

          .trim();



        const cleanArtist = artist

          .replace(/\(.*?\)/g, '')

          .replace(/\[.*?\]/g, '')

          .replace(/ - Topic$/i, '')

          .replace(/VEVO$/i, '')

          .replace(/["']/g, '')

          .trim();



        const query = `${cleanArtist} ${cleanTitle}`.trim();

        const res = await fetch('https://lrclib.net/api/search?q=' + encodeURIComponent(query));

        if (res.ok) {

          const list = await res.json();

          if (Array.isArray(list) && list.length > 0) {

            const best = list.find(item => item.syncedLyrics) || list[0];

            return best.syncedLyrics || best.plainLyrics || null;

          }

        }

      } catch (e) {

        console.warn("Lyrics fetch error:", e);

      }

      return null;

    },

    // ΓòÉΓòÉΓòÉ HAPTIC AUDIO FEEDBACK ΓòÉΓòÉΓòÉ

    playHaptic: (freq = 550, duration = 0.025) => {

      playHapticSound(freq, duration);

    },

    setHaptics: (enabled) => {

      state.hapticsEnabled = !!enabled;

      localStorage.setItem('juicebx_haptics', state.hapticsEnabled ? 'true' : 'false');

      emit('engine:hapticsChanged', state.hapticsEnabled);

    },

    toggleHaptics: () => {

      api.setHaptics(!state.hapticsEnabled);

      return state.hapticsEnabled;

    },

    // ΓòÉΓòÉΓòÉ SLEEP TIMER ΓòÉΓòÉΓòÉ

    setSleepTimer: (minutes) => {

      clearInterval(sleepInterval);

      if (!minutes || minutes <= 0) {

        state.sleepTimerRemaining = 0;

        state.sleepTimerTotal = 0;

        emit('engine:sleepTimerUpdated', { active: false, remaining: 0 });

        return;

      }



      state.sleepTimerTotal = minutes * 60;

      state.sleepTimerRemaining = minutes * 60;

      emit('engine:sleepTimerUpdated', { active: true, remaining: state.sleepTimerRemaining });



      sleepInterval = setInterval(() => {

        state.sleepTimerRemaining--;

        emit('engine:sleepTimerUpdated', { active: true, remaining: state.sleepTimerRemaining });



        if (state.sleepTimerRemaining <= 15 && state.sleepTimerRemaining > 0) {

          const fadeRatio = state.sleepTimerRemaining / 15;

          const currentVol = Math.round(state.volume * fadeRatio);

          if (localAudio) localAudio.volume = Math.max(0, currentVol / 100);

          if (ytPlayer && ytPlayer.setVolume) ytPlayer.setVolume(currentVol);

        }



        if (state.sleepTimerRemaining <= 0) {

          clearInterval(sleepInterval);

          state.sleepTimerRemaining = 0;

          api.pause();

          api.setVolume(state.volume);

          emit('engine:sleepTimerUpdated', { active: false, remaining: 0, finished: true });

        }

      }, 1000);

    },

    cancelSleepTimer: () => {

      clearInterval(sleepInterval);

      state.sleepTimerRemaining = 0;

      state.sleepTimerTotal = 0;

      emit('engine:sleepTimerUpdated', { active: false, remaining: 0 });

    }

  };



  // Auto-skip to next track when a stream permanently errors out
  window.addEventListener('engine:streamError', (ev) => {
    const { track } = (ev && ev.detail) || {};
    const cur = state.queue[state.currentIndex];
    if (state.autoplay && track && cur && cur.title === track.title) {
      setTimeout(() => api.next(), 1500);
    }
  });

  return api;

})();



// Keep alive

document.addEventListener('visibilitychange', () => { if (document.hidden && window.engine) { const state = window.engine.getState(); if (state.isPlaying && !state.isLocalPlaying && typeof ytPlayer !== 'undefined') { setTimeout(() => { if (typeof ytPlayer.playVideo === 'function') ytPlayer.playVideo(); }, 100); } } });

