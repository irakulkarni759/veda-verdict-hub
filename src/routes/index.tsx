import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import {
  addMark,
  getCounter,
  getMarks,
  subscribeMarks,
  SEED_MARKS,
  type Mark,
} from "@/lib/recentSearches";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Veda — Every wellness ritual, weighed against the evidence" },
      {
        name: "description",
        content:
          "Veda is a wellness evidence engine. Search any claim, ingredient, or ritual and see whether it's backed, mixed, or debunked.",
      },
    ],
  }),
  component: HomePage,
});

const CATEGORIES = [
  "SKINCARE",
  "HAIRCARE",
  "SUPPLEMENTS",
  "NUTRITION",
  "SLEEP",
  "GUT HEALTH",
  "FITNESS",
  "MENTAL WELLNESS",
];

const TRENDING = ["rosemary oil", "collagen peptides", "ashwagandha", "slugging"];

const VERDICT_DOT: Record<Mark["verdict"], string> = {
  backed: "#3D6045",
  mixed: "#B5861A",
  debunked: "#9B2A1A",
};

/* --------------- HOME --------------- */

function HomePage() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [marks, setMarks] = useState<Mark[]>([]);
  const [freshQ, setFreshQ] = useState<string | null>(null);
  const [counter, setCounter] = useState(0);
  const [arching, setArching] = useState(false);

  // Load marks + counter (client only)
  useEffect(() => {
    const sync = (fresh?: string) => {
      const stored = getMarks();
      const seen = new Set(stored.map((m) => m.q.toLowerCase()));
      const merged: Mark[] = [
        ...stored,
        ...SEED_MARKS.filter((s) => !seen.has(s.q.toLowerCase())),
      ];
      // mark the freshly-added one so it animates
      if (fresh) {
        const i = merged.findIndex((m) => m.q.toLowerCase() === fresh.toLowerCase());
        if (i >= 0) merged[i] = { ...merged[i], fresh: true };
      }
      setMarks(merged);
      setCounter(getCounter());
      if (fresh) {
        setFreshQ(fresh);
        setTimeout(() => setFreshQ(null), 900);
      }
    };
    sync();
    return subscribeMarks(sync);
  }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    setArching(true);
    setTimeout(() => setArching(false), 900);
    addMark(query);
    setQ("");
    // soft delay so the arch "reads" before navigating
    setTimeout(() => navigate({ to: "/search", search: { q: query } }), 650);
  };

  return (
    <div className="min-h-screen" style={{ background: "#F4EDE0", color: "#1B3448" }}>
      <Nav />

      {/* ============ HERO ============ */}
      <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-24 pt-10">
        <CornerBotanical side="left" />
        <CornerBotanical side="right" />

        <h1
          className="relative z-10 text-center font-display italic font-light leading-[1.02] tracking-tight animate-veda-fade"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontStyle: "italic",
            fontSize: "clamp(52px, 9vw, 84px)",
            animationDelay: "1.6s",
            opacity: 0,
            color: "#1B3448",
          }}
        >
          Is it actually
          <br />
          <span style={{ color: "#B84040" }}>worth it?</span>
        </h1>

        <p
          className="relative z-10 mt-4 text-center animate-veda-fade"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: 13,
            color: "#8A7060",
            animationDelay: "1.7s",
            opacity: 0,
            letterSpacing: "0.02em",
          }}
        >
          Every wellness ritual, weighed against the evidence.
        </p>

        {/* Arch + search */}
        <div className="relative z-10 mt-10 w-full max-w-[720px] animate-veda-fade" style={{ animationDelay: "1.9s", opacity: 0 }}>
          <ArchFrame highlight={arching} />
          <form
            onSubmit={onSubmit}
            className="absolute left-1/2 bottom-6 flex w-[88%] -translate-x-1/2 items-center gap-2 px-4 py-3 sm:gap-3 sm:px-5 sm:py-3.5"
            style={{ background: "#EBE3D2" }}
          >
            <Search className="h-4 w-4 shrink-0" style={{ color: "#1B3448", opacity: 0.7 }} aria-hidden />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="try 'rosemary oil for hair' or 'magnesium for sleep'…"
              className="w-full min-w-0 bg-transparent outline-none placeholder:opacity-60"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 300,
                fontSize: 14,
                color: "#1B3448",
              }}
              aria-label="Search a wellness claim"
            />
            <button
              type="submit"
              className="shrink-0 px-3 py-2 transition-transform hover:translate-x-0.5 sm:px-4"
              style={{
                background: "#1B3448",
                color: "#F4EDE0",
                fontFamily: "'Space Mono', monospace",
                fontSize: 10,
                letterSpacing: "0.18em",
              }}
            >
              LOOK IT UP →
            </button>
          </form>
        </div>

        {/* Trending row */}
        <div
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 px-4 text-center animate-veda-fade"
          style={{ animationDelay: "2.1s", opacity: 0 }}
        >
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.22em",
              color: "#B84040",
            }}
          >
            TRYING NOW
          </span>
          {TRENDING.map((t, i) => (
            <span key={t} className="flex items-center gap-3">
              {i > 0 && <span style={{ color: "#8A7060" }}>·</span>}
              <button
                onClick={() => {
                  setQ(t);
                  setArching(true);
                  setTimeout(() => setArching(false), 900);
                  addMark(t);
                  setTimeout(() => navigate({ to: "/search", search: { q: t } }), 650);
                }}
                className="underline-offset-4 transition-opacity hover:underline hover:opacity-100"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400,
                  fontSize: 13,
                  color: "#1B3448",
                  opacity: 0.85,
                }}
              >
                {t}
              </button>
            </span>
          ))}
        </div>

        {/* Live counter */}
        <div
          className="relative z-10 mt-10 text-center animate-veda-fade"
          style={{ animationDelay: "2.3s", opacity: 0 }}
        >
          <CountUp value={counter} freshKey={freshQ ?? ""} />{" "}
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: 22,
              color: "#1B3448",
            }}
          >
            trends verified
          </span>
        </div>
      </section>

      {/* ===== wavy divider → blush ===== */}
      <Wave from="#F4EDE0" to="#E5C4BA" />

      {/* ============ STATS ============ */}
      <Stats />

      {/* ===== wavy divider → ivory ===== */}
      <Wave from="#E5C4BA" to="#F4EDE0" />

      {/* ============ MARK WALL ============ */}
      <MarkWall marks={marks} freshQ={freshQ} />
    </div>
  );
}

/* --------------- NAV --------------- */

function Nav() {
  return (
    <nav
      className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 sm:px-10"
      style={{ background: "#F4EDE0" }}
    >
      <a href="/" className="flex items-baseline gap-2">
        <span aria-hidden style={{ color: "#B84040", fontSize: 12 }}>◆</span>
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: 15,
            color: "#1B3448",
            letterSpacing: "0.02em",
          }}
        >
          veda
        </span>
        <span
          aria-hidden
          style={{
            fontFamily: "'Tiro Devanagari Hindi', serif",
            fontSize: 13,
            color: "#8A7060",
          }}
        >
          वेद
        </span>
      </a>

      <div className="hidden items-center gap-2 md:flex">
        {CATEGORIES.map((c, i) => (
          <span key={c} className="flex items-center gap-2">
            {i > 0 && <span style={{ color: "#8A7060", fontSize: 8 }}>·</span>}
            <a
              href={`#${c.toLowerCase().replace(/\s+/g, "-")}`}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 8,
                letterSpacing: "0.24em",
                color: "#1B3448",
                opacity: 0.85,
              }}
              className="transition-opacity hover:opacity-100"
            >
              {c}
            </a>
          </span>
        ))}
      </div>
    </nav>
  );
}

/* --------------- CORNER BOTANICAL --------------- */

function CornerBotanical({ side }: { side: "left" | "right" }) {
  const flip = side === "right";
  return (
    <svg
      aria-hidden
      viewBox="0 0 220 360"
      className="pointer-events-none absolute top-0 h-[58vh] max-h-[520px] w-auto select-none"
      style={{
        [side]: 0,
        transform: flip ? "scaleX(-1)" : undefined,
      }}
    >
      <defs>
        <style>{`
          @keyframes vedaSway {
            0%,100% { transform: rotate(0deg); }
            50% { transform: rotate(1.2deg); }
          }
          .sway { transform-origin: 20px 40px; animation: vedaSway 6s ease-in-out infinite; }
          .sway2 { transform-origin: 40px 150px; animation: vedaSway 7.5s ease-in-out infinite; }
          .bloom { opacity: 0; animation: vedaBloom 600ms cubic-bezier(.2,.7,.2,1) forwards; }
          @keyframes vedaBloom { from { opacity: 0; transform: scale(0.2); } to { opacity: 1; transform: scale(1); } }
        `}</style>
      </defs>

      {/* main descending stem */}
      <path
        d="M 40 -10 C 50 60, 20 110, 60 160 S 30 240, 70 320"
        fill="none"
        stroke="#2A1A10"
        strokeWidth="1.4"
        strokeLinecap="round"
        className="veda-draw"
        style={{ ['--len' as any]: 600, animationDelay: "0.1s" }}
      />
      {/* small branch 1 */}
      <g className="sway">
        <path
          d="M 50 70 C 80 60, 110 80, 140 70"
          fill="none"
          stroke="#2A1A10"
          strokeWidth="1.2"
          strokeLinecap="round"
          className="veda-draw"
          style={{ ['--len' as any]: 200, animationDelay: "0.8s" }}
        />
        <Leaf cx={88} cy={64} rot={-20} delay={1.2} />
        <Leaf cx={120} cy={76} rot={15} delay={1.4} />
        <Lotus cx={142} cy={70} delay={1.6} />
      </g>

      {/* small branch 2 */}
      <g className="sway2">
        <path
          d="M 62 175 C 90 170, 120 195, 150 180"
          fill="none"
          stroke="#2A1A10"
          strokeWidth="1.2"
          strokeLinecap="round"
          className="veda-draw"
          style={{ ['--len' as any]: 220, animationDelay: "1.1s" }}
        />
        <Leaf cx={94} cy={168} rot={-10} delay={1.6} />
        <Leaf cx={126} cy={188} rot={22} delay={1.8} />
        <Lotus cx={152} cy={180} delay={2.0} small />
      </g>

      {/* small branch 3 lower */}
      <g>
        <path
          d="M 56 270 C 78 268, 100 286, 120 278"
          fill="none"
          stroke="#2A1A10"
          strokeWidth="1.1"
          strokeLinecap="round"
          className="veda-draw"
          style={{ ['--len' as any]: 160, animationDelay: "1.3s" }}
        />
        <Leaf cx={88} cy={272} rot={-8} delay={1.9} />
        <Lotus cx={122} cy={278} delay={2.1} small />
      </g>
    </svg>
  );
}

function Leaf({ cx, cy, rot = 0, delay = 0 }: { cx: number; cy: number; rot?: number; delay?: number }) {
  return (
    <g
      className="bloom"
      style={{ transformOrigin: `${cx}px ${cy}px`, transform: `rotate(${rot}deg)`, animationDelay: `${delay}s` }}
    >
      <ellipse cx={cx} cy={cy} rx={11} ry={5} fill="#5B7B5E" />
      <path d={`M ${cx - 10} ${cy} Q ${cx} ${cy - 1} ${cx + 10} ${cy}`} stroke="#2A1A10" strokeWidth="0.6" fill="none" opacity="0.5" />
    </g>
  );
}

function Lotus({ cx, cy, delay = 0, small = false }: { cx: number; cy: number; delay?: number; small?: boolean }) {
  const r = small ? 5 : 6.5;
  const petals = 6;
  return (
    <g className="bloom" style={{ transformOrigin: `${cx}px ${cy}px`, animationDelay: `${delay}s` }}>
      {Array.from({ length: petals }).map((_, i) => {
        const a = (i / petals) * Math.PI * 2;
        const px = cx + Math.cos(a) * r;
        const py = cy + Math.sin(a) * r;
        return <ellipse key={i} cx={px} cy={py} rx={r * 0.72} ry={r * 0.42} fill="#B84040" transform={`rotate(${(a * 180) / Math.PI} ${px} ${py})`} />;
      })}
      <circle cx={cx} cy={cy} r={r * 0.55} fill="#F4EDE0" />
      <circle cx={cx} cy={cy} r={r * 0.22} fill="#B84040" opacity="0.5" />
    </g>
  );
}

/* --------------- ARCH --------------- */

function ArchFrame({ highlight }: { highlight: boolean }) {
  // Mughal arch: pointed top, slight side curves, base.
  // Coordinates: 720 wide × 220 tall
  const outer =
    "M 40 220 L 40 130 C 40 90, 80 60, 360 30 C 640 60, 680 90, 680 130 L 680 220";
  const inner =
    "M 56 220 L 56 134 C 56 96, 92 70, 360 44 C 628 70, 664 96, 664 134 L 664 220";
  const dots = [
    [120, 80], [200, 56], [290, 40], [360, 34], [430, 40], [520, 56], [600, 80],
  ];

  return (
    <svg viewBox="0 0 720 240" className="block w-full" aria-hidden>
      {/* base line under search */}
      <line x1="40" y1="220" x2="680" y2="220" stroke="#1B3448" strokeWidth="1" opacity="0.35" />
      {/* outer arch */}
      <path
        d={outer}
        fill="none"
        stroke="#1B3448"
        strokeWidth="1.6"
        strokeLinecap="round"
        className="veda-draw"
        style={{ ['--len' as any]: 1500, animationDelay: "1s", opacity: highlight ? 1 : 0.85 }}
      />
      {/* inner arch (depth) */}
      <path
        d={inner}
        fill="none"
        stroke="#1B3448"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.45"
        className="veda-draw"
        style={{ ['--len' as any]: 1500, animationDelay: "1.2s" }}
      />
      {/* decorative dots */}
      {dots.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={highlight ? 3 : 2.2}
          fill="#B84040"
          opacity="0"
          style={{
            animation: `vedaDot 400ms ease-out forwards`,
            animationDelay: `${1.6 + i * 0.06}s`,
          }}
        />
      ))}
      {/* finial lotus at peak */}
      <g style={{ opacity: 0, animation: "vedaBloomKey 600ms ease-out 2.4s forwards", transformOrigin: "360px 18px" }}>
        <line x1="360" y1="34" x2="360" y2="22" stroke="#1B3448" strokeWidth="1" />
        <Lotus cx={360} cy={18} small />
      </g>

      <style>{`
        @keyframes vedaDot { from { opacity: 0; transform: scale(0.4); } to { opacity: 0.9; transform: scale(1); } }
        @keyframes vedaBloomKey { from { opacity: 0; transform: scale(0.4); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </svg>
  );
}

/* --------------- COUNT UP --------------- */

function CountUp({ value, freshKey }: { value: number; freshKey: string }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const from = prev.current;
    const to = value;
    if (from === to) return;
    const start = performance.now();
    const dur = 700;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / dur);
      // overshoot easing
      const e = k < 1 ? 1 - Math.pow(1 - k, 3) : 1;
      const v = Math.round(from + (to - from) * e);
      setDisplay(v);
      if (k < 1) raf = requestAnimationFrame(tick);
      else prev.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, freshKey]);

  return (
    <span
      style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontStyle: "italic",
        fontWeight: 300,
        fontSize: 30,
        color: "#1B3448",
      }}
    >
      {display.toLocaleString()}
    </span>
  );
}

/* --------------- STATS --------------- */

function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setVisible(true)),
      { threshold: 0.3 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} style={{ background: "#E5C4BA" }} className="px-6 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-3" style={{}}>
        <Stat
          big={
            <Animated target={9000000} visible={visible} prefix="$" format="comma" size={56} />
          }
          label="lost every day to misinformation-driven wellness purchases"
          divider={false}
        />
        <Stat
          big={<Animated target={55} visible={visible} suffix="%" size={84} />}
          label="of people who bought based on social content felt cheated afterward"
        />
        <Stat
          big={<OneInTwo visible={visible} />}
          label="Americans have bought a health product directly from a social media ad"
        />
      </div>
    </section>
  );
}

function Stat({ big, label, divider = true }: { big: React.ReactNode; label: string; divider?: boolean }) {
  return (
    <div
      className="relative flex flex-col items-center px-6 py-6 text-center md:px-10"
      style={divider ? { borderLeft: "0.5px solid rgba(27,52,72,0.20)" } : undefined}
    >
      <div className="min-h-[90px] leading-none">{big}</div>
      <p
        className="mt-5 max-w-[260px]"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 300,
          fontSize: 13,
          lineHeight: 1.5,
          color: "#1B3448",
          opacity: 0.85,
        }}
      >
        {label}
      </p>
    </div>
  );
}

function Animated({
  target,
  visible,
  prefix = "",
  suffix = "",
  format,
  size = 84,
}: {
  target: number;
  visible: boolean;
  prefix?: string;
  suffix?: string;
  format?: "comma";
  size?: number;
}) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const start = performance.now();
    const dur = 1600;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / dur);
      // ease-out cubic with slight overshoot
      const ease = 1 - Math.pow(1 - k, 3);
      const overshoot = k < 1 ? Math.sin(k * Math.PI) * 0.03 : 0;
      const v = Math.round(target * (ease + overshoot));
      setN(Math.min(target * 1.03, v));
      if (k < 1) raf = requestAnimationFrame(tick);
      else setN(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, target]);
  const text = format === "comma" ? n.toLocaleString() : String(n);
  return (
    <span
      style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontStyle: "italic",
        fontWeight: 300,
        fontSize: size,
        color: "#1B3448",
        letterSpacing: "-0.01em",
      }}
    >
      {prefix}
      {text}
      {suffix}
    </span>
  );
}

function OneInTwo({ visible }: { visible: boolean }) {
  return (
    <span
      className="animate-veda-fade"
      style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontStyle: "italic",
        fontWeight: 300,
        fontSize: 84,
        color: "#1B3448",
        opacity: visible ? 1 : 0,
        transition: "opacity 900ms ease 600ms",
      }}
    >
      1 in 2
    </span>
  );
}

/* --------------- WAVE --------------- */

function Wave({ from, to }: { from: string; to: string }) {
  return (
    <div style={{ background: from, lineHeight: 0 }}>
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="block h-12 w-full sm:h-16">
        <path
          d="M 0 40 C 200 10, 400 70, 720 40 S 1240 10, 1440 40 L 1440 80 L 0 80 Z"
          fill={to}
        />
      </svg>
    </div>
  );
}

/* --------------- MARK WALL --------------- */

function MarkWall({ marks, freshQ }: { marks: Mark[]; freshQ: string | null }) {
  return (
    <section style={{ background: "#F4EDE0" }} className="px-4 py-20 sm:px-8 sm:py-28">
      <div
        className="mx-auto flex max-w-6xl flex-wrap justify-center"
        style={{ gap: "10px 10px" }}
      >
        {marks.map((m, i) => {
          const isFresh = freshQ && m.q.toLowerCase() === freshQ.toLowerCase();
          return (
            <div
              key={`${m.q}-${i}`}
              style={{
                transform: `rotate(${m.rot}deg) translate(${m.dx}px, ${m.dy}px)`,
                background: "#F7F1E5",
                border: "1px solid rgba(27,52,72,0.25)",
                borderRadius: "3px 6px 4px 7px",
                width: 92,
                padding: "8px 10px",
                position: "relative",
                boxShadow: "1px 1px 0 rgba(27,52,72,0.05)",
                animation: isFresh ? "vedaPin 700ms cubic-bezier(.2,.7,.2,1) both" : undefined,
              }}
              title={m.q}
            >
              <span
                style={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: VERDICT_DOT[m.verdict],
                }}
                aria-hidden
              />
              <span
                style={{
                  display: "block",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 300,
                  fontSize: 10,
                  lineHeight: 1.25,
                  color: "#1B3448",
                  paddingRight: 8,
                  wordBreak: "break-word",
                }}
              >
                {m.q}
              </span>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes vedaPin {
          0%   { opacity: 0; transform: translateY(-18px) rotate(0deg) scale(0.9); }
          60%  { opacity: 1; transform: translateY(2px) rotate(var(--rot,0deg)) scale(1.03); }
          100% { opacity: 1; transform: translate(0,0) rotate(var(--rot,0deg)) scale(1); }
        }
      `}</style>
    </section>
  );
}
