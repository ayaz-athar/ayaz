import React, { useEffect, useRef, useState } from "react";

interface VoxelPoint {
  x: number;
  y: number;
  z: number;
}

// 3D waypoints in grid units (0..4)
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

const SEGMENT_COUNT = 9;
const CELL_PX = 32; // pixel spacing per grid unit
const VOXEL_SIZE = 14; // size of each voxel cube

export function SnakeScene3D() {
  const [segments, setSegments] = useState<{ x: number; y: number; z: number; alpha: number }[]>([]);
  const [targetPoint, setTargetPoint] = useState<VoxelPoint>(WAYPOINTS[2]);
  const progressRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef(performance.now());

  // Cumulative distances
  const distancesRef = useRef<number[]>([]);
  const totalLengthRef = useRef(0);

  useEffect(() => {
    const dists = [0];
    for (let i = 0; i < WAYPOINTS.length - 1; i++) {
      const p1 = WAYPOINTS[i];
      const p2 = WAYPOINTS[i + 1];
      const d = Math.hypot(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z);
      dists.push(dists[i] + d);
    }
    distancesRef.current = dists;
    totalLengthRef.current = dists[dists.length - 1];
  }, []);

  const getPoint = (dist: number): VoxelPoint => {
    const total = totalLengthRef.current || 1;
    let d = dist % total;
    if (d < 0) d += total;

    const dists = distancesRef.current;
    for (let i = 0; i < dists.length - 1; i++) {
      if (d >= dists[i] && d <= dists[i + 1]) {
        const len = dists[i + 1] - dists[i];
        const factor = len === 0 ? 0 : (d - dists[i]) / len;
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

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      // Set static segments mid-path
      const staticSegs = [];
      for (let i = 0; i < SEGMENT_COUNT; i++) {
        const pt = getPoint(4.5 - i * 0.28);
        staticSegs.push({
          x: (pt.x - 2) * CELL_PX,
          y: (pt.y - 2) * CELL_PX,
          z: pt.z * CELL_PX,
          alpha: Math.pow(1 - i / SEGMENT_COUNT, 1.2),
        });
      }
      setSegments(staticSegs);
      return;
    }

    const animate = (now: number) => {
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      // Speed: 0.95 units per second
      progressRef.current += dt * 0.95;

      const segs = [];
      for (let i = 0; i < SEGMENT_COUNT; i++) {
        const pt = getPoint(progressRef.current - i * 0.28);
        segs.push({
          x: (pt.x - 2) * CELL_PX,
          y: (pt.y - 2) * CELL_PX,
          z: pt.z * CELL_PX,
          alpha: Math.pow(1 - i / SEGMENT_COUNT, 1.2),
        });
      }
      setSegments(segs);

      // Target waypoint indicator
      const currentWpIndex = Math.floor((progressRef.current * 0.35) % (WAYPOINTS.length - 1)) + 1;
      setTargetPoint(WAYPOINTS[currentWpIndex]);

      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return (
    <div className="snake-css3d-scene" aria-label="Isometric 3D Voxel Snake Scene">
      <div className="snake-stage-wrap">
        <div className="snake-stage">
          {/* Base Grid Plane (Z = 0) */}
          <div className="voxel-grid-plane grid-level-0">
            {Array.from({ length: 5 }).map((_, r) => (
              <div key={`row-${r}`} className="grid-row">
                {Array.from({ length: 5 }).map((_, c) => (
                  <span key={`cell-${r}-${c}`} className="grid-cell" />
                ))}
              </div>
            ))}
          </div>

          {/* Upper Reference Grid Plane (Z = 2) */}
          <div className="voxel-grid-plane grid-level-mid">
            {Array.from({ length: 5 }).map((_, r) => (
              <div key={`row-mid-${r}`} className="grid-row">
                {Array.from({ length: 5 }).map((_, c) => (
                  <span key={`cell-mid-${r}-${c}`} className="grid-cell" />
                ))}
              </div>
            ))}
          </div>

          {/* Top Bounding Plane (Z = 3) */}
          <div className="voxel-grid-plane grid-level-top">
            {Array.from({ length: 5 }).map((_, r) => (
              <div key={`row-top-${r}`} className="grid-row">
                {Array.from({ length: 5 }).map((_, c) => (
                  <span key={`cell-top-${r}-${c}`} className="grid-cell" />
                ))}
              </div>
            ))}
          </div>

          {/* Vertical Corner Boundary Pillars */}
          <div className="corner-pillar pillar-1" />
          <div className="corner-pillar pillar-2" />
          <div className="corner-pillar pillar-3" />
          <div className="corner-pillar pillar-4" />

          {/* Target Waypoint Indicator Node */}
          {targetPoint && (
            <div
              className="target-node"
              style={{
                transform: `translate3d(${(targetPoint.x - 2) * CELL_PX}px, ${(targetPoint.y - 2) * CELL_PX}px, ${targetPoint.z * CELL_PX}px)`,
              }}
            >
              <div className="target-pulse" />
              <div className="target-core" />
            </div>
          )}

          {/* 3D Snake Voxel Cubes */}
          {segments.map((seg, idx) => {
            const isHead = idx === 0;
            const half = VOXEL_SIZE / 2;
            return (
              <div
                key={idx}
                className={`voxel-cube ${isHead ? "is-head" : ""}`}
                style={{
                  width: `${VOXEL_SIZE}px`,
                  height: `${VOXEL_SIZE}px`,
                  transform: `translate3d(${seg.x}px, ${seg.y}px, ${seg.z}px)`,
                  opacity: isHead ? 1 : Math.max(0.18, seg.alpha),
                }}
              >
                <div className="cube-face cube-top" style={{ transform: `rotateX(90deg) translateZ(${half}px)` }} />
                <div className="cube-face cube-front" style={{ transform: `translateZ(${half}px)` }} />
                <div className="cube-face cube-back" style={{ transform: `rotateY(180deg) translateZ(${half}px)` }} />
                <div className="cube-face cube-left" style={{ transform: `rotateY(-90deg) translateZ(${half}px)` }} />
                <div className="cube-face cube-right" style={{ transform: `rotateY(90deg) translateZ(${half}px)` }} />
                <div className="cube-face cube-bottom" style={{ transform: `rotateX(-90deg) translateZ(${half}px)` }} />
              </div>
            );
          })}
        </div>
      </div>

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
