/* ============================================
   MOTION EXPLORER — Screen 3: Speed & Velocity
   ============================================ */

const Screen3Speed = {
  canvas: null,
  ctx: null,
  selectedVehicle: 'car',
  speed: 30,
  direction: 1, // 1 = right, -1 = left
  vehicleX: 50,
  quizAnswered: false,

  vehicles: {
    bicycle: { maxSpeed: 25, emoji: '🚲', color: '#10b981', size: 35 },
    car: { maxSpeed: 80, emoji: '🚗', color: '#3b82f6', size: 45 },
    train: { maxSpeed: 120, emoji: '🚂', color: '#ef4444', size: 55 }
  },

  init() {
    this.canvas = document.getElementById('canvas-speed');
    if (!this.canvas) return;

    const w = this.canvas.parentElement.clientWidth;
    this.ctx = CanvasHelpers.setupCanvas(this.canvas, w, 280);
    this.vehicleX = 80;
    this.speed = 30;
    this.direction = 1;
    this.quizAnswered = false;

    // Slider
    const slider = document.getElementById('speed-slider');
    if (slider) {
      slider.value = this.speed;
      slider.addEventListener('input', (e) => {
        this.speed = parseInt(e.target.value);
        this._updateSpeedDisplay();
      });
    }

    // Vehicle buttons
    document.querySelectorAll('#screen-screen3 .vehicle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedVehicle = btn.dataset.vehicle;
        document.querySelectorAll('#screen-screen3 .vehicle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Direction button
    const dirBtn = document.getElementById('dir-toggle');
    if (dirBtn) {
      dirBtn.addEventListener('click', () => {
        this.direction *= -1;
        dirBtn.textContent = this.direction > 0 ? '→ Moving Right' : '← Moving Left';
        this._updateVelocityDisplay();
      });
    }

    this._updateSpeedDisplay();
    this._startAnimation();

    Progress.learnConcept('speed');
    Progress.learnConcept('velocity');
    Progress.completeMission(2);
  },

  _startAnimation() {
    AnimationHelpers.cancel('screen3');
    AnimationHelpers.animate('screen3', (_, elapsed) => {
      this._update(elapsed);
      this._draw();
      return true;
    });
  },

  _update(elapsed) {
    const w = this.canvas.parentElement.clientWidth;
    const speedFactor = this.speed / 50;
    this.vehicleX += speedFactor * 1.5 * this.direction;

    // Wrap around
    if (this.vehicleX > w + 60) this.vehicleX = -60;
    if (this.vehicleX < -60) this.vehicleX = w + 60;
  },

  _draw() {
    if (!this.ctx || !this.canvas) return;
    const w = this.canvas.parentElement.clientWidth;
    const h = 280;

    CanvasHelpers.clear(this.ctx, this.canvas);

    // Background
    this.ctx.fillStyle = 'rgba(10, 22, 40, 0.5)';
    this.ctx.fillRect(0, 0, w, h);

    // Road
    this.ctx.fillStyle = 'rgba(255,255,255,0.04)';
    this.ctx.fillRect(0, h * 0.55, w, h * 0.15);
    
    // Road lines
    this.ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    this.ctx.setLineDash([20, 15]);
    this.ctx.beginPath();
    this.ctx.moveTo(0, h * 0.625);
    this.ctx.lineTo(w, h * 0.625);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Draw vehicle
    const veh = this.vehicles[this.selectedVehicle];
    const vy = h * 0.58;

    switch (this.selectedVehicle) {
      case 'car':
        CanvasHelpers.drawCar(this.ctx, this.vehicleX, vy, veh.size, veh.color, this.direction);
        break;
      case 'bicycle':
        CanvasHelpers.drawBicycle(this.ctx, this.vehicleX, vy, veh.size, veh.color);
        break;
      case 'train':
        CanvasHelpers.drawTrain(this.ctx, this.vehicleX, vy, veh.size, veh.color);
        break;
    }

    // Velocity arrow
    if (this.speed > 0) {
      const arrowLen = Math.min(this.speed * 1.5, 120);
      CanvasHelpers.drawArrow(
        this.ctx,
        this.vehicleX, vy - veh.size/2 - 15,
        this.vehicleX + arrowLen * this.direction, vy - veh.size/2 - 15,
        '#22d3ee', 2, 8
      );
      
      CanvasHelpers.drawLabel(
        this.ctx,
        `v = ${this.speed * this.direction > 0 ? '+' : ''}${this.speed * this.direction} km/h ${this.direction > 0 ? '→' : '←'}`,
        this.vehicleX + (arrowLen * this.direction) / 2,
        vy - veh.size/2 - 32,
        'rgba(34, 211, 238, 0.15)', '#22d3ee', 11
      );
    }

    // Speed indicator (small speedometer)
    CanvasHelpers.drawSpeedometer(this.ctx, w - 70, 70, 50, this.speed, 100);

    // Direction indicator
    this.ctx.fillStyle = 'rgba(255,255,255,0.2)';
    this.ctx.font = '11px Inter, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`Direction: ${this.direction > 0 ? 'Right →' : '← Left'}`, w/2, h - 15);
  },

  _updateSpeedDisplay() {
    const valEl = document.getElementById('speed-val');
    if (valEl) valEl.textContent = this.speed + ' km/h';
    this._updateVelocityDisplay();
  },

  _updateVelocityDisplay() {
    const speedNum = document.getElementById('speed-num');
    const velNum = document.getElementById('vel-num');
    if (speedNum) speedNum.textContent = this.speed;
    if (velNum) velNum.textContent = (this.speed * this.direction > 0 ? '+' : '') + (this.speed * this.direction) + ' ' + (this.direction > 0 ? '→' : '←');
  },

  handleQuiz(btn, correct) {
    if (this.quizAnswered) return;
    this.quizAnswered = true;

    const options = btn.parentElement.querySelectorAll('.btn-option');
    options.forEach(o => {
      if (o.dataset.correct === 'true') o.classList.add('correct');
      else if (o === btn && !correct) o.classList.add('incorrect');
    });

    const feedback = document.getElementById('quiz3-feedback');
    if (feedback) {
      feedback.classList.add('visible', correct ? 'correct' : 'incorrect');
      feedback.textContent = correct
        ? '✅ Yes! Two objects moving at the same speed but in different directions have different velocities.'
        : '❌ Actually, yes they can! Velocity includes direction, so same speed in different directions = different velocities.';
    }
  },

  cleanup() {
    AnimationHelpers.cancel('screen3');
  }
};
