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
import { COLORS } from "../design-system/design-tokens";

// ─── Fonts ───────────────────────────────────────────────────────
const { fontFamily: interFont } = loadInter("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});
// ─── Interpolation helpers ───────────────────────────────────────
const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ─── Timeline (frames at 30fps = ~8s total) ─────────────────────
const T = {
  // Phase 1: Minimized Bar
  barIn: 0,
  cursorShow: 17,
  typeStart: 20,
  typeEnd: 48,

  // Hand cursor (slow approach + click)
  handIn: 38,
  handArrive: 68,
  handClick: 70,
  handOut: 74,

  // Phase 2: Morph
  sendActivate: 71,
  morphStart: 76,
  morphEnd: 96,

  // Phase 3: Conversation
  userMsgIn: 98,
  loadingIn: 108,
  toolIn: 113,
  streamStart: 123,
  streamEnd: 188,
  loadingOut: 126,

  // Phase 4: Features and Close
  chipsIn: 193,
  fadeOut: 250,
};

// ─── Cursor positions (absolute viewport coords) ─────────────
const SEND_BTN = { x: 1140, y: 780 };
const CURSOR_START = { x: 1380, y: 960 };

// ─── Demo Data ───────────────────────────────────────────────────
const USER_MSG = "Analyze the market today";
const AI_RESPONSE =
  "**Bitcoin (BTC)** is currently trading with strong bullish momentum. Technical analysis indicates:\n\n1. **Support**: $62,000\n2. **Resistance**: $68,500\n3. **RSI**: 64 (neutral-bullish)\n\nTrading volume increased **23%** in the last 24h, suggesting growing institutional interest.";

const SUGGESTIONS = [
  "Bitcoin price",
  "Top 5 altcoins",
  "Ethereum trend",
  "Deep BTC analysis",
];

// ─── SVG Icons (matching the original component) ────────────────
const SparklesIcon = ({
  size = 16,
  color = "#a78bfa",
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

const ArrowUpIcon = () => (
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

const BotIcon = ({ size = 14 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#a78bfa"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 8V4H8" />
    <rect width={16} height={12} x={4} y={8} rx={2} />
    <path d="M2 14h2M20 14h2M15 13v2M9 13v2" />
  </svg>
);

const UserIcon = ({ size = 14 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#9ca3af"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx={12} cy={8} r={5} />
    <path d="M20 21a8 8 0 0 0-16 0" />
  </svg>
);

const MessagePlusIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M12 7v6M9 10h6" />
  </svg>
);

const MinimizeIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="4 14 10 14 10 20" />
    <polyline points="20 10 14 10 14 4" />
    <line x1={14} y1={10} x2={21} y2={3} />
    <line x1={3} y1={21} x2={10} y2={14} />
  </svg>
);

const WrenchIcon = ({ size = 10 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#6b7280"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const HandCursorIcon = ({ size = 30 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M18 12.998V11a1 1 0 0 0-2 0V9a1 1 0 0 0-2 0V8a1 1 0 0 0-2 0V4a1 1 0 0 0-2 0v9.354l-1.646-1.646a1.121 1.121 0 0 0-1.586 0 1.121 1.121 0 0 0 0 1.586l4.939 5.706H18v-7.002z"
      fill="white"
      stroke="rgba(0,0,0,0.4)"
      strokeWidth={0.8}
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Inline Markdown Renderer ────────────────────────────────────
const renderInline = (text: string): React.ReactNode => {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push(
      <span key={key++} style={{ color: "#ffffff", fontWeight: 600 }}>
        {match[1]}
      </span>,
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length > 0 ? parts : text;
};

const renderResponseText = (text: string) => {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    if (line === "") return <div key={i} style={{ height: 8 }} />;
    const numMatch = line.match(/^(\d+)\.\s(.+)/);
    if (numMatch) {
      return (
        <div
          key={i}
          style={{
            display: "flex",
            gap: 8,
            marginLeft: 12,
            marginTop: 3,
          }}
        >
          <span
            style={{
              color: COLORS.purple.light,
              fontSize: 17,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {numMatch[1]}.
          </span>
          <span
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: 17,
              lineHeight: 1.5,
            }}
          >
            {renderInline(numMatch[2])}
          </span>
        </div>
      );
    }
    return (
      <p
        key={i}
        style={{
          color: "rgba(255,255,255,0.85)",
          fontSize: 17,
          lineHeight: 1.6,
          margin: "1px 0",
        }}
      >
        {renderInline(line)}
      </p>
    );
  });
};

// ═════════════════════════════════════════════════════════════════
// MAIN COMPOSITION
// ═════════════════════════════════════════════════════════════════

export const FloatingAIInputShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();

  // ─── Helpers ─────────────────────────────────────────────────
  const val = (start: number, end: number, from: number, to: number) =>
    interpolate(frame, [start, end], [from, to], CLAMP);

  const spr = (delay: number, config?: Record<string, number>) =>
    spring({ frame, fps, delay, config: { damping: 200, ...config } });

  // ═══ PHASE 1: MINIMIZED BAR ══════════════════════════════════
  const barProgress = spr(T.barIn, { damping: 15, stiffness: 120 });
  const barOpacity = interpolate(barProgress, [0, 0.3], [0, 1], CLAMP);
  const barY = interpolate(barProgress, [0, 1], [80, 0]);

  const cursorVisible = frame >= T.cursorShow && frame < T.morphStart;
  const cursorBlink = cursorVisible
    ? Math.sin(frame * 0.25) > 0
      ? 1
      : 0
    : 0;

  const typedChars = Math.floor(
    interpolate(frame, [T.typeStart, T.typeEnd], [0, USER_MSG.length], {
      ...CLAMP,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }),
  );
  const typedText = USER_MSG.slice(0, typedChars);

  const sendActive = frame >= T.sendActivate;
  const clickPress = frame >= T.handClick && frame < T.handClick + 3;
  const sendScale = clickPress
    ? 0.85
    : sendActive && frame < T.morphStart
      ? interpolate(
          Math.sin((frame - T.sendActivate) * 0.15),
          [-1, 1],
          [0.95, 1.05],
        )
      : 1;

  // ═══ PHASE 2: MORPH ══════════════════════════════════════════
  const morphW = spr(T.morphStart, { damping: 16, stiffness: 55, mass: 1.2 });
  const morphH = spr(T.morphStart + 5, { damping: 16, stiffness: 50, mass: 1.2 });

  const widgetWidth = interpolate(morphW, [0, 1], [420, 960]);
  const widgetHeight = interpolate(morphH, [0, 1], [60, 940]);
  const widgetRadius = interpolate(morphW, [0, 1], [18, 28]);
  const widgetY = interpolate(morphH, [0, 1], [780, 540]);

  const minimizedContentOpacity = interpolate(
    morphW,
    [0, 0.15],
    [1, 0],
    CLAMP,
  );
  const expandedContentOpacity = interpolate(
    morphH,
    [0.45, 0.85],
    [0, 1],
    CLAMP,
  );

  const sweepX = val(T.morphEnd, T.morphEnd + 25, -0.5, 1.5);
  const sweepOpacity =
    frame >= T.morphEnd && frame < T.morphEnd + 25 ? 0.12 : 0;

  // ═══ HAND CURSOR (SaaSAgentDemo style) ═══════════════════
  const handCursorT = interpolate(
    frame,
    [T.handIn, T.handArrive],
    [0, 1],
    CLAMP,
  );
  const handEase = Easing.inOut(Easing.cubic)(handCursorT);
  const handCursorX =
    CURSOR_START.x + (SEND_BTN.x - CURSOR_START.x) * handEase;
  const handCursorY =
    CURSOR_START.y + (SEND_BTN.y - CURSOR_START.y) * handEase;
  const handCursorOp = interpolate(
    frame,
    [T.handIn, T.handIn + 10, T.handOut, T.handOut + 8],
    [0, 1, 1, 0],
    CLAMP,
  );
  const handCursorSc =
    frame >= T.handClick && frame <= T.handClick + 6
      ? interpolate(
          frame,
          [T.handClick, T.handClick + 3, T.handClick + 6],
          [1, 0.82, 1],
          CLAMP,
        )
      : 1;

  // Click ripple (long, like SaaSAgentDemo)
  const clickRippleProg =
    frame >= T.handClick
      ? val(T.handClick, T.handClick + 22, 0, 1)
      : 0;
  const clickRippleSc = interpolate(clickRippleProg, [0, 1], [0.3, 3]);
  const clickRippleOp = interpolate(
    clickRippleProg,
    [0, 0.15, 1],
    [0, 0.5, 0],
    CLAMP,
  );

  // Zoom toward button (like SaaSAgentDemo)
  const handZoom = interpolate(
    frame,
    [T.handIn, T.handArrive, T.handOut, T.morphStart],
    [1.0, 1.35, 1.35, 1.0],
    CLAMP,
  );
  const zoomOriginX = interpolate(
    frame,
    [T.handIn, T.handArrive, T.handOut, T.morphStart],
    [50, (SEND_BTN.x / W) * 100, (SEND_BTN.x / W) * 100, 50],
    CLAMP,
  );
  const zoomOriginY = interpolate(
    frame,
    [T.handIn, T.handArrive, T.handOut, T.morphStart],
    [50, (SEND_BTN.y / H) * 100, (SEND_BTN.y / H) * 100, 50],
    CLAMP,
  );

  // ═══ PHASE 3: CONVERSATION ════════════════════════════════════
  const userMsgProgress = spr(T.userMsgIn, {
    damping: 20,
    stiffness: 150,
  });
  const userMsgX = interpolate(userMsgProgress, [0, 1], [40, 0]);
  const userMsgOp = interpolate(userMsgProgress, [0, 0.5], [0, 1], CLAMP);

  const showLoadingDots = frame >= T.loadingIn && frame < T.loadingOut + 15;
  const loadingOp = showLoadingDots
    ? frame < T.loadingOut
      ? val(T.loadingIn, T.loadingIn + 10, 0, 1)
      : val(T.loadingOut, T.loadingOut + 15, 1, 0)
    : 0;

  const showTool = frame >= T.toolIn && frame < T.loadingOut + 25;
  const toolOp = showTool ? val(T.toolIn, T.toolIn + 10, 0, 1) : 0;
  const toolFadeOp = showTool
    ? frame >= T.loadingOut
      ? val(T.loadingOut + 10, T.loadingOut + 25, 1, 0)
      : 1
    : 0;

  const streamedChars = Math.floor(
    interpolate(frame, [T.streamStart, T.streamEnd], [0, AI_RESPONSE.length], {
      ...CLAMP,
      easing: Easing.out(Easing.quad),
    }),
  );
  const streamedText = AI_RESPONSE.slice(0, streamedChars);
  const isStreaming = frame >= T.streamStart && frame < T.streamEnd;
  const streamCursorOp = isStreaming
    ? Math.sin(frame * 0.3) > 0
      ? 0.8
      : 0.3
    : 0;
  const botMsgOp = val(T.streamStart - 5, T.streamStart + 5, 0, 1);

  // ═══ PHASE 4: CLOSE ══════════════════════════════════════════
  const chipSpr = (i: number) =>
    spr(T.chipsIn + i * 6, { damping: 18, stiffness: 140 });

  const finalFade = val(T.fadeOut, T.fadeOut + 25, 1, 0);

  // ═══ RENDER ═══════════════════════════════════════════════════
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        fontFamily: interFont,
        color: COLORS.text.primary,
      }}
    >
      {/* Background image */}
      <Img
        src={staticFile("ChatGPT Imagem Mar 6 2026.png")}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          inset: 0,
          objectFit: "cover",
        }}
      />
      <div style={{ opacity: finalFade, width: "100%", height: "100%" }}>
        {/* ═══ ZOOM WRAPPER (zooms toward send button) ═══ */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `scale(${handZoom})`,
            transformOrigin: `${zoomOriginX}% ${zoomOriginY}%`,
          }}
        >
        {/* ═══ THE WIDGET (morphing container) ═══ */}
        {frame >= 0 && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: widgetY,
              transform: `translate(-50%, -50%) translateY(${frame < T.morphStart ? barY : 0}px)`,
              width: widgetWidth,
              height: widgetHeight,
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(5px)",
              WebkitBackdropFilter: "blur(5px)",
              borderRadius: widgetRadius,
              boxShadow:
                "0px 2px 30px 0px rgba(0,0,0,0.05), 0px 8px 72px -5px rgba(0,0,0,0.1)",
              overflow: "hidden",
              opacity: barOpacity,
            }}
          >
            {/* Liquid glass inner bg layer */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: widgetWidth + 104,
                height: widgetHeight + 80,
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                background: "rgba(136,136,136,0.25)",
                pointerEvents: "none",
              }}
            />
            {/* Liquid glass edge highlights */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "inherit",
                boxShadow: "inset 1px 0.5px 0px 0px rgba(255,255,255,0.6), inset -1px -1px 0px 0px rgba(255,255,255,0.4), inset 0px 0px 5px 0px rgba(255,255,255,0.15), inset 0px 2px 20px 2px rgba(53,53,53,0.05)",
                pointerEvents: "none",
                zIndex: 2,
              }}
            />
            {/* Purple glow above widget */}
            <div
              style={{
                position: "absolute",
                top: -70,
                left: 0,
                width: "100%",
                height: 180,
                background:
                  "radial-gradient(ellipse at center top, rgba(139, 92, 246, 0.25) 0%, transparent 70%)",
                opacity:
                  frame >= T.morphEnd
                    ? 0.6
                    : frame >= T.typeStart
                      ? 0.5
                      : 0.3,
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
                  paddingRight: 8,
                  borderRight: "1px solid rgba(255,255,255,0.1)",
                  marginRight: 4,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SparklesIcon size={20} color={COLORS.purple.light} />
                </div>
              </div>

              <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    fontSize: 18,
                    color:
                      typedChars > 0 ? "#ffffff" : "rgba(255,255,255,0.4)",
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
                  width: 36,
                  height: 36,
                  minWidth: 36,
                  borderRadius: "50%",
                  background: sendActive
                    ? COLORS.purple.DEFAULT
                    : "#787878",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${sendScale})`,
                  boxShadow: sendActive
                    ? "inset 0 -2px 4px 0 rgba(255,255,255,0.3), inset 0 0 2px 0 rgb(255,255,255), 0 2px 8px 0 rgba(139,92,246,0.4)"
                    : "inset 0 -2px 4px 0 rgba(255,255,255,0.3), inset 0 0 2px 0 rgb(255,255,255), 0 2px 8px 0 rgba(0,0,0,0.4)",
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
                  justifyContent: "space-between",
                  padding: "20px 24px",
                  borderBottom: "1px solid rgba(255,255,255,0.12)",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "rgba(139,92,246,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <SparklesIcon size={18} color={COLORS.purple.light} />
                  </div>
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: 500,
                      color: "rgba(255,255,255,0.9)",
                    }}
                  >
                    Axos Assistant
                  </span>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <div
                    style={{
                      padding: 8,
                      borderRadius: 8,
                      color: "#9ca3af",
                    }}
                  >
                    <MessagePlusIcon size={16} />
                  </div>
                  <div
                    style={{
                      padding: 8,
                      borderRadius: 8,
                      color: "#9ca3af",
                    }}
                  >
                    <MinimizeIcon size={16} />
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div
                style={{
                  flex: 1,
                  overflow: "hidden",
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 24,
                }}
              >
                {/* User message */}
                {frame >= T.userMsgIn && (
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      justifyContent: "flex-end",
                      opacity: userMsgOp,
                      transform: `translateX(${userMsgX}px)`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        maxWidth: "85%",
                      }}
                    >
                      <div
                        style={{
                          padding: "14px 22px",
                          borderRadius: "16px 16px 4px 16px",
                          background: COLORS.purple.DEFAULT,
                          color: "#ffffff",
                          fontSize: 18,
                          lineHeight: 1.5,
                        }}
                      >
                        {USER_MSG}
                      </div>
                    </div>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <UserIcon size={18} />
                    </div>
                  </div>
                )}

                {/* Loading dots */}
                {showLoadingDots && (
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      justifyContent: "flex-start",
                      opacity: loadingOp,
                    }}
                  >
                    <Img
                      src={staticFile("Logo 4k ChatGPT Dez 6 2025.png")}
                      style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                    />
                    <div
                      style={{
                        padding: "12px 16px",
                        borderRadius: "16px 16px 16px 4px",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        display: "flex",
                        gap: 4,
                        alignItems: "center",
                      }}
                    >
                      {[0, 1, 2].map((dotIdx) => (
                        <div
                          key={dotIdx}
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "rgba(167,139,250,0.6)",
                            transform: `translateY(${Math.sin((frame - T.loadingIn) * 0.25 + dotIdx * 1.2) * 3}px)`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Tool indicator */}
                {showTool && (
                  <div
                    style={{
                      marginLeft: 54,
                      opacity: toolOp * toolFadeOp,
                      display: "flex",
                      gap: 4,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "4px 10px",
                        borderRadius: 6,
                        fontSize: 13,
                        background: "rgba(255,255,255,0.05)",
                        color: "#9ca3af",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <WrenchIcon size={10} />
                      Analyzing Market
                    </span>
                  </div>
                )}

                {/* Bot response (streamed) */}
                {frame >= T.streamStart - 5 && streamedChars > 0 && (
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      justifyContent: "flex-start",
                      opacity: botMsgOp,
                    }}
                  >
                    <Img
                      src={staticFile("Logo 4k ChatGPT Dez 6 2025.png")}
                      style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover", flexShrink: 0, marginTop: 2 }}
                    />
                    <div
                      style={{
                        maxWidth: "85%",
                        padding: "10px 16px",
                        borderRadius: "16px 16px 16px 4px",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <div>
                        {renderResponseText(streamedText)}
                        {isStreaming && (
                          <span
                            style={{
                              display: "inline-block",
                              width: 6,
                              height: 14,
                              background: COLORS.purple.light,
                              borderRadius: 1,
                              marginLeft: 2,
                              verticalAlign: "middle",
                              opacity: streamCursorOp,
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Suggestion chips */}
                {frame >= T.chipsIn && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 10,
                      marginTop: 10,
                      marginLeft: 54,
                    }}
                  >
                    {SUGGESTIONS.map((text, i) => {
                      const cp = chipSpr(i);
                      const chipOp = interpolate(
                        cp,
                        [0, 0.5],
                        [0, 1],
                        CLAMP,
                      );
                      const chipY = interpolate(cp, [0, 1], [14, 0]);
                      const chipScale = interpolate(cp, [0, 1], [0.9, 1]);
                      return (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            height: 34,
                            padding: "0 14px 0 12px",
                            background: "rgba(255,255,255,0.04)",
                            border:
                              "1px dashed rgba(255,255,255,0.16)",
                            borderRadius: 17,
                            fontSize: 15,
                            color: "#e6e6e6",
                            opacity: chipOp,
                            transform: `translateY(${chipY}px) scale(${chipScale})`,
                          }}
                        >
                          <SparklesIcon
                            size={12}
                            color="rgba(167,139,250,0.6)"
                          />
                          {text}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.12)",
                  padding: 18,
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 8,
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: 16,
                    border: "1px solid rgba(255,255,255,0.08)",
                    padding: 12,
                  }}
                >
                  <span
                    style={{
                      flex: 1,
                      fontSize: 18,
                      color: "rgba(255,255,255,0.4)",
                      padding: "4px 8px",
                    }}
                  >
                    Type your question...
                  </span>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "#787878",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      boxShadow:
                        "inset 0 -2px 4px 0 rgba(255,255,255,0.3), inset 0 0 2px 0 rgb(255,255,255), 0 2px 8px 0 rgba(0,0,0,0.4)",
                    }}
                  >
                    <ArrowUpIcon />
                  </div>
                </div>
                <p
                  style={{
                    textAlign: "center",
                    fontSize: 11,
                    color: "rgba(255,255,255,0.3)",
                    marginTop: 12,
                    marginBottom: 0,
                  }}
                >
                  Axos may make mistakes. Verify important information.
                </p>
              </div>
            </div>
          </div>
        )}

        </div>{/* end zoom wrapper */}

        {/* ═══ HAND CURSOR (outside zoom, absolute coords) ═══ */}
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

      </div>
    </AbsoluteFill>
  );
};
