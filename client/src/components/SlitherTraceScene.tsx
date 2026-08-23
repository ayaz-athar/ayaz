import React, { useEffect, useRef } from "react";

interface PeerNode {
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

    const prefersReducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;

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

    // Static reduced-motion rendering
    if (prefersReducedMotion) {
      const drawStaticCurve = () => {
        ctx.clearRect(0, 0, width, height);

        // Faint background dot grid
        ctx.fillStyle = "rgba(245, 245, 245, 0.05)";
        for (let x = 24; x < width; x += 36) {
          for (let y = 24; y < height; y += 36) {
            ctx.fillRect(x, y, 1, 1);
          }
        }

        // Static self-intersecting lemniscate / Lissajous curve
        ctx.strokeStyle = "#93AA82";
        ctx.lineWidth = 1;
        ctx.beginPath();
        const cx = width / 2;
        const cy = height / 2;
        const rx = width * 0.35;
        const ry = height * 0.32;

        for (let t = 0; t <= Math.PI * 2; t += 0.03) {
          const px = cx + rx * Math.sin(2 * t);
          const py = cy + ry * Math.sin(3 * t);
          if (t === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // 3 Hollow peer nodes
        const staticPeers = [
          { x: cx - rx * 0.6, y: cy - ry * 0.4 },
          { x: cx + rx * 0.5, y: cy + ry * 0.5 },
          { x: cx - rx * 0.2, y: cy + ry * 0.7 },
        ];

        staticPeers.forEach((p) => {
          ctx.strokeStyle = "#93AA82";
          ctx.lineWidth = 1;
          ctx.fillStyle = "#080808";
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        });
      };

      setTimeout(drawStaticCurve, 50);
      return () => {
        resizeObserver.disconnect();
      };
    }

    // Dynamic Live Signal Trace Simulation
    // Main curving snake particle
    let snakeHead = {
      x: width * 0.45 || 120,
      y: height * 0.5 || 100,
      angle: 0.8,
      speed: 48, // px per second
      turnSpeed: 0,
      targetTurnSpeed: 0,
    };

    const history: { x: number; y: number }[] = [];
    const MAX_HISTORY = 220; // trace length

    // 3 Independent Drifting Hollow Peer Nodes
    const peerNodes: PeerNode[] = [
      { x: 80, y: 70, vx: 14, vy: 11, radius: 3.5 },
      { x: 220, y: 140, vx: -12, vy: 16, radius: 3.5 },
      { x: 160, y: 190, vx: 15, vy: -13, radius: 3.5 },
    ];

    let lastTime = performance.now();
    let turnTimer = 0;

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // 1. Update Snake Head Motion (Autonomous smooth wander + boundary steering)
      turnTimer += dt;
      if (turnTimer > 0.4) {
        turnTimer = 0;
        // Natural smooth change in steering angle
        snakeHead.targetTurnSpeed = (Math.random() - 0.5) * 2.8;
      }

      // Smooth turning interpolation
      snakeHead.turnSpeed += (snakeHead.targetTurnSpeed - snakeHead.turnSpeed) * 0.08;

      // Soft boundary avoidance to keep looping inside canvas
      const margin = 38;
      if (snakeHead.x < margin) snakeHead.turnSpeed += 1.8 * dt;
      if (snakeHead.x > width - margin) snakeHead.turnSpeed -= 1.8 * dt;
      if (snakeHead.y < margin) snakeHead.turnSpeed += 1.8 * dt;
      if (snakeHead.y > height - margin) snakeHead.turnSpeed -= 1.8 * dt;

      snakeHead.angle += snakeHead.turnSpeed * dt;

      snakeHead.x += Math.cos(snakeHead.angle) * snakeHead.speed * dt;
      snakeHead.y += Math.sin(snakeHead.angle) * snakeHead.speed * dt;

      // Clamp firmly inside container
      snakeHead.x = Math.max(12, Math.min(width - 12, snakeHead.x));
      snakeHead.y = Math.max(12, Math.min(height - 12, snakeHead.y));

      // Append to history buffer
      history.push({ x: snakeHead.x, y: snakeHead.y });
      if (history.length > MAX_HISTORY) {
        history.shift();
      }

      // 2. Update Drifting Peer Nodes
      peerNodes.forEach((node, i) => {
        node.x += node.vx * dt;
        node.y += node.vy * dt;

        // Bounce gently off boundaries
        if (node.x < 20) { node.x = 20; node.vx *= -1; }
        if (node.x > width - 20) { node.x = width - 20; node.vx *= -1; }
        if (node.y < 20) { node.y = 20; node.vy *= -1; }
        if (node.y > height - 20) { node.y = height - 20; node.vy *= -1; }

        // Subtle gentle drift perturbation
        node.vx += Math.sin(now * 0.001 + i) * 0.4 * dt;
        node.vy += Math.cos(now * 0.0012 + i) * 0.4 * dt;
      });

      // 3. Clear & Render
      ctx.clearRect(0, 0, width, height);

      // Faint background coordinate dots
      ctx.fillStyle = "rgba(245, 245, 245, 0.04)";
      for (let x = 24; x < width; x += 36) {
        for (let y = 24; y < height; y += 36) {
          ctx.fillRect(x, y, 1, 1);
        }
      }

      // Draw Main Curving & Self-Intersecting Line
      if (history.length > 2) {
        ctx.strokeStyle = "#93AA82";
        ctx.lineWidth = 1;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.beginPath();
        ctx.moveTo(history[0].x, history[0].y);

        // Smooth curve interpolation through points
        for (let i = 1; i < history.length - 1; i++) {
          const xc = (history[i].x + history[i + 1].x) / 2;
          const yc = (history[i].y + history[i + 1].y) / 2;
          ctx.quadraticCurveTo(history[i].x, history[i].y, xc, yc);
        }
        ctx.lineTo(history[history.length - 1].x, history[history.length - 1].y);
        ctx.stroke();
      }

      // Draw Snake Head: Small Hollow Circle Node
      ctx.strokeStyle = "#93AA82";
      ctx.lineWidth = 1;
      ctx.fillStyle = "#080808";
      ctx.beginPath();
      ctx.arc(snakeHead.x, snakeHead.y, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw 2-3 Drifting Hollow Circle Peer Nodes
      peerNodes.forEach((node) => {
        ctx.strokeStyle = "#93AA82";
        ctx.lineWidth = 1;
        ctx.fillStyle = "#080808";
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
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
      aria-label="Slither.io Continuous Signal Trace Scene"
    >
      <canvas ref={canvasRef} className="slither-trace-canvas" />

      {/* Subtle Telemetry Overlays */}
      <div className="slither-telemetry" aria-hidden="true">
        <div className="telemetry-top">
          <span className="telemetry-badge">
            <span className="telemetry-dot" />
            PEER MESH [3 NODES]
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
