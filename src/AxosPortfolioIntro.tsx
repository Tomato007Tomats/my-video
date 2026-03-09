import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadRobotoMono } from "@remotion/google-fonts/RobotoMono";
import { loadFont as loadFragmentMono } from "@remotion/google-fonts/FragmentMono";
import { loadFont as loadLocalFont } from "@remotion/fonts";
import { COLORS } from "../design-system/design-tokens";

const { fontFamily: interFont } = loadInter("normal", {
  weights: ["400", "500", "700"],
});
const { fontFamily: spaceGroteskFont } = loadSpaceGrotesk("normal", {
  weights: ["400", "500"],
});
const { fontFamily: robotoMonoFont } = loadRobotoMono("normal", {
  weights: ["400"],
});
const { fontFamily: fragmentMonoFont } = loadFragmentMono("normal", {
  weights: ["400"],
});

const GT_ALPINA = "GT Alpina";
loadLocalFont({
  family: GT_ALPINA,
  url: staticFile("GT Alpina Light-normal-300-100.otf"),
  weight: "300",
});

const LOGO_SRC = staticFile("axos-portfolio/logo.png");

// Figma-rendered pie chart segments
const PIE_BTC_SRC = staticFile("axos-portfolio/pie-btc-segment.svg");
const PIE_ETH_SRC = staticFile("axos-portfolio/pie-eth-segment.svg");
const PIE_DOT_SRC = staticFile("axos-portfolio/pie-dot-segment.svg");

// Figma-rendered navigation icons
const ICON_WALLET_TOP = staticFile("axos-portfolio/icon-wallet-top.svg");
const ICON_WALLET_BODY = staticFile("axos-portfolio/icon-wallet-body.svg");
const ICON_MARKET_1 = staticFile("axos-portfolio/icon-market-1.svg");
const ICON_MARKET_2 = staticFile("axos-portfolio/icon-market-2.svg");
const ICON_ANALYSIS_1 = staticFile("axos-portfolio/icon-analysis-1.svg");
const ICON_ANALYSIS_2 = staticFile("axos-portfolio/icon-analysis-2.svg");
const ICON_DESIGNSYSTEM_MAIN = staticFile("axos-portfolio/icon-designsystem-main.svg");
const ICON_SETTINGS_MAIN = staticFile("axos-portfolio/icon-settings-main.svg");
const ICON_SPARKLE_SRC = staticFile("axos-portfolio/icon-sparkle.svg");
const ICON_COLLAPSE_SRC = staticFile("axos-portfolio/icon-collapse.svg");

// --- Inline SVG Icons ---
const IconPlay: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M4 2L13.3333 8L4 14V2Z" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconTopMover: React.FC<{ size?: number }> = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
    <path d="M8 3.5H11V6.5" stroke="#9CA3AF" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11 3.5L6.75 7.75L4.25 5.25L1 8.5" stroke="#9CA3AF" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconDominance: React.FC<{ size?: number }> = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
    <path d="M3 4.5H2.25C1.918 4.5 1.6 4.368 1.366 4.134C1.132 3.899 1 3.582 1 3.25C1 2.918 1.132 2.6 1.366 2.366C1.6 2.132 1.918 2 2.25 2H3" stroke="#9CA3AF" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 4.5H9.75C10.082 4.5 10.4 4.368 10.634 4.134C10.868 3.899 11 3.582 11 3.25C11 2.918 10.868 2.6 10.634 2.366C10.4 2.132 10.082 2 9.75 2H9" stroke="#9CA3AF" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 11H10" stroke="#9CA3AF" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 1H3V4.5C3 5.296 3.316 6.059 3.879 6.621C4.441 7.184 5.204 7.5 6 7.5C6.796 7.5 7.559 7.184 8.121 6.621C8.684 6.059 9 5.296 9 4.5V1Z" stroke="#9CA3AF" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconTrend: React.FC<{ size?: number }> = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
    <path d="M11 6H9.76C9.541 6 9.329 6.071 9.155 6.202C8.98 6.334 8.854 6.52 8.795 6.73L7.62 10.91C7.612 10.936 7.597 10.959 7.575 10.975C7.553 10.991 7.527 11 7.5 11C7.473 11 7.447 10.991 7.425 10.975C7.403 10.959 7.388 10.936 7.38 10.91L4.62 1.09C4.612 1.064 4.597 1.041 4.575 1.025C4.553 1.009 4.527 1 4.5 1C4.473 1 4.447 1.009 4.425 1.025C4.403 1.041 4.388 1.064 4.38 1.09L3.205 5.27C3.146 5.48 3.021 5.664 2.847 5.796C2.674 5.928 2.463 5.999 2.245 6H1" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconDistribution: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <path d="M7.813 9.096C7.908 9.041 7.986 8.962 8.041 8.867C8.096 8.772 8.125 8.664 8.125 8.555V2.93C8.124 2.83 8.1 2.732 8.054 2.644C8.008 2.555 7.941 2.479 7.86 2.422C7.778 2.365 7.684 2.328 7.585 2.314C7.487 2.3 7.386 2.311 7.292 2.344C5.468 2.989 3.934 4.265 2.966 5.94C1.997 7.616 1.659 9.581 2.01 11.484C2.028 11.583 2.07 11.675 2.131 11.754C2.193 11.833 2.272 11.896 2.363 11.938C2.445 11.977 2.535 11.996 2.625 11.996C2.735 11.996 2.842 11.967 2.938 11.913L7.813 9.096ZM10 1.875C9.834 1.875 9.675 1.941 9.558 2.058C9.441 2.175 9.375 2.334 9.375 2.5V9.673L3.218 13.26C3.147 13.302 3.084 13.357 3.034 13.423C2.984 13.488 2.948 13.563 2.927 13.643C2.906 13.723 2.901 13.806 2.913 13.888C2.924 13.97 2.952 14.049 2.994 14.12C3.715 15.346 4.747 16.362 5.984 17.065C7.222 17.768 8.622 18.133 10.046 18.125C11.469 18.116 12.865 17.734 14.094 17.016C15.323 16.299 16.342 15.271 17.049 14.035C17.756 12.8 18.126 11.4 18.122 9.977C18.118 8.554 17.74 7.157 17.026 5.925C16.313 4.694 15.288 3.672 14.055 2.961C12.822 2.25 11.423 1.876 10 1.875ZM10 16.875C8.909 16.872 7.834 16.611 6.863 16.113C5.893 15.615 5.054 14.894 4.415 14.009L10.315 10.572C10.41 10.517 10.489 10.438 10.544 10.343C10.598 10.249 10.627 10.141 10.627 10.031V3.153C12.39 3.313 14.023 4.147 15.187 5.481C16.351 6.815 16.955 8.546 16.874 10.314C16.793 12.082 16.033 13.751 14.753 14.973C13.473 16.195 11.77 16.877 10 16.875Z" fill="white" />
  </svg>
);
const IconEvolution: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <path d="M18.125 16.25C18.125 16.416 18.059 16.575 17.942 16.692C17.825 16.809 17.666 16.875 17.5 16.875H2.5C2.334 16.875 2.175 16.809 2.058 16.692C1.941 16.575 1.875 16.416 1.875 16.25V3.75C1.875 3.584 1.941 3.425 2.058 3.308C2.175 3.191 2.334 3.125 2.5 3.125C2.666 3.125 2.825 3.191 2.942 3.308C3.059 3.425 3.125 3.584 3.125 3.75V12.241L7.058 8.308C7.116 8.25 7.185 8.204 7.261 8.172C7.337 8.141 7.418 8.125 7.5 8.125C7.582 8.125 7.663 8.141 7.739 8.172C7.815 8.204 7.884 8.25 7.942 8.308L10 10.366L14.116 6.25H12.5C12.334 6.25 12.175 6.184 12.058 6.067C11.941 5.95 11.875 5.791 11.875 5.625C11.875 5.459 11.941 5.3 12.058 5.183C12.175 5.066 12.334 5 12.5 5H15.625C15.791 5 15.95 5.066 16.067 5.183C16.184 5.3 16.25 5.459 16.25 5.625V8.75C16.25 8.916 16.184 9.075 16.067 9.192C15.95 9.309 15.791 9.375 15.625 9.375C15.459 9.375 15.3 9.309 15.183 9.192C15.066 9.075 15 8.916 15 8.75V7.134L10.442 11.692C10.384 11.75 10.315 11.796 10.239 11.828C10.164 11.859 10.082 11.876 10 11.876C9.918 11.876 9.837 11.859 9.761 11.828C9.685 11.796 9.616 11.75 9.558 11.692L7.5 9.634L3.125 14.009V15.625H17.5C17.666 15.625 17.825 15.691 17.942 15.808C18.059 15.925 18.125 16.084 18.125 16.25Z" fill="white" />
  </svg>
);
const IconPercent: React.FC<{ size?: number }> = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
    <path d="M1.5 1.5V9.5C1.5 9.765 1.605 10.02 1.793 10.207C1.98 10.395 2.235 10.5 2.5 10.5H10.5" stroke="white" strokeOpacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.5 4.5L7 7L5 5L3.5 6.5" stroke="white" strokeOpacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// --- Sidebar & Header Icons (Figma-rendered) ---
const IconWallet: React.FC<{ color?: string }> = () => (
  <div style={{ width: 20, height: 20, position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: "12.5%", right: "8.33%", bottom: "33.33%", left: "12.5%" }}>
      <Img src={ICON_WALLET_TOP} style={{ width: "100%", height: "100%" }} />
    </div>
    <div style={{ position: "absolute", top: "20.83%", right: "12.5%", bottom: "12.5%", left: "12.5%" }}>
      <Img src={ICON_WALLET_BODY} style={{ width: "100%", height: "100%" }} />
    </div>
  </div>
);
const IconMarket: React.FC<{ color?: string }> = () => (
  <div style={{ width: 20, height: 20, position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: "29.17%", right: "8.33%", bottom: "45.83%", left: "66.67%" }}>
      <Img src={ICON_MARKET_1} style={{ width: "100%", height: "100%" }} />
    </div>
    <div style={{ position: "absolute", top: "29.17%", right: "8.33%", bottom: "29.17%", left: "8.33%" }}>
      <Img src={ICON_MARKET_2} style={{ width: "100%", height: "100%" }} />
    </div>
  </div>
);
const IconAnalysis: React.FC<{ color?: string }> = () => (
  <div style={{ width: 20, height: 20, position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: "12.5%" }}>
      <Img src={ICON_ANALYSIS_1} style={{ width: "100%", height: "100%" }} />
    </div>
    <div style={{ position: "absolute", top: "37.5%", right: "20.83%", bottom: "41.67%", left: "29.17%" }}>
      <Img src={ICON_ANALYSIS_2} style={{ width: "100%", height: "100%" }} />
    </div>
  </div>
);
const IconSearch: React.FC<{ color?: string }> = ({ color = "rgba(255,255,255,0.5)" }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="9" cy="9" r="5.5" stroke={color} strokeWidth="1.25" />
    <path d="M13.5 13.5L17 17" stroke={color} strokeWidth="1.25" strokeLinecap="round" />
  </svg>
);
const IconBell: React.FC<{ color?: string }> = ({ color = "rgba(255,255,255,0.5)" }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M4.167 8.333C4.167 6.786 4.782 5.302 5.876 4.209C6.97 3.115 8.453 2.5 10 2.5C11.547 2.5 13.03 3.115 14.124 4.209C15.218 5.302 15.833 6.786 15.833 8.333V12.5L17.5 15H2.5L4.167 12.5V8.333Z" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.333 17.5H11.667" stroke={color} strokeWidth="1.25" strokeLinecap="round" />
  </svg>
);
const IconUser: React.FC<{ color?: string }> = ({ color = "rgba(255,255,255,0.5)" }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="7.5" r="3.333" stroke={color} strokeWidth="1.25" />
    <path d="M3.333 17.5C3.333 14.278 6.318 11.667 10 11.667C13.682 11.667 16.667 14.278 16.667 17.5" stroke={color} strokeWidth="1.25" strokeLinecap="round" />
  </svg>
);
const IconCollapse: React.FC = () => (
  <Img src={ICON_COLLAPSE_SRC} style={{ width: 16, height: 16 }} />
);
const IconDesignSystem: React.FC<{ color?: string }> = () => (
  <div style={{ width: 20, height: 20, position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: "8.33%" }}>
      <Img src={ICON_DESIGNSYSTEM_MAIN} style={{ width: "100%", height: "100%" }} />
    </div>
  </div>
);
const IconSettings: React.FC<{ color?: string }> = () => (
  <div style={{ width: 20, height: 20, position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: "8.33%", right: "12.43%", bottom: "8.33%", left: "12.43%" }}>
      <Img src={ICON_SETTINGS_MAIN} style={{ width: "100%", height: "100%" }} />
    </div>
  </div>
);
const IconSparkle: React.FC = () => (
  <Img src={ICON_SPARKLE_SRC} style={{ width: 12, height: 12 }} />
);

// Data
const NAV_ITEMS: Array<{ label: string; active: boolean; icon: React.FC<{ color?: string }> }> = [
  { label: "Portfolio", active: true, icon: IconWallet },
  { label: "Market", active: false, icon: IconMarket },
  { label: "Analysis", active: false, icon: IconAnalysis },
];

const TABLE_ROWS = [
  { rank: 2, name: "Bitcoin", ticker: "BTC", price: "$349,411.00", qty: "0.0504 BTC", value: "$17,608.48", d24: "+0.79%", d7: "+1.57%", mcap: "$6.99T", vol: "$186.54B", up24: true, up7: true },
  { rank: 3, name: "Ethereum", ticker: "ETH", price: "$10,119.11", qty: "1.21 ETH", value: "$12,215.56", d24: "-0.77%", d7: "-1.54%", mcap: "$1.22T", vol: "$109.01B", up24: false, up7: false },
  { rank: 4, name: "Polkadot", ticker: "DOT", price: "$6.68", qty: "50.00 DOT", value: "$334.00", d24: "-2.91%", d7: "-5.83%", mcap: "$11.14B", vol: "$487.50M", up24: false, up7: false },
  { rank: 5, name: "SOL", ticker: "SOL", price: "$425.93", qty: "0.0000 SOL", value: "$0.00", d24: "+0.37%", d7: "+0.74%", mcap: "$242.11B", vol: "$16.11B", up24: true, up7: true },
];

const PIE_LEGEND = [
  { token: "BTC", color: "#f7931a", pct: "58.4%", val: "R$ 17.608" },
  { token: "ETH", color: "#627eea", pct: "40.5%", val: "R$ 12.216" },
  { token: "DOT", color: "#e6007a", pct: "1.1%", val: "R$ 334" },
  { token: "SOL", color: "#2ecc71", pct: "< 1%", val: "R$ 0" },
];

const TABLE_HEADERS = ["#", "Asset", "Price/Qty", "24h%", "7d%", "Market Cap", "Volume 24h", "Chart"];
const HEADER_WIDTHS = [60, 200, 160, 80, 80, 90, 100, 80];
const HEADER_ALIGNS: Array<"center" | "left" | "right"> = ["center", "left", "right", "center", "center", "center", "center", "center"];

// Floating particles for the intro
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  x: Math.sin(i * 1.7) * 400 + 960,
  y: Math.cos(i * 2.3) * 300 + 540,
  size: 2 + (i % 4) * 1.5,
  speed: 0.3 + (i % 5) * 0.15,
  delay: i * 2,
  opacity: 0.15 + (i % 3) * 0.1,
}));

// Animation helpers
function useSpringAnim(frame: number, fps: number, delay: number) {
  const y = spring({ frame: frame - delay, fps, from: 24, to: 0, config: { damping: 18, stiffness: 60 } });
  const opacity = interpolate(frame, [delay, delay + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { y, opacity };
}

function useSlideX(frame: number, fps: number, delay: number, from = -40) {
  const x = spring({ frame: frame - delay, fps, from, to: 0, config: { damping: 18, stiffness: 60 } });
  const opacity = interpolate(frame, [delay, delay + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { x, opacity };
}

export const AxosPortfolioIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ========================
  // PHASE 1: Logo Reveal (0-50)
  // ========================
  const logoRevealScale = spring({
    frame,
    fps,
    from: 0.4,
    to: 1,
    config: { damping: 12, stiffness: 40 },
    delay: 8,
  });

  const logoRevealOpacity = interpolate(frame, [5, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const glowPulse = interpolate(frame, [0, 15, 30, 50], [0, 0.6, 0.8, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textRevealOpacity = interpolate(frame, [18, 32], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textRevealX = spring({
    frame: frame - 18,
    fps,
    from: 20,
    to: 0,
    config: { damping: 16, stiffness: 50 },
  });

  // Tagline
  const taglineOpacity = interpolate(frame, [28, 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const taglineY = spring({
    frame: frame - 28,
    fps,
    from: 15,
    to: 0,
    config: { damping: 16, stiffness: 50 },
  });

  // ========================
  // PHASE 2: Transition (40-75)
  // ========================
  const transitionProgress = interpolate(frame, [48, 72], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });

  // Logo moves from center to sidebar
  const logoCenterX = 960 - 24; // center of screen minus half logo
  const logoCenterY = 540 - 60; // center minus offset for text below
  const logoFinalX = 18; // sidebar position
  const logoFinalY = 18; // sidebar position

  const logoX = interpolate(transitionProgress, [0, 1], [logoCenterX, logoFinalX]);
  const logoY = interpolate(transitionProgress, [0, 1], [logoCenterY, logoFinalY]);
  const logoScale = interpolate(transitionProgress, [0, 1], [1.8, 1]);

  // Center content fade out
  const centerFade = interpolate(transitionProgress, [0, 0.4], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Dashboard reveal
  const dashboardReveal = interpolate(transitionProgress, [0.3, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ========================
  // PHASE 3: Dashboard Elements (65-180)
  // ========================
  const sidebarAnim = useSlideX(frame, fps, 62, -50);
  const headerAnim = useSpringAnim(frame, fps, 65);
  const titleAnim = useSpringAnim(frame, fps, 72);
  const balanceCard = useSpringAnim(frame, fps, 80);
  const balanceNum = interpolate(frame, [85, 130], [0, 30158.04], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const stat1 = useSpringAnim(frame, fps, 90);
  const stat2 = useSpringAnim(frame, fps, 94);
  const evoCard = useSpringAnim(frame, fps, 100);
  const chartDraw = interpolate(frame, [110, 155], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const distCard = useSpringAnim(frame, fps, 106);
  const pieScale = spring({
    frame: frame - 115,
    fps,
    from: 0,
    to: 1,
    config: { damping: 14, stiffness: 60 },
  });
  const pieLegendsAnim = PIE_LEGEND.map((_, i) => useSpringAnim(frame, fps, 120 + i * 5));
  const tableHeader = useSpringAnim(frame, fps, 135);
  const tableRows = TABLE_ROWS.map((_, i) => useSpringAnim(frame, fps, 142 + i * 6));
  const aiInput = useSpringAnim(frame, fps, 165);

  // ========================
  // PHASE 4: Idle subtle effects (180+)
  // ========================
  const idleGlow = interpolate(
    frame % 120,
    [0, 60, 120],
    [0.15, 0.25, 0.15],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f0f0f", fontFamily: interFont, overflow: "hidden" }}>

      {/* ===== BACKGROUND GLOW (always visible) ===== */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(139,92,246,${glowPulse * 0.2}) 0%, rgba(139,92,246,0) 70%)`,
          opacity: interpolate(transitionProgress, [0.5, 1], [1, idleGlow * 2], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          pointerEvents: "none",
        }}
      />

      {/* ===== FLOATING PARTICLES ===== */}
      {PARTICLES.map((p, i) => {
        const particleY = p.y - frame * p.speed * 2;
        const particleOpacity = interpolate(frame, [p.delay, p.delay + 15], [0, p.opacity], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }) * interpolate(transitionProgress, [0.3, 0.8], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x + Math.sin(frame * 0.02 + i) * 30,
              top: particleY % 1080,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: COLORS.purple.light,
              opacity: particleOpacity,
              filter: "blur(1px)",
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* ===== PHASE 1: CENTERED LOGO + TEXT ===== */}
      <div
        style={{
          position: "absolute",
          left: logoX,
          top: logoY,
          display: "flex",
          alignItems: "center",
          gap: interpolate(transitionProgress, [0, 1], [16, 8]),
          transform: `scale(${logoScale * logoRevealScale})`,
          opacity: logoRevealOpacity,
          zIndex: 20,
        }}
      >
        <Img
          src={LOGO_SRC}
          style={{
            width: 40,
            height: 40,
            borderRadius: 4,
            boxShadow: `0 0 ${30 + glowPulse * 20}px rgba(139,92,246,${glowPulse * 0.5})`,
          }}
        />
        <span
          style={{
            fontFamily: GT_ALPINA,
            fontSize: 24,
            color: "white",
            letterSpacing: 0.6,
            opacity: interpolate(transitionProgress, [0, 0.5], [textRevealOpacity, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            transform: `translateX(${textRevealX * (1 - transitionProgress)}px)`,
          }}
        >
          Axos
        </span>
      </div>

      {/* Center tagline (fades out during transition) */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: logoCenterY + 70,
          transform: `translate(-50%, ${taglineY}px)`,
          opacity: taglineOpacity * centerFade,
          textAlign: "center",
          zIndex: 15,
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: GT_ALPINA,
            fontSize: 20,
            color: COLORS.text.secondary,
            letterSpacing: 0.8,
          }}
        >
          Time to dominate the market
        </p>
      </div>

      {/* ===== PHASE 2-3: DASHBOARD ===== */}
      <div style={{ opacity: dashboardReveal }}>

        {/* ===== SIDEBAR ===== */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 240,
            height: 1080,
            backgroundColor: "#0f0f0f",
            transform: `translateX(${sidebarAnim.x}px)`,
            opacity: sidebarAnim.opacity,
            display: "flex",
            flexDirection: "column",
            zIndex: 10,
          }}
        >
          {/* Logo space */}
          <div style={{ height: 64 }} />
          {/* Nav */}
          <div style={{ padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  style={{
                    height: 41,
                    borderRadius: 12,
                    padding: "0 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    background: item.active
                      ? "radial-gradient(ellipse at center top, rgba(41,41,41,1) 0%, rgba(21,21,21,0.5) 100%)"
                      : "transparent",
                    borderTop: item.active ? "1px solid #525252" : "1px solid transparent",
                  }}
                >
                  <Icon color={item.active ? "white" : "#9ca3af"} />
                  <span style={{ fontSize: 14, fontWeight: 500, color: item.active ? "white" : "#9ca3af" }}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Upgrade card */}
          <div style={{ marginTop: "auto", padding: "0 12px 16px" }}>
            <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)", marginBottom: 16 }} />
            <div
              style={{
                borderRadius: 12,
                padding: 16,
                position: "relative",
                overflow: "hidden",
                background: "linear-gradient(180deg, rgba(255,255,255,0.03), transparent)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div style={{ position: "absolute", top: -40, right: -20, width: 128, height: 128, borderRadius: "50%", background: "rgba(168,85,247,0.1)", filter: "blur(40px)" }} />
              <p style={{ margin: 0, fontFamily: GT_ALPINA, fontSize: 14, color: "white" }}>Upgrade Plan</p>
              <p style={{ margin: "2px 0 12px", fontFamily: GT_ALPINA, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Unlock AI superpowers</p>
              <div
                style={{
                  height: 34,
                  borderRadius: 12,
                  background: "black",
                  border: "1px solid transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  boxShadow: "inset 0 0 0 1px #1a1818",
                }}
              >
                <span style={{ fontFamily: fragmentMonoFont, fontSize: 12, color: "white", textTransform: "uppercase" }}>Get Pro</span>
                <IconSparkle />
              </div>
            </div>
            <div style={{ height: 41, borderRadius: 12, padding: "0 12px", display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
              <IconDesignSystem />
              <span style={{ fontSize: 14, fontWeight: 500, color: "#9ca3af" }}>Design System</span>
            </div>
            <div style={{ height: 41, borderRadius: 12, padding: "0 12px", display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
              <IconSettings />
              <span style={{ fontSize: 14, fontWeight: 500, color: "#9ca3af" }}>Settings</span>
            </div>
          </div>
        </div>

        {/* ===== HEADER BAR ===== */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1920,
            height: 64,
            backgroundColor: "#0f0f0f",
            borderBottom: "1px solid #262626",
            transform: `translateY(${-headerAnim.y}px)`,
            opacity: headerAnim.opacity,
            zIndex: 5,
          }}
        >
          {/* Sidebar vertical divider in header */}
          <div style={{ position: "absolute", left: 240, top: 0, width: 1, height: 63, background: "#262626" }} />
          {/* Search icon */}
          <div
            style={{
              position: "absolute",
              left: 284,
              top: 12,
              width: 40,
              height: 40,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconSearch />
          </div>
          {/* Portfolio selector (centered in content area) */}
          <div style={{ position: "absolute", left: 520, top: 12, display: "flex", gap: 8, alignItems: "center" }}>
            <div
              style={{
                height: 38,
                borderRadius: 12,
                padding: "0 13px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#8a4fff", opacity: 0.87 }} />
              <span style={{ fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.9)" }}>Meu Portfólio</span>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>&#9662;</span>
            </div>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.06)",
              }}
            >
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 18 }}>&#8943;</span>
            </div>
          </div>
          {/* Right-side icons: bell + user */}
          <div style={{ position: "absolute", right: 24, top: 12, display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <IconBell />
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <IconUser />
            </div>
          </div>
        </div>

        {/* Sidebar border */}
        <div style={{ position: "absolute", left: 240, top: 64, width: 1, height: 1016, background: "#262626", zIndex: 4, opacity: sidebarAnim.opacity }} />

        {/* Sidebar collapse button */}
        <div
          style={{
            position: "absolute",
            left: 224,
            top: 47,
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "#1a1a1a",
            border: "1px solid #262626",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 12,
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
            opacity: headerAnim.opacity,
          }}
        >
          <IconCollapse />
        </div>

        {/* ===== MAIN CONTENT ===== */}
        <div style={{ position: "absolute", left: 405, top: 104, width: 1320, height: 900 }}>

          {/* Portfolio Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
              transform: `translateY(${titleAnim.y}px)`,
              opacity: titleAnim.opacity,
            }}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
              <span style={{ fontSize: 24, fontWeight: 500, color: "white" }}>Portfolio</span>
              <span style={{ fontFamily: GT_ALPINA, fontSize: 24, color: "white", letterSpacing: 0.6 }}>
                — Time to dominate the market with Axos
              </span>
            </div>
            <div
              style={{
                height: 37,
                borderRadius: 12,
                padding: "0 16px",
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "radial-gradient(ellipse at center top, rgba(139,92,246,0.22), rgba(51,39,77,0.43), rgba(21,21,21,0.5))",
                borderTop: "1px solid rgba(107,33,168,0.5)",
              }}
            >
              <IconPlay size={16} />
              <span style={{ fontSize: 14, fontWeight: 500, color: "white" }}>Simulate investment</span>
            </div>
          </div>

          {/* ===== BALANCE CARD ===== */}
          <div
            style={{
              height: 136,
              borderRadius: 12,
              position: "relative",
              overflow: "hidden",
              marginBottom: 32,
              background: "rgba(19,19,19,0.85)",
              boxShadow: "0 0 44px rgba(0,0,0,0.8)",
              transform: `translateY(${balanceCard.y}px)`,
              opacity: balanceCard.opacity,
            }}
          >
            {/* Glass border overlay (Figma node 7:31) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 12,
                opacity: 0.5,
                border: "1px solid rgba(0,0,0,0)",
                backgroundImage: "linear-gradient(183.45deg, rgba(255,255,255,0.22) 12.98%, rgba(20,20,20,0.5) 25.96%, rgba(50,50,50,0.5) 66.09%, rgba(255,255,255,0.4) 89.72%)",
                pointerEvents: "none",
              }}
            />
            <div style={{ position: "absolute", left: -20, top: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(142,91,255,0.18)", filter: "blur(32px)" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px 0 28px" }}>
              {/* Total balance */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ background: "#171717", borderRadius: 4, padding: "4px 8px", width: "fit-content" }}>
                  <span style={{ fontSize: 12, color: "#737373" }}>Total balance</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      fontSize: 30,
                      fontWeight: 400,
                      letterSpacing: -0.5,
                      background: "linear-gradient(180deg, white, #737373)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    ${balanceNum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <div
                    style={{
                      width: 34,
                      height: 30,
                      borderRadius: 4,
                      background: "#171717",
                      border: "1px solid #262626",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>&#8635;</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#22c55e" }}>+$0</span>
                  <div style={{ background: "rgba(34,197,94,0.2)", borderRadius: 9999, padding: "2px 8px" }}>
                    <span style={{ fontSize: 12, color: "#22c55e" }}>0%</span>
                  </div>
                </div>
              </div>

              <div style={{ width: 1, height: 64, background: "#262626" }} />

              {/* Stats */}
              <div style={{ display: "flex", gap: 80, transform: `translateY(${stat1.y}px)`, opacity: stat1.opacity }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <IconTopMover size={12} />
                    <span style={{ fontSize: 12, color: "#9ca3af" }}>Top Mover (24h)</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
                    <span style={{ fontSize: 14, fontWeight: 500, color: "white" }}>BTC</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#34d399" }}>+0.79%</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <IconDominance size={12} />
                    <span style={{ fontSize: 12, color: "#9ca3af" }}>Dominance</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
                    <span style={{ fontSize: 14, fontWeight: 500, color: "white" }}>BTC</span>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>58.4%</span>
                  </div>
                </div>
              </div>

              <div style={{ width: 1, height: 64, background: "#262626" }} />

              {/* 7d Trend */}
              <div style={{ width: 180, opacity: stat2.opacity * 0.8, transform: `translateY(${stat2.y}px)` }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "flex-end", paddingRight: 4, marginBottom: 4 }}>
                  <IconTrend size={12} />
                  <span style={{ fontSize: 10, fontWeight: 500, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5 }}>7d Trend</span>
                </div>
                <div style={{ width: 180, height: 41, position: "relative" }}>
                  <svg width="180" height="41" viewBox="0 0 180 41" fill="none">
                    <path
                      d={`M0,35 Q20,30 40,28 T80,20 T120,${interpolate(chartDraw, [0, 100], [35, 15], { extrapolateRight: "clamp" })} T160,18 T180,10`}
                      stroke="rgba(139,92,246,0.6)"
                      strokeWidth="1.5"
                      fill="none"
                      strokeDasharray="300"
                      strokeDashoffset={interpolate(chartDraw, [0, 100], [300, 0], { extrapolateRight: "clamp" })}
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* ===== CHARTS ROW ===== */}
          <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
            {/* Evolution Chart */}
            <div
              style={{
                flex: 1,
                height: 430,
                borderRadius: 12,
                position: "relative",
                overflow: "hidden",
                background: "rgba(19,19,19,0.85)",
                boxShadow: "0 0 44px rgba(0,0,0,0.8)",
                transform: `translateY(${evoCard.y}px)`,
                opacity: evoCard.opacity,
              }}
            >
              {/* Glass border overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 12,
                  opacity: 0.5,
                  pointerEvents: "none",
                  border: "1px solid rgba(0,0,0,0)",
                  backgroundImage: "linear-gradient(196deg, rgba(255,255,255,0.22) 12.98%, rgba(20,20,20,0.5) 25.96%, rgba(50,50,50,0.5) 66.09%, rgba(255,255,255,0.4) 89.72%)",
                }}
              />
              <div
                style={{
                  height: 62,
                  borderBottom: "1px solid #2a2d31",
                  padding: "0 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <IconEvolution size={20} />
                  <span style={{ fontFamily: spaceGroteskFont, fontSize: 18, fontWeight: 500, color: "white" }}>Evolution</span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ height: 33, borderRadius: 6, background: "#171717", borderTop: "1px solid #404040", display: "flex", padding: 2 }}>
                    {["1H", "24H", "1W", "All"].map((t) => (
                      <div
                        key={t}
                        style={{
                          height: 28,
                          borderRadius: 6,
                          padding: "6px 12px",
                          background: t === "1W" ? "#0a0a0a" : "transparent",
                        }}
                      >
                        <span style={{ fontSize: 12, fontWeight: 500, color: t === "1W" ? "#fafafa" : "#737373" }}>{t}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ height: 24, borderRadius: 2, background: "rgba(255,255,255,0.05)", padding: "0 12px", display: "flex", alignItems: "center", gap: 4 }}>
                    <IconPercent size={12} />
                    <span style={{ fontFamily: spaceGroteskFont, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>0.00%</span>
                  </div>
                </div>
              </div>
              {/* Chart area */}
              <div style={{ position: "absolute", left: 24, top: 87, width: 816, height: 220 }}>
                {["33.8K", "29.0K", "26.5K"].map((label, i) => (
                  <span key={label} style={{ position: "absolute", right: 24, top: i * 88, fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{label}</span>
                ))}
                <span style={{ position: "absolute", left: "45%", bottom: 3, fontSize: 10, color: "rgba(255,255,255,0.4)" }}>quinta</span>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ position: "absolute", left: 0, right: 24, top: i * 88 + 5, height: 1, background: "rgba(255,255,255,0.05)" }} />
                ))}
                <svg width="760" height="190" viewBox="0 0 760 190" style={{ position: "absolute", left: 5, top: 10 }}>
                  <defs>
                    <linearGradient id="areaGradIntro" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(139,92,246,0.3)" />
                      <stop offset="100%" stopColor="rgba(139,92,246,0)" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,140 Q80,135 160,120 T320,95 T480,80 T640,55 T760,30"
                    stroke="rgba(139,92,246,0.8)"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="1000"
                    strokeDashoffset={interpolate(chartDraw, [0, 100], [1000, 0], { extrapolateRight: "clamp" })}
                  />
                  <path
                    d="M0,140 Q80,135 160,120 T320,95 T480,80 T640,55 T760,30 L760,190 L0,190 Z"
                    fill="url(#areaGradIntro)"
                    opacity={interpolate(chartDraw, [30, 100], [0, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
                  />
                  <circle
                    cx="380"
                    cy="88"
                    r="5"
                    fill="#8b5cf6"
                    opacity={interpolate(chartDraw, [45, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
                  />
                </svg>
              </div>
            </div>

            {/* Distribution Chart */}
            <div
              style={{
                width: 424,
                height: 430,
                borderRadius: 12,
                position: "relative",
                overflow: "hidden",
                background: "rgba(19,19,19,0.85)",
                boxShadow: "0 0 44px rgba(0,0,0,0.8)",
                transform: `translateY(${distCard.y}px)`,
                opacity: distCard.opacity,
              }}
            >
              {/* Glass border overlay (Figma node 7:179) */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 12,
                  opacity: 0.5,
                  pointerEvents: "none",
                  border: "1px solid rgba(0,0,0,0)",
                  backgroundImage: "linear-gradient(210.35deg, rgba(255,255,255,0.22) 12.98%, rgba(20,20,20,0.5) 25.96%, rgba(50,50,50,0.5) 66.09%, rgba(255,255,255,0.4) 89.72%)",
                }}
              />
              {/* Top gradient line (Figma node 7:261) */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 424,
                  height: 1,
                  background: "linear-gradient(90deg, rgba(0,0,0,0), #2a2d31 50%, rgba(0,0,0,0))",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  height: 57,
                  borderBottom: "1px solid #2a2d31",
                  padding: "0 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <IconDistribution size={20} />
                  <span style={{ fontFamily: spaceGroteskFont, fontSize: 18, fontWeight: 500, color: "white" }}>Distribution</span>
                </div>
                <div style={{ height: 24, borderRadius: 2, background: "rgba(255,255,255,0.05)", padding: "4px 12px" }}>
                  <span style={{ fontFamily: robotoMonoFont, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>4 ativos</span>
                </div>
              </div>
              {/* Gauge Chart - Figma-rendered segments */}
              <div style={{ position: "absolute", left: 20, top: 78, width: 384, height: 332 }}>
                {/* PieChart container: 384x180 positioned at top=-16 per Figma */}
                <div style={{ position: "absolute", left: 0, top: -16, width: 384, height: 180, overflow: "hidden" }}>
                  <div style={{ position: "relative", width: 384, height: 180, transform: `scale(${pieScale})`, transformOrigin: "center center" }}>
                    {/* BTC segment */}
                    <div style={{ position: "absolute", top: "13.33%", right: "45.55%", bottom: "31.11%", left: "24.01%" }}>
                      <Img src={PIE_BTC_SRC} style={{ display: "block", width: "100%", height: "100%" }} />
                    </div>
                    {/* ETH segment */}
                    <div style={{ position: "absolute", top: "15.91%", right: "24.3%", bottom: "36%", left: "55.52%" }}>
                      <Img src={PIE_ETH_SRC} style={{ display: "block", width: "100%", height: "100%" }} />
                    </div>
                    {/* DOT segment */}
                    <div style={{ position: "absolute", top: "67.04%", right: "23.96%", bottom: "31.11%", left: "70.82%" }}>
                      <Img src={PIE_DOT_SRC} style={{ display: "block", width: "100%", height: "100%" }} />
                    </div>
                  </div>
                  {/* Center text: left 123.57, top 80, w 137, h 56 */}
                  <div
                    style={{
                      position: "absolute",
                      left: 123.57,
                      top: 80,
                      width: 137,
                      height: 56,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 4,
                      transform: `scale(${pieScale})`,
                      transformOrigin: "center center",
                    }}
                  >
                    <span style={{ fontSize: 30, fontWeight: 700, color: "white", letterSpacing: -0.75, lineHeight: "36px", textAlign: "center" }}>R$ 30.158</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.6, lineHeight: "16px", textAlign: "center" }}>Total (BRL)</span>
                  </div>
                </div>
                {/* Legend (Figma node 7:181) */}
                <div style={{ position: "absolute", left: 0, top: 172, width: 384, height: 160, overflow: "hidden", paddingLeft: 8, paddingRight: 19, display: "flex", flexDirection: "column", gap: 12 }}>
                  {PIE_LEGEND.map((item, i) => (
                    <div
                      key={item.token}
                      style={{
                        height: 40,
                        padding: "0 8px",
                        borderRadius: 4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        transform: `translateY(${pieLegendsAnim[i].y}px)`,
                        opacity: pieLegendsAnim[i].opacity,
                      }}
                    >
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.color }} />
                        <span style={{ fontSize: 14, fontWeight: 500, color: "#d1d5db" }}>{item.token}</span>
                      </div>
                      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                        <span style={{ fontFamily: robotoMonoFont, fontSize: 14, color: "#9ca3af", width: 50, textAlign: "right" }}>{item.pct}</span>
                        <div style={{ width: 1, height: 32, background: "#333" }} />
                        <span style={{ fontFamily: robotoMonoFont, fontSize: 14, color: "#9ca3af", width: 85, textAlign: "right" }}>{item.val}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ===== ASSETS TABLE ===== */}
          <div
            style={{
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid #2a2d31",
              background: "rgba(19,19,19,0.85)",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                height: 41,
                padding: "0 16px",
                display: "flex",
                alignItems: "center",
                background: "linear-gradient(180deg, rgba(13,13,15,0.8), rgba(13,13,15,0.95))",
                borderBottom: "1px solid rgba(142,91,255,0.1)",
                transform: `translateY(${tableHeader.y}px)`,
                opacity: tableHeader.opacity,
              }}
            >
              {TABLE_HEADERS.map((h, i) => (
                <span
                  key={h}
                  style={{
                    width: HEADER_WIDTHS[i],
                    fontSize: 12,
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.65)",
                    textAlign: HEADER_ALIGNS[i],
                    flex: i === 1 ? 1 : undefined,
                  }}
                >
                  {h}
                </span>
              ))}
            </div>
            <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              {TABLE_ROWS.map((row, i) => (
                <div
                  key={row.ticker}
                  style={{
                    height: 70,
                    borderRadius: 12,
                    border: "1px solid #2a2d31",
                    background: "rgba(19,19,19,0.85)",
                    padding: "0 16px",
                    display: "flex",
                    alignItems: "center",
                    transform: `translateY(${tableRows[i].y}px)`,
                    opacity: tableRows[i].opacity,
                  }}
                >
                  <span style={{ width: 60, fontSize: 12, color: "rgba(255,255,255,0.5)", textAlign: "center" }}>{row.rank}</span>
                  <div style={{ flex: 1, display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
                    <div>
                      <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.8)" }}>{row.name}</p>
                      <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{row.ticker}</p>
                    </div>
                  </div>
                  <div style={{ width: 160, textAlign: "right" }}>
                    <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.8)" }}>{row.price}</p>
                    <p style={{ margin: 0, fontSize: 12 }}>
                      <span style={{ color: "rgba(255,255,255,0.5)" }}>{row.qty}</span>
                      <span style={{ color: "rgba(255,255,255,0.7)", marginLeft: 4 }}>{row.value}</span>
                    </p>
                  </div>
                  <div style={{ width: 80, display: "flex", justifyContent: "center" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "2px 6px",
                        background: row.up24 ? "rgba(0,200,83,0.1)" : "rgba(239,68,68,0.1)",
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d={row.up24 ? "M6 9V3M6 3L3 6M6 3L9 6" : "M6 3V9M6 9L3 6M6 9L9 6"} stroke={row.up24 ? "#00c853" : "#ef4444"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span style={{ fontSize: 12, fontWeight: 500, color: row.up24 ? "#00c853" : "#ef4444" }}>{row.d24}</span>
                    </div>
                  </div>
                  <div style={{ width: 80, display: "flex", justifyContent: "center" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "2px 6px",
                        background: row.up7 ? "rgba(0,200,83,0.1)" : "rgba(239,68,68,0.1)",
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d={row.up7 ? "M6 9V3M6 3L3 6M6 3L9 6" : "M6 3V9M6 9L3 6M6 9L9 6"} stroke={row.up7 ? "#00c853" : "#ef4444"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span style={{ fontSize: 12, fontWeight: 500, color: row.up7 ? "#00c853" : "#ef4444" }}>{row.d7}</span>
                    </div>
                  </div>
                  <span style={{ width: 90, fontSize: 12, color: "rgba(255,255,255,0.6)", textAlign: "center" }}>{row.mcap}</span>
                  <span style={{ width: 100, fontSize: 12, color: "rgba(255,255,255,0.6)", textAlign: "center" }}>{row.vol}</span>
                  <span style={{ width: 80, fontSize: 12, color: "rgba(255,255,255,0.6)", textAlign: "center", opacity: 0.4 }}>No chart</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== FLOATING AI INPUT ===== */}
        <div
          style={{
            position: "absolute",
            left: 660,
            bottom: 40,
            width: 600,
            display: "flex",
            justifyContent: "center",
            transform: `translateY(${aiInput.y}px)`,
            opacity: aiInput.opacity,
          }}
        >
          <div
            style={{
              width: 320,
              height: 58,
              borderRadius: 16,
              padding: "12px 12px",
              background: "linear-gradient(180deg, rgba(51,51,57,0.85), rgba(53,53,56,0.85), rgba(38,38,39,0.85))",
              boxShadow: "0 40px 60px rgba(0,0,0,0.4), 0 20px 30px rgba(0,0,0,0.3), inset 0.6px 0.6px 0.6px rgba(255,255,255,0.32), inset 0.6px -0.4px 0.6px rgba(255,255,255,0.05)",
              display: "flex",
              gap: 8,
              alignItems: "flex-end",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -40,
                left: "50%",
                transform: "translateX(-50%)",
                width: 320,
                height: 120,
                borderRadius: 16,
                opacity: 0.4,
                background: "radial-gradient(ellipse at center top, rgba(139,92,246,0.35), rgba(70,46,123,0.175) 35%, transparent 70%)",
              }}
            />
            <div style={{ width: 41, height: 34, borderRight: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: 14 }}>&#10022;</span>
              </div>
            </div>
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14, color: "#6b7280", paddingLeft: 8 }}>Ask Axos...</span>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "#787878",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ color: "white", fontSize: 14 }}>&#8593;</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
