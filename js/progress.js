/* ============================================
   MOTION EXPLORER — Progress Tracking
   ============================================ */

const Progress = {
  _state: {
    completedMissions: 0,
    totalMissions: 5,
    concepts: {
      motion: false,
      distance: false,
      displacement: false,
      speed: false,
      velocity: false,
      acceleration: false,
      graphs: false
    },
    challengeScore: 0,
    challengeTotal: 5
  },

  // ── Initialize ──
  init() {
    // Clear progress on hard refresh
    localStorage.removeItem('motionExplorer_progress');
    this.updateUI();
  },

  // ── Save to localStorage ──
  save() {
    localStorage.setItem('motionExplorer_progress', JSON.stringify(this._state));
  },

  // ── Complete a mission ──
  completeMission(screenIndex) {
    if (screenIndex + 1 > this._state.completedMissions) {
      this._state.completedMissions = screenIndex + 1;
      this.save();
      this.updateUI();
    }
  },

  // ── Mark concept as learned ──
  learnConcept(concept) {
    if (this._state.concepts.hasOwnProperty(concept)) {
      this._state.concepts[concept] = true;
      this.save();
      this.updateTrackerUI();
    }
  },

  // ── Set challenge score ──
  setChallengeScore(score, total) {
    this._state.challengeScore = score;
    this._state.challengeTotal = total;
    this.save();
  },

  // ── Get state ──
  getState() {
    return { ...this._state };
  },

  // ── Reset ──
  reset() {
    this._state = {
      completedMissions: 0,
      totalMissions: 5,
      concepts: {
        motion: false,
        distance: false,
        displacement: false,
        speed: false,
        velocity: false,
        acceleration: false,
        graphs: false
      },
      challengeScore: 0,
      challengeTotal: 5
    };
    this.save();
    this.updateUI();
  },

  // ── Update all UI ──
  updateUI() {
    this.updateProgressBar();
    this.updateTrackerUI();
  },

  // ── Update top navigation progress ──
  updateProgressBar() {
    const text = document.getElementById('progress-text');
    const fill = document.getElementById('progress-fill');
    
    if (text) {
      text.textContent = `${this._state.completedMissions}/${this._state.totalMissions} Missions Complete`;
    }
    if (fill) {
      const pct = (this._state.completedMissions / this._state.totalMissions) * 100;
      fill.style.width = pct + '%';
    }
  },

  // ── Update knowledge tracker sidebar ──
  updateTrackerUI() {
    const tracker = document.getElementById('knowledge-tracker');
    if (!tracker) return;
    
    const items = tracker.querySelectorAll('.tracker-item');
    items.forEach(item => {
      const concept = item.dataset.concept;
      if (concept && this._state.concepts[concept]) {
        item.classList.add('completed');
        const icon = item.querySelector('.tracker-icon');
        if (icon) icon.textContent = '✓';
      }
    });
  },

  // ── Get completion percentage ──
  getCompletionPercentage() {
    const total = Object.keys(this._state.concepts).length;
    const done = Object.values(this._state.concepts).filter(v => v).length;
    return Math.round((done / total) * 100);
  },

  // ── All missions done? ──
  isAllComplete() {
    return this._state.completedMissions >= this._state.totalMissions;
  }
};
