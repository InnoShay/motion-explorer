/* ============================================
   MOTION EXPLORER — Boot Loader Logic
   ============================================ */

const BootLoader = {
  duration: 3500, // 3.5 seconds
  messages: [
    { time: 0, text: "Initializing Physics Engine..." },
    { time: 0.2, text: "Loading Interactive Simulations..." },
    { time: 0.5, text: "Preparing Motion Visualizations..." },
    { time: 0.7, text: "Calibrating AI Learning Assistant..." },
    { time: 0.9, text: "Launching Learning Environment..." }
  ],
  
  init() {
    const loaderEl = document.getElementById('boot-loader');
    if (!loaderEl) {
      // Fallback if loader is missing
      App.init();
      return;
    }

    this._createParticles(loaderEl);
    this._startSequence();
  },

  _createParticles(container) {
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'loader-particle';
      const size = Math.random() * 4 + 2;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.animationDuration = (Math.random() * 3 + 2) + 's';
      p.style.animationDelay = (Math.random() * 2) + 's';
      container.appendChild(p);
    }
  },

  _startSequence() {
    const fillEl = document.getElementById('loader-bar-fill');
    const pctEl = document.getElementById('loader-percent');
    const msgEl = document.getElementById('loader-message');
    const startTime = performance.now();

    let currentMsgIndex = 0;

    const animate = (time) => {
      let elapsed = time - startTime;
      let progress = Math.min(elapsed / this.duration, 1);
      
      // Easing function (easeOutQuad)
      let easedProgress = progress * (2 - progress);

      // Update progress bar
      let percent = Math.floor(easedProgress * 100);
      fillEl.style.width = percent + '%';
      pctEl.textContent = percent + '%';

      // Update messages
      if (currentMsgIndex < this.messages.length - 1) {
        if (progress >= this.messages[currentMsgIndex + 1].time) {
          currentMsgIndex++;
          msgEl.style.opacity = 0;
          setTimeout(() => {
            msgEl.textContent = this.messages[currentMsgIndex].text;
            msgEl.style.opacity = 1;
          }, 150);
        }
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this._complete();
      }
    };

    requestAnimationFrame(animate);
  },

  _complete() {
    const loaderEl = document.getElementById('boot-loader');
    
    // Add glow effect before hiding
    const fillEl = document.getElementById('loader-bar-fill');
    fillEl.style.boxShadow = "0 0 20px var(--color-cyan), 0 0 40px var(--color-cyan)";
    
    setTimeout(() => {
      // Fade out loader
      loaderEl.classList.add('hidden');
      
      // Initialize main app
      App.init();

      // Clean up DOM after transition
      setTimeout(() => {
        loaderEl.remove();
      }, 1000);
    }, 400); // Small pause at 100%
  }
};

// Start boot loader on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  BootLoader.init();
});
