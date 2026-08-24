// ═══ XBOX CONTROLLER & TV GAMEPAD NAVIGATION ENGINE ═══
(function initXboxGamepadNavigation() {
  let gamepadConnected = false;
  let focusedElementIndex = 0;
  let lastButtonStates = {};
  let lastAxisTime = 0;
  let focusableElements = [];

  function updateFocusables() {
    const selector = 'button:not([disabled]), [tabindex="0"], .genre-card, .track-item, .nav-btn, input, .deck-mode-pill';
    focusableElements = Array.from(document.querySelectorAll(selector)).filter(el => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).display !== 'none' && window.getComputedStyle(el).visibility !== 'hidden';
      return isVisible;
    });
  }

  function setFocus(index) {
    updateFocusables();
    if (focusableElements.length === 0) return;
    if (index < 0) index = focusableElements.length - 1;
    if (index >= focusableElements.length) index = 0;
    focusedElementIndex = index;

    const el = focusableElements[focusedElementIndex];
    if (el) {
      el.focus();
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      // Add custom Xbox highlight class
      document.querySelectorAll('.xbox-focus-ring').forEach(e => e.classList.remove('xbox-focus-ring'));
      el.classList.add('xbox-focus-ring');
    }
  }

  // Inject Xbox Focus Ring CSS
  const style = document.createElement('style');
  style.textContent = `
    .xbox-focus-ring {
      outline: 3px solid #ff4f00 !important;
      outline-offset: 3px !important;
      box-shadow: 0 0 16px rgba(255, 79, 0, 0.6) !important;
      transform: scale(1.03) !important;
      transition: transform 0.15s ease, outline 0.15s ease !important;
      z-index: 40 !important;
    }
    #xbox-hud-bar {
      position: fixed;
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(12, 14, 24, 0.92);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 79, 0, 0.3);
      padding: 6px 16px;
      border-radius: 999px;
      display: flex;
      gap: 16px;
      align-items: center;
      font-size: 11px;
      font-weight: 700;
      color: #ffffff;
      box-shadow: 0 8px 24px rgba(0,0,0,0.6);
      z-index: 99999;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }
    .xbox-btn-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      font-size: 10px;
      font-weight: 900;
      color: #000;
      margin-right: 4px;
    }
    .btn-a { background: #107c10; color: #fff; }
    .btn-b { background: #e81123; color: #fff; }
    .btn-x { background: #0078d7; color: #fff; }
    .btn-y { background: #ffb900; }
  `;
  document.head.appendChild(style);

  function createXboxHud() {
    if (document.getElementById('xbox-hud-bar')) return;
    const hud = document.createElement('div');
    hud.id = 'xbox-hud-bar';
    hud.innerHTML = `
      <span><span class="xbox-btn-badge btn-a">A</span>Select</span>
      <span><span class="xbox-btn-badge btn-b">B</span>Back</span>
      <span><span class="xbox-btn-badge btn-x">X</span>Play/Pause</span>
      <span><span class="xbox-btn-badge btn-y">Y</span>Search</span>
      <span><strong style="color:#ff4f00;">LB/RB</strong> Skip</span>
    `;
    document.body.appendChild(hud);
  }

  function pollGamepad() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    let gp = null;
    for (let i = 0; i < gamepads.length; i++) {
      if (gamepads[i] && gamepads[i].connected) {
        gp = gamepads[i];
        break;
      }
    }

    if (gp) {
      if (!gamepadConnected) {
        gamepadConnected = true;
        createXboxHud();
        updateFocusables();
        setFocus(0);
        console.log(`[JuiceBx Xbox] Controller Connected: ${gp.id}`);
      }

      const now = performance.now();

      // D-Pad navigation (Buttons 12=Up, 13=Down, 14=Left, 15=Right)
      const dUp = gp.buttons[12] && gp.buttons[12].pressed;
      const dDown = gp.buttons[13] && gp.buttons[13].pressed;
      const dLeft = gp.buttons[14] && gp.buttons[14].pressed;
      const dRight = gp.buttons[15] && gp.buttons[15].pressed;

      // Analog Stick
      const stickX = gp.axes[0] || 0;
      const stickY = gp.axes[1] || 0;

      if (now - lastAxisTime > 180) {
        if (dDown || stickY > 0.5) {
          setFocus(focusedElementIndex + 1);
          lastAxisTime = now;
        } else if (dUp || stickY < -0.5) {
          setFocus(focusedElementIndex - 1);
          lastAxisTime = now;
        } else if (dRight || stickX > 0.5) {
          setFocus(focusedElementIndex + 1);
          lastAxisTime = now;
        } else if (dLeft || stickX < -0.5) {
          setFocus(focusedElementIndex - 1);
          lastAxisTime = now;
        }
      }

      // Button A (Index 0) - Select / Click
      if (gp.buttons[0] && gp.buttons[0].pressed && !lastButtonStates[0]) {
        const el = focusableElements[focusedElementIndex];
        if (el) el.click();
      }

      // Button B (Index 1) - Back / Close
      if (gp.buttons[1] && gp.buttons[1].pressed && !lastButtonStates[1]) {
        const modal = document.getElementById('player-modal');
        if (modal && modal.style.transform === 'translateY(0px)') {
          modal.style.transform = 'translateY(100%)';
        } else {
          const homeBtn = document.querySelector('button[data-target="view-home"]');
          if (homeBtn) homeBtn.click();
        }
      }

      // Button X (Index 2) - Play / Pause
      if (gp.buttons[2] && gp.buttons[2].pressed && !lastButtonStates[2]) {
        if (window.engine && window.engine.togglePlay) {
          window.engine.togglePlay();
        }
      }

      // Button Y (Index 3) - Jump to Search
      if (gp.buttons[3] && gp.buttons[3].pressed && !lastButtonStates[3]) {
        const searchBtn = document.querySelector('button[data-target="view-search"]');
        if (searchBtn) {
          searchBtn.click();
          const searchInput = document.getElementById('search-input');
          if (searchInput) searchInput.focus();
        }
      }

      // LB (Left Bumper, Index 4) - Previous Track
      if (gp.buttons[4] && gp.buttons[4].pressed && !lastButtonStates[4]) {
        if (window.engine && window.engine.prev) window.engine.prev();
      }

      // RB (Right Bumper, Index 5) - Next Track
      if (gp.buttons[5] && gp.buttons[5].pressed && !lastButtonStates[5]) {
        if (window.engine && window.engine.next) window.engine.next();
      }

      // Update button state history
      for (let b = 0; b < gp.buttons.length; b++) {
        lastButtonStates[b] = gp.buttons[b] ? gp.buttons[b].pressed : false;
      }
    }

    requestAnimationFrame(pollGamepad);
  }

  window.addEventListener('gamepadconnected', () => {
    gamepadConnected = true;
    createXboxHud();
  });

  window.addEventListener('gamepaddisconnected', () => {
    gamepadConnected = false;
    const hud = document.getElementById('xbox-hud-bar');
    if (hud) hud.remove();
    document.querySelectorAll('.xbox-focus-ring').forEach(e => e.classList.remove('xbox-focus-ring'));
  });

  requestAnimationFrame(pollGamepad);
})();
