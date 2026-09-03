import React, { useEffect, useRef } from "react";

export function MindScribeScene() {
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

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width || 320;
      height = rect.height || 220;
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

    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // Subtle background grid
      ctx.fillStyle = "rgba(245, 245, 245, 0.03)";
      for (let x = 16; x < width; x += 24) {
        for (let y = 16; y < height; y += 24) {
          ctx.fillRect(x, y, 1, 1);
        }
      }

      const centerX = width * 0.5;
      const centerY = height * 0.46;

      // Cognitive Resonance Waveform rings (Gemini synthesis ripples)
      for (let i = 1; i <= 3; i++) {
        const ringProgress = ((now * 0.0006 + i * 0.33) % 1);
        const radius = 22 + ringProgress * 65;
        const opacity = Math.max(0, (1 - ringProgress) * 0.35);

        ctx.strokeStyle = `rgba(147, 170, 130, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Central Neural Synthesis Core
      const pulse = Math.sin(now * 0.003) * 2;
      const coreR = 20 + pulse;

      // Outer glow disc
      const grad = ctx.createRadialGradient(centerX, centerY, 4, centerX, centerY, coreR * 1.8);
      grad.addColorStop(0, "rgba(147, 170, 130, 0.35)");
      grad.addColorStop(1, "rgba(147, 170, 130, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreR * 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Journal Core Node
      ctx.fillStyle = "#0c0c0c";
      ctx.strokeStyle = "#93AA82";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Journal Ledger / Pen Icon inside core
      ctx.fillStyle = "#dff0d0";
      ctx.font = "bold 9px ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("✦ AI", centerX, centerY);

      // Synaptic Thought Spark Orbitals (Reflections)
      for (let j = 0; j < 3; j++) {
        const angle = now * 0.0012 + (j * Math.PI * 2) / 3;
        const orbR = 48 + Math.sin(now * 0.002 + j) * 8;
        const ox = centerX + Math.cos(angle) * orbR;
        const oy = centerY + Math.sin(angle) * (orbR * 0.65);

        // Orbital beam connecting to core
        ctx.strokeStyle = "rgba(147, 170, 130, 0.22)";
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(ox, oy);
        ctx.stroke();

        // Orbital particle
        ctx.fillStyle = "#b8d1a4";
        ctx.beginPath();
        ctx.arc(ox, oy, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Live Semantic Mood & Insight Stream (Card bottom section)
      const streamY = height - 42;
      const streamW = Math.min(width * 0.88, 310);
      const streamX = (width - streamW) / 2;

      ctx.fillStyle = "rgba(12, 12, 12, 0.9)";
      ctx.strokeStyle = "rgba(147, 170, 130, 0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(streamX, streamY, streamW, 28, 4);
      ctx.fill();
      ctx.stroke();

      // Live animated insight line
      const insightProgress = Math.sin(now * 0.002);
      const moodLabel = insightProgress > 0.3 ? "INSIGHT: DEEP FOCUS" : insightProgress > -0.3 ? "GEMINI 1.5: REFLECTION ACTIVE" : "MOOD ANALYSIS: CLARITY 98%";

      ctx.fillStyle = "#93AA82";
      ctx.font = "bold 6.5px ui-monospace, monospace";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText("⚡ " + moodLabel, streamX + 10, streamY + 14);

      // Encrypted secure token badge
      ctx.fillStyle = "rgba(147, 170, 130, 0.14)";
      ctx.strokeStyle = "rgba(147, 170, 130, 0.4)";
      ctx.beginPath();
      ctx.roundRect(streamX + streamW - 84, streamY + 6, 76, 16, 3);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#dff0d0";
      ctx.font = "bold 6px ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.fillText("CLOUD RUN · ADC", streamX + streamW - 46, streamY + 14.5);

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
      className="mindscribe-scene"
      aria-label="MindScribe AI Intelligent Journal Scene"
    >
      <canvas ref={canvasRef} className="mindscribe-canvas" />

      {/* Telemetry HUD Overlays */}
      <div className="mindscribe-telemetry" aria-hidden="true">
        <div className="telemetry-top">
          <span className="telemetry-badge">
            <span className="telemetry-dot" />
            MINDSCRIBE AI [INTELLIGENT JOURNAL]
          </span>
          <span className="telemetry-coord">GEMINI 1.5 · CLOUD RUN</span>
        </div>
        <div className="telemetry-bottom">
          <span>PER-USER FIRESTORE /users/&#123;uid&#125;</span>
          <span>BEARER JWT · AUTHENTICATED</span>
        </div>
      </div>
    </div>
  );
}
