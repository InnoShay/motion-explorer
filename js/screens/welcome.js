/* ============================================
   MOTION EXPLORER — Welcome Screen
   ============================================ */

const WelcomeScreen = {
  init() {
    const bg = document.querySelector('.welcome-bg .bg-stars');
    if (bg && bg.children.length === 0) {
      AnimationHelpers.generateStars(bg, 100);
    }
  },

  cleanup() {
    // Nothing to clean
  }
};
