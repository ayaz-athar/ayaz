import React, { useEffect, useRef, useState } from "react";

export function SpeedGaugeScene() {
  const [speedValue, setSpeedValue] = useState(0);
  const [pingValue, setPingValue] = useState(8.4);
  const [needleAngle, setNeedleAngle] = useState(-110); // degrees
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setSpeedValue(842.0);
      setNeedleAngle(72);
      setPingValue(8.4);
      return;
    }

    const TARGET_SPEED = 846.5;
    const MIN_ANGLE = -110; // 0 Mbps
    const MAX_ANGLE = 110; // 1000 Mbps
    const TARGET_ANGLE = MIN_ANGLE + (TARGET_SPEED / 1000) * (MAX_ANGLE - MIN_ANGLE);

    let currentAngle = MIN_ANGLE;
    let currentSpeed = 0;
    let startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = (now - startTime) / 1000;

      if (elapsed < 1.4) {
        // Initial smooth sweep up to target speed using cubic ease-out
        const progress = Math.min(elapsed / 1.4, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);

        currentAngle = MIN_ANGLE + (TARGET_ANGLE - MIN_ANGLE) * easeOut;
        currentSpeed = TARGET_SPEED * easeOut;
      } else {
        // Subtle living oscillation around resting throughput
        const t = now * 0.002;
        const jitter = Math.sin(t) * 4.2 + Math.cos(t * 1.7) * 2.1;
        const liveSpeed = TARGET_SPEED + jitter;
        const liveAngle = MIN_ANGLE + (liveSpeed / 1000) * (MAX_ANGLE - MIN_ANGLE);

        // Smooth damping
        currentAngle += (liveAngle - currentAngle) * 0.08;
        currentSpeed += (liveSpeed - currentSpeed) * 0.08;
      }

      setNeedleAngle(currentAngle);
      setSpeedValue(parseFloat(currentSpeed.toFixed(1)));
      setPingValue(parseFloat((8.2 + Math.sin(now * 0.0015) * 0.4).toFixed(1)));

      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  // Gauge geometry configuration
  const CX = 160;
  const CY = 120;
  const RADIUS = 88;
  const START_ANGLE = -110;
  const END_ANGLE = 110;
  const TOTAL_TICKS = 21;

  // Generate tick marks
  const ticks = Array.from({ length: TOTAL_TICKS }).map((_, i) => {
    const frac = i / (TOTAL_TICKS - 1);
    const deg = START_ANGLE + frac * (END_ANGLE - START_ANGLE);
    const rad = (deg - 90) * (Math.PI / 180);

    const isMajor = i % 4 === 0;
    const tickLen = isMajor ? 10 : 5;
    const r1 = RADIUS;
    const r2 = RADIUS - tickLen;

    const x1 = CX + r1 * Math.cos(rad);
    const y1 = CY + r1 * Math.sin(rad);
    const x2 = CX + r2 * Math.cos(rad);
    const y2 = CY + r2 * Math.sin(rad);

    const labelVal = isMajor ? Math.round(frac * 1000) : null;
    const labelR = RADIUS - 18;
    const lx = CX + labelR * Math.cos(rad);
    const ly = CY + labelR * Math.sin(rad) + 3;

    return { x1, y1, x2, y2, isMajor, labelVal, lx, ly };
  });

  return (
    <div
      className="speedtest-gauge-scene"
      aria-label="SpeedTest Benchmark Gauge Visualizer"
    >
      <div className="gauge-viewport">
        <svg
          className="gauge-svg"
          viewBox="0 0 320 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Concentric Hairline Guide Arcs */}
          <path
            d="M 68 120 A 92 92 0 1 1 252 120"
            stroke="rgba(245, 245, 245, 0.05)"
            strokeWidth="1"
            strokeDasharray="2 4"
          />
          <path
            d="M 88 120 A 72 72 0 1 1 232 120"
            stroke="rgba(245, 245, 245, 0.03)"
            strokeWidth="1"
          />

          {/* Outer Main Gauge Arc */}
          <path
            d="M 72 120 A 88 88 0 1 1 248 120"
            stroke="#222222"
            strokeWidth="1"
          />

          {/* Active Flow Sub-Arc (Moss-Green) */}
          <path
            d="M 72 120 A 88 88 0 0 1 228 85"
            stroke="#93AA82"
            strokeWidth="1.2"
            strokeDasharray="1 3"
            opacity="0.65"
          />

          {/* Radial Ticks & Numeric Labels */}
          {ticks.map((t, idx) => (
            <g key={idx}>
              <line
                x1={t.x1}
                y1={t.y1}
                x2={t.x2}
                y2={t.y2}
                stroke={t.isMajor ? "rgba(147, 170, 130, 0.6)" : "#2a2a2a"}
                strokeWidth={t.isMajor ? 1.2 : 0.8}
              />
              {t.labelVal !== null && (
                <text
                  x={t.lx}
                  y={t.ly}
                  fill="#666666"
                  fontSize="7"
                  fontFamily="ui-monospace, monospace"
                  textAnchor="middle"
                  fontWeight="600"
                >
                  {t.labelVal}
                </text>
              )}
            </g>
          ))}

          {/* Rotating Precision Needle */}
          <g
            style={{
              transform: `rotate(${needleAngle}deg)`,
              transformOrigin: `${CX}px ${CY}px`,
              transition: "transform 60ms linear",
            }}
          >
            {/* Needle Shaft */}
            <line
              x1={CX}
              y1={CY}
              x2={CX}
              y2={CY - RADIUS + 8}
              stroke="#93AA82"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            {/* Needle Apex Highlight */}
            <circle
              cx={CX}
              cy={CY - RADIUS + 8}
              r="1.8"
              fill="#b8d1a4"
              opacity="0.9"
            />
            {/* Counter-Weight Notch */}
            <line
              x1={CX}
              y1={CY}
              x2={CX}
              y2={CY + 12}
              stroke="#444444"
              strokeWidth="1"
            />
          </g>

          {/* Central Pivot Hub */}
          <circle cx={CX} cy={CY} r="6" fill="#101010" stroke="#333333" strokeWidth="1" />
          <circle cx={CX} cy={CY} r="2.5" fill="#93AA82" />
        </svg>

        {/* Faint Animated Digital Readout */}
        <div className="gauge-digital-readout">
          <div className="speed-display">
            <span className="speed-number">{speedValue.toFixed(1)}</span>
            <span className="speed-unit">Mbps</span>
          </div>

          <div className="speed-metrics-row">
            <span className="metric-chip">
              <small>PING</small> {pingValue} ms
            </span>
            <span className="metric-sep">/</span>
            <span className="metric-chip">
              <small>BANDWIDTH</small> GIGABIT
            </span>
            <span className="metric-sep">/</span>
            <span className="metric-chip">
              <small>STREAM</small> STABLE
            </span>
          </div>
        </div>
      </div>

      {/* Telemetry Overlays */}
      <div className="speedtest-telemetry" aria-hidden="true">
        <div className="telemetry-top">
          <span className="telemetry-badge">
            <span className="telemetry-dot" />
            STREAMS API BENCHMARK
          </span>
          <span className="telemetry-coord">DUPLEX DOWNSINK</span>
        </div>
        <div className="telemetry-bottom">
          <span>THROUGHPUT: HIGH PRECISION</span>
          <span>LATENCY ENGINE: ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
