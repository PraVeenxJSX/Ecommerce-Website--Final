import React, { useEffect } from "react";
import "./BackgroundAura.css";

const BackgroundAura = () => {
  useEffect(() => {
    // ─── Custom cursor ───
    const cursor = document.getElementById('cursor');
    const ring   = document.getElementById('cursor-ring');
    const trail  = document.getElementById('cursor-trail');
    let mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my;
    
    let isCursorRunning = true;

    const onMouseMove = (e) => {
      mx = e.clientX; 
      my = e.clientY;
      if (cursor) {
        cursor.style.left = mx + 'px'; 
        cursor.style.top = my + 'px';
      }
    };
    document.addEventListener('mousemove', onMouseMove);

    const animRing = () => {
      if (!isCursorRunning) return;
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (ring) {
        ring.style.left = rx + 'px'; 
        ring.style.top = ry + 'px';
      }
      if (trail) {
        trail.style.left = (rx * 0.7 + mx * 0.3) + 'px';
        trail.style.top  = (ry * 0.7 + my * 0.3) + 'px';
      }
      requestAnimationFrame(animRing);
    };
    animRing();

    // Event listeners to interactive elements
    const interactiveEls = document.querySelectorAll('a, button, .stat-pill');
    const onMouseEnter = () => {
      if (cursor) {
        cursor.style.width = '20px'; cursor.style.height = '20px';
      }
      if (ring) {
        ring.style.width = '60px'; ring.style.height = '60px';
        ring.style.borderColor = 'rgba(245,200,66,0.8)';
      }
    };
    const onMouseLeave = () => {
      if (cursor) {
        cursor.style.width = '12px'; cursor.style.height = '12px';
      }
      if (ring) {
        ring.style.width = '40px'; ring.style.height = '40px';
        ring.style.borderColor = 'rgba(245,200,66,0.5)';
      }
    };

    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mouseleave', onMouseLeave);
    });

    // ─── Particle canvas ───
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Particles
    const COLORS = ['#00e5ff','#ff4e88','#8b5cf6','#f5c842','#00ffb3'];
    const particles = [];

    class Particle {
      constructor() { this.reset(true); }
      reset(initial = false) {
        this.x  = Math.random() * canvas.width;
        this.y  = initial ? Math.random() * canvas.height : canvas.height + 10;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = -(0.2 + Math.random() * 0.6);
        this.r  = 1 + Math.random() * 2.5;
        this.alpha = 0;
        this.maxAlpha = 0.3 + Math.random() * 0.5;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.life = 0;
        this.maxLife = 120 + Math.random() * 180;
        this.glow = Math.random() > 0.7;
        this.twinkleSpeed = 0.02 + Math.random() * 0.04;
        this.twinkleOffset = Math.random() * Math.PI * 2;
      }
      update() {
        this.life++;
        this.x += this.vx + Math.sin(this.life * 0.02 + this.twinkleOffset) * 0.3;
        this.y += this.vy;
        const t = this.life / this.maxLife;
        this.alpha = t < 0.15 ? (t / 0.15) * this.maxAlpha
                   : t > 0.75 ? ((1 - t) / 0.25) * this.maxAlpha
                   : this.maxAlpha;
        if (this.life >= this.maxLife) this.reset();
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        if (this.glow) {
          ctx.shadowBlur = 12; ctx.shadowColor = this.color;
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    const stars = Array.from({length: 200}, () => ({
      x: Math.random() * 2000,
      y: Math.random() * 1200,
      r: Math.random() * 1.5,
      alpha: 0.1 + Math.random() * 0.5,
      twinkle: Math.random() * Math.PI * 2,
      speed: 0.005 + Math.random() * 0.015,
    }));

    const shootingStars = [];
    const spawnShootingStar = () => {
      shootingStars.push({
        x: Math.random() * canvas.width * 0.7,
        y: Math.random() * canvas.height * 0.4,
        vx: 6 + Math.random() * 8,
        vy: 2 + Math.random() * 3,
        len: 80 + Math.random() * 120,
        alpha: 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    };
    const shootInterval = setInterval(spawnShootingStar, 2800);

    const drawConnections = () => {
      const pts = particles.filter(p => p.alpha > 0.2 && p.r > 1.5);
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 120) {
            ctx.save();
            ctx.globalAlpha = (1 - dist / 120) * 0.15;
            ctx.strokeStyle = pts[i].color;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    }

    for (let i = 0; i < 180; i++) particles.push(new Particle());

    let frameId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach(s => {
        s.twinkle += s.speed;
        const a = s.alpha * (0.7 + 0.3 * Math.sin(s.twinkle));
        ctx.save();
        ctx.globalAlpha = a;
        ctx.beginPath();
        ctx.arc(
          s.x * (canvas.width / 2000),
          s.y * (canvas.height / 1200),
          s.r, 0, Math.PI * 2
        );
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.restore();
      });

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        ctx.save();
        const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.len * (s.vx / 10), s.y - s.len * (s.vy / 10));
        grad.addColorStop(0, s.color + 'ff');
        grad.addColorStop(1, s.color + '00');
        ctx.globalAlpha = s.alpha;
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 10; ctx.shadowColor = s.color;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.len * (s.vx / 10), s.y - s.len * (s.vy / 10));
        ctx.stroke();
        ctx.restore();
        s.x += s.vx; s.y += s.vy; s.alpha -= 0.012;
        if (s.alpha <= 0) shootingStars.splice(i, 1);
      }

      particles.forEach(p => {
        const dx = p.x - mx, dy = p.y - my;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          p.vx += dx * 0.002;
          p.vy += dy * 0.002;
        }
        p.update();
        p.draw();
      });

      drawConnections();
      frameId = requestAnimationFrame(animate);
    }
    animate();

    // ─── Orbiting product icons ───
    const products = ['🛍️','💎','👟','⌚','📱','💄','🎧','🛋️','✨','👜'];
    const orbitSystem = document.getElementById('orbit-system');
    
    // clean up children if any exists
    if (orbitSystem) {
        orbitSystem.innerHTML = '';
        products.forEach((emoji, i) => {
          const radii = [220, 300, 380, 260, 340][i % 5];
          const speed = [28, 36, 44, 32, 40][i % 5];
          const startAngle = (i / products.length) * 360;
          const size = 44 + (i % 3) * 8;
        
          const el = document.createElement('div');
          el.className = 'orbit-dot';
          el.textContent = emoji;
          el.style.cssText = `
            width: ${size}px; height: ${size}px;
            left: calc(50% - ${radii}px);
            top: calc(50% - ${size/2}px);
            --start-angle: ${startAngle}deg;
            --radius: ${radii}px;
            animation-duration: ${speed}s;
            animation-delay: -${(i * speed / products.length).toFixed(1)}s;
            font-size: ${size * 0.45}px;
            opacity: ${0.5 + (i % 3) * 0.15};
          `;
          orbitSystem.appendChild(el);
        });
    }

    // ─── Parallax on mouse move ───
    const onParallaxMove = (e) => {
      const nx = (e.clientX / window.innerWidth - 0.5);
      const ny = (e.clientY / window.innerHeight - 0.5);

      document.querySelectorAll('.ring').forEach((r, i) => {
        const d = (i + 1) * 10;
        r.style.marginLeft = (nx * d) + 'px';
        r.style.marginTop  = (ny * d) + 'px';
      });

      document.querySelectorAll('.orb').forEach((o, i) => {
        const d = (i + 1) * 18;
        o.style.transform = `translate(${nx * d}px, ${ny * d}px)`;
      });
    };
    document.addEventListener('mousemove', onParallaxMove);

    return () => {
      isCursorRunning = false;
      window.removeEventListener('resize', resize);
      clearInterval(shootInterval);
      cancelAnimationFrame(frameId);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousemove', onParallaxMove);
      
      interactiveEls.forEach(el => {
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
      });
    };

  }, []);

  return (
    <>
      <div id="progress-bar"></div>
      
      <div id="cursor"></div>
      <div id="cursor-ring"></div>
      <div id="cursor-trail"></div>

      <canvas id="bg-canvas"></canvas>

      <div id="grain"></div>
      <div id="scanline"></div>
      <div id="edge-glow"></div>
      <div id="grid-floor"></div>

      <div id="ring1" className="ring"></div>
      <div id="ring2" className="ring"></div>
      <div id="ring3" className="ring"></div>
      <div id="ring4" className="ring"></div>

      <div id="orb1" className="orb"></div>
      <div id="orb2" className="orb"></div>
      <div id="orb3" className="orb"></div>
      <div id="orb4" className="orb"></div>
      <div id="orb5" className="orb"></div>

      <div className="orbit-system" id="orbit-system"></div>

      <div className="corner corner-tl"></div>
      <div className="corner corner-tr"></div>
      <div className="corner corner-bl"></div>
      <div className="corner corner-br"></div>
    </>
  );
};

export default BackgroundAura;
