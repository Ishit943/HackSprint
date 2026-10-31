/**
 * MONSTER MATCH - HALLOWEEN HORROR THEME ENGINE
 * Ambient cemetery canvas particles, Web Audio API sound synthesizer,
 * mouse ember trails, dripping accents, and interactive horror easter eggs.
 */

class HalloweenHorrorEngine {
  constructor() {
    this.soundEnabled = localStorage.getItem('mm_haunted_sound') === 'true';
    this.audioCtx = null;
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.cursorParticles = [];
    this.bats = [];
    this.eyes = [];
    this.animId = null;
    this.lastTime = 0;
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.boot());
    } else {
      this.boot();
    }
  }

  boot() {
    this.injectDrippingAccent();
    this.setupAudioToggle();
    this.initCanvas();
    this.bindHoverAndClickAudio();
    this.setupCursorTrails();
    this.injectSummonGhostButton();
  }

  // --- 1. Web Audio API Haunted Synthesizer (Zero External Audio Files) ---
  getAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  playHoverSound() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Spectral ghost glide frequency
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.12);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (_) {}
  }

  playClickSound() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.09);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (_) {}
  }

  playSpellSound() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const notes = [440, 554.37, 659.25, 880, 1108.73];
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;

        const startTime = now + idx * 0.05;
        gain.gain.setValueAtTime(0.08, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });
    } catch (_) {}
  }

  playDungeonBoom() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.6);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.7);
    } catch (_) {}
  }

  // --- 2. Audio Toggle UI in Navbar ---
  setupAudioToggle() {
    const navActions = document.querySelector('.nav-actions');
    if (!navActions || document.getElementById('haunted-audio-toggle')) return;

    const audioBtn = document.createElement('button');
    audioBtn.id = 'haunted-audio-toggle';
    audioBtn.className = 'btn-icon-toggle';
    audioBtn.setAttribute('type', 'button');
    audioBtn.setAttribute('title', this.soundEnabled ? 'Haunted FX: ON 🔊 (Click to Mute)' : 'Haunted FX: MUTED 🔇 (Click to Unmute)');
    audioBtn.innerHTML = this.soundEnabled ? '🔊' : '🔇';

    audioBtn.addEventListener('click', () => {
      this.soundEnabled = !this.soundEnabled;
      localStorage.setItem('mm_haunted_sound', this.soundEnabled ? 'true' : 'false');
      audioBtn.innerHTML = this.soundEnabled ? '🔊' : '🔇';
      audioBtn.setAttribute('title', this.soundEnabled ? 'Haunted FX: ON 🔊' : 'Haunted FX: MUTED 🔇');
      
      if (this.soundEnabled) {
        this.getAudioContext();
        this.playSpellSound();
        if (window.showToast) {
          window.showToast('Haunted sound effects unleashed! 🎃🔊', 'info', 2500);
        }
      } else {
        if (window.showToast) {
          window.showToast('Haunted sound muted 🔇', 'info', 2000);
        }
      }
    });

    // Place right next to theme toggle button
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      navActions.insertBefore(audioBtn, themeBtn);
    } else {
      navActions.prepend(audioBtn);
    }
  }

  // --- 3. Dripping Blood / Slime Accent Line Under Navbar ---
  injectDrippingAccent() {
    const navbar = document.querySelector('.navbar');
    if (!navbar || document.getElementById('dripping-slime-bar')) return;

    const slimeBar = document.createElement('div');
    slimeBar.id = 'dripping-slime-bar';
    slimeBar.style.cssText = `
      position: absolute;
      bottom: -10px;
      left: 0;
      width: 100%;
      height: 12px;
      pointer-events: none;
      z-index: 1001;
      overflow: hidden;
      opacity: 0.9;
    `;

    // SVG dripping drops repeating pattern
    slimeBar.innerHTML = `
      <svg width="100%" height="12" viewBox="0 0 1200 12" preserveAspectRatio="none" style="display:block;">
        <path d="M0,0 L1200,0 L1200,3 C1160,7 1140,11 1120,4 C1080,12 1050,11 1020,3 C980,10 940,9 910,2 C880,11 840,12 800,4 C760,11 720,10 690,3 C650,12 620,9 580,2 C540,11 500,10 470,3 C430,12 390,11 360,4 C320,12 280,9 250,2 C210,11 170,12 140,4 C100,11 60,9 30,3 L0,3 Z" 
              fill="#ff5500" opacity="0.85" filter="drop-shadow(0 2px 4px rgba(255, 85, 0, 0.6))" />
      </svg>
    `;

    navbar.style.position = 'sticky';
    navbar.appendChild(slimeBar);
  }

  // --- 4. Interactive Spooky Audio Binding ---
  bindHoverAndClickAudio() {
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('.btn, .card-hover, .nav-link, .selectable-tag, .chip, .match-score');
      if (target && !target.dataset.soundBound) {
        target.dataset.soundBound = 'true';
        target.addEventListener('mouseenter', () => this.playHoverSound());
        target.addEventListener('click', () => this.playClickSound());
      }
    });
  }

  // --- 5. Interactive Cursor Trail ---
  setupCursorTrails() {
    let lastX = 0, lastY = 0;
    window.addEventListener('mousemove', (e) => {
      const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      if (dist > 18) {
        lastX = e.clientX;
        lastY = e.clientY;
        if (this.cursorParticles.length < 35) {
          const isGreen = Math.random() > 0.65;
          this.cursorParticles.push({
            x: e.clientX,
            y: e.clientY,
            vx: (Math.random() - 0.5) * 1.2,
            vy: -Math.random() * 1.5 - 0.5,
            size: Math.random() * 4 + 2,
            alpha: 0.8,
            color: isGreen ? '#00ff66' : (Math.random() > 0.5 ? '#ff7700' : '#ff0044')
          });
        }
      }
    }, { passive: true });
  }

  // --- 6. Ambient Halloween Particle Canvas ---
  initCanvas() {
    if (document.getElementById('halloween-ambient-canvas')) return;

    this.canvas = document.createElement('canvas');
    this.canvas.id = 'halloween-ambient-canvas';
    document.body.prepend(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    const resize = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Seed floating ember and ectoplasm particles
    const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(this.createParticle(true));
    }

    // Seed occasional bats
    for (let b = 0; b < 2; b++) {
      this.bats.push(this.createBat());
    }

    this.lastTime = performance.now();
    this.renderLoop();
  }

  createParticle(randomY = false) {
    const isEcto = Math.random() > 0.7;
    return {
      x: Math.random() * window.innerWidth,
      y: randomY ? Math.random() * window.innerHeight : window.innerHeight + 10,
      size: Math.random() * 3.5 + 1.2,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -Math.random() * 1.2 - 0.4,
      alpha: Math.random() * 0.7 + 0.2,
      fadeSpeed: Math.random() * 0.004 + 0.002,
      color: isEcto ? '#00ff66' : (Math.random() > 0.4 ? '#ff5500' : '#ffaa00')
    };
  }

  createBat() {
    return {
      x: -50,
      y: Math.random() * (window.innerHeight * 0.6) + 40,
      vx: Math.random() * 2.5 + 2,
      vy: (Math.random() - 0.5) * 1.5,
      size: Math.random() * 14 + 16,
      flap: 0,
      flapSpeed: 0.18 + Math.random() * 0.08,
      delay: Math.random() * 300
    };
  }

  renderLoop() {
    const now = performance.now();
    const dt = (now - this.lastTime) / 1000;
    this.lastTime = now;

    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Render Embers & Ectoplasm
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.fadeSpeed;

        if (p.y < -10 || p.alpha <= 0) {
          this.particles[i] = this.createParticle(false);
          continue;
        }

        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, p.alpha);
        this.ctx.fillStyle = p.color;
        this.ctx.shadowBlur = p.size * 3;
        this.ctx.shadowColor = p.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }

      // Render Cursor Trail Embers
      for (let j = this.cursorParticles.length - 1; j >= 0; j--) {
        const cp = this.cursorParticles[j];
        cp.x += cp.vx;
        cp.y += cp.vy;
        cp.alpha -= 0.035;

        if (cp.alpha <= 0) {
          this.cursorParticles.splice(j, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.globalAlpha = cp.alpha;
        this.ctx.fillStyle = cp.color;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = cp.color;
        this.ctx.beginPath();
        this.ctx.arc(cp.x, cp.y, cp.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }

      // Render Spooky Bats
      for (let b = 0; b < this.bats.length; b++) {
        const bat = this.bats[b];
        if (bat.delay > 0) {
          bat.delay--;
          continue;
        }
        bat.x += bat.vx;
        bat.y += bat.vy;
        bat.flap += bat.flapSpeed;

        if (bat.x > this.canvas.width + 60) {
          this.bats[b] = this.createBat();
          continue;
        }

        this.drawBat(bat.x, bat.y, bat.size, bat.flap);
      }
    }

    this.animId = requestAnimationFrame(() => this.renderLoop());
  }

  drawBat(x, y, size, flap) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.fillStyle = 'rgba(10, 8, 16, 0.75)';
    this.ctx.strokeStyle = 'rgba(255, 85, 0, 0.4)';
    this.ctx.lineWidth = 1;

    const wing = Math.sin(flap) * (size * 0.4);

    this.ctx.beginPath();
    // Left Wing
    this.ctx.moveTo(0, 0);
    this.ctx.quadraticCurveTo(-size * 0.6, -size * 0.5 + wing, -size, 0 + wing);
    this.ctx.quadraticCurveTo(-size * 0.6, size * 0.3, 0, size * 0.3);
    // Right Wing
    this.ctx.quadraticCurveTo(size * 0.6, size * 0.3, size, 0 + wing);
    this.ctx.quadraticCurveTo(size * 0.6, -size * 0.5 + wing, 0, 0);
    this.ctx.fill();
    this.ctx.stroke();

    // Glowing Eyes
    this.ctx.fillStyle = '#ff5500';
    this.ctx.fillRect(-2, 2, 1.5, 1.5);
    this.ctx.fillRect(2, 2, 1.5, 1.5);

    this.ctx.restore();
  }

  // --- 7. Interactive "🎃 Summon Ghost" Easter Egg ---
  injectSummonGhostButton() {
    if (document.getElementById('summon-ghost-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'summon-ghost-btn';
    btn.setAttribute('type', 'button');
    btn.setAttribute('title', 'Summon a friendly Hackathon Spectre!');
    btn.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 24px;
      z-index: 999;
      background: linear-gradient(135deg, rgba(22, 18, 32, 0.95), rgba(12, 10, 18, 0.95));
      border: 1.5px solid rgba(255, 85, 0, 0.5);
      border-radius: 999px;
      padding: 8px 16px;
      color: #fff;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8), 0 0 15px rgba(255, 85, 0, 0.3);
      backdrop-filter: blur(8px);
      transition: all 0.25s ease;
      letter-spacing: 0.03em;
    `;

    btn.innerHTML = `
      <span class="float-anim" style="font-size: 16px;">🎃</span>
      <span>Summon Spook</span>
    `;

    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'translateY(-3px) scale(1.05)';
      btn.style.borderColor = '#ff7700';
      btn.style.boxShadow = '0 6px 25px rgba(255, 85, 0, 0.6), 0 0 35px rgba(0, 255, 102, 0.3)';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translateY(0) scale(1)';
      btn.style.borderColor = 'rgba(255, 85, 0, 0.5)';
      btn.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.8), 0 0 15px rgba(255, 85, 0, 0.3)';
    });

    btn.addEventListener('click', () => {
      this.playSpellSound();
      this.spawnGhostSpectre();
    });

    document.body.appendChild(btn);
  }

  spawnGhostSpectre() {
    const quotes = [
      "👻 BOO! A hackathon spectre blessed your squad with +100% bug resistance!",
      "🧛 Vampire Architect: 'Clean code only happens between midnight and sunrise!'",
      "🧟 Undead Coder: 'Braaiiins... and zero merge conflicts!'",
      "🎃 Pumpkin King: 'Your match compatibility is off the supernatural charts!'",
      "⚡ Frankenstein Dev: 'IT'S ALIVE! The production deployment lives!'"
    ];
    const quote = quotes[Math.floor(Math.random() * quotes.length)];

    // Create flying giant ghost across screen
    const ghost = document.createElement('div');
    ghost.style.cssText = `
      position: fixed;
      top: ${Math.random() * 50 + 20}%;
      left: -120px;
      z-index: 10000;
      font-size: 80px;
      pointer-events: none;
      filter: drop-shadow(0 0 25px rgba(0, 255, 102, 0.7));
      transition: transform 3.5s cubic-bezier(0.25, 1, 0.5, 1);
    `;
    ghost.innerHTML = '👻';
    document.body.appendChild(ghost);

    requestAnimationFrame(() => {
      ghost.style.transform = `translateX(${window.innerWidth + 250}px) translateY(-40px) rotate(15deg)`;
    });

    setTimeout(() => ghost.remove(), 3600);

    if (window.showToast) {
      window.showToast(quote, 'info', 4500);
    }
  }
}

export const HorrorEngine = new HalloweenHorrorEngine();
