import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  interpolate,
  Easing,
  spring,
  Img,
} from "remotion";
import { Video } from "@remotion/media";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadLocalFont } from "@remotion/fonts";
import { COLORS } from "../design-system/design-tokens";

// ─── Fonts ──────────────────────────────────────────────────────
loadLocalFont({
  family: "GT Alpina",
  url: staticFile("GT Alpina Light-normal-300-100.otf"),
  weight: "300",
  style: "normal",
});
const GT_ALPINA = "GT Alpina";

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

const GLASS_BG =
  "linear-gradient(to bottom, rgba(51,51,57,0.92), rgba(53,53,56,0.92), rgba(38,38,39,0.92))";
const GLASS_SHADOW =
  "0 40px 60px 0 rgba(0,0,0,0.4), 0 20px 30px 0 rgba(0,0,0,0.3), inset 0.6px 0.6px 0.6px 0 rgba(255,255,255,0.32), inset 0.6px -0.4px 0.6px 0 rgba(255,255,255,0.05)";

// ─── Report Data ────────────────────────────────────────────────
const REALLOCATIONS = [
  {
    asset: "BTC",
    currentPct: 40,
    targetPct: 35,
    direction: "decrease" as const,
    reason:
      "Overexposure during high macro volatility. Reduce to protect recent gains.",
    urgency: "high" as const,
    confidence: 88,
  },
  {
    asset: "ETH",
    currentPct: 20,
    targetPct: 25,
    direction: "increase" as const,
    reason:
      "Dencun upgrade boosts L2 activity. Strong fundamentals for the medium term.",
    urgency: "medium" as const,
    confidence: 82,
  },
  {
    asset: "Stablecoins",
    currentPct: 15,
    targetPct: 20,
    direction: "increase" as const,
    reason:
      "Increase liquidity reserves for buying opportunities in a potential correction.",
    urgency: "high" as const,
    confidence: 91,
  },
];

const MARKET_EVENT = {
  title: "BTC-Macro Correlation Divergence",
  description:
    "US inflation data above expectations pressures risk assets. BTC shows weakness at $67k support level.",
  impactScore: -3.2,
  impactLabel: "Estimated Portfolio Impact",
};

const RISK_INDICATORS = [
  { label: "30d Volatility", value: "High", color: "#ef4444" },
  { label: "Liquidity", value: "Moderate", color: "#f59e0b" },
  { label: "On-Chain Sentiment", value: "Neutral", color: "#f59e0b" },
  { label: "Macro Risk", value: "Elevated", color: "#ef4444" },
];

// ─── Icons ──────────────────────────────────────────────────────
const BellIcon = ({ size = 32 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="rgba(255,255,255,0.85)"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const SparklesIcon = ({
  size = 12,
  color = COLORS.purple.light,
}: {
  size?: number;
  color?: string;
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 3L13.45 8.55L19 10L13.45 11.45L12 17L10.55 11.45L5 10L10.55 8.55L12 3Z"
      fill={color}
    />
    <path
      d="M18 14L18.62 16.38L21 17L18.62 17.62L18 20L17.38 17.62L15 17L17.38 16.38L18 14Z"
      fill={color}
      opacity={0.7}
    />
  </svg>
);

const ArrowIcon = ({
  direction,
  color,
}: {
  direction: "up" | "down";
  color: string;
}) => (
  <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
    <path
      d={
        direction === "up"
          ? "M7 11V3M7 3L3 6.5M7 3L11 6.5"
          : "M7 3V11M7 11L3 7.5M7 11L11 7.5"
      }
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ═════════════════════════════════════════════════════════════════
// MAIN COMPOSITION
// ═════════════════════════════════════════════════════════════════
export const ScreenRecordingWithClock: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();

  const spr = (delay: number, config?: Record<string, number>) =>
    spring({ frame, fps, delay, config: { damping: 200, ...config } });

  /* ══ SCENE 1 & 2: VIDEO + CLOCK ═══════════════════════════════ */
  const VIDEO_FRAMES = Math.round(9 * fps);
  const FADE_DUR = Math.round(1 * fps);
  const CLOCK_DUR = Math.round(3 * fps);
  const FADE_START = VIDEO_FRAMES - FADE_DUR;
  const CLOCK_START = FADE_START;

  const videoOpacity = interpolate(
    frame,
    [FADE_START, VIDEO_FRAMES],
    [1, 0],
    CLAMP,
  );

  const cF = Math.max(0, frame - CLOCK_START);
  const clockProgress = interpolate(cF, [0, CLOCK_DUR], [0, 1], CLAMP);
  const eased = Easing.in(Easing.exp)(clockProgress);
  const hourRot = eased * 360 * 3;
  const minuteRot = eased * 360 * 36;
  const secondRot = eased * 360 * 36 * 12;

  const clockOpacity = interpolate(
    cF,
    [0, Math.round(fps * 0.6)],
    [0, 1],
    CLAMP,
  );
  const clockScale = spring({
    frame: cF,
    fps,
    config: { damping: 16, stiffness: 55, mass: 1.2 },
  });
  const endFade = interpolate(
    cF,
    [CLOCK_DUR - Math.round(fps * 0.8), CLOCK_DUR],
    [1, 0],
    CLAMP,
  );

  const CLOCK_SIZE = 380;
  const CC = CLOCK_SIZE / 2;
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const angle = (i * 6 - 90) * (Math.PI / 180);
    const isHour = i % 5 === 0;
    const inner = isHour ? CC - 45 : CC - 24;
    const outer = CC - 14;
    return {
      isHour,
      x1: CC + Math.cos(angle) * inner,
      y1: CC + Math.sin(angle) * inner,
      x2: CC + Math.cos(angle) * outer,
      y2: CC + Math.sin(angle) * outer,
    };
  });

  /* ══ SCENE 3: FOLLOW-UP REPORT ════════════════════════════════ */
  const S3 = {
    bellIn: 320,
    bellRing: 340,
    badgePop: 348,
    notifCardIn: 355,
    cursorIn: 395,
    cursorArrive: 430,
    cursorClick: 434,
    morphStart: 440,
    cursorOut: 448,
    morphEnd: 475,
    headerIn: 468,
    impactIn: 485,
    contextIn: 505,
    reallocIn: 525,
    riskIn: 565,
    fadeOut: 670,
    end: 690,
  };

  const s3Active = frame >= S3.bellIn;
  const s3F = Math.max(0, frame - S3.bellIn);

  // ── Bell ──
  const bellScale = spr(S3.bellIn, { damping: 15, stiffness: 150 });
  const bellOp = interpolate(s3F, [0, 12], [0, 1], CLAMP);
  const bellShake =
    frame >= S3.bellRing && frame < S3.bellRing + 30
      ? Math.sin((frame - S3.bellRing) * 0.8) *
        interpolate(frame, [S3.bellRing, S3.bellRing + 30], [12, 0], CLAMP)
      : 0;

  // ── Badge ──
  const badgeScale = spr(S3.badgePop, { damping: 12, stiffness: 200 });

  // ── Notification card ──
  const notifSpr = spr(S3.notifCardIn, { damping: 22, stiffness: 140 });
  const notifOp = interpolate(notifSpr, [0, 0.5], [0, 1], CLAMP);
  const notifY = interpolate(notifSpr, [0, 1], [20, 0]);

  // ── Cursor ──
  const NOTIF_CENTER = { x: 960, y: 540 };
  const CURSOR_START_POS = { x: 1400, y: 820 };

  const cursorT = interpolate(
    frame,
    [S3.cursorIn, S3.cursorArrive],
    [0, 1],
    CLAMP,
  );
  const cursorEase = Easing.inOut(Easing.cubic)(cursorT);
  const cursorX =
    CURSOR_START_POS.x + (NOTIF_CENTER.x - CURSOR_START_POS.x) * cursorEase;
  const cursorY =
    CURSOR_START_POS.y + (NOTIF_CENTER.y - CURSOR_START_POS.y) * cursorEase;
  const cursorOp = interpolate(
    frame,
    [S3.cursorIn, S3.cursorIn + 10, S3.cursorOut, S3.cursorOut + 8],
    [0, 1, 1, 0],
    CLAMP,
  );
  const cursorSc =
    frame >= S3.cursorClick && frame <= S3.cursorClick + 6
      ? interpolate(
          frame,
          [S3.cursorClick, S3.cursorClick + 3, S3.cursorClick + 6],
          [1, 0.82, 1],
          CLAMP,
        )
      : 1;

  // ── Zoom toward notification ──
  const s3Zoom = interpolate(
    frame,
    [S3.cursorIn, S3.cursorArrive, S3.morphStart, S3.morphEnd],
    [1.0, 1.3, 1.3, 1.0],
    CLAMP,
  );
  const s3ZoomOX = interpolate(
    frame,
    [S3.cursorIn, S3.cursorArrive, S3.morphStart, S3.morphEnd],
    [50, (NOTIF_CENTER.x / W) * 100, (NOTIF_CENTER.x / W) * 100, 50],
    CLAMP,
  );
  const s3ZoomOY = interpolate(
    frame,
    [S3.cursorIn, S3.cursorArrive, S3.morphStart, S3.morphEnd],
    [50, (NOTIF_CENTER.y / H) * 100, (NOTIF_CENTER.y / H) * 100, 50],
    CLAMP,
  );

  // ── Morph: notification → report ──
  const morphProg = spr(S3.morphStart, {
    damping: 16,
    stiffness: 55,
    mass: 1.2,
  });
  const morphW = interpolate(morphProg, [0, 1], [520, 1100]);
  const morphH = interpolate(morphProg, [0, 1], [76, 880]);
  const morphR = interpolate(morphProg, [0, 1], [16, 24]);

  const notifContentOp = interpolate(morphProg, [0, 0.15], [1, 0], CLAMP);
  const reportContentOp = interpolate(morphProg, [0.5, 0.85], [0, 1], CLAMP);

  // ── Report staggered content ──
  const headerSpr = spr(S3.headerIn, { damping: 22, stiffness: 140 });
  const impactSpr = spr(S3.impactIn, { damping: 20, stiffness: 150 });
  const contextSpr = spr(S3.contextIn, { damping: 22, stiffness: 140 });
  const reallocSprs = REALLOCATIONS.map((_, i) =>
    spr(S3.reallocIn + i * 10, { damping: 20, stiffness: 160 }),
  );
  const riskSpr = spr(S3.riskIn, { damping: 22, stiffness: 140 });

  const reveal = (p: number) => ({
    opacity: interpolate(p, [0, 0.5], [0, 1], CLAMP),
    transform: `translateY(${interpolate(p, [0, 1], [16, 0])}px)`,
  });

  // ── Reallocation bar animations ──
  const barProgs = REALLOCATIONS.map((_, i) =>
    spr(S3.reallocIn + i * 10 + 8, { damping: 18, stiffness: 100 }),
  );

  // ── Final fade ──
  const s3FinalFade = interpolate(
    frame,
    [S3.fadeOut, S3.end],
    [1, 0],
    CLAMP,
  );

  // ── Urgency / direction helpers ──
  const urgencyColor = (u: string) =>
    u === "high" ? "#ef4444" : u === "medium" ? "#f59e0b" : "#10b981";
  const dirColor = (d: string) => (d === "decrease" ? "#f59e0b" : "#10b981");
  const dirLabel = (d: string) => (d === "decrease" ? "Reduce" : "Increase");

  /* ══ RENDER ═══════════════════════════════════════════════════ */
  return (
    <AbsoluteFill
      style={{ backgroundColor: "#000000", fontFamily: interFont }}
    >
      {/* ── Scene 1: Screen recording video ── */}
      {frame < VIDEO_FRAMES + 5 && (
        <div style={{ position: "absolute", inset: 0, opacity: videoOpacity }}>
          <Video
            src={staticFile(
              "Gravação de Tela 2026-03-05 às 05.25.59.mov",
            )}
            trimBefore={9 * fps}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            muted
          />
        </div>
      )}

      {/* ── Scene 2: Clock ── */}
      {cF > 0 && frame < S3.bellIn + 15 && (
        <AbsoluteFill
          style={{
            opacity: clockOpacity * endFade,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: CLOCK_SIZE,
              height: CLOCK_SIZE,
              borderRadius: "50%",
              background: GLASS_BG,
              backdropFilter: "blur(12px)",
              boxShadow: GLASS_SHADOW,
              position: "relative",
              transform: `scale(${clockScale})`,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -60,
                left: 0,
                width: "100%",
                height: 160,
                background:
                  "radial-gradient(ellipse at center top, rgba(139, 92, 246, 0.35) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 12,
                borderRadius: "50%",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            />
            <svg
              width={CLOCK_SIZE}
              height={CLOCK_SIZE}
              style={{ position: "absolute", inset: 0 }}
            >
              {ticks.map((t, i) => (
                <line
                  key={i}
                  x1={t.x1}
                  y1={t.y1}
                  x2={t.x2}
                  y2={t.y2}
                  stroke={
                    t.isHour
                      ? "rgba(255,255,255,0.7)"
                      : "rgba(255,255,255,0.15)"
                  }
                  strokeWidth={t.isHour ? 2.5 : 1}
                  strokeLinecap="round"
                />
              ))}
              <line
                x1={CC}
                y1={CC + 16}
                x2={CC}
                y2={CC - 70}
                stroke="rgba(255, 255, 255, 0.85)"
                strokeWidth={5}
                strokeLinecap="round"
                transform={`rotate(${hourRot}, ${CC}, ${CC})`}
              />
              <line
                x1={CC}
                y1={CC + 12}
                x2={CC}
                y2={CC - 105}
                stroke={COLORS.purple.darker}
                strokeWidth={3.5}
                strokeLinecap="round"
                transform={`rotate(${minuteRot}, ${CC}, ${CC})`}
              />
              <g transform={`rotate(${secondRot}, ${CC}, ${CC})`}>
                <line
                  x1={CC}
                  y1={CC + 25}
                  x2={CC}
                  y2={CC - 130}
                  stroke={COLORS.purple.dark}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                />
                <circle
                  cx={CC}
                  cy={CC + 20}
                  r={3.5}
                  fill={COLORS.purple.dark}
                />
              </g>
              <circle cx={CC} cy={CC} r={8} fill={COLORS.purple.darker} />
              <circle
                cx={CC}
                cy={CC}
                r={3.5}
                fill="rgba(255, 255, 255, 0.85)"
              />
            </svg>
          </div>
        </AbsoluteFill>
      )}

      {/* ══ Scene 3: Follow-up Report ══════════════════════════ */}
      {s3Active && (
        <AbsoluteFill style={{ opacity: s3FinalFade }}>
          {/* Zoom wrapper */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `scale(${s3Zoom})`,
              transformOrigin: `${s3ZoomOX}% ${s3ZoomOY}%`,
            }}
          >
            {/* ── Morphing container (notification → report) ── */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) translateY(${frame < S3.morphStart ? notifY : 0}px)`,
                width: morphW,
                height: morphH,
                borderRadius: morphR,
                background: GLASS_BG,
                backdropFilter: "blur(12px)",
                boxShadow: GLASS_SHADOW,
                overflow: "hidden",
                opacity: frame < S3.notifCardIn ? bellOp : 1,
              }}
            >
              {/* Purple glow at top */}
              <div
                style={{
                  position: "absolute",
                  top: -70,
                  left: 0,
                  width: "100%",
                  height: 180,
                  background:
                    "radial-gradient(ellipse at center top, rgba(139, 92, 246, 0.35) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              {/* ── NOTIFICATION CONTENT (fades out during morph) ── */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: notifContentOp,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 24px",
                  gap: 16,
                }}
              >
                {/* Bell with badge */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div
                    style={{
                      transform: `scale(${bellScale}) rotate(${bellShake}deg)`,
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: "rgba(139, 92, 246, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <BellIcon size={26} />
                  </div>
                  {/* Badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: -4,
                      right: -4,
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "#ef4444",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#fff",
                      transform: `scale(${badgeScale})`,
                      boxShadow: "0 2px 8px rgba(239,68,68,0.4)",
                    }}
                  >
                    1
                  </div>
                </div>

                {/* Text */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    opacity: notifOp,
                  }}
                >
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: COLORS.text.primary,
                    }}
                  >
                    New automated analysis completed
                  </span>
                  <span
                    style={{ fontSize: 12, color: COLORS.text.muted }}
                  >
                    Follow-up report available • Now
                  </span>
                </div>

                {/* Tag */}
                <div
                  style={{
                    marginLeft: "auto",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "5px 10px",
                    borderRadius: 8,
                    background: "rgba(139,92,246,0.12)",
                    border: "1px solid rgba(139,92,246,0.3)",
                    fontSize: 10,
                    fontWeight: 600,
                    color: COLORS.purple.light,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase" as const,
                    opacity: notifOp,
                    flexShrink: 0,
                  }}
                >
                  <SparklesIcon size={10} />
                  Auto
                </div>
              </div>

              {/* ── REPORT CONTENT (fades in after morph) ── */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: reportContentOp,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    ...reveal(headerSpr),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "22px 28px 16px",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: displayFont,
                      fontSize: 20,
                      fontWeight: 600,
                      color: COLORS.text.primary,
                    }}
                  >
                    Follow-up Report
                  </span>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "5px 12px",
                      borderRadius: 8,
                      background: "rgba(139,92,246,0.12)",
                      border: "1px solid rgba(139,92,246,0.3)",
                      fontSize: 11,
                      fontWeight: 600,
                      color: COLORS.purple.light,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase" as const,
                    }}
                  >
                    <SparklesIcon size={11} />
                    Automated Analysis
                  </div>
                </div>

                {/* Scrollable body */}
                <div
                  style={{
                    flex: 1,
                    padding: "20px 28px 24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 22,
                    overflow: "hidden",
                  }}
                >
                  {/* ── Impact Hero ── */}
                  <div
                    style={{
                      ...reveal(impactSpr),
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 16,
                      padding: "20px 24px",
                      display: "flex",
                      alignItems: "center",
                      gap: 24,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: monoFont,
                          fontSize: 44,
                          fontWeight: 700,
                          color: "#ef4444",
                          lineHeight: 1,
                        }}
                      >
                        {MARKET_EVENT.impactScore}%
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: COLORS.text.muted,
                          marginTop: 4,
                          textTransform: "uppercase" as const,
                          letterSpacing: "0.06em",
                          fontWeight: 500,
                        }}
                      >
                        {MARKET_EVENT.impactLabel}
                      </div>
                    </div>
                    <div
                      style={{
                        width: 1,
                        height: 56,
                        background: "rgba(255,255,255,0.08)",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: COLORS.text.primary,
                          marginBottom: 6,
                        }}
                      >
                        {MARKET_EVENT.title}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: COLORS.text.muted,
                          lineHeight: 1.5,
                        }}
                      >
                        {MARKET_EVENT.description}
                      </div>
                    </div>
                  </div>

                  {/* ── Market Context ── */}
                  <div style={reveal(contextSpr)}>
                    <div
                      style={{
                        fontFamily: GT_ALPINA,
                        fontSize: 26,
                        fontWeight: 300,
                        color: COLORS.text.secondary,
                        letterSpacing: "0.01em",
                        marginBottom: 12,
                      }}
                    >
                      Reallocation Recommendations
                    </div>
                  </div>

                  {/* ── Reallocation Cards ── */}
                  <div
                    style={{
                      display: "flex",
                      gap: 14,
                    }}
                  >
                    {REALLOCATIONS.map((item, i) => {
                      const p = reallocSprs[i];
                      const barP = barProgs[i];
                      const barWidth = interpolate(
                        barP,
                        [0, 1],
                        [item.currentPct, item.targetPct],
                      );
                      const dc = dirColor(item.direction);
                      return (
                        <div
                          key={i}
                          style={{
                            ...reveal(p),
                            flex: 1,
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: 14,
                            padding: "16px 18px",
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                          }}
                        >
                          {/* Asset header */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <span
                              style={{
                                fontFamily: monoFont,
                                fontSize: 16,
                                fontWeight: 700,
                                color: COLORS.text.primary,
                              }}
                            >
                              {item.asset}
                            </span>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                color: dc,
                                fontSize: 12,
                                fontWeight: 600,
                              }}
                            >
                              <ArrowIcon
                                direction={
                                  item.direction === "decrease" ? "down" : "up"
                                }
                                color={dc}
                              />
                              {dirLabel(item.direction)}
                            </div>
                          </div>

                          {/* Percentage change */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "baseline",
                              gap: 8,
                            }}
                          >
                            <span
                              style={{
                                fontFamily: monoFont,
                                fontSize: 22,
                                fontWeight: 700,
                                color: COLORS.text.primary,
                              }}
                            >
                              {item.currentPct}%
                            </span>
                            <span
                              style={{
                                fontSize: 16,
                                color: COLORS.text.muted,
                              }}
                            >
                              →
                            </span>
                            <span
                              style={{
                                fontFamily: monoFont,
                                fontSize: 22,
                                fontWeight: 700,
                                color: dc,
                              }}
                            >
                              {item.targetPct}%
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div
                            style={{
                              width: "100%",
                              height: 6,
                              borderRadius: 3,
                              background: "rgba(255,255,255,0.06)",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${barWidth}%`,
                                height: "100%",
                                borderRadius: 3,
                                background: dc,
                                transition: "none",
                              }}
                            />
                          </div>

                          {/* Reason */}
                          <div
                            style={{
                              fontSize: 12,
                              color: COLORS.text.muted,
                              lineHeight: 1.5,
                              flex: 1,
                            }}
                          >
                            {item.reason}
                          </div>

                          {/* Bottom row: urgency + confidence */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginTop: "auto",
                            }}
                          >
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 600,
                                padding: "3px 8px",
                                borderRadius: 6,
                                background: `${urgencyColor(item.urgency)}20`,
                                color: urgencyColor(item.urgency),
                                textTransform: "uppercase" as const,
                                letterSpacing: "0.05em",
                              }}
                            >
                              {item.urgency}
                            </span>
                            <span
                              style={{
                                fontFamily: monoFont,
                                fontSize: 11,
                                color: COLORS.text.muted,
                              }}
                            >
                              {item.confidence}% conf.
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* ── Risk Indicators ── */}
                  <div
                    style={{
                      ...reveal(riskSpr),
                      display: "flex",
                      gap: 10,
                    }}
                  >
                    {RISK_INDICATORS.map((r, i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 14px",
                          borderRadius: 10,
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            color: COLORS.text.muted,
                          }}
                        >
                          {r.label}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: r.color,
                          }}
                        >
                          {r.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Cursor (outside zoom) ── */}
          {cursorOp > 0 && (
            <div
              style={{
                position: "absolute",
                left: cursorX,
                top: cursorY,
                transform: `scale(${cursorSc})`,
                opacity: cursorOp,
                pointerEvents: "none",
                filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.7))",
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
      )}
    </AbsoluteFill>
  );
};
