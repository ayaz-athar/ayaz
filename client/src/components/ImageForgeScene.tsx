import React, { useEffect, useRef } from "react";

export function ImageForgeScene() {
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

    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // Background subtle coordinate grid dots
      ctx.fillStyle = "rgba(245, 245, 245, 0.035)";
      for (let x = 20; x < width; x += 28) {
        for (let y = 20; y < height; y += 28) {
          ctx.fillRect(x, y, 1, 1);
        }
      }

      const centerY = height * 0.5;
      const previewW = Math.min(width * 0.76, 260);
      const previewH = Math.min(height * 0.62, 130);
      const previewX = (width - previewW) / 2;
      const previewY = (height - previewH) / 2;

      // Outer Preview Frame
      ctx.fillStyle = "rgba(14, 14, 14, 0.92)";
      ctx.strokeStyle = "rgba(147, 170, 130, 0.28)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(previewX, previewY, previewW, previewH, 6);
      ctx.fill();
      ctx.stroke();

      // Oscillating Split Slider position (40% to 65%)
      const splitT = (Math.sin(now * 0.0016) + 1) / 2; // 0..1
      const splitX = previewX + previewW * (0.35 + splitT * 0.35);

      // Save context for clipping Left side (Original PNG)
      ctx.save();
      ctx.beginPath();
      ctx.rect(previewX, previewY, splitX - previewX, previewH);
      ctx.clip();

      // --- LEFT SIDE: Original Raw Image Graphic ---
      // Wireframe graphic representing original image details
      ctx.strokeStyle = "rgba(245, 245, 245, 0.2)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const rad = 16 + i * 14;
        ctx.beginPath();
        ctx.arc(previewX + previewW * 0.5, centerY, rad, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Diamond focal element
      ctx.save();
      ctx.translate(previewX + previewW * 0.5, centerY);
      ctx.rotate(Math.PI / 4);
      ctx.strokeStyle = "rgba(147, 170, 130, 0.5)";
      ctx.strokeRect(-18, -18, 36, 36);
      ctx.restore();

      // Original Format Badge (Top Left)
      ctx.fillStyle = "rgba(8, 8, 8, 0.85)";
      ctx.strokeStyle = "rgba(245, 245, 245, 0.2)";
      ctx.beginPath();
      ctx.roundRect(previewX + 10, previewY + 10, 68, 18, 3);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#e0e0e0";
      ctx.font = "bold 6.5px ui-monospace, monospace";
      ctx.textAlign = "left";
      ctx.fillText("PNG · 2.8 MB", previewX + 16, previewY + 21.5);

      ctx.restore();

      // Save context for clipping Right side (Converted WebP)
      ctx.save();
      ctx.beginPath();
      ctx.rect(splitX, previewY, previewX + previewW - splitX, previewH);
      ctx.clip();

      // --- RIGHT SIDE: Compressed & Optimized WebP Graphic ---
      // Clean compressed geometric visual
      ctx.strokeStyle = "rgba(147, 170, 130, 0.4)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const rad = 16 + i * 14;
        ctx.beginPath();
        ctx.arc(previewX + previewW * 0.5, centerY, rad, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Diamond focal element in moss-green
      ctx.save();
      ctx.translate(previewX + previewW * 0.5, centerY);
      ctx.rotate(Math.PI / 4);
      ctx.strokeStyle = "#93AA82";
      ctx.lineWidth = 1.2;
      ctx.strokeRect(-18, -18, 36, 36);

      // Spark aperture
      ctx.fillStyle = "#dff0d0";
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Converted Format Badge (Top Right)
      const badgeW = 76;
      ctx.fillStyle = "rgba(8, 8, 8, 0.85)";
      ctx.strokeStyle = "rgba(147, 170, 130, 0.5)";
      ctx.beginPath();
      ctx.roundRect(previewX + previewW - badgeW - 10, previewY + 10, badgeW, 18, 3);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#93AA82";
      ctx.font = "bold 6.5px ui-monospace, monospace";
      ctx.textAlign = "left";
      ctx.fillText("WEBP · 420 KB", previewX + previewW - badgeW - 4, previewY + 21.5);

      ctx.restore();

      // --- Split Slider Divider Line ---
      ctx.strokeStyle = "#93AA82";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(splitX, previewY);
      ctx.lineTo(splitX, previewY + previewH);
      ctx.stroke();

      // Split Handle Circle (Center)
      ctx.fillStyle = "#080808";
      ctx.strokeStyle = "#b8d1a4";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(splitX, centerY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Handle arrows inside circle
      ctx.fillStyle = "#93AA82";
      ctx.font = "bold 7px ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.fillText("⇄", splitX, centerY + 2.5);

      // Bottom Saving Pill
      const pillW = 100;
      const pillH = 17;
      const pillX = previewX + (previewW - pillW) / 2;
      const pillY = previewY + previewH - 24;

      ctx.fillStyle = "rgba(147, 170, 130, 0.14)";
      ctx.strokeStyle = "rgba(147, 170, 130, 0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillW, pillH, 3);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#dff0d0";
      ctx.font = "bold 6.5px ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.fillText("SAVED 85% · LOSSLESS", pillX + pillW / 2, pillY + 11);

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
      className="imageforge-scene"
      aria-label="ImageForge Client-Side Image Converter Scene"
    >
      <canvas ref={canvasRef} className="imageforge-canvas" />

      {/* Telemetry HUD Overlays */}
      <div className="imageforge-telemetry" aria-hidden="true">
        <div className="telemetry-top">
          <span className="telemetry-badge">
            <span className="telemetry-dot" />
            IMAGEFORGE [CLIENT-SIDE CONVERTER]
          </span>
          <span className="telemetry-coord">HTML5 CANVAS · IN-MEMORY</span>
        </div>
        <div className="telemetry-bottom">
          <span>ZERO UPLOADS · 100% PRIVATE</span>
          <span>WEBP · JPG · PNG · GIF</span>
        </div>
      </div>
    </div>
  );
}
