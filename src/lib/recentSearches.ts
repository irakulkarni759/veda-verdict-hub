// Lightweight client-side store for the "live searches" mosaic on the home page.
// Persists in localStorage and notifies listeners (same tab + cross-tab).

const KEY = "veda.recentSearches.v1";
const EVT = "veda:recent-searches";
const MAX = 18;

// A whimsical, hand-printed glyph pool — assigned at random per query so
// repeated submissions produce a varied, "block-print wall" mosaic.
const GLYPHS = [
  "✺", "❋", "◎", "❖", "△", "☾", "◍", "✦", "⟡", "✿", "❀", "☘",
  "✸", "✜", "◈", "✹", "❂", "❁", "◉", "✱", "❃", "⚘", "☀", "✷",
  "❉", "♆", "✤", "⚜",
];

const TINTS = [
  "#0f6e6a", // peacock
  "#b8442a", // terracotta
  "#1e3a6e", // indigo
  "#c98414", // marigold
  "#7a5a44", // ink-2
];

export interface RecentSearch {
  q: string;
  glyph: string;
  tint: string;
  at: number;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getRecentSearches(): RecentSearch[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function pushRecentSearch(q: string): void {
  if (typeof window === "undefined") return;
  const clean = q.trim();
  if (!clean) return;
  const current = getRecentSearches().filter(
    (r) => r.q.toLowerCase() !== clean.toLowerCase(),
  );
  const next: RecentSearch[] = [
    { q: clean, glyph: pick(GLYPHS), tint: pick(TINTS), at: Date.now() },
    ...current,
  ].slice(0, MAX);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(EVT));
  } catch {
    // ignore quota / privacy mode errors
  }
}

export function subscribeRecentSearches(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener(EVT, handler);
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) cb();
  });
  return () => {
    window.removeEventListener(EVT, handler);
    window.removeEventListener("storage", handler as EventListener);
  };
}

// A small seed so first-time visitors see a populated mosaic.
export const SEED_SEARCHES: RecentSearch[] = [
  { q: "creatine for muscle growth", glyph: "✦", tint: "#0f6e6a", at: 0 },
  { q: "rosemary oil for hair growth", glyph: "✿", tint: "#c98414", at: 0 },
  { q: "rice water for hair", glyph: "❋", tint: "#c98414", at: 0 },
  { q: "retinol for wrinkles", glyph: "◎", tint: "#0f6e6a", at: 0 },
  { q: "hair gummies for thickness", glyph: "✱", tint: "#b8442a", at: 0 },
  { q: "ashwagandha for stress", glyph: "❖", tint: "#0f6e6a", at: 0 },
  { q: "collagen for skin", glyph: "❀", tint: "#c98414", at: 0 },
  { q: "celery juice for detox", glyph: "△", tint: "#b8442a", at: 0 },
  { q: "magnesium for sleep", glyph: "☾", tint: "#1e3a6e", at: 0 },
  { q: "niacinamide for pores", glyph: "◍", tint: "#0f6e6a", at: 0 },
  { q: "apple cider vinegar for weight loss", glyph: "✸", tint: "#b8442a", at: 0 },
  { q: "castor oil for lashes", glyph: "✜", tint: "#c98414", at: 0 },
];
