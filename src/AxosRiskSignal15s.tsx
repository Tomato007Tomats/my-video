import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  Sequence,
  staticFile,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadLocalFont } from "@remotion/fonts";
import {
  AlertTriangle,
  Database,
  Search,
  BarChart2,
  Sparkles,
  Activity,
  Shield,
  Zap,
  TrendingDown,
  Globe,
  ArrowUpRight,
} from "lucide-react";
import { COLORS } from "../design-system/design-tokens";

// ─── Fonts ──────────────────────────────────────────────────────
const GT_ALPINA = "GT Alpina";
loadLocalFont({
  family: GT_ALPINA,
  url: staticFile("GT Alpina Light-normal-300-100.otf"),
  weight: "300",
  style: "normal",
});

const { fontFamily: interFont } = loadInter("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});
const { fontFamily: displayFont } = loadSpaceGrotesk("normal", {
  weights: ["500", "600", "700"],
  subsets: ["latin"],
});
const { fontFamily: monoFont } = loadJetBrainsMono("normal", {
  weights: ["400", "500", "700"],
  subsets: ["latin"],
});

// ─── Constants ──────────────────────────────────────────────────
const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const useAnimFrame = () => {
  const raw = useCurrentFrame();
  const { fps: renderFps } = useVideoConfig();
  return { frame: raw * (30 / renderFps), fps: 30 };
};

const GLASS_BG =
  "linear-gradient(180deg, rgba(51,51,57,0.55) 0%, rgba(38,38,39,0.55) 100%)";
const GLASS_BORDER = "rgba(255,255,255,0.08)";
const GLASS_SHADOW =
  "0 20px 60px rgba(0,0,0,0.45), inset 0.6px 0.6px 0.6px 0 rgba(255,255,255,0.12)";
const ALERT_BORDER = "rgba(239,68,68,0.4)";
const ALERT_BG =
  "linear-gradient(180deg, rgba(239,68,68,0.08) 0%, rgba(239,68,68,0.02) 100%)";

// 15s at 60fps = 900 frames
export const axosRiskSignal15sDuration = 900;

// ─── Reusable Glass Card ────────────────────────────────────────
const GlassCard: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  borderColor?: string;
  lightLine?: boolean;
  lightLineColor?: string;
}> = ({ children, style, borderColor, lightLine = true, lightLineColor }) => (
  <div
    style={{
      background: GLASS_BG,
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      border: `1px solid ${borderColor || GLASS_BORDER}`,
      borderRadius: 24,
      boxShadow: GLASS_SHADOW,
      position: "relative",
      overflow: "hidden",
      ...style,
    }}
  >
    {lightLine && (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "70%",
          height: 1,
          background: `linear-gradient(90deg, transparent, ${lightLineColor || `${COLORS.primary[400]}40`}, transparent)`,
        }}
      />
    )}
    {children}
  </div>
);

// ─── Animated Background ────────────────────────────────────────
const AnimatedBackground: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { frame } = useAnimFrame();
  const breathe = Math.sin(frame * 0.015) * 0.03 + 0.12;
  const drift = Math.sin(frame * 0.008) * 20;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#080810",
        fontFamily: interFont,
        color: COLORS.text.primary,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-25%",
          left: `calc(50% + ${drift}px)`,
          transform: "translateX(-50%)",
          width: "130%",
          height: "70%",
          background: `radial-gradient(ellipse, rgba(107,4,253,${breathe}) 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-15%",
          right: "-5%",
          width: "50%",
          height: "50%",
          background:
            "radial-gradient(circle, rgba(90,3,212,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />
      {Array.from({ length: 18 }, (_, i) => {
        const px = (i * 107 + 31) % 1920;
        const speed = 0.25 + (i % 5) * 0.12;
        const baseY = 1080 - ((frame * speed + i * 60) % 1250);
        const sz = 1.5 + (i % 3) * 0.5;
        const alpha = 0.12 + Math.sin(frame * 0.025 + i * 0.7) * 0.06;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px,
              top: baseY,
              width: sz,
              height: sz,
              borderRadius: "50%",
              backgroundColor: COLORS.primary[400],
              opacity: alpha,
              pointerEvents: "none",
            }}
          />
        );
      })}
      {children}
    </AbsoluteFill>
  );
};

// ═════════════════════════════════════════════════════════════════
// SCENE 1: DASHBOARD + ALERT (0-3s = frames 0-90 @30fps)
// Portfolio card fades in, then alert slides in
// ═════════════════════════════════════════════════════════════════

const Scene1_DashboardAlert: React.FC = () => {
  const { frame, fps } = useAnimFrame();

  // Card entrance
  const cardSpring = spring({
    frame: frame - 4,
    fps,
    config: { damping: 200, stiffness: 100 },
  });
  const cardOp = interpolate(frame, [4, 16], [0, 1], CLAMP);

  // Content reveal
  const headerOp = interpolate(frame, [10, 18], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.quad),
  });
  const valueOp = interpolate(frame, [15, 23], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.quad),
  });
  const changeOp = interpolate(frame, [20, 28], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.quad),
  });

  const revealY = (op: number) => interpolate(op, [0, 1], [14, 0], CLAMP);

  // Alert notification
  const alertSpring = spring({
    frame: frame - 38,
    fps,
    config: { damping: 180, stiffness: 100 },
  });
  const alertX = interpolate(alertSpring, [0, 1], [400, 0], CLAMP);
  const alertOp = interpolate(frame, [38, 46], [0, 1], CLAMP);
  const alertPulse =
    frame > 50 ? Math.sin((frame - 50) * 0.12) * 0.3 + 0.7 : 0;

  // Scene fade-out
  const sceneOp = interpolate(frame, [78, 90], [1, 0], CLAMP);

  const CARD_W = 580;
  const CARD_H = 300;
  const cardX = (1920 - CARD_W) / 2;
  const cardY = (1080 - CARD_H) / 2;

  return (
    <AbsoluteFill style={{ opacity: sceneOp }}>
      {/* Portfolio Card */}
      <div
        style={{
          position: "absolute",
          left: cardX,
          top: cardY,
          width: CARD_W,
          transform: `scale(${cardSpring})`,
          opacity: cardOp,
        }}
      >
        <GlassCard
          style={{
            padding: "44px 52px",
            minHeight: CARD_H,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 24,
              opacity: headerOp,
              transform: `translateY(${revealY(headerOp)}px)`,
            }}
          >
            <Activity size={20} color={COLORS.primary[400]} />
            <span
              style={{
                fontFamily: displayFont,
                fontSize: 17,
                fontWeight: 600,
                color: COLORS.text.muted,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Portfolio Overview
            </span>
          </div>

          {/* Total Value */}
          <div
            style={{
              opacity: valueOp,
              marginBottom: 14,
              transform: `translateY(${revealY(valueOp)}px)`,
            }}
          >
            <span
              style={{
                fontFamily: monoFont,
                fontSize: 58,
                fontWeight: 700,
                color: COLORS.text.primary,
                letterSpacing: "-0.02em",
              }}
            >
              $2,847,392
            </span>
          </div>

          {/* Change % */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              opacity: changeOp,
              transform: `translateY(${revealY(changeOp)}px)`,
            }}
          >
            <ArrowUpRight
              size={20}
              color={COLORS.states.success}
              strokeWidth={2.5}
            />
            <span
              style={{
                fontSize: 20,
                color: COLORS.states.success,
                fontWeight: 600,
              }}
            >
              +3.42%
            </span>
            <span style={{ fontSize: 16, color: COLORS.text.muted }}>24h</span>
          </div>
        </GlassCard>
      </div>

      {/* Alert Notification */}
      <div
        style={{
          position: "absolute",
          top: cardY - 10,
          left: cardX + CARD_W - 260,
          transform: `translateX(${alertX}px)`,
          opacity: alertOp,
        }}
      >
        <GlassCard
          borderColor={ALERT_BORDER}
          lightLineColor="rgba(239,68,68,0.5)"
          style={{
            width: 300,
            padding: "20px 22px",
            background: ALERT_BG,
            boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 ${30 * alertPulse}px rgba(239,68,68,${0.15 * alertPulse})`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 8,
            }}
          >
            <AlertTriangle size={18} color={COLORS.states.error} />
            <span
              style={{
                fontFamily: displayFont,
                fontSize: 14,
                fontWeight: 700,
                color: COLORS.states.error,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Risk Signal Detected
            </span>
          </div>
          <p
            style={{
              fontSize: 13,
              color: COLORS.text.secondary,
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            BTC correlation anomaly across 3 sources
          </p>
        </GlassCard>
      </div>
    </AbsoluteFill>
  );
};

// ═════════════════════════════════════════════════════════════════
// SCENE 2: MULTI-AGENT PROCESSING (3-10s = frames 90-300 @30fps)
// 3 data sources → AI Orchestrator hub with wire animations
// ═════════════════════════════════════════════════════════════════

const SOURCE_CARD_W = 260;
const SOURCE_CARD_H = 80;
const ORCH_W = 380;
const ORCH_H = 200;

const SOURCES = [
  { name: "On-Chain", icon: "database" as const, x: 310, y: 200 },
  { name: "Sentiment", icon: "search" as const, x: 830, y: 200 },
  { name: "Technical", icon: "chart" as const, x: 1350, y: 200 },
];

const ORCH_POS = { x: 770, y: 580 };

const SOURCE_ICONS: Record<string, React.ReactNode> = {
  database: <Database size={20} color={COLORS.primary[300]} />,
  search: <Search size={20} color={COLORS.primary[300]} />,
  chart: <BarChart2 size={20} color={COLORS.primary[300]} />,
};

// Scanning progress bars for each source card
const ScanProgress: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const { frame } = useAnimFrame();
  const local = frame - startFrame;
  const progress = interpolate(local, [0, 60], [0, 100], CLAMP);
  const barOp = interpolate(local, [0, 8], [0, 1], CLAMP);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: `${COLORS.primary[500]}15`,
        opacity: barOp,
        overflow: "hidden",
        borderRadius: "0 0 24px 24px",
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: "100%",
          background: `linear-gradient(90deg, ${COLORS.primary[600]}, ${COLORS.primary[400]})`,
          boxShadow: `0 0 8px ${COLORS.primary[500]}60`,
        }}
      />
    </div>
  );
};

const Scene2_AgentProcessing: React.FC = () => {
  const { frame, fps } = useAnimFrame();

  // Scene envelope
  const fadeIn = interpolate(frame, [0, 14], [0, 1], CLAMP);
  const fadeOut = interpolate(frame, [195, 210], [1, 0], CLAMP);
  const sceneOp = Math.min(fadeIn, fadeOut);

  // Completion state
  const isComplete = frame > 160;

  // SVG endpoints
  const sourceEndpoints = SOURCES.map((src) => ({
    sx: src.x + SOURCE_CARD_W / 2,
    sy: src.y + SOURCE_CARD_H,
  }));
  const orchCenter = {
    ex: ORCH_POS.x + ORCH_W / 2,
    ey: ORCH_POS.y,
  };

  return (
    <AbsoluteFill style={{ opacity: sceneOp }}>
      {/* SVG Wires + Particles */}
      {(() => {
        const wireColor = "rgba(255,255,255,0.10)";
        const totalLen = 1200;
        const linesVisible = frame > 55;

        const wirePaths = sourceEndpoints.map((ep) => {
          const { sx, sy } = ep;
          const { ex, ey } = orchCenter;
          const midY = (sy + ey) / 2;
          return `M ${sx} ${sy} C ${sx} ${midY} ${ex} ${midY} ${ex} ${ey}`;
        });

        return (
          <>
            <style>
              {`
                @keyframes wire-travel-15s {
                  0%   { offset-distance: 0%; }
                  100% { offset-distance: 100%; }
                }
                ${wirePaths.map((d, i) => `.wire-p15-${i} { offset-path: path("${d}"); }`).join("\n")}
                .wire-particle-15s {
                  offset-anchor: 0px 0px;
                  animation-name: wire-travel-15s;
                  animation-iteration-count: infinite;
                  animation-timing-function: cubic-bezier(0, 0, 0.22, 1);
                  animation-duration: 2.4s;
                }
              `}
            </style>

            <svg
              width={1920}
              height={1080}
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
              }}
            >
              <defs>
                <radialGradient id="particle-grad-15s" fx="1">
                  <stop
                    offset="0%"
                    stopColor="rgba(190,165,255,0.8)"
                  />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
                {wirePaths.map((d, i) => (
                  <mask id={`wire-mask-15s-${i}`} key={`m${i}`}>
                    <path
                      d={d}
                      strokeWidth="2"
                      stroke="white"
                      fill="none"
                    />
                  </mask>
                ))}
              </defs>

              {/* Wire strokes — progressive draw */}
              {wirePaths.map((d, i) => {
                const lineDelay = 0.15 * i;
                const lp = Easing.out(Easing.quad)(
                  interpolate(
                    frame,
                    [55 + lineDelay * 30, 85 + lineDelay * 30],
                    [0, 1],
                    CLAMP,
                  ),
                );
                return (
                  <path
                    key={`w${i}`}
                    d={d}
                    stroke={wireColor}
                    strokeWidth={1}
                    fill="none"
                    strokeDasharray={totalLen}
                    strokeDashoffset={totalLen * (1 - lp)}
                  />
                );
              })}

              {/* Particles */}
              {linesVisible &&
                wirePaths.map((_, i) => (
                  <g key={`p${i}`} mask={`url(#wire-mask-15s-${i})`}>
                    <circle
                      className={`wire-particle-15s wire-p15-${i}`}
                      cx="0"
                      cy="0"
                      r="10"
                      fill="url(#particle-grad-15s)"
                      style={{ animationDelay: `${i * 0.45}s` }}
                    />
                  </g>
                ))}
            </svg>
          </>
        );
      })()}

      {/* Source Cards */}
      {SOURCES.map((src, i) => {
        const delay = 10 + i * 12;
        const cardSpring = spring({
          frame: frame - delay,
          fps,
          config: { damping: 200, stiffness: 100 },
        });
        const cardOp = interpolate(
          frame,
          [delay, delay + 12],
          [0, 1],
          CLAMP,
        );

        // Status text
        const scanStart = delay + 15;
        const scanDone = scanStart + 60;
        const statusText =
          frame < scanStart
            ? "Ready"
            : frame < scanDone
              ? "Scanning..."
              : "Complete";
        const statusColor =
          frame < scanStart
            ? COLORS.text.muted
            : frame < scanDone
              ? COLORS.primary[300]
              : COLORS.states.success;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: src.x,
              top: src.y,
              width: SOURCE_CARD_W,
              transform: `scale(${cardSpring})`,
              opacity: cardOp,
            }}
          >
            <GlassCard
              style={{
                padding: "18px 24px",
                height: SOURCE_CARD_H,
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: 12 }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: `${COLORS.primary[500]}15`,
                      border: `1px solid ${COLORS.primary[500]}25`,
                    }}
                  >
                    {SOURCE_ICONS[src.icon]}
                  </div>
                  <div>
                    <span
                      style={{
                        fontFamily: displayFont,
                        fontSize: 16,
                        fontWeight: 600,
                        color: COLORS.text.primary,
                        display: "block",
                      }}
                    >
                      {src.name}
                    </span>
                    <span
                      style={{
                        fontFamily: monoFont,
                        fontSize: 11,
                        color: statusColor,
                      }}
                    >
                      {statusText}
                    </span>
                  </div>
                </div>
              </div>
              <ScanProgress startFrame={scanStart} />
            </GlassCard>
          </div>
        );
      })}

      {/* AI Orchestrator Hub */}
      {(() => {
        const orchSpring = spring({
          frame: frame - 42,
          fps,
          config: { damping: 200, stiffness: 100 },
        });
        const orchOp = interpolate(frame, [42, 55], [0, 1], CLAMP);

        // Pulsing ring when processing
        const ringPulse =
          frame > 65 && !isComplete
            ? Math.sin(frame * 0.08) * 0.3 + 0.5
            : 0;

        return (
          <div
            style={{
              position: "absolute",
              left: ORCH_POS.x,
              top: ORCH_POS.y,
              width: ORCH_W,
              transform: `scale(${orchSpring})`,
              opacity: orchOp,
            }}
          >
            <GlassCard
              borderColor={`${COLORS.primary[500]}30`}
              style={{
                padding: "32px 36px",
                height: ORCH_H,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `${GLASS_SHADOW}, 0 0 ${isComplete ? 45 : 20 + ringPulse * 20}px ${COLORS.primary[500]}${isComplete ? "35" : "15"}`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "80%",
                  height: 2,
                  background: `linear-gradient(90deg, transparent, ${COLORS.primary[400]}80, transparent)`,
                }}
              />

              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: `linear-gradient(135deg, ${COLORS.primary[600]}, ${COLORS.primary[800]})`,
                  boxShadow: `0 0 24px ${COLORS.primary[500]}40`,
                  marginBottom: 14,
                }}
              >
                <Sparkles size={24} color="white" />
              </div>

              <span
                style={{
                  fontFamily: GT_ALPINA,
                  fontSize: 22,
                  fontWeight: 300,
                  color: COLORS.text.primary,
                  letterSpacing: "0.01em",
                }}
              >
                AI Orchestrator
              </span>

              <span
                style={{
                  fontFamily: monoFont,
                  fontSize: 12,
                  color: isComplete
                    ? COLORS.states.success
                    : COLORS.primary[300],
                  marginTop: 6,
                }}
              >
                {isComplete
                  ? "✓ Analysis complete"
                  : "Processing signals..."}
              </span>
            </GlassCard>
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};

// ═════════════════════════════════════════════════════════════════
// SCENE 3: RISK SCORE + CLOSING (10-15s = frames 300-450 @30fps)
// Risk gauge animates, portfolio alert appears, then logo + tagline
// ═════════════════════════════════════════════════════════════════

const RECOMMENDATIONS: { text: string; icon: React.ReactNode }[] = [
  {
    text: "Reduce BTC exposure by 15%",
    icon: <TrendingDown size={15} color={COLORS.primary[300]} strokeWidth={2} />,
  },
  {
    text: "Hedge with stablecoin position",
    icon: <Shield size={15} color={COLORS.primary[300]} strokeWidth={2} />,
  },
];

const Scene3_RiskScoreAndClose: React.FC = () => {
  const { frame, fps } = useAnimFrame();

  // Phase 1: Risk Score (0-90 local frames)
  const fadeIn = interpolate(frame, [0, 14], [0, 1], CLAMP);

  // Gauge: score animates 72 → 85
  const score = interpolate(frame, [14, 55], [72, 85], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const displayScore = Math.round(score);

  const gaugeR = 100;
  const circumference = 2 * Math.PI * gaugeR;
  const arcDegrees = 270;
  const arcLength = (arcDegrees / 360) * circumference;
  const fillRatio = score / 100;
  const fillLength = arcLength * fillRatio;

  const gaugeColor =
    score < 60
      ? COLORS.states.success
      : score < 75
        ? "#f59e0b"
        : score < 85
          ? "#f97316"
          : COLORS.states.error;

  // Alert card entrance
  const alertCardSpring = spring({
    frame: frame - 38,
    fps,
    config: { damping: 200, stiffness: 100 },
  });
  const alertCardOp = interpolate(frame, [38, 50], [0, 1], CLAMP);

  // Phase 2: Transition to closing (starts ~frame 85)
  // Risk elements slide up and fade
  const riskFadeOut = interpolate(frame, [85, 100], [1, 0], {
    ...CLAMP,
    easing: Easing.in(Easing.quad),
  });
  const riskDrift = interpolate(frame, [85, 100], [0, -30], CLAMP);

  // Closing elements
  const closingIn = interpolate(frame, [95, 105], [0, 1], CLAMP);

  // Logo
  const logoSpring = spring({
    frame: frame - 100,
    fps,
    config: { damping: 28, stiffness: 100, mass: 0.8 },
  });
  const logoOp = interpolate(frame, [100, 112], [0, 1], CLAMP);
  const glowPulse =
    frame > 108 ? Math.sin((frame - 108) * 0.055) * 0.3 + 0.5 : 0;

  // Tagline
  const tagOp = interpolate(frame, [108, 118], [0, 1], CLAMP);
  const tagY = interpolate(frame, [108, 120], [14, 0], {
    ...CLAMP,
    easing: Easing.out(Easing.exp),
  });

  // URL
  const urlOp = interpolate(frame, [118, 128], [0, 1], CLAMP);
  const urlY = interpolate(frame, [118, 130], [12, 0], {
    ...CLAMP,
    easing: Easing.out(Easing.exp),
  });

  // Decorative line
  const lineW = interpolate(frame, [104, 120], [0, 300], {
    ...CLAMP,
    easing: Easing.out(Easing.quad),
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeIn,
      }}
    >
      {/* Risk Score Elements */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 70,
          opacity: riskFadeOut,
          transform: `translateY(${riskDrift}px)`,
          position: "absolute",
        }}
      >
        {/* Gauge Card */}
        <GlassCard
          style={{
            padding: "40px 48px",
            width: 340,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: GT_ALPINA,
              fontSize: 20,
              fontWeight: 300,
              color: COLORS.text.secondary,
              letterSpacing: "0.02em",
              marginBottom: 20,
            }}
          >
            Portfolio Risk Score
          </span>

          <svg width={240} height={200} viewBox="0 0 240 200">
            <circle
              cx={120}
              cy={130}
              r={gaugeR}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={13}
              strokeLinecap="round"
              strokeDasharray={`${arcLength} ${circumference}`}
              transform="rotate(-225 120 130)"
            />
            <circle
              cx={120}
              cy={130}
              r={gaugeR}
              fill="none"
              stroke={gaugeColor}
              strokeWidth={13}
              strokeLinecap="round"
              strokeDasharray={`${fillLength} ${circumference}`}
              transform="rotate(-225 120 130)"
              style={{
                filter: `drop-shadow(0 0 8px ${gaugeColor}60)`,
              }}
            />
            <text
              x={120}
              y={122}
              textAnchor="middle"
              fill={COLORS.text.primary}
              fontFamily={monoFont}
              fontSize={52}
              fontWeight="bold"
            >
              {displayScore}
            </text>
            <text
              x={120}
              y={155}
              textAnchor="middle"
              fill={gaugeColor}
              fontFamily={displayFont}
              fontSize={16}
              fontWeight="600"
            >
              {displayScore >= 85
                ? "HIGH"
                : displayScore >= 75
                  ? "ELEVATED"
                  : "MODERATE"}
            </text>
          </svg>
        </GlassCard>

        {/* Portfolio Alert Card */}
        <div
          style={{
            transform: `scale(${alertCardSpring})`,
            opacity: alertCardOp,
          }}
        >
          <GlassCard
            borderColor={`${COLORS.primary[500]}25`}
            style={{
              padding: "36px 40px",
              width: 400,
              boxShadow: `${GLASS_SHADOW}, 0 0 30px ${COLORS.primary[500]}15`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: `linear-gradient(135deg, ${COLORS.primary[600]}, ${COLORS.primary[800]})`,
                }}
              >
                <Shield size={18} color="white" />
              </div>
              <div>
                <span
                  style={{
                    fontFamily: GT_ALPINA,
                    fontSize: 20,
                    fontWeight: 300,
                    color: COLORS.text.primary,
                    letterSpacing: "0.01em",
                  }}
                >
                  Portfolio Alert Generated
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 4,
                  }}
                >
                  <Zap size={12} color={COLORS.primary[400]} />
                  <span
                    style={{
                      fontSize: 12,
                      color: COLORS.primary[300],
                    }}
                  >
                    Automatically
                  </span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {RECOMMENDATIONS.map((rec, i) => {
                const recDelay = 46 + i * 12;
                const recOp = interpolate(
                  frame,
                  [recDelay, recDelay + 12],
                  [0, 1],
                  { ...CLAMP, easing: Easing.out(Easing.quad) },
                );
                const recX = interpolate(
                  frame,
                  [recDelay, recDelay + 16],
                  [16, 0],
                  { ...CLAMP, easing: Easing.out(Easing.exp) },
                );
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      opacity: recOp,
                      transform: `translateX(${recX}px)`,
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: `${COLORS.primary[500]}12`,
                        border: `1px solid ${COLORS.primary[500]}20`,
                        flexShrink: 0,
                      }}
                    >
                      {rec.icon}
                    </div>
                    <span
                      style={{
                        fontSize: 15,
                        color: COLORS.text.secondary,
                        lineHeight: 1.4,
                      }}
                    >
                      {rec.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Closing Elements */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
          opacity: closingIn,
          position: "absolute",
        }}
      >
        {/* Tagline */}
        <div
          style={{
            opacity: tagOp,
            transform: `translateY(${tagY}px)`,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: GT_ALPINA,
              fontSize: 38,
              fontWeight: 300,
              color: COLORS.text.secondary,
              letterSpacing: "0.01em",
            }}
          >
            This is what{" "}
          </span>
          <span
            style={{
              fontFamily: GT_ALPINA,
              fontSize: 38,
              fontWeight: 300,
              background: `linear-gradient(135deg, ${COLORS.primary[300]}, ${COLORS.primary[500]})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            portfolio intelligence
          </span>
          <span
            style={{
              fontFamily: GT_ALPINA,
              fontSize: 38,
              fontWeight: 300,
              color: COLORS.text.secondary,
            }}
          >
            {" "}looks like.
          </span>
        </div>

        {/* Decorative line */}
        <div
          style={{
            width: lineW,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${COLORS.primary[500]}, transparent)`,
            boxShadow: `0 0 16px ${COLORS.primary[500]}40`,
          }}
        />

        {/* Logo */}
        <div
          style={{
            opacity: logoOp,
            transform: `scale(${logoSpring})`,
            filter: `drop-shadow(0 0 ${30 * glowPulse}px ${COLORS.primary[500]}80)`,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <Sparkles
            size={28}
            color={COLORS.primary[400]}
            strokeWidth={1.5}
            style={{ opacity: 0.7 }}
          />
          <h1
            style={{
              fontFamily: GT_ALPINA,
              fontSize: 76,
              fontWeight: 300,
              background: `linear-gradient(135deg, ${COLORS.primary[300]}, ${COLORS.primary[600]}, ${COLORS.primary[700]})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Axos AI
          </h1>
        </div>

        {/* URL badge */}
        <div
          style={{
            opacity: urlOp,
            transform: `translateY(${urlY}px)`,
          }}
        >
          <div
            style={{
              padding: "10px 24px",
              backgroundColor: `${COLORS.primary[500]}10`,
              borderRadius: 12,
              border: `1px solid ${COLORS.primary[500]}25`,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Globe
              size={16}
              color={COLORS.primary[400]}
              strokeWidth={1.5}
            />
            <span
              style={{
                fontFamily: monoFont,
                fontSize: 18,
                color: COLORS.primary[300],
                fontWeight: 500,
              }}
            >
              axos.ai
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═════════════════════════════════════════════════════════════════
// MAIN COMPOSITION — 15 seconds
// ═════════════════════════════════════════════════════════════════
export const AxosRiskSignal15s: React.FC = () => {
  return (
    <AnimatedBackground>
      {/* Scene 1: Dashboard + Alert (0-3s) */}
      <Sequence from={0} durationInFrames={190} premountFor={60}>
        <Scene1_DashboardAlert />
      </Sequence>

      {/* Scene 2: Agent Processing (2.8-10.5s) */}
      <Sequence from={168} durationInFrames={450} premountFor={60}>
        <Scene2_AgentProcessing />
      </Sequence>

      {/* Scene 3: Risk Score + Logo (10-15s) */}
      <Sequence from={590} durationInFrames={310} premountFor={60}>
        <Scene3_RiskScoreAndClose />
      </Sequence>
    </AnimatedBackground>
  );
};
