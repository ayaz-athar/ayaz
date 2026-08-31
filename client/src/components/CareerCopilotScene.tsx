import React, { useEffect, useRef } from "react";

interface SkillTag {
  name: string;
  matched: boolean;
  score: number;
}

export function CareerCopilotScene() {
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

    const skills: SkillTag[] = [
      { name: "Python / FastAPI", matched: true, score: 98 },
      { name: "AI / LLM Agents", matched: true, score: 95 },
      { name: "System Design", matched: true, score: 92 },
      { name: "Full Stack / React", matched: true, score: 94 },
    ];

    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // Background subtle grid dots
      ctx.fillStyle = "rgba(245, 245, 245, 0.035)";
      for (let x = 20; x < width; x += 28) {
        for (let y = 20; y < height; y += 28) {
          ctx.fillRect(x, y, 1, 1);
        }
      }

      const cx = width * 0.28;
      const cy = height * 0.5;
      const docW = Math.min(width * 0.32, 110);
      const docH = Math.min(height * 0.68, 130);

      // 1. Draw Document / Resume Silhouette (Left side)
      const docX = cx - docW / 2;
      const docY = cy - docH / 2;

      ctx.fillStyle = "rgba(16, 16, 16, 0.9)";
      ctx.strokeStyle = "rgba(147, 170, 130, 0.28)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(docX, docY, docW, docH, 5);
      ctx.fill();
      ctx.stroke();

      // Document Header Icon & Lines
      ctx.fillStyle = "#93AA82";
      ctx.fillRect(docX + 10, docY + 12, 18, 2.5);

      ctx.fillStyle = "rgba(245, 245, 245, 0.4)";
      ctx.fillRect(docX + 32, docY + 12, docW - 44, 2);

      // Simulated Content Paragraph Lines
      const lineSpacing = 8;
      let curY = docY + 24;

      for (let i = 0; i < 8; i++) {
        curY += lineSpacing;
        if (i === 3) curY += 6; // paragraph break
        if (curY > docY + docH - 12) break;

        const isHeading = i === 0 || i === 4;
        const lineW = isHeading ? docW * 0.45 : (docW - 20) * (0.6 + (i % 3) * 0.15);

        ctx.fillStyle = isHeading ? "rgba(147, 170, 130, 0.7)" : "rgba(245, 245, 245, 0.12)";
        ctx.fillRect(docX + 10, curY, lineW, isHeading ? 2 : 1.5);
      }

      // Vertical Laser Scanning Sweep Beam across Document
      const scanProgress = (Math.sin(now * 0.002) + 1) / 2; // 0..1
      const scanY = docY + scanProgress * docH;

      const scanGrad = ctx.createLinearGradient(docX, scanY - 6, docX, scanY + 6);
      scanGrad.addColorStop(0, "rgba(147, 170, 130, 0)");
      scanGrad.addColorStop(0.5, "rgba(147, 170, 130, 0.4)");
      scanGrad.addColorStop(1, "rgba(147, 170, 130, 0)");

      ctx.fillStyle = scanGrad;
      ctx.fillRect(docX, scanY - 6, docW, 12);

      ctx.strokeStyle = "#b8d1a4";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(docX, scanY);
      ctx.lineTo(docX + docW, scanY);
      ctx.stroke();

      // 2. Connector Track to AI Evaluation Matrix (Center to Right)
      const targetCenterX = width * 0.68;
      const targetCenterY = height * 0.5;

      ctx.strokeStyle = "rgba(147, 170, 130, 0.25)";
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.moveTo(docX + docW, cy);
      ctx.lineTo(targetCenterX - width * 0.18, cy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Flowing data particle
      const packetT = (now * 0.0008) % 1;
      const pX = docX + docW + packetT * (targetCenterX - width * 0.18 - (docX + docW));
      ctx.fillStyle = "#93AA82";
      ctx.beginPath();
      ctx.arc(pX, cy, 2, 0, Math.PI * 2);
      ctx.fill();

      // 3. AI Skills & Match Scoring Matrix (Right Side)
      const rightX = targetCenterX - width * 0.16;
      const rightW = Math.min(width * 0.42, 150);
      let skillY = targetCenterY - 48;

      skills.forEach((skill, idx) => {
        const rowY = skillY + idx * 24;

        // Skill Pill Background
        ctx.fillStyle = "rgba(14, 14, 14, 0.85)";
        ctx.strokeStyle = "rgba(147, 170, 130, 0.2)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(rightX, rowY, rightW, 18, 3);
        ctx.fill();
        ctx.stroke();

        // Checkmark badge / Match status
        ctx.fillStyle = "#93AA82";
        ctx.beginPath();
        ctx.arc(rightX + 9, rowY + 9, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Skill Name
        ctx.fillStyle = "#e0e0e0";
        ctx.font = "bold 6.5px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
        ctx.textAlign = "left";
        ctx.fillText(skill.name, rightX + 16, rowY + 11.5);

        // Score percentage
        ctx.fillStyle = "#93AA82";
        ctx.font = "6.5px ui-monospace, monospace";
        ctx.textAlign = "right";
        ctx.fillText(`${skill.score}%`, rightX + rightW - 6, rowY + 11.5);
      });

      // 4. Overall Match Gauge Badge (Bottom Right)
      const badgeX = rightX;
      const badgeY = targetCenterY + 54;
      ctx.fillStyle = "rgba(147, 170, 130, 0.12)";
      ctx.strokeStyle = "rgba(147, 170, 130, 0.45)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, rightW, 20, 3);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#dff0d0";
      ctx.font = "bold 7px ui-monospace, monospace";
      ctx.textAlign = "left";
      ctx.fillText("ATS MATCH INDEX", badgeX + 8, badgeY + 12.5);

      ctx.fillStyle = "#93AA82";
      ctx.font = "bold 8px ui-monospace, monospace";
      ctx.textAlign = "right";
      ctx.fillText("94.8%", badgeX + rightW - 8, badgeY + 13);

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
      className="career-copilot-scene"
      aria-label="Career Copilot AI ATS Analyzer Scene"
    >
      <canvas ref={canvasRef} className="career-copilot-canvas" />

      {/* Telemetry HUD Overlays */}
      <div className="copilot-telemetry" aria-hidden="true">
        <div className="telemetry-top">
          <span className="telemetry-badge">
            <span className="telemetry-dot" />
            CAREER COPILOT [AI ATS PARSER]
          </span>
          <span className="telemetry-coord">MATCH: 94.8% · LLM</span>
        </div>
        <div className="telemetry-bottom">
          <span>PARSING: RESUME ➔ JOB SPEC FIT</span>
          <span>SYSTEM: FASTAPI / LLM AGENT</span>
        </div>
      </div>
    </div>
  );
}
