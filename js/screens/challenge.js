/* ============================================
   MOTION EXPLORER — Final Mission Challenge
   ============================================ */

const ChallengeScreen = {
  currentQ: 0,
  score: 0,
  answered: [],
  showingResults: false,

  questions: [
    {
      question: "An object is said to be in motion when its ______ changes with time.",
      options: ["Shape", "Position", "Color", "Size"],
      correct: 1,
      explanation: "Motion is defined as the change in position of an object with respect to time and a reference point."
    },
    {
      question: "A girl walks 4 km towards North and then 3 km towards East. What is her displacement?",
      options: ["7 km", "1 km", "5 km", "12 km"],
      correct: 2,
      explanation: "Using Pythagoras theorem: displacement = √(4² + 3²) = √(16 + 9) = √25 = 5 km."
    },
    {
      question: "Two cars are moving at 60 km/h. Car A goes North and Car B goes South. Which statement is true?",
      options: ["Same speed, same velocity", "Same speed, different velocity", "Different speed, same velocity", "Different speed, different velocity"],
      correct: 1,
      explanation: "Both cars have the same speed (60 km/h) but different velocities because velocity includes direction!"
    },
    {
      question: "A car increases its speed from 20 m/s to 40 m/s in 5 seconds. What is the acceleration?",
      options: ["2 m/s²", "4 m/s²", "8 m/s²", "10 m/s²"],
      correct: 1,
      explanation: "Acceleration = (Final velocity - Initial velocity) / Time = (40 - 20) / 5 = 20/5 = 4 m/s²."
    },
    {
      question: "In a distance-time graph, a horizontal line indicates that the object is:",
      options: ["Moving with constant speed", "At rest", "Accelerating", "Decelerating"],
      correct: 1,
      explanation: "A horizontal line means the distance is not changing with time — the object is at rest (not moving)."
    }
  ],

  init() {
    this.currentQ = 0;
    this.score = 0;
    this.answered = [];
    this.showingResults = false;
    this._renderQuestion();
  },

  _renderQuestion() {
    const container = document.getElementById('challenge-content');
    if (!container) return;

    if (this.currentQ >= this.questions.length) {
      this._showResults();
      return;
    }

    const q = this.questions[this.currentQ];

    // Update progress dots
    const dots = document.querySelectorAll('.challenge-dot');
    dots.forEach((dot, i) => {
      dot.classList.remove('active');
      if (i < this.answered.length) {
        dot.classList.add(this.answered[i] ? 'correct' : 'incorrect');
      }
      if (i === this.currentQ) dot.classList.add('active');
    });

    container.innerHTML = `
      <div class="challenge-question-card">
        <div class="challenge-q-number">Question ${this.currentQ + 1} of ${this.questions.length}</div>
        <div class="challenge-q-text">${q.question}</div>
        <div class="quiz-options" id="challenge-options">
          ${q.options.map((opt, i) => `
            <button class="btn-option" data-index="${i}" onclick="ChallengeScreen.answer(${i})">
              ${String.fromCharCode(65 + i)}. ${opt}
            </button>
          `).join('')}
        </div>
        <div class="quiz-feedback" id="challenge-feedback"></div>
      </div>
    `;
  },

  answer(index) {
    if (this.answered.length > this.currentQ) return; // Already answered

    const q = this.questions[this.currentQ];
    const correct = index === q.correct;
    
    if (correct) this.score++;
    this.answered.push(correct);

    // Update option styles
    const options = document.querySelectorAll('#challenge-options .btn-option');
    options.forEach((opt, i) => {
      if (i === q.correct) opt.classList.add('correct');
      else if (i === index && !correct) opt.classList.add('incorrect');
    });

    // Show feedback
    const feedback = document.getElementById('challenge-feedback');
    if (feedback) {
      feedback.classList.add('visible', correct ? 'correct' : 'incorrect');
      feedback.innerHTML = `${correct ? '✅' : '❌'} ${q.explanation}`;
    }

    // Update dots
    const dots = document.querySelectorAll('.challenge-dot');
    if (dots[this.currentQ]) {
      dots[this.currentQ].classList.add(correct ? 'correct' : 'incorrect');
    }

    // NOVA
    if (correct) {
      Nova.say("Excellent work! 🎉 You really understand this concept!", 3000);
    } else {
      Nova.say("Don't worry! Learning from mistakes is part of the process. 💪", 3000);
    }

    // Auto-advance after delay
    setTimeout(() => {
      this.currentQ++;
      this._renderQuestion();
    }, 2500);
  },

  _showResults() {
    this.showingResults = true;
    Progress.setChallengeScore(this.score, this.questions.length);

    const container = document.getElementById('challenge-content');
    if (!container) return;

    const pct = (this.score / this.questions.length) * 100;
    const circumference = 2 * Math.PI * 75;
    const offset = circumference - (pct / 100) * circumference;

    let mastery = 'Beginner';
    let masteryEmoji = '🌱';
    if (pct >= 80) { mastery = 'Motion Master'; masteryEmoji = '🏆'; }
    else if (pct >= 60) { mastery = 'Motion Explorer'; masteryEmoji = '🌟'; }
    else if (pct >= 40) { mastery = 'Motion Learner'; masteryEmoji = '📚'; }

    container.innerHTML = `
      <div class="results-container" style="animation: fadeUp 0.8s var(--ease-out)">
        <h2 style="margin-bottom: var(--space-2)">Mission Complete!</h2>
        <p style="margin-bottom: var(--space-8)">Here's how you performed</p>
        
        <div class="score-ring">
          <svg viewBox="0 0 170 170">
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#7c3aed"/>
                <stop offset="100%" style="stop-color:#22d3ee"/>
              </linearGradient>
            </defs>
            <circle class="ring-bg" cx="85" cy="85" r="75"/>
            <circle class="ring-fill" cx="85" cy="85" r="75"
              stroke-dasharray="${circumference}"
              stroke-dashoffset="${offset}"/>
          </svg>
          <div class="score-text">
            <div class="score-number">${this.score}/${this.questions.length}</div>
            <div class="score-label">Score</div>
          </div>
        </div>

        <h3 style="margin-bottom: var(--space-2)">${masteryEmoji} ${mastery}</h3>
        <p style="margin-bottom: var(--space-6); color: var(--color-text-muted)">
          ${pct >= 80 ? 'Outstanding! You truly understand Motion!' : 
            pct >= 60 ? 'Great job! You have a solid understanding.' : 
            'Keep learning! Every experiment brings you closer.'}
        </p>

        <div class="mastery-grid">
          <div class="mastery-item">
            <div class="mastery-emoji">🎯</div>
            <div class="mastery-label">Accuracy<br><strong>${pct}%</strong></div>
          </div>
          <div class="mastery-item">
            <div class="mastery-emoji">⚡</div>
            <div class="mastery-label">Concepts<br><strong>${this.score}/5</strong></div>
          </div>
          <div class="mastery-item">
            <div class="mastery-emoji">🏅</div>
            <div class="mastery-label">Rank<br><strong>${mastery}</strong></div>
          </div>
        </div>

        <button class="btn btn-primary" onclick="App.next()" style="margin-top: var(--space-4)">
          🎓 Claim Your Certificate →
        </button>
      </div>
    `;

    // Confetti for good scores
    if (pct >= 60) {
      AnimationHelpers.createConfetti(document.body, 60);
    }
  },

  cleanup() {
    // Nothing
  }
};
