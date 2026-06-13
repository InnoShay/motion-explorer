/* ============================================
   MOTION EXPLORER — App Core (SPA Router)
   ============================================ */

const App = {
  currentScreen: null,
  screens: {},
  screenOrder: ['welcome', 'screen1', 'screen2', 'screen3', 'screen4', 'screen5', 'challenge', 'certificate', 'finale'],

  // ── Initialize ──
  init() {
    // Register all screens
    this.screens = {
      welcome: WelcomeScreen,
      screen1: Screen1Motion,
      screen2: Screen2Distance,
      screen3: Screen3Speed,
      screen4: Screen4Accel,
      screen5: Screen5Graphs,
      challenge: ChallengeScreen,
      certificate: CertificateScreen,
      finale: FinaleScreen
    };

    // Init subsystems
    Nova.init();
    Progress.init();

    // Show welcome screen
    this.navigateTo('welcome');
  },

  // ── Navigate to screen ──
  navigateTo(screenId) {
    if (this.currentScreen === screenId) return;

    // Stop voice if playing
    Voice.stop();

    // Exit current screen
    if (this.currentScreen && this.screens[this.currentScreen]) {
      const currentEl = document.getElementById(`screen-${this.currentScreen}`);
      const oldScreenId = this.currentScreen;
      
      if (currentEl) {
        currentEl.classList.add('exiting');
        setTimeout(() => {
          currentEl.classList.remove('active', 'exiting');
          if (this.screens[oldScreenId] && this.screens[oldScreenId].cleanup) {
            this.screens[oldScreenId].cleanup();
          }
        }, 400); // 400ms for exit animation
      }
    }

    // Enter new screen overlapping
    const newEl = document.getElementById(`screen-${screenId}`);
    if (newEl) {
      newEl.classList.add('active', 'entering');
      setTimeout(() => newEl.classList.remove('entering'), 400);
    }

    // Show/hide nav based on screen
    const nav = document.querySelector('.top-nav');
    const tracker = document.getElementById('knowledge-tracker');
    
    if (screenId === 'welcome') {
      if (nav) nav.classList.add('hidden-nav');
      if (tracker) tracker.style.display = 'none';
      Nova.hideSystem();
    } else {
      if (nav) nav.classList.remove('hidden-nav');
      if (tracker) tracker.style.display = 'flex';
      Nova.show();
    }

    // Init the screen
    if (this.screens[screenId] && this.screens[screenId].init) {
      this.screens[screenId].init();
    }

    // NOVA greet
    const novaKey = screenId.replace('screen', '');
    const greetMap = {
      '1': 'motion', '2': 'distance', '3': 'speed',
      '4': 'acceleration', '5': 'graphs',
      'challenge': 'challenge', 'certificate': 'certificate', 
      'finale': 'finale', 'welcome': 'welcome'
    };
    Nova.greet(greetMap[novaKey] || screenId);

    this.currentScreen = screenId;
    
    // Scroll to top instantly to prevent layout jump bugs
    window.scrollTo(0, 0);
  },

  // ── Navigate to next screen ──
  next() {
    const idx = this.screenOrder.indexOf(this.currentScreen);
    if (idx < this.screenOrder.length - 1) {
      this.navigateTo(this.screenOrder[idx + 1]);
    }
  },

  // ── Navigate to previous screen ──
  prev() {
    const idx = this.screenOrder.indexOf(this.currentScreen);
    if (idx > 0) {
      this.navigateTo(this.screenOrder[idx - 1]);
    }
  },

  // ── Get current screen index ──
  getCurrentIndex() {
    return this.screenOrder.indexOf(this.currentScreen);
  }
};

// ── Start the app ──
// App.init() is now called by js/loader.js after the boot sequence completes
document.addEventListener('DOMContentLoaded', () => {
  // Initialization handled by BootLoader
});
