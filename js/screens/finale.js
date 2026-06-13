/* ============================================
   MOTION EXPLORER — Grand Finale
   ============================================ */

const FinaleScreen = {
  chainAnimated: false,

  concepts: ['Motion', 'Distance', 'Speed', 'Velocity', 'Acceleration', 'Graphs'],

  init() {
    this.chainAnimated = false;
    this._animateChain();
  },

  _animateChain() {
    const nodes = document.querySelectorAll('.chain-node');
    const arrows = document.querySelectorAll('.chain-arrow');

    let delay = 500;
    
    nodes.forEach((node, i) => {
      setTimeout(() => {
        node.classList.add('lit');
        if (arrows[i]) arrows[i].classList.add('lit');
        
        // After all lit, launch rocket
        if (i === nodes.length - 1) {
          setTimeout(() => this._launchRocket(), 1000);
        }
      }, delay + i * 600);
    });
  },

  _launchRocket() {
    const rocket = document.getElementById('finale-rocket');
    if (rocket) {
      rocket.classList.add('launched');
      
      // Confetti
      setTimeout(() => {
        AnimationHelpers.createConfetti(document.body, 80);
      }, 500);

      // Show quote
      const quote = document.getElementById('finale-quote');
      if (quote) {
        setTimeout(() => {
          quote.style.opacity = '1';
          quote.style.animation = 'fadeUp 1s var(--ease-out)';
        }, 1500);
      }
    }
  },

  cleanup() {
    // Reset
    document.querySelectorAll('.chain-node').forEach(n => n.classList.remove('lit'));
    document.querySelectorAll('.chain-arrow').forEach(a => a.classList.remove('lit'));
    const rocket = document.getElementById('finale-rocket');
    if (rocket) rocket.classList.remove('launched');
  }
};
