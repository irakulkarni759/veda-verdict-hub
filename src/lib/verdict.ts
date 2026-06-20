import type { Verdict } from "@/data/trends";

export const VERDICT_META: Record<
  Verdict,
  { label: string; color: string; glowClass: string; dotClass: string; badgeClass: string }
> = {
  backed: {
    label: "Evidence-Backed",
    color: "#54e0a8",
    glowClass: "verdict-glow-backed",
    dotClass: "bg-[#54e0a8]",
    badgeClass:
      "bg-[#54e0a8]/12 text-[#54e0a8] border border-[#54e0a8]/40 shadow-[0_0_24px_-6px_rgba(84,224,168,0.55)]",
  },
  mixed: {
    label: "Mixed / Emerging",
    color: "#f0b04a",
    glowClass: "verdict-glow-mixed",
    dotClass: "bg-[#f0b04a]",
    badgeClass:
      "bg-[#f0b04a]/12 text-[#f0b04a] border border-[#f0b04a]/40 shadow-[0_0_24px_-6px_rgba(240,176,74,0.5)]",
  },
  debunked: {
    label: "Debunked",
    color: "#ef6a4d",
    glowClass: "verdict-glow-debunked",
    dotClass: "bg-[#ef6a4d]",
    badgeClass:
      "bg-[#ef6a4d]/12 text-[#ef6a4d] border border-[#ef6a4d]/40 shadow-[0_0_24px_-6px_rgba(239,106,77,0.55)]",
  },
  unmapped: {
    label: "Unmapped",
    color: "#8fc0ff",
    glowClass: "verdict-glow-unmapped",
    dotClass: "bg-[#8fc0ff]",
    badgeClass:
      "bg-[#8fc0ff]/12 text-[#8fc0ff] border border-[#8fc0ff]/40 shadow-[0_0_24px_-6px_rgba(143,192,255,0.5)]",
  },
};

export const VERDICT_FILTERS: { value: "all" | Verdict; label: string }[] = [
  { value: "all", label: "All" },
  { value: "backed", label: "Backed" },
  { value: "mixed", label: "Mixed" },
  { value: "debunked", label: "Debunked" },
  { value: "unmapped", label: "Unmapped" },
];
