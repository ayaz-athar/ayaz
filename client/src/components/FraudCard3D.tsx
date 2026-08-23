import React from "react";

export function FraudCard3D() {
  return (
    <div
      className="fraud-3d-scene"
      aria-label="3D Credit Card Fraud Detection Visualizer in Continuous Motion"
    >
      <div className="fraud-card-wrap">
        <div className="fraud-card">
          {/* Diagnostic Scanning Line */}
          <div className="card-scan-sweep" aria-hidden="true">
            <span className="scan-beam" />
          </div>

          {/* FRONT FACE */}
          <div className="card-face card-front" aria-hidden="true">
            {/* Brushed Metal Background Layer */}
            <div className="metal-grain" />

            {/* Circuit Line Etchings */}
            <svg
              className="circuit-svg"
              viewBox="0 0 320 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.55" stroke="#93AA82" strokeWidth="0.85">
                {/* Microchip bus connections */}
                <path d="M 68 85 L 120 85 L 140 65 L 210 65" />
                <path d="M 68 95 L 130 95 L 155 120 L 220 120" />
                <path d="M 68 105 L 105 105 L 125 140 L 190 140" />
                <path d="M 45 68 L 45 42 L 95 42 L 110 28 L 260 28" />
                <path d="M 55 122 L 55 155 L 100 155 L 115 170 L 250 170" />

                {/* Secondary data pathways */}
                <path d="M 180 65 L 195 50 L 285 50" />
                <path d="M 200 120 L 215 105 L 295 105" />
                <path d="M 170 140 L 185 155 L 270 155" />
                <path d="M 230 28 L 245 42 L 295 42" />

                {/* Vertical telemetry line */}
                <path d="M 270 20 L 270 80 L 285 95 L 285 180" strokeDasharray="3 3" opacity="0.4" />
              </g>

              {/* Logic Nodes / Trace Junctions */}
              <g fill="#93AA82" opacity="0.8">
                <circle cx="120" cy="85" r="1.8" />
                <circle cx="210" cy="65" r="2.2" />
                <circle cx="285" cy="50" r="1.8" />
                <circle cx="130" cy="95" r="1.8" />
                <circle cx="220" cy="120" r="2.2" />
                <circle cx="295" cy="105" r="1.8" />
                <circle cx="105" cy="105" r="1.8" />
                <circle cx="190" cy="140" r="2.2" />
                <circle cx="270" cy="155" r="1.8" />
                <circle cx="95" cy="42" r="1.8" />
                <circle cx="260" cy="28" r="2.2" />
                <circle cx="100" cy="155" r="1.8" />
                <circle cx="250" cy="170" r="2.2" />
              </g>
            </svg>

            {/* Top Row: System Header + Status Telemetry */}
            <div className="card-header">
              <div className="card-brand">
                <span className="brand-dot" />
                <span className="brand-title">FRAUD SENTINEL</span>
                <span className="brand-tag">AI / ML DIAGNOSTIC</span>
              </div>
              <div className="model-badge">
                <span className="status-pulse" />
                <span>INFERENCE OK</span>
              </div>
            </div>

            {/* EMV Contact Chip + NFC wave */}
            <div className="chip-row">
              <div className="emv-chip">
                <div className="chip-lines">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="chip-core" />
              </div>
              <div className="nfc-icon">
                <span />
                <span />
                <span />
              </div>
            </div>

            {/* Embossed Masked Card Number */}
            <div className="card-number-emboss">
              <span className="digit-group">••••</span>
              <span className="digit-group">••••</span>
              <span className="digit-group">••••</span>
              <span className="digit-group digit-reveal">4289</span>
            </div>

            {/* Footer Metadata: Architecture & Metrics */}
            <div className="card-footer">
              <div className="card-holder">
                <small>CLASSIFIER</small>
                <strong>XGB-ENSEMBLE</strong>
              </div>
              <div className="card-expiry">
                <small>VAL METRIC</small>
                <strong>0.998 AUC</strong>
              </div>
              <div className="card-security">
                <small>LATENCY</small>
                <strong>3.8ms</strong>
              </div>
            </div>
          </div>

          {/* BACK FACE */}
          <div className="card-face card-back" aria-hidden="true">
            <div className="metal-grain" />

            {/* Magnetic Diagnostic Stripe */}
            <div className="mag-stripe">
              <div className="mag-track" />
            </div>

            {/* Signature & Security Hash Strip */}
            <div className="signature-row">
              <div className="sig-panel">
                <span className="hash-code">SHA256: 9E4B2F710A8C...VERIFIED</span>
              </div>
              <div className="cvv-box">
                <small>CVV</small>
                <span>***</span>
              </div>
            </div>

            {/* Back Diagnostic Readout */}
            <div className="back-diagnostics">
              <div className="diag-item">
                <span>ANOMALY THRESHOLD</span>
                <strong>σ &gt; 3.65</strong>
              </div>
              <div className="diag-item">
                <span>MODEL PIPELINE</span>
                <strong>PCA + XGBOOST</strong>
              </div>
              <div className="diag-item">
                <span>PRECISION / RECALL</span>
                <strong>99.84% / 94.2%</strong>
              </div>
              <div className="diag-item">
                <span>SECURITY ENCLAVE</span>
                <strong>ISOLATED</strong>
              </div>
            </div>

            {/* Back Circuit Trace Grid */}
            <svg
              className="circuit-svg-back"
              viewBox="0 0 320 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 15 40 L 70 40 L 90 20 L 160 20 L 180 50 L 250 50 L 270 30 L 305 30"
                stroke="#93AA82"
                strokeWidth="0.75"
                opacity="0.4"
              />
              <circle cx="90" cy="20" r="1.8" fill="#93AA82" opacity="0.6" />
              <circle cx="180" cy="50" r="1.8" fill="#93AA82" opacity="0.6" />
              <circle cx="270" cy="30" r="1.8" fill="#93AA82" opacity="0.6" />
            </svg>

            <div className="back-footer">
              <span>NEURAL AUDIT TRAIL #04</span>
              <span>AYAZ ATHAR RESEARCH</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
