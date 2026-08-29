import React, { useEffect, useRef } from "react";

interface SlitherEntity {
  x: number;
  y: number;
  angle: number;
  speed: number;
  turnSpeed: number;
  targetTurnSpeed: number;
  turnTimer: number;
  maxHistory: number;
  headRadius: number;
  history: { x: number; y: number }[];
  phaseOffset: number;
}

interface PelletNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export function SlitherTraceScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Resize handling with devicePixelRatio
    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width || 320;
      height = rect.height || 260;
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

    const cx = () => width / 2;
    const cy = () => height / 2;

    // 3-4 Curving Snakes (Centered in the card)
    const snakes: SlitherEntity[] = [
      // 1. Primary Leader Snake
      {
        x: (width || 320) * 0.48,
        y: (height || 260) * 0.52,
        angle: 0.5,
        speed: 46,
        turnSpeed: 0,
        targetTurnSpeed: 0,
        turnTimer: 0,
        maxHistory: 140,
        headRadius: 3.5,
        history: [],
        phaseOffset: 0,
      },
      // 2. Secondary Companion Snake
      {
        x: (width || 320) * 0.55,
        y: (height || 260) * 0.45,
        angle: 2.4,
        speed: 40,
        turnSpeed: 0,
        targetTurnSpeed: 0,
        turnTimer: 0.2,
        maxHistory: 95,
        headRadius: 3.0,
        history: [],
        phaseOffset: 2.1,
      },
      // 3. Small Scout Snake A
      {
        x: (width || 320) * 0.42,
        y: (height || 260) * 0.48,
        angle: -1.2,
        speed: 36,
        turnSpeed: 0,
        targetTurnSpeed: 0,
        turnTimer: 0.35,
        maxHistory: 70,
        headRadius: 2.5,
        history: [],
        phaseOffset: 4.2,
      },
      // 4. Small Scout Snake B
      {
        x: (width || 320) * 0.52,
        y: (height || 260) * 0.56,
        angle: 3.8,
        speed: 34,
        turnSpeed: 0,
        targetTurnSpeed: 0,
        turnTimer: 0.15,
        maxHistory: 55,
        headRadius: 2.5,
        history: [],
        phaseOffset: 5.5,
      },
    ];

    // Ambient floating food / pellet nodes
    const pellets: PelletNode[] = [
      { x: (width || 320) * 0.38, y: (height || 260) * 0.42, vx: 5, vy: 4, radius: 2.0 },
      { x: (width || 320) * 0.62, y: (height || 260) * 0.38, vx: -4, vy: 6, radius: 2.0 },
      { x: (width || 320) * 0.46, y: (height || 260) * 0.65, vx: 6, vy: -5, radius: 2.0 },
      { x: (width || 320) * 0.58, y: (height || 260) * 0.58, vx: -5, vy: -4, radius: 2.0 },
    ];

    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const centerX = cx();
      const centerY = cy();
      const maxRadius = Math.min(width, height) * 0.32; // Keeps all snakes centered

      // 1. Update and Steer Each Snake
      snakes.forEach((snake, idx) => {
        snake.turnTimer += dt;
        if (snake.turnTimer > 0.38) {
          snake.turnTimer = 0;
          // Harmonic wave motion + subtle random steering
          const harmonic = Math.sin(now * 0.0018 + snake.phaseOffset) * 1.8;
          const noise = (Math.random() - 0.5) * 1.4;
          snake.targetTurnSpeed = harmonic + noise;
        }

        // Steer back towards center if drifting outside the middle zone
        const dx = centerX - snake.x;
        const dy = centerY - snake.y;
        const distFromCenter = Math.hypot(dx, dy);

        if (distFromCenter > maxRadius) {
          const angleToCenter = Math.atan2(dy, dx);
          let angleDiff = angleToCenter - snake.angle;
          // Normalize angle difference to [-PI, PI]
          while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
          while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

          // Smooth restoring torque towards center
          snake.targetTurnSpeed = angleDiff * 2.8;
        }

        // Interpolate turn speed
        snake.turnSpeed += (snake.targetTurnSpeed - snake.turnSpeed) * 0.1;
        snake.angle += snake.turnSpeed * dt;

        // Advance position
        snake.x += Math.cos(snake.angle) * snake.speed * dt;
        snake.y += Math.sin(snake.angle) * snake.speed * dt;

        // Record history point
        snake.history.push({ x: snake.x, y: snake.y });
        if (snake.history.length > snake.maxHistory) {
          snake.history.shift();
        }
      });

      // 2. Update Pellets
      pellets.forEach((p) => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        const dx = centerX - p.x;
        const dy = centerY - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist > maxRadius * 1.2) {
          p.vx = (dx / dist) * 6;
          p.vy = (dy / dist) * 6;
        }
      });

      // 3. Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // Faint central coordinate grid dots
      ctx.fillStyle = "rgba(245, 245, 245, 0.035)";
      for (let x = 24; x < width; x += 32) {
        for (let y = 24; y < height; y += 32) {
          ctx.fillRect(x, y, 1, 1);
        }
      }

      // Draw Ambient Pellets
      pellets.forEach((p) => {
        ctx.strokeStyle = "rgba(147, 170, 130, 0.55)";
        ctx.lineWidth = 0.9;
        ctx.fillStyle = "#080808";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      // 4. Draw All Curving Snakes
      snakes.forEach((snake, idx) => {
        const hist = snake.history;
        if (hist.length > 2) {
          // Hairline moss-green stroke
          ctx.strokeStyle = idx === 0 ? "#93AA82" : "rgba(147, 170, 130, 0.75)";
          ctx.lineWidth = idx === 0 ? 1.1 : 0.9;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";

          ctx.beginPath();
          ctx.moveTo(hist[0].x, hist[0].y);

          // Smooth quadratic Bézier interpolation
          for (let i = 1; i < hist.length - 1; i++) {
            const xc = (hist[i].x + hist[i + 1].x) / 2;
            const yc = (hist[i].y + hist[i + 1].y) / 2;
            ctx.quadraticCurveTo(hist[i].x, hist[i].y, xc, yc);
          }
          ctx.lineTo(hist[hist.length - 1].x, hist[hist.length - 1].y);
          ctx.stroke();
        }

        // Draw Hollow Node Head
        ctx.strokeStyle = "#93AA82";
        ctx.lineWidth = 1;
        ctx.fillStyle = "#080808";
        ctx.beginPath();
        ctx.arc(snake.x, snake.y, snake.headRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

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
      className="slither-trace-scene"
      aria-label="Slither.io Multiplayer Signal Trace Scene"
    >
      <canvas ref={canvasRef} className="slither-trace-canvas" />

      {/* Subtle Telemetry Overlays */}
      <div className="slither-telemetry" aria-hidden="true">
        <div className="telemetry-top">
          <span className="telemetry-badge">
            <span className="telemetry-dot" />
            MULTI-ENTITY MESH [4 TRACES]
          </span>
          <span className="telemetry-coord">TOPOLOGY: LIVE TRACE</span>
        </div>
        <div className="telemetry-bottom">
          <span>CURVATURE: CONTINUOUS</span>
          <span>WEIGHT: HAIRLINE 1PX</span>
        </div>
      </div>
    </div>
  );
}
