import React, { useEffect, useRef } from 'react';

interface Boid {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  wingAngle: number;
  wingSpeed: number;
}

interface DriftingCloud {
  x: number;
  y: number;
  speed: number;
  scale: number;
  hasFace: boolean;
}

export const BoidsCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Realistic twilight bird silhouettes: deep twilight ink, slate teal, and dusky amber
    const BOID_COLORS = [
      '#202b28', // deep ink
      '#1b5c6b', // dusky teal
      '#7a384f', // twilight berry
      '#a85c3b', // warm apricot-clay
      '#3f5424', // deep moss
    ];

    // Initialize boids
    const numBoids = Math.min(48, Math.max(22, Math.floor(width / 32)));
    const boids: Boid[] = [];

    for (let i = 0; i < numBoids; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.1 + Math.random() * 1.4;
      boids.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.7, // Concentrate flight in sky portion
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed * 0.7,
        size: 3.2 + Math.random() * 2.4,
        color: BOID_COLORS[Math.floor(Math.random() * BOID_COLORS.length)],
        wingAngle: Math.random() * Math.PI * 2,
        wingSpeed: 0.14 + Math.random() * 0.1,
      });
    }

    // Drifting storybook clouds (from Image 1 reference)
    const clouds: DriftingCloud[] = [
      { x: width * 0.12, y: 70, speed: 0.18, scale: 1.1, hasFace: true },
      { x: width * 0.45, y: 130, speed: 0.12, scale: 0.85, hasFace: false },
      { x: width * 0.75, y: 85, speed: 0.22, scale: 1.25, hasFace: true },
      { x: width * 0.92, y: 180, speed: 0.15, scale: 0.75, hasFace: true },
    ];

    // Flocking parameters (Reynolds Boids rules)
    const visualRange = 85;
    const minDistance = 22;
    const separationFactor = 0.05;
    const alignmentFactor = 0.04;
    const cohesionFactor = 0.003;
    const maxSpeed = 2.4;
    const minSpeed = 0.9;

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Helper: Draw a stylized storybook cloud with soft twilight blush & ink outline
    const drawCloud = (c: DriftingCloud) => {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.scale(c.scale, c.scale);

      ctx.lineWidth = 1.8;
      ctx.strokeStyle = '#232b28';

      // Soft twilight cloud fill: warm cream-rose with glowing bottom
      const cloudGrad = ctx.createLinearGradient(0, -30, 0, 30);
      cloudGrad.addColorStop(0, '#fff4f8');
      cloudGrad.addColorStop(0.5, '#fde2eb');
      cloudGrad.addColorStop(1, '#fad1de');
      ctx.fillStyle = cloudGrad;

      // Cloud pillowy lobes
      ctx.beginPath();
      ctx.moveTo(-70, 10);
      ctx.bezierCurveTo(-90, 10, -90, -15, -70, -20);
      ctx.bezierCurveTo(-75, -40, -45, -45, -30, -32);
      ctx.bezierCurveTo(-15, -50, 25, -50, 40, -30);
      ctx.bezierCurveTo(60, -45, 85, -30, 80, -10);
      ctx.bezierCurveTo(100, -5, 100, 20, 75, 25);
      ctx.bezierCurveTo(60, 35, -50, 35, -70, 10);
      ctx.closePath();

      // Soft drop shadow
      ctx.shadowColor = 'rgba(142, 63, 95, 0.15)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 4;
      ctx.fill();

      // Reset shadow for stroke
      ctx.shadowColor = 'transparent';
      ctx.stroke();

      // Cute peaceful sleeping eyes and smile (from Image 1 reference)
      if (c.hasFace) {
        ctx.fillStyle = '#232b28';
        ctx.strokeStyle = '#232b28';
        ctx.lineWidth = 1.6;

        // Left sleeping eye (gentle downward crescent)
        ctx.beginPath();
        ctx.arc(28, -8, 4, 0.1 * Math.PI, 0.9 * Math.PI, false);
        ctx.stroke();

        // Right sleeping eye
        ctx.beginPath();
        ctx.arc(42, -8, 4, 0.1 * Math.PI, 0.9 * Math.PI, false);
        ctx.stroke();

        // Tiny eyelash accents
        ctx.beginPath();
        ctx.moveTo(35, -5);
        ctx.lineTo(36, -3);
        ctx.moveTo(49, -5);
        ctx.lineTo(50, -3);
        ctx.stroke();

        // Gentle smiling mouth
        ctx.beginPath();
        ctx.arc(35, 1, 3.5, 0.1 * Math.PI, 0.9 * Math.PI, false);
        ctx.stroke();

        // Rosy twilight cheek blushes
        ctx.fillStyle = 'rgba(235, 115, 150, 0.45)';
        ctx.beginPath();
        ctx.ellipse(22, -3, 3.5, 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(48, -3, 3.5, 2, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    const updateAndDraw = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Drifting Clouds in the background
      for (let i = 0; i < clouds.length; i++) {
        const c = clouds[i];
        c.x += c.speed;
        if (c.x > width + 140) {
          c.x = -140;
        }
        drawCloud(c);
      }

      // 2. Flocking Boids Update & Draw
      for (let i = 0; i < boids.length; i++) {
        const b = boids[i];

        let closeDx = 0;
        let closeDy = 0;
        let xVelAvg = 0;
        let yVelAvg = 0;
        let xPosAvg = 0;
        let yPosAvg = 0;
        let neighbors = 0;

        for (let j = 0; j < boids.length; j++) {
          if (i === j) continue;
          const other = boids[j];
          const dx = other.x - b.x;
          const dy = other.y - b.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < visualRange * visualRange) {
            // Separation
            if (distSq < minDistance * minDistance) {
              closeDx += b.x - other.x;
              closeDy += b.y - other.y;
            }
            // Alignment & Cohesion accumulators
            xVelAvg += other.vx;
            yVelAvg += other.vy;
            xPosAvg += other.x;
            yPosAvg += other.y;
            neighbors++;
          }
        }

        // Apply separation
        b.vx += closeDx * separationFactor;
        b.vy += closeDy * separationFactor;

        // Apply alignment & cohesion
        if (neighbors > 0) {
          xVelAvg /= neighbors;
          yVelAvg /= neighbors;
          b.vx += (xVelAvg - b.vx) * alignmentFactor;
          b.vy += (yVelAvg - b.vy) * alignmentFactor;

          xPosAvg /= neighbors;
          yPosAvg /= neighbors;
          b.vx += (xPosAvg - b.x) * cohesionFactor;
          b.vy += (yPosAvg - b.y) * cohesionFactor;
        }

        // Mouse gentle aversion
        const mdx = b.x - mouseX;
        const mdy = b.y - mouseY;
        const mDistSq = mdx * mdx + mdy * mdy;
        if (mDistSq < 110 * 110 && mDistSq > 0) {
          const mDist = Math.sqrt(mDistSq);
          b.vx += (mdx / mDist) * 0.35;
          b.vy += (mdy / mDist) * 0.35;
        }

        // Keep boids gracefully flying in sky rather than sticking to bottom ground
        if (b.y > height * 0.85) {
          b.vy -= 0.08;
        }

        // Speed limiting
        const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        if (speed > maxSpeed) {
          b.vx = (b.vx / speed) * maxSpeed;
          b.vy = (b.vy / speed) * maxSpeed;
        } else if (speed < minSpeed) {
          b.vx = (b.vx / speed) * minSpeed;
          b.vy = (b.vy / speed) * minSpeed;
        }

        // Position update
        b.x += b.vx;
        b.y += b.vy;

        // Screen boundary wrapping
        const pad = 30;
        if (b.x < -pad) b.x = width + pad;
        if (b.x > width + pad) b.x = -pad;
        if (b.y < -pad) b.y = height * 0.75;
        if (b.y > height + pad) b.y = -pad;

        // Wing flapping
        b.wingAngle += b.wingSpeed;

        // Render boid as nostalgic storybook bird / little swallow
        const heading = Math.atan2(b.vy, b.vx);
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(heading);

        const wingSpread = Math.sin(b.wingAngle) * (b.size * 1.35);

        // Body with hand-inked comic stroke
        ctx.strokeStyle = '#202624';
        ctx.lineWidth = 1.2;
        ctx.fillStyle = b.color;

        // Small aerodynamic V-flight bird silhouette with storybook ink line
        ctx.beginPath();
        // Left wing tip
        ctx.moveTo(-b.size * 0.45, -wingSpread);
        // Center crown
        ctx.quadraticCurveTo(0, -wingSpread * 0.4, b.size * 0.85, 0);
        // Right wing tip
        ctx.quadraticCurveTo(0, wingSpread * 0.4, -b.size * 0.45, wingSpread);
        // Tail notch
        ctx.lineTo(-b.size * 0.8, 0);
        ctx.closePath();

        ctx.fill();
        ctx.stroke();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(updateAndDraw);
    };

    updateAndDraw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};
