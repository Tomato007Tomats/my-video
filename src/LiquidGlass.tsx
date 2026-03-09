import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const BG_SRC = staticFile("ChatGPT Imagem Mar 6 2026.png");

// Exact Figma values for "music player / card" (node 1:207)
const CARD_W = 363;
const CARD_H = 118;
const CARD_RADIUS = 24;
const CARD_OUTER_SHADOW = "0px 2px 30px 0px rgba(0,0,0,0.05), 0px 8px 72px -5px rgba(0,0,0,0.1)";
const CARD_INNER_SHADOW = "inset 1px 0.5px 0px 0px rgba(255,255,255,0.6), inset -1px -1px 0px 0px rgba(255,255,255,0.4), inset 0px 0px 5px 0px rgba(255,255,255,0.15), inset 0px 2px 20px 2px rgba(53,53,53,0.05)";
// Inner bg layer: 467x198, centered, backdrop-blur 10px, bg rgba(136,136,136,0.15)
const BG_INNER_W = 467;
const BG_INNER_H = 198;

export const LiquidGlass: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background animation
  const bgScale = interpolate(frame, [0, 240], [1.05, 1.0], { extrapolateRight: "clamp" });
  const bgOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Card entrance
  const cardDelay = 10;
  const cardScale = spring({ frame: frame - cardDelay, fps, from: 0.88, to: 1, config: { damping: 16, stiffness: 60 } });
  const cardOpacity = interpolate(frame, [cardDelay, cardDelay + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cardY = spring({ frame: frame - cardDelay, fps, from: 30, to: 0, config: { damping: 18, stiffness: 60 } });

  // Subtle float
  const floatY = Math.sin(frame / 30) * 3;

  // Shimmer sweep
  const shimmerPos = interpolate(frame % 150, [0, 150], [-200, 600], { extrapolateRight: "clamp" });
  const shimmerOpacity = frame > 35 ? interpolate(frame % 150, [0, 40, 110, 150], [0, 0.12, 0.12, 0], { extrapolateRight: "clamp" }) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      {/* Background image */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: bgOpacity }}>
        <Img
          src={BG_SRC}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            inset: 0,
            objectFit: "cover",
            transform: `scale(${bgScale})`,
          }}
        />
      </div>

      {/* ===== GLASS CARD — pixel perfect from Figma node 1:207 ===== */}
      <div style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(-50%, -50%) translateY(${cardY + floatY}px) scale(${cardScale})`,
        opacity: cardOpacity,
      }}>
        <div style={{
          width: CARD_W,
          height: CARD_H,
          borderRadius: CARD_RADIUS,
          overflow: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "center",
          padding: "12px 16px",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
          background: "rgba(255,255,255,0.05)",
          boxShadow: CARD_OUTER_SHADOW,
        }}>
          {/* Inner blurred bg layer (centered, larger than card) */}
          <div style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: BG_INNER_W,
            height: BG_INNER_H,
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            background: "rgba(136,136,136,0.15)",
            pointerEvents: "none",
          }} />

          {/* Top spacer (14px, matches Figma "top" node) */}
          <div style={{ width: "100%", height: 14, flexShrink: 0 }} />

          {/* Inner edge highlights */}
          <div style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            boxShadow: CARD_INNER_SHADOW,
            pointerEvents: "none",
          }} />

          {/* Shimmer sweep */}
          <div style={{
            position: "absolute", inset: 0, overflow: "hidden",
            borderRadius: "inherit", pointerEvents: "none",
          }}>
            <div style={{
              position: "absolute",
              top: -20,
              left: shimmerPos,
              width: 140,
              height: "250%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
              transform: "rotate(15deg)",
              opacity: shimmerOpacity,
            }} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
