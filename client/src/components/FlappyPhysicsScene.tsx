import React, { useEffect, useRef, useState } from "react";

interface PipePair {
  x: number; // horizontal coordinate
  gapY: number; // vertical center of gap (px from top)
  gapHeight: number; // clearance height
  id: number;
}

export function FlappyPhysicsScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReduced, setIsReduced] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setIsReduced(prefersReducedMotion);

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Resize handling with devicePixelRatio
    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    handleResize();

    if (prefersReducedMotion) {
      // Draw single static diagnostic arc
      const drawStaticDiagram = () => {
        ctx.clearRect(0, 0, width, height);

        const PIPE_WIDTH = 38;
        const GAP_H = 88;
        const PIPE_X = width * 0.52;
        const GAP_Y = height * 0.48;

        // Background Grid Lines
        ctx.strokeStyle = "rgba(245, 245, 245, 0.04)";
        ctx.lineWidth = 1;
        for (let y = 20; y < height; y += 30) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Pipe Obstacles
        ctx.fillStyle = "#161616";
        ctx.strokeStyle = "#282828";
        ctx.lineWidth = 1;

        // Top Pipe
        ctx.fillRect(PIPE_X, 0, PIPE_WIDTH, GAP_Y - GAP_H / 2);
        ctx.strokeRect(PIPE_X, -1, PIPE_WIDTH, GAP_Y - GAP_H / 2 + 1);

        // Bottom Pipe
        ctx.fillRect(PIPE_X, GAP_Y + GAP_H / 2, PIPE_WIDTH, height - (GAP_Y + GAP_H / 2));
        ctx.strokeRect(PIPE_X, GAP_Y + GAP_H / 2, PIPE_WIDTH, height - (GAP_Y + GAP_H / 2) + 1);

        // Gap Brackets
        ctx.strokeStyle = "rgba(147, 170, 130, 0.35)";
        ctx.setLineDash([2, 3]);
        ctx.strokeRect(PIPE_X - 4, GAP_Y - GAP_H / 2, PIPE_WIDTH + 8, GAP_H);
        ctx.setLineDash([]);

        // Static Parabolic Trajectory Arc
        ctx.strokeStyle = "rgba(147, 170, 130, 0.75)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        const startX = width * 0.15;
        const startY = height * 0.65;
        const apexX = width * 0.45;
        const apexY = height * 0.36;
        const endX = width * 0.85;
        const endY = height * 0.62;

        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(apexX, apexY - 20, endX, endY);
        ctx.stroke();

        // Bird at apex (Apex position)
        const bx = apexX;
        const by = apexY;
        ctx.save();
        ctx.translate(bx, by);
        ctx.fillStyle = "#b8d1a4";
        ctx.beginPath();
        ctx.moveTo(7, 0);
        ctx.lineTo(-5, -4);
        ctx.lineTo(-3, 0);
        ctx.lineTo(-5, 4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      };

      setTimeout(drawStaticDiagram, 50);
      return () => {
        resizeObserver.disconnect();
      };
    }

    // Dynamic Physics Simulation Variables
    const GRAVITY = 420; // px / sec^2
    const JUMP_IMPULSE = 145; // upward kick (px/sec)
    const SPEED_X = 54; // pipe scroll speed (px/sec)
    const PIPE_WIDTH = 36;
    const GAP_HEIGHT = 86;

    let birdY = height * 0.52;
    let birdVelocityY = -60;
    const birdX = 90; // fixed horizontal screen position for bird

    // Trajectory History for smooth fading tail
    const history: { x: number; y: number; time: number }[] = [];

    // Pipes list
    let pipeSpawnTimer = 0;
    const PIPE_SPAWN_INTERVAL = 3.2; // seconds between pipes
    let pipes: PipePair[] = [
      { x: 190, gapY: 100, gapHeight: GAP_HEIGHT, id: 1 },
      { x: 380, gapY: 130, gapHeight: GAP_HEIGHT, id: 2 },
    ];

    // Timed jump cycle for rhythmic flight (jumps when falling below threshold)
    let timeSinceLastJump = 0;
    let lastTime = performance.now();

    // Loop
    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05); // cap delta time
      lastTime = now;

      // 1. Simulate Bird Physics
      timeSinceLastJump += dt;

      // Smart impulse trigger: flap when approaching a pipe or dropping too low
      const nextPipe = pipes.find((p) => p.x + PIPE_WIDTH > birdX - 10);
      const targetGapY = nextPipe ? nextPipe.gapY : height * 0.48;

      if (birdY > targetGapY + 14 && birdVelocityY > 0 && timeSinceLastJump > 0.45) {
        birdVelocityY = -JUMP_IMPULSE;
        timeSinceLastJump = 0;
      } else if (birdY > height * 0.72 && birdVelocityY > 0) {
        birdVelocityY = -JUMP_IMPULSE;
        timeSinceLastJump = 0;
      }

      // Apply gravity
      birdVelocityY += GRAVITY * dt;
      birdY += birdVelocityY * dt;

      // Constrain inside bounds
      if (birdY < 20) {
        birdY = 20;
        birdVelocityY = 0;
      } else if (birdY > height - 20) {
        birdY = height - 20;
        birdVelocityY = -JUMP_IMPULSE * 0.8;
      }

      // 2. Manage Pipes (side-scrolling right to left)
      pipeSpawnTimer += dt;
      if (pipeSpawnTimer >= PIPE_SPAWN_INTERVAL) {
        pipeSpawnTimer = 0;
        const randomGapY = height * 0.35 + Math.sin(now * 0.002) * (height * 0.2);
        pipes.push({
          x: width + 20,
          gapY: Math.max(70, Math.min(height - 70, randomGapY)),
          gapHeight: GAP_HEIGHT,
          id: Date.now(),
        });
      }

      // Move pipes and remove offscreen
      pipes.forEach((p) => {
        p.x -= SPEED_X * dt;
      });
      pipes = pipes.filter((p) => p.x + PIPE_WIDTH > -40);

      // 3. Record Trajectory Point
      history.push({ x: birdX, y: birdY, time: now });
      // Shift historical points to the left with world scroll
      for (let i = 0; i < history.length; i++) {
        history[i].x -= SPEED_X * dt;
      }
      // Trim old points
      while (history.length > 0 && (now - history[0].time > 1800 || history[0].x < 0)) {
        history.shift();
      }

      // 4. DRAWING
      ctx.clearRect(0, 0, width, height);

      // Background Physics Grid Lines
      ctx.strokeStyle = "rgba(245, 245, 245, 0.035)";
      ctx.lineWidth = 1;
      for (let y = 24; y < height; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      for (let x = 32; x < width; x += 48) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw Pipe Obstacles (Graphite #181818 with hairline outline #2a2a2a)
      pipes.forEach((p) => {
        const topH = Math.max(0, p.gapY - p.gapHeight / 2);
        const botY = p.gapY + p.gapHeight / 2;
        const botH = Math.max(0, height - botY);

        ctx.fillStyle = "#141414";
        ctx.strokeStyle = "#262626";
        ctx.lineWidth = 1;

        // Top Pipe Silhouette
        ctx.fillRect(p.x, 0, PIPE_WIDTH, topH);
        ctx.strokeRect(p.x, -1, PIPE_WIDTH, topH + 1);

        // Bottom Pipe Silhouette
        ctx.fillRect(p.x, botY, PIPE_WIDTH, botH);
        ctx.strokeRect(p.x, botY, PIPE_WIDTH, botH + 1);

        // Gap Clearance Marker Frame (Hairline dashed moss green)
        ctx.strokeStyle = "rgba(147, 170, 130, 0.28)";
        ctx.setLineDash([2, 3]);
        ctx.strokeRect(p.x - 3, p.gapY - p.gapHeight / 2, PIPE_WIDTH + 6, p.gapHeight);
        ctx.setLineDash([]);

        // Gap center tick mark
        ctx.fillStyle = "rgba(147, 170, 130, 0.4)";
        ctx.fillRect(p.x + PIPE_WIDTH / 2 - 2, p.gapY - 1, 4, 2);
      });

      // Draw Parabolic History Trajectory Trail
      if (history.length > 1) {
        ctx.beginPath();
        for (let i = 0; i < history.length; i++) {
          const pt = history[i];
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = "rgba(147, 170, 130, 0.45)";
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Secondary dotted glow line
        ctx.strokeStyle = "rgba(147, 170, 130, 0.18)";
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Draw Bird: Aerodynamic Moss-Green Chevron / Triangle
      const angle = Math.atan2(birdVelocityY, 180); // pitch based on velocity

      ctx.save();
      ctx.translate(birdX, birdY);
      ctx.rotate(angle);

      // Subtle ambient pulse glow around head
      ctx.fillStyle = "rgba(147, 170, 130, 0.15)";
      ctx.beginPath();
      ctx.arc(0, 0, 9, 0, Math.PI * 2);
      ctx.fill();

      // Sharp aerodynamic triangle
      ctx.fillStyle = "#b8d1a4";
      ctx.strokeStyle = "#93aa82";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(8, 0); // nose pointer
      ctx.lineTo(-6, -4.5); // top wing
      ctx.lineTo(-3.5, 0); // inner notch
      ctx.lineTo(-6, 4.5); // bottom wing
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Velocity tangent vector arrow (hairline projection)
      ctx.strokeStyle = "rgba(184, 209, 164, 0.6)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(8, 0);
      ctx.lineTo(16, 0);
      ctx.stroke();

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="flappy-physics-scene"
      aria-label="Flappy Bird Kinematic Gravity Physics Diagram Scene"
    >
      <canvas ref={canvasRef} className="flappy-physics-canvas" />

      {/* Physics Telemetry HUD Overlays */}
      <div className="flappy-telemetry" aria-hidden="true">
        <div className="telemetry-top">
          <span className="telemetry-badge">
            <span className="telemetry-dot" />
            KINEMATICS: GRAVITY 9.8m/s²
          </span>
          <span className="telemetry-coord">GAP: 86px CLEARANCE</span>
        </div>
        <div className="telemetry-bottom">
          <span>TRAJECTORY: PARABOLIC</span>
          <span>SYSTEM: KINEMATICS ENGINE</span>
        </div>
      </div>
    </div>
  );
}
