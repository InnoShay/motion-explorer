/* ============================================
   MOTION EXPLORER — Screen 4: Acceleration Lab
   ============================================ */

const Screen4Accel = {
  canvas: null,
  ctx: null,
  carX: 80,
  velocity: 0,
  acceleration: 0,
  maxVelocity: 100,
  mode: 'idle', // idle, accelerating, braking, constant
  quizAnswered: false,
  trail: [],

  init() {
    this.canvas = document.getElementById('canvas-accel');
    if (!this.canvas) return;

    const w = this.canvas.parentElement.clientWidth;
    this.ctx = CanvasHelpers.setupCanvas(this.canvas, w, 300);
    this.carX = 80;
    this.velocity = 0;
    this.acceleration = 0;
    this.mode = 'idle';
    this.trail = [];
    this.quizAnswered = false;

    this._startAnimation();

    Progress.learnConcept('acceleration');
    Progress.completeMission(3);
  },

  setMode(mode) {
    this.mode = mode;

    // Update buttons
    document.querySelectorAll('#screen-screen4 .accel-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    switch (mode) {
      case 'accelerate':
        this.acceleration = 2;
        break;
      case 'brake':
        this.acceleration = -3;
        break;
      case 'constant':
        this.acceleration = 0;
        if (this.velocity === 0) this.velocity = 40;
        break;
      case 'idle':
        this.acceleration = 0;
        break;
    }
  },

  _startAnimation() {
    AnimationHelpers.cancel('screen4');
    AnimationHelpers.animate('screen4', () => {
      this._update();
      this._draw();
      return true;
    });
  },

  _update() {
    const w = this.canvas.parentElement.clientWidth;
    
    // Update velocity
    this.velocity += this.acceleration * 0.05;
    this.velocity = Math.max(0, Math.min(this.velocity, this.maxVelocity));

    // If braking and stopped
    if (this.mode === 'brake' && this.velocity <= 0) {
      this.velocity = 0;
      this.acceleration = 0;
    }

    // Move car
    this.carX += this.velocity * 0.03;

    // Add trail
    if (this.velocity > 0 && this.trail.length < 200) {
      this.trail.push({ x: this.carX, y: 195, alpha: 0.5 });
    }

    // Fade trail
    this.trail = this.trail.filter(t => {
      t.alpha -= 0.005;
      return t.alpha > 0;
    });

    // Wrap
    if (this.carX > w + 80) {
      this.carX = -80;
      this.trail = [];
    }

    // Update dashboard
    this._updateDashboard();
  },

  _updateDashboard() {
    const initV = document.getElementById('init-vel');
    const finalV = document.getElementById('final-vel');
    const accelV = document.getElementById('accel-val');
    const accelType = document.getElementById('accel-type');

    if (initV) initV.textContent = Math.round(this.velocity - this.acceleration * 0.5);
    if (finalV) finalV.textContent = Math.round(this.velocity);
    if (accelV) accelV.textContent = this.acceleration.toFixed(1);
    
    if (accelType) {
      if (this.acceleration > 0) {
        accelType.textContent = '🟢 Positive';
        accelType.style.color = '#10b981';
      } else if (this.acceleration < 0) {
        accelType.textContent = '🔴 Negative';
        accelType.style.color = '#ef4444';
      } else {
        accelType.textContent = '⚪ Zero';
        accelType.style.color = '#94a3b8';
      }
    }
  },

  _draw() {
    if (!this.ctx || !this.canvas) return;
    const w = this.canvas.parentElement.clientWidth;
    const h = 300;

    CanvasHelpers.clear(this.ctx, this.canvas);

    // Background
    this.ctx.fillStyle = 'rgba(10, 22, 40, 0.5)';
    this.ctx.fillRect(0, 0, w, h);

    // Track
    this.ctx.fillStyle = 'rgba(255,255,255,0.03)';
    this.ctx.fillRect(0, h * 0.62, w, h * 0.12);

    // Track lines
    for (let i = 0; i < w; i += 40) {
      this.ctx.fillStyle = 'rgba(255,255,255,0.08)';
      this.ctx.fillRect(i, h * 0.68, 20, 2);
    }

    // Track borders
    this.ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    this.ctx.beginPath();
    this.ctx.moveTo(0, h * 0.62);
    this.ctx.lineTo(w, h * 0.62);
    this.ctx.moveTo(0, h * 0.74);
    this.ctx.lineTo(w, h * 0.74);
    this.ctx.stroke();

    // Trail / speed lines
    for (const t of this.trail) {
      this.ctx.fillStyle = `rgba(124, 58, 237, ${t.alpha * 0.3})`;
      this.ctx.fillRect(t.x - 2, t.y + 5, 4, 2);
    }

    // Draw car
    const carY = h * 0.65;
    CanvasHelpers.drawCar(this.ctx, this.carX, carY, 50, '#3b82f6');

    // Exhaust / flames when accelerating
    if (this.mode === 'accelerate' && this.velocity > 5) {
      const flameLen = 10 + Math.random() * 15;
      const grad = this.ctx.createLinearGradient(this.carX - 30, carY, this.carX - 30 - flameLen, carY);
      grad.addColorStop(0, 'rgba(251, 191, 36, 0.8)');
      grad.addColorStop(1, 'rgba(239, 68, 68, 0)');
      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.ellipse(this.carX - 28 - flameLen/2, carY, flameLen, 5 + Math.random() * 3, 0, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Brake lights when braking
    if (this.mode === 'brake' && this.velocity > 0) {
      this.ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
      this.ctx.beginPath();
      this.ctx.arc(this.carX - 25, carY - 5, 4, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Brake glow
      this.ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
      this.ctx.beginPath();
      this.ctx.arc(this.carX - 25, carY - 5, 15, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Velocity arrow
    if (this.velocity > 1) {
      const arrowLen = this.velocity * 0.8;
      CanvasHelpers.drawArrow(
        this.ctx,
        this.carX, carY - 35,
        this.carX + arrowLen, carY - 35,
        '#22d3ee', 2, 8
      );
      CanvasHelpers.drawLabel(this.ctx, `v = ${Math.round(this.velocity)} m/s`, this.carX + arrowLen / 2, carY - 50, 'rgba(0,0,0,0.5)', '#22d3ee', 11);
    }

    // Acceleration arrow
    if (this.acceleration !== 0) {
      const aLen = this.acceleration * 15;
      const aColor = this.acceleration > 0 ? '#10b981' : '#ef4444';
      CanvasHelpers.drawArrow(
        this.ctx,
        this.carX, carY + 25,
        this.carX + aLen, carY + 25,
        aColor, 2, 6
      );
      CanvasHelpers.drawLabel(this.ctx, `a = ${this.acceleration.toFixed(1)} m/s²`, this.carX + aLen / 2, carY + 40, 'rgba(0,0,0,0.5)', aColor, 10);
    }

    // Status text
    this.ctx.fillStyle = 'rgba(255,255,255,0.3)';
    this.ctx.font = '12px Inter, sans-serif';
    this.ctx.textAlign = 'center';
    
    let statusText = 'Press a button below to control the car';
    if (this.mode === 'accelerate') statusText = '🚀 Accelerating — Speed is increasing!';
    if (this.mode === 'brake') statusText = '🛑 Braking — Speed is decreasing!';
    if (this.mode === 'constant') statusText = '➡️ Constant velocity — No acceleration';
    if (this.mode === 'brake' && this.velocity === 0) statusText = '⏹ Stopped — Velocity is zero';
    
    this.ctx.fillText(statusText, w / 2, 25);
  },

  handleQuiz(btn, correct) {
    if (this.quizAnswered) return;
    this.quizAnswered = true;

    const options = btn.parentElement.querySelectorAll('.btn-option');
    options.forEach(o => {
      if (o.dataset.correct === 'true') o.classList.add('correct');
      else if (o === btn && !correct) o.classList.add('incorrect');
    });

    const feedback = document.getElementById('quiz4-feedback');
    if (feedback) {
      feedback.classList.add('visible', correct ? 'correct' : 'incorrect');
      feedback.textContent = correct
        ? '✅ Correct! When speed increases every second by the same amount, the object has constant positive acceleration.'
        : '❌ Think again! Increasing speed every second means the velocity is changing uniformly — that\'s constant acceleration!';
    }
  },

  cleanup() {
    AnimationHelpers.cancel('screen4');
  }
};
