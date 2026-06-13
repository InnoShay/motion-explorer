/* ============================================
   MOTION EXPLORER — Animation Helpers
   ============================================ */

const AnimationHelpers = {
  // Active animation frames
  _frames: new Map(),

  // ── Lerp ──
  lerp(a, b, t) {
    return a + (b - a) * t;
  },

  // ── Ease functions ──
  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  },

  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  },

  easeOutElastic(t) {
    if (t === 0 || t === 1) return t;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
  },

  easeOutBack(t) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },

  // ── Run animation loop ──
  animate(id, callback, duration = Infinity) {
    // Cancel existing animation with same id
    this.cancel(id);
    
    const startTime = performance.now();
    let frameId;
    
    const tick = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = duration === Infinity ? 0 : Math.min(elapsed / duration, 1);
      
      const shouldContinue = callback(progress, elapsed);
      
      if (shouldContinue !== false && progress < 1) {
        frameId = requestAnimationFrame(tick);
        this._frames.set(id, frameId);
      } else {
        this._frames.delete(id);
      }
    };
    
    frameId = requestAnimationFrame(tick);
    this._frames.set(id, frameId);
    
    return id;
  },

  // ── Cancel animation ──
  cancel(id) {
    if (this._frames.has(id)) {
      cancelAnimationFrame(this._frames.get(id));
      this._frames.delete(id);
    }
  },

  // ── Cancel all ──
  cancelAll() {
    for (const [id, frameId] of this._frames) {
      cancelAnimationFrame(frameId);
    }
    this._frames.clear();
  },

  // ── Count up animation ──
  countUp(element, from, to, duration = 1000, suffix = '') {
    const startTime = performance.now();
    const diff = to - from;
    
    const tick = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = this.easeOutCubic(progress);
      const current = from + diff * eased;
      
      element.textContent = (Number.isInteger(to) ? Math.round(current) : current.toFixed(1)) + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };
    
    requestAnimationFrame(tick);
  },

  // ── Particle System ──
  createConfetti(container, count = 50) {
    const colors = ['#7c3aed', '#a855f7', '#22d3ee', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    container.appendChild(confettiContainer);
    
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.width = (Math.random() * 8 + 5) + 'px';
      piece.style.height = (Math.random() * 8 + 5) + 'px';
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      piece.style.animationDelay = (Math.random() * 2) + 's';
      piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
      confettiContainer.appendChild(piece);
    }
    
    // Remove after animation
    setTimeout(() => {
      confettiContainer.remove();
    }, 5000);
  },

  // ── Typewriter effect ──
  typewriter(element, text, speed = 30) {
    return new Promise((resolve) => {
      element.textContent = '';
      let i = 0;
      
      const type = () => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(type, speed);
        } else {
          resolve();
        }
      };
      
      type();
    });
  },

  // ── Stagger animations on children ──
  staggerReveal(parent, delay = 100) {
    const children = parent.children;
    for (let i = 0; i < children.length; i++) {
      children[i].style.opacity = '0';
      children[i].style.animation = `fadeUp 0.5s var(--ease-out) ${i * delay}ms forwards`;
    }
  },

  // ── Generate stars ──
  generateStars(container, count = 80) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animationDelay = Math.random() * 3 + 's';
      star.style.animationDuration = (Math.random() * 3 + 2) + 's';
      star.style.width = star.style.height = (Math.random() * 2 + 1) + 'px';
      frag.appendChild(star);
    }
    container.appendChild(frag);
  }
};
