/* ============================================
   MOTION EXPLORER — Canvas Drawing Helpers
   ============================================ */

const CanvasHelpers = {
  // ── Clear canvas ──
  clear(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  },

  // ── Draw car ──
  drawCar(ctx, x, y, size = 40, color = '#3b82f6', direction = 1) {
    ctx.save();
    ctx.translate(x, y);
    if (direction < 0) ctx.scale(-1, 1);
    
    // Body
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(-size/2, -size/4, size, size/3, 4);
    ctx.fill();
    
    // Top
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(-size/3, -size/2, size * 0.55, size/4 + 2, [6, 6, 0, 0]);
    ctx.fill();
    
    // Windows
    ctx.fillStyle = 'rgba(34, 211, 238, 0.4)';
    ctx.fillRect(-size/3.5, -size/2 + 3, size/5, size/5);
    ctx.fillRect(-size/3.5 + size/4, -size/2 + 3, size/5, size/5);
    
    // Wheels
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(-size/3.5, size/12 + 2, size/8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size/4, size/12 + 2, size/8, 0, Math.PI * 2);
    ctx.fill();
    
    // Headlight
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(size/2 - 2, -size/8, 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  },

  // ── Draw bicycle ──
  drawBicycle(ctx, x, y, size = 35, color = '#10b981') {
    ctx.save();
    ctx.translate(x, y);
    
    // Wheels
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    const wheelR = size / 4;
    ctx.beginPath();
    ctx.arc(-size/3, 0, wheelR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(size/3, 0, wheelR, 0, Math.PI * 2);
    ctx.stroke();
    
    // Frame
    ctx.beginPath();
    ctx.moveTo(-size/3, 0);
    ctx.lineTo(0, -size/3);
    ctx.lineTo(size/3, 0);
    ctx.moveTo(0, -size/3);
    ctx.lineTo(-size/6, -size/2.5);
    ctx.moveTo(size/3, 0);
    ctx.lineTo(size/5, -size/3);
    ctx.stroke();
    
    // Rider head
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(0, -size/2, size/8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  },

  // ── Draw person/athlete ──
  drawPerson(ctx, x, y, size = 30, color = '#f59e0b', running = false) {
    ctx.save();
    ctx.translate(x, y);
    
    // Head
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, -size/1.5, size/6, 0, Math.PI * 2);
    ctx.fill();
    
    // Body
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, -size/2);
    ctx.lineTo(0, size/6);
    ctx.stroke();
    
    // Arms
    const armAngle = running ? Math.sin(Date.now() / 150) * 0.4 : 0.3;
    ctx.beginPath();
    ctx.moveTo(0, -size/3);
    ctx.lineTo(-size/3, -size/5 + Math.sin(armAngle) * 5);
    ctx.moveTo(0, -size/3);
    ctx.lineTo(size/3, -size/5 - Math.sin(armAngle) * 5);
    ctx.stroke();
    
    // Legs
    const legAngle = running ? Math.sin(Date.now() / 150) * 0.5 : 0.2;
    ctx.beginPath();
    ctx.moveTo(0, size/6);
    ctx.lineTo(-size/4 + Math.sin(legAngle) * 8, size/2);
    ctx.moveTo(0, size/6);
    ctx.lineTo(size/4 - Math.sin(legAngle) * 8, size/2);
    ctx.stroke();
    
    ctx.restore();
  },

  // ── Draw bird ──
  drawBird(ctx, x, y, size = 20, color = '#a855f7') {
    ctx.save();
    ctx.translate(x, y);
    
    const wingAngle = Math.sin(Date.now() / 200) * 0.3;
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    
    // Wings
    ctx.beginPath();
    ctx.moveTo(-size/2, wingAngle * size/3);
    ctx.quadraticCurveTo(-size/4, -size/3 + wingAngle * size/2, 0, 0);
    ctx.quadraticCurveTo(size/4, -size/3 + wingAngle * size/2, size/2, wingAngle * size/3);
    ctx.stroke();
    
    // Body
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, size/8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  },

  // ── Draw Earth ──
  drawEarth(ctx, x, y, size = 30) {
    ctx.save();
    ctx.translate(x, y);
    
    // Planet
    const grad = ctx.createRadialGradient(-size/5, -size/5, 0, 0, 0, size);
    grad.addColorStop(0, '#3b82f6');
    grad.addColorStop(0.5, '#1d4ed8');
    grad.addColorStop(1, '#1e3a5f');
    
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();
    
    // Continents (simplified)
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.ellipse(-size/4, -size/5, size/4, size/5, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(size/4, size/5, size/5, size/3, -0.2, 0, Math.PI * 2);
    ctx.fill();
    
    // Atmosphere
    ctx.strokeStyle = 'rgba(96, 165, 250, 0.3)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, size + 3, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.restore();
  },

  // ── Draw arrow ──
  drawArrow(ctx, fromX, fromY, toX, toY, color = '#22d3ee', lineWidth = 2, headSize = 10) {
    const angle = Math.atan2(toY - fromY, toX - fromX);
    
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    
    // Line
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    
    // Head
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headSize * Math.cos(angle - Math.PI / 6),
      toY - headSize * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      toX - headSize * Math.cos(angle + Math.PI / 6),
      toY - headSize * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  },

  // ── Draw dashed path ──
  drawDashedPath(ctx, points, color = 'rgba(255,255,255,0.3)', lineWidth = 2) {
    if (points.length < 2) return;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  },

  // ── Draw smooth path ──
  drawSmoothPath(ctx, points, color = '#7c3aed', lineWidth = 3, progress = 1) {
    if (points.length < 2) return;
    const len = Math.floor(points.length * progress);
    if (len < 2) return;
    
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < len; i++) {
      if (i < len - 1) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      } else {
        ctx.lineTo(points[i].x, points[i].y);
      }
    }
    ctx.stroke();
    ctx.restore();
  },

  // ── Draw graph axes ──
  drawAxes(ctx, x, y, w, h, xLabel = 'Time (s)', yLabel = 'Distance (m)') {
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    
    // Y axis
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    // X axis
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x + w, y + h);
    ctx.stroke();
    
    // Arrow heads
    this.drawArrow(ctx, x, y + 10, x, y, 'rgba(255,255,255,0.4)', 2, 8);
    this.drawArrow(ctx, x + w - 10, y + h, x + w, y + h, 'rgba(255,255,255,0.4)', 2, 8);
    
    // Labels
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(xLabel, x + w / 2, y + h + 25);
    
    ctx.save();
    ctx.translate(x - 25, y + h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(yLabel, 0, 0);
    ctx.restore();
    
    ctx.restore();
  },

  // ── Draw grid ──
  drawGrid(ctx, x, y, w, h, xDivs = 6, yDivs = 6) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    
    for (let i = 1; i <= xDivs; i++) {
      const px = x + (w / xDivs) * i;
      ctx.beginPath();
      ctx.moveTo(px, y);
      ctx.lineTo(px, y + h);
      ctx.stroke();
    }
    
    for (let i = 1; i <= yDivs; i++) {
      const py = y + (h / yDivs) * i;
      ctx.beginPath();
      ctx.moveTo(x, py);
      ctx.lineTo(x + w, py);
      ctx.stroke();
    }
    
    ctx.restore();
  },

  // ── Draw house ──
  drawHouse(ctx, x, y, size = 30, label = '') {
    ctx.save();
    ctx.translate(x, y);
    
    // Body
    ctx.fillStyle = '#475569';
    ctx.fillRect(-size/2, -size/3, size, size * 0.6);
    
    // Roof
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(-size/2 - 4, -size/3);
    ctx.lineTo(0, -size/1.2);
    ctx.lineTo(size/2 + 4, -size/3);
    ctx.closePath();
    ctx.fill();
    
    // Door
    ctx.fillStyle = '#92400e';
    ctx.fillRect(-size/8, -size/6, size/4, size/3 + size/6);
    
    // Window
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(size/5, -size/5, size/5, size/5);
    
    if (label) {
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, 0, size/2 + 15);
    }
    
    ctx.restore();
  },

  // ── Draw school ──
  drawSchool(ctx, x, y, size = 35, label = '') {
    ctx.save();
    ctx.translate(x, y);
    
    // Body
    ctx.fillStyle = '#374151';
    ctx.fillRect(-size/1.5, -size/3, size * 1.3, size * 0.6);
    
    // Roof
    ctx.fillStyle = '#6366f1';
    ctx.fillRect(-size/1.5 - 2, -size/3 - 4, size * 1.3 + 4, 6);
    
    // Flag
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -size/3 - 4);
    ctx.lineTo(0, -size);
    ctx.stroke();
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(1, -size, 15, 10);
    
    // Windows
    ctx.fillStyle = '#93c5fd';
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(-size/2 + i * (size/2.2), -size/5, size/5, size/5);
    }
    
    // Door
    ctx.fillStyle = '#92400e';
    ctx.fillRect(-size/8, -size/6, size/4, size/3 + size/6);
    
    if (label) {
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, 0, size/2 + 15);
    }
    
    ctx.restore();
  },

  // ── Draw rocket ──
  drawRocket(ctx, x, y, size = 50, flameOn = false) {
    ctx.save();
    ctx.translate(x, y);
    
    // Body
    const grad = ctx.createLinearGradient(-size/5, -size/1.5, size/5, size/1.5);
    grad.addColorStop(0, '#e2e8f0');
    grad.addColorStop(1, '#94a3b8');
    ctx.fillStyle = grad;
    
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.quadraticCurveTo(size/3, -size/2, size/4, size/3);
    ctx.lineTo(-size/4, size/3);
    ctx.quadraticCurveTo(-size/3, -size/2, 0, -size);
    ctx.fill();
    
    // Nose cone
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.quadraticCurveTo(size/6, -size/1.3, size/6, -size/1.5);
    ctx.lineTo(-size/6, -size/1.5);
    ctx.quadraticCurveTo(-size/6, -size/1.3, 0, -size);
    ctx.fill();
    
    // Window
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(0, -size/2.5, size/8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Fins
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(-size/4, size/4);
    ctx.lineTo(-size/2, size/2);
    ctx.lineTo(-size/5, size/3);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(size/4, size/4);
    ctx.lineTo(size/2, size/2);
    ctx.lineTo(size/5, size/3);
    ctx.fill();
    
    // Flame
    if (flameOn) {
      const flameH = size/2 + Math.random() * size/4;
      const grad2 = ctx.createLinearGradient(0, size/3, 0, size/3 + flameH);
      grad2.addColorStop(0, '#fbbf24');
      grad2.addColorStop(0.4, '#f97316');
      grad2.addColorStop(1, 'rgba(239, 68, 68, 0)');
      
      ctx.fillStyle = grad2;
      ctx.beginPath();
      ctx.moveTo(-size/5, size/3);
      ctx.quadraticCurveTo(-size/8, size/3 + flameH * 0.7, 0, size/3 + flameH);
      ctx.quadraticCurveTo(size/8, size/3 + flameH * 0.7, size/5, size/3);
      ctx.fill();
    }
    
    ctx.restore();
  },

  // ── Draw train ──
  drawTrain(ctx, x, y, size = 50, color = '#ef4444') {
    ctx.save();
    ctx.translate(x, y);
    
    // Engine
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(-size/2, -size/3, size * 0.7, size/2, 4);
    ctx.fill();
    
    // Cabin
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-size/2 + 4, -size/3 - size/6, size/4, size/6);
    
    // Chimney
    ctx.fillStyle = '#374151';
    ctx.fillRect(-size/3, -size/3 - size/4, size/8, size/8);
    
    // Wheels
    ctx.fillStyle = '#1e293b';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(-size/3 + i * (size/4), size/6 + 2, size/10, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  },

  // ── Draw dot with label ──
  drawDot(ctx, x, y, radius = 5, color = '#22d3ee', label = '') {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Glow
    ctx.fillStyle = color.replace(')', ', 0.3)').replace('rgb', 'rgba');
    ctx.beginPath();
    ctx.arc(x, y, radius + 4, 0, Math.PI * 2);
    ctx.fill();
    
    if (label) {
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, y - radius - 8);
    }
    
    ctx.restore();
  },

  // ── Draw speedometer ──
  drawSpeedometer(ctx, x, y, radius, speed, maxSpeed = 100) {
    ctx.save();
    ctx.translate(x, y);
    
    // Background arc
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, 0, radius, Math.PI * 0.75, Math.PI * 2.25);
    ctx.stroke();
    
    // Speed arc
    const frac = Math.min(speed / maxSpeed, 1);
    const endAngle = Math.PI * 0.75 + frac * Math.PI * 1.5;
    const grad = ctx.createLinearGradient(-radius, 0, radius, 0);
    grad.addColorStop(0, '#10b981');
    grad.addColorStop(0.5, '#f59e0b');
    grad.addColorStop(1, '#ef4444');
    ctx.strokeStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, radius, Math.PI * 0.75, endAngle);
    ctx.stroke();
    
    // Needle
    const needleAngle = Math.PI * 0.75 + frac * Math.PI * 1.5;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(
      Math.cos(needleAngle) * (radius - 15),
      Math.sin(needleAngle) * (radius - 15)
    );
    ctx.stroke();
    
    // Center dot
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Speed text
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${radius/2.5}px Outfit, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(Math.round(speed), 0, radius/3);
    
    ctx.font = `${radius/5}px Inter, sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText('km/h', 0, radius/3 + radius/4);
    
    ctx.restore();
  },

  // ── Setup HiDPI canvas ──
  setupCanvas(canvas, width, height) {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return ctx;
  },

  // ── Draw text with background ──
  drawLabel(ctx, text, x, y, bgColor = 'rgba(0,0,0,0.6)', textColor = '#fff', fontSize = 12) {
    ctx.save();
    ctx.font = `${fontSize}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    const metrics = ctx.measureText(text);
    const pad = 6;
    
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.roundRect(
      x - metrics.width/2 - pad, 
      y - fontSize/2 - pad,
      metrics.width + pad * 2,
      fontSize + pad * 2,
      4
    );
    ctx.fill();
    
    ctx.fillStyle = textColor;
    ctx.fillText(text, x, y + fontSize/3);
    ctx.restore();
  }
};
