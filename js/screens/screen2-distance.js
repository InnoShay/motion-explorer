/* ============================================
   MOTION EXPLORER — Screen 2: Distance vs Displacement
   ============================================ */

const Screen2Distance = {
  canvas: null,
  ctx: null,
  selectedRoute: null,
  animProgress: 0,
  animating: false,
  quizAnswered: false,

  // Route definitions
  routes: {
    curved: {
      points: [],
      color: '#a855f7',
      label: 'Curved Route',
      distance: 520
    },
    zigzag: {
      points: [],
      color: '#f59e0b',
      label: 'Zigzag Route',
      distance: 480
    },
    straight: {
      points: [],
      color: '#10b981',
      label: 'Straight Route',
      distance: 350
    }
  },

  homePos: { x: 80, y: 250 },
  schoolPos: { x: 0, y: 100 },

  init() {
    this.canvas = document.getElementById('canvas-distance');
    if (!this.canvas) return;

    const w = this.canvas.parentElement.clientWidth;
    this.schoolPos.x = w - 80;
    
    this.ctx = CanvasHelpers.setupCanvas(this.canvas, w, 320);
    
    this._generateRoutes(w);
    this.selectedRoute = null;
    this.animProgress = 0;
    this.quizAnswered = false;
    this._draw();

    Progress.learnConcept('distance');
    Progress.learnConcept('displacement');
    Progress.completeMission(1);
  },

  _generateRoutes(w) {
    const h = this.homePos;
    const s = this.schoolPos;

    // Curved route (goes down then up)
    this.routes.curved.points = [
      h,
      { x: h.x + 60, y: 280 },
      { x: w * 0.3, y: 290 },
      { x: w * 0.45, y: 260 },
      { x: w * 0.55, y: 200 },
      { x: w * 0.65, y: 150 },
      { x: w * 0.78, y: 120 },
      s
    ];

    // Zigzag route
    this.routes.zigzag.points = [
      h,
      { x: h.x + 80, y: 200 },
      { x: w * 0.3, y: 270 },
      { x: w * 0.4, y: 150 },
      { x: w * 0.55, y: 240 },
      { x: w * 0.65, y: 130 },
      { x: w * 0.8, y: 160 },
      s
    ];

    // Straight route
    this.routes.straight.points = [h, s];
    this.routes.straight.distance = Math.round(Math.sqrt(
      Math.pow(s.x - h.x, 2) + Math.pow(s.y - h.y, 2)
    ));
  },

  selectRoute(routeKey) {
    this.selectedRoute = routeKey;
    this.animProgress = 0;
    this.animating = true;

    // Update button states
    document.querySelectorAll('#screen-screen2 .route-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.route === routeKey);
    });

    // Animate
    AnimationHelpers.cancel('screen2-route');
    AnimationHelpers.animate('screen2-route', (progress) => {
      this.animProgress = AnimationHelpers.easeInOutCubic(progress);
      this._draw();
      if (progress >= 1) {
        this.animating = false;
        this._updateValues();
      }
      return true;
    }, 2000);
  },

  _updateValues() {
    const route = this.routes[this.selectedRoute];
    if (!route) return;

    const distEl = document.getElementById('dist-value');
    const dispEl = document.getElementById('disp-value');
    
    // Calculate actual displacement (straight-line distance)
    const displacement = Math.round(Math.sqrt(
      Math.pow(this.schoolPos.x - this.homePos.x, 2) + 
      Math.pow(this.schoolPos.y - this.homePos.y, 2)
    ));

    if (distEl) AnimationHelpers.countUp(distEl, 0, route.distance, 800, ' m');
    if (dispEl) AnimationHelpers.countUp(dispEl, 0, displacement, 800, ' m');
  },

  _draw() {
    if (!this.ctx || !this.canvas) return;
    const w = this.canvas.parentElement.clientWidth;
    const h = 320;

    CanvasHelpers.clear(this.ctx, this.canvas);

    // Background
    this.ctx.fillStyle = 'rgba(10, 22, 40, 0.5)';
    this.ctx.fillRect(0, 0, w, h);

    // Grid
    CanvasHelpers.drawGrid(this.ctx, 0, 0, w, h, 10, 8);

    // Draw all routes faintly
    for (const [key, route] of Object.entries(this.routes)) {
      if (key !== this.selectedRoute) {
        CanvasHelpers.drawDashedPath(this.ctx, route.points, 'rgba(255,255,255,0.06)', 1);
      }
    }

    // Draw selected route
    if (this.selectedRoute) {
      const route = this.routes[this.selectedRoute];
      CanvasHelpers.drawSmoothPath(this.ctx, route.points, route.color, 3, this.animProgress);

      // Displacement arrow
      if (this.animProgress > 0.5) {
        const alpha = Math.min((this.animProgress - 0.5) * 2, 1);
        CanvasHelpers.drawArrow(
          this.ctx,
          this.homePos.x, this.homePos.y,
          this.schoolPos.x, this.schoolPos.y,
          `rgba(34, 211, 238, ${alpha * 0.8})`, 2, 10
        );
        
        // Displacement label
        const midX = (this.homePos.x + this.schoolPos.x) / 2;
        const midY = (this.homePos.y + this.schoolPos.y) / 2 - 15;
        this.ctx.globalAlpha = alpha;
        CanvasHelpers.drawLabel(this.ctx, 'Displacement', midX, midY, 'rgba(34, 211, 238, 0.2)', '#22d3ee', 11);
        this.ctx.globalAlpha = 1;
      }

      // Moving dot on path
      if (this.animating) {
        const pts = route.points;
        const totalPts = pts.length - 1;
        const idx = Math.min(Math.floor(this.animProgress * totalPts), totalPts - 1);
        const localT = (this.animProgress * totalPts) - idx;
        const px = AnimationHelpers.lerp(pts[idx].x, pts[idx + 1].x, localT);
        const py = AnimationHelpers.lerp(pts[idx].y, pts[idx + 1].y, localT);
        
        // Aryan dot
        CanvasHelpers.drawDot(this.ctx, px, py, 6, route.color, '🧑');
      }
    }

    // Draw home and school
    CanvasHelpers.drawHouse(this.ctx, this.homePos.x, this.homePos.y, 25, 'Home 🏠');
    CanvasHelpers.drawSchool(this.ctx, this.schoolPos.x, this.schoolPos.y, 28, 'School 🏫');

    // Instruction
    if (!this.selectedRoute) {
      this.ctx.fillStyle = 'rgba(255,255,255,0.3)';
      this.ctx.font = '13px Inter, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('👆 Select a route below to see Aryan\'s journey', w / 2, 25);
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

    const feedback = document.getElementById('quiz2-feedback');
    if (feedback) {
      feedback.classList.add('visible', correct ? 'correct' : 'incorrect');
      feedback.textContent = correct
        ? '✅ Correct! Displacement always represents the shortest straight-line distance between start and end points.'
        : '❌ Not quite! Displacement is always the shortest path — the straight-line distance between two points.';
    }
  },

  cleanup() {
    AnimationHelpers.cancel('screen2-route');
  }
};
