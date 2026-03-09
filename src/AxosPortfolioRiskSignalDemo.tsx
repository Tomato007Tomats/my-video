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
  Img,
} from "remotion";
import { Audio } from "@remotion/media";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadLocalFont } from "@remotion/fonts";
import {
  AlertTriangle,
  ArrowUpRight,
  Database,
  Search,
  BarChart2,
  Sparkles,
  Activity,
  Shield,
  Zap,
  Clock,
  TrendingDown,
  Globe,
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

// ─── 60fps smoothness ───────────────────────────────────────────
// Animation timings are authored at 30fps. This hook normalizes
// the frame so springs compute sub-frame physics at 60fps while
// keeping the same visual timing.
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

export const axosPortfolioRiskSignalDemoDuration = 1640; // 820 frames × 2 (60fps)

// ─── Reusable Glass Card ────────────────────────────────────────
const GlassCard: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  borderColor?: string;
  lightLine?: boolean;
  lightLineColor?: string;
}> = ({
  children,
  style,
  borderColor,
  lightLine = true,
  lightLineColor,
}) => (
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
      {/* Primary purple radial */}
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
      {/* Bottom-right glow */}
      <div
        style={{
          position: "absolute",
          bottom: "-15%",
          right: "-5%",
          width: "50%",
          height: "50%",
          background: "radial-gradient(circle, rgba(90,3,212,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      {/* Dot grid */}
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
      {/* Ambient floating particles */}
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
// SCENE 1: HOOK TEXT — "15 seconds. Zero manual input."
// Word-by-word reveal with GT Alpina + spring stagger
// ═════════════════════════════════════════════════════════════════

const HookWord: React.FC<{
  word: string;
  delay: number;
  gradient?: boolean;
}> = ({ word, delay, gradient }) => {
  const { frame, fps } = useAnimFrame();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 30, stiffness: 120, mass: 0.8 },
  });

  const y = interpolate(progress, [0, 1], [30, 0], CLAMP);
  const op = interpolate(progress, [0, 0.6], [0, 1], CLAMP);
  const blur = interpolate(progress, [0, 0.5], [6, 0], CLAMP);

  const base: React.CSSProperties = {
    fontFamily: GT_ALPINA,
    fontSize: 78,
    fontWeight: 300,
    letterSpacing: "-0.01em",
    opacity: op,
    transform: `translateY(${y}px)`,
    filter: `blur(${blur}px)`,
    display: "inline-block",
    marginRight: 18,
  };

  if (gradient) {
    return (
      <span
        style={{
          ...base,
          background: `linear-gradient(135deg, ${COLORS.primary[300]}, ${COLORS.primary[500]})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {word}
      </span>
    );
  }

  return (
    <span style={{ ...base, color: COLORS.text.primary }}>{word}</span>
  );
};

const Scene1_Hook: React.FC = () => {
  const { frame } = useAnimFrame();

  const opacity = interpolate(frame, [92, 118], [1, 0], {
    ...CLAMP,
    easing: Easing.in(Easing.quad),
  });
  const drift = interpolate(frame, [0, 118], [0, -14], CLAMP);

  // Glow builds after words land
  const glowOp = interpolate(
    frame,
    [35, 55, 75, 98],
    [0, 0.5, 0.35, 0],
    CLAMP,
  );

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        opacity,
        transform: `translateY(${drift}px)`,
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          width: 650,
          height: 220,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.primary[500]}55 0%, transparent 70%)`,
          opacity: glowOp,
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      {/* Line 1: "15 seconds." */}
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <HookWord word="15" delay={8} />
        <HookWord word="seconds." delay={14} />
      </div>

      {/* Line 2: "Zero manual input." — gradient */}
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <HookWord word="Zero" delay={30} gradient />
        <HookWord word="manual" delay={36} gradient />
        <HookWord word="input." delay={42} gradient />
      </div>

      {/* Subtle Clock icon */}
      <div
        style={{
          marginTop: 28,
          opacity: interpolate(frame, [52, 68], [0, 0.5], CLAMP),
          transform: `scale(${interpolate(frame, [52, 68], [0.8, 1], CLAMP)})`,
        }}
      >
        <Clock size={24} color={COLORS.primary[400]} strokeWidth={1.5} />
      </div>
    </AbsoluteFill>
  );
};

// ═════════════════════════════════════════════════════════════════
// SCENE 2: CURSOR DRAG-TO-CREATE DASHBOARD + ALERT
// The cursor appears at the top-left corner and drags diagonally
// to the bottom-right, "drawing" the portfolio card into existence.
// After the drag completes, the card content populates.
// ═════════════════════════════════════════════════════════════════
// Card final geometry (centered on 1920×1080)
const CARD_W = 640;
const CARD_H = 340;
const CARD_ORIGIN = {
  x: (1920 - CARD_W) / 2, // 600
  y: (1080 - CARD_H) / 2, // 270
};

const Scene2_DashboardAlert: React.FC = () => {
  const { frame, fps } = useAnimFrame();

  // ─── Cursor timeline ──────────────────────────────────────
  const CUR_APPEAR = 8;
  const PRESS = 14;
  const DRAG_START = 16;
  const DRAG_END = 56;
  const CUR_FADE_END = 66;

  // Cursor opacity: fade in → hold → fade out after release
  const curOp = interpolate(
    frame,
    [CUR_APPEAR, CUR_APPEAR + 5, DRAG_END + 2, CUR_FADE_END],
    [0, 1, 1, 0],
    CLAMP,
  );

  // Cursor scale: normal → press down → held → release
  const curSc = interpolate(
    frame,
    [PRESS, PRESS + 2, DRAG_END, DRAG_END + 3],
    [1, 0.88, 0.88, 1],
    CLAMP,
  );

  // Drag progress (0→1)
  const dragRaw = interpolate(
    frame,
    [DRAG_START, DRAG_END],
    [0, 1],
    CLAMP,
  );
  const drag = Easing.inOut(Easing.cubic)(dragRaw);

  // Expanding clip rectangle
  const clipW = interpolate(drag, [0, 1], [6, CARD_W]);
  const clipH = interpolate(drag, [0, 1], [6, CARD_H]);
  const clipR = Math.min(24, clipW / 2, clipH / 2);
  const cardVisible =
    interpolate(frame, [DRAG_START, DRAG_START + 3], [0, 1], CLAMP) > 0;

  // Cursor position = bottom-right corner of growing rectangle
  const curX = frame < DRAG_START
    ? CARD_ORIGIN.x
    : CARD_ORIGIN.x + clipW;
  const curY = frame < DRAG_START
    ? CARD_ORIGIN.y
    : CARD_ORIGIN.y + clipH;

  // Drag glow at cursor
  const dragActive = drag > 0 && drag < 1;
  const dragGlowOp = dragActive ? 0.35 : 0;

  // ─── Content reveal (after drag completes) ────────────────
  const C0 = DRAG_END + 4;
  const headerOp = interpolate(frame, [C0, C0 + 10], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.quad),
  });
  const valueOp = interpolate(frame, [C0 + 8, C0 + 18], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.quad),
  });
  const changeOp = interpolate(frame, [C0 + 14, C0 + 24], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.quad),
  });

  const revealY = (op: number) =>
    interpolate(op, [0, 1], [14, 0], CLAMP);

  // ─── Alert (after content settles) ────────────────────────
  const alertSpring = spring({
    frame: frame - 110,
    fps,
    config: { damping: 180, stiffness: 100 },
  });
  const alertX = interpolate(alertSpring, [0, 1], [400, 0], CLAMP);
  const alertOp = interpolate(frame, [110, 120], [0, 1], CLAMP);
  const alertPulse =
    frame > 128 ? Math.sin((frame - 128) * 0.1) * 0.3 + 0.7 : 0;

  // Scene fade-out
  const sceneOp = interpolate(frame, [162, 184], [1, 0], CLAMP);

  return (
    <AbsoluteFill style={{ opacity: sceneOp }}>
      {/* ── Positioned wrapper ── */}
      <div
        style={{
          position: "absolute",
          left: CARD_ORIGIN.x,
          top: CARD_ORIGIN.y,
        }}
      >
        {/* ── Expanding clip rectangle (grows with cursor) ── */}
        {cardVisible && (
          <div
            style={{
              width: clipW,
              height: clipH,
              overflow: "hidden",
              borderRadius: clipR,
              border: `1px solid ${GLASS_BORDER}`,
              boxShadow: `${GLASS_SHADOW}${dragActive ? `, 0 0 ${18 + drag * 14}px ${COLORS.primary[500]}18` : ""}`,
            }}
          >
            {/* Full-size card rendered inside (clipped by parent) */}
            <div
              style={{
                width: CARD_W,
                minHeight: CARD_H,
                background: GLASS_BG,
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                padding: "48px 56px",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {/* Top light line */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "70%",
                  height: 1,
                  background: `linear-gradient(90deg, transparent, ${COLORS.primary[400]}40, transparent)`,
                }}
              />

              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 28,
                  opacity: headerOp,
                  transform: `translateY(${revealY(headerOp)}px)`,
                }}
              >
                <Activity size={20} color={COLORS.primary[400]} />
                <span
                  style={{
                    fontFamily: displayFont,
                    fontSize: 18,
                    fontWeight: 600,
                    color: COLORS.text.muted,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  Portfolio Overview
                </span>
              </div>

              {/* Total Value — hero element */}
              <div
                style={{
                  opacity: valueOp,
                  marginBottom: 16,
                  transform: `translateY(${revealY(valueOp)}px)`,
                }}
              >
                <span
                  style={{
                    fontFamily: monoFont,
                    fontSize: 64,
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
                <span
                  style={{
                    fontSize: 16,
                    color: COLORS.text.muted,
                  }}
                >
                  24h
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── Alert Notification ── */}
        <div
          style={{
            position: "absolute",
            top: -20,
            left: CARD_W + 40 - 300,
            transform: `translateX(${alertX}px)`,
            opacity: alertOp,
          }}
        >
          <GlassCard
            borderColor={ALERT_BORDER}
            lightLineColor="rgba(239,68,68,0.5)"
            style={{
              width: 300,
              padding: "22px 24px",
              background: ALERT_BG,
              boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 ${30 * alertPulse}px rgba(239,68,68,${0.15 * alertPulse})`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <AlertTriangle
                size={18}
                color={COLORS.states.error}
              />
              <span
                style={{
                  fontFamily: displayFont,
                  fontSize: 15,
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
                fontSize: 14,
                color: COLORS.text.secondary,
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              BTC correlation anomaly across 3 sources
            </p>
          </GlassCard>
        </div>
      </div>

      {/* ── Cursor glow at drag point ── */}
      {dragGlowOp > 0 && (
        <div
          style={{
            position: "absolute",
            left: curX - 45,
            top: curY - 45,
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${COLORS.primary[400]}35 0%, transparent 70%)`,
            opacity: dragGlowOp,
            filter: "blur(8px)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* ── Mouse Cursor ── */}
      {curOp > 0 && (
        <div
          style={{
            position: "absolute",
            left: curX,
            top: curY,
            transform: `scale(${curSc})`,
            opacity: curOp,
            pointerEvents: "none",
            filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.65))",
            zIndex: 100,
          }}
        >
          <Img
            src={staticFile("Cursor apontando.svg")}
            style={{ width: 64, height: 64 }}
          />
        </div>
      )}
    </AbsoluteFill>
  );
};

// ═════════════════════════════════════════════════════════════════
// SCENE 3: MULTI-AGENT PROCESSING
// ═════════════════════════════════════════════════════════════════

// Layout constants
const SOURCE_CARD_W = 260;
const SOURCE_CARD_H = 80;
const ORCH_W = 380;
const ORCH_H = 200;

const SOURCES = [
  { name: "On-Chain", icon: "database" as const, x: 310, y: 200 },
  { name: "Sentiment", icon: "search" as const, x: 830, y: 200 },
  { name: "Technical", icon: "chart" as const, x: 1350, y: 200 },
];

const ORCH_POS = { x: 770, y: 620 };

const SOURCE_ICONS: Record<string, React.ReactNode> = {
  database: <Database size={20} color={COLORS.primary[300]} />,
  search: <Search size={20} color={COLORS.primary[300]} />,
  chart: <BarChart2 size={20} color={COLORS.primary[300]} />,
};

const Scene3_AgentProcessing: React.FC = () => {
  const { frame, fps } = useAnimFrame();

  // Scene envelope
  const fadeIn = interpolate(frame, [0, 20], [0, 1], CLAMP);
  const fadeOut = interpolate(frame, [258, 285], [1, 0], CLAMP);
  const sceneOp = Math.min(fadeIn, fadeOut);

  // Completion state
  const isComplete = frame > 225;

  // Source/Orchestrator center coords for SVG
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
      {/* ── SVG Wires + CSS offset-path Particles ── */}
      {(() => {
        const wireColor = "rgba(255,255,255,0.10)";
        const totalLen = 1200;
        const linesVisible = frame > 78;

        const wirePaths = sourceEndpoints.map((ep) => {
          const { sx, sy } = ep;
          const { ex, ey } = orchCenter;
          const midY = (sy + ey) / 2;
          return `M ${sx} ${sy} C ${sx} ${midY} ${ex} ${midY} ${ex} ${ey}`;
        });

        return (
          <>
            {/* CSS keyframes for offset-path particle travel */}
            <style>
              {`
                @keyframes wire-travel {
                  0%   { offset-distance: 0%; }
                  100% { offset-distance: 100%; }
                }
                ${wirePaths.map((d, i) => `.wire-p-${i} { offset-path: path("${d}"); }`).join("\n")}
                .wire-particle {
                  offset-anchor: 0px 0px;
                  animation-name: wire-travel;
                  animation-iteration-count: infinite;
                  animation-timing-function: cubic-bezier(0, 0, 0.22, 1);
                  animation-duration: 2.8s;
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
                <radialGradient id="particle-grad" fx="1">
                  <stop
                    offset="0%"
                    stopColor="rgba(190,165,255,0.8)"
                  />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
                {/* Masks so particles only show along wire */}
                {wirePaths.map((d, i) => (
                  <mask id={`wire-mask-${i}`} key={`m${i}`}>
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
                const lineDelay = 0.18 * i;
                const lp = Easing.out(Easing.quad)(
                  interpolate(
                    frame,
                    [78 + lineDelay * 30, 115 + lineDelay * 30],
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

              {/* Gradient particles traveling along wires */}
              {linesVisible &&
                wirePaths.map((_, i) => (
                  <g key={`p${i}`} mask={`url(#wire-mask-${i})`}>
                    <circle
                      className={`wire-particle wire-p-${i}`}
                      cx="0"
                      cy="0"
                      r="10"
                      fill="url(#particle-grad)"
                      style={{ animationDelay: `${i * 0.55}s` }}
                    />
                  </g>
                ))}
            </svg>
          </>
        );
      })()}

      {/* ── Source Cards ── */}
      {SOURCES.map((src, i) => {
        const delay = 18 + i * 16;
        const cardSpring = spring({
          frame: frame - delay,
          fps,
          config: { damping: 200, stiffness: 100 },
        });
        const cardOp = interpolate(
          frame,
          [delay, delay + 15],
          [0, 1],
          CLAMP,
        );

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
                  gap: 12,
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
                    backgroundColor: `${COLORS.primary[500]}15`,
                    border: `1px solid ${COLORS.primary[500]}25`,
                  }}
                >
                  {SOURCE_ICONS[src.icon]}
                </div>
                <span
                  style={{
                    fontFamily: displayFont,
                    fontSize: 16,
                    fontWeight: 600,
                    color: COLORS.text.primary,
                  }}
                >
                  {src.name}
                </span>
              </div>
            </GlassCard>
          </div>
        );
      })}

      {/* ── AI Orchestrator Hub ── */}
      {(() => {
        const orchSpring = spring({
          frame: frame - 58,
          fps,
          config: { damping: 200, stiffness: 100 },
        });
        const orchOp = interpolate(frame, [58, 73], [0, 1], CLAMP);

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
                boxShadow: `${GLASS_SHADOW}, 0 0 ${isComplete ? 40 : 20}px ${COLORS.primary[500]}${isComplete ? "30" : "15"}`,
              }}
            >
              {/* Stronger top line */}
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
                  color: COLORS.primary[300],
                  marginTop: 6,
                }}
              >
                {isComplete
                  ? "Analysis complete"
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
// SCENE 4: RISK SCORE UPDATE + PORTFOLIO ALERT
// ═════════════════════════════════════════════════════════════════
const RECOMMENDATIONS: {
  text: string;
  icon: React.ReactNode;
}[] = [
  {
    text: "Reduce BTC exposure by 15%",
    icon: <TrendingDown size={15} color={COLORS.primary[300]} strokeWidth={2} />,
  },
  {
    text: "Hedge with stablecoin position",
    icon: <Shield size={15} color={COLORS.primary[300]} strokeWidth={2} />,
  },
];

const Scene4_RiskScore: React.FC = () => {
  const { frame, fps } = useAnimFrame();

  // Scene envelope
  const fadeIn = interpolate(frame, [0, 20], [0, 1], CLAMP);
  const fadeOut = interpolate(frame, [148, 172], [1, 0], CLAMP);
  const sceneOp = Math.min(fadeIn, fadeOut);

  // Gauge: score animates 72 → 85
  const score = interpolate(frame, [28, 85], [72, 85], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const displayScore = Math.round(score);

  // SVG gauge arc
  const gaugeR = 110;
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
    frame: frame - 72,
    fps,
    config: { damping: 200, stiffness: 100 },
  });
  const alertCardOp = interpolate(frame, [72, 88], [0, 1], CLAMP);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 80,
        opacity: sceneOp,
      }}
    >
      {/* ── Gauge Card ── */}
      <GlassCard
        style={{
          padding: "48px 56px",
          width: 380,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: GT_ALPINA,
            fontSize: 22,
            fontWeight: 300,
            color: COLORS.text.secondary,
            letterSpacing: "0.02em",
            marginBottom: 24,
          }}
        >
          Portfolio Risk Score
        </span>

        <svg width={260} height={220} viewBox="0 0 260 220">
          {/* BG arc */}
          <circle
            cx={130}
            cy={140}
            r={gaugeR}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={14}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
            transform="rotate(-225 130 140)"
          />
          {/* Filled arc */}
          <circle
            cx={130}
            cy={140}
            r={gaugeR}
            fill="none"
            stroke={gaugeColor}
            strokeWidth={14}
            strokeLinecap="round"
            strokeDasharray={`${fillLength} ${circumference}`}
            transform="rotate(-225 130 140)"
            style={{
              filter: `drop-shadow(0 0 8px ${gaugeColor}60)`,
            }}
          />
          {/* Score number */}
          <text
            x={130}
            y={132}
            textAnchor="middle"
            fill={COLORS.text.primary}
            fontFamily={monoFont}
            fontSize={56}
            fontWeight="bold"
          >
            {displayScore}
          </text>
          {/* Label */}
          <text
            x={130}
            y={168}
            textAnchor="middle"
            fill={gaugeColor}
            fontFamily={displayFont}
            fontSize={18}
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

      {/* ── Portfolio Alert Card ── */}
      <div
        style={{
          transform: `scale(${alertCardSpring})`,
          opacity: alertCardOp,
        }}
      >
        <GlassCard
          borderColor={`${COLORS.primary[500]}25`}
          style={{
            padding: "40px 44px",
            width: 440,
            boxShadow: `${GLASS_SHADOW}, 0 0 30px ${COLORS.primary[500]}15`,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 28,
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
                  fontSize: 22,
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
              gap: 16,
            }}
          >
            {RECOMMENDATIONS.map((rec, i) => {
              const recDelay = 82 + i * 15;
              const recOp = interpolate(
                frame,
                [recDelay, recDelay + 14],
                [0, 1],
                { ...CLAMP, easing: Easing.out(Easing.quad) },
              );
              const recX = interpolate(
                frame,
                [recDelay, recDelay + 18],
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
                      fontSize: 16,
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
    </AbsoluteFill>
  );
};

// ═════════════════════════════════════════════════════════════════
// SCENE 5: CLOSING — Statement + Logo
// ═════════════════════════════════════════════════════════════════
const Scene5_Closing: React.FC = () => {
  const { frame, fps } = useAnimFrame();

  // Word-by-word reveal for closing statement
  const words = ["This", "is", "what"];
  const highlightWords = ["portfolio", "intelligence"];
  const endWords = ["looks", "like."];

  const wordOp = (delay: number) =>
    interpolate(frame, [delay, delay + 12], [0, 1], {
      ...CLAMP,
      easing: Easing.out(Easing.quad),
    });
  const wordY = (delay: number) =>
    interpolate(frame, [delay, delay + 16], [18, 0], {
      ...CLAMP,
      easing: Easing.out(Easing.exp),
    });

  // Decorative line
  const lineW = interpolate(frame, [55, 78], [0, 300], {
    ...CLAMP,
    easing: Easing.out(Easing.quad),
  });

  // Logo
  const logoSpring = spring({
    frame: frame - 68,
    fps,
    config: { damping: 28, stiffness: 100, mass: 0.8 },
  });
  const logoOp = interpolate(frame, [68, 82], [0, 1], CLAMP);
  const glowPulse =
    frame > 78 ? Math.sin((frame - 78) * 0.055) * 0.3 + 0.5 : 0;

  // URL
  const urlSpring = spring({
    frame: frame - 92,
    fps,
    config: { damping: 30, stiffness: 110, mass: 0.7 },
  });
  const urlOp = interpolate(frame, [92, 105], [0, 1], CLAMP);

  const renderWord = (
    w: string,
    delay: number,
    gradient?: boolean,
  ) => (
    <span
      key={w + delay}
      style={{
        display: "inline-block",
        fontFamily: GT_ALPINA,
        fontSize: 58,
        fontWeight: 300,
        letterSpacing: "-0.01em",
        opacity: wordOp(delay),
        transform: `translateY(${wordY(delay)}px)`,
        marginRight: 14,
        ...(gradient
          ? {
              background: `linear-gradient(135deg, ${COLORS.primary[300]}, ${COLORS.primary[500]})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }
          : { color: COLORS.text.primary }),
      }}
    >
      {w}
    </span>
  );

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 44,
      }}
    >
      {/* Statement — word-by-word */}
      <div
        style={{
          textAlign: "center",
          maxWidth: 820,
        }}
      >
        <div style={{ marginBottom: 4 }}>
          {words.map((w, i) => renderWord(w, 5 + i * 5))}
        </div>
        <div style={{ marginBottom: 4 }}>
          {highlightWords.map((w, i) =>
            renderWord(w, 22 + i * 6, true),
          )}
        </div>
        <div>
          {endWords.map((w, i) => renderWord(w, 36 + i * 5))}
        </div>
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
          size={32}
          color={COLORS.primary[400]}
          strokeWidth={1.5}
          style={{ opacity: 0.7 }}
        />
        <h1
          style={{
            fontFamily: GT_ALPINA,
            fontSize: 86,
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
          transform: `translateY(${interpolate(urlSpring, [0, 1], [12, 0], CLAMP)}px)`,
        }}
      >
        <div
          style={{
            padding: "12px 28px",
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
              fontSize: 20,
              color: COLORS.primary[300],
              fontWeight: 500,
            }}
          >
            axos.ai
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═════════════════════════════════════════════════════════════════
// MAIN COMPOSITION
// ═════════════════════════════════════════════════════════════════
export const AxosPortfolioRiskSignalDemo: React.FC = () => {
  return (
    <AnimatedBackground>
      {/* SFX: text reveal sound */}
      <Sequence from={16}>
        <Audio
          src={staticFile("sfx-text-reveal.mp3")}
          volume={0.6}
        />
      </Sequence>

      {/* Scene 1: Hook Text (0–4s) */}
      <Sequence from={0} durationInFrames={240}>
        <Scene1_Hook />
      </Sequence>

      {/* Scene 2: Dashboard + Alert (3.2–9.3s) */}
      <Sequence from={190} durationInFrames={370}>
        <Scene2_DashboardAlert />
      </Sequence>

      {/* Scene 3: Agent Processing (8.7–18.2s) */}
      <Sequence from={520} durationInFrames={580}>
        <Scene3_AgentProcessing />
      </Sequence>

      {/* Scene 4: Risk Score (17–22.8s) */}
      <Sequence from={1020} durationInFrames={350}>
        <Scene4_RiskScore />
      </Sequence>

      {/* Scene 5: Closing (22–27.3s) */}
      <Sequence from={1320} durationInFrames={320}>
        <Scene5_Closing />
      </Sequence>
    </AnimatedBackground>
  );
};
