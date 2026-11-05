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

    // Color palette matching the nostalgic sky, teal roof, and pink clouds
    const BOID_COLORS = [
      '#185f6e', // deep teal
      '#2aa0b3', // cyan roof
      '#e06292', // pink cloud ink
      '#5c6e2b', // olive grass
      '#d97706', // warm chimney amber
      '#383d3b', // ink line
    ];

    // Initialize 45 boids
    const numBoids = Math.min(55, Math.max(25, Math.floor(width / 30)));
    const boids: Boid[] = [];

    for (let i = 0; i < numBoids; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.2 + Math.random() * 1.5;
      boids.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3.5 + Math.random() * 3,
        color: BOID_COLORS[Math.floor(Math.random() * BOID_COLORS.length)],
        wingAngle: Math.random() * Math.PI * 2,
        wingSpeed: 0.15 + Math.random() * 0.12,
      });
    }

    // Flocking parameters (Reynolds Boids rules)
    const visualRange = 90;
    const minDistance = 24;
    const separationFactor = 0.05;
    const alignmentFactor = 0.04;
    const cohesionFactor = 0.003;
    const maxSpeed = 2.6;
    const minSpeed = 1.0;

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const updateAndDraw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle background drifting clouds with sleeping faces
      const time = Date.now() * 0.0003;

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
        if (mDistSq < 120 * 120 && mDistSq > 0) {
          const mDist = Math.sqrt(mDistSq);
          b.vx += (mdx / mDist) * 0.4;
          b.vy += (mdy / mDist) * 0.4;
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
        if (b.y < -pad) b.y = height + pad;
        if (b.y > height + pad) b.y = -pad;

        // Wing flapping
        b.wingAngle += b.wingSpeed;

        // Render boid as nostalgic storybook bird / little swallow
        const heading = Math.atan2(b.vy, b.vx);
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(heading);

        const wingSpread = Math.sin(b.wingAngle) * (b.size * 1.3);

        // Body with hand-inked comic stroke
        ctx.strokeStyle = '#202624';
        ctx.lineWidth = 1.3;
        ctx.fillStyle = b.color;

        // Small V-flight bird silhouette with storybook ink line
        ctx.beginPath();
        // Left wing tip
        ctx.moveTo(-b.size * 0.4, -wingSpread);
        // Center crown
        ctx.quadraticCurveTo(0, -wingSpread * 0.4, b.size * 0.8, 0);
        // Right wing tip
        ctx.quadraticCurveTo(0, wingSpread * 0.4, -b.size * 0.4, wingSpread);
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
      className="fixed inset-0 pointer-events-none z-0 opacity-75"
      style={{ mixBlendMode: 'multiply' }}
      aria-hidden="true"
    />
  );
};
