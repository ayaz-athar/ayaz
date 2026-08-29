import React, { useEffect, useRef } from "react";

interface VoxelPoint {
  x: number;
  y: number;
  z: number;
}

// 3D waypoints in grid coordinates (0..4)
const WAYPOINTS: VoxelPoint[] = [
  { x: 0, y: 0, z: 0 },
  { x: 3, y: 0, z: 0 },
  { x: 3, y: 3, z: 0 },
  { x: 3, y: 3, z: 2 },
  { x: 1, y: 3, z: 2 },
  { x: 1, y: 1, z: 2 },
  { x: 1, y: 1, z: 3 },
  { x: 4, y: 1, z: 3 },
  { x: 4, y: 4, z: 3 },
  { x: 4, y: 4, z: 1 },
  { x: 2, y: 4, z: 1 },
  { x: 2, y: 0, z: 1 },
  { x: 0, y: 0, z: 1 },
  { x: 0, y: 0, z: 0 },
];

const SEGMENT_COUNT = 10;
const GRID_SIZE = 5;
const GRID_HEIGHT = 4;
const CELL_SIZE = 26; // pixels per unit in projection

export function SnakeScene3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Cumulative path distances
    const distances: number[] = [0];
    for (let i = 0; i < WAYPOINTS.length - 1; i++) {
      const p1 = WAYPOINTS[i];
      const p2 = WAYPOINTS[i + 1];
      const d = Math.hypot(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z);
      distances.push(distances[i] + d);
    }
    const totalLength = distances[distances.length - 1];

    const getPoint = (dist: number): VoxelPoint => {
      let d = dist % totalLength;
      if (d < 0) d += totalLength;

      for (let i = 0; i < distances.length - 1; i++) {
        if (d >= distances[i] && d <= distances[i + 1]) {
          const len = distances[i + 1] - distances[i];
          const factor = len === 0 ? 0 : (d - distances[i]) / len;
          const p1 = WAYPOINTS[i];
          const p2 = WAYPOINTS[i + 1];
          return {
            x: p1.x + (p2.x - p1.x) * factor,
            y: p1.y + (p2.y - p1.y) * factor,
            z: p1.z + (p2.z - p1.z) * factor,
          };
        }
      }
      return WAYPOINTS[0];
    };

    // Camera angles
    let currentYaw = 0;
    let currentPitch = 0;
    let targetYaw = 0;
    let targetPitch = 0;
    let isHovered = false;

    // Isometric 3D Projection
    const project = (x: number, y: number, z: number, cx: number, cy: number) => {
      const ox = (x - (GRID_SIZE - 1) / 2) * CELL_SIZE;
      const oy = (y - (GRID_SIZE - 1) / 2) * CELL_SIZE;
      const oz = (z - (GRID_HEIGHT - 1) / 2) * CELL_SIZE;

      const yaw = Math.PI / 4 + currentYaw;
      const pitch = Math.atan(1 / Math.SQRT2) + currentPitch;

      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const rx1 = ox * cosY - oy * sinY;
      const ry1 = ox * sinY + oy * cosY;
      const rz1 = oz;

      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);
      const ry2 = ry1 * cosP - rz1 * sinP;
      const rz2 = ry1 * sinP + rz1 * cosP;

      return {
        px: cx + rx1,
        py: cy + ry2,
        depth: rz2,
      };
    };

    // Draw an isometric 3D Voxel Cube
    const drawVoxelCube = (
      x: number,
      y: number,
      z: number,
      cx: number,
      cy: number,
      cubeSize: number,
      isHead: boolean,
      alpha: number
    ) => {
      const hs = cubeSize / (2 * CELL_SIZE); // half size in grid units

      // 8 corners of the cube in grid space
      const corners = [
        { x: x - hs, y: y - hs, z: z - hs }, // 0: bottom back left
        { x: x + hs, y: y - hs, z: z - hs }, // 1: bottom back right
        { x: x + hs, y: y + hs, z: z - hs }, // 2: bottom front right
        { x: x - hs, y: y + hs, z: z - hs }, // 3: bottom front left
        { x: x - hs, y: y - hs, z: z + hs }, // 4: top back left
        { x: x + hs, y: y - hs, z: z + hs }, // 5: top back right
        { x: x + hs, y: y + hs, z: z + hs }, // 6: top front right
        { x: x - hs, y: y + hs, z: z + hs }, // 7: top front left
      ].map((c) => project(c.x, c.y, c.z, cx, cy));

      // Head glow
      if (isHead) {
        const pCenter = project(x, y, z, cx, cy);
        ctx.fillStyle = "rgba(147, 170, 130, 0.25)";
        ctx.beginPath();
        ctx.arc(pCenter.px, pCenter.py, 12, 0, Math.PI * 2);
        ctx.fill();
      }

      // 1. Top Face (corners 4, 5, 6, 7)
      ctx.fillStyle = isHead
        ? "rgba(223, 240, 208, 0.95)"
        : `rgba(184, 209, 164, ${alpha * 0.9})`;
      ctx.strokeStyle = isHead
        ? "#d4e8c5"
        : `rgba(210, 230, 195, ${alpha * 0.7})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(corners[4].px, corners[4].py);
      ctx.lineTo(corners[5].px, corners[5].py);
      ctx.lineTo(corners[6].px, corners[6].py);
      ctx.lineTo(corners[7].px, corners[7].py);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // 2. Front Right Face (corners 5, 1, 2, 6)
      ctx.fillStyle = isHead
        ? "rgba(160, 185, 140, 0.9)"
        : `rgba(135, 158, 118, ${alpha * 0.75})`;
      ctx.beginPath();
      ctx.moveTo(corners[5].px, corners[5].py);
      ctx.lineTo(corners[1].px, corners[1].py);
      ctx.lineTo(corners[2].px, corners[2].py);
      ctx.lineTo(corners[6].px, corners[6].py);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // 3. Front Left Face (corners 7, 6, 2, 3)
      ctx.fillStyle = isHead
        ? "rgba(135, 158, 115, 0.85)"
        : `rgba(115, 138, 98, ${alpha * 0.65})`;
      ctx.beginPath();
      ctx.moveTo(corners[7].px, corners[7].py);
      ctx.lineTo(corners[6].px, corners[6].py);
      ctx.lineTo(corners[2].px, corners[2].py);
      ctx.lineTo(corners[3].px, corners[3].py);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    };

    // Resize handling with high-DPI scaling
    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width || 300;
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

    // Mouse Parallax
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetYaw = nx * 0.35;
      targetPitch = -ny * 0.22;
    };

    const handlePointerEnter = () => { isHovered = true; };
    const handlePointerLeave = () => {
      isHovered = false;
      targetYaw = 0;
      targetPitch = 0;
    };

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerenter", handlePointerEnter);
    container.addEventListener("pointerleave", handlePointerLeave);

    let progress = 0;
    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Speed: 0.9 units per second
      progress += dt * 0.9;

      // Ambient sway
      if (!isHovered) {
        const t = now * 0.0008;
        targetYaw = Math.sin(t) * 0.06;
        targetPitch = Math.cos(t * 0.7) * 0.04;
      }

      currentYaw += (targetYaw - currentYaw) * 0.06;
      currentPitch += (targetPitch - currentPitch) * 0.06;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2 + 8;

      // 1. Draw Ground Plane Grid (Z = 0)
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(245, 245, 245, 0.06)";
      for (let x = 0; x < GRID_SIZE; x++) {
        const p1 = project(x, 0, 0, cx, cy);
        const p2 = project(x, GRID_SIZE - 1, 0, cx, cy);
        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.stroke();
      }
      for (let y = 0; y < GRID_SIZE; y++) {
        const p1 = project(0, y, 0, cx, cy);
        const p2 = project(GRID_SIZE - 1, y, 0, cx, cy);
        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.stroke();
      }

      // 2. Draw Upper Reference Frame (Z = 2)
      ctx.strokeStyle = "rgba(147, 170, 130, 0.08)";
      ctx.setLineDash([2, 4]);
      for (let x = 0; x < GRID_SIZE; x += 2) {
        const p1 = project(x, 0, 2, cx, cy);
        const p2 = project(x, GRID_SIZE - 1, 2, cx, cy);
        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.stroke();
      }
      for (let y = 0; y < GRID_SIZE; y += 2) {
        const p1 = project(0, y, 2, cx, cy);
        const p2 = project(GRID_SIZE - 1, y, 2, cx, cy);
        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // 3. Draw Vertical Corner Pillars
      const corners = [
        { x: 0, y: 0 },
        { x: GRID_SIZE - 1, y: 0 },
        { x: GRID_SIZE - 1, y: GRID_SIZE - 1 },
        { x: 0, y: GRID_SIZE - 1 },
      ];

      ctx.strokeStyle = "rgba(245, 245, 245, 0.04)";
      corners.forEach((c) => {
        const p1 = project(c.x, c.y, 0, cx, cy);
        const p2 = project(c.x, c.y, GRID_HEIGHT - 1, cx, cy);
        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.stroke();
      });

      // 4. Target Waypoint Node
      const currentWpIndex = Math.floor((progress * 0.35) % (WAYPOINTS.length - 1)) + 1;
      const targetWp = WAYPOINTS[currentWpIndex];
      if (targetWp) {
        const tp = project(targetWp.x, targetWp.y, targetWp.z, cx, cy);
        const pulse = 0.5 + 0.5 * Math.sin(now * 0.005);

        ctx.strokeStyle = `rgba(147, 170, 130, ${0.3 + pulse * 0.4})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(tp.px, tp.py, 4.5, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "rgba(184, 209, 164, 0.8)";
        ctx.beginPath();
        ctx.arc(tp.px, tp.py, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Sample & Depth-Sort Snake Voxel Cubes
      const segments: { pt: VoxelPoint; depth: number; isHead: boolean; alpha: number }[] = [];

      for (let i = 0; i < SEGMENT_COUNT; i++) {
        const pt = getPoint(progress - i * 0.28);
        const proj = project(pt.x, pt.y, pt.z, cx, cy);
        const alpha = Math.pow(1 - i / SEGMENT_COUNT, 1.25);
        segments.push({
          pt,
          depth: proj.depth,
          isHead: i === 0,
          alpha: Math.max(0.15, alpha),
        });
      }

      // Depth sorting from back to front
      segments.sort((a, b) => a.depth - b.depth);

      // Draw each voxel cube
      segments.forEach((seg) => {
        const cubeSize = seg.isHead ? 14 : 12;
        drawVoxelCube(
          seg.pt.x,
          seg.pt.y,
          seg.pt.z,
          cx,
          cy,
          cubeSize,
          seg.isHead,
          seg.alpha
        );
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerenter", handlePointerEnter);
      container.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="snake-canvas-scene"
      aria-label="3D Isometric Voxel Snake Scene"
    >
      <canvas ref={canvasRef} className="snake-scene-canvas" />

      {/* Telemetry metadata tags */}
      <div className="snake-telemetry" aria-hidden="true">
        <div className="telemetry-top">
          <span className="telemetry-badge">
            <span className="telemetry-dot" />
            VOXEL MATRIX [5×5×4]
          </span>
          <span className="telemetry-coord">Z-AXIS 3D</span>
        </div>
        <div className="telemetry-bottom">
          <span>TRAVERSAL: CONTINUOUS</span>
          <span>ISO-35° PERSPECTIVE</span>
        </div>
      </div>
    </div>
  );
}
