/* ============================================
   MOTION EXPLORER — Screen 5: Distance-Time Graphs
   ============================================ */

const Screen5Graphs = {
  canvas: null,
  ctx: null,
  scenario: null,
  animProgress: 0,
  animating: false,
  quizAnswered: false,
  predictMode: false,
  prediction: null,
  graphData: [],

  scenarios: {
    rest: {
      label: 'Standing Still',
      emoji: '🧍',
      description: 'Object at rest — no change in position',
      generate: (t) => 50, // constant position
      lineType: 'Horizontal line = Object at rest',
      speed: '0 m/s'
    },
    uniform: {
      label: 'Walking Steadily',
      emoji: '🚶',
      description: 'Uniform motion — equal distances in equal time',
      generate: (t) => 20 + t * 30, // linear
      lineType: 'Straight line = Constant velocity',
      speed: '30 m/s'
    },
    accelerating: {
      label: 'Running Faster',
      emoji: '🏃',
      description: 'Accelerating — speed increases over time',
      generate: (t) => 10 + t * t * 25, // quadratic
      lineType: 'Curved line = Changing velocity (acceleration)',
      speed: 'Increasing'
    }
  },

  init() {
    this.canvas = document.getElementById('canvas-graphs');
    if (!this.canvas) return;

    const w = this.canvas.parentElement.clientWidth;
    this.ctx = CanvasHelpers.setupCanvas(this.canvas, w, 350);
    this.scenario = null;
    this.animProgress = 0;
    this.graphData = [];
    this.predictMode = false;
    this.prediction = null;
    this.quizAnswered = false;

    this._draw();

    Progress.learnConcept('graphs');
    Progress.completeMission(4);
  },

  selectScenario(key) {
    this.scenario = key;
    this.animProgress = 0;
    this.animating = true;
    this.graphData = [];

    // Update buttons
    document.querySelectorAll('#screen-screen5 .scenario-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.scenario === key);
    });

    // Update info
    const info = this.scenarios[key];
    const descEl = document.getElementById('graph-description');
    const lineEl = document.getElementById('graph-linetype');
    if (descEl) descEl.textContent = info.description;
    if (lineEl) lineEl.textContent = info.lineType;

    // Generate graph data
    for (let t = 0; t <= 1; t += 0.02) {
      this.graphData.push({
        t: t,
        d: info.generate(t)
      });
    }

    // Animate
    AnimationHelpers.cancel('screen5-graph');
    AnimationHelpers.animate('screen5-graph', (progress) => {
      this.animProgress = AnimationHelpers.easeOutCubic(progress);
      this._draw();
      if (progress >= 1) {
        this.animating = false;
        Nova.say(info.lineType + " — Can you see the pattern?", 5000);
      }
      return true;
    }, 3000);
  },

  _draw() {
    if (!this.ctx || !this.canvas) return;
    const w = this.canvas.parentElement.clientWidth;
    const h = 350;

    CanvasHelpers.clear(this.ctx, this.canvas);

    // Background
    this.ctx.fillStyle = 'rgba(10, 22, 40, 0.5)';
    this.ctx.fillRect(0, 0, w, h);

    // Graph area
    const margin = { top: 40, right: 40, bottom: 50, left: 60 };
    const gw = w - margin.left - margin.right;
    const gh = h - margin.top - margin.bottom;

    // Grid
    CanvasHelpers.drawGrid(this.ctx, margin.left, margin.top, gw, gh, 6, 6);

    // Axes
    CanvasHelpers.drawAxes(this.ctx, margin.left, margin.top, gw, gh, 'Time (s)', 'Distance (m)');

    // Tick marks
    this.ctx.fillStyle = 'rgba(255,255,255,0.3)';
    this.ctx.font = '10px Inter, sans-serif';
    this.ctx.textAlign = 'center';
    for (let i = 0; i <= 6; i++) {
      const x = margin.left + (gw / 6) * i;
      this.ctx.fillText(i, x, h - margin.bottom + 15);
      
      // Y axis ticks
      const y = margin.top + gh - (gh / 6) * i;
      this.ctx.textAlign = 'right';
      this.ctx.fillText(Math.round(i * 50/3), margin.left - 8, y + 4);
      this.ctx.textAlign = 'center';
    }

    // Draw graph line
    if (this.scenario && this.graphData.length > 0) {
      const numPoints = Math.floor(this.graphData.length * this.animProgress);
      
      if (numPoints >= 2) {
        this.ctx.strokeStyle = this.scenario === 'rest' ? '#f59e0b' : 
                               this.scenario === 'uniform' ? '#10b981' : '#a855f7';
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.beginPath();

        for (let i = 0; i < numPoints; i++) {
          const px = margin.left + this.graphData[i].t * gw;
          const py = margin.top + gh - (this.graphData[i].d / 100) * gh;
          
          if (i === 0) this.ctx.moveTo(px, py);
          else this.ctx.lineTo(px, py);
        }
        this.ctx.stroke();

        // Glow effect
        this.ctx.strokeStyle = this.scenario === 'rest' ? 'rgba(245,158,11,0.2)' : 
                               this.scenario === 'uniform' ? 'rgba(16,185,129,0.2)' : 'rgba(168,85,247,0.2)';
        this.ctx.lineWidth = 8;
        this.ctx.stroke();

        // Moving dot
        if (this.animating && numPoints > 0) {
          const last = this.graphData[numPoints - 1];
          const dotX = margin.left + last.t * gw;
          const dotY = margin.top + gh - (last.d / 100) * gh;
          
          this.ctx.fillStyle = '#22d3ee';
          this.ctx.beginPath();
          this.ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
          this.ctx.fill();
          
          this.ctx.fillStyle = 'rgba(34, 211, 238, 0.2)';
          this.ctx.beginPath();
          this.ctx.arc(dotX, dotY, 12, 0, Math.PI * 2);
          this.ctx.fill();
        }

        // Line type annotation
        if (!this.animating) {
          const info = this.scenarios[this.scenario];
          this.ctx.fillStyle = 'rgba(255,255,255,0.6)';
          this.ctx.font = '12px Inter, sans-serif';
          this.ctx.textAlign = 'left';
          
          if (this.scenario === 'rest') {
            this.ctx.fillText('← Horizontal line: Object at rest', margin.left + gw * 0.4, margin.top + gh - (50/100) * gh - 10);
          } else if (this.scenario === 'uniform') {
            this.ctx.fillText('Straight line: Constant speed →', margin.left + gw * 0.3, margin.top + gh * 0.3);
          } else {
            this.ctx.fillText('Curve: Speed is increasing →', margin.left + gw * 0.15, margin.top + gh * 0.3);
          }
        }
      }

      // Aryan animation along bottom
      if (this.animating) {
        const personX = margin.left + this.animProgress * gw * 0.8;
        const personY = h - 15;
        this.ctx.font = '18px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.scenarios[this.scenario].emoji, personX, personY);
      }
    }

    // Empty state
    if (!this.scenario) {
      this.ctx.fillStyle = 'rgba(255,255,255,0.3)';
      this.ctx.font = '14px Inter, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Select a scenario below to see the graph', w / 2, h / 2);
    }
  },

  handleQuiz(btn, correct) {
    if (this.quizAnswered) return;
    this.quizAnswered = true;

    const options = btn.parentElement.querySelectorAll('.btn-option');
    options.forEach(o => {
      if (o.dataset.correct === 'true') o.classList.add('correct');
      else if (o === btn && !correct) o.classList.add('incorrect');
    });

    const feedback = document.getElementById('quiz5-feedback');
    if (feedback) {
      feedback.classList.add('visible', correct ? 'correct' : 'incorrect');
      feedback.textContent = correct
        ? '✅ Correct! A straight line with a positive slope indicates constant speed. The steeper the line, the faster the motion.'
        : '❌ Not quite! For constant speed, the graph is a straight line going upward. A horizontal line would mean no motion at all.';
    }
  },

  cleanup() {
    AnimationHelpers.cancel('screen5-graph');
  }
};
