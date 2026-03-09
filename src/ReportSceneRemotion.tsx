import React, { memo } from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
  staticFile,
} from "remotion";
import { loadFont as loadLocalFont } from "@remotion/fonts";
import {
  FileText,
  Star,
  ChevronDown,
  Activity,
  Target,
  Shield,
  ArrowRight,
  ListChecks,
  TrendingUp,
  Clock,
  Circle,
  CheckCircle2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

// ─────────────────────────────────────────────
// Font
// ─────────────────────────────────────────────
loadLocalFont({
  family: "GT Alpina",
  url: staticFile("GT Alpina Light-normal-300-100.otf"),
  weight: "300",
  style: "normal",
});
const GT_ALPINA = "GT Alpina";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface RecommendationCard {
  ticker: string;
  name: string;
  price: string;
  description: string;
  target: string;
  support: string;
  confidence: number;
  upside?: string;
  avatarUrl?: string;
}
interface ActionItem {
  title: string;
  priority: "alta" | "média" | "baixa";
  description: string;
  type: string;
  timeframe: string;
  done: boolean;
}

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────
const RECOMMENDATIONS: RecommendationCard[] = [
  {
    ticker: "ONDO",
    name: "Ondo Finance",
    price: "$0.95",
    description:
      "Token líder no setor de RWA, narrativa que ganhou tração massiva (+185% YTD). Baleias on-chain em modo de acumulação pesada.",
    target: "N/A",
    support: "N/A",
    confidence: 85,
  },
  {
    ticker: "SOL",
    name: "Solana",
    price: "$85.68",
    avatarUrl:
      "https://coin-images.coingecko.com/coins/images/4128/large/solana.png?1718769756",
    description:
      "SOL apresenta um cenário de bottoming técnico com RSI em níveis de sobrevenda (38) e forte acumulação por baleias.",
    target: "$115.00",
    support: "$74.50",
    confidence: 82,
    upside: "+36.3%",
  },
  {
    ticker: "XRP",
    name: "XRP",
    price: "$1.45",
    avatarUrl:
      "https://coin-images.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png?1696501442",
    description:
      "XRP demonstra força relativa superior ao mercado. Divergência de alta no MACD e suporte sólido em $1.40.",
    target: "$1.75",
    support: "$1.28",
    confidence: 78,
    upside: "+22.4%",
  },
];
const ACTION_ITEMS: ActionItem[] = [
  {
    title: "Entrada em Solana (SOL)",
    priority: "alta",
    description: "Executar compra de SOL no par USDT entre $82 e $85.",
    type: "action",
    timeframe: "within 24 hours",
    done: false,
  },
  {
    title: "Posicionamento em XRP",
    priority: "alta",
    description:
      "Configurar ordem de compra para XRP em $1.43 com stop loss em $1.28.",
    type: "action",
    timeframe: "within 2 days",
    done: false,
  },
  {
    title: "Monitoramento de Breakout BTC",
    priority: "média",
    description: "Monitorar fechamento diário do BTC acima de $68,500.",
    type: "analysis",
    timeframe: "within 3 days",
    done: false,
  },
];

// ── Chart Data ───────────────────────────────
type ChartDataPoint = Record<string, string | number>;

const lineData: ChartDataPoint[] = [
  { month: "Jan", BTC: 42000, ETH: 2800, SOL: 95 },
  { month: "Feb", BTC: 47000, ETH: 3100, SOL: 110 },
  { month: "Mar", BTC: 44000, ETH: 2900, SOL: 88 },
  { month: "Apr", BTC: 61000, ETH: 3600, SOL: 145 },
  { month: "May", BTC: 57000, ETH: 3200, SOL: 130 },
  { month: "Jun", BTC: 65000, ETH: 3900, SOL: 160 },
  { month: "Jul", BTC: 63000, ETH: 3700, SOL: 152 },
];
const pieData: ChartDataPoint[] = [
  { name: "BTC", value: 38 },
  { name: "ETH", value: 22 },
  { name: "SOL", value: 15 },
  { name: "XRP", value: 12 },
  { name: "Others", value: 13 },
];
const PIE_COLORS = ["#e84040", "#f5a623", "#a78bfa", "#60a5fa", "#34d399"];
const candleData: ChartDataPoint[] = [
  { date: "Mon", open: 60000, close: 63200, high: 64500, low: 59200 },
  { date: "Tue", open: 63200, close: 61800, high: 64000, low: 61000 },
  { date: "Wed", open: 61800, close: 65400, high: 66200, low: 61500 },
  { date: "Thu", open: 65400, close: 64100, high: 66000, low: 63500 },
  { date: "Fri", open: 64100, close: 67300, high: 68000, low: 63800 },
  { date: "Sat", open: 67300, close: 66200, high: 68100, low: 65500 },
  { date: "Sun", open: 66200, close: 68900, high: 69500, low: 65900 },
];
const agentBarData: ChartDataPoint[] = [
  { name: "Research", tasks: 28, success: 26 },
  { name: "Analysis", tasks: 22, success: 20 },
  { name: "Execution", tasks: 18, success: 17 },
  { name: "Monitor", tasks: 35, success: 33 },
  { name: "Report", tasks: 14, success: 14 },
];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// Static card style — defined once, no re-creation per frame
const BASE_CARD_STYLE: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  background: "rgba(19,19,19,0.85)",
  boxShadow: "0 0 44px 0 rgba(0,0,0,0.80)",
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.07)",
  padding: 20,
};

// Fixed chart dimensions — avoids ResizeObserver overhead from ResponsiveContainer
const CHART_W = 380;
const CHART_H = 120;

const cardTitle = (label: string, sub?: string) => (
  <div style={{ marginBottom: 14 }}>
    <span
      style={{
        fontSize: 13,
        fontWeight: 600,
        color: "rgba(235,235,245,0.88)",
        letterSpacing: "0.03em",
      }}
    >
      {label}
    </span>
    {sub && (
      <span
        style={{ fontSize: 10, color: "rgba(255,255,255,0.30)", marginLeft: 8 }}
      >
        {sub}
      </span>
    )}
  </div>
);

// Custom candlestick bar
interface CandleBarProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  open?: number;
  close?: number;
  high?: number;
  low?: number;
}
const CandleBar = (props: CandleBarProps) => {
  const { x = 0, y = 0, width = 0, height = 0, open, close, high, low } = props;
  if (open == null) return null;
  const isUp = close >= open;
  const color = isUp ? "#34d399" : "#f87171";
  const bodyTop = isUp ? close : open;
  const bodyH = Math.max(Math.abs(close - open), 2);
  const scale = height / (high - low || 1);
  const top = y;
  const totalRange = high - low;
  const wickBotY = top + totalRange * scale;
  const bodyY = top + (high - bodyTop) * scale;
  const bodyHeight = bodyH * scale;
  const cx = x + width / 2;
  return (
    <g>
      <line
        x1={cx}
        y1={top}
        x2={cx}
        y2={wickBotY}
        stroke={color}
        strokeWidth={1.5}
      />
      <rect
        x={x + 2}
        y={bodyY}
        width={width - 4}
        height={Math.max(bodyHeight, 2)}
        fill={color}
        rx={1}
      />
    </g>
  );
};

// ─────────────────────────────────────────────
// Priority badge
// ─────────────────────────────────────────────
const PriorityBadge: React.FC<{ priority: ActionItem["priority"] }> = ({
  priority,
}) => {
  const styles: Record<
    ActionItem["priority"],
    { color: string; bg: string; border: string }
  > = {
    alta: {
      color: "rgb(248,113,113)",
      bg: "rgba(248,113,113,0.10)",
      border: "rgba(248,113,113,0.20)",
    },
    média: {
      color: "rgb(251,191,36)",
      bg: "rgba(251,191,36,0.10)",
      border: "rgba(251,191,36,0.20)",
    },
    baixa: {
      color: "rgb(52,211,153)",
      bg: "rgba(52,211,153,0.10)",
      border: "rgba(52,211,153,0.20)",
    },
  };
  const s = styles[priority];
  return (
    <span
      style={{
        fontSize: 10,
        padding: "2px 6px",
        borderRadius: 4,
        textTransform: "uppercase",
        letterSpacing: "0.6px",
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.border}`,
      }}
    >
      {priority}
    </span>
  );
};

// ─────────────────────────────────────────────
// Recommendation Card
// ─────────────────────────────────────────────
const RecommCard: React.FC<{ card: RecommendationCard }> = ({ card: c }) => (
  <div
    style={{
      position: "relative",
      display: "flex",
      flexDirection: "column",
      height: "100%",
      overflow: "hidden",
      background: "rgb(20,20,20)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 12,
    }}
  >
    <div
      style={{
        padding: 14,
        display: "flex",
        flexGrow: 1,
        flexDirection: "column",
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
        <div
          style={{
            display: "flex",
            height: 32,
            width: 32,
            flexShrink: 0,
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            background: "rgb(10,10,10)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.08)",
            borderRadius: 9999,
          }}
        >
          {c.avatarUrl ? (
            <Img
              src={c.avatarUrl}
              style={{ width: 32, height: 32, objectFit: "cover" }}
            />
          ) : (
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {c.ticker}
            </span>
          )}
        </div>
        <div style={{ minWidth: 0, flexGrow: 1 }}>
          <h3
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "rgb(255,255,255)",
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {c.name}
          </h3>
          <span
            style={{
              fontFamily: '"Roboto Mono", monospace',
              fontSize: 10,
              color: "rgba(255,255,255,0.4)",
            }}
          >
            {c.price}
          </span>
        </div>
      </div>
      <p
        style={{
          fontSize: 10,
          lineHeight: 1.5,
          color: "rgba(255,255,255,0.45)",
          margin: "0 0 10px",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 2,
          overflow: "hidden",
          flexGrow: 1,
        }}
      >
        {c.description}
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 5,
          marginBottom: 10,
        }}
      >
        {[
          { icon: <Target size={8} />, label: "Target", value: c.target },
          { icon: <Shield size={8} />, label: "Support", value: c.support },
        ].map(({ icon, label, value }) => (
          <div
            key={label}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: 4,
              padding: "5px 8px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                fontSize: 8,
                textTransform: "uppercase",
                letterSpacing: "0.6px",
                color: "rgba(255,255,255,0.30)",
                marginBottom: 2,
              }}
            >
              {icon} {label}
            </div>
            <span
              style={{
                fontFamily: '"Roboto Mono", monospace',
                fontSize: 11,
                fontWeight: 600,
                color: "rgb(255,255,255)",
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: "auto",
          paddingTop: 10,
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              fontSize: 10,
              color: "rgba(255,255,255,0.35)",
            }}
          >
            <Activity size={10} /> AI Confidence
          </span>
          <span
            style={{
              fontFamily: '"Roboto Mono", monospace',
              fontSize: 11,
              fontWeight: 700,
              color: "rgb(52,211,153)",
            }}
          >
            {c.confidence}%
          </span>
        </div>
        <div
          style={{
            height: 3,
            background: "rgba(255,255,255,0.04)",
            borderRadius: 9999,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: 3,
              background: "rgb(52,211,153)",
              borderRadius: 9999,
              width: `${c.confidence}%`,
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 6,
          }}
        >
          <span
            style={{
              fontFamily: '"Roboto Mono", monospace',
              fontSize: 10,
              color: "rgba(255,255,255,0.25)",
            }}
          >
            {c.upside ?? ""}
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              fontSize: 10,
              color: "rgba(255,255,255,0.40)",
            }}
          >
            View Details <ArrowRight size={10} />
          </span>
        </div>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// Action Item Row
// ─────────────────────────────────────────────
const ActionRow: React.FC<{ item: ActionItem }> = ({ item }) => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      padding: "8px 10px",
      background: "rgba(38,38,38,0.50)",
      border: "1px solid rgb(51,51,51)",
      borderRadius: 10,
    }}
  >
    <div
      style={{
        marginTop: 2,
        flexShrink: 0,
        color: item.done ? "rgb(52,211,153)" : "rgb(107,114,128)",
        display: "flex",
      }}
    >
      {item.done ? <CheckCircle2 size={15} /> : <Circle size={15} />}
    </div>
    <div style={{ flexGrow: 1, minWidth: 0 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 2,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: "rgb(229,231,235)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            paddingRight: 6,
          }}
        >
          {item.title}
        </span>
        <PriorityBadge priority={item.priority} />
      </div>
      <p
        style={{
          fontSize: 10,
          color: "rgb(107,114,128)",
          margin: "0 0 4px",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 1,
          overflow: "hidden",
        }}
      >
        {item.description}
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 9,
          color: "rgb(75,85,99)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
          <TrendingUp size={9} />
          <span style={{ textTransform: "capitalize" }}>{item.type}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Clock size={9} />
          <span>{item.timeframe}</span>
        </div>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// Chart Cards — memo prevents re-render on every frame
// ─────────────────────────────────────────────
const LineChartCard = memo(() => (
  <div style={BASE_CARD_STYLE}>
    {cardTitle("Price Performance", "Last 7 months")}
    <div style={{ display: "flex", gap: 16, marginBottom: 10 }}>
      {[
        { label: "BTC", color: "#f5a623" },
        { label: "ETH", color: "#60a5fa" },
        { label: "SOL", color: "#a78bfa" },
      ].map((l) => (
        <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "rgba(255,255,255,0.45)" }}>
          <span style={{ width: 20, height: 2, background: l.color, display: "inline-block", borderRadius: 2 }} />
          {l.label}
        </div>
      ))}
    </div>
    <LineChart width={CHART_W} height={CHART_H} data={lineData} margin={{ top: 4, right: 8, left: -28, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
      <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.30)", fontSize: 10 }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fill: "rgba(255,255,255,0.20)", fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
      <Line type="monotone" dataKey="BTC" stroke="#f5a623" strokeWidth={2} dot={false} isAnimationActive={false} />
      <Line type="monotone" dataKey="ETH" stroke="#60a5fa" strokeWidth={2} dot={false} isAnimationActive={false} />
      <Line type="monotone" dataKey="SOL" stroke="#a78bfa" strokeWidth={2} dot={false} isAnimationActive={false} />
    </LineChart>
  </div>
));

const PieChartCard = memo(() => (
  <div style={BASE_CARD_STYLE}>
    {cardTitle("Portfolio Allocation", "By asset")}
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <PieChart width={140} height={130}>
        <Pie data={pieData} cx="50%" cy="50%" innerRadius={38} outerRadius={58} dataKey="value" paddingAngle={2} isAnimationActive={false}>
          {pieData.map((_: ChartDataPoint, i: number) => (
            <Cell key={i} fill={PIE_COLORS[i]} />
          ))}
        </Pie>
      </PieChart>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        {pieData.map((d: ChartDataPoint, i: number) => (
          <div key={String(d.name)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "rgba(255,255,255,0.60)" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: PIE_COLORS[i], display: "inline-block", flexShrink: 0 }} />
              {d.name}
            </div>
            <span style={{ fontFamily: '"Roboto Mono", monospace', fontSize: 11, color: "rgba(255,255,255,0.85)" }}>
              {d.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
));

const CANDLE_MIN = Math.min(...candleData.map((d) => d.low as number)) - 500;
const CANDLE_MAX = Math.max(...candleData.map((d) => d.high as number)) + 500;

const CandleChartCard = memo(() => (
  <div style={BASE_CARD_STYLE}>
    {cardTitle("BTC/USDT — Candles", "Daily")}
    <BarChart width={CHART_W} height={CHART_H} data={candleData} margin={{ top: 4, right: 8, left: -28, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
      <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.30)", fontSize: 10 }} axisLine={false} tickLine={false} />
      <YAxis domain={[CANDLE_MIN, CANDLE_MAX]} tick={{ fill: "rgba(255,255,255,0.20)", fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
      <Bar dataKey="high" shape={<CandleBar />} isAnimationActive={false} />
    </BarChart>
  </div>
));

const AgentBarCard = memo(() => (
  <div style={BASE_CARD_STYLE}>
    {cardTitle("Agent Task Execution", "All agents")}
    <div style={{ display: "flex", gap: 14, marginBottom: 10 }}>
      {[
        { label: "Total Tasks", color: "rgba(255,255,255,0.15)" },
        { label: "Success", color: "#34d399" },
      ].map((l) => (
        <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "rgba(255,255,255,0.45)" }}>
          <span style={{ width: 10, height: 10, background: l.color, display: "inline-block", borderRadius: 2 }} />
          {l.label}
        </div>
      ))}
    </div>
    <BarChart width={CHART_W} height={CHART_H} data={agentBarData} margin={{ top: 4, right: 8, left: -28, bottom: 0 }} barCategoryGap="30%">
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
      <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.30)", fontSize: 10 }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fill: "rgba(255,255,255,0.20)", fontSize: 9 }} axisLine={false} tickLine={false} />
      <Bar dataKey="tasks" fill="rgba(255,255,255,0.12)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
      <Bar dataKey="success" fill="#34d399" radius={[4, 4, 0, 0]} isAnimationActive={false} />
    </BarChart>
  </div>
));

// ─────────────────────────────────────────────
// Main component: frame-driven, no useState
// ─────────────────────────────────────────────
interface ReportSceneProps {
  startFrame: number;
}

export const ReportScene: React.FC<ReportSceneProps> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps, height: H } = useVideoConfig();

  // Drawer slides up from bottom
  const drawerSpring = spring({
    frame,
    fps,
    delay: startFrame,
    config: { damping: 26, stiffness: 200, mass: 1.1 },
  });
  const drawerY = interpolate(drawerSpring, [0, 1], [H, 0]);

  // Background fade
  const bgOp = interpolate(frame, [startFrame, startFrame + 10], [0, 1], CLAMP);

  // Staggered content rows — offset from startFrame in frames
  const delay60 = (frames: number) => startFrame + frames;

  const logoOp = interpolate(
    frame,
    [delay60(6), delay60(20)],
    [0, drawerSpring > 0.5 ? 0.12 : 0],
    CLAMP
  );

  const titleSpring = spring({
    frame,
    fps,
    delay: delay60(12),
    config: { damping: 22, stiffness: 180 },
  });
  const titleOp = interpolate(titleSpring, [0, 1], [0, 1], CLAMP);
  const titleY = interpolate(titleSpring, [0, 1], [-6, 0]);

  const row1Spring = spring({
    frame,
    fps,
    delay: delay60(18),
    config: { damping: 22, stiffness: 160 },
  });
  const row1Op = interpolate(row1Spring, [0, 1], [0, 1], CLAMP);
  const row1Y = interpolate(row1Spring, [0, 1], [12, 0]);

  const row2Spring = spring({
    frame,
    fps,
    delay: delay60(30),
    config: { damping: 22, stiffness: 160 },
  });
  const row2Op = interpolate(row2Spring, [0, 1], [0, 1], CLAMP);
  const row2Y = interpolate(row2Spring, [0, 1], [16, 0]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: bgOp,
        pointerEvents: "none",
      }}
    >
      {/* Background logo hint */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          pointerEvents: "none",
          opacity: logoOp,
        }}
      >
        <Img
          src={staticFile("Logo 4k ChatGPT Dez 6 2025.png")}
          style={{ width: 48, height: 48, objectFit: "contain" }}
        />
        <span
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          Processing complete
        </span>
      </div>

      {/* Drawer */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          transform: `translateY(${drawerY}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Drag handle */}
        <div
          style={{
            width: 48,
            height: 5,
            borderRadius: 99,
            background: "rgba(255,255,255,0.15)",
            marginBottom: 8,
            flexShrink: 0,
          }}
        />

        {/* Folder wrapper */}
        <div
          style={{
            width: "100%",
            maxWidth: 1200,
            position: "relative",
            margin: "0 auto",
          }}
        >
          {/* Folder tab */}
          <div
            style={{
              position: "absolute",
              top: -32,
              left: 24,
              zIndex: 5,
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(22,22,22,0.95)",
              backdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.10)",
              borderBottom: "none",
              borderRadius: "10px 10px 0 0",
              padding: "6px 16px",
            }}
          >
            <FileText size={12} color="rgba(200,200,220,0.75)" />
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "rgba(220,220,240,0.80)",
                letterSpacing: "0.05em",
                fontFamily: '"Courier New", Courier, monospace',
              }}
            >
              Axos report
            </span>
          </div>

          {/* Main panel */}
          <div
            style={{
              position: "relative",
              width: "100%",
              background:
                "linear-gradient(160deg, rgba(18,18,18,0.98) 0%, rgba(10,10,10,0.99) 100%)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
              borderRight: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "16px 16px 0 0",
              padding: "18px 28px 24px",
              boxShadow: "0 -10px 50px rgba(0,0,0,0.6), 0 -2px 16px rgba(0,0,0,0.5)",
              minHeight: H * 0.82,
              overflow: "hidden",
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            {/* Paper lines texture */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "16px 16px 0 0",
                background:
                  "repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(255,255,255,0.010) 23px, rgba(255,255,255,0.010) 24px)",
                pointerEvents: "none",
              }}
            />

            {/* Content */}
            <div style={{ position: "relative", zIndex: 2 }}>

              {/* Title row */}
              <div
                style={{
                  marginBottom: 20,
                  opacity: titleOp,
                  transform: `translateY(${titleY}px)`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontSize: 17,
                      fontWeight: 300,
                      color: "rgba(235,235,245,0.92)",
                      letterSpacing: "0.02em",
                      fontFamily: GT_ALPINA,
                    }}
                  >
                    Agent Orchestration Summary
                  </span>
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        padding: "6px 14px",
                        borderRadius: 8,
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.09)",
                        color: "rgb(229,231,235)",
                        fontSize: 11,
                        fontWeight: 500,
                        letterSpacing: "0.03em",
                      }}
                    >
                      Dismiss
                    </div>
                    <div
                      style={{
                        padding: "6px 16px",
                        borderRadius: 8,
                        background: "rgba(122,59,255,0.15)",
                        border: "1px solid rgba(122,59,255,0.40)",
                        color: "white",
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                      }}
                    >
                      Export Report
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    height: 1,
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.07) 20%, rgba(255,255,255,0.07) 80%, transparent)",
                    marginTop: 14,
                  }}
                />
              </div>

              {/* Row 1: Recommendations + Action Plan */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "7fr 5fr",
                  gap: 20,
                  marginBottom: 20,
                  alignItems: "stretch",
                  opacity: row1Op,
                  transform: `translateY(${row1Y}px)`,
                }}
              >
                {/* LEFT: Recommendations */}
                <div
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    background: "rgba(19,19,19,0.85)",
                    backdropFilter: "blur(8px)",
                    boxShadow: "0 0 44px 0 rgba(0,0,0,0.80)",
                    borderRadius: 16,
                    padding: "16px 20px",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingBottom: 12,
                      marginBottom: 14,
                      borderBottom: "1px solid rgb(42,45,49)",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "rgb(255,255,255)",
                        margin: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Star size={13} /> Recommendations
                    </h2>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "4px 10px",
                        background: "rgb(26,26,26)",
                        border: "1px solid rgb(38,38,38)",
                        borderRadius: 10,
                        fontSize: 11,
                        color: "rgb(229,231,235)",
                      }}
                    >
                      7 days <ChevronDown size={10} />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: 10,
                    }}
                  >
                    {RECOMMENDATIONS.map((c) => (
                      <RecommCard key={c.ticker} card={c} />
                    ))}
                  </div>
                </div>

                {/* RIGHT: Action Plan */}
                <div
                  style={{
                    position: "relative",
                    background: "rgba(19,19,19,0.85)",
                    backdropFilter: "blur(8px)",
                    boxShadow: "0 0 44px 0 rgba(0,0,0,0.80)",
                    borderRadius: 16,
                    padding: "16px 20px",
                    border: "1px solid rgba(255,255,255,0.07)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingBottom: 12,
                      marginBottom: 14,
                      borderBottom: "1px solid rgb(42,45,49)",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "rgb(255,255,255)",
                        margin: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <ListChecks size={13} /> Action Plan
                    </h2>
                    <span
                      style={{
                        fontSize: 10,
                        color: "rgba(255,255,255,0.35)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      0/{ACTION_ITEMS.length} done
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div style={{ marginBottom: 14 }}>
                    <div
                      style={{
                        height: 3,
                        background: "rgba(255,255,255,0.06)",
                        borderRadius: 9999,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: 3,
                          background:
                            "linear-gradient(90deg, #34d399, #60a5fa)",
                          borderRadius: 9999,
                          width: `${interpolate(row1Spring, [0, 1], [0, 0])}%`,
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: 5,
                        fontSize: 9,
                        color: "rgba(255,255,255,0.25)",
                      }}
                    >
                      <span>Progress</span>
                      <span>0%</span>
                    </div>
                  </div>

                  {/* Action items */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      flex: 1,
                    }}
                  >
                    {ACTION_ITEMS.map((item, i) => (
                      <ActionRow key={i} item={item} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 2: Charts */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 20,
                  opacity: row2Op,
                  transform: `translateY(${row2Y}px)`,
                }}
              >
                <LineChartCard />
                <PieChartCard />
                <CandleChartCard />
                <AgentBarCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
