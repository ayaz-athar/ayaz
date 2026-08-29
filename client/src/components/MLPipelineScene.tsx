import React, { useEffect, useRef } from "react";

interface PipelineNode {
  id: string;
  label: string;
  sublabel: string;
  xRatio: number; // 0..1
  yRatio: number; // 0..1
  status: string;
}

interface DataPacket {
  edgeIndex: number;
  progress: number; // 0..1
  speed: number;
}

export function MLPipelineScene() {
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

    // Pipeline DAG Nodes Definition
    const nodes: PipelineNode[] = [
      { id: "ingest", label: "01 INGEST", sublabel: "ETL / CSV / SQL", xRatio: 0.14, yRatio: 0.5, status: "STREAMING" },
      { id: "clean", label: "02 PROCESS", sublabel: "PCA & SCALER", xRatio: 0.38, yRatio: 0.5, status: "NORMALIZED" },
      { id: "train", label: "03 TRAIN", sublabel: "XGB / ENSEMBLE", xRatio: 0.62, yRatio: 0.36, status: "FITTING" },
      { id: "eval", label: "04 EVAL", sublabel: "AUC 0.992", xRatio: 0.62, yRatio: 0.68, status: "VALIDATED" },
      { id: "deploy", label: "05 SERVE", sublabel: "ONNX / FASTAPI", xRatio: 0.86, yRatio: 0.5, status: "READY" },
    ];

    // Directed edges connecting nodes (fromIndex -> toIndex)
    const edges = [
      { from: 0, to: 1 }, // ingest -> clean
      { from: 1, to: 2 }, // clean -> train
      { from: 1, to: 3 }, // clean -> eval
      { from: 2, to: 4 }, // train -> deploy
      { from: 3, to: 4 }, // eval -> deploy
    ];

    // Data packets flowing along the edges
    const packets: DataPacket[] = [
      { edgeIndex: 0, progress: 0.1, speed: 0.65 },
      { edgeIndex: 0, progress: 0.6, speed: 0.65 },
      { edgeIndex: 1, progress: 0.25, speed: 0.55 },
      { edgeIndex: 2, progress: 0.45, speed: 0.55 },
      { edgeIndex: 3, progress: 0.7, speed: 0.6 },
      { edgeIndex: 4, progress: 0.3, speed: 0.6 },
    ];

    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Update data packet progress along edges
      packets.forEach((p) => {
        p.progress += p.speed * dt;
        if (p.progress > 1) {
          p.progress = 0;
          // cycle to next or parallel branch
          if (p.edgeIndex === 0) p.edgeIndex = Math.random() > 0.5 ? 1 : 2;
          else if (p.edgeIndex === 1) p.edgeIndex = 3;
          else if (p.edgeIndex === 2) p.edgeIndex = 4;
          else p.edgeIndex = 0;
        }
      });

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Background telemetry grid dots
      ctx.fillStyle = "rgba(245, 245, 245, 0.035)";
      for (let x = 20; x < width; x += 28) {
        for (let y = 20; y < height; y += 28) {
          ctx.fillRect(x, y, 1, 1);
        }
      }

      // 1. Draw DAG Connection Rails
      edges.forEach((edge) => {
        const n1 = nodes[edge.from];
        const n2 = nodes[edge.to];
        const x1 = n1.xRatio * width;
        const y1 = n1.yRatio * height;
        const x2 = n2.xRatio * width;
        const y2 = n2.yRatio * height;

        ctx.strokeStyle = "rgba(147, 170, 130, 0.22)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x1, y1);

        // Gentle horizontal-first cubic curve
        const midX = (x1 + x2) / 2;
        ctx.bezierCurveTo(midX, y1, midX, y2, x2, y2);
        ctx.stroke();

        // Secondary faint dashed guide
        ctx.strokeStyle = "rgba(245, 245, 245, 0.04)";
        ctx.setLineDash([2, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // 2. Draw Flowing Data Packets
      packets.forEach((p) => {
        const edge = edges[p.edgeIndex];
        if (!edge) return;
        const n1 = nodes[edge.from];
        const n2 = nodes[edge.to];
        const x1 = n1.xRatio * width;
        const y1 = n1.yRatio * height;
        const x2 = n2.xRatio * width;
        const y2 = n2.yRatio * height;

        const t = p.progress;
        const midX = (x1 + x2) / 2;

        // Calculate position on cubic bezier curve at parameter t
        const cx1 = midX, cy1 = y1;
        const cx2 = midX, cy2 = y2;

        const px =
          Math.pow(1 - t, 3) * x1 +
          3 * Math.pow(1 - t, 2) * t * cx1 +
          3 * (1 - t) * Math.pow(t, 2) * cx2 +
          Math.pow(t, 3) * x2;

        const py =
          Math.pow(1 - t, 3) * y1 +
          3 * Math.pow(1 - t, 2) * t * cy1 +
          3 * (1 - t) * Math.pow(t, 2) * cy2 +
          Math.pow(t, 3) * y2;

        // Glowing packet halo
        ctx.fillStyle = "rgba(147, 170, 130, 0.25)";
        ctx.beginPath();
        ctx.arc(px, py, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Packet core
        ctx.fillStyle = "#dff0d0";
        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Draw Modular Pipeline Nodes
      nodes.forEach((n, idx) => {
        const nx = n.xRatio * width;
        const ny = n.yRatio * height;
        const boxW = Math.min(width * 0.18, 72);
        const boxH = 34;

        // Stage Container Box
        ctx.fillStyle = "rgba(14, 14, 14, 0.9)";
        ctx.strokeStyle = idx === 2 ? "rgba(147, 170, 130, 0.45)" : "rgba(147, 170, 130, 0.22)";
        ctx.lineWidth = 1;

        const rx = nx - boxW / 2;
        const ry = ny - boxH / 2;
        const radius = 4;

        ctx.beginPath();
        ctx.roundRect(rx, ry, boxW, boxH, radius);
        ctx.fill();
        ctx.stroke();

        // Status indicator dot
        ctx.fillStyle = "#93AA82";
        ctx.beginPath();
        ctx.arc(rx + 6, ry + 9, 2, 0, Math.PI * 2);
        ctx.fill();

        // Stage Title
        ctx.fillStyle = "#e5e5e5";
        ctx.font = "bold 7px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
        ctx.textAlign = "left";
        ctx.fillText(n.label, rx + 12, ry + 11);

        // Stage Subtitle / Tech
        ctx.fillStyle = "#888888";
        ctx.font = "6px ui-monospace, monospace";
        ctx.fillText(n.sublabel, rx + 6, ry + 24);
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
      className="ml-pipeline-scene"
      aria-label="Python ML Pipeline Architecture Scene"
    >
      <canvas ref={canvasRef} className="ml-pipeline-canvas" />

      {/* Telemetry HUD Overlays */}
      <div className="pipeline-telemetry" aria-hidden="true">
        <div className="telemetry-top">
          <span className="telemetry-badge">
            <span className="telemetry-dot" />
            PIPELINE ARCHITECTURE [MODULAR DAG]
          </span>
          <span className="telemetry-coord">PYTHON 3.11 · MLOps</span>
        </div>
        <div className="telemetry-bottom">
          <span>FLOW: ETL ➔ PREPROCESS ➔ TRAIN ➔ SERVE</span>
          <span>ENGINE: SCIKIT-LEARN / XGB</span>
        </div>
      </div>
    </div>
  );
}
