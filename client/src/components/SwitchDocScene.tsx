import React, { useEffect, useRef } from "react";

interface FormatPill {
  ext: string;
  label: string;
  active: boolean;
}

export function SwitchDocScene() {
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

    // Responsive Canvas Resizing with devicePixelRatio
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

    const outputFormats: FormatPill[] = [
      { ext: ".PDF", label: "PRINT READY", active: true },
      { ext: ".DOCX", label: "STRUCTURED XML", active: false },
      { ext: ".MD", label: "CLEAN SYNTAX", active: true },
      { ext: ".JSON", label: "AST SCHEMA", active: true },
    ];

    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // Background telemetry grid dots
      ctx.fillStyle = "rgba(245, 245, 245, 0.035)";
      for (let x = 20; x < width; x += 28) {
        for (let y = 20; y < height; y += 28) {
          ctx.fillRect(x, y, 1, 1);
        }
      }

      const leftX = width * 0.2;
      const centerY = height * 0.5;
      const coreX = width * 0.5;
      const rightX = width * 0.72;

      // 1. Source Document Silhouette (Left)
      const docW = Math.min(width * 0.22, 68);
      const docH = Math.min(height * 0.55, 96);
      const docX = leftX - docW / 2;
      const docY = centerY - docH / 2;

      ctx.fillStyle = "rgba(16, 16, 16, 0.9)";
      ctx.strokeStyle = "rgba(147, 170, 130, 0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(docX, docY, docW, docH, 4);
      ctx.fill();
      ctx.stroke();

      // Header Tag on source doc
      ctx.fillStyle = "#93AA82";
      ctx.fillRect(docX + 8, docY + 10, 16, 2.5);

      // Text line placeholders
      for (let i = 0; i < 6; i++) {
        const lineY = docY + 20 + i * 11;
        const lineW = (docW - 16) * (0.5 + ((i * 3) % 5) * 0.1);
        ctx.fillStyle = i === 0 ? "rgba(147, 170, 130, 0.6)" : "rgba(245, 245, 245, 0.15)";
        ctx.fillRect(docX + 8, lineY, lineW, 1.5);
      }

      // Source Format Badge
      ctx.fillStyle = "#dff0d0";
      ctx.font = "bold 6.5px ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.fillText("SRC: RAW DOC", leftX, docY + docH - 8);

      // 2. Conversion Switch Engine Core (Center)
      const coreRadius = 22;

      // Pulsing outer orbit ring
      ctx.strokeStyle = "rgba(147, 170, 130, 0.3)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.arc(coreX, centerY, coreRadius + 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Rotating core ring
      const angle = now * 0.002;
      ctx.strokeStyle = "#93AA82";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(coreX, centerY, coreRadius, angle, angle + Math.PI * 1.4);
      ctx.stroke();

      // Center Core Disc
      ctx.fillStyle = "rgba(12, 12, 12, 0.95)";
      ctx.beginPath();
      ctx.arc(coreX, centerY, coreRadius - 2, 0, Math.PI * 2);
      ctx.fill();

      // Core icon: Switch Arrows (⇄)
      ctx.fillStyle = "#dcead0";
      ctx.font = "bold 9px ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.fillText("⇄", coreX, centerY + 3);

      // 3. Flowing Stream Rays (Left -> Center -> Right)
      // Stream Left to Center
      ctx.strokeStyle = "rgba(147, 170, 130, 0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(docX + docW, centerY);
      ctx.lineTo(coreX - coreRadius - 6, centerY);
      ctx.stroke();

      // Moving particle Left -> Center
      const p1T = (now * 0.001) % 1;
      const p1X = docX + docW + p1T * (coreX - coreRadius - 6 - (docX + docW));
      ctx.fillStyle = "#93AA82";
      ctx.beginPath();
      ctx.arc(p1X, centerY, 2, 0, Math.PI * 2);
      ctx.fill();

      // Stream Center to Right Formats
      const targetW = Math.min(width * 0.35, 120);
      const startTargetY = centerY - 38;

      outputFormats.forEach((format, idx) => {
        const rowY = startTargetY + idx * 24;
        const boxX = rightX - 10;

        // Connector curve from Core to Format box
        ctx.strokeStyle = "rgba(147, 170, 130, 0.2)";
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(coreX + coreRadius + 6, centerY);
        ctx.bezierCurveTo(
          coreX + coreRadius + 24,
          centerY,
          boxX - 20,
          rowY + 9,
          boxX,
          rowY + 9
        );
        ctx.stroke();

        // Moving particle to this target branch
        const pT = ((now * 0.0008 + idx * 0.25) % 1);
        const bx1 = coreX + coreRadius + 24, by1 = centerY;
        const bx2 = boxX - 20, by2 = rowY + 9;
        const sx = coreX + coreRadius + 6, sy = centerY;
        const ex = boxX, ey = rowY + 9;

        const pX =
          Math.pow(1 - pT, 3) * sx +
          3 * Math.pow(1 - pT, 2) * pT * bx1 +
          3 * (1 - pT) * Math.pow(pT, 2) * bx2 +
          Math.pow(pT, 3) * ex;

        const pY =
          Math.pow(1 - pT, 3) * sy +
          3 * Math.pow(1 - pT, 2) * pT * by1 +
          3 * (1 - pT) * Math.pow(pT, 2) * by2 +
          Math.pow(pT, 3) * ey;

        ctx.fillStyle = "#b8d1a4";
        ctx.beginPath();
        ctx.arc(pX, pY, 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Format Output Box
        ctx.fillStyle = "rgba(14, 14, 14, 0.9)";
        ctx.strokeStyle = idx === 0 ? "rgba(147, 170, 130, 0.4)" : "rgba(147, 170, 130, 0.2)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(boxX, rowY, targetW, 18, 3);
        ctx.fill();
        ctx.stroke();

        // Extension Tag
        ctx.fillStyle = "#dff0d0";
        ctx.font = "bold 7px ui-monospace, monospace";
        ctx.textAlign = "left";
        ctx.fillText(format.ext, boxX + 8, rowY + 11.5);

        // Sublabel
        ctx.fillStyle = "#888888";
        ctx.font = "5.5px ui-monospace, monospace";
        ctx.textAlign = "right";
        ctx.fillText(format.label, boxX + targetW - 6, rowY + 11.5);
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
      className="switchdoc-scene"
      aria-label="SwitchDoc Document Engine Scene"
    >
      <canvas ref={canvasRef} className="switchdoc-canvas" />

      {/* Telemetry HUD Overlays */}
      <div className="switchdoc-telemetry" aria-hidden="true">
        <div className="telemetry-top">
          <span className="telemetry-badge">
            <span className="telemetry-dot" />
            SWITCHDOC [TRANSFORMATION ENGINE]
          </span>
          <span className="telemetry-coord">LATENCY: 180ms · PARSER</span>
        </div>
        <div className="telemetry-bottom">
          <span>PIPELINE: DOCX ➔ MD ➔ PDF ➔ JSON</span>
          <span>SYSTEM: HIGH-PRECISION AST PARSER</span>
        </div>
      </div>
    </div>
  );
}
