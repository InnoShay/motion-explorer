/* ============================================
   MOTION EXPLORER — Screen 1: Understanding Motion
   ============================================ */

const Screen1Motion = {
  canvas: null,
  ctx: null,
  animId: null,
  objects: [],
  dragObj: null,
  dragOffset: { x: 0, y: 0 },
  motionDetected: false,
  quizAnswered: false,

  init() {
    this.canvas = document.getElementById('canvas-motion');
    if (!this.canvas) return;

    this.ctx = CanvasHelpers.setupCanvas(this.canvas, this.canvas.parentElement.clientWidth, 320);
    
    const w = this.canvas.parentElement.clientWidth;
    const h = 320;

    this.objects = [
      { type: 'car', x: w * 0.15, y: h * 0.55, origX: w * 0.15, origY: h * 0.55, size: 45, color: '#3b82f6', label: 'Car', moved: false },
      { type: 'person', x: w * 0.38, y: h * 0.5, origX: w * 0.38, origY: h * 0.5, size: 32, color: '#f59e0b', label: 'Athlete', moved: false },
      { type: 'bird', x: w * 0.6, y: h * 0.3, origX: w * 0.6, origY: h * 0.3, size: 22, color: '#a855f7', label: 'Bird', moved: false },
      { type: 'earth', x: w * 0.82, y: h * 0.4, origX: w * 0.82, origY: h * 0.4, size: 28, color: null, label: 'Earth', moved: false }
    ];

    this.motionDetected = false;
    this.dragObj = null;

    // Mouse events
    this.canvas.addEventListener('mousedown', this._onMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this._onMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this._onMouseUp.bind(this));
    this.canvas.addEventListener('mouseleave', this._onMouseUp.bind(this));

    // Touch events
    this.canvas.addEventListener('touchstart', this._onTouchStart.bind(this), { passive: false });
    this.canvas.addEventListener('touchmove', this._onTouchMove.bind(this), { passive: false });
    this.canvas.addEventListener('touchend', this._onMouseUp.bind(this));

    this._startAnimation();

    // Mark concepts
    Progress.learnConcept('motion');
    Progress.completeMission(0);
  },

  _startAnimation() {
    AnimationHelpers.cancel('screen1');
    AnimationHelpers.animate('screen1', () => {
      this._draw();
      return true;
    });
  },

  _draw() {
    if (!this.ctx || !this.canvas) return;
    const w = this.canvas.parentElement.clientWidth;
    const h = 320;

    CanvasHelpers.clear(this.ctx, this.canvas);

    // Background
    this.ctx.fillStyle = 'rgba(10, 22, 40, 0.5)';
    this.ctx.fillRect(0, 0, w, h);

    // Ground
    this.ctx.fillStyle = 'rgba(255,255,255,0.03)';
    this.ctx.fillRect(0, h * 0.7, w, h * 0.3);
    this.ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    this.ctx.beginPath();
    this.ctx.moveTo(0, h * 0.7);
    this.ctx.lineTo(w, h * 0.7);
    this.ctx.stroke();

    // Draw instruction
    this.ctx.fillStyle = 'rgba(255,255,255,0.3)';
    this.ctx.font = '13px Inter, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('👆 Drag any object to change its position', w / 2, 25);

    // Draw objects
    for (const obj of this.objects) {
      // Position before marker
      if (obj.moved) {
        CanvasHelpers.drawDot(this.ctx, obj.origX, obj.origY, 4, 'rgba(255,255,255,0.2)');
        this.ctx.fillStyle = 'rgba(255,255,255,0.15)';
        this.ctx.font = '10px Inter, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Before', obj.origX, obj.origY + 15);
        
        // Dashed line
        CanvasHelpers.drawDashedPath(this.ctx, [
          { x: obj.origX, y: obj.origY },
          { x: obj.x, y: obj.y }
        ], 'rgba(34, 211, 238, 0.3)', 1);
      }

      // Draw based on type
      switch (obj.type) {
        case 'car': CanvasHelpers.drawCar(this.ctx, obj.x, obj.y, obj.size, obj.color); break;
        case 'person': CanvasHelpers.drawPerson(this.ctx, obj.x, obj.y, obj.size, obj.color, false); break;
        case 'bird': CanvasHelpers.drawBird(this.ctx, obj.x, obj.y, obj.size, obj.color); break;
        case 'earth': CanvasHelpers.drawEarth(this.ctx, obj.x, obj.y, obj.size); break;
      }

      // Label
      this.ctx.fillStyle = 'rgba(255,255,255,0.6)';
      this.ctx.font = '12px Inter, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(obj.label, obj.x, obj.y + obj.size + 15);
    }
  },

  _getMousePos(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.parentElement.clientWidth / rect.width;
    const scaleY = 320 / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  },

  _hitTest(x, y) {
    for (const obj of this.objects) {
      const dx = x - obj.x;
      const dy = y - obj.y;
      if (Math.sqrt(dx*dx + dy*dy) < obj.size + 10) {
        return obj;
      }
    }
    return null;
  },

  _onMouseDown(e) {
    const pos = this._getMousePos(e);
    const hit = this._hitTest(pos.x, pos.y);
    if (hit) {
      this.dragObj = hit;
      this.dragOffset.x = pos.x - hit.x;
      this.dragOffset.y = pos.y - hit.y;
      this.canvas.style.cursor = 'grabbing';
    }
  },

  _onMouseMove(e) {
    const pos = this._getMousePos(e);
    if (this.dragObj) {
      this.dragObj.x = pos.x - this.dragOffset.x;
      this.dragObj.y = pos.y - this.dragOffset.y;
      
      const dx = this.dragObj.x - this.dragObj.origX;
      const dy = this.dragObj.y - this.dragObj.origY;
      if (Math.sqrt(dx*dx + dy*dy) > 20) {
        this.dragObj.moved = true;
        if (!this.motionDetected) {
          this.motionDetected = true;
          const overlay = document.getElementById('motion-detected');
          if (overlay) {
            overlay.classList.add('visible');
            setTimeout(() => overlay.classList.remove('visible'), 2000);
          }
        }
      }
    } else {
      const hit = this._hitTest(pos.x, pos.y);
      this.canvas.style.cursor = hit ? 'grab' : 'default';
    }
  },

  _onMouseUp() {
    this.dragObj = null;
    this.canvas.style.cursor = 'default';
  },

  _onTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    this._onMouseDown({ clientX: touch.clientX, clientY: touch.clientY });
  },

  _onTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    this._onMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
  },

  // Quiz handler
  handleQuiz(btn, correct) {
    if (this.quizAnswered) return;
    this.quizAnswered = true;

    const options = btn.parentElement.querySelectorAll('.btn-option');
    options.forEach(o => {
      if (o.dataset.correct === 'true') o.classList.add('correct');
      else if (o === btn && !correct) o.classList.add('incorrect');
    });

    const feedback = document.getElementById('quiz1-feedback');
    if (feedback) {
      feedback.classList.add('visible', correct ? 'correct' : 'incorrect');
      feedback.textContent = correct 
        ? '✅ Correct! Motion is detected when an object\'s position changes with time relative to a reference point.'
        : '❌ Not quite! All the objects shown can be in motion. Motion depends on the change in position.';
    }

    if (correct) {
      Nova.say("Excellent observation! 👏 You correctly identified that all objects can be in motion.", 4000);
    }
  },

  cleanup() {
    AnimationHelpers.cancel('screen1');
  }
};
