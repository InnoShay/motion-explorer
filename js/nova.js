/* ============================================
   MOTION EXPLORER — NOVA AI Guide
   ============================================ */

const Nova = {
  _bubble: null,
  _textEl: null,
  _avatar: null,
  _timeout: null,
  _visible: false,

  // ── Initialize ──
  init() {
    this._bubble = document.getElementById('nova-bubble');
    this._textEl = document.getElementById('nova-text');
    this._avatar = document.getElementById('nova-avatar');
    
    if (this._avatar) {
      this._avatar.addEventListener('click', () => {
        if (this._visible) {
          this.hide();
        } else {
          this.say(this._getRandomEncouragement());
        }
      });
    }
  },

  // ── Show message ──
  say(message, duration = 8000) {
    if (!this._bubble || !this._textEl) return;
    
    clearTimeout(this._timeout);
    
    // Instead of typewriter, elegant fade in text
    this._textEl.style.opacity = '0';
    setTimeout(() => {
      this._textEl.innerHTML = message;
      this._textEl.style.opacity = '1';
      this._textEl.style.transition = 'opacity 0.3s ease';
    }, 150);
    
    this._bubble.classList.add('visible');
    this._visible = true;
    
    // Pulse avatar when talking
    if (this._avatar) this._avatar.style.transform = 'scale(1.1)';
    
    if (duration > 0) {
      this._timeout = setTimeout(() => {
        this.hide();
      }, duration);
    }
  },

  // ── Hide bubble ──
  hide() {
    if (!this._bubble) return;
    this._bubble.classList.remove('visible');
    this._visible = false;
    if (this._avatar) this._avatar.style.transform = 'scale(1)';
    clearTimeout(this._timeout);
  },

  // ── Context-aware hints per screen ──
  hints: {
    welcome: "Welcome to <strong>Motion Explorer</strong>! ✨ Click 'Start Exploration' to begin your journey.",
    motion: "<strong>Hint:</strong> Drag the car, athlete, or bird to see how their position changes. Motion is all about change in position!",
    distance: "<strong>Notice:</strong> The blue path measures total distance covered. The green path measures displacement (shortest straight line).",
    speed: "<strong>Try this:</strong> Change the car's speed using the slider and watch how the speedometer reacts.",
    acceleration: "<strong>Observe:</strong> When acceleration is positive, the rocket speeds up. When negative, it slows down!",
    graphs: "<strong>Tip:</strong> The slope of a distance-time graph tells you the speed. Steeper slope = faster motion.",
    challenge: "<strong>Challenge:</strong> Test your knowledge! Don't worry if you get it wrong, you can always try again.",
    certificate: "<strong>Congratulations!</strong> 🎓 You've mastered the concepts of motion.",
    finale: "Keep exploring the universe! Science is everywhere. 🌌"
  },

  // ── Greet for specific screen ──
  greet(screenId) {
    const hint = this.hints[screenId];
    if (hint) {
      // Small delay before showing hint
      setTimeout(() => this.say(hint, 6000), 1000);
    }
  },

  // ── Random encouragement ──
  _getRandomEncouragement() {
    const phrases = [
      "Keep exploring! Every interaction teaches you something new.",
      "Science is all about curiosity. Try interacting with everything!",
      "Remember: understanding comes from experience, not just reading.",
      "Fun fact: Even sitting still, you're moving at 1,670 km/h with Earth's rotation! 🌍"
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  },

  // ── Show/hide NOVA system ──
  show() {
    const container = document.querySelector('.nova-container');
    if (container) {
      container.style.display = 'flex';
      container.style.animation = 'fadeIn 0.5s ease forwards';
    }
  },

  hideSystem() {
    const container = document.querySelector('.nova-container');
    if (container) {
      container.style.display = 'none';
      this.hide();
    }
  }
};
