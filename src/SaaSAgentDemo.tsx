import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  Img,
  staticFile,
} from "remotion";
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

import { ReportScene } from "./ReportSceneRemotion";

// ─── Helpers ────────────────────────────────────────────────────
const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ─── Timeline (700 frames @ 30fps ≈ 23.3s) ──────────────────────
const T = {
  // Scene 0: Screenshot Intro (0-90)
  introIn: 0,
  introCursorStart: 12,  // cursor fades in
  introCursorArrive: 62, // cursor arrives at Run Analysis button
  introClick: 68,        // click!
  introFadeOut: 74,      // screenshot starts fading out
  introEnd: 90,

  // Scene 1: Auto-Questionnaire (85-210)
  cardIn: 85,
  checkModerate: 108,
  checkGrowth: 125,
  checkBTC: 138,
  checkETH: 149,
  checkSOL: 158,
  s1CursorStart: 158,
  s1CursorArrive: 196,
  s1Click: 200,
  buttonGlow: 164,
  buttonTrigger: 205,
  cardOut: 214,
  scene1End: 236,

  // Scene 2: Agent Orchestration (234-465)
  orchIn: 234,
  agentsStart: 222,
  linesStart: 242,

  // Scene 3: Analysis In Progress (345-465)
  particlesStart: 355,
  progressStart: 365,
  statusStart: 375,
  networkOut: 465,

  // Scene 4: Report Details (455-700)
  reportIn: 455,
  reportContentStart: 475,
};

// ─── Intro Cursor ────────────────────────────────────────────────
// "Run Analysis" button in the Axos header (top-right of screenshot)
const INTRO_BTN = { x: 1640, y: 100 };
const INTRO_CURSOR_START = { x: 1920, y: 420 };

function getIntroCursorPos(frame: number) {
  if (frame < T.introCursorStart) return INTRO_CURSOR_START;
  if (frame >= T.introCursorArrive) return INTRO_BTN;
  const t =
    (frame - T.introCursorStart) / (T.introCursorArrive - T.introCursorStart);
  const ease = Easing.inOut(Easing.cubic)(t);
  return {
    x: INTRO_CURSOR_START.x + (INTRO_BTN.x - INTRO_CURSOR_START.x) * ease,
    y: INTRO_CURSOR_START.y + (INTRO_BTN.y - INTRO_CURSOR_START.y) * ease,
  };
}

// ─── Horizontal Agent Layout ─────────────────────────────────────
const AGENT_Y = 200;

const AGENTS_H = [
  { name: "On-Chain Agent", icon: "database" as const, x: 530 },
  { name: "Sentiment Agent", icon: "search" as const, x: 745 },
  { name: "Technical Agent", icon: "chart" as const, x: 960 },
  { name: "Macro Agent", icon: "cpu" as const, x: 1175 },
  { name: "Risk Agent", icon: "code" as const, x: 1390 },
];

const ORCH_CENTER = { x: 960, y: 690 };

function cubicBezierPoint(
  t: number,
  p0: number,
  p1: number,
  p2: number,
  p3: number,
): number {
  const mt = 1 - t;
  return (
    mt * mt * mt * p0 +
    3 * mt * mt * t * p1 +
    3 * mt * t * t * p2 +
    t * t * t * p3
  );
}

const STATUS_MSGS = [
  "Scanning sources...",
  "Compiling logic...",
  "Querying data...",
  "Crunching stats...",
  "Running models...",
];

// ─── Agent scene glass tokens ────────────────────────────────────
const DS_PURPLE_MID = "rgba(167,139,250,1)";
const DS_PURPLE_DARK = "#7c3aed";
const GLASS_BG_CARD = `linear-gradient(180deg, rgba(51,51,57,0.7) 0%, rgba(53,53,56,0.7) 50%, rgba(38,38,39,0.7) 100%)`;
const GLASS_SHADOW_CARD_STR =
  "0 20px 60px rgba(0,0,0,0.45), inset 0.6px 0.6px 0.6px 0 rgba(255,255,255,0.18), inset 0.6px -0.4px 0.6px 0 rgba(255,255,255,0.04)";
const GLASS_SHADOW_BOX_STR =
  "0 118px 112px 0 rgba(0,0,0,0.5), 0 69px 58px 0 rgba(0,0,0,0.36), 0 36px 27px 0 rgba(0,0,0,0.28), inset 0.6px 0.6px 0.6px 0 rgba(255,255,255,0.32), inset 0.6px -0.4px 0.6px 0 rgba(255,255,255,0.05)";
const MONO = '"Courier New", Courier, monospace';


// ─── SVG Icons ───────────────────────────────────────────────────
import { Sparkles, Search, Code, Database, BarChart2, Cpu, Activity } from 'lucide-react';

// ─────────────────────────────────────────────
// FrostGlass (used for non-agent-card elements)
// ─────────────────────────────────────────────
interface FrostGlassProps {
  children?: React.ReactNode;
  cornerRadius?: number;
  padding?: string;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
}
const FrostGlass: React.FC<FrostGlassProps> = ({
  children,
  cornerRadius = 16,
  padding = '12px',
  style,
  className = '',
  onClick
}) => <div className={className} onClick={onClick} style={{
  position: 'relative',
  borderRadius: cornerRadius,
  padding,
  background: 'rgba(255,255,255,0.07)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid transparent',
  transition: 'background 0.2s, box-shadow 0.2s',
  ...style
}}>
    {/* Frost border */}
    <span aria-hidden style={{
    display: 'block',
    position: 'absolute',
    inset: '-1px',
    borderRadius: cornerRadius,
    padding: '1px',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.08) 60%, rgba(255,255,255,0.45) 100%)',
    WebkitMaskImage: 'linear-gradient(#fff 0px, #fff 0px), linear-gradient(#fff 0px, #fff 0px)',
    WebkitMaskOrigin: 'content-box, border-box',
    WebkitMaskClip: 'content-box, border-box',
    WebkitMaskComposite: 'xor',
    maskImage: 'linear-gradient(#fff 0px, #fff 0px), linear-gradient(#fff 0px, #fff 0px)',
    maskOrigin: 'content-box, border-box',
    maskClip: 'content-box, border-box',
    maskComposite: 'exclude',
    pointerEvents: 'none'
  }} />
    {children}
  </div>;

// ─────────────────────────────────────────────
// ShinyCard — agent card with shiny border style
// ─────────────────────────────────────────────
interface ShinyCardProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}
const ShinyCard: React.FC<ShinyCardProps> = ({
  children,
  style,
  className = ''
}) => <div className={`shiny-card ${className}`} style={{
  ...style
}}>
    <div className="shiny-card-inner">{children}</div>
  </div>;

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────
type AgentIconType = 'search' | 'code' | 'database' | 'chart' | 'cpu';
const AGENT_ICONS: Record<AgentIconType, React.ReactNode> = {
  search: <Search size={15} color="rgba(255,255,255,0.8)" />,
  code: <Code size={15} color="rgba(255,255,255,0.8)" />,
  database: <Database size={15} color="rgba(255,255,255,0.8)" />,
  chart: <BarChart2 size={15} color="rgba(255,255,255,0.8)" />,
  cpu: <Cpu size={15} color="rgba(255,255,255,0.8)" />
};
type Agent = {
  name: string;
  icon: AgentIconType;
  status: string;
};
const AGENTS: Agent[] = [{
  name: 'On-Chain',
  icon: 'database',
  status: 'Scanning wallets...'
}, {
  name: 'Sentiment',
  icon: 'search',
  status: 'Parsing social...'
}, {
  name: 'Technical',
  icon: 'chart',
  status: 'Reading charts...'
}, {
  name: 'Macro',
  icon: 'cpu',
  status: 'Tracking flows...'
}, {
  name: 'Risk',
  icon: 'code',
  status: 'Scoring risk...'
}];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const clamp = (v: number, mn: number, mx: number) => Math.max(mn, Math.min(mx, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const eased = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
const prog = (elapsed: number, start: number, dur: number) => clamp((elapsed - start) / dur, 0, 1);

// ─────────────────────────────────────────────
// Timing
// ─────────────────────────────────────────────
const T_AGENTS_START = 0.5;
const T_LINES_START = 1.5;
const T_ORCH_IN = 2.0;
const AGENT_STAGGER = 0.18;
const LINE_STAGGER = 0.1;
const TOTAL_DURATION = 8.0;
const T_PROGRESS_START = 2.5;
const PROGRESS_STAGGER = 0.18;
const T_STATUS_START = 2.2;
const STATUS_STAGGER = 0.18;

// ─── SVG Icons ───────────────────────────────────────────────────
const SparklesIcon = ({
  size = 16,
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

// ─── Checkmark icon for auto-complete ────────────────────────────
const CheckIcon = ({ size = 12 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

// ─── Component ───────────────────────────────────────────────────
export const SaaSAgentDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();

  // ─── Shorthands ─────────────────────────────────────────────
  const val = (start: number, end: number, from: number, to: number) =>
    interpolate(frame, [start, end], [from, to], CLAMP);

  const spr = (delay: number, config?: Record<string, number>) =>
    spring({
      frame,
      fps,
      delay,
      config: { damping: 200, ...config },
    });

  // ─── Scene 0: Screenshot intro ───────────────────────────────
  const screenshotOp =
    frame < T.introFadeOut
      ? val(T.introIn, T.introIn + 12, 0, 1)
      : val(T.introFadeOut, T.introEnd, 1, 0);

  const screenshotScale = interpolate(
    frame,
    [T.introCursorStart, T.introCursorArrive],
    [1.0, 1.45],
    {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const originX = interpolate(
    frame,
    [T.introCursorStart, T.introCursorArrive],
    [50, (INTRO_BTN.x / W) * 100],
    {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const originY = interpolate(
    frame,
    [T.introCursorStart, T.introCursorArrive],
    [50, (INTRO_BTN.y / H) * 100],
    {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Intro cursor
  const introCursorPos = getIntroCursorPos(frame);
  const introCursorOp = interpolate(
    frame,
    [
      T.introCursorStart,
      T.introCursorStart + 10,
      T.introFadeOut,
      T.introEnd,
    ],
    [0, 1, 1, 0],
    CLAMP,
  );
  const introCursorSc =
    frame >= T.introClick && frame <= T.introClick + 6
      ? interpolate(
          frame,
          [T.introClick, T.introClick + 3, T.introClick + 6],
          [1, 0.82, 1],
          CLAMP,
        )
      : 1;

  // Intro click ripple
  const introRippleProg =
    frame >= T.introClick
      ? val(T.introClick, T.introClick + 22, 0, 1)
      : 0;
  const introRippleSc = interpolate(introRippleProg, [0, 1], [0, 3]);
  const introRippleOp = interpolate(
    introRippleProg,
    [0, 0.15, 1],
    [0, 0.5, 0],
    CLAMP,
  );

  // ─── Scene 1: Auto-Questionnaire ─────────────────────────────
  const cardEnter = spr(T.cardIn, { damping: 22, stiffness: 140, mass: 0.9 });
  const cardSlideY = interpolate(cardEnter, [0, 1], [80, 0]);
  const cardOpIn = interpolate(cardEnter, [0, 0.25], [0, 1], CLAMP);
  const cardExitScale =
    frame >= T.cardOut ? val(T.cardOut, T.cardOut + 22, 1, 0.82) : 1;
  const cardExitOp =
    frame >= T.cardOut ? val(T.cardOut, T.cardOut + 25, 1, 0) : 1;

  // Hand cursor for Scene 1 (button in bottom-right of centered 900px card)
  const S1_BTN = { x: 1270, y: 710 };
  const S1_CURSOR_START = { x: 1050, y: 440 };
  const s1CursorT = interpolate(
    frame,
    [T.s1CursorStart, T.s1CursorArrive],
    [0, 1],
    CLAMP,
  );
  const s1CursorEase = Easing.inOut(Easing.cubic)(s1CursorT);
  const s1CursorX = S1_CURSOR_START.x + (S1_BTN.x - S1_CURSOR_START.x) * s1CursorEase;
  const s1CursorY = S1_CURSOR_START.y + (S1_BTN.y - S1_CURSOR_START.y) * s1CursorEase;
  const s1CursorOp = interpolate(
    frame,
    [T.s1CursorStart, T.s1CursorStart + 6, T.cardOut, T.cardOut + 8],
    [0, 1, 1, 0],
    CLAMP,
  );
  const s1CursorSc =
    frame >= T.s1Click && frame <= T.s1Click + 6
      ? interpolate(frame, [T.s1Click, T.s1Click + 3, T.s1Click + 6], [1, 0.8, 1], CLAMP)
      : 1;
  const s1ClickRippleProg =
    frame >= T.s1Click ? val(T.s1Click, T.s1Click + 20, 0, 1) : 0;
  const s1ClickRippleSc = interpolate(s1ClickRippleProg, [0, 1], [0.3, 2.5]);
  const s1ClickRippleOp = interpolate(s1ClickRippleProg, [0, 0.15, 1], [0, 0.5, 0], CLAMP);

  // Scene 1 zoom toward button
  const s1Zoom = interpolate(
    frame,
    [T.s1CursorStart, T.s1CursorArrive, T.cardOut],
    [1, 1.35, 1.35],
    { ...CLAMP, easing: Easing.inOut(Easing.cubic) },
  );
  const s1OriginX = interpolate(
    frame,
    [T.s1CursorStart, T.s1CursorArrive],
    [50, (S1_BTN.x / W) * 100],
    { ...CLAMP, easing: Easing.inOut(Easing.cubic) },
  );
  const s1OriginY = interpolate(
    frame,
    [T.s1CursorStart, T.s1CursorArrive],
    [50, (S1_BTN.y / H) * 100],
    { ...CLAMP, easing: Easing.inOut(Easing.cubic) },
  );

  // Auto-selections
  const selRisk = frame >= T.checkModerate ? 1 : -1;
  const selGoal = frame >= T.checkGrowth ? 1 : -1;
  const selAssets = [
    frame >= T.checkBTC,
    frame >= T.checkETH,
    frame >= T.checkSOL,
    false,
    false,
    false,
  ];

  // Pop animation per selection (quick spring bounce)
  const popScale = (startF: number) =>
    frame >= startF
      ? interpolate(
          frame,
          [startF, startF + 5, startF + 10],
          [0.88, 1.1, 1.0],
          CLAMP,
        )
      : 1;

  const popRisk = popScale(T.checkModerate);
  const popGoal = popScale(T.checkGrowth);
  const popBTC = popScale(T.checkBTC);
  const popETH = popScale(T.checkETH);
  const popSOL = popScale(T.checkSOL);

  // Button glow (auto, no cursor hover)
  const btnGlow =
    frame >= T.buttonGlow && frame < T.cardOut
      ? val(T.buttonGlow, T.buttonGlow + 18, 0, 1)
      : 0;

  // Transition pulse
  const pulseP =
    frame >= T.buttonTrigger
      ? val(T.buttonTrigger, T.buttonTrigger + 35, 0, 1)
      : 0;
  const pulseSc = interpolate(pulseP, [0, 1], [0, 18]);
  const pulseOp = 0;

  // ─── Scene 2+3: Agent Network ────────────────────────────────
  const netOp =
    frame >= T.orchIn
      ? frame >= T.networkOut
        ? val(T.networkOut, T.networkOut + 25, 1, 0)
        : val(T.orchIn, T.orchIn + 18, 0, 1)
      : 0;
  const netScale =
    frame >= T.networkOut ? val(T.networkOut, T.networkOut + 25, 1, 0.85) : 1;

  const elapsed = Math.max(0, (frame - T.orchIn) / fps);
  const elapsedS = elapsed;
  
  // ─── Scene 4: Final Report ───────────────────────────────────
  // (animations driven inside ReportScene, relative to startFrame)
  
  // Layout anchors for Orchestrator
  const agentY = H * 0.08;
  const agentCardH = 110;
  const orchCY = H * 0.60;
  const orchCX = W * 0.5;
  const BOX_W = Math.min(360, W * 0.30);
  const BOX_H = 156;
  const boxLeft = orchCX - BOX_W / 2;
  const boxTop = orchCY - BOX_H / 2;
  const agentPositions = AGENTS.map((_, i) => (i + 1) * W / (AGENTS.length + 1));
  const orchProg = eased(prog(elapsedS, T_ORCH_IN, 0.7));
  const linesVisible = elapsedS >= T_LINES_START;
  const agentPaths = agentPositions.map(ax => {
    const ayBottom = agentY + agentCardH;
    const midY = (ayBottom + boxTop) / 2;
    return `M ${ax} ${ayBottom} C ${ax} ${midY} ${orchCX} ${midY} ${orchCX} ${boxTop}`;
  });
  const wireColor = 'rgba(255,255,255,0.12)';


  // ═══ RENDER ═════════════════════════════════════════════════
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        fontFamily: interFont,
        color: COLORS.text.primary,
        overflow: "hidden",
      }}
    >

      {/* ═══ SCENE 0: SCREENSHOT INTRO ═══ */}
      {frame < T.introEnd && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: screenshotOp,
            zIndex: 50,
          }}
        >
          <Img
            src={staticFile("image.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${screenshotScale})`,
              transformOrigin: `${originX}% ${originY}%`,
            }}
          />

          {/* Subtle dark vignette */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.35) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Click ripple */}
          {introRippleProg > 0 && introRippleProg < 1 && (
            <div
              style={{
                position: "absolute",
                left: INTRO_BTN.x,
                top: INTRO_BTN.y,
                width: 30,
                height: 30,
                borderRadius: "50%",
                border: "2px solid rgba(139,92,246,0.7)",
                transform: `translate(-50%, -50%) scale(${introRippleSc})`,
                opacity: introRippleOp,
                pointerEvents: "none",
              }}
            />
          )}

          {/* Intro cursor */}
          {introCursorOp > 0 && (
            <div
              style={{
                position: "absolute",
                left: introCursorPos.x,
                top: introCursorPos.y,
                transform: `scale(${introCursorSc})`,
                opacity: introCursorOp,
                pointerEvents: "none",
                filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.7))",
                zIndex: 100,
              }}
            >
              <Img
                src={staticFile("Cursor apontando.svg")}
                style={{ width: 40, height: 40 }}
              />
            </div>
          )}
        </div>
      )}

      <div style={{ width: "100%", height: "100%" }}>
        {/* ═══ SCENE 1: AUTO-QUESTIONNAIRE CARD ═══ */}
        {frame >= T.cardIn && frame < T.scene1End + 10 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `scale(${s1Zoom})`,
              transformOrigin: `${s1OriginX}% ${s1OriginY}%`,
            }}
          >
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, calc(-50% + ${cardSlideY}px)) scale(${cardExitScale})`,
              opacity: cardOpIn * cardExitOp,
              width: 900,
              zIndex: 10,
            }}
          >
            <FrostGlass cornerRadius={28} padding="0" style={{
              width: "100%",
              background: "rgba(19,19,19,0.85)",
              boxShadow: "0 0 44px 0 rgba(0,0,0,0.80)",
              border: "1px solid rgba(255,255,255,0.07)",
              overflow: "hidden",
            }}>
              {/* Top purple glow line */}
              <div style={{
                position: "absolute", top: 0, left: "10%", width: "80%", height: 1,
                background: "linear-gradient(90deg, transparent, rgba(122,59,255,0.5), transparent)",
              }} />

              {/* Title row */}
              <div style={{
                padding: "26px 40px 20px",
                display: "flex", alignItems: "center", gap: 14,
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: "rgba(122,59,255,0.12)",
                  border: "1px solid rgba(122,59,255,0.28)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <SparklesIcon size={18} color="rgba(170,135,255,0.95)" />
                </div>
                <div>
                  <div style={{
                    fontFamily: GT_ALPINA,
                    fontSize: 22, fontWeight: 300,
                    color: "rgba(235,235,245,0.95)",
                    letterSpacing: "0.01em", lineHeight: 1.2,
                  }}>
                    Investment Profile
                  </div>
                  <div style={{
                    fontSize: 11, color: "rgba(170,145,255,0.55)",
                    letterSpacing: "0.04em", marginTop: 3,
                  }}>
                    AI-powered preferences detection
                  </div>
                </div>

                {/* Auto-filling pill */}
                <div style={{ marginLeft: "auto" }}>
                  <FrostGlass cornerRadius={9999} padding="5px 14px" style={{
                    background: "rgba(122,59,255,0.08)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: "rgba(170,135,255,0.95)", display: "inline-block",
                        opacity: 0.5 + Math.sin(frame * 0.25) * 0.5,
                        boxShadow: "0 0 6px rgba(160,120,255,0.7)",
                      }} />
                      <span style={{
                        fontSize: 11, fontWeight: 500,
                        color: "rgba(180,150,255,0.9)", letterSpacing: "0.03em",
                      }}>
                        Auto-filling
                      </span>
                    </div>
                  </FrostGlass>
                </div>
              </div>

              {/* Questions */}
              <div style={{ padding: "24px 40px 20px", display: "flex", flexDirection: "column", gap: 26 }}>

                {/* Q1: Risk Tolerance */}
                <div>
                  <div style={{
                    fontSize: 10, fontWeight: 600, color: "rgba(155,135,200,0.55)",
                    marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.09em",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <span style={{ width: 18, height: 1, background: "rgba(122,59,255,0.45)", display: "inline-block", borderRadius: 1 }} />
                    Risk Tolerance
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["Conservative", "Moderate", "Aggressive", "Very Aggressive"].map((opt, i) => {
                      const sel = selRisk === i;
                      const sc = sel && i === 1 ? popRisk : 1;
                      return (
                        <div key={opt} style={{
                          display: "flex", alignItems: "center", gap: 8,
                          padding: "9px 18px", borderRadius: 12,
                          border: `1px solid ${sel ? "rgba(122,59,255,0.5)" : "rgba(255,255,255,0.06)"}`,
                          background: sel ? "rgba(122,59,255,0.14)" : "rgba(255,255,255,0.025)",
                          fontSize: 13, fontWeight: 500,
                          color: sel ? "rgba(215,195,255,1)" : "rgba(175,175,200,0.5)",
                          boxShadow: sel ? "0 0 18px rgba(122,59,255,0.20), inset 0 1px 0 rgba(180,150,255,0.10)" : "none",
                          transform: `scale(${sc})`,
                          position: "relative", overflow: "hidden",
                        }}>
                          {sel && <span style={{
                            position: "absolute", inset: 0,
                            background: "linear-gradient(135deg, rgba(122,59,255,0.10) 0%, transparent 100%)",
                            pointerEvents: "none",
                          }} />}
                          <div style={{
                            width: 14, height: 14, borderRadius: 4, flexShrink: 0,
                            border: `1.5px solid ${sel ? "rgba(165,120,255,0.9)" : "rgba(255,255,255,0.16)"}`,
                            background: sel ? "rgba(122,59,255,0.85)" : "transparent",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            {sel && <CheckIcon size={9} />}
                          </div>
                          {opt}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Q2: Investment Goal */}
                <div>
                  <div style={{
                    fontSize: 10, fontWeight: 600, color: "rgba(155,135,200,0.55)",
                    marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.09em",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <span style={{ width: 18, height: 1, background: "rgba(122,59,255,0.45)", display: "inline-block", borderRadius: 1 }} />
                    Investment Goal
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["Income", "Growth", "Balanced"].map((opt, i) => {
                      const sel = selGoal === i;
                      const sc = sel && i === 1 ? popGoal : 1;
                      return (
                        <div key={opt} style={{
                          display: "flex", alignItems: "center", gap: 8,
                          padding: "9px 24px", borderRadius: 12,
                          border: `1px solid ${sel ? "rgba(122,59,255,0.5)" : "rgba(255,255,255,0.06)"}`,
                          background: sel ? "rgba(122,59,255,0.14)" : "rgba(255,255,255,0.025)",
                          fontSize: 13, fontWeight: 500,
                          color: sel ? "rgba(215,195,255,1)" : "rgba(175,175,200,0.5)",
                          boxShadow: sel ? "0 0 18px rgba(122,59,255,0.20), inset 0 1px 0 rgba(180,150,255,0.10)" : "none",
                          transform: `scale(${sc})`,
                          position: "relative", overflow: "hidden",
                        }}>
                          {sel && <span style={{
                            position: "absolute", inset: 0,
                            background: "linear-gradient(135deg, rgba(122,59,255,0.10) 0%, transparent 100%)",
                            pointerEvents: "none",
                          }} />}
                          <div style={{
                            width: 14, height: 14, borderRadius: 4, flexShrink: 0,
                            border: `1.5px solid ${sel ? "rgba(165,120,255,0.9)" : "rgba(255,255,255,0.16)"}`,
                            background: sel ? "rgba(122,59,255,0.85)" : "transparent",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            {sel && <CheckIcon size={9} />}
                          </div>
                          {opt}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Q3: Preferred Assets */}
                <div>
                  <div style={{
                    fontSize: 10, fontWeight: 600, color: "rgba(155,135,200,0.55)",
                    marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.09em",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <span style={{ width: 18, height: 1, background: "rgba(122,59,255,0.45)", display: "inline-block", borderRadius: 1 }} />
                    Preferred Assets
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {(["BTC", "ETH", "SOL", "ADA", "DOT", "LINK"] as const).map((asset, i) => {
                      const sel = selAssets[i];
                      const popMap = [popBTC, popETH, popSOL, 1, 1, 1];
                      const sc = sel ? popMap[i] : 1;
                      return (
                        <div key={asset} style={{
                          display: "flex", alignItems: "center", gap: 7,
                          padding: "8px 18px", borderRadius: 20,
                          border: `1px solid ${sel ? "rgba(122,59,255,0.5)" : "rgba(255,255,255,0.06)"}`,
                          background: sel ? "rgba(122,59,255,0.14)" : "rgba(255,255,255,0.025)",
                          fontSize: 12, fontWeight: 700, fontFamily: monoFont,
                          color: sel ? "rgba(205,180,255,1)" : "rgba(175,175,200,0.4)",
                          letterSpacing: "0.5px",
                          boxShadow: sel ? "0 0 14px rgba(122,59,255,0.18), inset 0 1px 0 rgba(180,150,255,0.08)" : "none",
                          transform: `scale(${sc})`,
                          position: "relative", overflow: "hidden",
                        }}>
                          {sel && <span style={{
                            position: "absolute", inset: 0,
                            background: "linear-gradient(135deg, rgba(122,59,255,0.12) 0%, transparent 100%)",
                            pointerEvents: "none",
                          }} />}
                          <div style={{
                            width: 13, height: 13, borderRadius: "50%", flexShrink: 0,
                            border: `1.5px solid ${sel ? "rgba(165,120,255,0.9)" : "rgba(255,255,255,0.16)"}`,
                            background: sel ? "rgba(122,59,255,0.85)" : "transparent",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            {sel && <CheckIcon size={8} />}
                          </div>
                          {asset}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Divider before button */}
              <div style={{
                height: 1, margin: "0 40px",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
              }} />

              {/* Run Analysis button */}
              <div style={{ padding: "16px 40px 26px", display: "flex", justifyContent: "flex-end" }}>
                <div style={{ position: "relative" }}>
                  {btnGlow > 0 && (
                    <div style={{
                      position: "absolute", inset: -10,
                      background: `radial-gradient(circle, rgba(122,59,255,${btnGlow * 0.18}) 0%, transparent 70%)`,
                      filter: "blur(12px)", pointerEvents: "none",
                    }} />
                  )}
                  <FrostGlass cornerRadius={14} padding="0" style={{
                    background: `rgba(122,59,255,${0.12 + btnGlow * 0.08})`,
                    boxShadow: btnGlow > 0
                      ? `0 0 ${10 + btnGlow * 12}px rgba(122,59,255,${0.08 + btnGlow * 0.12}), inset 0 1px 0 rgba(180,150,255,0.08)`
                      : "inset 0 1px 0 rgba(255,255,255,0.06)",
                    transform: `scale(${1 + btnGlow * 0.015})`,
                  }}>
                    <div style={{
                      padding: "11px 28px",
                      display: "flex", alignItems: "center", gap: 10,
                    }}>
                      <SparklesIcon size={15} color={`rgba(195,170,255,${0.65 + btnGlow * 0.35})`} />
                      <span style={{
                        fontSize: 14, fontWeight: 600,
                        color: `rgba(215,200,255,${0.65 + btnGlow * 0.35})`,
                        letterSpacing: "0.01em",
                      }}>
                        Run Analysis
                      </span>
                    </div>
                  </FrostGlass>
                </div>
              </div>
            </FrostGlass>
          </div>

          {/* Click ripple on button */}
          {s1ClickRippleProg > 0 && s1ClickRippleProg < 1 && (
            <div style={{
              position: "absolute",
              left: S1_BTN.x, top: S1_BTN.y,
              width: 40, height: 40, borderRadius: "50%",
              border: "2px solid rgba(165,120,255,0.6)",
              transform: `translate(-50%, -50%) scale(${s1ClickRippleSc})`,
              opacity: s1ClickRippleOp,
              pointerEvents: "none",
            }} />
          )}

          {/* Hand cursor */}
          {s1CursorOp > 0 && (
            <div style={{
              position: "absolute",
              left: s1CursorX,
              top: s1CursorY,
              transform: `scale(${s1CursorSc})`,
              opacity: s1CursorOp,
              pointerEvents: "none",
              filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.6))",
              zIndex: 100,
            }}>
              <Img
                src={staticFile("Cursor apontando.svg")}
                style={{ width: 40, height: 40 }}
              />
            </div>
          )}
          </div>
        )}

        {/* ═══ TRANSITION PULSE ═══ */}
        {pulseP > 0 && pulseP < 1 && pulseOp > 0 && (
          <div
            style={{
              position: "absolute",
              left: 960,
              top: 540,
              width: 80,
              height: 80,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)",
              transform: `translate(-50%, -50%) scale(${pulseSc})`,
              opacity: pulseOp,
              pointerEvents: "none",
            }}
          />
        )}

      {/* ═══ SCENE 2+3: AGENT NETWORK ═══ */}
      {frame >= T.orchIn - 5 && frame < T.networkOut + 30 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: netOp,
            transform: `scale(${netScale})`,
            transformOrigin: "center center",
          }}
        >
          <style>{`
            @property --gradient-angle {
              syntax: "<angle>";
              initial-value: 0deg;
              inherits: false;
            }
            @property --gradient-angle-offset {
              syntax: "<angle>";
              initial-value: 0deg;
              inherits: false;
            }
            @property --gradient-percent {
              syntax: "<percentage>";
              initial-value: 5%;
              inherits: false;
            }
            @property --gradient-shine {
              syntax: "<color>";
              initial-value: white;
              inherits: false;
            }

            .shiny-card {
              --shiny-cta-bg: #0a0a14;
              --shiny-cta-bg-subtle: #1a1828;
              --shiny-cta-highlight: #7A3BFF;
              --shiny-cta-highlight-subtle: #9333ea;
              --animation: gradient-angle linear infinite;
              --duration: 3s;
              --shadow-size: 2px;
              --transition: 800ms cubic-bezier(0.25, 1, 0.5, 1);

              isolation: isolate;
              position: relative;
              overflow: hidden;
              border: 1px solid transparent;
              border-radius: 18px;
              background:
                linear-gradient(var(--shiny-cta-bg), var(--shiny-cta-bg)) padding-box,
                conic-gradient(
                  from calc(var(--gradient-angle) - var(--gradient-angle-offset)),
                  transparent,
                  var(--shiny-cta-highlight) var(--gradient-percent),
                  var(--gradient-shine) calc(var(--gradient-percent) * 2),
                  var(--shiny-cta-highlight) calc(var(--gradient-percent) * 3),
                  transparent calc(var(--gradient-percent) * 4)
                ) border-box;
              box-shadow: inset 0 0 0 1px var(--shiny-cta-bg-subtle);
              transition: var(--transition);
              transition-property: --gradient-angle-offset, --gradient-percent, --gradient-shine;
              animation: var(--animation) var(--duration),
                var(--animation) calc(var(--duration) / 0.4) reverse paused;
              animation-composition: add;
            }

            .shiny-card::before,
            .shiny-card::after {
              content: "";
              pointer-events: none;
              position: absolute;
              inset-inline-start: 50%;
              inset-block-start: 50%;
              translate: -50% -50%;
              z-index: -1;
            }

            /* Dots pattern */
            .shiny-card::before {
              --size: calc(100% - var(--shadow-size) * 3);
              --position: 2px;
              --space: calc(var(--position) * 2);
              width: var(--size);
              height: var(--size);
              background: radial-gradient(
                circle at var(--position) var(--position),
                white calc(var(--position) / 4),
                transparent 0
              ) padding-box;
              background-size: var(--space) var(--space);
              background-repeat: space;
              mask-image: conic-gradient(
                from calc(var(--gradient-angle) + 45deg),
                black,
                transparent 10% 90%,
                black
              );
              border-radius: inherit;
              opacity: 0.4;
              z-index: -1;
              animation: var(--animation) var(--duration),
                var(--animation) calc(var(--duration) / 0.4) reverse paused;
              animation-composition: add;
            }

            /* Inner shimmer */
            .shiny-card::after {
              --animation: shimmer-card linear infinite;
              width: 200%;
              height: 200%;
              background: linear-gradient(
                -50deg,
                transparent,
                var(--shiny-cta-highlight),
                transparent
              );
              mask-image: radial-gradient(circle at bottom, transparent 40%, black);
              opacity: 0.6;
              animation: shimmer-card linear infinite var(--duration),
                shimmer-card linear infinite calc(var(--duration) / 0.4) reverse paused;
              animation-composition: add;
            }

            .shiny-card,
            .shiny-card::before,
            .shiny-card::after {
              animation-play-state: running;
            }

            .shiny-card-inner {
              position: relative;
              z-index: 1;
            }

            ${agentPaths.map((d, i) => `.agent-mask-${i} { offset-path: path("${d}"); }`).join('')}
            @keyframes agent-wire-travel {
              0%   { offset-distance: 0%; }
              100% { offset-distance: 100%; }
            }
            .agent-wire-particle {
              offset-anchor: 0px 0px;
              animation-name: agent-wire-travel;
              animation-iteration-count: infinite;
              animation-timing-function: cubic-bezier(0, 0, 0.22, 1);
              animation-duration: 2.8s;
            }
            @keyframes pulse-dot {
              0%, 100% { opacity: 1; transform: scale(1); }
              50%       { opacity: 0.4; transform: scale(0.78); }
            }
            @keyframes ring-breath {
              0%, 100% { opacity: 0.06; transform: scale(1); }
              50%       { opacity: 0.13; transform: scale(1.015); }
            }
            @keyframes gradient-angle {
              to { --gradient-angle: 360deg; }
            }
            @keyframes shimmer-card {
              to { rotate: 360deg; }
            }
            @keyframes breathe {
              from, to { scale: 1; }
              50% { scale: 1.2; }
            }
          `}</style>

          {/* Ambient glow — top center */}
          <div style={{
          position: 'absolute',
          top: '-80px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: Math.min(700, W * 0.6),
          height: Math.min(500, H * 0.55),
          background: 'radial-gradient(ellipse at center top, rgba(130,100,255,0.06) 0%, transparent 65%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }} />
          {/* Ambient glow — center */}
          <div style={{
          position: 'absolute',
          top: orchCY - 180,
          left: '50%',
          transform: 'translateX(-50%)',
          width: Math.min(500, W * 0.45),
          height: 360,
          background: 'radial-gradient(ellipse at center, rgba(120,90,240,0.055) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }} />

          {/* Global opacity wrapper */}
          <div style={{
          position: 'absolute',
          inset: 0
        }}>

            {/* ── Agent Cards ── */}
            {AGENTS.map((agent, i) => {
            const agProg = eased(prog(elapsed, T_AGENTS_START + i * AGENT_STAGGER, 0.55));
            const slideY = lerp(-20, 0, agProg);
            const progFill = clamp((elapsed - (T_PROGRESS_START + i * PROGRESS_STAGGER)) / 1.3, 0, 1) * 100;
            const showProgress = elapsed >= T_PROGRESS_START + i * PROGRESS_STAGGER;
            const statusOp = prog(elapsed, T_STATUS_START + i * STATUS_STAGGER, 0.35);
            const cardW = Math.min(120, W * 0.105);
            return <div key={`agent-${i}`} style={{
              position: 'absolute',
              left: agentPositions[i],
              top: agentY,
              transform: `translate(-50%, 0) translateY(${slideY}px)`,
              opacity: agProg,
              zIndex: 10
            }}>
                  <ShinyCard style={{
                width: cardW
              }}>
                    <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 9,
                  padding: '14px 10px 12px'
                }}>
                      {/* Icon */}
                      <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                        {AGENT_ICONS[agent.icon]}
                      </div>

                      <span style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.78)',
                    textAlign: 'center',
                    letterSpacing: '0.03em',
                    lineHeight: 1.3
                  }}>
                        {agent.name}
                      </span>
                    </div>
                  </ShinyCard>
                </div>;
          })}

            {/* ── SVG: wires + particles ── */}
            <svg style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 5
          }} width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
              <defs>
                <radialGradient id="particle-grad" fx="1">
                  <stop offset="0%" stopColor="rgba(190,165,255,0.8)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
                {agentPaths.map((d, i) => <mask id={`agent-mask-${i}`} key={`mask-${i}`}>
                    <path d={d} strokeWidth="1.5" stroke="white" fill="none" />
                  </mask>)}
              </defs>

              {AGENTS.map((_, i) => {
              const lineDelay = T_LINES_START + i * LINE_STAGGER;
              const lineProg = eased(prog(elapsed, lineDelay, 0.75));
              const totalLen = 1200;
              return <path key={`path-${i}`} d={agentPaths[i]} stroke={wireColor} strokeWidth={1} fill="none" strokeDasharray={totalLen} strokeDashoffset={totalLen * (1 - lineProg)} />;
            })}

              {linesVisible && agentPaths.map((_, i) => <g key={`particle-${i}`} mask={`url(#agent-mask-${i})`}>
                    <circle className={`agent-wire-particle agent-mask-${i}`} cx="0" cy="0" r="9" fill="url(#particle-grad)" style={{
                animationDelay: `${i * 0.52}s`
              }} />
                  </g>)}
            </svg>

            {/* ── Orchestrator Box ── */}
            <div style={{
            position: 'absolute',
            left: boxLeft,
            top: boxTop,
            width: BOX_W,
            opacity: clamp(orchProg * 3, 0, 1),
            transform: `translateY(${lerp(28, 0, orchProg)}px)`,
            zIndex: 15
          }}>
              {/* Main glass panel */}
              <FrostGlass cornerRadius={24} padding="0" style={{
              width: BOX_W,
              height: BOX_H,
              position: 'relative',
              zIndex: 10
            }}>
                <div style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                  {/* Concentric rings */}
                  {[52, 80, 108, 136].map((r, ri) => {
                  const breath = 1 + Math.sin(elapsed * 4.5 - ri * 0.75) * 0.01;
                  const baseOp = [0.09, 0.07, 0.055, 0.04][ri];
                  const op = baseOp * (1 + Math.sin(elapsed * 3 - ri * 1.1) * 0.4);
                  return <div key={`ring-${ri}`} style={{
                    position: 'absolute',
                    width: r * 2,
                    height: r * 2,
                    borderRadius: '50%',
                    border: `1px solid rgba(200,180,255,${op})`,
                    transform: `scale(${breath})`,
                    pointerEvents: 'none',
                    transition: 'border-color 0.3s'
                  }} />;
                })}

                  {/* Center label */}
                  <div style={{
                  position: 'relative',
                  zIndex: 6,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 5
                }}>
                    <Img src={staticFile("Logo 4k ChatGPT Dez 6 2025.png")} alt="Logo" style={{
                    width: 64,
                    height: 64,
                    objectFit: 'contain'
                  }} />
                  </div>

                  {/* Loading bar */}
                  <div style={{
                    position: 'absolute',
                    bottom: 10, left: 14, right: 14,
                    height: 3, borderRadius: 4,
                    background: 'rgba(255,255,255,0.04)',
                    overflow: 'hidden', zIndex: 12,
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${interpolate(frame, [T.orchIn + 30, T.reportIn - 10], [0, 100], CLAMP)}%`,
                      background: 'linear-gradient(90deg, rgba(122,59,255,0.6), rgba(170,120,255,0.9))',
                      boxShadow: '0 0 8px rgba(140,80,255,0.5)',
                      borderRadius: 4,
                    }} />
                  </div>

                  {/* Multi-Agent pill — bottom left */}
                  <div style={{
                  position: 'absolute',
                  left: 14,
                  bottom: 14,
                  zIndex: 8
                }}>
                    <FrostGlass cornerRadius={9999} padding="5px 11px">
                      <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5
                    }}>
                        <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={1.8}>
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          <path d="M9 12l2 2 4-4" />
                        </svg>
                        <span style={{
                        fontSize: 9,
                        color: 'rgba(255,255,255,0.6)',
                        letterSpacing: '0.02em'
                      }}>
                          Multi-Agent
                        </span>
                      </div>
                    </FrostGlass>
                  </div>

                  {/* Live Analysis pill — bottom right */}
                  <div style={{
                  position: 'absolute',
                  right: 14,
                  bottom: 14,
                  zIndex: 8
                }}>
                    <FrostGlass cornerRadius={9999} padding="5px 11px">
                      <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5
                    }}>
                        <Activity size={9} color="rgba(255,255,255,0.6)" />
                        <span style={{
                        fontSize: 9,
                        color: 'rgba(255,255,255,0.6)',
                        letterSpacing: '0.02em'
                      }}>
                          Live Analysis
                        </span>
                      </div>
                    </FrostGlass>
                  </div>
                </div>
              </FrostGlass>
            </div>

          </div>
        </div>
      )}

      {/* ═══ SCENE 4: FINAL REPORT ═══ */}
      {frame >= T.reportIn && (
        <ReportScene startFrame={T.reportIn} />
      )}

      </div>
    </AbsoluteFill>  );
};
