import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  Img,
  Easing,
  Sequence,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadLocalFont } from "@remotion/fonts";
import { COLORS } from "../design-system/design-tokens";
import { Database, Search, BarChart2, Globe } from "lucide-react";

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

// ─── Platform Card Data ─────────────────────────────────────────
// Matches HTML constellation: each card has base transform state
const PLATFORM_CARDS = [
  { name: "CoinGecko", logo: "coingecko.png", x: 380, y: 260, baseScale: 0.85, baseRotate: -6, baseOpacity: 0.8 },
  { name: "Nansen", logo: "Logo Nansen.jpeg", x: 1540, y: 290, baseScale: 0.9, baseRotate: 4, baseOpacity: 0.85 },
  { name: "Arkham", logo: "arkham.avif", x: 960, y: 530, baseScale: 1, baseRotate: 0, baseOpacity: 1 },
  { name: "DefiLlama", logo: "defilama.jpeg", x: 340, y: 790, baseScale: 0.8, baseRotate: 8, baseOpacity: 0.75 },
  { name: "CoinMarketCap", logo: "coincap.png", x: 1560, y: 800, baseScale: 0.75, baseRotate: -5, baseOpacity: 0.7 },
];

// Cursor path keyframes (30fps internal)
// Each card: ~35 frames hold + 15 frames travel to next
//   card0 hold 25-60, travel 60-75
//   card1 hold 75-110, travel 110-125
//   card2 hold 125-165, travel 165-180
//   card3 hold 180-215, travel 215-230
//   card4 hold 230-258
const CK_FRAMES = [10, 25, 60, 75, 110, 125, 165, 180, 215, 230, 258, 265];
const CK_X = [960, 380, 380, 1540, 1540, 960, 960, 340, 340, 1560, 1560, 1560];
const CK_Y = [1100, 260, 260, 290, 290, 530, 530, 790, 790, 800, 800, 800];

// Focus windows per card (30fps internal) — generous hold + smooth ramps
const FOCUS_WINDOWS = [
  { cardIdx: 0, from: 22, to: 68 },
  { cardIdx: 1, from: 72, to: 118 },
  { cardIdx: 2, from: 122, to: 173 },
  { cardIdx: 3, from: 177, to: 223 },
  { cardIdx: 4, from: 227, to: 260 },
];

// ~0.5s ramps (15 frames in, 12 out at 30fps)
const getCardHighlight = (cardIdx: number, f: number): number => {
  const w = FOCUS_WINDOWS.find((fw) => fw.cardIdx === cardIdx);
  if (!w || f < w.from || f > w.to) return 0;
  const rampIn = interpolate(f, [w.from, w.from + 15], [0, 1], CLAMP);
  const rampOut = interpolate(f, [w.to - 12, w.to], [1, 0], CLAMP);
  return Math.min(rampIn, rampOut);
};

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
        backgroundColor: "#050505",
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
// GLASS PLATFORM CARD
// ═════════════════════════════════════════════════════════════════

const GlassPlatformCard: React.FC<{
  logo: string;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  baseScale: number;
  baseRotate: number;
  baseOpacity: number;
  highlight: number;
  dimFactor: number;
  floatPhase: number;
  entranceDelay: number;
}> = ({
  logo, name, x, y, w, h,
  baseScale, baseRotate, baseOpacity,
  highlight, dimFactor, floatPhase, entranceDelay,
}) => {
  const { frame, fps } = useAnimFrame();

  // Entrance
  const eSpr = spring({
    frame: frame - entranceDelay,
    fps,
    config: { damping: 22, stiffness: 80, mass: 1 },
  });
  const eOp = interpolate(frame, [entranceDelay, entranceDelay + 15], [0, 1], CLAMP);
  const eY = interpolate(eSpr, [0, 1], [40, 0], CLAMP);

  // Float (different speeds per card like HTML: 8s, 10s, 9s, 11s, 12s)
  const floatY = Math.sin(frame * 0.035 + floatPhase) * 12;
  const floatX = Math.sin(frame * 0.022 + floatPhase * 1.5) * 8;

  // Focus effects — exact HTML values:
  // Focused: scale(1.15) rotate(0deg) blur(0) brightness(1.1) opacity(1)
  // Defocused: scale(0.75) rotate(0deg) blur(12px) brightness(0.7) opacity(0.4)
  // Neutral (no focus mode): baseScale, baseRotate, baseOpacity
  const effectiveScale = highlight > 0
    ? interpolate(highlight, [0, 1], [baseScale, 1.15])
    : baseScale * (1 - dimFactor) + 0.75 * dimFactor;
  const rotate = highlight > 0
    ? interpolate(highlight, [0, 1], [baseRotate, 0])
    : baseRotate * (1 - dimFactor);
  const blur = 12 * dimFactor;
  const brightness = 1 + 0.1 * highlight - 0.3 * dimFactor;
  const effectiveOpacity = highlight > 0
    ? interpolate(highlight, [0, 1], [baseOpacity, 1])
    : baseOpacity * (1 - dimFactor) + 0.4 * dimFactor;

  // Border — HTML: 0.08 base, 0.25 focused, 0.02 defocused
  const borderAlpha = highlight > 0
    ? interpolate(highlight, [0, 1], [0.08, 0.25])
    : interpolate(dimFactor, [0, 1], [0.08, 0.02]);
  const borderTopAlpha = highlight > 0
    ? interpolate(highlight, [0, 1], [0.15, 0.3])
    : interpolate(dimFactor, [0, 1], [0.15, 0.02]);
  const borderLeftAlpha = highlight > 0
    ? interpolate(highlight, [0, 1], [0.12, 0.25])
    : interpolate(dimFactor, [0, 1], [0.12, 0.02]);

  // Specular shine — sweeps across when focused (like HTML ::before)
  const sweepX = interpolate(highlight, [0.3, 1], [-100, 200], CLAMP);

  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2 + floatX,
        top: y - h / 2 + floatY + eY,
        width: w,
        height: h,
        opacity: eOp * effectiveOpacity,
        transform: `scale(${eSpr * effectiveScale}) rotate(${rotate}deg)`,
        filter: `blur(${blur}px) brightness(${brightness})`,
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
        backdropFilter: "blur(24px) saturate(120%)",
        WebkitBackdropFilter: "blur(24px) saturate(120%)",
        border: `1px solid rgba(255,255,255,${borderAlpha})`,
        borderTop: `1px solid rgba(255,255,255,${borderTopAlpha})`,
        borderLeft: `1px solid rgba(255,255,255,${borderLeftAlpha})`,
        borderRadius: 32,
        boxShadow: highlight > 0.5
          ? `0 50px 100px -20px rgba(0,0,0,0.8), 0 0 60px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.3)`
          : `0 30px 60px -15px rgba(0,0,0,0.6), inset 0 0 20px rgba(255,255,255,0.02)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: 32,
        overflow: "hidden",
      }}
    >
      {/* Internal specular shine — slides across on focus like HTML ::before */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: `${sweepX}%`,
          width: "50%",
          height: "100%",
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
          transform: "skewX(-20deg)",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />
      <Img
        src={staticFile(logo)}
        style={{
          width: 80,
          height: 80,
          borderRadius: 20,
          objectFit: "cover",
        }}
      />
      <span
        style={{
          fontFamily: displayFont,
          fontSize: 16,
          fontWeight: 500,
          color: `rgba(255,255,255,${interpolate(highlight, [0, 1], [0.4, 0.85])})`,
          letterSpacing: "0.03em",
        }}
      >
        {name}
      </span>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════
// SCENE 1: CRYPTO PLATFORM CONSTELLATION
// ═════════════════════════════════════════════════════════════════

const Scene1_CryptoConstellation: React.FC = () => {
  const { frame } = useAnimFrame();

  // Scene fade-out
  const sceneOp = interpolate(frame, [245, 265], [1, 0], CLAMP);

  // Cursor position (smooth path through all cards)
  const cursorX = interpolate(frame, CK_FRAMES, CK_X, CLAMP);
  const cursorY = interpolate(frame, CK_FRAMES, CK_Y, CLAMP);

  // Cursor visibility
  const cursorOp =
    interpolate(frame, [10, 25], [0, 1], CLAMP) *
    interpolate(frame, [258, 265], [1, 0], CLAMP);

  // Global focus intensity (ramps up when cursor starts, down when it leaves)
  const focusIntensity = Math.min(
    interpolate(frame, [20, 30], [0, 1], CLAMP),
    interpolate(frame, [258, 265], [1, 0], CLAMP),
  );

  return (
    <AbsoluteFill style={{ opacity: sceneOp }}>
      {/* Ambient blobs — matching HTML: white/silver/slate, blur(150px), opacity 0.4 */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "-10%",
          width: "50vw",
          height: "50vw",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
          filter: "blur(150px)",
          opacity: 0.4,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          right: "-10%",
          width: "60vw",
          height: "60vw",
          borderRadius: "50%",
          background: "rgba(161,161,170,0.15)",
          filter: "blur(150px)",
          opacity: 0.4,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "20%",
          width: "40vw",
          height: "40vw",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          filter: "blur(150px)",
          opacity: 0.4,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "10%",
          width: "45vw",
          height: "45vw",
          borderRadius: "50%",
          background: "rgba(113,113,122,0.15)",
          filter: "blur(150px)",
          opacity: 0.4,
          pointerEvents: "none",
        }}
      />

      {/* Platform cards */}
      {PLATFORM_CARDS.map((card, i) => {
        const highlight = getCardHighlight(i, frame);
        const dimFactor = focusIntensity * (1 - highlight);
        const isCenter = i === 2;
        return (
          <GlassPlatformCard
            key={card.name}
            logo={card.logo}
            name={card.name}
            x={card.x}
            y={card.y}
            w={isCenter ? 380 : 340}
            h={isCenter ? 260 : 220}
            baseScale={card.baseScale}
            baseRotate={card.baseRotate}
            baseOpacity={card.baseOpacity}
            highlight={highlight}
            dimFactor={dimFactor}
            floatPhase={i * 1.3}
            entranceDelay={5 + i * 5}
          />
        );
      })}

      {/* Cursor */}
      {cursorOp > 0 && (
        <div
          style={{
            position: "absolute",
            left: cursorX,
            top: cursorY,
            opacity: cursorOp,
            pointerEvents: "none",
            filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.7))",
            zIndex: 100,
          }}
        >
          <Img
            src={staticFile("Cursor apontando.svg")}
            style={{ width: 56, height: 56 }}
          />
        </div>
      )}
    </AbsoluteFill>
  );
};

// ═════════════════════════════════════════════════════════════════
// NARRATION SUBTITLE (overlaid on chat scene)
// ═════════════════════════════════════════════════════════════════

// Narration text lines for left-side display
const NARRATION_TEXT_LINES = [
  "There's a better way.",
  "With Axos, the market",
  "comes together in",
  "one place —",
  "and it actually tells",
  "you what matters.",
];

// Words that get a purple highlighter effect
const HIGHLIGHT_WORDS = new Set(["one", "place", "actually"]);

// Word interval (30fps) for progressive reveal
const NARR_WORD_INTERVAL = 10;
const NARR_INITIAL_DELAY = 15;

const NarrationSubtitle: React.FC = () => {
  const { frame, fps } = useAnimFrame();

  // Fade out in sync with Scene 3
  const fadeOut = interpolate(frame, [280, 310], [1, 0], CLAMP);

  // (delays computed inline per word below)

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeOut,
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 120,
          top: "50%",
          transform: "translateY(-50%)",
          width: 640,
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        {NARRATION_TEXT_LINES.map((line, lineIdx) => {
          const words = line.split(" ");
          return (
            <div
              key={lineIdx}
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "baseline",
              }}
            >
              {words.map((word, wIdx) => {
                const globalWordIdx =
                  NARRATION_TEXT_LINES.slice(0, lineIdx)
                    .reduce((sum, l) => sum + l.split(" ").length, 0) + wIdx;
                const delay = NARR_INITIAL_DELAY + globalWordIdx * NARR_WORD_INTERVAL;
                const progress = spring({
                  frame: frame - delay,
                  fps,
                  config: { damping: 40, stiffness: 70, mass: 1.4 },
                });
                const y = interpolate(progress, [0, 1], [14, 0], CLAMP);
                const op = interpolate(progress, [0, 0.8], [0, 1], CLAMP);
                const blur = interpolate(progress, [0, 0.4], [3, 0], CLAMP);
                const isHighlighted = HIGHLIGHT_WORDS.has(
                  word.toLowerCase().replace(/[^a-z]/g, ""),
                );
                const hlOp = interpolate(progress, [0.5, 1], [0, 1], CLAMP);

                return (
                  <span
                    key={wIdx}
                    style={{
                      fontFamily: interFont,
                      fontSize: 56,
                      fontWeight: 400,
                      lineHeight: 1.2,
                      letterSpacing: "-0.01em",
                      opacity: op,
                      transform: `translateY(${y}px)`,
                      filter: `blur(${blur}px)`,
                      display: "inline-block",
                      marginRight: 10,
                      position: "relative",
                      background: isHighlighted
                        ? "linear-gradient(to bottom, #ffffff, #e2d4ff)"
                        : "linear-gradient(to bottom, #ffffff, #737373)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      paddingLeft: isHighlighted ? 6 : 0,
                      paddingRight: isHighlighted ? 6 : 0,
                    }}
                  >
                    {isHighlighted && (
                      <span
                        style={{
                          position: "absolute",
                          inset: 0,
                          top: "15%",
                          bottom: "10%",
                          borderRadius: 6,
                          background: `rgba(139,92,246,${0.2 * hlOp})`,
                          pointerEvents: "none",
                          zIndex: -1,
                        }}
                      />
                    )}
                    {word}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ═════════════════════════════════════════════════════════════════
// SCENE 3: AXOS CHAT
// ═════════════════════════════════════════════════════════════════

const SparklesIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 16,
  color = "#a78bfa",
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

const ArrowUpIcon: React.FC = () => (
  <svg width={18} height={18} viewBox="0 0 18 18" fill="none">
    <path
      d="M9 14V4M9 4L5 7.76M9 4L13 7.76"
      stroke="white"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CHAT_USER_MSG =
  "What changed in the market today that affects my portfolio?";

const INSIGHT_BLOCKS = [
  {
    title: "On-Chain",
    desc: "Whale inflow detected — 4,200 BTC moved to Binance",
    icon: Database,
  },
  {
    title: "Sentiment",
    desc: "Fear & Greed dropped from 68 → 52 in 24h",
    icon: Search,
  },
  {
    title: "Technical",
    desc: "2 holdings exposed — BTC & ETH directly affected",
    icon: BarChart2,
  },
];

// Timeline constants for Scene 3 (at 30fps internal via useAnimFrame)
const AXOS_REPLY_MSG =
  "Here's what changed today that affects your portfolio:";

const C = {
  barIn: 0,
  typeStart: 15,
  typeEnd: 48,
  handIn: 36,
  handArrive: 66,
  handClick: 72,
  handOut: 82,
  morphStart: 78,
  morphEnd: 110,
  userMsgIn: 116,
  loadingIn: 126,
  loadingOut: 140,
  replyTypeStart: 142,
  replyTypeEnd: 178,
  insightsIn: 182,
};

// Positions (absolute within 1920×1080)
const SEND_BTN = { x: 1530, y: 780 };
const CURSOR_START = { x: 1700, y: 920 };

const Scene3_AxosChat: React.FC = () => {
  const { frame, fps } = useAnimFrame();
  const W = 1920;
  const H = 1080;

  const val = (start: number, end: number, from: number, to: number) =>
    interpolate(frame, [start, end], [from, to], CLAMP);

  const spr = (delay: number, config?: Record<string, number>) =>
    spring({ frame, fps, delay, config: { damping: 200, ...config } });

  // ═══ PHASE 1: MINIMIZED BAR ══════════════════════════════════
  const barProgress = spr(C.barIn, { damping: 15, stiffness: 120 });
  const barOpacity = interpolate(barProgress, [0, 0.3], [0, 1], CLAMP);
  const barY = interpolate(barProgress, [0, 1], [80, 0]);

  const cursorVisible = frame >= C.typeStart && frame < C.morphStart;
  const cursorBlink = cursorVisible
    ? Math.sin(frame * 0.25) > 0 ? 1 : 0
    : 0;

  const typedChars = Math.floor(
    interpolate(frame, [C.typeStart, C.typeEnd], [0, CHAT_USER_MSG.length], {
      ...CLAMP,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }),
  );
  const typedText = CHAT_USER_MSG.slice(0, typedChars);

  const sendActive = frame >= C.typeEnd;
  const sendScale =
    frame >= C.handClick && frame <= C.handClick + 10
      ? interpolate(
          frame,
          [C.handClick, C.handClick + 4, C.handClick + 10],
          [1, 0.88, 1],
          CLAMP,
        )
      : sendActive && frame < C.morphStart
        ? interpolate(
            Math.sin((frame - C.typeEnd) * 0.12),
            [-1, 1],
            [0.97, 1.03],
          )
        : 1;

  // ═══ PHASE 2: MORPH ══════════════════════════════════════════
  const morphW = spr(C.morphStart, { damping: 20, stiffness: 30, mass: 1.6 });
  const morphH = spr(C.morphStart + 8, { damping: 20, stiffness: 25, mass: 1.6 });

  const widgetWidth = interpolate(morphW, [0, 1], [520, 860]);
  const widgetHeight = interpolate(morphH, [0, 1], [60, 620]);
  const widgetRadius = interpolate(morphW, [0, 1], [16, 24]);
  const widgetY = interpolate(morphH, [0, 1], [780, 540]);

  const minimizedContentOpacity = interpolate(morphW, [0, 0.2], [1, 0], CLAMP);
  const expandedContentOpacity = interpolate(morphH, [0.5, 0.9], [0, 1], CLAMP);

  const sweepX = val(C.morphEnd, C.morphEnd + 25, -0.5, 1.5);
  const sweepOpacity =
    frame >= C.morphEnd && frame < C.morphEnd + 25 ? 0.12 : 0;

  // ═══ HAND CURSOR ═════════════════════════════════════════════
  const handCursorT = interpolate(
    frame,
    [C.handIn, C.handArrive],
    [0, 1],
    CLAMP,
  );
  const handEase = Easing.bezier(0.22, 0.68, 0.35, 1.0)(handCursorT);
  const handCursorX =
    CURSOR_START.x + (SEND_BTN.x - CURSOR_START.x) * handEase;
  const handCursorY =
    CURSOR_START.y + (SEND_BTN.y - CURSOR_START.y) * handEase;
  const handCursorOp = interpolate(
    frame,
    [C.handIn, C.handIn + 15, C.handOut, C.handOut + 12],
    [0, 1, 1, 0],
    CLAMP,
  );
  const handCursorSc =
    frame >= C.handClick && frame <= C.handClick + 10
      ? interpolate(
          frame,
          [C.handClick, C.handClick + 4, C.handClick + 10],
          [1, 0.9, 1],
          CLAMP,
        )
      : 1;

  // Zoom toward button — subtle and smooth
  const handZoom = interpolate(
    frame,
    [C.handIn, C.handArrive, C.handClick, C.morphStart, C.morphStart + 20],
    [1.0, 1.18, 1.2, 1.12, 1.0],
    CLAMP,
  );
  const zoomOriginX = interpolate(
    frame,
    [C.handIn, C.handArrive, C.morphStart, C.morphStart + 20],
    [50, (SEND_BTN.x / W) * 100, (SEND_BTN.x / W) * 100, 50],
    CLAMP,
  );
  const zoomOriginY = interpolate(
    frame,
    [C.handIn, C.handArrive, C.morphStart, C.morphStart + 20],
    [50, (SEND_BTN.y / H) * 100, (SEND_BTN.y / H) * 100, 50],
    CLAMP,
  );

  // ═══ PHASE 3: CONVERSATION ══════════════════════════════════
  const userMsgProgress = spr(C.userMsgIn, { damping: 20, stiffness: 150 });
  const userMsgX = interpolate(userMsgProgress, [0, 1], [40, 0]);
  const userMsgOp = interpolate(userMsgProgress, [0, 0.5], [0, 1], CLAMP);

  const showLoadingDots = frame >= C.loadingIn && frame < C.loadingOut + 15;
  const loadingOp = showLoadingDots
    ? frame < C.loadingOut
      ? val(C.loadingIn, C.loadingIn + 10, 0, 1)
      : val(C.loadingOut, C.loadingOut + 15, 1, 0)
    : 0;

  // Scene fade-out (local frames at 30fps; 640 frames at 60fps ≈ 320 at 30fps)
  const sceneFadeOut = interpolate(frame, [280, 310], [1, 0], CLAMP);

  return (
    <AbsoluteFill style={{ opacity: sceneFadeOut }}>
      {/* ═══ ZOOM WRAPPER ═══ */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${handZoom})`,
          transformOrigin: `${zoomOriginX}% ${zoomOriginY}%`,
        }}
      >
        {/* ═══ MORPHING WIDGET ═══ */}
        <div
          style={{
            position: "absolute",
            left: "68%",
            top: widgetY,
            transform: `translate(-50%, -50%) translateY(${frame < C.morphStart ? barY : 0}px)`,
            width: widgetWidth,
            height: widgetHeight,
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderRadius: widgetRadius,
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.37)",
            overflow: "hidden",
            opacity: barOpacity,
          }}
        >
          {/* Light line at top */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "12.5%",
              width: "75%",
              height: 1,
              background:
                "linear-gradient(to right, transparent, rgba(168,85,247,0.25), transparent)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
          {/* Subtle ambient glow */}
          <div
            style={{
              position: "absolute",
              top: -40,
              left: "25%",
              width: "50%",
              height: 80,
              background:
                "radial-gradient(ellipse at center, rgba(139,92,246,0.1) 0%, transparent 70%)",
              opacity: frame >= C.morphEnd ? 0.8 : 0.3,
              pointerEvents: "none",
            }}
          />

          {/* Light sweep after morph */}
          {sweepOpacity > 0 && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: `${sweepX * 100}%`,
                width: "30%",
                height: "100%",
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
                opacity: sweepOpacity,
                pointerEvents: "none",
                transform: "skewX(-15deg)",
              }}
            />
          )}

          {/* ─── MINIMIZED BAR CONTENT ─── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: minimizedContentOpacity,
              display: "flex",
              alignItems: "center",
              padding: 12,
              gap: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: 4,
              }}
            >
              <SparklesIcon size={18} color="rgba(168,85,247,0.5)" />
            </div>

            <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
              <span
                style={{
                  fontSize: 18,
                  color: typedChars > 0 ? "#ffffff" : "rgba(255,255,255,0.4)",
                  lineHeight: "24px",
                }}
              >
                {typedChars > 0 ? typedText : "Ask Axos..."}
              </span>
              {cursorVisible && (
                <span
                  style={{
                    display: "inline-block",
                    width: 2,
                    height: 18,
                    background: COLORS.purple.light,
                    marginLeft: 1,
                    verticalAlign: "middle",
                    opacity: cursorBlink,
                  }}
                />
              )}
            </div>

            <div
              style={{
                width: 32,
                height: 32,
                minWidth: 32,
                borderRadius: "50%",
                background: sendActive ? "rgba(139,92,246,0.8)" : "rgba(255,255,255,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${sendScale})`,
              }}
            >
              <ArrowUpIcon />
            </div>
          </div>

          {/* ─── EXPANDED CHAT CONTENT ─── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: expandedContentOpacity,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "16px 24px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                flexShrink: 0,
                gap: 8,
              }}
            >
              <SparklesIcon size={15} color="rgba(168,85,247,0.5)" />
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  color: "rgba(255,255,255,0.4)",
                  textTransform: "uppercase" as const,
                }}
              >
                Axos
              </span>
            </div>

            {/* Messages area */}
            <div
              style={{
                flex: 1,
                overflow: "hidden",
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              {/* User message */}
              {frame >= C.userMsgIn && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    opacity: userMsgOp,
                    transform: `translateX(${userMsgX}px)`,
                  }}
                >
                  <div
                    style={{
                      padding: "12px 20px",
                      borderRadius: "16px 16px 4px 16px",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.85)",
                      fontSize: 15,
                      lineHeight: 1.6,
                      maxWidth: "80%",
                    }}
                  >
                    {CHAT_USER_MSG}
                  </div>
                </div>
              )}

              {/* Axos response — logo + loading dots + insight cards */}
              {frame >= C.loadingIn && (
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                  }}
                >
                  {/* Axos logo avatar */}
                  <Img
                    src={staticFile("Logo 4k ChatGPT Dez 6 2025.png")}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      objectFit: "cover",
                      flexShrink: 0,
                      marginTop: 4,
                      opacity: interpolate(
                        frame,
                        [C.loadingIn, C.loadingIn + 10],
                        [0, 1],
                        CLAMP,
                      ),
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    {/* Loading dots (shown before insights) */}
                    {showLoadingDots && (
                      <div
                        style={{
                          display: "flex",
                          gap: 5,
                          alignItems: "center",
                          opacity: loadingOp,
                          height: 24,
                        }}
                      >
                        {[0, 1, 2].map((d) => (
                          <div
                            key={d}
                            style={{
                              width: 5,
                              height: 5,
                              borderRadius: "50%",
                              background: "rgba(168,85,247,0.4)",
                              transform: `translateY(${Math.sin((frame - C.loadingIn) * 0.25 + d * 1.2) * 2.5}px)`,
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {/* Axos typed reply text */}
                    {frame >= C.replyTypeStart && (
                      <div
                        style={{
                          padding: "12px 20px",
                          borderRadius: "16px 16px 16px 4px",
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          fontSize: 15,
                          lineHeight: 1.6,
                          color: "rgba(255,255,255,0.85)",
                          maxWidth: "85%",
                          opacity: interpolate(
                            frame,
                            [C.replyTypeStart, C.replyTypeStart + 8],
                            [0, 1],
                            CLAMP,
                          ),
                        }}
                      >
                        {AXOS_REPLY_MSG.slice(
                          0,
                          Math.floor(
                            interpolate(
                              frame,
                              [C.replyTypeStart, C.replyTypeEnd],
                              [0, AXOS_REPLY_MSG.length],
                              CLAMP,
                            ),
                          ),
                        )}
                        {frame < C.replyTypeEnd && (
                          <span
                            style={{
                              display: "inline-block",
                              width: 2,
                              height: 14,
                              background: COLORS.primary[400],
                              marginLeft: 1,
                              verticalAlign: "middle",
                              opacity: Math.sin(frame * 0.25) > 0 ? 1 : 0,
                            }}
                          />
                        )}
                      </div>
                    )}

                    {/* Insight cards — inline-flex to shrink to content */}
                    {frame >= C.insightsIn && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                        }}
                      >
                  {INSIGHT_BLOCKS.map((block, i) => {
                    const blockDelay = C.insightsIn + 6 + i * 16;
                    const blockSpr = spring({
                      frame: frame - blockDelay,
                      fps,
                      config: { damping: 22, stiffness: 110 },
                    });
                    const blockOp = interpolate(
                      frame,
                      [blockDelay, blockDelay + 12],
                      [0, 1],
                      CLAMP,
                    );
                    const blockY = interpolate(blockSpr, [0, 1], [12, 0], CLAMP);
                    const IconComp = block.icon;

                    return (
                      <div
                        key={i}
                        style={{
                          opacity: blockOp,
                          transform: `translateY(${blockY}px) scale(${blockSpr})`,
                          background: "rgba(32,32,32,0.80)",
                          backdropFilter: "blur(12px)",
                          WebkitBackdropFilter: "blur(12px)",
                          borderRadius: 16,
                          boxShadow: "0 0 44px 0 rgba(0,0,0,0.8)",
                          padding: "10px 16px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 10,
                          position: "relative",
                          overflow: "hidden",
                          alignSelf: "flex-start",
                        }}
                      >
                        {/* Purple glow */}
                        <div
                          style={{
                            position: "absolute",
                            width: 60,
                            height: 60,
                            top: -15,
                            left: -15,
                            borderRadius: "50%",
                            pointerEvents: "none",
                            filter: "blur(28px)",
                            backgroundColor: "rgba(142,91,255,0.15)",
                          }}
                        />
                        {/* Gradient border overlay */}
                        <span
                          style={{
                            position: "absolute",
                            inset: 0,
                            pointerEvents: "none",
                            opacity: 0.5,
                            borderRadius: 16,
                            border: "1px solid transparent",
                            background:
                              "linear-gradient(210deg, rgba(255,255,255,0.22) 6.2%, rgba(20,20,20,0.5) 21.56%, rgba(50,50,50,0.5) 69.03%, rgba(255,255,255,0.4) 96.99%) border-box",
                            WebkitMask:
                              "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
                            WebkitMaskComposite: "xor",
                            maskComposite: "exclude" as unknown as string,
                          }}
                        />
                        {/* Icon box */}
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
                            flexShrink: 0,
                          }}
                        >
                          <IconComp size={18} color={COLORS.primary[300]} />
                        </div>
                        {/* Text */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            minWidth: 0,
                          }}
                        >
                          <span
                            style={{
                              fontFamily: displayFont,
                              fontSize: 14,
                              fontWeight: 600,
                              color: COLORS.text.primary,
                            }}
                          >
                            {block.title}
                          </span>
                          <span
                            style={{
                              fontSize: 12,
                              color: "rgba(255,255,255,0.45)",
                              lineHeight: 1.3,
                            }}
                          >
                            {block.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer input */}
            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                padding: "14px 20px",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: "rgba(255,255,255,0.2)",
                }}
              >
                Ask anything...
              </span>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <ArrowUpIcon />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ HAND CURSOR (outside zoom wrapper) ═══ */}
      {handCursorOp > 0 && (
        <div
          style={{
            position: "absolute",
            left: handCursorX,
            top: handCursorY,
            transform: `scale(${handCursorSc})`,
            opacity: handCursorOp,
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
  );
};

// ═════════════════════════════════════════════════════════════════
// SCENE 4: END CARD — "Axos — Trade with context, not chaos."
// ═════════════════════════════════════════════════════════════════

const Scene4_EndCard: React.FC = () => {
  const { frame, fps } = useAnimFrame();

  // Word-by-word reveal for closing statement
  const closingWords = ["Trade", "with", "context,", "not", "chaos."];

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

  // URL
  const urlSpring = spring({
    frame: frame - 92,
    fps,
    config: { damping: 30, stiffness: 110, mass: 0.7 },
  });
  const urlOp = interpolate(frame, [92, 105], [0, 1], CLAMP);

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
      <div style={{ textAlign: "center", maxWidth: 820 }}>
        <div>
          {closingWords.map((w, i) => {
            const delay = 5 + i * 7;
            const isGradient = w === "context," || w === "chaos.";
            return (
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
                  ...(isGradient
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
          })}
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

      {/* Logo + "Axos AI" */}
      <div
        style={{
          opacity: logoOp,
          transform: `scale(${logoSpring})`,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Img
          src={staticFile("axos-portfolio/logo.png")}
          style={{ width: 122, height: 122 }}
        />
        <h1
          style={{
            fontFamily: GT_ALPINA,
            fontSize: 86,
            fontWeight: 300,
            color: COLORS.text.primary,
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
              fontFamily: interFont,
              fontSize: 20,
              color: COLORS.primary[300],
              fontWeight: 500,
              letterSpacing: "0.02em",
            }}
          >
            axoss.io
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═════════════════════════════════════════════════════════════════
// MAIN COMPOSITION
// ═════════════════════════════════════════════════════════════════

// Timeline at 60fps:
// Scene 1 (Safari tabs):       0 – 540    (0–9s)
// Scene 2 (Chat + subtitle):   500 – 1140  (8.3–19s)
// Scene 3 (End card):          1080 – 1380 (18–23s)
export const axosSafariDemoDuration = 1380;

export const AxosSafariDemo: React.FC = () => {
  return (
    <AnimatedBackground>
      {/* Scene 1: Crypto platform constellation */}
      <Sequence from={0} durationInFrames={540}>
        <Scene1_CryptoConstellation />
      </Sequence>

      {/* Scene 2: Axos Chat (compact → morph → conversation) */}
      <Sequence from={500} durationInFrames={640}>
        <Scene3_AxosChat />
      </Sequence>

      {/* Narration subtitle overlay (synced with chat scene) */}
      <Sequence from={500} durationInFrames={640}>
        <NarrationSubtitle />
      </Sequence>

      {/* Scene 3: End card — "Axos — Trade with context, not chaos." */}
      <Sequence from={1080} durationInFrames={300}>
        <Scene4_EndCard />
      </Sequence>
    </AnimatedBackground>
  );
};
